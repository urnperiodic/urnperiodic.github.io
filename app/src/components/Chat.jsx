import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { signInAnonymously } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  BadgeCheck,
  Ban,
  Check,
  ChevronDown,
  ChevronLeft,
  Clock,
  Copy,
  Hash,
  Info,
  Key,
  Link as LinkIcon,
  Lock,
  Megaphone,
  MessageCircle,
  MessageSquare,
  Palette,
  PanelLeft,
  Plus,
  Reply,
  Search,
  Send,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Unlock,
  UserPlus,
  Users,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  OperationType,
  handleFirestoreError,
  isFirestorePermissionError,
  lobbyAuth,
  lobbyDb,
} from '../firebase';
import { clearAdminBroadcast, isAccountOnline, sendAdminBroadcast } from '../utils/accountService';
import {
  clearChannelMessages,
  deleteAllChatMessages,
  deleteCustomChannel,
  deleteDmThreadAndTraces,
  deleteSingleChatMessage,
} from '../utils/chatModeration';
import {
  USER_MUTE_HOURS_OPTIONS,
  buildMuteTargetKey,
  findMuteForTarget,
  formatMuteRemaining,
  getActiveMutedUsers,
  isSenderMuted,
  muteUserForHours,
  subscribeUserMutes,
  unmuteUserByKey,
} from '../utils/userMute';

const DEFAULT_CHANNELS = [
  {
    id: 'general',
    name: 'general',
    description: 'Default section — messages are permanently saved (no 1-hour deletion)',
    isPermanent: true,
  },
  {
    id: 'temporary',
    name: '1h-ephemeral',
    description: 'Temporary public room (messages auto-delete after 1 hour)',
    isPermanent: false,
  },
];

const ROOM_TTL_MS = 60 * 60 * 1000;
const MESSAGE_TTL_MS = 60 * 60 * 1000;
const DISALLOWED_ROOM_NAMES = ['gaming-hub', 'cinema-club', 'memes', 'gaming', 'cinema'];
const MAX_PASTED_IMAGE_BYTES = 180 * 1024;
const SYSTEM_CRYPTO_SECRET = 'PortalChat_E2E_AlwaysEncrypted_2026';
const LINKED_ACCOUNT_STORAGE_KEY = 'urnperiodic_chat_account';

const THEMES = {
  mono: { label: 'Black & White', swatch: ['#000000', '#1c1c1c'], accent: '#ffffff' },
  midnight: { label: 'Midnight', swatch: ['#111625', '#1B2336'], accent: '#00e5b0' },
  slate: { label: 'Slate', swatch: ['#1C212E', '#252C3B'], accent: '#93a4bd' },
  ocean: { label: 'Ocean', swatch: ['#0E273B', '#143B59'], accent: '#4fb0e6' },
  emerald: { label: 'Emerald', swatch: ['#0C2B1B', '#154C2D'], accent: '#3ddc84' },
  sunset: { label: 'Sunset', swatch: ['#331F16', '#6E351C'], accent: '#ff8a4c' },
  lavender: { label: 'Lavender', swatch: ['#241C3B', '#493975'], accent: '#a78bfa' },
  light: { label: 'Light', swatch: ['#eaf0f6', '#ffffff'], accent: '#2563eb' },
  amoled: { label: 'AMOLED', swatch: ['#080808', '#000000'], accent: '#00e5b0' },
};
const THEME_ORDER = ['mono', 'midnight', 'slate', 'ocean', 'emerald', 'sunset', 'lavender', 'light', 'amoled'];

const BADGE_STYLE_MAP = {
  cyan: { bg: 'rgba(6,182,212,0.16)', border: 'rgba(6,182,212,0.45)', text: '#67e8f9' },
  amber: { bg: 'rgba(245,158,11,0.16)', border: 'rgba(245,158,11,0.45)', text: '#fcd34d' },
  emerald: { bg: 'rgba(16,185,129,0.16)', border: 'rgba(16,185,129,0.45)', text: '#6ee7b7' },
  rose: { bg: 'rgba(244,63,94,0.16)', border: 'rgba(244,63,94,0.45)', text: '#fda4af' },
  violet: { bg: 'rgba(139,92,246,0.16)', border: 'rgba(139,92,246,0.45)', text: '#c4b5fd' },
  neutral: { bg: 'rgba(255,255,255,0.10)', border: 'rgba(255,255,255,0.24)', text: '#e5e5e5' },
};

const cryptoKeyCache = new Map();

