import { useEffect, useRef, useState } from 'react';
import {
  Ban,
  Bookmark,
  Check,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  History,
  Lock,
  LogIn,
  LogOut,
  MessageSquare,
  Shield,
  User,
  VolumeX,
  X,
} from 'lucide-react';
import {
  BADGE_COLORS,
  DEFAULT_WORKSPACE_CONFIG,
  WORKSPACE_ACCESS_KEYS,
  getRememberedLocalUsers,
  removeRememberedLocalUser,
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
}) {
  const isLight = mode === 'light';
  const [rememberedUsers, setRememberedUsers] = useState(() => getRememberedLocalUsers());
  const [username, setUsername] = useState(() => getRememberedLocalUsers()[0]?.username || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [openInSeparateTab, setOpenInSeparateTab] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const passwordInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const savedList = getRememberedLocalUsers();
    setRememberedUsers(savedList);
    if (!username && savedList.length > 0) {
      setUsername(savedList[0].username || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isSignedIn = Boolean(activeAccount || isOwnerAdmin);

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

    let preOpenedWin = null;
    if (openInSeparateTab) {
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
        className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${
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
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider">
                {isSignedIn ? 'Account Profile' : 'Sign In'}
              </h2>
              <p className={`text-[11px] ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {isSignedIn ? 'Synced with database & Lobby Chat' : 'Enter your username and password to continue'}
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

        <div className="p-5">
          {isSignedIn ? (
            <div className="space-y-4">
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
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
