import { useEffect, useMemo, useState } from 'react';
import {
  Ban,
  Check,
  Download,
  Edit3,
  Eye,
  EyeOff,
  Film,
  Gamepad2,
  Globe,
  Key,
  Layers,
  Lock,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Trash2,
  Tv,
  Unlock,
  UserCheck,
  Users,
  VolumeX,
  X,
  Youtube,
} from 'lucide-react';
import {
  BADGE_COLORS,
  DEFAULT_WORKSPACE_CONFIG,
  WORKSPACE_ACCESS_KEYS,
  createManagedAccount,
  deleteManagedAccount,
  generateStrongPassword,
  subscribeToAllManagedAccounts,
  updateManagedAccount,
  updateWorkspaceConfig,
} from '../utils/accountService';

const WORKSPACE_ICONS = {
  gamesAccess: Gamepad2,
  moviesAccess: Tv,
  moreMoviesAccess: Film,
  youtubeAccess: Youtube,
  lobbyChatAccess: MessageSquare,
  aiAccess: Sparkles,
  decoysAccess: Layers,
  downloadAccess: Download,
};

const DEFAULT_CREATE_PERMS = {
  gamesAccess: true,
  moviesAccess: true,
  moreMoviesAccess: true,
  youtubeAccess: true,
  lobbyChatAccess: true,
  aiAccess: false,
  decoysAccess: false,
  downloadAccess: true,
};

