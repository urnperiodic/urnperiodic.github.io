export const USER_MUTES_STORAGE_KEY = 'urnperiodic_user_mutes';
export const USER_MUTE_HOURS_OPTIONS = [1, 2, 4, 8, 24];

function normalizeAccountId(val) {
  const s = String(val || '').trim().toLowerCase();
  return s || null;
}

function normalizeNameLower(val) {
  const s = String(val || '').trim().toLowerCase();
  return s || null;
}

export function buildMuteTargetKey(target = {}) {
  const acc = normalizeAccountId(target.accountId || target.partnerId);
  if (acc) return `acc:${acc}`;
  const sid = String(target.senderId || '').trim();
  if (sid) return `sid:${sid}`;
  const nameLower = normalizeNameLower(target.name || target.label || target.senderName);
  if (nameLower) return `name:${nameLower}`;
  return '';
}

function dispatchMuteSync(list) {
  try {
    const bus = new BroadcastChannel('urnperiodic_lobby_bus');
    bus.postMessage({ type: 'user-mute-updated', mutedUsers: list });
    setTimeout(() => {
      try {
        bus.close();
      } catch {}
    }, 350);
  } catch {}

  try {
    window.dispatchEvent(new CustomEvent('urnperiodic-user-mute-sync', { detail: list }));
  } catch {}

  try {
    const chatIframe = /** @type {HTMLIFrameElement | null} */ (document.getElementById('chat-decoy-iframe'));
    if (chatIframe && chatIframe.contentWindow) {
      chatIframe.contentWindow.postMessage({ type: 'user-mute-updated', mutedUsers: list }, '*');
    }
  } catch {}
}

export function getActiveMutedUsers(now = Date.now()) {
  try {
    const raw = localStorage.getItem(USER_MUTES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const active = parsed.filter(
      (entry) => entry && entry.key && Number(entry.mutedUntil || 0) > now
    );
    if (active.length !== parsed.length) {
      localStorage.setItem(USER_MUTES_STORAGE_KEY, JSON.stringify(active));
    }
    return active;
  } catch {
    return [];
  }
}

export function muteUserForHours(target = {}, hours = 2) {
  const key = buildMuteTargetKey(target);
  if (!key) return getActiveMutedUsers();

  const numericHours = Math.max(0.25, Math.min(72, Number(hours) || 2));
  const now = Date.now();
  const mutedUntil = now + numericHours * 60 * 60 * 1000;
  const accountId = normalizeAccountId(target.accountId || target.partnerId);
  const senderId = String(target.senderId || '').trim() || null;
  const rawLabel = String(target.label || target.name || target.senderName || accountId || 'User').trim();
  const label = rawLabel === '__owner__' ? 'Owner' : rawLabel;
  const nameLower = normalizeNameLower(label);

  const current = getActiveMutedUsers(now).filter((entry) => entry.key !== key);
  const nextEntry = {
    key,
    label,
    accountId,
    senderId,
    nameLower,
    hours: numericHours,
    createdAt: now,
    mutedUntil,
  };
  const next = [nextEntry, ...current];

  try {
    localStorage.setItem(USER_MUTES_STORAGE_KEY, JSON.stringify(next));
  } catch {}
  dispatchMuteSync(next);
  return next;
}

export function unmuteUserByKey(key) {
  if (!key) return getActiveMutedUsers();
  const now = Date.now();
  const next = getActiveMutedUsers(now).filter((entry) => entry.key !== key);
  try {
    localStorage.setItem(USER_MUTES_STORAGE_KEY, JSON.stringify(next));
  } catch {}
  dispatchMuteSync(next);
  return next;
}

export function unmuteUserByTarget(target = {}) {
  const match = findMuteForTarget(target);
  if (!match) return getActiveMutedUsers();
  return unmuteUserByKey(match.key);
}

export function findMuteForTarget(target = {}, mutedList = null, now = Date.now()) {
  const list = Array.isArray(mutedList) ? mutedList : getActiveMutedUsers(now);
  if (!list.length || !target) return null;

  const targetAcc = normalizeAccountId(target.accountId || target.partnerId);
  const targetSid = String(target.senderId || '').trim() || null;
  const targetNameLower = normalizeNameLower(target.name || target.senderName || target.label);

  for (const entry of list) {
    if (!entry || Number(entry.mutedUntil || 0) <= now) continue;
    if (targetAcc && entry.accountId && targetAcc === entry.accountId) return entry;
    if (targetSid && entry.senderId && targetSid === entry.senderId) {
      if (!targetAcc || !entry.accountId || targetAcc === entry.accountId) return entry;
    }
    if (targetNameLower && entry.nameLower && targetNameLower === entry.nameLower) {
      if (!targetAcc || !entry.accountId || targetAcc === entry.accountId) return entry;
    }
  }
  return null;
}

export function isSenderMuted(target = {}, mutedList = null, now = Date.now()) {
  return Boolean(findMuteForTarget(target, mutedList, now));
}

export function formatMuteRemaining(mutedUntil, now = Date.now()) {
  const diffMs = Math.max(0, Number(mutedUntil || 0) - now);
  if (diffMs <= 0) return '0m';
  const totalMins = Math.ceil(diffMs / 60000);
  if (totalMins < 60) return `${totalMins}m`;
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export function subscribeUserMutes(onChange) {
  if (typeof onChange !== 'function') return () => {};
  const notify = () => onChange(getActiveMutedUsers());

  const handleCustom = (event) => {
    if (Array.isArray(event?.detail)) {
      const now = Date.now();
      onChange(event.detail.filter((e) => e && e.key && Number(e.mutedUntil || 0) > now));
    } else {
      notify();
    }
  };
  const handleStorage = (event) => {
    if (event.key === USER_MUTES_STORAGE_KEY) notify();
  };
  const handleWindowMsg = (event) => {
    if (event?.data?.type === 'user-mute-updated') {
      notify();
    }
  };

  window.addEventListener('urnperiodic-user-mute-sync', handleCustom);
  window.addEventListener('storage', handleStorage);
  window.addEventListener('message', handleWindowMsg);

  let bus;
  try {
    bus = new BroadcastChannel('urnperiodic_lobby_bus');
    bus.onmessage = (event) => {
      if (event?.data?.type === 'user-mute-updated') {
        notify();
      }
    };
  } catch {}

  return () => {
    window.removeEventListener('urnperiodic-user-mute-sync', handleCustom);
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('message', handleWindowMsg);
    if (bus) {
      try {
        bus.close();
      } catch {}
    }
  };
}