function safeParse(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function getStoredTempNickname() {
  try {
    let name = (localStorage.getItem('chat_name') || '').trim();
    if (
      name &&
      (name.toLowerCase().startsWith('user') ||
        name.toLowerCase().startsWith('guest') ||
        name === 'anonymous')
    ) {
      name = '';
      localStorage.removeItem('chat_name');
    }
    return name;
  } catch {
    return '';
  }
}

function normalizeLinkedAccount(account) {
  if (!account || !account.username || account.isActive === false) return null;
  return {
    username: String(account.username),
    usernameLower: String(account.usernameLower || account.username).toLowerCase(),
    isActive: account.isActive !== false,
    isAdmin: Boolean(account.isAdmin),
    lobbyChatAccess: account.lobbyChatAccess !== false,
    roleBadge: String(account.roleBadge || '').trim(),
    badgeColor: String(account.badgeColor || 'cyan'),
    chatMuted: Boolean(account.chatMuted),
    chatBanned: Boolean(account.chatBanned),
  };
}

function filterValidRooms(channelList, now = Date.now()) {
  return (channelList || []).filter((c) => {
    if (!c || !c.name) return false;
    if (DISALLOWED_ROOM_NAMES.includes(String(c.name).toLowerCase())) return false;
    if (c.createdAt && now - c.createdAt >= ROOM_TTL_MS) return false;
    return true;
  });
}

function getDmParticipants(userA, userB) {
  const a = String(userA || '').trim().toLowerCase();
  const b = String(userB || '').trim().toLowerCase();
  if (!a || !b || a === b) return null;
  return [a, b].sort();
}

function getDmId(userA, userB) {
  const pair = getDmParticipants(userA, userB);
  return pair ? `dm__${pair[0]}__${pair[1]}` : null;
}

function parseDmPartnerFromId(dmId, myId) {
  if (typeof dmId !== 'string' || !dmId.startsWith('dm__') || !myId) return null;
  const me = String(myId).trim().toLowerCase();
  const prefix = `dm__${me}__`;
  if (dmId.startsWith(prefix)) {
    return dmId.slice(prefix.length) || null;
  }
  const suffix = `__${me}`;
  if (dmId.endsWith(suffix) && dmId.length > 4 + suffix.length) {
    return dmId.slice(4, dmId.length - suffix.length) || null;
  }
  return null;
}

function getClientId() {
  try {
    let cid = localStorage.getItem('chat_client_id');
    if (!cid) {
      cid = 'c_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('chat_client_id', cid);
    }
    return cid;
  } catch {
    return 'c_session_' + Math.random().toString(36).substring(2, 10);
  }
}

function getMySentMessageIds() {
  return safeParse('my_sent_message_ids', []);
}

function recordMySentMessage(msgIdOrKey) {
  if (!msgIdOrKey) return;
  try {
    const list = getMySentMessageIds();
    const strId = String(msgIdOrKey);
    if (!list.includes(strId)) {
      list.push(strId);
      localStorage.setItem('my_sent_message_ids', JSON.stringify(list.slice(-500)));
    }
  } catch {}
}

function getLocalMessages(channelId) {
  return safeParse(`local_messages_${channelId}`, []);
}

function getUsernameHue(name) {
  let h = 0;
  const n = name || 'anonymous';
  for (let i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) & 0xffff;
  return [160, 180, 200, 260, 290, 320, 340][h % 7];
}

function formatDateLabel(ts) {
  const d = new Date(ts);
  const t = new Date();
  if (d.toDateString() === t.toDateString()) return 'Today';
  const y = new Date(t);
  y.setDate(t.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function safeChatImageUrl(url) {
  return typeof url === 'string' && /^data:image\/(?:png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i.test(url)
    ? url
    : '';
}

function getReplyInfo(m) {
  if (m.replyTo && m.replyTo.name) {
    return {
      replyToName: m.replyTo.name,
      replyToText: m.replyTo.text || '',
      cleanBody: m.text || '',
    };
  }
  if (m.text) {
    let currentText = m.text;
    let extractedName = null;
    let extractedText = null;
    while (true) {
      const match = currentText.match(/^>\s*@([^:]+):\s*"([^"]*)"\s*(.*)$/s);
      if (match) {
        extractedName = match[1].trim();
        extractedText = match[2].trim();
        currentText = match[3].trim();
      } else {
        break;
      }
    }
    if (extractedName) {
      return {
        replyToName: extractedName,
        replyToText: extractedText,
        cleanBody: currentText,
      };
    }
  }
  return null;
}

async function getChannelCryptoKey(channelId) {
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

function bufToHex(buf) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuf(hex) {
  const bytes = new Uint8Array(Math.ceil(hex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

async function encryptPayload(text, channelId) {
  if (!text) return '';
  try {
    const key = await getChannelCryptoKey(channelId);
    if (!key) return text;
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encryptedBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(text));
    return `ENC:v1:${bufToHex(iv)}:${bufToHex(encryptedBuf)}`;
  } catch {
    return text;
  }
}

async function decryptPayload(cipherText, channelId) {
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

async function preparePastedImage(file) {
  if (file.size > 25 * 1024 * 1024) throw new Error('Image too large. Maximum source size is 25 MB.');
  if (!/^image\/(png|jpe?g|webp|gif|bmp|avif)$/i.test(file.type)) {
    throw new Error('Paste a PNG, JPEG, WebP, GIF, BMP or AVIF image.');
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('This image could not be read.'));
      image.src = url;
    });
    let scale = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    for (let attempt = 0; attempt < 9; attempt++) {
      canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Image processing is unavailable in this browser.');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/webp', Math.max(0.45, 0.85 - attempt * 0.05));
      const bytes = Math.ceil(((dataUrl.length - dataUrl.indexOf(',') - 1) * 3) / 4);
      if (bytes <= MAX_PASTED_IMAGE_BYTES) {
        return { dataUrl, width: canvas.width, height: canvas.height, bytes };
      }
      scale *= 0.78;
    }
    throw new Error('Image is too complex. Try a smaller image or crop.');
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function copyTextToClipboard(text) {
  if (!text) return false;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {}
  }
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.left = '-9999px';
    el.style.top = '-9999px';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.focus();
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

function renderChannelGlyph(ch, locked, className = 'w-4 h-4 shrink-0') {
  if (ch.isDirectMessage) return <MessageCircle className={className} />;
  if (ch.id === 'general') return <MessageSquare className={className} />;
  if (ch.isPasswordProtected) {
    return locked ? (
      <Lock className={`${className} text-amber-400`} />
    ) : (
      <Unlock className={className} />
    );
  }
  return <Hash className={className} />;
}

export default function Chat({
  onClose,
  isMini = false,
  activeAccount = null,
  isOwnerAdmin = false,
  onOpenAccountModal = null,
  targetChannelRequest = null,
  onActiveChannelChange = null,
  workspaceConfig = null,
}) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('chat_theme');
      if (saved && THEMES[saved]) return saved;
      localStorage.setItem('chat_theme', 'mono');
      return 'mono';
    } catch {
      return 'mono';
    }
  });

  const [linkedAccount, setLinkedAccount] = useState(() =>
    normalizeLinkedAccount(activeAccount) || normalizeLinkedAccount(safeParse(LINKED_ACCOUNT_STORAGE_KEY, null))
  );
  const [onlineAccounts, setOnlineAccounts] = useState([]);
  const [dmThreads, setDmThreads] = useState([]);
  const [pendingDmChannel, setPendingDmChannel] = useState(null);
  const [dmSidebarOpen, setDmSidebarOpen] = useState(true);
  const [miniLeftDrawerOpen, setMiniLeftDrawerOpen] = useState(false);
  const [tempNick, setTempNick] = useState(() => getStoredTempNickname());
  const [nickInput, setNickInput] = useState(() => {
    const initialAcc =
      normalizeLinkedAccount(activeAccount) || normalizeLinkedAccount(safeParse(LINKED_ACCOUNT_STORAGE_KEY, null));
    return initialAcc ? initialAcc.username : isOwnerAdmin ? 'Owner' : getStoredTempNickname();
  });

  const [activeChannelId, setActiveChannelId] = useState('general');
  const [fallbackInviteChannel, setFallbackInviteChannel] = useState(null);
  const [customChannels, setCustomChannels] = useState([]);
  const [localChannels, setLocalChannels] = useState(() => filterValidRooms(safeParse('local_custom_channels', [])));
  const [unlockedChannels, setUnlockedChannels] = useState(() => safeParse('unlocked_chat_channels', {}));
  const [unreadChannels, setUnreadChannels] = useState({});

  const [messages, setMessages] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [composeText, setComposeText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [pastedImage, setPastedImage] = useState(null);
  const [imageProcessing, setImageProcessing] = useState(false);
  const [imagePasteStatus, setImagePasteStatus] = useState('Paste an image with Ctrl+V / ⌘V');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [broadcastText, setBroadcastText] = useState('');
  const [broadcastAlsoPostGeneral, setBroadcastAlsoPostGeneral] = useState(false);
  const [broadcastBusy, setBroadcastBusy] = useState(false);

  const [tipDismissed, setTipDismissed] = useState(() => {
    try {
      return localStorage.getItem('chat_tip_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const [newChanName, setNewChanName] = useState('');
  const [newChanDesc, setNewChanDesc] = useState('');
  const [newChanPass, setNewChanPass] = useState('');
  const [unlockCode, setUnlockCode] = useState('');

  const [deleteAllAcrossChannels, setDeleteAllAcrossChannels] = useState(false);
  const [deletingMyMessages, setDeletingMyMessages] = useState(false);
  const [adminPassModalInput, setAdminPassModalInput] = useState('');
  const [adminPassSettingsInput, setAdminPassSettingsInput] = useState('');
  const [deletingAllAdmin, setDeletingAllAdmin] = useState(false);
  const [clearingChannelAdmin, setClearingChannelAdmin] = useState(false);
  const [confirmDeleteChanId, setConfirmDeleteChanId] = useState(null);
  const [deletingChannelAdmin, setDeletingChannelAdmin] = useState(false);
  const [confirmDeleteDmId, setConfirmDeleteDmId] = useState(null);
  const [deletingDmThread, setDeletingDmThread] = useState(false);
  const [mutedUsers, setMutedUsers] = useState(() => getActiveMutedUsers());
  const [mutePickerKey, setMutePickerKey] = useState(null);
  const [showMutedMessages, setShowMutedMessages] = useState(false);

  const [toastMsg, setToastMsg] = useState('');
  const [tickNow, setTickNow] = useState(() => Date.now());
  const [customChannelsLoaded, setCustomChannelsLoaded] = useState(false);

  const messagesPanelRef = useRef(null);
  const composeInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const toastTimerRef = useRef(null);
  const imagePasteRevRef = useRef(0);
  const latestLobbyTsRef = useRef(0);
  const activeChannelIdRef = useRef(activeChannelId);
  const activeMutedUsersRef = useRef(mutedUsers);
  const clientId = useMemo(() => getClientId(), []);

  const activeMutedUsers = useMemo(
    () => mutedUsers.filter((entry) => Number(entry?.mutedUntil || 0) > tickNow),
    [mutedUsers, tickNow],
  );

  useEffect(() => {
    activeMutedUsersRef.current = activeMutedUsers;
  }, [activeMutedUsers]);

  useEffect(() => {
    const unsub = subscribeUserMutes((next) => setMutedUsers(next));
    return () => unsub();
  }, []);

  useEffect(() => {
    activeChannelIdRef.current = activeChannelId;
    setConfirmDeleteDmId(null);
    setMutePickerKey(null);
    if (onActiveChannelChange) onActiveChannelChange(activeChannelId);
    setUnreadChannels((prev) => {
      if (!prev[activeChannelId]) return prev;
      const next = { ...prev };
      delete next[activeChannelId];
      return next;
    });
  }, [activeChannelId, onActiveChannelChange]);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMsg(''), 2800);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Sync linked account from parent prop, storage, and custom events
  useEffect(() => {
    if (activeAccount !== undefined) {
      const normalized = normalizeLinkedAccount(activeAccount);
      const cached = normalizeLinkedAccount(safeParse(LINKED_ACCOUNT_STORAGE_KEY, null));
      const resolved = normalized || cached;
      setLinkedAccount(resolved);
      if (resolved) {
        setNickInput(resolved.username);
      } else {
        setNickInput(isOwnerAdmin ? 'Owner' : getStoredTempNickname());
      }
    }
  }, [activeAccount, isOwnerAdmin]);

  useEffect(() => {
    const applyAccountSync = (acc) => {
      const normalized = normalizeLinkedAccount(acc);
      setLinkedAccount(normalized);
      setNickInput(normalized ? normalized.username : getStoredTempNickname());
    };

    const handleCustomSync = (event) => applyAccountSync(event.detail || null);
    const handleStorage = (event) => {
      if (event.key === LINKED_ACCOUNT_STORAGE_KEY) {
        applyAccountSync(safeParse(LINKED_ACCOUNT_STORAGE_KEY, null));
      }
    };
    const handleWindowMsg = (event) => {
      const data = event.data;
      if (!data) return;
      if (data.type === 'urnperiodic-account-sync') {
        applyAccountSync(data.account || null);
      } else if (data.type === 'admin-delete-all-messages') {
        try {
          Object.keys(localStorage).forEach((k) => {
            if (k.startsWith('local_messages_')) localStorage.removeItem(k);
          });
        } catch {}
        setMessages([]);
        showToast('🗑️ Admin deleted all messages');
      } else if (data.type === 'admin-clear-channel' && data.channelId === activeChannelIdRef.current) {
        setMessages([]);
      } else if (data.type === 'admin-delete-message' && data.channelId === activeChannelIdRef.current && data.messageId) {
        setMessages((prev) => prev.filter((m) => String(m.id || m.key) !== String(data.messageId)));
      } else if (data.type === 'admin-delete-channel' && data.channelId) {
        setLocalChannels((prev) => prev.filter((c) => c.id !== data.channelId));
        setCustomChannels((prev) => prev.filter((c) => c.id !== data.channelId));
        if (activeChannelIdRef.current === data.channelId) {
          setActiveChannelId('general');
          setMessages([]);
          showToast('🗑️ Channel deleted by admin');
        }
      } else if (data.type === 'dm-thread-deleted' && data.channelId) {
        try {
          localStorage.removeItem(`local_messages_${data.channelId}`);
        } catch {}
        setDmThreads((prev) => prev.filter((t) => t.id !== data.channelId));
        setPendingDmChannel((prev) => (prev?.id === data.channelId ? null : prev));
        setUnreadChannels((prev) => {
          if (!prev[data.channelId]) return prev;
          const next = { ...prev };
          delete next[data.channelId];
          return next;
        });
        if (activeChannelIdRef.current === data.channelId) {
          setActiveChannelId('general');
          setMessages([]);
          setReplyTo(null);
          showToast('🗑️ DM conversation & traces deleted');
        }
      } else if (data.type === 'admin-purge-user' && data.usernameLower) {
        const target = String(data.usernameLower).toLowerCase();
        setMessages((prev) =>
          prev.filter(
            (m) =>
              String(m.accountId || '').toLowerCase() !== target &&
              String(m.name || '').trim().toLowerCase() !== target
          )
        );
      }
    };

    window.addEventListener('urnperiodic-account-sync', handleCustomSync);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('message', handleWindowMsg);

    let bus;
    try {
      bus = new BroadcastChannel('urnperiodic_lobby_bus');
      bus.onmessage = (e) => handleWindowMsg({ data: e.data });
    } catch {}

    return () => {
      window.removeEventListener('urnperiodic-account-sync', handleCustomSync);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('message', handleWindowMsg);
      if (bus) {
        try {
          bus.close();
        } catch {}
      }
    };
  }, [showToast]);

  // Anonymous Firebase auth + live siteAccounts listener for instant moderation sync
  useEffect(() => {
    signInAnonymously(lobbyAuth).catch(() => {});
  }, []);

  const linkedUsernameLower = linkedAccount?.usernameLower || null;
  useEffect(() => {
    if (!linkedUsernameLower) return;
    const ref = doc(lobbyDb, 'siteAccounts', linkedUsernameLower);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setLinkedAccount(null);
          return;
        }
        const d = snap.data();
        if (d.isActive === false) {
          setLinkedAccount(null);
          showToast('Your account was disabled by an administrator.');
          return;
        }
        setLinkedAccount(
          normalizeLinkedAccount({
            username: d.username || snap.id,
            usernameLower: d.usernameLower || snap.id,
            isActive: d.isActive !== false,
            isAdmin: Boolean(d.isAdmin),
            lobbyChatAccess: d.lobbyChatAccess !== false,
            roleBadge: d.roleBadge || '',
            badgeColor: d.badgeColor || 'cyan',
            chatMuted: Boolean(d.chatMuted),
            chatBanned: Boolean(d.chatBanned),
          })
        );
      },
      (err) => {
        if (isFirestorePermissionError(err)) {
          try {
            handleFirestoreError(err, OperationType.GET, `siteAccounts/${linkedUsernameLower}`);
          } catch (wrappedErr) {
            console.error(wrappedErr);
          }
        }
      }
    );
    return () => unsub();
  }, [linkedUsernameLower, showToast]);

  // Live listener for online account presence
  useEffect(() => {
    const unsub = onSnapshot(
      collection(lobbyDb, 'siteAccounts'),
      (snapshot) => {
        const list = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          if (d && d.isActive !== false) {
            list.push({
              username: String(d.username || docSnap.id),
              usernameLower: String(d.usernameLower || docSnap.id).toLowerCase(),
              isActive: d.isActive !== false,
              isAdmin: Boolean(d.isAdmin),
              isOnline: Boolean(d.isOnline),
              lastSeenAt: d.lastSeenAt ? Number(d.lastSeenAt) : null,
            });
          }
        });
        setOnlineAccounts(list);
      },
      () => {}
    );
    return () => unsub();
  }, []);

  const isAccountLinked = Boolean(linkedAccount && linkedAccount.username && linkedAccount.isActive !== false);
  const isOwnerSession = Boolean(isOwnerAdmin && !isAccountLinked);
  const isChatAdmin = Boolean(isOwnerAdmin || linkedAccount?.isAdmin);
  const hasAccountIdentity = isAccountLinked || isOwnerSession;
  const myDmIdentity = isAccountLinked ? linkedAccount.usernameLower : isOwnerSession ? '__owner__' : null;
  const effectiveChatName = isAccountLinked
    ? linkedAccount.username
    : isOwnerSession
      ? 'Owner'
      : tempNick.trim();

  // Real-time DM threads subscription for signed-in account or Owner
  useEffect(() => {
    if (!myDmIdentity) {
      setDmThreads([]);
      return;
    }
    const q = query(
      collection(lobbyDb, 'directMessages'),
      where('participants', 'array-contains', myDmIdentity),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const removedIds = [];
        snap.docChanges().forEach((change) => {
          if (change.type === 'removed') {
            removedIds.push(change.doc.id);
          }
        });
        if (removedIds.length > 0) {
          removedIds.forEach((remId) => {
            try {
              localStorage.removeItem(`local_messages_${remId}`);
            } catch {}
            setPendingDmChannel((prev) => (prev?.id === remId ? null : prev));
            setUnreadChannels((prev) => {
              if (!prev[remId]) return prev;
              const next = { ...prev };
              delete next[remId];
              return next;
            });
            if (activeChannelIdRef.current === remId) {
              setActiveChannelId('general');
              setMessages([]);
              setReplyTo(null);
              showToast('🗑️ DM conversation & traces were deleted');
            }
          });
        }
        const loaded = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          const participants = Array.isArray(data?.participants) ? data.participants : [];
          if (participants.length !== 2) return;
          const partnerId = participants.find((p) => p !== myDmIdentity) || participants[0];
          loaded.push({
            id: docSnap.id,
            participants,
            partnerId,
            lastSenderId: data.lastSenderId || null,
            lastSenderName: data.lastSenderName || null,
            lastMessageAt: Number(data.lastMessageAt || 0),
            createdAt: Number(data.createdAt || 0),
            updatedAt: Number(data.updatedAt || 0),
          });
        });
        loaded.sort((a, b) => (b.lastMessageAt || b.updatedAt || b.createdAt) - (a.lastMessageAt || a.updatedAt || a.createdAt));
        setDmThreads(loaded);
      },
      (err) => {
        if (isFirestorePermissionError(err)) {
          try {
            handleFirestoreError(err, OperationType.LIST, 'directMessages');
          } catch (wrappedErr) {
            console.error(wrappedErr);
          }
        }
      },
    );
    return () => unsub();
  }, [myDmIdentity]);

  const onlineUserSet = useMemo(() => {
    const set = new Set();
    onlineAccounts.forEach((acc) => {
      if (isAccountOnline(acc, tickNow) || acc.usernameLower === linkedUsernameLower) {
        set.add(acc.usernameLower);
      }
    });
    return set;
  }, [onlineAccounts, tickNow, linkedUsernameLower]);

  const onlineOtherUsers = useMemo(() => {
    return onlineAccounts.filter(
      (acc) => onlineUserSet.has(acc.usernameLower) && acc.usernameLower !== myDmIdentity,
    );
  }, [onlineAccounts, onlineUserSet, myDmIdentity]);

  const onlineUsernames = useMemo(() => {
    const names = onlineAccounts
      .filter((acc) => onlineUserSet.has(acc.usernameLower))
      .map((acc) => `@${acc.username}`);
    if (isOwnerAdmin && !linkedUsernameLower) {
      names.unshift('Owner');
    }
    return names;
  }, [onlineAccounts, onlineUserSet, isOwnerAdmin, linkedUsernameLower]);

  const accountLookup = useMemo(() => {
    const map = new Map();
    onlineAccounts.forEach((acc) => {
      map.set(acc.usernameLower, acc);
    });
    return map;
  }, [onlineAccounts]);

  const dmChannels = useMemo(() => {
    const list = dmThreads.map((t) => {
      const acc = accountLookup.get(t.partnerId);
      const partnerDisplay = t.partnerId === '__owner__' ? 'Owner' : acc?.username || t.partnerId;
      const partnerOnline = t.partnerId === '__owner__' ? false : onlineUserSet.has(t.partnerId);
      return {
        id: t.id,
        name: t.partnerId === '__owner__' ? 'Owner' : `@${partnerDisplay}`,
        partnerId: t.partnerId,
        partnerUsername: partnerDisplay,
        partnerOnline,
        description: `Direct message with ${t.partnerId === '__owner__' ? 'Owner' : `@${partnerDisplay}`}`,
        isDirectMessage: true,
        isPermanent: true,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        lastMessageAt: t.lastMessageAt,
        lastSenderId: t.lastSenderId,
      };
    });
    if (pendingDmChannel && !list.some((c) => c.id === pendingDmChannel.id)) {
      const acc = accountLookup.get(pendingDmChannel.partnerId);
      const partnerDisplay =
        pendingDmChannel.partnerId === '__owner__' ? 'Owner' : acc?.username || pendingDmChannel.partnerUsername || pendingDmChannel.partnerId;
      list.unshift({
        ...pendingDmChannel,
        name: pendingDmChannel.partnerId === '__owner__' ? 'Owner' : `@${partnerDisplay}`,
        partnerUsername: partnerDisplay,
        partnerOnline: pendingDmChannel.partnerId === '__owner__' ? false : onlineUserSet.has(pendingDmChannel.partnerId),
      });
    }
    return list;
  }, [dmThreads, pendingDmChannel, accountLookup, onlineUserSet]);

  const publicChannels = useMemo(() => {
    const validLocals = filterValidRooms(localChannels, tickNow);
    const validCustoms = filterValidRooms(customChannels, tickNow);
    const base = [
      ...DEFAULT_CHANNELS,
      ...validLocals,
      ...validCustoms.filter((c) => !validLocals.some((lc) => lc.id === c.id || lc.name === c.name)),
    ];
    if (fallbackInviteChannel && !base.some((c) => c.id === fallbackInviteChannel.id)) {
      base.push(fallbackInviteChannel);
    }
    return base;
  }, [localChannels, customChannels, fallbackInviteChannel, tickNow]);

  // Combined valid channel list (public + DMs)
  const allChannels = useMemo(() => {
    return [...publicChannels, ...dmChannels];
  }, [publicChannels, dmChannels]);

  const currentChannel = useMemo(() => {
    return allChannels.find((c) => c.id === activeChannelId) || DEFAULT_CHANNELS[0];
  }, [allChannels, activeChannelId]);

  const isPermanentChannel = useCallback(
    (chId) => {
      if (typeof chId === 'string' && chId.startsWith('dm__')) return true;
      const ch = allChannels.find((c) => c.id === chId) || currentChannel;
      return Boolean(ch?.isPermanent || ch?.isDirectMessage || ch?.id === 'general');
    },
    [allChannels, currentChannel]
  );

  const isCurrentLocked = Boolean(currentChannel.isPasswordProtected && !unlockedChannels[currentChannel.id]);

  // Handle external channel/DM navigation requests (e.g. clicking the header notification pill)
  useEffect(() => {
    const reqId = targetChannelRequest?.id;
    if (!reqId) return;
    if (reqId.startsWith('dm__')) {
      if (!myDmIdentity) return;
      const partnerId = parseDmPartnerFromId(reqId, myDmIdentity);
      if (partnerId && !dmThreads.some((t) => t.id === reqId)) {
        const acc = accountLookup.get(partnerId);
        const partnerDisplay = partnerId === '__owner__' ? 'Owner' : acc?.username || partnerId;
        setPendingDmChannel({
          id: reqId,
          name: partnerId === '__owner__' ? 'Owner' : `@${partnerDisplay}`,
          partnerId,
          partnerUsername: partnerDisplay,
          partnerOnline: partnerId === '__owner__' ? false : onlineUserSet.has(partnerId),
          description: `Direct message with ${partnerId === '__owner__' ? 'Owner' : `@${partnerDisplay}`}`,
          isDirectMessage: true,
          isPermanent: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          lastMessageAt: 0,
        });
      }
    }
    setActiveChannelId(reqId);
  }, [targetChannelRequest?.nonce, targetChannelRequest?.id, myDmIdentity, dmThreads, accountLookup, onlineUserSet]);

  // Check invite query params (?channel=...&invite=true)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const channelParam = params.get('channel') || params.get('room');
      const isInvite =
        params.get('invite') === '1' || params.get('invite') === 'true' || params.get('invite') === 'code';
      if (channelParam && isInvite) {
        setUnlockedChannels((prev) => {
          const next = { ...prev, [channelParam]: true };
          try {
            localStorage.setItem('unlocked_chat_channels', JSON.stringify(next));
          } catch {}
          return next;
        });
        params.delete('channel');
        params.delete('room');
        params.delete('invite');
        const nextQuery = params.toString();
        const cleanUrl = `${window.location.origin}${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}${window.location.hash}`;
        window.history.replaceState({}, document.title, cleanUrl);

        setTimeout(() => {
          const found = DEFAULT_CHANNELS.find(
            (c) => c.id === channelParam || c.name.toLowerCase() === channelParam.toLowerCase()
          );
          if (found) {
            setActiveChannelId(found.id);
            showToast(`🔓 Joined #${found.name} via invite link!`);
          } else {
            setFallbackInviteChannel({
              id: channelParam,
              name: channelParam,
              description: 'Private room via invite link',
              isPasswordProtected: true,
            });
            setActiveChannelId(channelParam);
            showToast('🔓 Joined private room via invite link!');
          }
        }, 250);
      }
    } catch {}
  }, [showToast]);

  // Firestore real-time listener for custom channels
  useEffect(() => {
    const unsub = onSnapshot(
      collection(lobbyDb, 'channels'),
      (snapshot) => {
        const list = [];
        const now = Date.now();
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.isDirectMessage) return;
          const lowerName = (data.name || '').toLowerCase();
          if (DISALLOWED_ROOM_NAMES.includes(lowerName)) {
            deleteDoc(doc(lobbyDb, 'channels', docSnap.id)).catch(() => {});
            return;
          }
          const createdAt = data.createdAt || now;
          if (now - createdAt >= ROOM_TTL_MS) {
            deleteDoc(doc(lobbyDb, 'channels', docSnap.id)).catch(() => {});
          } else {
            list.push({
              id: docSnap.id,
              name: data.name,
              description: data.description || 'Custom chat room',
              isPasswordProtected: !!data.isPasswordProtected,
              password: data.password || null,
              createdAt,
            });
          }
        });
        setCustomChannels(list);
        setCustomChannelsLoaded(true);
      },
      (err) => {
        setCustomChannelsLoaded(true);
        if (isFirestorePermissionError(err)) {
          try {
            handleFirestoreError(err, OperationType.LIST, 'channels');
          } catch (wrappedErr) {
            console.error(wrappedErr);
          }
        }
      }
    );
    return () => unsub();
  }, []);

  // Periodic purge timer for ephemeral rooms & countdown refresh
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTickNow(now);

      setLocalChannels((prev) => {
        const valid = filterValidRooms(prev, now);
        if (valid.length !== prev.length) {
          try {
            localStorage.setItem('local_custom_channels', JSON.stringify(valid));
          } catch {}
          return valid;
        }
        return prev;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Redirect to #general if active custom room expired
  useEffect(() => {
    if (
      customChannelsLoaded &&
      activeChannelId !== 'general' &&
      activeChannelId !== 'temporary' &&
      !activeChannelId.startsWith('dm__') &&
      !allChannels.some((c) => c.id === activeChannelId)
    ) {
      setActiveChannelId('general');
      showToast('⏰ The custom room expired after 1 hour.');
    }
  }, [allChannels, activeChannelId, customChannelsLoaded, showToast]);

  // Close mobile channel dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const onDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [dropdownOpen]);

  // Firestore messages subscription for active channel or DM thread
  useEffect(() => {
    const cId = currentChannel.id;
    const isDm = Boolean(currentChannel.isDirectMessage || String(cId).startsWith('dm__'));
    const isPerm = isPermanentChannel(cId);

    if (isCurrentLocked) {
      setMessages([]);
      return;
    }

    let cancelled = false;
    setMessages([]);

    // Load cached local messages first
    const rawLocals = getLocalMessages(cId);
    const now = Date.now();
    const validLocals = isPerm
      ? rawLocals
      : rawLocals.filter((m) => now - (m.timestamp || now) < MESSAGE_TTL_MS);

    Promise.all(
      validLocals.map(async (m) => {
        const decText = await decryptPayload(m.text || '', cId);
        const decImg = m.imageUrl ? await decryptPayload(m.imageUrl, cId) : { text: null };
        return {
          ...m,
          text: decText.text,
          isEncrypted: decText.encrypted,
          imageUrl: decImg.text,
        };
      })
    ).then((decryptedLocals) => {
      if (!cancelled && decryptedLocals.length > 0) {
        setMessages((prev) => (prev.length === 0 ? decryptedLocals : prev));
      }
    });

    let snapInitialized = false;
    const colRef = isDm
      ? collection(lobbyDb, 'directMessages', cId, 'messages')
      : collection(lobbyDb, 'channels', cId, 'messages');
    const q = query(colRef, orderBy('timestamp', 'asc'), limitToLast(150));

    const unsub = onSnapshot(
      q,
      async (snapshot) => {
        const msgs = [];
        const currentNow = Date.now();
        const expiredDocIds = [];

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          const ts = data.timestamp || currentNow;

          if (!isPerm && currentNow - ts >= MESSAGE_TTL_MS) {
            expiredDocIds.push(docSnap.id);
            continue;
          }

          const decTextObj = await decryptPayload(data.text || '', cId);
          const decImgObj = data.imageUrl ? await decryptPayload(data.imageUrl, cId) : { text: null };

          msgs.push({
            id: docSnap.id,
            key: docSnap.id,
            name: data.name || 'anonymous',
            userId: data.userId || null,
            senderId: data.senderId || null,
            accountId: data.accountId || null,
            roleBadge: data.roleBadge || '',
            badgeColor: data.badgeColor || 'cyan',
            isRegistered: !!data.isRegistered,
            isAdmin: !!data.isAdmin,
            text: decTextObj.text,
            isEncrypted: decTextObj.encrypted,
            imageUrl: decImgObj.text,
            timestamp: ts,
            replyTo: data.replyTo || null,
          });
        }

        if (!isPerm && expiredDocIds.length > 0) {
          expiredDocIds.forEach((expiredId) => {
            deleteDoc(doc(lobbyDb, 'channels', cId, 'messages', expiredId)).catch(() => {});
          });
        }

        if (cancelled) return;
        setMessages(msgs);

        if (msgs.length === 0 && !snapshot.metadata.fromCache) {
          try {
            localStorage.removeItem(`local_messages_${cId}`);
          } catch {}
        }

        const latestUnmutedMsg = msgs.reduce((latest, m) => {
          if (isSenderMuted(m, activeMutedUsersRef.current)) return latest;
          return Math.max(latest, Number(m.timestamp || 0));
        }, 0);

        if (latestUnmutedMsg > 0) {
          const wasInitialized = snapInitialized;
          snapInitialized = true;
          if (latestUnmutedMsg > latestLobbyTsRef.current) {
            latestLobbyTsRef.current = latestUnmutedMsg;
          }
          if (wasInitialized) {
            try {
              localStorage.setItem('lobby-chat-latest', String(latestUnmutedMsg));
              localStorage.setItem('lobby-chat-notification', String(latestUnmutedMsg));
              const lobbyBus = new BroadcastChannel('urnperiodic_lobby_bus');
              lobbyBus.postMessage({ type: 'lobby-chat-message', timestamp: latestUnmutedMsg, channel: cId });
              setTimeout(() => {
                try {
                  lobbyBus.close();
                } catch {}
              }, 400);
            } catch {}
          }
        } else {
          snapInitialized = true;
        }
      },
      (err) => {
        if (isFirestorePermissionError(err)) {
          try {
            handleFirestoreError(
              err,
              OperationType.LIST,
              isDm ? `directMessages/${cId}/messages` : `channels/${cId}/messages`
            );
          } catch (wrappedErr) {
            console.error(wrappedErr);
          }
        }
      }
    );

    return () => {
      cancelled = true;
      unsub();
    };
  }, [currentChannel.id, currentChannel.isDirectMessage, isCurrentLocked, isPermanentChannel]);

  // Watch background channels & DMs for red unread dots when user is chatting in another room
  useEffect(() => {
    const channelUnsubs = new Map();
    const watchChannels = allChannels.filter((c) => {
      if (!c?.id || c.id === activeChannelId) return false;
      if (c.isPasswordProtected && !unlockedChannels[c.id]) return false;
      return true;
    });

    watchChannels.forEach((ch) => {
      let initialized = false;
      const rootCol = ch.isDirectMessage ? 'directMessages' : 'channels';
      try {
        const bgQuery = query(
          collection(lobbyDb, rootCol, ch.id, 'messages'),
          orderBy('timestamp', 'desc'),
          limit(1),
        );
        const unsub = onSnapshot(
          bgQuery,
          (snap) => {
            const docData = snap.docs[0]?.data();
            const latest = Number(docData?.timestamp || 0);
            if (!initialized) {
              initialized = true;
              return;
            }
            if (ch.isDirectMessage && myDmIdentity && docData?.accountId === myDmIdentity) {
              return;
            }
            if (
              docData &&
              isSenderMuted(
                {
                  accountId: docData.accountId || (ch.isDirectMessage ? ch.partnerId : null),
                  senderId: docData.senderId || null,
                  name: docData.name || '',
                },
                activeMutedUsersRef.current,
              )
            ) {
              return;
            }
            if (latest && activeChannelIdRef.current !== ch.id) {
              setUnreadChannels((prev) => (prev[ch.id] ? prev : { ...prev, [ch.id]: true }));
            }
          },
          (err) => {
            if (isFirestorePermissionError(err)) {
              try {
                handleFirestoreError(err, OperationType.GET, `${rootCol}/${ch.id}/messages`);
              } catch (wrappedErr) {
                console.error(wrappedErr);
              }
            }
          },
        );
        channelUnsubs.set(ch.id, unsub);
      } catch {}
    });

    return () => {
      channelUnsubs.forEach((u) => {
        try {
          u();
        } catch {}
      });
      channelUnsubs.clear();
    };
  }, [allChannels, activeChannelId, unlockedChannels, myDmIdentity]);

  const { displayedMessages, mutedHiddenCount } = useMemo(() => {
    const isPerm = isPermanentChannel(currentChannel.id);
    const validMsgs = isPerm
      ? messages
      : messages.filter((m) => tickNow - (m.timestamp || tickNow) < MESSAGE_TTL_MS);
    const q = searchFilter.trim().toLowerCase();
    const searchedMsgs = q
      ? validMsgs.filter(
          (m) => (m.name || '').toLowerCase().includes(q) || (m.text || '').toLowerCase().includes(q),
        )
      : validMsgs;
    let hiddenCount = 0;
    const filtered = searchedMsgs.filter((m) => {
      const muted = isSenderMuted(m, activeMutedUsers, tickNow);
      if (muted) {
        hiddenCount += 1;
        return showMutedMessages;
      }
      return true;
    });
    return { displayedMessages: filtered, mutedHiddenCount: hiddenCount };
  }, [messages, currentChannel.id, isPermanentChannel, tickNow, searchFilter, activeMutedUsers, showMutedMessages]);

  useEffect(() => {
    const panel = messagesPanelRef.current;
    if (panel) {
      panel.scrollTop = panel.scrollHeight;
    }
  }, [displayedMessages.length, currentChannel.id]);

  const isMyMessage = useCallback(
    (m) => {
      if (!m) return false;
      const myAuthUid = lobbyAuth.currentUser?.uid;
      const mySentIds = getMySentMessageIds();

      if (m.id && mySentIds.includes(String(m.id))) return true;
      if (m.key && mySentIds.includes(String(m.key))) return true;
      if (m.senderId && String(m.senderId) === String(clientId)) return true;
      if (myAuthUid && m.userId && String(m.userId) === String(myAuthUid)) return true;
      if (
        linkedAccount?.usernameLower &&
        m.accountId &&
        String(m.accountId) === String(linkedAccount.usernameLower)
      ) {
        return true;
      }
      if (isOwnerSession && m.accountId === '__owner__') return true;
      if (m.isLocalTemp) return true;
      return false;
    },
    [clientId, linkedAccount, isOwnerSession]
  );

  const handleApplyTheme = (key) => {
    setTheme(key);
    try {
      localStorage.setItem('chat_theme', key);
    } catch {}
  };

  const clearPastedImage = () => {
    imagePasteRevRef.current += 1;
    setPastedImage(null);
    setImageProcessing(false);
    setImagePasteStatus('Paste an image with Ctrl+V / ⌘V');
  };

  const switchChannel = (id) => {
    const target = allChannels.find((c) => c.id === id);
    if (!target) return;
    if (target.isDirectMessage && !hasAccountIdentity) {
      showToast('🔒 Sign in with an assigned account to access direct messages.');
      return;
    }
    clearPastedImage();
    setActiveChannelId(id);
    setSearchFilter('');
    setDropdownOpen(false);
    setMiniLeftDrawerOpen(false);
  };

  const openDirectMessage = useCallback(
    (targetAccountId, targetDisplayName = '') => {
      if (!hasAccountIdentity || !myDmIdentity) {
        if (onOpenAccountModal) {
          showToast('Sign in with your account to send direct messages.');
          onOpenAccountModal();
        } else {
          showToast('Sign in with your account to send direct messages.');
        }
        return;
      }
      const targetLower = String(targetAccountId || '').trim().toLowerCase();
      if (!targetLower || targetLower === myDmIdentity) return;
      const dmId = getDmId(myDmIdentity, targetLower);
      if (!dmId) return;
      const matchedAcc = accountLookup.get(targetLower);
      const display =
        targetDisplayName || matchedAcc?.username || (targetLower === '__owner__' ? 'Owner' : targetLower);
      if (!dmThreads.some((t) => t.id === dmId)) {
        setPendingDmChannel({
          id: dmId,
          name: targetLower === '__owner__' ? 'Owner' : `@${display}`,
          partnerId: targetLower,
          partnerUsername: display,
          partnerOnline: targetLower === '__owner__' ? false : onlineUserSet.has(targetLower),
          description: `Direct message with ${targetLower === '__owner__' ? 'Owner' : `@${display}`}`,
          isDirectMessage: true,
          isPermanent: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          lastMessageAt: 0,
        });
      }
      clearPastedImage();
      setActiveChannelId(dmId);
      setSearchFilter('');
      setMiniLeftDrawerOpen(false);
      setDropdownOpen(false);
      setTimeout(() => composeInputRef.current?.focus(), 60);
    },
    [hasAccountIdentity, myDmIdentity, onOpenAccountModal, showToast, accountLookup, dmThreads, onlineUserSet],
  );

  const copyInviteLink = async (channelId) => {
    const c = allChannels.find((x) => x.id === channelId) || currentChannel;
    const url = `${window.location.origin}${window.location.pathname}?filter=lobbychat&channel=${encodeURIComponent(c.id)}&invite=true`;
    const ok = await copyTextToClipboard(url);
    if (ok) {
      showToast(`📋 Invite link for #${c.name} copied! Bypasses password.`);
    } else {
      showToast('Copy failed — browser blocked clipboard access.');
    }
  };

  const saveNickname = (rawVal) => {
    if (isAccountLinked) {
      showToast(`Chat name is locked to @${linkedAccount.username}`);
      return true;
    }
    const trimmed = (rawVal || '').trim();
    if (trimmed.length < 2) {
      showToast('⚠️ Nickname must be at least 2 characters');
      return false;
    }
    setTempNick(trimmed);
    setNickInput(trimmed);
    try {
      localStorage.setItem('chat_name', trimmed);
    } catch {}
    showToast(`✓ Nickname set to "${trimmed}"`);
    composeInputRef.current?.focus();
    return true;
  };

  const handleImagePaste = async (event) => {
    const items = Array.from(event.clipboardData?.items || []);
    const file =
      items.find((item) => item.kind === 'file' && item.type.startsWith('image/'))?.getAsFile() ||
      Array.from(event.clipboardData?.files || []).find((f) => f.type.startsWith('image/'));
    if (!file) return;
    event.preventDefault();
    if (sendingMessage) return;
    if (!isChatAdmin && linkedAccount?.lobbyChatAccess === false) {
      showToast('Lobby Chat access is disabled for your account.');
      return;
    }
    if (!isChatAdmin && linkedAccount?.chatBanned) {
      showToast('Your account is banned from Lobby Chat.');
      return;
    }
    if (!isChatAdmin && linkedAccount?.chatMuted) {
      showToast('You are currently muted in Lobby Chat.');
      return;
    }
    if (!hasAccountIdentity && onOpenAccountModal) {
      showToast('Sign in with your account to share images in Chat.');
      onOpenAccountModal();
      return;
    }
    if (isCurrentLocked) {
      showToast('Unlock this channel before attaching an image.');
      return;
    }

    const revision = ++imagePasteRevRef.current;
    setImageProcessing(true);
    setImagePasteStatus('Preparing pasted image…');
    try {
      const image = await preparePastedImage(file);
      if (revision !== imagePasteRevRef.current) return;
      setPastedImage(image);
      setImagePasteStatus('Ready to send · paste again to replace · GIFs send as still images');
    } catch (error) {
      if (revision === imagePasteRevRef.current) {
        showToast(error.message || 'Could not paste this image.');
        setImagePasteStatus('Could not prepare image. Try another image.');
      }
    } finally {
      if (revision === imagePasteRevRef.current) {
        setImageProcessing(false);
      }
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (sendingMessage || imageProcessing) return;
    if (!isChatAdmin && linkedAccount?.lobbyChatAccess === false) {
      showToast('Lobby Chat access is disabled for your account.');
      return;
    }
    if (!isChatAdmin && linkedAccount?.chatBanned) {
      showToast('Your account is banned from Lobby Chat.');
      return;
    }
    if (!isChatAdmin && linkedAccount?.chatMuted) {
      showToast('You are muted in Lobby Chat and cannot send messages.');
      return;
    }
    if (!hasAccountIdentity && onOpenAccountModal) {
      showToast('Sign in with an account to send messages.');
      onOpenAccountModal();
      return;
    }
    if (isCurrentLocked) {
      showToast('Unlock this channel before sending.');
      return;
    }

    const text = composeText.trim();
    const imageUrl = pastedImage?.dataUrl || null;
    if (!text && !imageUrl) return;

    setSendingMessage(true);
    try {
      let currentName = isAccountLinked
        ? linkedAccount.username
        : isOwnerSession
          ? 'Owner'
          : tempNick.trim();
      if (!hasAccountIdentity && currentName.length < 2) {
        const pendingNick = nickInput.trim();
        if (pendingNick.length >= 2) {
          saveNickname(pendingNick);
          currentName = pendingNick;
        } else {
          const autoNick = 'Agent_' + Math.floor(100 + Math.random() * 900);
          saveNickname(autoNick);
          currentName = autoNick;
          showToast(`Chatting as ${autoNick} (edit above)`);
        }
      }

      const cId = currentChannel.id;
      const ts = Date.now();
      const replyTarget = replyTo ? { name: replyTo.name, text: replyTo.text } : null;

      const encryptedText = await encryptPayload(text, cId);
      const encryptedImage = imageUrl ? await encryptPayload(imageUrl, cId) : null;

      const myAuthUid = lobbyAuth.currentUser?.uid || clientId;
      const localKey = `local_${ts}_${Math.random().toString(36).substring(2, 9)}`;

      const msgData = {
        name: currentName,
        userId: myAuthUid,
        senderId: clientId,
        accountId: isAccountLinked ? linkedAccount.usernameLower : isOwnerSession ? '__owner__' : null,
        roleBadge: isAccountLinked ? linkedAccount.roleBadge || '' : isOwnerSession ? 'Owner' : '',
        badgeColor: isAccountLinked ? linkedAccount.badgeColor || 'cyan' : isOwnerSession ? 'amber' : 'cyan',
        isRegistered: hasAccountIdentity,
        isAdmin: isChatAdmin,
        text,
        imageUrl,
        replyTo: replyTarget,
        isEncrypted: true,
        timestamp: ts,
        isLocalTemp: true,
        key: localKey,
      };

      recordMySentMessage(localKey);

      const localEncryptedMsg = { ...msgData, text: encryptedText, imageUrl: encryptedImage };
      const validLocals = [...getLocalMessages(cId), localEncryptedMsg].filter(
        (m) => ts - (m.timestamp || ts) < MESSAGE_TTL_MS
      );
      try {
        localStorage.setItem(`local_messages_${cId}`, JSON.stringify(validLocals.slice(-100)));
      } catch {
        showToast('Local cache is full; still attempting to send online.');
      }
      if (cId === 'general') {
        try {
          localStorage.setItem('lobby-chat-notification', String(ts));
        } catch {}
      }

      setMessages((prev) =>
        prev.some((m) => m.timestamp === ts && m.name === msgData.name) ? prev : [...prev, msgData]
      );

      setReplyTo(null);
      setComposeText('');
      clearPastedImage();
      composeInputRef.current?.focus();

      try {
        const isDm = Boolean(currentChannel.isDirectMessage || String(cId).startsWith('dm__'));
        const msgCol = isDm
          ? collection(lobbyDb, 'directMessages', cId, 'messages')
          : collection(lobbyDb, 'channels', cId, 'messages');
        const docRef = await addDoc(msgCol, {
          name: msgData.name,
          userId: msgData.userId,
          senderId: msgData.senderId,
          accountId: msgData.accountId,
          roleBadge: msgData.roleBadge,
          badgeColor: msgData.badgeColor,
          isRegistered: hasAccountIdentity,
          isAdmin: isChatAdmin,
          text: encryptedText,
          imageUrl: encryptedImage,
          replyTo: replyTarget,
          isEncrypted: true,
          timestamp: ts,
          channelId: cId,
        });
        if (docRef?.id) {
          recordMySentMessage(docRef.id);
        }
        if (isDm && myDmIdentity && currentChannel.partnerId) {
          const participants = getDmParticipants(myDmIdentity, currentChannel.partnerId);
          if (participants) {
            const previewEncrypted = encryptedText || (imageUrl ? await encryptPayload('Sent an image', cId) : '');
            const dmThreadRef = doc(lobbyDb, 'directMessages', cId);
            let threadExists = dmThreads.some((t) => t.id === cId);
            if (!threadExists) {
              try {
                const existingSnap = await getDoc(dmThreadRef);
                threadExists = existingSnap.exists();
              } catch {}
            }
            if (threadExists) {
              await updateDoc(dmThreadRef, {
                lastSenderId: myDmIdentity,
                lastSenderName: currentName,
                lastMessageText: previewEncrypted,
                lastMessageAt: ts,
                updatedAt: ts,
              });
            } else {
              await setDoc(dmThreadRef, {
                participants,
                lastSenderId: myDmIdentity,
                lastSenderName: currentName,
                lastMessageText: previewEncrypted,
                lastMessageAt: ts,
                createdAt: ts,
                updatedAt: ts,
              });
            }
          }
        }
      } catch (err) {
        if (isFirestorePermissionError(err)) {
          const errPath = currentChannel.isDirectMessage
            ? `directMessages/${cId}/messages`
            : `channels/${cId}/messages`;
          try {
            handleFirestoreError(err, OperationType.CREATE, errPath);
          } catch (wrappedErr) {
            console.error(wrappedErr);
          }
        }
        showToast('Not synced online. Your message is kept locally where storage is available.');
      }
    } catch {
      showToast('Could not send this message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSendGlobalBroadcast = async (e) => {
    e.preventDefault();
    if (!isChatAdmin) return;
    const text = broadcastText.trim();
    if (!text) {
      showToast('Enter a broadcast message first.');
      return;
    }
    setBroadcastBusy(true);
    try {
      const senderLabel = isAccountLinked ? `@${linkedAccount.username}` : isOwnerSession ? 'Owner' : effectiveChatName || 'Admin';
      await sendAdminBroadcast(lobbyDb, lobbyAuth, text, senderLabel);
      if (broadcastAlsoPostGeneral) {
        const ts = Date.now();
        const encryptedText = await encryptPayload(`📢 [ADMIN BROADCAST] ${text}`, 'general');
        const myAuthUid = lobbyAuth.currentUser?.uid || clientId;
        const msgPayload = {
          name: isAccountLinked ? linkedAccount.username : isOwnerSession ? 'Owner' : effectiveChatName || 'Admin',
          userId: myAuthUid,
          senderId: clientId,
          accountId: isAccountLinked ? linkedAccount.usernameLower : isOwnerSession ? '__owner__' : null,
          roleBadge: isAccountLinked ? linkedAccount.roleBadge || '' : isOwnerSession ? 'Owner' : 'Admin',
          badgeColor: isAccountLinked ? linkedAccount.badgeColor || 'amber' : 'amber',
          isRegistered: hasAccountIdentity,
          isAdmin: true,
          text: encryptedText,
          imageUrl: null,
          replyTo: null,
          isEncrypted: true,
          timestamp: ts,
          channelId: 'general',
        };
        const docRef = await addDoc(collection(lobbyDb, 'channels', 'general', 'messages'), msgPayload);
        if (docRef?.id) {
          recordMySentMessage(docRef.id);
        }
      }
      setBroadcastText('');
      setBroadcastModalOpen(false);
      showToast('Broadcast sent to everyone!');
    } catch (err) {
      showToast(err?.message || 'Failed to send global broadcast.');
    } finally {
      setBroadcastBusy(false);
    }
  };

  const handleClearGlobalBroadcast = async () => {
    if (!isChatAdmin) return;
    setBroadcastBusy(true);
    try {
      await clearAdminBroadcast(lobbyDb, lobbyAuth);
      showToast('Global broadcast cleared.');
    } catch (err) {
      showToast(err?.message || 'Could not clear broadcast.');
    } finally {
      setBroadcastBusy(false);
    }
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    const raw = newChanName.trim();
    if (!raw) {
      showToast('Channel name is required!');
      return;
    }
    const clean = raw.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');
    if (!clean) {
      showToast('Invalid channel name.');
      return;
    }
    if (DISALLOWED_ROOM_NAMES.includes(clean)) {
      showToast('That room topic is not permitted.');
      return;
    }
    if (allChannels.some((c) => c.name.toLowerCase() === clean)) {
      showToast('Channel name already exists!');
      return;
    }

    const pass = newChanPass.trim();
    const desc = newChanDesc.trim() || 'A custom chat room';
    const now = Date.now();

    let createdObj;
    try {
      const docRef = await addDoc(collection(lobbyDb, 'channels'), {
        name: clean,
        description: desc,
        password: pass || null,
        isPasswordProtected: !!pass,
        createdAt: now,
      });
      createdObj = {
        id: docRef.id,
        name: clean,
        description: desc,
        isPasswordProtected: !!pass,
        password: pass,
        createdAt: now,
      };
    } catch {
      const id = `local_chan_${now}_${Math.random().toString(36).substring(2, 11)}`;
      createdObj = {
        id,
        name: clean,
        description: desc,
        isPasswordProtected: !!pass,
        password: pass,
        createdAt: now,
      };
    }

    setLocalChannels((prev) => {
      const next = [...prev, createdObj];
      try {
        localStorage.setItem('local_custom_channels', JSON.stringify(next));
      } catch {}
      return next;
    });

    if (pass) {
      setUnlockedChannels((prev) => {
        const next = { ...prev, [createdObj.id]: true };
        try {
          localStorage.setItem('unlocked_chat_channels', JSON.stringify(next));
        } catch {}
        return next;
      });
    }

    setActiveChannelId(createdObj.id);
    setNewChanName('');
    setNewChanDesc('');
    setNewChanPass('');
    setCreateModalOpen(false);
    if (pass) {
      await copyInviteLink(createdObj.id);
    } else {
      showToast(`Channel #${clean} created! (Auto-deletes in 1 hour)`);
    }
  };

  const handleUnlockChannel = (e) => {
    e.preventDefault();
    if (unlockCode === currentChannel.password) {
      setUnlockedChannels((prev) => {
        const next = { ...prev, [currentChannel.id]: true };
        try {
          localStorage.setItem('unlocked_chat_channels', JSON.stringify(next));
        } catch {}
        return next;
      });
      setUnlockCode('');
      showToast('🔓 Channel unlocked!');
    } else {
      showToast('❌ Incorrect passcode!');
    }
  };

  const handleDeleteSingleMessage = async (msg) => {
    const msgId = msg.id || msg.key;
    if (!msgId) return;
    if (!isMyMessage(msg) && !isChatAdmin) {
      showToast('⚠️ You can only delete your own messages!');
      return;
    }
    const cId = currentChannel.id;
    const isDm = Boolean(currentChannel.isDirectMessage || String(cId).startsWith('dm__'));
    try {
      if (msg.id) {
        if (isDm) {
          await deleteDoc(doc(lobbyDb, 'directMessages', cId, 'messages', String(msg.id)));
        } else {
          await deleteSingleChatMessage(lobbyDb, cId, String(msg.id));
        }
      } else {
        const locals = getLocalMessages(cId).filter((m) => String(m.id || m.key) !== String(msgId));
        try {
          localStorage.setItem(`local_messages_${cId}`, JSON.stringify(locals));
        } catch {}
      }
      setMessages((prev) => prev.filter((m) => String(m.id || m.key) !== String(msgId)));
      showToast('🗑️ Message deleted');
    } catch {
      showToast('⚠️ Could not delete message from database');
    }
  };

  const handleCopyMessage = async (msg, copyContent) => {
    if (!copyContent) {
      showToast('Nothing to copy in this message');
      return;
    }
    const ok = await copyTextToClipboard(copyContent);
    if (ok) {
      const id = msg.id || msg.key;
      setCopiedMsgId(id);
      showToast('📋 Message copied to clipboard!');
      setTimeout(() => {
        setCopiedMsgId((cur) => (cur === id ? null : cur));
      }, 1500);
    } else {
      showToast('Clipboard copy blocked by browser');
    }
  };

  const handleReplyClick = (name, bodyText) => {
    let cleanSnippet = bodyText || '';
    const match = cleanSnippet.match(/^>\s*@[^:]+:\s*"[^"]*"\s*(.*)$/s);
    if (match) cleanSnippet = match[1] || '';
    cleanSnippet = cleanSnippet.replace(/[\r\n]+/g, ' ').trim();
    if (cleanSnippet.length > 80) cleanSnippet = cleanSnippet.substring(0, 80) + '…';
    setReplyTo({ name, text: cleanSnippet });
    composeInputRef.current?.focus();
  };

  const myMessageCountInCurrent = useMemo(() => {
    return messages.filter((m) => isMyMessage(m)).length;
  }, [messages, isMyMessage]);

  const executeDeleteAllMyMessages = async () => {
    setDeletingMyMessages(true);
    try {
      const targetChannels = deleteAllAcrossChannels ? allChannels : [currentChannel];
      let totalDeleted = 0;
      const myAuthUid = lobbyAuth.currentUser?.uid;
      const mySentIds = getMySentMessageIds();

      for (const ch of targetChannels) {
        const chId = ch.id;
        const rootCol = ch.isDirectMessage ? 'directMessages' : 'channels';
        const isTargetActive = chId === currentChannel.id;
        const msgsInScope = isTargetActive ? [...messages] : getLocalMessages(chId);
        const docIdsToDelete = new Set();

        msgsInScope.forEach((m) => {
          if (isMyMessage(m)) {
            if (m.id) docIdsToDelete.add(String(m.id));
            if (m.key) docIdsToDelete.add(String(m.key));
          }
        });
        mySentIds.forEach((id) => {
          if (id && !id.startsWith('local_')) docIdsToDelete.add(String(id));
        });

        try {
          if (clientId) {
            const snapSender = await getDocs(
              query(collection(lobbyDb, rootCol, chId, 'messages'), where('senderId', '==', clientId))
            );
            snapSender.forEach((d) => docIdsToDelete.add(d.id));
          }
        } catch {}

        try {
          if (myAuthUid) {
            const snapUser = await getDocs(
              query(collection(lobbyDb, rootCol, chId, 'messages'), where('userId', '==', myAuthUid))
            );
            snapUser.forEach((d) => docIdsToDelete.add(d.id));
          }
        } catch {}

        try {
          if (linkedAccount?.usernameLower) {
            const snapAcc = await getDocs(
              query(
                collection(lobbyDb, rootCol, chId, 'messages'),
                where('accountId', '==', linkedAccount.usernameLower)
              )
            );
            snapAcc.forEach((d) => docIdsToDelete.add(d.id));
          }
        } catch {}

        for (const docId of docIdsToDelete) {
          if (docId.startsWith('local_')) continue;
          try {
            await deleteDoc(doc(lobbyDb, rootCol, chId, 'messages', docId));
            totalDeleted += 1;
          } catch {}
        }

        if (isTargetActive) {
          const remaining = messages.filter(
            (m) =>
              !isMyMessage(m) &&
              !docIdsToDelete.has(String(m.id)) &&
              !docIdsToDelete.has(String(m.key))
          );
          if (totalDeleted === 0) totalDeleted = messages.length - remaining.length;
          setMessages(remaining);
        }

        const locals = getLocalMessages(chId).filter(
          (m) =>
            !isMyMessage(m) &&
            !docIdsToDelete.has(String(m.id)) &&
            !docIdsToDelete.has(String(m.key))
        );
        try {
          localStorage.setItem(`local_messages_${chId}`, JSON.stringify(locals));
        } catch {}
      }

      if (deleteAllAcrossChannels) {
        try {
          localStorage.setItem('my_sent_message_ids', JSON.stringify([]));
        } catch {}
      }

      setDeleteAllModalOpen(false);
      showToast(
        totalDeleted > 0
          ? `🗑️ Successfully deleted ${totalDeleted} of your messages!`
          : 'No sent messages found to delete.'
      );
    } finally {
      setDeletingMyMessages(false);
    }
  };

  const handleAdminClearCurrentChannel = async () => {
    if (!isChatAdmin) return;
    setClearingChannelAdmin(true);
    try {
      const chId = currentChannel.id;
      const count = await clearChannelMessages(lobbyDb, chId);
      setMessages([]);
      setDeleteAllModalOpen(false);
      setSettingsModalOpen(false);
      showToast(
        `🗑️ Cleared ${currentChannel.isDirectMessage ? currentChannel.name : `#${currentChannel.name}`} (${count} removed)`
      );
    } catch {
      showToast('⚠️ Failed to clear channel messages');
    } finally {
      setClearingChannelAdmin(false);
    }
  };

  const handleAdminDeleteCustomChannel = async (channelToDelete) => {
    if (!isChatAdmin || !channelToDelete?.id) return;
    if (channelToDelete.id === 'general' || channelToDelete.id === 'temporary') {
      showToast('Default channels cannot be deleted — use Clear Messages instead.');
      return;
    }
    setDeletingChannelAdmin(true);
    try {
      await deleteCustomChannel(lobbyDb, channelToDelete.id);
      setLocalChannels((prev) => prev.filter((c) => c.id !== channelToDelete.id));
      setCustomChannels((prev) => prev.filter((c) => c.id !== channelToDelete.id));
      if (fallbackInviteChannel?.id === channelToDelete.id) {
        setFallbackInviteChannel(null);
      }
      if (activeChannelId === channelToDelete.id) {
        setActiveChannelId('general');
        setMessages([]);
      }
      setConfirmDeleteChanId(null);
      setDropdownOpen(false);
      setDeleteAllModalOpen(false);
      setSettingsModalOpen(false);
      showToast(`🗑️ Deleted channel #${channelToDelete.name}`);
    } catch {
      showToast('⚠️ Could not delete custom channel');
    } finally {
      setDeletingChannelAdmin(false);
    }
  };

  const handleDeleteDmTraces = async (targetChannel) => {
    const dmId = targetChannel?.id || currentChannel?.id;
    if (!dmId || !String(dmId).startsWith('dm__')) return;
    setDeletingDmThread(true);
    try {
      const scrubIds = [];
      if (activeChannelIdRef.current === dmId) {
        messages.forEach((m) => {
          if (m?.id) scrubIds.push(String(m.id));
          if (m?.key) scrubIds.push(String(m.key));
        });
      }
      getLocalMessages(dmId).forEach((m) => {
        if (m?.id) scrubIds.push(String(m.id));
        if (m?.key) scrubIds.push(String(m.key));
      });

      await deleteDmThreadAndTraces(lobbyDb, dmId, scrubIds);

      setDmThreads((prev) => prev.filter((t) => t.id !== dmId));
      setPendingDmChannel((prev) => (prev?.id === dmId ? null : prev));
      setUnreadChannels((prev) => {
        if (!prev[dmId]) return prev;
        const next = { ...prev };
        delete next[dmId];
        return next;
      });
      if (activeChannelIdRef.current === dmId) {
        setActiveChannelId('general');
        setMessages([]);
        setReplyTo(null);
      }
      setConfirmDeleteDmId(null);
      setDeleteAllModalOpen(false);
      setSettingsModalOpen(false);
      showToast('🗑️ Deleted DM conversation and all traces');
    } catch {
      showToast('⚠️ Could not delete DM conversation');
    } finally {
      setDeletingDmThread(false);
    }
  };

  const handleMutePersonForHours = useCallback(
    (target, hours) => {
      const next = muteUserForHours(target, hours);
      setMutedUsers(next);
      setMutePickerKey(null);
      const label = target?.label || target?.name || target?.senderName || target?.accountId || 'User';
      showToast(`🔇 Muted ${label} for ${hours}h`);
    },
    [showToast],
  );

  const handleUnmutePerson = useCallback(
    (muteEntryOrTarget) => {
      const entry = muteEntryOrTarget?.key
        ? muteEntryOrTarget
        : findMuteForTarget(muteEntryOrTarget, activeMutedUsers);
      if (!entry) return;
      const next = unmuteUserByKey(entry.key);
      setMutedUsers(next);
      setMutePickerKey(null);
      showToast(`🔊 Unmuted ${entry.label || 'user'}`);
    },
    [activeMutedUsers, showToast],
  );

  const executeAdminDeleteAll = async (passwordValue) => {
    const val = (passwordValue || '').trim();
    const isAuthorizedAdmin =
      isChatAdmin ||
      val === 'admin' ||
      val === '06091006Tt';

    if (!isAuthorizedAdmin) {
      showToast('⚠️ Incorrect admin password!');
      return;
    }

    setDeletingAllAdmin(true);
    try {
      const extraIds = allChannels.map((ch) => ch?.id).filter(Boolean);
      const totalDeleted = await deleteAllChatMessages(lobbyDb, extraIds);

      setMessages([]);
      setAdminPassModalInput('');
      setAdminPassSettingsInput('');
      setDeleteAllModalOpen(false);
      setSettingsModalOpen(false);
      showToast(`🗑️ Admin: Deleted all messages (${totalDeleted} removed)!`);
    } catch {
      showToast('⚠️ Error deleting messages');
    } finally {
      setDeletingAllAdmin(false);
    }
  };

  const isMuted = !isChatAdmin && Boolean(linkedAccount?.chatMuted);
  const isBanned = !isChatAdmin && Boolean(linkedAccount?.chatBanned);
  const isLobbyDisabledForUser = !isChatAdmin && linkedAccount?.lobbyChatAccess === false;
  const validName = hasAccountIdentity || effectiveChatName.length >= 2;
  const hasContent = Boolean(composeText.trim() || pastedImage);
  const sendDisabled =
    isMuted ||
    isBanned ||
    isLobbyDisabledForUser ||
    (!hasAccountIdentity && Boolean(onOpenAccountModal)) ||
    !hasContent ||
    imageProcessing ||
    sendingMessage;
  const isPerm = isPermanentChannel(currentChannel.id);

  const hasUnreadDm = useMemo(
    () => dmChannels.some((dm) => unreadChannels[dm.id] && dm.id !== currentChannel.id),
    [dmChannels, unreadChannels, currentChannel.id],
  );

  const toggleDmSidebar = () => {
    if (!isMini && typeof window !== 'undefined' && window.innerWidth >= 768) {
      setDmSidebarOpen((prev) => !prev);
    } else {
      setMiniLeftDrawerOpen((prev) => !prev);
    }
  };

  const renderDmSidebarContent = (isDrawer = false) => (
    <>
      <div className="px-2.5 py-2 border-b chat-bd flex items-center justify-between gap-1.5 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-[10px] font-black uppercase tracking-wider chat-txt truncate">
            Direct Messages
          </span>
        </div>
        <button
          type="button"
          onClick={() => (isDrawer ? setMiniLeftDrawerOpen(false) : setDmSidebarOpen(false))}
          className="p-1 rounded hover:bg-white/10 chat-txt-mute hover:chat-txt cursor-pointer shrink-0 transition-colors"
          title={isDrawer ? 'Close sidebar' : 'Collapse DM sidebar'}
          aria-label="Collapse DM sidebar"
        >
          {isDrawer ? <X className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-3 chat-scrollbar">
        {!hasAccountIdentity ? (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-2">
            <p className="text-[10px] text-amber-300 font-semibold leading-snug">
              Sign in with your account to message online users.
            </p>
            {onOpenAccountModal && (
              <button
                type="button"
                onClick={() => {
                  if (isDrawer) setMiniLeftDrawerOpen(false);
                  onOpenAccountModal();
                }}
                className="w-full py-1.5 rounded-lg chat-accent-bg text-[10px] font-black uppercase cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between px-1">
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400">
                  Online Now
                </span>
                <span className="text-[9px] font-mono font-bold text-emerald-400">
                  {onlineOtherUsers.length}
                </span>
              </div>
              {onlineOtherUsers.length === 0 ? (
                <p className="text-[10px] chat-txt-mute px-1.5 py-1 leading-snug">
                  No other users online right now.
                </p>
              ) : (
                onlineOtherUsers.map((acc) => {
                  const targetDmId = myDmIdentity ? getDmId(myDmIdentity, acc.usernameLower) : '';
                  const active = Boolean(targetDmId && currentChannel.id === targetDmId);
                  const muteTarget = { accountId: acc.usernameLower, name: acc.username, label: `@${acc.username}` };
                  const activeMute = findMuteForTarget(muteTarget, activeMutedUsers, tickNow);
                  const pickerId = `sidebar_online_${acc.usernameLower}`;
                  const pickingHours = mutePickerKey === pickerId;
                  return (
                    <div key={acc.usernameLower} className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => openDirectMessage(acc.usernameLower, acc.username)}
                          className={`flex-1 min-w-0 flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-lg text-left transition-all cursor-pointer border ${
                            active
                              ? 'chat-accent-bg border-transparent shadow-sm'
                              : 'bg-white/[0.03] hover:bg-emerald-500/15 border-transparent hover:border-emerald-500/30 chat-txt'
                          }`}
                          title={`Direct message @${acc.username}`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                            <span className="text-[11px] font-mono font-bold truncate">@{acc.username}</span>
                            {activeMute && (
                              <VolumeX className="w-2.5 h-2.5 text-amber-400 shrink-0" title={`Muted (${formatMuteRemaining(activeMute.mutedUntil, tickNow)} left)`} />
                            )}
                          </div>
                          <span
                            className={`text-[8.5px] font-black uppercase px-1.5 py-0.5 rounded shrink-0 ${
                              active
                                ? 'bg-black/20'
                                : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            DM
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (activeMute) {
                              handleUnmutePerson(activeMute);
                            } else {
                              setMutePickerKey((prev) => (prev === pickerId ? null : pickerId));
                            }
                          }}
                          className={`p-1 rounded-md cursor-pointer shrink-0 transition-colors ${
                            activeMute
                              ? 'text-amber-300 bg-amber-500/20 hover:bg-amber-500/30'
                              : 'chat-txt-mute hover:text-amber-300 hover:bg-amber-500/15'
                          }`}
                          title={
                            activeMute
                              ? `Unmute @${acc.username} (${formatMuteRemaining(activeMute.mutedUntil, tickNow)} left)`
                              : `Mute @${acc.username} for a few hours`
                          }
                          aria-label={activeMute ? `Unmute ${acc.username}` : `Mute ${acc.username}`}
                        >
                          {activeMute ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                        </button>
                      </div>
                      {pickingHours && !activeMute && (
                        <div className="flex items-center gap-1 flex-wrap px-1.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
                          <span className="text-[8.5px] font-bold text-amber-300 uppercase mr-0.5">Mute:</span>
                          {USER_MUTE_HOURS_OPTIONS.map((hrs) => (
                            <button
                              key={hrs}
                              type="button"
                              onClick={() => handleMutePersonForHours(muteTarget, hrs)}
                              className="px-1.5 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/35 text-amber-200 text-[8.5px] font-mono font-bold cursor-pointer"
                            >
                              {hrs}h
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setMutePickerKey(null)}
                            className="ml-auto p-0.5 rounded hover:bg-white/10 text-neutral-300 cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {dmChannels.length > 0 && (
              <div className="flex flex-col gap-1 border-t chat-bd pt-2">
                <span className="text-[9px] font-black uppercase tracking-wider chat-txt-mute px-1">
                  Conversations
                </span>
                {dmChannels.map((dm) => {
                  const active = currentChannel.id === dm.id;
                  const confirming = confirmDeleteDmId === dm.id;
                  const dmMuteTarget = {
                    accountId: dm.partnerId,
                    partnerId: dm.partnerId,
                    name: dm.partnerUsername || dm.name,
                    label: dm.name,
                  };
                  const dmActiveMute = findMuteForTarget(dmMuteTarget, activeMutedUsers, tickNow);
                  const dmPickerId = `sidebar_dm_${dm.id}`;
                  const dmPickingHours = mutePickerKey === dmPickerId;
                  return (
                    <div key={dm.id} className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-1 min-w-0">
                        {confirming ? (
                          <div className="flex-1 flex items-center justify-between gap-1 px-1.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/35 min-w-0">
                            <span className="text-[9px] font-bold text-rose-300 truncate">Delete traces?</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={deletingDmThread}
                                onClick={() => handleDeleteDmTraces(dm)}
                                className="px-1.5 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[8.5px] font-black uppercase cursor-pointer disabled:opacity-60"
                              >
                                {deletingDmThread ? '...' : 'Delete'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteDmId(null)}
                                className="p-0.5 rounded hover:bg-white/10 text-neutral-300 cursor-pointer"
                                title="Cancel"
                                aria-label="Cancel DM deletion"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => switchChannel(dm.id)}
                              className={`flex-1 min-w-0 flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-lg text-left transition-all cursor-pointer ${
                                active ? 'chat-accent-bg shadow-sm' : 'hover:bg-white/[0.06] chat-txt-dim hover:chat-txt'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span
                                  className={`w-2 h-2 rounded-full shrink-0 ${
                                    dm.partnerOnline ? 'bg-emerald-400' : 'bg-neutral-500/60'
                                  }`}
                                />
                                <span className="text-[11px] font-mono font-bold truncate">{dm.name}</span>
                                {dmActiveMute && (
                                  <VolumeX className="w-2.5 h-2.5 text-amber-400 shrink-0" title={`Muted (${formatMuteRemaining(dmActiveMute.mutedUntil, tickNow)} left)`} />
                                )}
                              </div>
                              {unreadChannels[dm.id] && !active && (
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (dmActiveMute) {
                                  handleUnmutePerson(dmActiveMute);
                                } else {
                                  setMutePickerKey((prev) => (prev === dmPickerId ? null : dmPickerId));
                                }
                              }}
                              className={`p-1 rounded-md cursor-pointer shrink-0 transition-colors ${
                                dmActiveMute
                                  ? 'text-amber-300 bg-amber-500/20 hover:bg-amber-500/30'
                                  : 'chat-txt-mute hover:text-amber-300 hover:bg-amber-500/15'
                              }`}
                              title={
                                dmActiveMute
                                  ? `Unmute ${dm.name} (${formatMuteRemaining(dmActiveMute.mutedUntil, tickNow)} left)`
                                  : `Mute ${dm.name} for a few hours`
                              }
                              aria-label={dmActiveMute ? `Unmute ${dm.name}` : `Mute ${dm.name}`}
                            >
                              {dmActiveMute ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDeleteDmId(dm.id);
                              }}
                              className="p-1 rounded-md text-rose-400/75 hover:text-rose-300 hover:bg-rose-500/15 cursor-pointer shrink-0 transition-colors"
                              title={`Delete all traces of DM with ${dm.name}`}
                              aria-label={`Delete DM with ${dm.name}`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                      {dmPickingHours && !dmActiveMute && !confirming && (
                        <div className="flex items-center gap-1 flex-wrap px-1.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
                          <span className="text-[8.5px] font-bold text-amber-300 uppercase mr-0.5">Mute:</span>
                          {USER_MUTE_HOURS_OPTIONS.map((hrs) => (
                            <button
                              key={hrs}
                              type="button"
                              onClick={() => handleMutePersonForHours(dmMuteTarget, hrs)}
                              className="px-1.5 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/35 text-amber-200 text-[8.5px] font-mono font-bold cursor-pointer"
                            >
                              {hrs}h
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setMutePickerKey(null)}
                            className="ml-auto p-0.5 rounded hover:bg-white/10 text-neutral-300 cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );

  return (
    <div
      id="portal-chat-root"
      data-chat-theme={theme}
      data-scheme={theme === 'light' ? 'light' : 'dark'}
      className="w-full h-full flex chat-surface chat-txt overflow-hidden select-none relative"
    >
      {/* ============ LEFT SIDEBAR 1: CHANNEL RAIL ============ */}
      {!isMini && (
        <aside className="hidden md:flex flex-col w-14 border-r chat-bd chat-surface-deep shrink-0 items-center py-3 gap-2">
          <nav className="flex flex-col gap-1.5 w-full px-1 items-center justify-start overflow-y-auto max-h-[60vh] no-scrollbar">
            {publicChannels.map((ch) => {
              const active = currentChannel.id === ch.id;
              const locked = Boolean(ch.isPasswordProtected && !unlockedChannels[ch.id]);
              const isCustom = ch.id !== 'general' && !ch.isDirectMessage;
              const remainingMins =
                isCustom && ch.createdAt
                  ? Math.max(1, Math.ceil(Math.max(0, ROOM_TTL_MS - (tickNow - ch.createdAt)) / 60000))
                  : null;

              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => switchChannel(ch.id)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all relative group cursor-pointer shrink-0 ${
                    active
                      ? 'chat-accent border chat-accent-bd chat-accent-soft'
                      : 'chat-txt-mute hover:chat-txt hover:bg-white/5'
                  }`}
                  title={`${ch.name} — ${ch.description || ''}`}
                >
                  {renderChannelGlyph(ch, locked)}
                  {unreadChannels[ch.id] && !active && (
                    <span
                      className="absolute -top-0.5 -left-0.5 flex h-2.5 w-2.5 pointer-events-none z-20"
                      aria-label="Unread messages in channel"
                    >
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-[#0b0e14]" />
                    </span>
                  )}
                  {isCustom && ch.createdAt && (
                    <span className="absolute -top-1 -right-1 text-[7px] font-mono font-black bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1 rounded-full">
                      1h
                    </span>
                  )}
                  <span className="absolute left-11 top-1/2 -translate-y-1/2 chat-surface border chat-bd2 text-[9px] chat-txt font-semibold rounded px-2 py-1 shadow-lg whitespace-nowrap hidden group-hover:block z-50">
                    <span className="font-extrabold uppercase chat-accent">#{ch.name}</span>
                    {ch.isPasswordProtected && (
                      <span className="text-[7px] text-amber-500 font-bold ml-1">(Protected)</span>
                    )}
                    <span className="block text-[8px] chat-txt-mute font-normal max-w-[160px] truncate">
                      {ch.description}
                    </span>
                    {remainingMins !== null && (
                      <span className="block text-[7px] font-mono text-rose-400 font-bold mt-0.5">
                        <Clock className="inline w-2 h-2 mr-0.5" />
                        Auto-deletes in {remainingMins}m
                      </span>
                    )}
                  </span>
                </button>
              );
            })}

            <div className="w-6 h-px bg-white/10 my-0.5 shrink-0" />

            <button
              type="button"
              onClick={() => setDmSidebarOpen((prev) => !prev)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all relative group cursor-pointer shrink-0 border ${
                dmSidebarOpen
                  ? 'chat-accent border chat-accent-bd chat-accent-soft'
                  : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
              }`}
              title={`${dmSidebarOpen ? 'Hide' : 'Show'} Direct Messages Sidebar (${onlineOtherUsers.length} online)`}
            >
              <MessageCircle className="w-4 h-4" />
              {onlineOtherUsers.length > 0 && (
                <span className="absolute -top-1 -right-1 text-[8px] font-mono font-black bg-emerald-500 text-black px-1 min-w-[14px] h-[14px] rounded-full flex items-center justify-center leading-none">
                  {onlineOtherUsers.length}
                </span>
              )}
              {hasUnreadDm && !dmSidebarOpen && (
                <span className="absolute -top-0.5 -left-0.5 flex h-2.5 w-2.5 pointer-events-none z-20">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-[#0b0e14]" />
                </span>
              )}
              <span className="absolute left-11 top-1/2 -translate-y-1/2 chat-surface border chat-bd2 text-[9px] chat-txt font-semibold rounded px-2 py-1 shadow-lg whitespace-nowrap hidden group-hover:block z-50">
                <span className="font-extrabold uppercase text-emerald-400">Direct Messages Sidebar</span>
                <span className="block text-[8px] chat-txt-mute font-normal">
                  {onlineOtherUsers.length} online user{onlineOtherUsers.length === 1 ? '' : 's'}
                </span>
              </span>
            </button>
          </nav>

          <div className="w-6 h-px bg-white/10 my-1" />

          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all border border-dashed border-white/20 hover:chat-accent-bd chat-txt-mute hover:chat-accent hover:bg-white/5 cursor-pointer shrink-0"
            title="Create Custom Channel"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setThemeModalOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all chat-txt-mute hover:chat-accent hover:bg-white/5 cursor-pointer shrink-0"
            title="Change Theme"
          >
            <Palette className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setSettingsModalOpen(true)}
            className="mt-auto w-9 h-9 flex items-center justify-center rounded-xl transition-all border border-white/10 hover:chat-accent-bd chat-txt-mute hover:chat-accent hover:bg-white/5 cursor-pointer shrink-0"
            title="Settings & Admin Controls"
          >
            <Settings className="w-4 h-4" />
          </button>
        </aside>
      )}

      {/* ============ LEFT SIDEBAR 2: DM & ONLINE USERS SIDEBAR (BESIDE CHANNEL RAIL) ============ */}
      {!isMini && dmSidebarOpen && (
        <aside className="hidden md:flex flex-col w-48 lg:w-52 border-r chat-bd chat-surface-deep shrink-0 h-full overflow-hidden">
          {renderDmSidebarContent(false)}
        </aside>
      )}

      {/* ============ MINI / MOBILE DUAL LEFT SIDEBAR DRAWER ============ */}
      {miniLeftDrawerOpen && (
        <div
          onClick={() => setMiniLeftDrawerOpen(false)}
          className={`${isMini ? 'flex' : 'flex md:hidden'} absolute inset-0 z-[65] bg-black/55 backdrop-blur-[1px]`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-full max-w-[92%] chat-surface-deep border-r chat-bd2 shadow-2xl overflow-hidden"
          >
            {/* Slim Channel Rail */}
            <aside className="flex flex-col w-10 border-r chat-bd chat-surface-deep shrink-0 items-center py-2 gap-1.5 overflow-y-auto no-scrollbar">
              {publicChannels.map((ch) => {
                const active = currentChannel.id === ch.id;
                const locked = Boolean(ch.isPasswordProtected && !unlockedChannels[ch.id]);
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => switchChannel(ch.id)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all relative cursor-pointer shrink-0 ${
                      active
                        ? 'chat-accent border chat-accent-bd chat-accent-soft'
                        : 'chat-txt-mute hover:chat-txt hover:bg-white/5'
                    }`}
                    title={`#${ch.name}`}
                  >
                    {renderChannelGlyph(ch, locked, 'w-3.5 h-3.5 shrink-0')}
                    {unreadChannels[ch.id] && !active && (
                      <span className="absolute -top-0.5 -left-0.5 h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </button>
                );
              })}

              <div className="w-5 h-px bg-white/10 my-0.5 shrink-0" />

              <button
                type="button"
                onClick={() => {
                  setMiniLeftDrawerOpen(false);
                  setCreateModalOpen(true);
                }}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-dashed border-white/20 chat-txt-mute hover:chat-accent hover:bg-white/5 cursor-pointer shrink-0"
                title="Create Custom Channel"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              {!isMini && (
                <button
                  type="button"
                  onClick={() => {
                    setMiniLeftDrawerOpen(false);
                    setThemeModalOpen(true);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg chat-txt-mute hover:chat-accent hover:bg-white/5 cursor-pointer shrink-0"
                  title="Theme"
                >
                  <Palette className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setMiniLeftDrawerOpen(false);
                  setSettingsModalOpen(true);
                }}
                className="mt-auto w-7 h-7 flex items-center justify-center rounded-lg border border-white/10 chat-txt-mute hover:chat-accent hover:bg-white/5 cursor-pointer shrink-0"
                title="Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </aside>

            {/* Adjacent DM & Online Users Sidebar */}
            <aside className="flex flex-col w-[172px] sm:w-48 h-full min-w-0 overflow-hidden">
              {renderDmSidebarContent(true)}
            </aside>
          </div>
        </div>
      )}

      {/* ============ MAIN PANEL ============ */}
      <section className="flex-1 flex flex-col h-full min-h-0 overflow-hidden chat-surface min-w-0 relative">
        {/* HEADER */}
        <header className={`${isMini ? 'px-2 py-1.5 gap-1.5' : 'px-3 py-2 gap-2'} border-b chat-bd chat-surface-deep flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              type="button"
              onClick={() => setMiniLeftDrawerOpen((prev) => !prev)}
              className={`${isMini ? 'flex' : 'flex md:hidden'} relative items-center gap-1 chat-surface-elev border chat-bd hover:border-emerald-500/40 rounded-lg px-2 py-1 text-[10px] font-mono font-bold text-emerald-400 cursor-pointer shrink-0 transition-all`}
              title="Open Channels & Direct Messages Sidebar"
            >
              <PanelLeft className="w-3.5 h-3.5 shrink-0" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>{onlineOtherUsers.length}</span>
              {hasUnreadDm && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            {!isMini && (
              <>
                <h1 className="text-[11px] font-black chat-txt tracking-tight flex items-center gap-1 uppercase truncate">
                  {currentChannel.isPasswordProtected && <Lock className="w-3 h-3 text-amber-500 shrink-0" />}
                  {currentChannel.isDirectMessage && (
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                  <span className="truncate">
                    {currentChannel.isDirectMessage ? currentChannel.name : `#${currentChannel.name}`}
                  </span>
                  {currentChannel.isDirectMessage && currentChannel.partnerOnline && (
                    <span
                      className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 ml-0.5"
                      title="Online now"
                    />
                  )}
                  {!currentChannel.isDirectMessage && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyInviteLink(currentChannel.id);
                      }}
                      title="Share invite link (bypasses password)"
                      className="ml-2 px-2 py-0.5 rounded-lg chat-accent-bg text-[9px] font-bold flex items-center gap-1 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span className="hidden sm:inline">Invite</span>
                    </button>
                  )}
                </h1>
                {currentChannel.isDirectMessage ? (
                  <>
                    <span
                      className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded shrink-0"
                      title="Private encrypted direct message"
                    >
                      <Lock className="w-2.5 h-2.5 text-emerald-400" />
                      <span className="hidden sm:inline">
                        {currentChannel.partnerOnline ? 'DM · Online' : 'Direct Message'}
                      </span>
                    </span>
                    {(() => {
                      const dmHeaderTarget = {
                        accountId: currentChannel.partnerId,
                        partnerId: currentChannel.partnerId,
                        name: currentChannel.partnerUsername || currentChannel.name,
                        label: currentChannel.name,
                      };
                      const dmHeaderMute = findMuteForTarget(dmHeaderTarget, activeMutedUsers, tickNow);
                      const dmHeaderPickerId = `header_dm_${currentChannel.id}`;
                      const dmHeaderPicking = mutePickerKey === dmHeaderPickerId;
                      if (dmHeaderMute) {
                        return (
                          <button
                            type="button"
                            onClick={() => handleUnmutePerson(dmHeaderMute)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[9px] font-bold uppercase cursor-pointer shrink-0 transition-all"
                            title={`Muted for ${formatMuteRemaining(dmHeaderMute.mutedUntil, tickNow)} — Click to unmute`}
                          >
                            <Volume2 className="w-2.5 h-2.5" />
                            <span>Unmute ({formatMuteRemaining(dmHeaderMute.mutedUntil, tickNow)})</span>
                          </button>
                        );
                      }
                      if (dmHeaderPicking) {
                        return (
                          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/35 shrink-0">
                            <span className="text-[8.5px] font-bold text-amber-300 uppercase">Mute:</span>
                            {USER_MUTE_HOURS_OPTIONS.map((hrs) => (
                              <button
                                key={hrs}
                                type="button"
                                onClick={() => handleMutePersonForHours(dmHeaderTarget, hrs)}
                                className="px-1.5 py-0.5 rounded bg-amber-500/25 hover:bg-amber-500/40 text-amber-200 text-[8.5px] font-mono font-bold cursor-pointer"
                              >
                                {hrs}h
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => setMutePickerKey(null)}
                              className="p-0.5 rounded hover:bg-white/10 text-neutral-300 cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        );
                      }
                      return (
                        <button
                          type="button"
                          onClick={() => setMutePickerKey(dmHeaderPickerId)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[9px] font-bold uppercase cursor-pointer shrink-0 transition-all"
                          title={`Mute ${currentChannel.name} for a few hours`}
                        >
                          <VolumeX className="w-2.5 h-2.5" />
                          <span className="hidden lg:inline">Mute</span>
                        </button>
                      );
                    })()}
                    {confirmDeleteDmId === currentChannel.id ? (
                      <div className="inline-flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={deletingDmThread}
                          onClick={() => handleDeleteDmTraces(currentChannel)}
                          className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[9px] font-black uppercase cursor-pointer disabled:opacity-60"
                        >
                          {deletingDmThread ? 'Deleting...' : 'Delete All Traces'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteDmId(null)}
                          className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[9px] font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteDmId(currentChannel.id)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[9px] font-bold uppercase cursor-pointer shrink-0 transition-all"
                        title="Permanently delete this DM conversation, all messages, and local traces"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                        <span className="hidden lg:inline">Delete DM</span>
                      </button>
                    )}
                  </>
                ) : isPerm ? (
                  <span
                    className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded shrink-0"
                    title="Default section: Messages are saved and never deleted"
                  >
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                    <span className="hidden sm:inline">Saved (No 1h delete)</span>
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 text-[9px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded shrink-0"
                    title="Messages are automatically deleted 1 hour after sending"
                  >
                    <Clock className="w-2.5 h-2.5 text-rose-400" />
                    <span className="hidden sm:inline">1h auto-delete</span>
                  </span>
                )}
                {isChatAdmin && currentChannel.id !== 'general' && currentChannel.id !== 'temporary' && !currentChannel.isDirectMessage && (
                  confirmDeleteChanId === currentChannel.id ? (
                    <div className="inline-flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={deletingChannelAdmin}
                        onClick={() => handleAdminDeleteCustomChannel(currentChannel)}
                        className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[9px] font-black uppercase cursor-pointer"
                      >
                        {deletingChannelAdmin ? '...' : 'Delete Room'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteChanId(null)}
                        className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[9px] font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteChanId(currentChannel.id)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[9px] font-bold uppercase cursor-pointer shrink-0 transition-all"
                      title={`Admin: Delete #${currentChannel.name}`}
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                      <span className="hidden lg:inline">Delete Room</span>
                    </button>
                  )
                )}
              </>
            )}
          </div>

          {!isMini && (
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={toggleDmSidebar}
                className={`flex items-center gap-1.5 chat-surface-elev border rounded-lg px-2 py-1 text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  dmSidebarOpen
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                }`}
                title={
                  onlineUsernames.length > 0
                    ? `Online now: ${onlineUsernames.join(', ')} — Toggle DM sidebar`
                    : 'Toggle Direct Messages Sidebar'
                }
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <Users className="w-3 h-3 shrink-0" />
                <span>{onlineOtherUsers.length} online · DMs</span>
              </button>

              {hasAccountIdentity ? (
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenAccountModal) onOpenAccountModal();
                  }}
                  className={`flex items-center gap-1.5 chat-surface-elev border chat-accent-bd rounded-lg px-2.5 py-1 ${
                    onOpenAccountModal ? 'cursor-pointer hover:bg-white/5' : ''
                  }`}
                  title={
                    isOwnerSession
                      ? 'Signed in as Owner Admin'
                      : 'Signed in via assigned account — chat identity is synced with your account'
                  }
                >
                  <ShieldCheck className="w-3 h-3 chat-accent shrink-0" />
                  <span className="text-[11px] font-black chat-txt font-mono">
                    {isAccountLinked ? `@${linkedAccount.username}` : 'Owner'}
                  </span>
                  {isChatAdmin && (
                    <span className="text-[8.5px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded border bg-amber-500/20 border-amber-500/50 text-amber-300 flex items-center gap-0.5">
                      <Shield className="w-2.5 h-2.5" />
                      <span>Admin</span>
                    </span>
                  )}
                  {isAccountLinked && linkedAccount.roleBadge && (
                    <span
                      className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded border"
                      style={BADGE_STYLE_MAP[linkedAccount.badgeColor] || BADGE_STYLE_MAP.cyan}
                    >
                      {linkedAccount.roleBadge}
                    </span>
                  )}
                  {isMuted && (
                    <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Muted
                    </span>
                  )}
                </button>
              ) : onOpenAccountModal ? (
                <button
                  type="button"
                  onClick={onOpenAccountModal}
                  className="flex items-center gap-1.5 chat-accent-bg rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider cursor-pointer hover:opacity-90 transition-all"
                  title="Sign in with your account to chat"
                >
                  <Lock className="w-3 h-3 shrink-0" />
                  <span>Account Sign In</span>
                </button>
              ) : (
                <div
                  className="flex items-center gap-1.5 chat-surface-elev border chat-bd rounded-lg px-2.5 py-1 focus-within:chat-accent-bd"
                  title="Your temporary chat nickname"
                >
                  <span className="text-[9px] uppercase font-black chat-txt-mute tracking-wider">Nick:</span>
                  <input
                    type="text"
                    value={nickInput}
                    onChange={(e) => setNickInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        saveNickname(nickInput);
                      }
                    }}
                    onBlur={() => {
                      const trimmed = nickInput.trim();
                      if (trimmed.length >= 2 && !tempNick) saveNickname(trimmed);
                      else if (tempNick && trimmed.length < 2) setNickInput(tempNick);
                    }}
                    placeholder="Set nickname"
                    minLength={2}
                    maxLength={16}
                    className="bg-transparent text-[11px] chat-txt outline-none w-24 chat-placeholder-mute font-bold focus:chat-accent"
                  />
                </div>
              )}

              <div className="flex items-center gap-1 chat-surface-elev border chat-bd rounded-lg px-2 py-1">
                <Search className="w-3 h-3 chat-txt-mute shrink-0" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter…"
                  className="bg-transparent text-[10px] chat-txt-dim outline-none w-16 md:w-20 chat-placeholder-mute"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-1.5 shrink-0">
            {isChatAdmin && (
              <button
                type="button"
                onClick={() => setBroadcastModalOpen(true)}
                className="relative chat-surface-elev border border-amber-500/35 hover:border-amber-500/70 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm shrink-0"
                title="Admin: Message Everyone (Global Broadcast)"
              >
                <Megaphone className="w-3.5 h-3.5 shrink-0" />
                {Boolean(workspaceConfig?.broadcastMessage) && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setDeleteAllAcrossChannels(false);
                setDeleteAllModalOpen(true);
              }}
              className="chat-surface-elev border border-rose-500/30 hover:border-rose-500/60 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm shrink-0"
              title={isChatAdmin ? 'Admin Delete / Clear Messages & Channels' : 'Delete all messages you have sent'}
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => setSettingsModalOpen(true)}
              className="chat-surface-elev border chat-bd hover:chat-accent-bd chat-txt-dim hover:chat-accent w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm shrink-0"
              title="Settings & Admin Controls"
            >
              <Settings className="w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Mobile / Mini Channel Dropdown */}
            <div ref={dropdownRef} className={`${isMini ? 'block' : 'md:hidden'} relative shrink-0`}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen((prev) => !prev);
                }}
                className={`relative chat-surface-elev border chat-bd py-1 ${isMini ? 'px-2' : 'px-2.5'} rounded-lg text-[10px] font-extrabold uppercase outline-none chat-accent flex items-center gap-1 cursor-pointer hover:bg-white/5 active:scale-95 transition-all shadow-sm`}
              >
                <span className={`truncate ${isMini ? 'max-w-[64px]' : 'max-w-[95px]'} font-mono`}>
                  {isCurrentLocked ? '🔒 ' : ''}
                  {currentChannel.isDirectMessage ? '' : '#'}
                  {currentChannel.name}
                </span>
                {Object.keys(unreadChannels).length > 0 && (
                  <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" aria-label="Unread room message" />
                )}
                <ChevronDown className="w-3 h-3 chat-txt-mute shrink-0" />
              </button>

              {dropdownOpen && (
                <div className={`absolute right-0 top-full mt-1.5 ${isMini ? 'w-52' : 'w-60'} max-h-[65vh] overflow-y-auto chat-surface-elev border chat-bd rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-1`}>
                  {publicChannels.map((c) => {
                    const active = currentChannel.id === c.id;
                    const locked = Boolean(c.isPasswordProtected && !unlockedChannels[c.id]);
                    const isCustom = c.id !== 'general' && !c.isDirectMessage;
                    const remMins =
                      isCustom && c.createdAt
                        ? Math.max(1, Math.ceil((ROOM_TTL_MS - (tickNow - c.createdAt)) / 60000))
                        : null;
                    return (
                      <div key={c.id} className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => switchChannel(c.id)}
                          className={`flex-1 min-w-0 text-left px-2.5 py-2 rounded-lg flex items-center justify-between text-[11px] font-bold transition-all cursor-pointer ${
                            active ? 'chat-accent-bg shadow-sm' : 'chat-txt-dim hover:chat-txt hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 truncate">
                            {renderChannelGlyph(c, locked, 'w-3.5 h-3.5 shrink-0 opacity-85')}
                            <span className="truncate font-mono uppercase tracking-wide">#{c.name}</span>
                            {unreadChannels[c.id] && !active && (
                              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                            )}
                          </div>
                          {remMins !== null && (
                            <span className="text-[8.5px] font-mono text-rose-400 font-bold ml-auto shrink-0 px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                              {remMins}m left
                            </span>
                          )}
                        </button>
                        {isChatAdmin && isCustom && c.id !== 'temporary' && (
                          <button
                            type="button"
                            disabled={deletingChannelAdmin}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdminDeleteCustomChannel(c);
                            }}
                            className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 cursor-pointer shrink-0 transition-all"
                            title={`Admin: Delete #${c.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}

                  <div className="my-1 border-t chat-bd opacity-30" />
                  <div className="px-2 py-0.5 flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-emerald-400">
                    <span>Direct Messages</span>
                    <span>{onlineOtherUsers.length} online</span>
                  </div>
                  {dmChannels.map((c) => {
                    const active = currentChannel.id === c.id;
                    return (
                      <div key={c.id} className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => switchChannel(c.id)}
                          className={`flex-1 min-w-0 text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] font-bold transition-all cursor-pointer ${
                            active ? 'chat-accent-bg shadow-sm' : 'chat-txt-dim hover:chat-txt hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 truncate">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                c.partnerOnline ? 'bg-emerald-400' : 'bg-neutral-500/60'
                              }`}
                            />
                            <span className="truncate font-mono">{c.name}</span>
                            {unreadChannels[c.id] && !active && (
                              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                            )}
                          </div>
                        </button>
                        <button
                          type="button"
                          disabled={deletingDmThread}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen(false);
                            handleDeleteDmTraces(c);
                          }}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 cursor-pointer shrink-0 transition-all disabled:opacity-50"
                          title={`Delete DM & all traces with ${c.name}`}
                          aria-label={`Delete DM with ${c.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      setMiniLeftDrawerOpen(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2 text-[10px] font-black uppercase text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Open DM Sidebar</span>
                    </span>
                    <span className="font-mono text-[9px]">{onlineOtherUsers.length}</span>
                  </button>

                  <div className="my-1 border-t chat-bd opacity-30" />
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      setCreateModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-[10.5px] font-black uppercase text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5 text-white" />
                    <span>CREATE CHANNEL (1H TTL)</span>
                  </button>
                </div>
              )}
            </div>

            {!isMini && (
              <button
                type="button"
                onClick={() => setThemeModalOpen(true)}
                className="md:hidden p-1.5 hover:bg-white/10 chat-txt-dim rounded transition-all cursor-pointer"
                title="Theme"
              >
                <Palette className="w-4 h-4" />
              </button>
            )}

            {onClose && !isMini && (
              <button
                type="button"
                onClick={onClose}
                className="md:hidden p-1.5 hover:bg-white/10 chat-txt-dim rounded transition-all cursor-pointer"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* MOBILE / MINI LINKED ACCOUNT BAR */}
        {hasAccountIdentity && (
          <div
            className={`${isMini ? 'flex' : 'flex sm:hidden'} items-center justify-between gap-2 px-3 py-1.5 border-b chat-bd chat-surface-elev shrink-0`}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <ShieldCheck className="w-3 h-3 chat-accent shrink-0" />
              <span className="text-[11px] font-black chat-txt font-mono truncate">
                {isAccountLinked ? `@${linkedAccount.username}` : 'Owner'}
              </span>
              {isChatAdmin && (
                <span className="text-[8.5px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded border bg-amber-500/20 border-amber-500/50 text-amber-300 shrink-0">
                  Admin
                </span>
              )}
              {isAccountLinked && linkedAccount.roleBadge && (
                <span
                  className="text-[8.5px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0"
                  style={BADGE_STYLE_MAP[linkedAccount.badgeColor] || BADGE_STYLE_MAP.cyan}
                >
                  {linkedAccount.roleBadge}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {currentChannel.isDirectMessage && (() => {
                const miniDmTarget = {
                  accountId: currentChannel.partnerId,
                  partnerId: currentChannel.partnerId,
                  name: currentChannel.partnerUsername || currentChannel.name,
                  label: currentChannel.name,
                };
                const miniDmMute = findMuteForTarget(miniDmTarget, activeMutedUsers, tickNow);
                const miniPickerId = `mini_dm_${currentChannel.id}`;
                if (miniDmMute) {
                  return (
                    <button
                      type="button"
                      onClick={() => handleUnmutePerson(miniDmMute)}
                      className="text-[9px] font-mono font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/35 px-1.5 py-0.5 rounded-md flex items-center gap-1 cursor-pointer transition-all"
                      title={`Muted (${formatMuteRemaining(miniDmMute.mutedUntil, tickNow)} left) — Click to unmute`}
                    >
                      <Volume2 className="w-2.5 h-2.5" />
                      <span>{formatMuteRemaining(miniDmMute.mutedUntil, tickNow)}</span>
                    </button>
                  );
                }
                if (mutePickerKey === miniPickerId) {
                  return (
                    <div className="inline-flex items-center gap-0.5 bg-amber-500/15 border border-amber-500/35 rounded-md px-1 py-0.5">
                      {USER_MUTE_HOURS_OPTIONS.map((hrs) => (
                        <button
                          key={hrs}
                          type="button"
                          onClick={() => handleMutePersonForHours(miniDmTarget, hrs)}
                          className="px-1 py-0.5 rounded bg-amber-500/25 hover:bg-amber-500/45 text-amber-200 text-[8px] font-mono font-bold cursor-pointer"
                        >
                          {hrs}h
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setMutePickerKey(null)}
                        className="p-0.5 rounded hover:bg-white/10 text-neutral-300 cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  );
                }
                return (
                  <button
                    type="button"
                    onClick={() => setMutePickerKey(miniPickerId)}
                    className="text-[9px] font-mono font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.5 rounded-md flex items-center gap-1 cursor-pointer transition-all"
                    title={`Mute ${currentChannel.name} for a few hours`}
                  >
                    <VolumeX className="w-2.5 h-2.5" />
                    <span>Mute</span>
                  </button>
                );
              })()}
              <button
                type="button"
                onClick={() => setMiniLeftDrawerOpen((prev) => !prev)}
                className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 rounded-md flex items-center gap-1 cursor-pointer transition-all"
                title="Open Direct Messages & Online Users Sidebar"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>DM · {onlineOtherUsers.length}</span>
              </button>
              {isMuted && (
                <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                  Muted
                </span>
              )}
            </div>
          </div>
        )}

        {/* ACCOUNT SIGN-IN OR NICKNAME BAR */}
        {!hasAccountIdentity && onOpenAccountModal ? (
          <div className="flex items-center justify-between p-2 px-3 border-b chat-bd bg-amber-500/10 border-amber-500/20 shrink-0 transition-all">
            <span className="text-[9.5px] uppercase font-black text-amber-300 tracking-wider">
              Sign in with your assigned account to chat
            </span>
            <button
              type="button"
              onClick={onOpenAccountModal}
              className="chat-accent-bg text-[10px] font-extrabold px-2.5 py-1 rounded-lg transition-all active:scale-95 cursor-pointer shrink-0"
            >
              Sign In
            </button>
          </div>
        ) : !hasAccountIdentity && !validName ? (
          <div className="flex items-center justify-between p-2 px-3 border-b chat-bd bg-amber-500/10 border-amber-500/20 shrink-0 transition-all">
            <span className="text-[9px] sm:text-[10px] uppercase font-black text-amber-400 tracking-wider">
              Enter a Nickname to speak, DO NOT USE YOUR REAL NAME
            </span>
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <input
                type="text"
                value={nickInput}
                onChange={(e) => setNickInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    saveNickname(nickInput);
                  }
                }}
                placeholder="Name"
                minLength={2}
                maxLength={16}
                className="chat-surface-deep text-[11px] px-2.5 py-1 rounded-lg outline-none border chat-bd focus:chat-accent-bd text-right max-w-[120px] font-extrabold chat-txt chat-placeholder-mute"
              />
              <button
                type="button"
                onClick={() => saveNickname(nickInput)}
                className="chat-accent-bg text-[10px] font-extrabold px-2.5 py-1 rounded-lg transition-all active:scale-95 cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        ) : null}

        {/* DELETE / EPHEMERAL NOTICE BANNER */}
        {!isMini && !tipDismissed && (
          <div className="flex items-center justify-between p-2 px-3 border-b chat-bd bg-blue-500/10 border-blue-500/20 shrink-0 text-left transition-all">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Info className="w-3.5 h-3.5" />
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-200 leading-tight">
                <strong className="text-blue-300 font-bold">Want messages deleted?</strong> #general is permanent.
                Switch to{' '}
                <button
                  type="button"
                  onClick={() => {
                    switchChannel('temporary');
                    showToast('Switched to #1h-ephemeral (Auto-Delete Section)');
                  }}
                  className="text-rose-400 font-bold underline hover:text-rose-300 cursor-pointer"
                >
                  #1h-ephemeral (Auto-Delete Section)
                </button>
                , click 🗑️ on any message, or{' '}
                <button
                  type="button"
                  onClick={() => {
                    setDeleteAllAcrossChannels(false);
                    setDeleteAllModalOpen(true);
                  }}
                  className="text-rose-400 font-bold underline hover:text-rose-300 cursor-pointer"
                >
                  delete all your messages
                </button>
                .
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setTipDismissed(true);
                try {
                  localStorage.setItem('chat_tip_dismissed', 'true');
                } catch {}
              }}
              className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg shrink-0 ml-2 cursor-pointer"
              title="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* BANNED / DISABLED GATE OR UNLOCK GATE OR MESSAGES */}
        {isBanned || isLobbyDisabledForUser ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
            <div className="w-16 h-16 rounded-full bg-rose-500/15 flex items-center justify-center mb-4 border border-rose-500/30">
              <Ban className="w-7 h-7 text-rose-400" />
            </div>
            <h2 className="text-sm font-black uppercase text-rose-300 tracking-wider">
              {isBanned ? 'Lobby Chat Access Restricted' : 'Lobby Chat Disabled'}
            </h2>
            <p className="chat-txt-dim text-[11px] mt-1.5 max-w-xs leading-relaxed">
              Account <span className="font-mono font-bold text-white">@{linkedAccount?.username || 'user'}</span>{' '}
              {isBanned
                ? 'has been banned from Lobby Chat by an administrator.'
                : 'does not currently have Lobby Chat access enabled.'}
            </p>
          </div>
        ) : isCurrentLocked ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20">
              <Lock className="w-7 h-7 text-amber-500 animate-pulse" />
            </div>
            <h2 className="text-sm font-black uppercase chat-txt tracking-wider">#{currentChannel.name}</h2>
            <p className="chat-txt-dim text-[11px] mt-1 max-w-xs leading-relaxed">
              {currentChannel.description || 'This channel is password protected. Enter the passcode to join.'}
            </p>
            <form onSubmit={handleUnlockChannel} className="mt-5 w-full max-w-[220px] space-y-2">
              <div className="relative flex items-center">
                <Key className="absolute left-3 w-4 h-4 chat-txt-mute" />
                <input
                  type="password"
                  value={unlockCode}
                  onChange={(e) => setUnlockCode(e.target.value)}
                  placeholder="Join Code"
                  required
                  className="w-full chat-surface-elev border chat-bd focus:chat-accent-bd rounded-xl py-2.5 pl-10 pr-4 text-sm chat-txt outline-none chat-placeholder-mute font-mono tracking-widest text-center"
                />
              </div>
              <button
                type="submit"
                className="w-full chat-accent-bg text-sm font-black uppercase py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                Join Channel
              </button>
            </form>
            <div className="mt-4 pt-3 border-t chat-bd w-full max-w-[220px] flex flex-col items-center gap-1.5">
              <span className="text-[9px] chat-txt-mute font-semibold">Have an invite link?</span>
              <button
                type="button"
                onClick={() => copyInviteLink(currentChannel.id)}
                className="w-full chat-surface-elev border chat-bd hover:chat-accent-bd rounded-xl py-2 px-3 text-[10px] font-bold chat-accent flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Copy / Share Invite Link</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* MESSAGES */}
            <div
              ref={messagesPanelRef}
              className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-3 chat-scrollbar chat-selectable"
            >
              {mutedHiddenCount > 0 && (
                <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-[10px] text-amber-300 select-none">
                  <span className="flex items-center gap-1.5 min-w-0 truncate">
                    <VolumeX className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                      {mutedHiddenCount} message{mutedHiddenCount === 1 ? '' : 's'} from muted user{mutedHiddenCount === 1 ? '' : 's'} {showMutedMessages ? 'shown' : 'hidden'}
                    </span>
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowMutedMessages((prev) => !prev)}
                      className="px-1.5 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 font-bold cursor-pointer"
                    >
                      {showMutedMessages ? 'Hide' : 'Show'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettingsModalOpen(true)}
                      className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              )}
              {displayedMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 select-none max-w-sm mx-auto">
                  <div className="w-12 h-12 rounded-2xl chat-surface-elev border chat-bd flex items-center justify-center mb-3 shadow-sm">
                    {currentChannel.isDirectMessage ? (
                      <MessageCircle className="w-6 h-6 chat-accent" />
                    ) : (
                      <Hash className="w-6 h-6 chat-accent" />
                    )}
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-wider chat-txt">
                    {searchFilter
                      ? 'No Messages Found'
                      : currentChannel.isDirectMessage
                        ? currentChannel.name
                        : `#${currentChannel.name}`}
                  </h3>
                  <p className="text-[11px] chat-txt-dim mt-1.5 leading-relaxed">
                    {searchFilter
                      ? 'Try searching for a different keyword or clear the search filter.'
                      : currentChannel.isDirectMessage
                        ? 'Send a private encrypted direct message.'
                        : isPerm
                          ? 'Messages in this default section are permanently saved.'
                          : 'Messages in this room are temporary and automatically delete 1 hour after being sent.'}
                  </p>
                </div>
              ) : (
                (() => {
                  let prevDate = null;
                  return displayedMessages.map((m) => {
                    const msgTs = m.timestamp || tickNow;
                    const dateLabel = formatDateLabel(msgTs);
                    const showDate = dateLabel !== prevDate;
                    prevDate = dateLabel;

                    const hue = getUsernameHue(m.name);
                    const color = `hsl(${hue}, 70%, 65%)`;
                    const replyInfo = getReplyInfo(m);
                    const bodyText = replyInfo ? replyInfo.cleanBody : m.text || '';
                    const isOwner = isMyMessage(m);
                    const imgSrc = safeChatImageUrl(m.imageUrl);
                    const copyContent = bodyText ? (m.imageUrl ? `${bodyText}\n${m.imageUrl}` : bodyText) : m.imageUrl || '';
                    const msgKey = m.id || m.key || `${m.name}_${msgTs}`;
                    const isCopied = copiedMsgId === (m.id || m.key);

                    let timeRemainingStr = null;
                    if (!isPerm) {
                      const remainingMs = Math.max(0, MESSAGE_TTL_MS - (tickNow - msgTs));
                      const remainingMins = Math.max(0, Math.ceil(remainingMs / 60000));
                      timeRemainingStr = remainingMins <= 1 ? '<1m' : `${remainingMins}m`;
                    }

                    const senderOnline = Boolean(m.accountId && onlineUserSet.has(String(m.accountId).toLowerCase()));
                    return (
                      <div key={msgKey}>
                        {showDate && (
                          <div className="flex items-center gap-2 py-1.5 select-none">
                            <div className="flex-1 h-px bg-white/5" />
                            <span className="text-[8px] font-bold font-mono chat-txt-mute uppercase tracking-wider">
                              {dateLabel}
                            </span>
                            <div className="flex-1 h-px bg-white/5" />
                          </div>
                        )}
                        <div className="relative flex flex-col gap-0.5 hover:bg-white/[0.03] px-2.5 py-1.5 rounded-xl transition-all group">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {senderOnline && (
                              <span
                                className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
                                title="User is online"
                              />
                            )}
                            <span className="text-[11px] font-extrabold font-mono tracking-tight" style={{ color }}>
                              {m.name || 'anonymous'}
                            </span>
                            {m.isRegistered && (
                              <BadgeCheck className="w-3 h-3 chat-accent shrink-0" title="Verified Account" />
                            )}
                            {m.isAdmin && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider border bg-amber-500/20 border-amber-500/50 text-amber-300 leading-tight">
                                <Shield className="w-2.5 h-2.5" />
                                <span>Admin</span>
                              </span>
                            )}
                            {m.roleBadge && !(m.isAdmin && m.roleBadge.trim().toLowerCase() === 'admin') && (
                              <span
                                className="inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider border leading-tight"
                                style={BADGE_STYLE_MAP[m.badgeColor] || BADGE_STYLE_MAP.cyan}
                              >
                                {m.roleBadge}
                              </span>
                            )}
                            {timeRemainingStr && (
                              <span
                                className="inline-flex items-center gap-1 text-[8px] font-mono chat-txt-mute"
                                title={`Message auto-deletes in ${timeRemainingStr}`}
                              >
                                <Clock className="w-2.5 h-2.5 opacity-60" />
                                <span>{timeRemainingStr}</span>
                              </span>
                            )}
                            <span className="text-[8px] chat-txt-mute font-mono ml-auto flex items-center gap-1.5 shrink-0">
                              <span>{formatTime(msgTs)}</span>
                              {(isOwner || isChatAdmin) && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteSingleMessage(m);
                                  }}
                                  className="p-0.5 rounded text-rose-400/75 hover:text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer"
                                  title={isOwner ? 'Delete your message' : 'Admin: Delete message'}
                                  aria-label="Delete message"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </span>
                          </div>

                          {replyInfo?.replyToName && (
                            <div className="border-l-2 chat-accent-bd pl-2.5 py-0.5 my-1 rounded-r bg-white/[0.03]">
                              <span className="text-[9.5px] font-bold chat-txt-mute block tracking-tight">
                                {(m.name || '').trim().toLowerCase() === effectiveChatName.toLowerCase()
                                  ? 'You'
                                  : m.name || 'User'}{' '}
                                replied to{' '}
                                <span className="chat-accent font-extrabold font-mono">@{replyInfo.replyToName}</span>
                              </span>
                              <p className="text-[11px] chat-txt-dim truncate font-mono mt-0.5">
                                {replyInfo.replyToText}
                              </p>
                            </div>
                          )}

                          {bodyText && (
                            <div className="chat-msg-text text-[12px] leading-normal break-words chat-txt">
                              {bodyText}
                            </div>
                          )}

                          {imgSrc && (
                            <img
                              src={imgSrc}
                              alt={`Image shared by ${m.name || 'anonymous'}`}
                              loading="lazy"
                              decoding="async"
                              className="mt-1 max-w-full rounded-xl border chat-bd object-contain"
                              style={{ maxWidth: 'min(100%, 420px)', maxHeight: '360px' }}
                            />
                          )}

                          {/* Hover / Focus Action Bar */}
                          <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 flex items-center flex-wrap gap-1.5 mt-1 text-[9px] transition-opacity select-none">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyMessage(m, copyContent);
                              }}
                              className="flex items-center gap-1 text-[9px] font-bold chat-txt-dim hover:chat-accent hover:bg-white/10 px-2 py-0.5 rounded-md transition-all cursor-pointer chat-surface-elev border chat-bd"
                              title="Copy message"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-2.5 h-2.5 text-sky-400" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReplyClick(m.name || 'User', bodyText);
                              }}
                              className="flex items-center gap-1 text-[9px] font-bold chat-txt-dim hover:chat-accent hover:bg-white/10 px-2 py-0.5 rounded-md transition-all cursor-pointer chat-surface-elev border chat-bd"
                              title="Reply"
                            >
                              <Reply className="w-2.5 h-2.5 chat-accent" />
                              <span>Reply</span>
                            </button>

                            {!isOwner &&
                              m.accountId &&
                              m.accountId !== myDmIdentity &&
                              (onlineUserSet.has(String(m.accountId).toLowerCase()) ||
                                dmThreads.some((t) => t.partnerId === String(m.accountId).toLowerCase())) && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDirectMessage(m.accountId, m.name);
                                  }}
                                  className="flex items-center gap-1 text-[9px] font-bold chat-txt-dim hover:text-emerald-300 hover:bg-emerald-500/15 px-2 py-0.5 rounded-md transition-all cursor-pointer chat-surface-elev border chat-bd"
                                  title={`Direct Message ${m.name || 'user'}`}
                                >
                                  <MessageCircle className="w-2.5 h-2.5 text-emerald-400" />
                                  <span>DM</span>
                                </button>
                              )}

                            {!isOwner && (() => {
                              const msgMuteTarget = {
                                accountId: m.accountId || null,
                                senderId: m.senderId || null,
                                name: m.name || 'User',
                                label: m.accountId && m.accountId !== '__owner__' ? `@${m.name || m.accountId}` : m.name || 'User',
                              };
                              const msgMuteEntry = findMuteForTarget(msgMuteTarget, activeMutedUsers, tickNow);
                              const msgPickerId = `msg_${msgKey}`;
                              const msgTargetKey = buildMuteTargetKey(msgMuteTarget);
                              if (!msgTargetKey) return null;
                              if (msgMuteEntry) {
                                return (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUnmutePerson(msgMuteEntry);
                                    }}
                                    className="flex items-center gap-1 text-[9px] font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 px-2 py-0.5 rounded-md transition-all cursor-pointer border border-amber-500/35"
                                    title={`Unmute ${msgMuteEntry.label} (${formatMuteRemaining(msgMuteEntry.mutedUntil, tickNow)} left)`}
                                  >
                                    <Volume2 className="w-2.5 h-2.5" />
                                    <span>Unmute ({formatMuteRemaining(msgMuteEntry.mutedUntil, tickNow)})</span>
                                  </button>
                                );
                              }
                              if (mutePickerKey === msgPickerId) {
                                return (
                                  <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/35"
                                  >
                                    <span className="text-[8.5px] font-bold text-amber-300">Mute:</span>
                                    {USER_MUTE_HOURS_OPTIONS.map((hrs) => (
                                      <button
                                        key={hrs}
                                        type="button"
                                        onClick={() => handleMutePersonForHours(msgMuteTarget, hrs)}
                                        className="px-1.5 py-0.5 rounded bg-amber-500/25 hover:bg-amber-500/45 text-amber-200 font-mono font-bold cursor-pointer"
                                      >
                                        {hrs}h
                                      </button>
                                    ))}
                                    <button
                                      type="button"
                                      onClick={() => setMutePickerKey(null)}
                                      className="p-0.5 rounded hover:bg-white/10 text-neutral-300 cursor-pointer"
                                      title="Cancel"
                                    >
                                      <X className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                );
                              }
                              return (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMutePickerKey(msgPickerId);
                                  }}
                                  className="flex items-center gap-1 text-[9px] font-bold chat-txt-dim hover:text-amber-300 hover:bg-amber-500/15 px-2 py-0.5 rounded-md transition-all cursor-pointer chat-surface-elev border chat-bd"
                                  title={`Mute ${m.name || 'user'} for a few hours`}
                                >
                                  <VolumeX className="w-2.5 h-2.5 text-amber-400" />
                                  <span>Mute</span>
                                </button>
                              );
                            })()}

                            {(isOwner || isChatAdmin) && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSingleMessage(m);
                                }}
                                className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-md chat-surface-elev border chat-bd font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer"
                                title={isOwner ? 'Delete your message' : 'Admin: Delete message'}
                              >
                                <Trash2 className="w-3 h-3 text-rose-400" />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()
              )}
            </div>

            {/* COMPOSER */}
            <footer className={`${isMini ? 'p-1.5' : 'p-2.5'} border-t chat-bd chat-surface-deep shrink-0`}>
              {isMuted && (
                <div className="flex items-center gap-2 px-3 py-2 mb-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
                  <VolumeX className="w-3.5 h-3.5 shrink-0" />
                  <span>You are currently muted in Lobby Chat by an administrator and cannot send messages.</span>
                </div>
              )}

              {replyTo && (
                <div className="flex items-center justify-between p-2 rounded-xl chat-surface-elev border chat-accent-bd mb-2 text-left">
                  <div className="min-w-0 flex-1 border-l-2 chat-accent-bd pl-2">
                    <span className="text-[9.5px] font-bold chat-txt-mute uppercase tracking-wider flex items-center gap-1">
                      <Reply className="w-3 h-3 chat-accent" />
                      <span>
                        Replying to <span className="chat-accent font-extrabold font-mono">@{replyTo.name}</span>
                      </span>
                    </span>
                    <p className="text-[11px] chat-txt-dim truncate font-mono mt-0.5">{replyTo.text}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className="p-1 chat-txt-mute hover:chat-txt hover:bg-white/10 rounded-lg cursor-pointer shrink-0 ml-2"
                    title="Cancel Reply"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {pastedImage && (
                <div className="chat-surface-elev border chat-bd rounded-xl p-2 mb-2" role="status" aria-live="polite">
                  <div className="flex items-center gap-3">
                    <img
                      src={pastedImage.dataUrl}
                      alt="Pasted image preview"
                      className="w-16 h-16 object-contain rounded-lg chat-surface-deep"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold chat-txt">Image attached</p>
                      <p className="text-[10px] chat-txt-mute truncate">
                        {pastedImage.width} × {pastedImage.height} · {Math.ceil(pastedImage.bytes / 1024)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={clearPastedImage}
                      aria-label="Remove attached image"
                      className="p-2 chat-txt-mute hover:chat-txt rounded-lg cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {(!isMini || imageProcessing || imagePasteStatus !== 'Paste an image with Ctrl+V / ⌘V') && (
                <p className="text-[10px] chat-txt-mute mb-1 truncate" aria-live="polite">
                  {imagePasteStatus}
                </p>
              )}

              <form
                onSubmit={handleSendMessage}
                className={`flex items-center gap-1.5 chat-surface-elev border chat-bd rounded-xl p-1 transition-all focus-within:chat-accent-bd ${
                  isMuted || (!validName && !hasContent) ? 'opacity-60' : ''
                }`}
              >
                <input
                  ref={composeInputRef}
                  type="text"
                  value={composeText}
                  onChange={(e) => setComposeText(e.target.value)}
                  onPaste={handleImagePaste}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isMuted || (!hasAccountIdentity && Boolean(onOpenAccountModal))}
                  maxLength={500}
                  placeholder={
                    isMuted
                      ? 'Muted by admin — read-only mode'
                      : !hasAccountIdentity && onOpenAccountModal
                        ? 'Sign in with your account to send messages…'
                        : currentChannel.isDirectMessage
                          ? `Message ${currentChannel.name}…`
                          : validName
                            ? 'Write message… (type @ to mention)'
                            : 'Set nickname above or start typing…'
                  }
                  className="flex-1 bg-transparent border-none text-[12px] chat-txt chat-placeholder-mute pl-2 py-1.5 outline-none font-medium min-w-0 select-text"
                />
                <button
                  type="submit"
                  disabled={sendDisabled}
                  className={`p-2 rounded-lg transition-all flex items-center justify-center shrink-0 ${
                    !sendDisabled
                      ? 'chat-accent-bg hover:scale-105 active:scale-95 cursor-pointer font-bold shadow'
                      : 'bg-neutral-700 text-neutral-400'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </footer>
          </>
        )}
      </section>

      {/* TOAST */}
      {toastMsg && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
          <div className="bg-rose-500 text-white font-mono text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-lg shadow-black/50 border border-rose-400 whitespace-nowrap">
            {toastMsg}
          </div>
        </div>
      )}

      {/* ============ CREATE CHANNEL MODAL ============ */}
      {createModalOpen && (
        <div
          onClick={(e) => e.target === e.currentTarget && setCreateModalOpen(false)}
          className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-[70] backdrop-blur-sm"
        >
          <div className="chat-surface border chat-bd2 rounded-2xl w-full max-w-sm p-5 shadow-2xl flex flex-col gap-4 text-left animate-chat-pop">
            <div className="flex items-center justify-between border-b chat-bd pb-2.5">
              <h2 className="text-xs font-black uppercase chat-accent tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Create Custom Channel
              </h2>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="chat-txt-mute hover:chat-txt p-0.5 rounded hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <form onSubmit={handleCreateChannel} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider chat-txt-dim block">
                  Channel Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 chat-txt-mute font-black text-xs">#</span>
                  <input
                    type="text"
                    required
                    maxLength={20}
                    value={newChanName}
                    onChange={(e) => setNewChanName(e.target.value)}
                    placeholder="e.g. secret-lounge"
                    className="w-full chat-surface-deep border chat-bd focus:chat-accent-bd rounded-xl py-2 pl-7 pr-3 text-xs chat-txt outline-none chat-placeholder-mute font-bold"
                  />
                </div>
                <span className="text-[8px] chat-txt-mute block">Letters, numbers, dashes. Formatted lowercase.</span>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider chat-txt-dim block">Description</label>
                <input
                  type="text"
                  maxLength={60}
                  value={newChanDesc}
                  onChange={(e) => setNewChanDesc(e.target.value)}
                  placeholder="e.g. Discussion room for cool stuff"
                  className="w-full chat-surface-deep border chat-bd focus:chat-accent-bd rounded-xl py-2 px-3 text-xs chat-txt outline-none chat-placeholder-mute"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider chat-txt-dim flex items-center justify-between">
                  <span>
                    Passcode <span className="chat-txt-mute font-normal">(Optional)</span>
                  </span>
                  <span className="text-[8px] text-amber-500 font-bold flex items-center gap-0.5">
                    <Lock className="w-2 h-2" /> Protect
                  </span>
                </label>
                <div className="relative flex items-center">
                  <Key className="absolute left-3 w-3.5 h-3.5 chat-txt-mute" />
                  <input
                    type="text"
                    maxLength={16}
                    value={newChanPass}
                    onChange={(e) => setNewChanPass(e.target.value)}
                    placeholder="Leave empty for public"
                    className="w-full chat-surface-deep border chat-bd focus:chat-accent-bd rounded-xl py-2 pl-9 pr-3 text-xs chat-txt outline-none chat-placeholder-mute font-mono"
                  />
                </div>
              </div>
              <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-[9px] font-mono">
                <Clock className="w-3.5 h-3.5 shrink-0 animate-pulse" />
                <span>Ephemeral Room: Custom rooms automatically disappear 1 hour after creation.</span>
              </div>
              <div className="flex gap-2 pt-2 border-t chat-bd">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 chat-txt text-[10px] font-black uppercase py-2 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 chat-accent-bg text-[10px] font-black uppercase py-2 rounded-xl transition-all cursor-pointer"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ THEME MODAL ============ */}
      {themeModalOpen && !isMini && (
        <div
          onClick={(e) => e.target === e.currentTarget && setThemeModalOpen(false)}
          className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-[70] backdrop-blur-sm"
        >
          <div className="chat-surface border chat-bd2 rounded-2xl w-full max-w-md p-5 shadow-2xl flex flex-col gap-4 text-left animate-chat-pop">
            <div className="flex items-center justify-between border-b chat-bd pb-2.5">
              <h2 className="text-xs font-black uppercase chat-accent tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" /> Theme
              </h2>
              <button
                type="button"
                onClick={() => setThemeModalOpen(false)}
                className="chat-txt-mute hover:chat-txt p-0.5 rounded hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2 chat-surface-deep border chat-bd rounded-full px-3 py-2 self-start flex-wrap">
              {THEME_ORDER.map((key) => {
                const t = THEMES[key];
                const active = theme === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleApplyTheme(key)}
                    title={`${t.label} Theme`}
                    className={`w-6 h-6 rounded-full shrink-0 transition-all cursor-pointer ${
                      active ? 'ring-2 ring-white scale-110' : 'hover:scale-110 opacity-80 hover:opacity-100'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${t.swatch[0]}, ${t.swatch[1]})`,
                      border: '1px solid rgba(255,255,255,.15)',
                    }}
                  />
                );
              })}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {THEME_ORDER.map((key) => {
                const t = THEMES[key];
                const active = theme === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleApplyTheme(key)}
                    className={`group relative rounded-xl p-3 h-20 flex flex-col justify-end text-left border transition-all cursor-pointer ${
                      active ? 'ring-2 ring-offset-1' : ''
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${t.swatch[0]}, ${t.swatch[1]})`,
                      borderColor: 'rgba(255,255,255,.10)',
                      boxShadow: active ? `0 0 0 2px ${t.accent}` : undefined,
                    }}
                  >
                    <span className="text-[11px] font-black tracking-tight" style={{ color: t.accent }}>
                      {t.label}
                    </span>
                    {active && (
                      <span
                        className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: t.accent }}
                      >
                        <Check className="w-2.5 h-2.5 text-black" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============ DELETE ALL MY MESSAGES MODAL ============ */}
      {deleteAllModalOpen && (
        <div
          onClick={(e) => e.target === e.currentTarget && setDeleteAllModalOpen(false)}
          className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-[70] backdrop-blur-sm"
        >
          <div className="chat-surface border chat-bd2 rounded-2xl w-full max-w-sm p-5 shadow-2xl flex flex-col gap-4 text-left animate-chat-pop">
            <div className="flex items-center justify-between border-b chat-bd pb-2.5">
              <h2 className="text-xs font-black uppercase text-rose-400 tracking-wider flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Delete All My Messages
              </h2>
              <button
                type="button"
                onClick={() => setDeleteAllModalOpen(false)}
                className="chat-txt-mute hover:chat-txt p-0.5 rounded hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs chat-txt-dim leading-relaxed">
                Are you sure you want to delete all messages you've sent? They will be permanently removed for everyone.
              </p>

              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-300 font-mono text-[11px]">
                  <span>Active Channel:</span>
                  <span className="font-bold text-white">
                    {currentChannel.isDirectMessage ? currentChannel.name : `#${currentChannel.name}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300 font-mono text-[11px]">
                  <span>Your Messages in Channel:</span>
                  <span className="font-bold text-rose-400">
                    {myMessageCountInCurrent === 1 ? '1 message' : `${myMessageCountInCurrent} messages`}
                  </span>
                </div>
              </div>

              <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/5 cursor-pointer text-xs select-none">
                <input
                  type="checkbox"
                  checked={deleteAllAcrossChannels}
                  onChange={(e) => setDeleteAllAcrossChannels(e.target.checked)}
                  className="mt-0.5 rounded border chat-bd text-rose-500 focus:ring-rose-500"
                />
                <span className="chat-txt-dim text-[11px] leading-tight">
                  Also delete all my sent messages across{' '}
                  <strong className="chat-txt font-bold">all channels</strong> (not just this one)
                </span>
              </label>
            </div>

            <div className="flex gap-2 pt-2 border-t chat-bd">
              <button
                type="button"
                onClick={() => setDeleteAllModalOpen(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 chat-txt text-[10px] font-black uppercase py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingMyMessages}
                onClick={executeDeleteAllMyMessages}
                className="flex-1 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-[10px] font-black uppercase py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {deletingMyMessages ? (
                  <span className="animate-pulse">Deleting...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Messages</span>
                  </>
                )}
              </button>
            </div>

            {currentChannel.isDirectMessage && (
              <div className="pt-3 border-t chat-bd space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" /> Erase DM Conversation & Traces
                  </span>
                </div>
                <p className="text-[11px] chat-txt-dim leading-snug">
                  Permanently delete this entire DM thread with <strong className="chat-txt">{currentChannel.name}</strong>, including all messages for both participants, thread history, and local traces.
                </p>
                <button
                  type="button"
                  disabled={deletingDmThread}
                  onClick={() => handleDeleteDmTraces(currentChannel)}
                  className="w-full bg-rose-600/90 hover:bg-rose-500 active:scale-95 text-white text-[10px] font-black uppercase py-2 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{deletingDmThread ? 'Erasing DM Traces...' : `Delete DM & All Traces (${currentChannel.name})`}</span>
                </button>
              </div>
            )}

            {/* Admin Delete Actions at the bottom */}
            <div className="pt-3 border-t chat-bd space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Admin Delete Controls
                </span>
                {isChatAdmin && (
                  <span className="text-[9px] font-mono font-bold text-emerald-400">Admin Unlocked</span>
                )}
              </div>

              {isChatAdmin ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      disabled={clearingChannelAdmin || deletingAllAdmin}
                      onClick={handleAdminClearCurrentChannel}
                      className="bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>
                        {clearingChannelAdmin
                          ? 'Clearing...'
                          : `Clear ${currentChannel.isDirectMessage ? currentChannel.name : `#${currentChannel.name}`}`}
                      </span>
                    </button>
                    <button
                      type="button"
                      disabled={deletingAllAdmin || clearingChannelAdmin}
                      onClick={() => executeAdminDeleteAll('')}
                      className="bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-[10px] font-black uppercase px-3 py-2 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 disabled:opacity-60"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{deletingAllAdmin ? 'Deleting...' : 'Delete All Channels'}</span>
                    </button>
                  </div>
                  {currentChannel.id !== 'general' && currentChannel.id !== 'temporary' && !currentChannel.isDirectMessage && (
                    <button
                      type="button"
                      disabled={deletingChannelAdmin}
                      onClick={() => handleAdminDeleteCustomChannel(currentChannel)}
                      className="w-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-[10px] font-black uppercase px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{deletingChannelAdmin ? 'Deleting Room...' : `Delete Channel #${currentChannel.name}`}</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <input
                    type="password"
                    value={adminPassModalInput}
                    onChange={(e) => setAdminPassModalInput(e.target.value)}
                    placeholder="Admin password..."
                    className="flex-1 chat-surface-deep border chat-bd focus:border-rose-500 rounded-xl py-2 px-3 text-xs chat-txt outline-none chat-placeholder-mute font-mono min-w-0"
                  />
                  <button
                    type="button"
                    disabled={deletingAllAdmin}
                    onClick={() => executeAdminDeleteAll(adminPassModalInput)}
                    className="bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-[10px] font-black uppercase px-3 py-2 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1 shrink-0 disabled:opacity-60"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{deletingAllAdmin ? 'Deleting...' : 'Delete All'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============ SETTINGS & ADMIN MODAL ============ */}
      {settingsModalOpen && (
        <div
          onClick={(e) => e.target === e.currentTarget && setSettingsModalOpen(false)}
          className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-[70] backdrop-blur-sm"
        >
          <div className="chat-surface border chat-bd2 rounded-2xl w-full max-w-sm p-5 shadow-2xl flex flex-col gap-4 text-left animate-chat-pop">
            <div className="flex items-center justify-between border-b chat-bd pb-2.5">
              <h2 className="text-xs font-black uppercase chat-accent tracking-wider flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5" /> Chat Settings
              </h2>
              <button
                type="button"
                onClick={() => setSettingsModalOpen(false)}
                className="chat-txt-mute hover:chat-txt p-0.5 rounded hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl chat-surface-elev border chat-bd">
                <div className="min-w-0">
                  <p className="text-xs font-bold chat-txt">Delete My Messages</p>
                  <p className="text-[10px] chat-txt-mute">Remove only the messages you sent</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSettingsModalOpen(false);
                    setDeleteAllAcrossChannels(false);
                    setDeleteAllModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-[10px] font-black uppercase cursor-pointer transition-all shrink-0"
                >
                  Open
                </button>
              </div>

              <div className="p-2.5 rounded-xl chat-surface-elev border chat-bd space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <VolumeX className="w-3.5 h-3.5" /> Muted Users ({activeMutedUsers.length})
                  </span>
                </div>
                {activeMutedUsers.length === 0 ? (
                  <p className="text-[10px] chat-txt-mute leading-snug">
                    No users muted. Hover any message or open a DM to mute someone for 1–24 hours.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto chat-scrollbar pr-0.5">
                    {activeMutedUsers.map((entry) => (
                      <div
                        key={entry.key}
                        className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg chat-surface-deep border chat-bd"
                      >
                        <div className="min-w-0">
                          <p className="text-[11px] font-mono font-bold chat-txt truncate">{entry.label}</p>
                          <p className="text-[9px] font-mono text-amber-300">
                            {formatMuteRemaining(entry.mutedUntil, tickNow)} left
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleUnmutePerson(entry)}
                          className="px-2 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[9px] font-black uppercase cursor-pointer shrink-0 flex items-center gap-1"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Unmute</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t chat-bd space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Admin Controls
                </span>
                <span className="text-[9px] font-mono chat-txt-mute">
                  {isChatAdmin ? 'Admin signed in' : 'Password required'}
                </span>
              </div>
              <p className="text-[11px] chat-txt-dim leading-snug">
                {isChatAdmin
                  ? 'Clear messages in the current channel, delete custom rooms, or purge all messages from all users.'
                  : <>Permanently delete <strong className="chat-txt font-bold">all messages from all users</strong> across every channel.</>}
              </p>

              {isChatAdmin ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsModalOpen(false);
                      setBroadcastModalOpen(true);
                    }}
                    className="w-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/45 text-amber-300 text-[11px] font-black uppercase py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>Message Everyone (Global Broadcast)</span>
                  </button>
                  <button
                    type="button"
                    disabled={clearingChannelAdmin || deletingAllAdmin}
                    onClick={handleAdminClearCurrentChannel}
                    className="w-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[11px] font-black uppercase py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>
                      {clearingChannelAdmin
                        ? 'Clearing...'
                        : `Clear ${currentChannel.isDirectMessage ? currentChannel.name : `#${currentChannel.name}`} Messages`}
                    </span>
                  </button>
                  {currentChannel.id !== 'general' && currentChannel.id !== 'temporary' && !currentChannel.isDirectMessage && (
                    <button
                      type="button"
                      disabled={deletingChannelAdmin}
                      onClick={() => handleAdminDeleteCustomChannel(currentChannel)}
                      className="w-full bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-[11px] font-black uppercase py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{deletingChannelAdmin ? 'Deleting...' : `Delete Channel #${currentChannel.name}`}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={deletingAllAdmin || clearingChannelAdmin}
                    onClick={() => executeAdminDeleteAll('')}
                    className="w-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-[11px] font-black uppercase py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 disabled:opacity-60"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{deletingAllAdmin ? 'Deleting All...' : 'Delete All Messages (Every Channel)'}</span>
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    executeAdminDeleteAll(adminPassSettingsInput);
                  }}
                  className="space-y-2"
                >
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-3.5 h-3.5 chat-txt-mute" />
                    <input
                      type="password"
                      value={adminPassSettingsInput}
                      onChange={(e) => setAdminPassSettingsInput(e.target.value)}
                      placeholder="Enter admin password..."
                      className="w-full chat-surface-deep border chat-bd focus:border-rose-500 rounded-xl py-2 pl-9 pr-3 text-xs chat-txt outline-none chat-placeholder-mute font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={deletingAllAdmin}
                    className="w-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-[11px] font-black uppercase py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 disabled:opacity-60"
                  >
                    {deletingAllAdmin ? (
                      <span className="animate-pulse">Deleting All...</span>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete All (Admin)</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {broadcastModalOpen && isChatAdmin && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setBroadcastModalOpen(false)}
        >
          <form
            onSubmit={handleSendGlobalBroadcast}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md chat-surface border chat-bd2 rounded-2xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b chat-bd pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-black uppercase tracking-wide chat-txt">
                  Message Everyone
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setBroadcastModalOpen(false)}
                className="chat-txt-mute hover:chat-txt text-lg leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            <p className="text-[11px] chat-txt-dim leading-snug">
              Push a live announcement banner across the whole website for every signed-in user.
            </p>

            {workspaceConfig?.broadcastMessage && (
              <div className="rounded-xl p-3 bg-amber-500/10 border border-amber-500/35 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-300">
                    Active Broadcast · {workspaceConfig.broadcastSender || 'Admin'}
                  </span>
                  <button
                    type="button"
                    disabled={broadcastBusy}
                    onClick={handleClearGlobalBroadcast}
                    className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-[9px] font-black uppercase cursor-pointer disabled:opacity-50"
                  >
                    Clear Active
                  </button>
                </div>
                <p className="text-xs chat-txt break-words leading-snug">
                  {workspaceConfig.broadcastMessage}
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider chat-txt-dim">
                Announcement Message
              </label>
              <textarea
                rows={3}
                maxLength={500}
                value={broadcastText}
                onChange={(e) => setBroadcastText(e.target.value)}
                placeholder="Write a message to broadcast to everyone online..."
                className="w-full chat-surface-deep border chat-bd focus:border-amber-400 rounded-xl p-2.5 text-xs chat-txt outline-none chat-placeholder-mute resize-none"
                autoFocus
              />
              <div className="flex items-center justify-between text-[9px] font-mono chat-txt-mute">
                <label className="inline-flex items-center gap-1.5 cursor-pointer select-none chat-txt-dim">
                  <input
                    type="checkbox"
                    checked={broadcastAlsoPostGeneral}
                    onChange={(e) => setBroadcastAlsoPostGeneral(e.target.checked)}
                    className="accent-amber-400 rounded cursor-pointer"
                  />
                  <span>Also post in #general chat</span>
                </label>
                <span>{broadcastText.length}/500</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setBroadcastModalOpen(false)}
                className="flex-1 py-2 rounded-xl border chat-bd chat-surface-elev text-xs font-bold chat-txt-dim hover:chat-txt cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={broadcastBusy || !broadcastText.trim()}
                className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{broadcastBusy ? 'Sending...' : 'Send Broadcast'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
