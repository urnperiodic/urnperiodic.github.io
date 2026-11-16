import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { OperationType, handleFirestoreError, isFirestorePermissionError } from '../firebase';

const SYSTEM_CRYPTO_SECRET = 'PortalChat_E2E_AlwaysEncrypted_2026';
const cryptoKeyCache = new Map();

function hexToBuf(hex) {
  const bytes = new Uint8Array(Math.ceil(hex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

export async function getChannelCryptoKey(channelId) {
  if (cryptoKeyCache.has(channelId)) return cryptoKeyCache.get(channelId);
  try {
    const enc = new TextEncoder();
    const rawSecret = enc.encode(`${SYSTEM_CRYPTO_SECRET}_${channelId || 'global'}`);
    const keyMaterial = await crypto.subtle.importKey('raw', rawSecret, { name: 'PBKDF2' }, false, ['deriveKey']);
    const derivedKey = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: enc.encode(`salt_${channelId}`), iterations: 1000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    cryptoKeyCache.set(channelId, derivedKey);
    return derivedKey;
  } catch {
    return null;
  }
}

export async function decryptChatPayload(cipherText, channelId) {
  if (typeof cipherText !== 'string' || !cipherText.startsWith('ENC:v1:')) {
    return { text: cipherText || '', encrypted: false };
  }
  try {
    const parts = cipherText.split(':');
    if (parts.length !== 4) return { text: cipherText, encrypted: false };
    const iv = hexToBuf(parts[2]);
    const encryptedData = hexToBuf(parts[3]);
    const key = await getChannelCryptoKey(channelId);
    if (!key) return { text: cipherText, encrypted: false };
    const decryptedBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encryptedData);
    return { text: new TextDecoder().decode(decryptedBuf), encrypted: true };
  } catch {
    return { text: '[Encrypted Message]', encrypted: true };
  }
}

function broadcastLobbyEvent(payload) {
  try {
    const bus = new BroadcastChannel('urnperiodic_lobby_bus');
    bus.postMessage(payload);
    setTimeout(() => {
      try {
        bus.close();
      } catch {}
    }, 400);
  } catch {}
}

export async function deleteSingleChatMessage(db, channelId, messageId) {
  if (!db || !channelId || !messageId) return false;
  const rootCol = String(channelId).startsWith('dm__') ? 'directMessages' : 'channels';
  const path = `${rootCol}/${channelId}/messages/${messageId}`;
  try {
    await deleteDoc(doc(db, rootCol, channelId, 'messages', String(messageId)));
  } catch (err) {
    if (isFirestorePermissionError(err)) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
    throw err;
  }

  try {
    const raw = localStorage.getItem(`local_messages_${channelId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const filtered = parsed.filter((m) => String(m.id || m.key) !== String(messageId));
        localStorage.setItem(`local_messages_${channelId}`, JSON.stringify(filtered));
      }
    }
  } catch {}

  broadcastLobbyEvent({ type: 'admin-delete-message', channelId, messageId: String(messageId) });
  return true;
}

export async function clearChannelMessages(db, channelId) {
  if (!db || !channelId) return 0;
  const rootCol = String(channelId).startsWith('dm__') ? 'directMessages' : 'channels';
  const listPath = `${rootCol}/${channelId}/messages`;
  let deleted = 0;

  let msgSnap;
  try {
    msgSnap = await getDocs(collection(db, rootCol, channelId, 'messages'));
  } catch (err) {
    if (isFirestorePermissionError(err)) {
      handleFirestoreError(err, OperationType.LIST, listPath);
    }
    throw err;
  }

  const tasks = [];
  msgSnap.forEach((docSnap) => {
    const docPath = `${listPath}/${docSnap.id}`;
    tasks.push(
      deleteDoc(doc(db, rootCol, channelId, 'messages', docSnap.id))
        .then(() => {
          deleted += 1;
        })
        .catch((delErr) => {
          if (isFirestorePermissionError(delErr)) {
            handleFirestoreError(delErr, OperationType.DELETE, docPath);
          }
          throw delErr;
        })
    );
  });
  await Promise.all(tasks);

  try {
    localStorage.removeItem(`local_messages_${channelId}`);
  } catch {}

  broadcastLobbyEvent({ type: 'admin-clear-channel', channelId });
  return deleted;
}

export async function deleteCustomChannel(db, channelId) {
  if (!db || !channelId || channelId === 'general' || channelId === 'temporary') {
    throw new Error('Default channels cannot be deleted.');
  }

  await clearChannelMessages(db, channelId);

  const chanPath = `channels/${channelId}`;
  try {
    await deleteDoc(doc(db, 'channels', channelId));
  } catch (err) {
    if (isFirestorePermissionError(err)) {
      handleFirestoreError(err, OperationType.DELETE, chanPath);
    }
    throw err;
  }

  try {
    const rawChannels = localStorage.getItem('local_custom_channels');
    if (rawChannels) {
      const parsed = JSON.parse(rawChannels);
      if (Array.isArray(parsed)) {
        localStorage.setItem(
          'local_custom_channels',
          JSON.stringify(parsed.filter((c) => c?.id !== channelId))
        );
      }
    }
    const rawUnlocked = localStorage.getItem('unlocked_chat_channels');
    if (rawUnlocked) {
      const parsedUnlocked = JSON.parse(rawUnlocked);
      if (parsedUnlocked && typeof parsedUnlocked === 'object') {
        delete parsedUnlocked[channelId];
        localStorage.setItem('unlocked_chat_channels', JSON.stringify(parsedUnlocked));
      }
    }
  } catch {}

  broadcastLobbyEvent({ type: 'admin-delete-channel', channelId });
  return true;
}

export async function deleteAllChatMessages(db, extraChannelIds = []) {
  if (!db) return 0;
  const channelIds = new Set(['general', 'temporary', ...extraChannelIds.filter(Boolean)]);

  try {
    const chSnap = await getDocs(collection(db, 'channels'));
    chSnap.forEach((d) => channelIds.add(d.id));
  } catch (err) {
    if (isFirestorePermissionError(err)) {
      handleFirestoreError(err, OperationType.LIST, 'channels');
    }
  }

  let deletedCount = 0;
  for (const chId of channelIds) {
    const count = await clearChannelMessages(db, chId);
    deletedCount += count;
  }

  try {
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith('local_messages_')) localStorage.removeItem(k);
    });
    localStorage.setItem('my_sent_message_ids', JSON.stringify([]));
  } catch {}

  broadcastLobbyEvent({ type: 'admin-delete-all-messages' });

  try {
    const chatIframe = /** @type {HTMLIFrameElement | null} */ (document.getElementById('chat-decoy-iframe'));
    if (chatIframe && chatIframe.contentWindow) {
      chatIframe.contentWindow.postMessage({ type: 'admin-delete-all-messages' }, '*');
    }
  } catch {}

  return deletedCount;
}

export async function purgeUserChatMessages(db, usernameLower, displayUsername = '') {
  if (!db || (!usernameLower && !displayUsername)) return 0;
  const targetLower = String(usernameLower || displayUsername).trim().toLowerCase();
  const channelIds = new Set(['general', 'temporary']);

  try {
    const chSnap = await getDocs(collection(db, 'channels'));
    chSnap.forEach((d) => channelIds.add(d.id));
  } catch (err) {
    if (isFirestorePermissionError(err)) {
      handleFirestoreError(err, OperationType.LIST, 'channels');
    }
  }

  let deletedCount = 0;
  for (const chId of channelIds) {
    const listPath = `channels/${chId}/messages`;
    try {
      const msgSnap = await getDocs(collection(db, 'channels', chId, 'messages'));
      const tasks = [];
      msgSnap.forEach((docSnap) => {
        const d = docSnap.data();
        const matchesAccount = d?.accountId && String(d.accountId).toLowerCase() === targetLower;
        const matchesName = d?.name && String(d.name).trim().toLowerCase() === targetLower;
        if (matchesAccount || matchesName) {
          tasks.push(
            deleteDoc(doc(db, 'channels', chId, 'messages', docSnap.id))
              .then(() => {
                deletedCount += 1;
              })
              .catch((delErr) => {
                if (isFirestorePermissionError(delErr)) {
                  handleFirestoreError(delErr, OperationType.DELETE, `${listPath}/${docSnap.id}`);
                }
                throw delErr;
              })
          );
        }
      });
      await Promise.all(tasks);
    } catch (err) {
      if (isFirestorePermissionError(err)) {
        handleFirestoreError(err, OperationType.LIST, listPath);
      }
      throw err;
    }

    try {
      const raw = localStorage.getItem(`local_messages_${chId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((m) => {
            const matchesAcc = m?.accountId && String(m.accountId).toLowerCase() === targetLower;
            const matchesName = m?.name && String(m.name).trim().toLowerCase() === targetLower;
            return !matchesAcc && !matchesName;
          });
          localStorage.setItem(`local_messages_${chId}`, JSON.stringify(filtered));
        }
      }
    } catch {}
  }

  broadcastLobbyEvent({ type: 'admin-purge-user', usernameLower: targetLower });
  return deletedCount;
}