export default function AdminAccountsModal({
  isOpen,
  onClose,
  db,
  auth,
  mode = 'dark',
  activeAccount,
  workspaceConfig = DEFAULT_WORKSPACE_CONFIG,
}) {
  const isLight = mode === 'light';
  const [activeTab, setActiveTab] = useState('accounts');
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Create form state
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(true);
  const [newRoleBadge, setNewRoleBadge] = useState('');
  const [newBadgeColor, setNewBadgeColor] = useState('cyan');
  const [newIsActive, setNewIsActive] = useState(true);
  const [newIsAdmin, setNewIsAdmin] = useState(false);
  const [newPerms, setNewPerms] = useState(DEFAULT_CREATE_PERMS);
  const [creating, setCreating] = useState(false);

  // Per-account inline actions state
  const [resetTarget, setResetTarget] = useState(null);
  const [resetPassValue, setResetPassValue] = useState('');
  const [editTarget, setEditTarget] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [editBadgeColor, setEditBadgeColor] = useState('cyan');
  const [confirmDeleteKey, setConfirmDeleteKey] = useState(null);
  const [busyKey, setBusyKey] = useState(null);

  // Global workspace config form state
  const [lockdownMsgDraft, setLockdownMsgDraft] = useState(
    workspaceConfig?.lockdownMessage || DEFAULT_WORKSPACE_CONFIG.lockdownMessage,
  );
  const [globalBusyKey, setGlobalBusyKey] = useState(null);

  useEffect(() => {
    setLockdownMsgDraft(workspaceConfig?.lockdownMessage || DEFAULT_WORKSPACE_CONFIG.lockdownMessage);
  }, [workspaceConfig?.lockdownMessage]);

  useEffect(() => {
    if (!isOpen || !db) return;
    setLoading(true);
    const unsub = subscribeToAllManagedAccounts(
      db,
      auth,
      (list) => {
        setAccounts(list);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        setFeedback({ type: 'error', text: err?.message || 'Could not load accounts from database.' });
      },
    );
    return () => unsub();
  }, [isOpen, db, auth]);

  const showNotice = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => {
      setFeedback((cur) => (cur?.text === text ? null : cur));
    }, 3500);
  };

  const filteredAccounts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return accounts;
    return accounts.filter(
      (acc) =>
        acc.usernameLower.includes(q) ||
        (acc.roleBadge || '').toLowerCase().includes(q),
    );
  }, [accounts, searchQuery]);

  if (!isOpen) return null;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (creating) return;
    setCreating(true);
    try {
      const created = await createManagedAccount(db, auth, {
        username: newUsername,
        password: newPassword,
        roleBadge: newRoleBadge,
        badgeColor: newBadgeColor,
        isActive: newIsActive,
        isAdmin: newIsAdmin,
        ...newPerms,
      });
      setNewUsername('');
      setNewPassword('');
      setNewRoleBadge('');
      setNewPerms(DEFAULT_CREATE_PERMS);
      setNewIsActive(true);
      setNewIsAdmin(false);
      showNotice('success', `Created account @${created.username}${created.isAdmin ? ' (Admin)' : ''}`);
    } catch (err) {
      showNotice('error', err?.message || 'Failed to create account.');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleField = async (acc, field) => {
    setBusyKey(`${acc.usernameLower}:${field}`);
    try {
      await updateManagedAccount(db, auth, acc.usernameLower, { [field]: !acc[field] });
    } catch (err) {
      showNotice('error', err?.message || 'Failed to update account.');
    } finally {
      setBusyKey(null);
    }
  };

  const handleBulkAccountPerms = async (acc, allowAll) => {
    setBusyKey(`${acc.usernameLower}:bulk`);
    try {
      const patch = {};
      WORKSPACE_ACCESS_KEYS.forEach(({ key }) => {
        patch[key] = allowAll;
      });
      await updateManagedAccount(db, auth, acc.usernameLower, patch);
      showNotice('success', `${allowAll ? 'Granted' : 'Restricted'} all workspaces for @${acc.username}`);
    } catch (err) {
      showNotice('error', err?.message || 'Failed to update workspace access.');
    } finally {
      setBusyKey(null);
    }
  };

  const handlePasswordReset = async (e, acc) => {
    e.preventDefault();
    if (!resetPassValue.trim()) return;
    setBusyKey(`${acc.usernameLower}:reset`);
    try {
      await updateManagedAccount(db, auth, acc.usernameLower, { newPassword: resetPassValue.trim() });
      setResetTarget(null);
      setResetPassValue('');
      showNotice('success', `Password updated for @${acc.username}`);
    } catch (err) {
      showNotice('error', err?.message || 'Password reset failed.');
    } finally {
      setBusyKey(null);
    }
  };

  const handleSaveEdit = async (e, acc) => {
    e.preventDefault();
    setBusyKey(`${acc.usernameLower}:edit`);
    try {
      const updated = await updateManagedAccount(db, auth, acc.usernameLower, {
        username: editUsername,
        roleBadge: editBadge,
        badgeColor: editBadgeColor,
      });
      setEditTarget(null);
      showNotice('success', `Updated @${updated?.username || editUsername}`);
    } catch (err) {
      showNotice('error', err?.message || 'Failed to update profile.');
    } finally {
      setBusyKey(null);
    }
  };

  const handleDelete = async (acc) => {
    setBusyKey(`${acc.usernameLower}:delete`);
    try {
      await deleteManagedAccount(db, auth, acc.usernameLower);
      setConfirmDeleteKey(null);
      showNotice('success', `Deleted @${acc.username}`);
    } catch (err) {
      showNotice('error', err?.message || 'Failed to delete account.');
    } finally {
      setBusyKey(null);
    }
  };

  const handleGlobalUpdate = async (patch, busyLabel = 'global') => {
    setGlobalBusyKey(busyLabel);
    try {
      await updateWorkspaceConfig(db, auth, patch);
    } catch (err) {
      showNotice('error', err?.message || 'Failed to save global workspace access.');
    } finally {
      setGlobalBusyKey(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${
          isLight
            ? 'bg-white border-neutral-200 text-neutral-900'
            : 'bg-[#0e0d16] border-white/15 text-white'
        }`}
      >
        {/* Header */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b shrink-0 ${
            isLight ? 'border-neutral-200 bg-neutral-50' : 'border-white/10 bg-white/[0.03]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-color)] text-[var(--bg-color)] flex items-center justify-center shadow-sm shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider">Owner Access & Account Control Center</h2>
              <p className={`text-[11px] ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Control all global & per-account workspace access, accounts, passwords, and Lobby Chat moderation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Modal Tabs */}
            <div
              className={`flex items-center p-1 rounded-xl border ${
                isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-black/40 border-white/10'
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveTab('accounts')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTab === 'accounts'
                    ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-sm'
                    : isLight
                      ? 'text-neutral-600 hover:text-black'
                      : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Accounts ({accounts.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('global')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTab === 'global'
                    ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-sm'
                    : isLight
                      ? 'text-neutral-600 hover:text-black'
                      : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Global Access</span>
                {workspaceConfig?.siteLockdown && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Site Lockdown Active" />
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isLight ? 'text-neutral-500 hover:bg-neutral-200 hover:text-black' : 'text-neutral-400 hover:bg-white/10 hover:text-white'
              }`}
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {feedback && (
            <div
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                feedback.type === 'error'
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                  : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
              }`}
            >
              <span>{feedback.text}</span>
              <button type="button" onClick={() => setFeedback(null)} className="opacity-70 hover:opacity-100 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {activeTab === 'global' ? (
            <div className="space-y-4">
              {/* Master Lockdown & Shared Passcodes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div
                  className={`rounded-xl border p-4 space-y-3 ${
                    workspaceConfig?.siteLockdown
                      ? 'border-rose-500/50 bg-rose-500/10'
                      : isLight
                        ? 'bg-neutral-50 border-neutral-200'
                        : 'bg-white/[0.03] border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
                        <ShieldAlert className={`w-4 h-4 ${workspaceConfig?.siteLockdown ? 'text-rose-400' : 'text-[var(--accent-color)]'}`} />
                        <span>Site Lockdown Mode</span>
                      </div>
                      <p className={`text-[11px] mt-1 leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                        Locks every workspace for all visitors and signed-in accounts. Only the owner admin password can enter.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={globalBusyKey === 'siteLockdown'}
                      onClick={() =>
                        handleGlobalUpdate({ siteLockdown: !workspaceConfig?.siteLockdown }, 'siteLockdown')
                      }
                      className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono font-black uppercase cursor-pointer shrink-0 transition-all ${
                        workspaceConfig?.siteLockdown
                          ? 'bg-rose-600 border-rose-500 text-white'
                          : isLight
                            ? 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                            : 'bg-white/5 border-white/15 text-neutral-300 hover:bg-white/10'
                      }`}
                    >
                      {workspaceConfig?.siteLockdown ? 'Locked (ON)' : 'Open (OFF)'}
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleGlobalUpdate({ lockdownMessage: lockdownMsgDraft }, 'lockdownMsg').then(() =>
                        showNotice('success', 'Lockdown notice saved.'),
                      );
                    }}
                    className="flex items-center gap-2 pt-1"
                  >
                    <input
                      type="text"
                      value={lockdownMsgDraft}
                      onChange={(e) => setLockdownMsgDraft(e.target.value)}
                      maxLength={200}
                      placeholder="Custom lockdown notice..."
                      className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
                        isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-black/40 border-white/15 text-white'
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={globalBusyKey === 'lockdownMsg'}
                      className="px-3 py-1.5 rounded-lg bg-[var(--accent-color)] text-[var(--bg-color)] text-[10px] font-black uppercase cursor-pointer"
                    >
                      Save
                    </button>
                  </form>
                </div>

                <div
                  className="rounded-xl border p-4 flex flex-col justify-between gap-3 border-amber-500/40 bg-amber-500/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
                        <Key className="w-4 h-4 text-[var(--accent-color)]" />
                        <span>Shared Public Passcodes</span>
                      </div>
                      <p className={`text-[11px] mt-1 leading-relaxed ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                        Legacy shared passcodes (tungtung, ttt1234, 1378, 2026) are permanently disabled. Users must sign in with an assigned account or the owner password.
                      </p>
                    </div>
                    <span className="px-3 py-1.5 rounded-lg border text-[11px] font-mono font-black uppercase shrink-0 bg-amber-500/20 border-amber-500/50 text-amber-300">
                      Disabled
                    </span>
                  </div>

                  <div className={`text-[11px] flex items-center gap-1.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Shared codes blocked — only assigned accounts &amp; owner can enter.</span>
                  </div>
                </div>
              </div>

              {/* Site-Wide Workspace Access Grid */}
              <div
                className={`rounded-xl border p-4 space-y-3.5 ${
                  isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-white/[0.03] border-white/10'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider">Site-Wide Workspace Controls</h3>
                    <p className={`text-[11px] ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      Disable a workspace globally for all non-owner users (even if their individual account has it enabled).
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={globalBusyKey === 'enableAll'}
                      onClick={() => {
                        const patch = {};
                        WORKSPACE_ACCESS_KEYS.forEach(({ key }) => {
                          patch[key] = true;
                        });
                        handleGlobalUpdate(patch, 'enableAll').then(() => showNotice('success', 'All workspaces enabled globally.'));
                      }}
                      className="px-2.5 py-1 rounded-lg border border-emerald-500/40 bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold uppercase cursor-pointer"
                    >
                      Enable All
                    </button>
                    <button
                      type="button"
                      disabled={globalBusyKey === 'disableAll'}
                      onClick={() => {
                        const patch = {};
                        WORKSPACE_ACCESS_KEYS.forEach(({ key }) => {
                          patch[key] = false;
                        });
                        handleGlobalUpdate(patch, 'disableAll').then(() => showNotice('success', 'All non-owner workspaces restricted.'));
                      }}
                      className="px-2.5 py-1 rounded-lg border border-rose-500/40 bg-rose-500/15 text-rose-400 text-[10px] font-mono font-bold uppercase cursor-pointer"
                    >
                      Restrict All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {WORKSPACE_ACCESS_KEYS.map(({ key, label, description }) => {
                    const Icon = WORKSPACE_ICONS[key] || Shield;
                    const enabled = workspaceConfig?.[key] !== false;
                    return (
                      <button
                        key={key}
                        type="button"
                        disabled={globalBusyKey === key}
                        onClick={() => handleGlobalUpdate({ [key]: !enabled }, key)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          enabled
                            ? isLight
                              ? 'bg-white border-emerald-300 text-neutral-900 hover:border-emerald-500'
                              : 'bg-emerald-500/10 border-emerald-500/35 text-white hover:border-emerald-400'
                            : isLight
                              ? 'bg-neutral-100 border-neutral-300 text-neutral-500'
                              : 'bg-rose-500/10 border-rose-500/35 text-neutral-300'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 font-bold text-xs">
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${enabled ? 'text-emerald-400' : 'text-rose-400'}`} />
                            <span className="truncate">{label}</span>
                          </div>
                          <div className={`text-[10px] mt-0.5 truncate ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                            {description}
                          </div>
                        </div>
                        <span
                          className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded border shrink-0 ${
                            enabled
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          }`}
                        >
                          {enabled ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Create New Account Form */}
              <form
                onSubmit={handleCreate}
                className={`rounded-xl border p-4 space-y-3.5 ${
                  isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-white/[0.03] border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                    Create New Account
                  </span>
                  <span className={`text-[10px] font-mono ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Admin-only creation • Saved to Firestore
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className={`block text-[10px] font-mono font-bold uppercase mb-1 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="e.g. PixelAce"
                      maxLength={20}
                      className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold outline-none transition-colors ${
                        isLight
                          ? 'bg-white border-neutral-300 text-neutral-900 focus:border-neutral-900'
                          : 'bg-black/40 border-white/15 text-white focus:border-[var(--accent-color)]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[10px] font-mono font-bold uppercase mb-1 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      Unique Password
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter password"
                        className={`w-full pl-3 pr-14 py-2 rounded-lg border text-xs font-mono outline-none transition-colors ${
                          isLight
                            ? 'bg-white border-neutral-300 text-neutral-900 focus:border-neutral-900'
                            : 'bg-black/40 border-white/15 text-white focus:border-[var(--accent-color)]'
                        }`}
                      />
                      <div className="absolute right-1.5 flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((p) => !p)}
                          className={`p-1 rounded hover:bg-white/10 cursor-pointer ${isLight ? 'text-neutral-500 hover:bg-neutral-200' : 'text-neutral-400'}`}
                          title={showNewPassword ? 'Hide password' : 'Show password'}
                        >
                          {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewPassword(generateStrongPassword(10));
                            setShowNewPassword(true);
                          }}
                          className={`p-1 rounded hover:bg-white/10 cursor-pointer ${isLight ? 'text-neutral-500 hover:bg-neutral-200' : 'text-neutral-400'}`}
                          title="Generate random password"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-mono font-bold uppercase mb-1 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      Custom Role Badge
                    </label>
                    <input
                      type="text"
                      value={newRoleBadge}
                      onChange={(e) => setNewRoleBadge(e.target.value)}
                      placeholder="Optional (e.g. VIP, Mod)"
                      maxLength={20}
                      className={`w-full px-3 py-2 rounded-lg border text-xs outline-none transition-colors ${
                        isLight
                          ? 'bg-white border-neutral-300 text-neutral-900 focus:border-neutral-900'
                          : 'bg-black/40 border-white/15 text-white focus:border-[var(--accent-color)]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-[10px] font-mono font-bold uppercase mb-1 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      Badge Color
                    </label>
                    <div className="flex items-center gap-1.5 h-[34px]">
                      {Object.entries(BADGE_COLORS).map(([key, meta]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setNewBadgeColor(key)}
                          title={meta.label}
                          className={`w-6 h-6 rounded-md border transition-transform cursor-pointer flex items-center justify-center ${
                            newBadgeColor === key ? 'scale-110 ring-2 ring-offset-1 ring-[var(--accent-color)] border-white' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: meta.swatch }}
                        >
                          {newBadgeColor === key && <Check className="w-3 h-3 text-black font-bold" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Workspace Permissions for New Account */}
                <div className="space-y-1.5 pt-1">
                  <div className={`text-[10px] font-mono font-bold uppercase ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    Allowed Workspaces
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setNewIsActive((v) => !v)}
                      className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        newIsActive
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                          : 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                      }`}
                    >
                      <UserCheck className="w-3 h-3" />
                      <span>{newIsActive ? 'Active' : 'Disabled'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewIsAdmin((v) => !v)}
                      className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        newIsAdmin
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : isLight
                            ? 'bg-white border-neutral-300 text-neutral-500'
                            : 'bg-white/5 border-white/10 text-neutral-400'
                      }`}
                      title="Grant full admin privileges (manage accounts & site controls)"
                    >
                      <Shield className="w-3 h-3" />
                      <span>{newIsAdmin ? 'Admin: ON' : 'Admin: OFF'}</span>
                    </button>

                    {WORKSPACE_ACCESS_KEYS.map(({ key, label }) => {
                      const Icon = WORKSPACE_ICONS[key] || Shield;
                      const enabled = Boolean(newPerms[key]);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setNewPerms((prev) => ({ ...prev, [key]: !prev[key] }))}
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                            enabled
                              ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                              : isLight
                                ? 'bg-white border-neutral-300 text-neutral-500'
                                : 'bg-white/5 border-white/10 text-neutral-400'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{label}</span>
                        </button>
                      );
                    })}

                    <button
                      type="submit"
                      disabled={creating}
                      className="ml-auto px-4 py-1.5 rounded-lg bg-[var(--accent-color)] text-[var(--bg-color)] text-xs font-black uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{creating ? 'Creating...' : 'Add Account'}</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Existing Accounts Header & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                  <span>Managed Accounts</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                      isLight ? 'bg-neutral-100 border-neutral-200 text-neutral-700' : 'bg-white/5 border-white/10 text-neutral-300'
                    }`}
                  >
                    {accounts.length} total
                  </span>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className={`w-3.5 h-3.5 absolute left-3 top-2.5 ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search username or role..."
                    className={`w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs outline-none ${
                      isLight
                        ? 'bg-white border-neutral-300 text-neutral-900 focus:border-neutral-900'
                        : 'bg-black/40 border-white/15 text-white focus:border-[var(--accent-color)]'
                    }`}
                  />
                </div>
              </div>

              {/* Accounts List */}
              {loading ? (
                <div className={`py-12 text-center text-xs font-mono ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Loading database accounts...
                </div>
              ) : filteredAccounts.length === 0 ? (
                <div
                  className={`py-10 text-center rounded-xl border border-dashed text-xs ${
                    isLight ? 'border-neutral-300 text-neutral-500' : 'border-white/15 text-neutral-400'
                  }`}
                >
                  {accounts.length === 0
                    ? 'No accounts created yet. Use the form above to add your first account.'
                    : 'No accounts match your search.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAccounts.map((acc) => {
                    const colorMeta = BADGE_COLORS[acc.badgeColor] || BADGE_COLORS.cyan;
                    const isSelf = activeAccount?.usernameLower === acc.usernameLower;
                    return (
                      <div
                        key={acc.usernameLower}
                        className={`rounded-xl border p-3.5 transition-colors space-y-2.5 ${
                          !acc.isActive
                            ? isLight
                              ? 'bg-neutral-100/80 border-neutral-300 opacity-75'
                              : 'bg-white/[0.01] border-white/10 opacity-75'
                            : isLight
                              ? 'bg-white border-neutral-200'
                              : 'bg-white/[0.03] border-white/10'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                          {/* Identity & Stats */}
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-lg border flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                                acc.isActive
                                  ? isLight
                                    ? 'bg-neutral-900 text-white border-neutral-900'
                                    : 'bg-[var(--accent-color)]/15 text-[var(--accent-color)] border-[var(--accent-color)]/30'
                                  : 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30'
                              }`}
                            >
                              {acc.username.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-bold text-sm truncate">@{acc.username}</span>
                                {acc.isAdmin && (
                                  <span className="text-[9px] font-mono font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded border bg-amber-500/20 border-amber-500/50 text-amber-300 flex items-center gap-1">
                                    <Shield className="w-2.5 h-2.5" />
                                    <span>Admin</span>
                                  </span>
                                )}
                                {acc.roleBadge && (
                                  <span
                                    className={`text-[9px] font-mono font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                                      isLight ? colorMeta.lightChipClass : colorMeta.chipClass
                                    }`}
                                  >
                                    {acc.roleBadge}
                                  </span>
                                )}
                                {isSelf && (
                                  <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                    Signed In
                                  </span>
                                )}
                                {!acc.isActive && (
                                  <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                                    Disabled
                                  </span>
                                )}
                              </div>
                              <div className={`text-[10px] font-mono mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                <span>{acc.favorites.length} bookmarks</span>
                                <span>{acc.recentlyPlayed.length} recent</span>
                                <span>
                                  {acc.lastLoginAt
                                    ? `Last login ${new Date(acc.lastLoginAt).toLocaleDateString()}`
                                    : 'Never signed in'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Status, Moderation & Account Management Actions */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              type="button"
                              disabled={busyKey === `${acc.usernameLower}:isAdmin`}
                              onClick={() => handleToggleField(acc, 'isAdmin')}
                              className={`px-2 py-1 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                acc.isAdmin
                                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                                  : isLight
                                    ? 'bg-neutral-100 border-neutral-300 text-neutral-500'
                                    : 'bg-white/5 border-white/10 text-neutral-400'
                              }`}
                              title={acc.isAdmin ? 'Admin privileges enabled (click to revoke)' : 'Grant Admin privileges to this account'}
                            >
                              <Shield className="w-3 h-3" />
                              <span>{acc.isAdmin ? 'Admin' : 'Make Admin'}</span>
                            </button>

                            <button
                              type="button"
                              disabled={busyKey === `${acc.usernameLower}:isActive`}
                              onClick={() => handleToggleField(acc, 'isActive')}
                              className={`px-2 py-1 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                acc.isActive
                                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                  : 'bg-neutral-500/15 border-neutral-500/30 text-neutral-400'
                              }`}
                              title={acc.isActive ? 'Account enabled (click to disable)' : 'Account disabled (click to enable)'}
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>{acc.isActive ? 'Active' : 'Disabled'}</span>
                            </button>

                            <button
                              type="button"
                              disabled={busyKey === `${acc.usernameLower}:chatMuted`}
                              onClick={() => handleToggleField(acc, 'chatMuted')}
                              className={`px-2 py-1 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                acc.chatMuted
                                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                                  : isLight
                                    ? 'bg-neutral-100 border-neutral-300 text-neutral-500'
                                    : 'bg-white/5 border-white/10 text-neutral-400'
                              }`}
                              title="Mute or unmute user in Lobby Chat"
                            >
                              <VolumeX className="w-3 h-3" />
                              <span>{acc.chatMuted ? 'Muted' : 'Mute'}</span>
                            </button>

                            <button
                              type="button"
                              disabled={busyKey === `${acc.usernameLower}:chatBanned`}
                              onClick={() => handleToggleField(acc, 'chatBanned')}
                              className={`px-2 py-1 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                acc.chatBanned
                                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                                  : isLight
                                    ? 'bg-neutral-100 border-neutral-300 text-neutral-500'
                                    : 'bg-white/5 border-white/10 text-neutral-400'
                              }`}
                              title="Ban or unban user from Lobby Chat"
                            >
                              <Ban className="w-3 h-3" />
                              <span>{acc.chatBanned ? 'Banned' : 'Ban'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (resetTarget === acc.usernameLower) {
                                  setResetTarget(null);
                                  setResetPassValue('');
                                } else {
                                  setEditTarget(null);
                                  setConfirmDeleteKey(null);
                                  setResetTarget(acc.usernameLower);
                                  setResetPassValue('');
                                }
                              }}
                              className={`px-2 py-1 rounded-lg border text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                resetTarget === acc.usernameLower
                                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)]'
                                  : isLight
                                    ? 'bg-neutral-100 border-neutral-300 text-neutral-700 hover:bg-neutral-200'
                                    : 'bg-white/5 border-white/15 text-neutral-300 hover:bg-white/10'
                              }`}
                              title="Reset user's password"
                            >
                              <Key className="w-3 h-3" />
                              <span>Password</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (editTarget === acc.usernameLower) {
                                  setEditTarget(null);
                                } else {
                                  setResetTarget(null);
                                  setConfirmDeleteKey(null);
                                  setEditTarget(acc.usernameLower);
                                  setEditUsername(acc.username);
                                  setEditBadge(acc.roleBadge || '');
                                  setEditBadgeColor(acc.badgeColor || 'cyan');
                                }
                              }}
                              className={`p-1.5 rounded-lg border text-[10px] cursor-pointer transition-all ${
                                editTarget === acc.usernameLower
                                  ? 'bg-[var(--accent-color)] text-[var(--bg-color)] border-[var(--accent-color)]'
                                  : isLight
                                    ? 'bg-neutral-100 border-neutral-300 text-neutral-700 hover:bg-neutral-200'
                                    : 'bg-white/5 border-white/15 text-neutral-300 hover:bg-white/10'
                              }`}
                              title="Edit username and role badge"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>

                            {confirmDeleteKey === acc.usernameLower ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={busyKey === `${acc.usernameLower}:delete`}
                                  onClick={() => handleDelete(acc)}
                                  className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold cursor-pointer"
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteKey(null)}
                                  className={`px-2 py-1 rounded-lg text-[10px] cursor-pointer ${
                                    isLight ? 'bg-neutral-200 text-neutral-700' : 'bg-white/10 text-neutral-300'
                                  }`}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteKey(acc.usernameLower)}
                                className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer transition-all"
                                title="Delete account"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Per-Account Workspace Access Toggles */}
                        <div
                          className={`pt-2 border-t flex flex-wrap items-center gap-1.5 ${
                            isLight ? 'border-neutral-200' : 'border-white/10'
                          }`}
                        >
                          <span className={`text-[9.5px] font-mono font-bold uppercase mr-1 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                            Workspaces:
                          </span>
                          {WORKSPACE_ACCESS_KEYS.map(({ key, label }) => {
                            const Icon = WORKSPACE_ICONS[key] || Shield;
                            const enabled = Boolean(acc[key]);
                            const globalDisabled = workspaceConfig?.[key] === false;
                            return (
                              <button
                                key={key}
                                type="button"
                                disabled={busyKey === `${acc.usernameLower}:${key}` || busyKey === `${acc.usernameLower}:bulk`}
                                onClick={() => handleToggleField(acc, key)}
                                title={
                                  globalDisabled
                                    ? `${label} (globally disabled right now in Global Access)`
                                    : `Toggle ${label} access for @${acc.username}`
                                }
                                className={`px-2 py-0.5 rounded-md border text-[9.5px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                  enabled
                                    ? globalDisabled
                                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300/80'
                                      : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                                    : isLight
                                      ? 'bg-neutral-100 border-neutral-300 text-neutral-400 line-through'
                                      : 'bg-white/[0.03] border-white/10 text-neutral-500 line-through'
                                }`}
                              >
                                <Icon className="w-2.5 h-2.5" />
                                <span>{label}</span>
                              </button>
                            );
                          })}
                          <div className="flex items-center gap-1 ml-auto">
                            <button
                              type="button"
                              disabled={busyKey === `${acc.usernameLower}:bulk`}
                              onClick={() => handleBulkAccountPerms(acc, true)}
                              className={`px-1.5 py-0.5 rounded text-[9px] font-mono cursor-pointer ${
                                isLight ? 'text-emerald-700 hover:bg-emerald-100' : 'text-emerald-400 hover:bg-emerald-500/15'
                              }`}
                            >
                              All
                            </button>
                            <button
                              type="button"
                              disabled={busyKey === `${acc.usernameLower}:bulk`}
                              onClick={() => handleBulkAccountPerms(acc, false)}
                              className={`px-1.5 py-0.5 rounded text-[9px] font-mono cursor-pointer ${
                                isLight ? 'text-rose-700 hover:bg-rose-100' : 'text-rose-400 hover:bg-rose-500/15'
                              }`}
                            >
                              None
                            </button>
                          </div>
                        </div>

                        {/* Inline Password Reset Form */}
                        {resetTarget === acc.usernameLower && (
                          <form
                            onSubmit={(e) => handlePasswordReset(e, acc)}
                            className={`pt-2.5 border-t flex flex-wrap items-center gap-2 animate-fade-in ${
                              isLight ? 'border-neutral-200' : 'border-white/10'
                            }`}
                          >
                            <span className="text-[10px] font-mono font-bold uppercase text-[var(--accent-color)]">
                              New Password:
                            </span>
                            <input
                              type="text"
                              required
                              value={resetPassValue}
                              onChange={(e) => setResetPassValue(e.target.value)}
                              placeholder="Enter new password..."
                              autoFocus
                              className={`flex-1 min-w-[160px] px-2.5 py-1.5 rounded-lg border text-xs font-mono outline-none ${
                                isLight
                                  ? 'bg-white border-neutral-300 text-neutral-900'
                                  : 'bg-black/40 border-white/15 text-white'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setResetPassValue(generateStrongPassword(10))}
                              className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-mono cursor-pointer ${
                                isLight ? 'border-neutral-300 hover:bg-neutral-100' : 'border-white/15 hover:bg-white/10'
                              }`}
                            >
                              Generate
                            </button>
                            <button
                              type="submit"
                              disabled={busyKey === `${acc.usernameLower}:reset`}
                              className="px-3 py-1.5 rounded-lg bg-[var(--accent-color)] text-[var(--bg-color)] text-[10px] font-black uppercase cursor-pointer"
                            >
                              Save Password
                            </button>
                          </form>
                        )}

                        {/* Inline Profile / Badge Editor */}
                        {editTarget === acc.usernameLower && (
                          <form
                            onSubmit={(e) => handleSaveEdit(e, acc)}
                            className={`pt-2.5 border-t flex flex-wrap items-center gap-2.5 animate-fade-in ${
                              isLight ? 'border-neutral-200' : 'border-white/10'
                            }`}
                          >
                            <input
                              type="text"
                              required
                              value={editUsername}
                              onChange={(e) => setEditUsername(e.target.value)}
                              placeholder="Username"
                              maxLength={20}
                              className={`w-36 px-2.5 py-1.5 rounded-lg border text-xs font-mono outline-none ${
                                isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-black/40 border-white/15 text-white'
                              }`}
                            />
                            <input
                              type="text"
                              value={editBadge}
                              onChange={(e) => setEditBadge(e.target.value)}
                              placeholder="Role badge (optional)"
                              maxLength={20}
                              className={`w-40 px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
                                isLight ? 'bg-white border-neutral-300 text-neutral-900' : 'bg-black/40 border-white/15 text-white'
                              }`}
                            />
                            <div className="flex items-center gap-1">
                              {Object.entries(BADGE_COLORS).map(([key, meta]) => (
                                <button
                                  key={key}
                                  type="button"
                                  onClick={() => setEditBadgeColor(key)}
                                  title={meta.label}
                                  className={`w-5 h-5 rounded border cursor-pointer flex items-center justify-center ${
                                    editBadgeColor === key ? 'ring-2 ring-[var(--accent-color)] border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                                  }`}
                                  style={{ backgroundColor: meta.swatch }}
                                />
                              ))}
                            </div>
                            <button
                              type="submit"
                              disabled={busyKey === `${acc.usernameLower}:edit`}
                              className="px-3 py-1.5 rounded-lg bg-[var(--accent-color)] text-[var(--bg-color)] text-[10px] font-black uppercase cursor-pointer ml-auto"
                            >
                              Save Changes
                            </button>
                          </form>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className={`px-5 py-3 border-t text-[11px] flex items-center justify-between shrink-0 ${
            isLight ? 'border-neutral-200 bg-neutral-50 text-neutral-500' : 'border-white/10 bg-white/[0.02] text-neutral-400'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[var(--accent-color)]" />
            <span>Changes enforce live across all workspaces & Lobby Chat sessions.</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className={`px-3 py-1 rounded-lg border text-xs font-semibold cursor-pointer ${
              isLight ? 'border-neutral-300 hover:bg-neutral-200 text-neutral-800' : 'border-white/15 hover:bg-white/10 text-white'
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
