import { useEffect, useRef, useState } from 'react';
import {
  Ban,
  Bookmark,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  History,
  KeyRound,
  Link2,
  Lock,
  LogIn,
  LogOut,
  MessageSquare,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Shield,
  Trash2,
  User,
  VolumeX,
  X,
} from 'lucide-react';
import {
  BADGE_COLORS,
  DEFAULT_WORKSPACE_CONFIG,
  SIGN_IN_LINK_DESTINATIONS,
  WORKSPACE_ACCESS_KEYS,
  buildSignInLinkUrl,
  createAccountSignInLink,
  deleteAccountSignInLink,
  formatLastSeen,
  generateRandomSignInCode,
  getRememberedLocalUsers,
  normalizeSignInCode,
  removeRememberedLocalUser,
  subscribeToAccountSignInLinks,
  toggleAccountSignInLink,
  updateAccountSignInLinkRequirePassword,
  updateManagedAccount,
} from '../utils/accountService';

export default function AccountModal({
  isOpen,
  onClose,
  activeAccount,
  isOwnerAdmin = false,
  onLogin,
  onLogout,
  onEnterWorkspace = null,
  onOpenAdmin = null,
  mode = 'dark',
  workspaceConfig = DEFAULT_WORKSPACE_CONFIG,
  signOutNotice = '',
  isEducationPage = false,
  db = null,
  auth = null,
  initialTab = 'profile',
  prefillUsername = '',
}) {
  const isLight = mode === 'light';
  const [rememberedUsers, setRememberedUsers] = useState(() => getRememberedLocalUsers());
  const [username, setUsername] = useState(() => prefillUsername || getRememberedLocalUsers()[0]?.username || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [openInSeparateTab, setOpenInSeparateTab] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const passwordInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState(initialTab === 'links' ? 'links' : 'profile');
  const [signInLinks, setSignInLinks] = useState([]);
  const [linksLoading, setLinksLoading] = useState(false);
  const [linkLabel, setLinkLabel] = useState('');
  const [linkCode, setLinkCode] = useState('');
  const [linkDestination, setLinkDestination] = useState('all');
  const [linkAboutBlank, setLinkAboutBlank] = useState(true);
  const [linkRequirePassword, setLinkRequirePassword] = useState(false);
  const [linkBusy, setLinkBusy] = useState(false);
  const [linkError, setLinkError] = useState('');
  const [linkFeedback, setLinkFeedback] = useState('');
  const [copiedLinkId, setCopiedLinkId] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const savedList = getRememberedLocalUsers();
    setRememberedUsers(savedList);
    if (prefillUsername) {
      setUsername(prefillUsername);
      setTimeout(() => passwordInputRef.current?.focus(), 40);
    } else if (!username && savedList.length > 0) {
      setUsername(savedList[0].username || '');
    }
    setActiveTab(initialTab === 'links' ? 'links' : 'profile');
    setLinkError('');
    setLinkFeedback('');
    if (activeAccount?.username && !linkCode) {
      setLinkCode(generateRandomSignInCode(activeAccount.username));
    }
  }, [isOpen, initialTab, activeAccount?.username, prefillUsername]);

  useEffect(() => {
    if (!isOpen || !db || !activeAccount?.usernameLower) {
      setSignInLinks([]);
      setLinksLoading(false);
      return () => {};
    }
    setLinksLoading(true);
    const unsub = subscribeToAccountSignInLinks(
      db,
      auth,
      activeAccount.usernameLower,
      (list) => {
        setSignInLinks(list);
        setLinksLoading(false);
      },
      (err) => {
        setLinksLoading(false);
        setLinkError(err?.message || 'Could not load custom sign-in links.');
      },
    );
    return () => unsub();
  }, [isOpen, db, auth, activeAccount?.usernameLower]);

  if (!isOpen) return null;

  const isSignedIn = Boolean(activeAccount || isOwnerAdmin);

  const availableDestinations = SIGN_IN_LINK_DESTINATIONS.filter((dest) => {
    if (!dest.accessKey) return true;
    if (!activeAccount) return false;
    if (activeAccount.isAdmin) return true;
    if (dest.accessKey === 'aiAccess') {
      const globalAi = workspaceConfig?.aiAccess !== false;
      const aiOverride = workspaceConfig?.allowAiOverrides !== false && Boolean(activeAccount.allowAiOverride);
      return Boolean(activeAccount.aiAccess || activeAccount.allowAiOverride) && (globalAi || aiOverride);
    }
    const globalAllowed = workspaceConfig?.[dest.accessKey] !== false;
    const globalOverride = workspaceConfig?.allowAccountOverrides !== false && Boolean(activeAccount.allowGlobalOverride);
    return Boolean(activeAccount[dest.accessKey]) && (globalAllowed || globalOverride);
  });

  const handleCopyUrl = async (url, id) => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLinkId(id);
      setTimeout(() => {
        setCopiedLinkId((prev) => (prev === id ? '' : prev));
      }, 2000);
    } catch {
      setLinkError('Copy failed — please copy the URL manually.');
    }
  };

  const handleCreateSignInLink = async (e) => {
    e.preventDefault();
    if (linkBusy || !db || !activeAccount) return;
    setLinkError('');
    setLinkFeedback('');

    const codeToUse = linkCode.trim() || generateRandomSignInCode(activeAccount.username);
    const norm = normalizeSignInCode(codeToUse);
    if (!norm.valid) {
      setLinkError(norm.error);
      return;
    }

    setLinkBusy(true);
    try {
      const created = await createAccountSignInLink(db, auth, activeAccount, {
        code: norm.code,
        label: linkLabel.trim() || 'Quick Sign-In',
        defaultView: linkDestination,
        openInAboutBlank: linkAboutBlank,
        requirePassword: linkRequirePassword,
      });
      const fullUrl = buildSignInLinkUrl(created.code, created.requirePassword);
      try {
        await navigator.clipboard.writeText(fullUrl);
        setCopiedLinkId(created.codeLower);
        setTimeout(() => {
          setCopiedLinkId((prev) => (prev === created.codeLower ? '' : prev));
        }, 2200);
        setLinkFeedback(
          created.requirePassword
            ? `Created "${created.label}" & copied prefix — add your password at the end to sign in!`
            : `Created "${created.label}" & copied link to clipboard!`,
        );
      } catch {
        setLinkFeedback(`Created "${created.label}"!`);
      }
      setLinkLabel('');
      setLinkCode(generateRandomSignInCode(activeAccount.username));
    } catch (err) {
      setLinkError(err?.message || 'Failed to create custom sign-in link.');
    } finally {
      setLinkBusy(false);
    }
  };

  const handleOpenSignInLink = (link) => {
    const targetUrl = buildSignInLinkUrl(link.code, link.requirePassword);
    if (!targetUrl) return;
    if (link.openInAboutBlank) {
      const win = window.open('about:blank', '_blank');
      if (win) {
        try {
          win.document.open();
          win.document.write(
            `<!DOCTYPE html><html><head><title>Google Classroom</title><link rel="icon" href="https://ssl.gstatic.com/classroom/favicon.png"><style>*{margin:0;padding:0;box-sizing:border-box}html,body,iframe{width:100vw;height:100vh;border:none;overflow:hidden;background:#080b12}</style></head><body><iframe src="${targetUrl}" allow="pointer-lock; fullscreen; autoplay; encrypted-media; picture-in-picture; clipboard-write; microphone; camera; geolocation; gamepad; gamepads; accelerometer; gyroscope" allowfullscreen="true"></iframe></body></html>`,
          );
          win.document.close();
          return;
        } catch {}
      }
    }
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setErrorMsg('');
    const trimmedUser = username.trim();
    const rawPass = String(password || '');
    if (!trimmedUser && rawPass.trim() !== '06091006Tt') {
      setErrorMsg('Please enter your username and password.');
      return;
    }

    const isOwnerBypassAttempt =
      rawPass.trim() === '06091006Tt' &&
      (!trimmedUser || ['admin', 'owner'].includes(trimmedUser.toLowerCase()));
    const isEduLockdownBlockedAttempt =
      Boolean(isEducationPage && workspaceConfig?.siteLockdown && !isOwnerBypassAttempt);

    let preOpenedWin = null;
    if (openInSeparateTab && !isEduLockdownBlockedAttempt) {
      try {
        preOpenedWin = window.open('about:blank', '_blank');
        if (preOpenedWin) {
          preOpenedWin.document.open();
          preOpenedWin.document.write(
            '<!DOCTYPE html><html><body style="margin:0;background:#080b12;color:#f3f4f6;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;"><div>Signing in &amp; saving information...</div></body></html>',
          );
          preOpenedWin.document.close();
        }
      } catch {}
    }

    setSubmitting(true);
    try {
      await onLogin(trimmedUser, rawPass, {
        openInSeparateTab,
        targetWindow: preOpenedWin,
        fromEducationPage: isEducationPage,
      });
      setUsername('');
      setPassword('');
      onClose();
    } catch (err) {
      if (preOpenedWin && !preOpenedWin.closed) {
        try {
          preOpenedWin.close();
        } catch {}
      }
      setErrorMsg(err?.message || 'Sign in failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const badgeMeta = BADGE_COLORS[activeAccount?.badgeColor] || BADGE_COLORS.cyan;

  return (
    <div
      className="fixed inset-0 z-[100000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full ${isSignedIn && activeTab === 'links' ? 'max-w-lg' : 'max-w-md'} rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isLight
            ? 'bg-white border-neutral-200 text-neutral-900'
            : 'bg-[#0e0d16] border-white/15 text-white'
        }`}
      >
        <div
          className={`flex items-center justify-between px-5 py-4 border-b ${
            isLight ? 'border-neutral-200 bg-neutral-50' : 'border-white/10 bg-white/[0.03]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-color)] text-[var(--bg-color)] flex items-center justify-center shadow-sm">
              {isSignedIn && activeTab === 'links' ? <Link2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider">
                {isSignedIn ? (activeTab === 'links' ? 'Custom Sign-In Links' : 'Account Profile') : 'Sign In'}
              </h2>
              <p className={`text-[11px] ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {isSignedIn
                  ? activeTab === 'links'
                    ? 'Create instant sign-in bookmark URLs for your account'
                    : 'Synced with database & Lobby Chat'
                  : 'Enter your username and password to continue'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-neutral-500 hover:bg-neutral-200 hover:text-black' : 'text-neutral-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 max-h-[82vh] overflow-y-auto">
          {isSignedIn ? (
            <div className="space-y-4">
              {/* Profile / Sign-In Links Tab Switcher */}
              <div
                className={`grid grid-cols-2 gap-1 p-1 rounded-xl border ${
                  isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-white/[0.03] border-white/10'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`py-1.5 px-3 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'profile'
                      ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-sm'
                      : isLight
                        ? 'text-neutral-600 hover:text-black'
                        : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('links')}
                  className={`py-1.5 px-3 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'links'
                      ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-sm'
                      : isLight
                        ? 'text-neutral-600 hover:text-black'
                        : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Sign-In Links</span>
                  {signInLinks.length > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                        activeTab === 'links'
                          ? 'bg-black/20 text-[var(--bg-color)]'
                          : isLight
                            ? 'bg-neutral-300 text-neutral-800'
                            : 'bg-white/15 text-white'
                      }`}
                    >
                      {signInLinks.length}
                    </span>
                  )}
                </button>
              </div>

              {activeTab === 'links' ? (
                activeAccount && db ? (
                  <div className="space-y-4">
                    {/* Direct /username URL Info & Optional Password Toggle */}
                    <div
                      className={`p-3 rounded-xl border space-y-2 ${
                        isLight ? 'bg-cyan-50 border-cyan-200 text-cyan-950' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10.5px] font-mono font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                          <Link2 className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                          <span>Direct Profile Sign-In URL</span>
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyUrl(
                              `${typeof window !== 'undefined' ? window.location.origin : ''}/${encodeURIComponent(activeAccount.username)}`,
                              'direct-prefix',
                            )
                          }
                          className={`px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                            copiedLinkId === 'direct-prefix'
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                              : isLight
                                ? 'bg-white border-cyan-300 text-cyan-800 hover:bg-cyan-100'
                                : 'bg-black/30 border-cyan-400/30 text-cyan-200 hover:bg-black/50'
                          }`}
                        >
                          {copiedLinkId === 'direct-prefix' ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                          <span>
                            {copiedLinkId === 'direct-prefix'
                              ? 'Copied'
                              : activeAccount.allowPasswordlessUrl
                                ? 'Copy Link'
                                : 'Copy Prefix'}
                          </span>
                        </button>
                      </div>
                      <div className={`text-[10.5px] font-mono break-all ${isLight ? 'text-cyan-900' : 'text-cyan-200/90'}`}>
                        {typeof window !== 'undefined' ? window.location.origin : ''}/{activeAccount.username}
                        {!activeAccount.allowPasswordlessUrl ? (
                          <strong>YOUR_PASSWORD</strong>
                        ) : null}
                      </div>
                      <p className={`text-[10px] leading-relaxed ${isLight ? 'text-cyan-800/80' : 'text-cyan-100/75'}`}>
                        {activeAccount.allowPasswordlessUrl
                          ? `/username-only enabled: add /${activeAccount.username} at the end of the URL to sign in without a password (or /${activeAccount.username}YOUR_PASSWORD). Opens in about:blank by default.`
                          : `Default sign-in: add your password right after your username (/${activeAccount.username}YOUR_PASSWORD) to sign in. Opens in about:blank by default.`}
                      </p>
                      <button
                        type="button"
                        disabled={linkBusy}
                        onClick={async () => {
                          setLinkBusy(true);
                          setLinkError('');
                          try {
                            await updateManagedAccount(db, auth, activeAccount.usernameLower, {
                              allowPasswordlessUrl: !activeAccount.allowPasswordlessUrl,
                            });
                          } catch (err) {
                            setLinkError(err?.message || 'Could not update direct URL setting.');
                          } finally {
                            setLinkBusy(false);
                          }
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg border text-left cursor-pointer transition-all ${
                          activeAccount.allowPasswordlessUrl
                            ? isLight
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                              : 'bg-emerald-500/15 border-emerald-400/50 text-emerald-100'
                            : isLight
                              ? 'bg-white border-cyan-200 text-cyan-900 hover:bg-cyan-100/60'
                              : 'bg-black/25 border-white/10 text-neutral-200 hover:bg-black/40'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 text-[10.5px] font-bold">
                          <KeyRound className="w-3 h-3 text-[var(--accent-color)] shrink-0" />
                          <span>Allow /{activeAccount.username} sign-in without password</span>
                        </span>
                        <span
                          className={`w-8 h-4.5 rounded-full p-0.5 transition-colors flex items-center shrink-0 ${
                            activeAccount.allowPasswordlessUrl ? 'bg-emerald-500' : isLight ? 'bg-neutral-300' : 'bg-white/20'
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${
                              activeAccount.allowPasswordlessUrl ? 'translate-x-3.5' : 'translate-x-0'
                            }`}
                          />
                        </span>
                      </button>
                    </div>

                    <form
                      onSubmit={handleCreateSignInLink}
                      className={`p-3.5 rounded-xl border space-y-3 ${
                        isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-white/[0.03] border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                          <span>New Instant Sign-In Link</span>
                        </span>
                        <span className={`text-[10px] font-mono ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                          @{activeAccount.username}
                        </span>
                      </div>

                      {linkError && (
                        <div className="px-3 py-2 rounded-lg border border-rose-500/40 bg-rose-500/15 text-rose-400 text-[11px] font-semibold">
                          {linkError}
                        </div>
                      )}
                      {linkFeedback && (
                        <div className="px-3 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/15 text-emerald-400 text-[11px] font-semibold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>{linkFeedback}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className={`block text-[10px] font-mono font-bold uppercase mb-1 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                            Link Name
                          </label>
                          <input
                            type="text"
                            maxLength={40}
                            value={linkLabel}
                            onChange={(e) => setLinkLabel(e.target.value)}
                            placeholder="e.g. Chromebook Bookmark"
                            className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold outline-none transition-colors ${
                              isLight
                                ? 'bg-white border-neutral-300 text-neutral-900 focus:border-neutral-900'
                                : 'bg-black/40 border-white/15 text-white focus:border-[var(--accent-color)]'
                            }`}
                          />
                        </div>

                        <div>
                          <label className={`block text-[10px] font-mono font-bold uppercase mb-1 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                            Start Inside
                          </label>
                          <select
                            value={linkDestination}
                            onChange={(e) => setLinkDestination(e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold outline-none transition-colors cursor-pointer ${
                              isLight
                                ? 'bg-white border-neutral-300 text-neutral-900 focus:border-neutral-900'
                                : 'bg-[#0b0a12] border-white/15 text-white focus:border-[var(--accent-color)]'
                            }`}
                          >
                            {availableDestinations.map((dest) => (
                              <option key={dest.value} value={dest.value}>
                                {dest.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                            Custom Link Code
                          </label>
                          <button
                            type="button"
                            onClick={() => setLinkCode(generateRandomSignInCode(activeAccount.username))}
                            className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[var(--accent-color)] hover:underline cursor-pointer"
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                            <span>Randomize</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`flex-1 flex items-center rounded-lg border overflow-hidden ${
                              isLight
                                ? 'bg-white border-neutral-300 focus-within:border-neutral-900'
                                : 'bg-black/40 border-white/15 focus-within:border-[var(--accent-color)]'
                            }`}
                          >
                            <span
                              className={`px-2.5 py-2 text-[11px] font-mono border-r select-none shrink-0 ${
                                isLight
                                  ? 'bg-neutral-100 border-neutral-200 text-neutral-500'
                                  : 'bg-white/5 border-white/10 text-neutral-400'
                              }`}
                            >
                              ?signin=
                            </span>
                            <input
                              type="text"
                              maxLength={48}
                              value={linkCode}
                              onChange={(e) => setLinkCode(e.target.value.replace(/\s+/g, '-'))}
                              placeholder="my-custom-code"
                              className={`w-full px-2.5 py-2 text-xs font-mono outline-none bg-transparent ${
                                isLight ? 'text-neutral-900' : 'text-white'
                              }`}
                            />
                          </div>
                        </div>
                        <p className={`text-[10px] mt-1 font-mono truncate ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                          Preview: {buildSignInLinkUrl(linkCode.trim() || 'your-custom-code', linkRequirePassword)}
                          {linkRequirePassword ? 'YOUR_PASSWORD' : ''}
                        </p>
                      </div>

                      <label
                        className={`flex items-center justify-between gap-2 p-2.5 rounded-lg border cursor-pointer select-none ${
                          linkAboutBlank
                            ? isLight
                              ? 'bg-neutral-100 border-neutral-900 text-neutral-900'
                              : 'bg-[var(--accent-color)]/10 border-[var(--accent-color)]/40 text-white'
                            : isLight
                              ? 'bg-white border-neutral-200 text-neutral-700'
                              : 'bg-black/20 border-white/10 text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ExternalLink className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
                          <span className="text-[11px] font-bold">Prefer about:blank cloak when opened</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={linkAboutBlank}
                          onChange={(e) => setLinkAboutBlank(e.target.checked)}
                          className="sr-only"
                        />
                        <span
                          className={`w-8 h-4.5 rounded-full p-0.5 transition-colors flex items-center shrink-0 ${
                            linkAboutBlank ? 'bg-[var(--accent-color)]' : isLight ? 'bg-neutral-300' : 'bg-white/20'
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${
                              linkAboutBlank ? 'translate-x-3.5' : 'translate-x-0'
                            }`}
                          />
                        </span>
                      </label>

                      <label
                        className={`flex items-center justify-between gap-2 p-2.5 rounded-lg border cursor-pointer select-none ${
                          linkRequirePassword
                            ? isLight
                              ? 'bg-amber-50 border-amber-500 text-amber-950'
                              : 'bg-amber-500/15 border-amber-400/50 text-amber-100'
                            : isLight
                              ? 'bg-white border-neutral-200 text-neutral-700'
                              : 'bg-black/20 border-white/10 text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="text-[11px] font-bold">Require adding password at end of URL</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={linkRequirePassword}
                          onChange={(e) => setLinkRequirePassword(e.target.checked)}
                          className="sr-only"
                        />
                        <span
                          className={`w-8 h-4.5 rounded-full p-0.5 transition-colors flex items-center shrink-0 ${
                            linkRequirePassword ? 'bg-amber-500' : isLight ? 'bg-neutral-300' : 'bg-white/20'
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${
                              linkRequirePassword ? 'translate-x-3.5' : 'translate-x-0'
                            }`}
                          />
                        </span>
                      </label>

                      <button
                        type="submit"
                        disabled={linkBusy}
                        className="w-full py-2.5 px-4 rounded-xl bg-[var(--accent-color)] text-[var(--bg-color)] text-xs font-black uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{linkBusy ? 'Creating Link...' : 'Create & Copy Instant Link'}</span>
                      </button>

                      <p className={`text-[10px] leading-relaxed ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        {linkRequirePassword
                          ? `With password required, append /YOUR_PASSWORD to the end of this link (?signin=code/YOUR_PASSWORD) to sign into @${activeAccount.username}.`
                          : `Anyone with this link can instantly sign into @${activeAccount.username} without typing your password — or append /YOUR_PASSWORD at any time. Changing your password or deleting/pausing a link invalidates it immediately.`}
                      </p>
                    </form>

                    {/* Existing Custom Links List */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                          Your Custom Sign-In Links ({signInLinks.length})
                        </span>
                      </div>

                      {linksLoading ? (
                        <div className={`p-4 rounded-xl border text-center text-xs font-mono ${isLight ? 'border-neutral-200 text-neutral-500' : 'border-white/10 text-neutral-400'}`}>
                          Loading your links...
                        </div>
                      ) : signInLinks.length === 0 ? (
                        <div className={`p-4 rounded-xl border text-center text-xs ${isLight ? 'border-neutral-200 bg-neutral-50 text-neutral-500' : 'border-white/10 bg-white/[0.02] text-neutral-400'}`}>
                          No custom sign-in links yet. Create one above to bookmark or share instant access!
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {signInLinks.map((link) => {
                            const fullUrl = buildSignInLinkUrl(link.code, link.requirePassword);
                            const destMeta = SIGN_IN_LINK_DESTINATIONS.find((d) => d.value === link.defaultView);
                            const isCopied = copiedLinkId === link.codeLower;
                            return (
                              <div
                                key={link.id}
                                className={`p-3 rounded-xl border space-y-2 transition-colors ${
                                  link.isActive
                                    ? isLight
                                      ? 'bg-white border-neutral-200'
                                      : 'bg-white/[0.03] border-white/10'
                                    : isLight
                                      ? 'bg-neutral-100 border-neutral-200 opacity-70'
                                      : 'bg-white/[0.015] border-white/5 opacity-65'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-xs font-extrabold truncate">{link.label}</span>
                                      <span
                                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                                          link.isActive
                                            ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-400'
                                            : 'bg-amber-500/15 border-amber-500/35 text-amber-400'
                                        }`}
                                      >
                                        {link.isActive ? 'Active' : 'Paused'}
                                      </span>
                                      {destMeta && destMeta.value !== 'all' && (
                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[var(--accent-color)]/15 text-[var(--accent-color)] border border-[var(--accent-color)]/30">
                                          {destMeta.label}
                                        </span>
                                      )}
                                      {link.openInAboutBlank && (
                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                                          about:blank
                                        </span>
                                      )}
                                      {link.requirePassword && (
                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                          <Lock className="w-2.5 h-2.5" />
                                          <span>Password at end</span>
                                        </span>
                                      )}
                                    </div>
                                    <div className={`text-[10px] font-mono mt-1 break-all ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                      {fullUrl}
                                      {link.requirePassword ? <strong>YOUR_PASSWORD</strong> : ''}
                                    </div>
                                    <div className={`text-[10px] mt-1 ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                                      Used {link.useCount}× {link.lastUsedAt ? `• Last used ${formatLastSeen(link.lastUsedAt)}` : '• Never used yet'}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                  <button
                                    type="button"
                                    onClick={() => handleCopyUrl(fullUrl, link.codeLower)}
                                    className={`px-2.5 py-1.5 rounded-lg border text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                      isCopied
                                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                        : isLight
                                          ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800'
                                          : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                                    }`}
                                  >
                                    {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    <span>{isCopied ? 'Copied!' : link.requirePassword ? 'Copy Prefix' : 'Copy'}</span>
                                  </button>

                                  {!link.requirePassword && (
                                    <button
                                      type="button"
                                      onClick={() => handleOpenSignInLink(link)}
                                      disabled={!link.isActive}
                                      className={`px-2.5 py-1.5 rounded-lg border text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-all disabled:opacity-40 ${
                                        isLight
                                          ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800'
                                          : 'bg-white/10 hover:bg-white/15 border-white/15 text-white'
                                      }`}
                                      title="Test/open this instant sign-in link in a new tab"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      <span>Open</span>
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => updateAccountSignInLinkRequirePassword(db, auth, link.codeLower, !link.requirePassword)}
                                    className={`px-2.5 py-1.5 rounded-lg border text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                      link.requirePassword
                                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                                        : isLight
                                          ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-700'
                                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
                                    }`}
                                    title={link.requirePassword ? 'Currently requires /password at the end — click to make 1-click instant' : 'Require adding /password at the end of this URL'}
                                  >
                                    <Lock className="w-3 h-3" />
                                    <span>{link.requirePassword ? 'Pass Req' : '1-Click'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => toggleAccountSignInLink(db, auth, link.codeLower, !link.isActive)}
                                    className={`px-2.5 py-1.5 rounded-lg border text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                      isLight
                                        ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-700'
                                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300'
                                    }`}
                                  >
                                    {link.isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                                    <span>{link.isActive ? 'Pause' : 'Enable'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => deleteAccountSignInLink(db, auth, link.codeLower)}
                                    className="px-2.5 py-1.5 rounded-lg border border-rose-500/35 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-all ml-auto"
                                    title="Delete custom sign-in link"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`p-4 rounded-xl border space-y-2 text-xs ${
                      isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Managed Account Required</span>
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-90">
                      You are currently signed in with the local Owner Admin password. Sign in with (or create) a managed account in Manage Accounts to generate portable instant sign-in links.
                    </p>
                  </div>
                )
              ) : (
                <>
              {activeAccount ? (
                <>
                  <div
                    className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                      isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-white/[0.03] border-white/10'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-black text-base truncate">@{activeAccount.username}</span>
                        {activeAccount.isAdmin && (
                          <span className="text-[9px] font-mono font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded border bg-amber-500/20 border-amber-500/50 text-amber-300 flex items-center gap-1">
                            <Shield className="w-2.5 h-2.5" />
                            <span>Admin</span>
                          </span>
                        )}
                        {activeAccount.roleBadge && (
                          <span
                            className={`text-[9px] font-mono font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                              isLight ? badgeMeta.lightChipClass : badgeMeta.chipClass
                            }`}
                          >
                            {activeAccount.roleBadge}
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] mt-1 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        Your bookmarks, recent history, theme, and Lobby Chat identity sync automatically.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className={`p-3 rounded-xl border ${isLight ? 'border-neutral-200 bg-neutral-50' : 'border-white/10 bg-white/[0.02]'}`}>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[var(--text-muted)]">
                        <MessageSquare className="w-3 h-3" />
                        <span>Chat Status</span>
                      </div>
                      <div
                        className={`font-bold mt-1 flex items-center gap-1 ${
                          activeAccount.chatBanned
                            ? 'text-rose-400'
                            : activeAccount.chatMuted
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                        }`}
                      >
                        {activeAccount.chatBanned ? (
                          <>
                            <Ban className="w-3.5 h-3.5" />
                            <span>Banned</span>
                          </>
                        ) : activeAccount.chatMuted ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Muted</span>
                          </>
                        ) : (
                          <span>Active (@{activeAccount.username})</span>
                        )}
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border ${isLight ? 'border-neutral-200 bg-neutral-50' : 'border-white/10 bg-white/[0.02]'}`}>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[var(--text-muted)]">
                        <Bookmark className="w-3 h-3" />
                        <span>Saved Data</span>
                      </div>
                      <div className="font-bold mt-1 flex items-center gap-2">
                        <span>{activeAccount.favorites?.length || 0} favs</span>
                        <span className="opacity-40">•</span>
                        <span className="flex items-center gap-1">
                          <History className="w-3 h-3" />
                          {activeAccount.recentlyPlayed?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border space-y-2 ${isLight ? 'border-neutral-200 bg-neutral-50' : 'border-white/10 bg-white/[0.02]'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">
                        Workspace Access
                      </span>
                      {activeAccount.isAdmin && (
                        <span className="text-[9.5px] font-mono font-bold text-amber-300">
                          Admin Bypass Active
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {WORKSPACE_ACCESS_KEYS.map(({ key, label }) => {
                        const allowed = Boolean(activeAccount.isAdmin) || (Boolean(activeAccount[key]) && workspaceConfig?.[key] !== false);
                        return (
                          <span
                            key={key}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold ${
                              allowed
                                ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-400'
                                : isLight
                                  ? 'bg-neutral-200/70 border-neutral-300 text-neutral-500'
                                  : 'bg-white/5 border-white/10 text-neutral-500'
                            }`}
                          >
                            {allowed ? <Check className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                            <span>{label}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                    isLight ? 'bg-amber-50 border-amber-200' : 'bg-amber-500/10 border-amber-500/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span className="font-mono font-black text-sm">Owner Admin Session</span>
                    </div>
                    <p className={`text-[11px] mt-1 ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
                      Signed in with full administrator and workspace permissions.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-2 flex flex-col gap-2">
                {activeAccount && db && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('links')}
                    className={`w-full py-2.5 px-4 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isLight
                        ? 'border-cyan-300 bg-cyan-50 hover:bg-cyan-100 text-cyan-800'
                        : 'border-cyan-500/40 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300'
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Custom Instant Sign-In Links ({signInLinks.length})</span>
                  </button>
                )}

                {onEnterWorkspace && (
                  <button
                    type="button"
                    onClick={() => {
                      onEnterWorkspace();
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[var(--accent-color)] text-[var(--bg-color)] font-black text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Open Workspace</span>
                  </button>
                )}

                {onOpenAdmin && (isOwnerAdmin || activeAccount?.isAdmin) && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAdmin();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-amber-500/40 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Manage Accounts (Admin)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{activeAccount ? `Sign Out of @${activeAccount.username}` : 'Sign Out'}</span>
                </button>
              </div>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isEducationPage && workspaceConfig?.siteLockdown && !errorMsg && (
                <div className="px-3 py-2 rounded-xl border border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                  <span>Sorry, the educational save feature is not available right now</span>
                </div>
              )}
              {signOutNotice && !errorMsg && (
                <div className="px-3 py-2 rounded-xl border border-amber-500/40 bg-amber-500/15 text-amber-300 text-xs font-semibold flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                  <span>{signOutNotice}</span>
                </div>
              )}

              {errorMsg && (
                <div className="px-3 py-2 rounded-xl border border-rose-500/40 bg-rose-500/15 text-rose-400 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {rememberedUsers.length > 0 && (
                <div
                  className={`p-2.5 rounded-xl border space-y-1.5 ${
                    isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-white/[0.03] border-white/10'
                  }`}
                >
                  <div className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Saved locally on this device
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {rememberedUsers.map((saved) => {
                      const isSelected = username.trim().toLowerCase() === saved.usernameLower ||
                        (saved.isOwnerAdmin && username.trim().toLowerCase() === 'admin');
                      return (
                        <div
                          key={saved.usernameLower}
                          className={`inline-flex items-center rounded-lg border text-xs font-mono font-bold transition-all ${
                            isSelected
                              ? 'bg-[var(--accent-color)]/20 border-[var(--accent-color)] text-[var(--accent-color)]'
                              : isLight
                                ? 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-500'
                                : 'bg-black/40 border-white/15 text-neutral-200 hover:border-white/35'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setUsername(saved.username);
                              setTimeout(() => passwordInputRef.current?.focus(), 20);
                            }}
                            className="px-2.5 py-1 cursor-pointer flex items-center gap-1"
                            title={`Sign back in as ${saved.username}`}
                          >
                            <User className="w-3 h-3" />
                            <span>@{saved.username}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const next = removeRememberedLocalUser(saved.usernameLower);
                              setRememberedUsers(next);
                              if (isSelected) setUsername(next[0]?.username || '');
                            }}
                            className="pr-1.5 py-1 opacity-60 hover:opacity-100 cursor-pointer"
                            title={`Forget saved user @${saved.username}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className={`block text-[10px] font-mono font-bold uppercase mb-1 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoFocus={!username}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold outline-none transition-colors ${
                    isLight
                      ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-neutral-900'
                      : 'bg-black/40 border-white/15 text-white focus:border-[var(--accent-color)]'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[10px] font-mono font-bold uppercase mb-1 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus={Boolean(username)}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border text-xs font-mono outline-none transition-colors ${
                      isLight
                        ? 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-neutral-900'
                        : 'bg-black/40 border-white/15 text-white focus:border-[var(--accent-color)]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className={`absolute right-3 p-1 rounded cursor-pointer ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <label
                className={`block p-3 rounded-xl border cursor-pointer transition-all select-none ${
                  openInSeparateTab
                    ? isLight
                      ? 'bg-neutral-100 border-neutral-900 text-neutral-900'
                      : 'bg-[var(--accent-color)]/10 border-[var(--accent-color)]/50 text-white'
                    : isLight
                      ? 'bg-neutral-50 border-neutral-200 text-neutral-700'
                      : 'bg-white/[0.02] border-white/10 text-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--accent-color)] shrink-0" />
                    <span className="text-xs font-bold">Open in a separate tab</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={openInSeparateTab}
                    onChange={(e) => setOpenInSeparateTab(e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center shrink-0 ${
                      openInSeparateTab
                        ? 'bg-[var(--accent-color)]'
                        : isLight
                          ? 'bg-neutral-300'
                          : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        openInSeparateTab ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </span>
                </div>
                <p className={`text-[10.5px] mt-1.5 leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  On by default to save information — opens your workspace in a separate tab so your session and progress stay saved.
                </p>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--accent-color)] text-[var(--bg-color)] text-xs font-black uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{submitting ? 'Signing In...' : 'Sign In'}</span>
              </button>

              <p className={`text-[10.5px] text-center leading-relaxed ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Tip: Sign in directly by adding <code>/usernamepassword</code> at the end of the URL (opens in <code>about:blank</code> by default).
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
