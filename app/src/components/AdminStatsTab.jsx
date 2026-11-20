import { useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  Clock,
  Gamepad2,
  Heart,
  Palette,
  Search,
  Settings2,
  Shield,
  Star,
  Users,
} from 'lucide-react';
import {
  ACTIVITY_BUCKET_KEYS,
  ACTIVITY_LABELS,
  GIRLS_THEME_POLICY_META,
  WORKSPACE_ACCESS_KEYS,
  formatDurationMs,
  formatLastSeen,
  getAccountTodayTimeMs,
  isAccountOnline,
} from '../utils/accountService';

const PORTAL_THEME_META = {
  girls: { label: 'Girls', swatch: '#f472b6' },
  cyborg: { label: 'Cyborg', swatch: '#22c55e' },
  midnight: { label: 'Midnight', swatch: '#6366f1' },
  sunset: { label: 'Sunset', swatch: '#f59e0b' },
  violet: { label: 'Violet', swatch: '#a855f7' },
  ice: { label: 'Glacier', swatch: '#38bdf8' },
  forest: { label: 'Forest', swatch: '#10b981' },
  'rose-pine': { label: 'Rose Pine', swatch: '#fb7185' },
  none: { label: 'Monochrome', swatch: '#a3a3a3' },
  unset: { label: 'Default / Unset', swatch: '#64748b' },
};

const ACTIVITY_COLORS = {
  games: '#38bdf8',
  youtube: '#f43f5e',
  movies: '#a855f7',
  moremovies: '#f59e0b',
  lobbychat: '#10b981',
  ai: '#06b6d4',
  catalog: '#94a3b8',
};

export default function AdminStatsTab({
  accounts = [],
  loading = false,
  games = [],
  workspaceConfig = {},
  presenceNow = Date.now(),
  isLight = false,
  busyKey = null,
  onToggleGirlsTheme,
  onJumpToPolicy,
}) {
  const [tableSearch, setTableSearch] = useState('');
  const [sortBy, setSortBy] = useState('totalTime'); // 'totalTime' | 'todayTime' | 'lastActive' | 'sessions' | 'favorites'
  const [gameMetricTab, setGameMetricTab] = useState('favorites'); // 'favorites' | 'recent'

  const surfaceCls = isLight
    ? 'bg-neutral-50 border-neutral-200 text-neutral-900'
    : 'bg-white/[0.025] border-white/10 text-white';
  const kpiTileCls = isLight
    ? 'bg-white border-neutral-200 text-neutral-900'
    : 'bg-white/[0.03] border-white/10 text-white';
  const mutedCls = isLight ? 'text-neutral-500' : 'text-neutral-400';
  const dividerCls = isLight ? 'border-neutral-200' : 'border-white/10';
  const trackCls = isLight ? 'bg-neutral-200' : 'bg-white/10';

  const gamesById = useMemo(() => {
    const map = new Map();
    (games || []).forEach((g) => {
      if (g?.id) map.set(g.id, g);
    });
    return map;
  }, [games]);

  const metrics = useMemo(() => {
    const total = accounts.length;
    let activeCount = 0;
    let disabledCount = 0;
    let adminCount = 0;
    let mutedCount = 0;
    let bannedCount = 0;
    let girlsAssignedCount = 0;
    let onlineUsers = [];
    let totalAllTimeMs = 0;
    let totalTodayMs = 0;
    let totalSessions = 0;
    let activeUsersWithTime = 0;

    const activityTotals = {};
    ACTIVITY_BUCKET_KEYS.forEach((k) => {
      activityTotals[k] = 0;
    });

    const themeCounts = {};
    const modeCounts = { dark: 0, light: 0, unset: 0 };
    const workspaceCounts = {};
    WORKSPACE_ACCESS_KEYS.forEach(({ key }) => {
      workspaceCounts[key] = 0;
    });

    const recency = { online: 0, day: 0, week: 0, olderOrNever: 0 };
    const favCounts = new Map();
    const recentCounts = new Map();

    accounts.forEach((acc) => {
      if (acc.isActive !== false) activeCount += 1;
      else disabledCount += 1;
      if (acc.isAdmin) adminCount += 1;
      if (acc.chatMuted) mutedCount += 1;
      if (acc.chatBanned) bannedCount += 1;
      if (acc.defaultGirlsTheme) girlsAssignedCount += 1;

      const online = isAccountOnline(acc, presenceNow);
      const todayMs = getAccountTodayTimeMs(acc, presenceNow);
      const totalMs = Math.max(0, Number(acc.totalTimeMs || 0));
      const sessions = Math.max(0, Number(acc.sessionCount || 0));

      totalAllTimeMs += totalMs;
      totalTodayMs += todayMs;
      totalSessions += sessions;
      if (totalMs > 0 || sessions > 0) activeUsersWithTime += 1;

      if (online) {
        onlineUsers.push({
          ...acc,
          todayMs,
          totalMs,
        });
      }

      ACTIVITY_BUCKET_KEYS.forEach((k) => {
        activityTotals[k] += Math.max(0, Number(acc.activityTimeMs?.[k] || 0));
      });

      const themeKey = acc.preferredTheme && PORTAL_THEME_META[acc.preferredTheme] ? acc.preferredTheme : 'unset';
      themeCounts[themeKey] = (themeCounts[themeKey] || 0) + 1;

      if (acc.preferredMode === 'dark') modeCounts.dark += 1;
      else if (acc.preferredMode === 'light') modeCounts.light += 1;
      else modeCounts.unset += 1;

      WORKSPACE_ACCESS_KEYS.forEach(({ key }) => {
        if (acc.isAdmin || acc[key] || (key === 'aiAccess' && acc.allowAiOverride)) {
          workspaceCounts[key] += 1;
        }
      });

      const lastActivity = Number(acc.lastSeenAt || acc.lastLoginAt || 0);
      if (online) recency.online += 1;
      else if (lastActivity && presenceNow - lastActivity <= 24 * 60 * 60 * 1000) recency.day += 1;
      else if (lastActivity && presenceNow - lastActivity <= 7 * 24 * 60 * 60 * 1000) recency.week += 1;
      else recency.olderOrNever += 1;

      (acc.favorites || []).forEach((gameId) => {
        favCounts.set(gameId, (favCounts.get(gameId) || 0) + 1);
      });
      (acc.recentlyPlayed || []).forEach((gameId) => {
        recentCounts.set(gameId, (recentCounts.get(gameId) || 0) + 1);
      });
    });

    onlineUsers.sort((a, b) => b.todayMs - a.todayMs || b.totalMs - a.totalMs);

    const activityGrandTotal = ACTIVITY_BUCKET_KEYS.reduce((sum, k) => sum + activityTotals[k], 0);
    const activityRows = ACTIVITY_BUCKET_KEYS.map((key) => ({
      key,
      label: ACTIVITY_LABELS[key] || key,
      ms: activityTotals[key],
      pct: activityGrandTotal > 0 ? Math.round((activityTotals[key] / activityGrandTotal) * 100) : 0,
      color: ACTIVITY_COLORS[key] || '#94a3b8',
    })).sort((a, b) => b.ms - a.ms);

    const themeRows = Object.entries(themeCounts)
      .map(([key, count]) => ({
        key,
        label: PORTAL_THEME_META[key]?.label || key,
        swatch: PORTAL_THEME_META[key]?.swatch || '#64748b',
        count,
        pct: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const toRankedGames = (countMap) =>
      Array.from(countMap.entries())
        .map(([id, count]) => {
          const game = gamesById.get(id);
          return {
            id,
            title: game?.title || id,
            category: game?.category || 'Game',
            count,
          };
        })
        .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title))
        .slice(0, 8);

    return {
      total,
      activeCount,
      disabledCount,
      adminCount,
      mutedCount,
      bannedCount,
      girlsAssignedCount,
      onlineUsers,
      onlineCount: onlineUsers.length,
      totalAllTimeMs,
      totalTodayMs,
      totalSessions,
      avgTimeMs: activeUsersWithTime > 0 ? Math.round(totalAllTimeMs / activeUsersWithTime) : 0,
      activityGrandTotal,
      activityRows,
      themeRows,
      modeCounts,
      workspaceCounts,
      recency,
      topFavoritedGames: toRankedGames(favCounts),
      topRecentGames: toRankedGames(recentCounts),
    };
  }, [accounts, presenceNow, gamesById]);

  const userRows = useMemo(() => {
    const q = tableSearch.trim().toLowerCase();
    const list = accounts
      .map((acc) => {
        const online = isAccountOnline(acc, presenceNow);
        const todayMs = getAccountTodayTimeMs(acc, presenceNow);
        const totalMs = Math.max(0, Number(acc.totalTimeMs || 0));
        const sessions = Math.max(0, Number(acc.sessionCount || 0));
        const lastActiveTs = Number(acc.lastSeenAt || acc.lastLoginAt || 0);

        let topBucketKey = '';
        let topBucketMs = 0;
        ACTIVITY_BUCKET_KEYS.forEach((k) => {
          const val = Number(acc.activityTimeMs?.[k] || 0);
          if (val > topBucketMs) {
            topBucketMs = val;
            topBucketKey = k;
          }
        });

        return {
          acc,
          online,
          todayMs,
          totalMs,
          sessions,
          lastActiveTs,
          topActivityLabel: topBucketKey ? ACTIVITY_LABELS[topBucketKey] : 'None yet',
          topBucketMs,
        };
      })
      .filter((row) => {
        if (!q) return true;
        return (
          row.acc.usernameLower.includes(q) ||
          (row.acc.currentActivity || '').toLowerCase().includes(q) ||
          (row.acc.roleBadge || '').toLowerCase().includes(q)
        );
      });

    list.sort((a, b) => {
      if (sortBy === 'todayTime') return b.todayMs - a.todayMs || b.totalMs - a.totalMs;
      if (sortBy === 'lastActive') return (b.online ? 1 : 0) - (a.online ? 1 : 0) || b.lastActiveTs - a.lastActiveTs;
      if (sortBy === 'sessions') return b.sessions - a.sessions || b.totalMs - a.totalMs;
      if (sortBy === 'favorites') return b.acc.favorites.length - a.acc.favorites.length || b.totalMs - a.totalMs;
      return b.totalMs - a.totalMs || b.todayMs - a.todayMs;
    });
    return list;
  }, [accounts, presenceNow, tableSearch, sortBy]);

  const activeGirlsPolicy = workspaceConfig?.girlsThemePolicy || 'default_if_unset';
  const activeGirlsPolicyLabel = GIRLS_THEME_POLICY_META[activeGirlsPolicy]?.label || 'Default if Unset';
  const activeGamesList = gameMetricTab === 'favorites' ? metrics.topFavoritedGames : metrics.topRecentGames;
  const maxGameCount = activeGamesList.length > 0 ? Math.max(1, activeGamesList[0].count) : 1;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className={`rounded-xl border p-3.5 h-20 animate-pulse ${kpiTileCls}`} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className={`rounded-xl border p-4 h-56 animate-pulse ${surfaceCls}`} />
          <div className={`rounded-xl border p-4 h-56 animate-pulse ${surfaceCls}`} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-[var(--accent-color)]" />
            <span>Usage, Activity &amp; Account Analytics</span>
          </h3>
          <p className={`text-[11px] mt-0.5 ${mutedCls}`}>
            Live tracking across {metrics.total} account{metrics.total === 1 ? '' : 's'} · Girls policy: {activeGirlsPolicyLabel}
          </p>
        </div>
        {onJumpToPolicy && (
          <button
            type="button"
            onClick={onJumpToPolicy}
            className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
              isLight
                ? 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                : 'bg-white/5 border-white/15 text-neutral-200 hover:bg-white/10'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5 text-pink-400" />
            <span>Configure Girls Policy</span>
          </button>
        )}
      </div>

      {/* 6-Card KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className={`rounded-xl border p-3 ${kpiTileCls}`}>
          <div className={`text-[10px] font-mono uppercase tracking-wider flex items-center justify-between ${mutedCls}`}>
            <span>Accounts</span>
            <Users className="w-3.5 h-3.5 opacity-70" />
          </div>
          <div className="text-xl font-black font-mono tabular-nums mt-1">{metrics.total}</div>
          <div className={`text-[10.5px] font-mono tabular-nums mt-0.5 ${mutedCls}`}>
            {metrics.activeCount} active · {metrics.disabledCount} off
          </div>
        </div>

        <div className={`rounded-xl border p-3 ${kpiTileCls}`}>
          <div className={`text-[10px] font-mono uppercase tracking-wider flex items-center justify-between ${mutedCls}`}>
            <span>Online Now</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black font-mono tabular-nums mt-1 text-emerald-400">
            {metrics.onlineCount}
          </div>
          <div className={`text-[10.5px] font-mono tabular-nums mt-0.5 ${mutedCls}`}>
            {metrics.activeCount > 0 ? Math.round((metrics.onlineCount / metrics.activeCount) * 100) : 0}% of active
          </div>
        </div>

        <div className={`rounded-xl border p-3 ${kpiTileCls}`}>
          <div className={`text-[10px] font-mono uppercase tracking-wider flex items-center justify-between ${mutedCls}`}>
            <span>Total Time</span>
            <Clock className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xl font-black font-mono tabular-nums mt-1">
            {formatDurationMs(metrics.totalAllTimeMs)}
          </div>
          <div className={`text-[10.5px] font-mono tabular-nums mt-0.5 ${mutedCls}`}>
            {formatDurationMs(metrics.totalTodayMs)} today
          </div>
        </div>

        <div className={`rounded-xl border p-3 ${kpiTileCls}`}>
          <div className={`text-[10px] font-mono uppercase tracking-wider flex items-center justify-between ${mutedCls}`}>
            <span>Avg / User</span>
            <Clock className="w-3.5 h-3.5 opacity-70" />
          </div>
          <div className="text-xl font-black font-mono tabular-nums mt-1">
            {formatDurationMs(metrics.avgTimeMs)}
          </div>
          <div className={`text-[10.5px] font-mono tabular-nums mt-0.5 ${mutedCls}`}>
            {metrics.totalSessions} sessions
          </div>
        </div>

        <div className={`rounded-xl border p-3 ${kpiTileCls}`}>
          <div className={`text-[10px] font-mono uppercase tracking-wider flex items-center justify-between ${mutedCls}`}>
            <span>Roles &amp; Mod</span>
            <Shield className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black font-mono tabular-nums mt-1">{metrics.adminCount}</div>
          <div className={`text-[10.5px] font-mono tabular-nums mt-0.5 ${mutedCls}`}>
            {metrics.mutedCount} muted · {metrics.bannedCount} banned
          </div>
        </div>

        <div className={`rounded-xl border p-3 ${kpiTileCls}`}>
          <div className={`text-[10px] font-mono uppercase tracking-wider flex items-center justify-between ${mutedCls}`}>
            <span>Girls Theme</span>
            <Heart className="w-3.5 h-3.5 text-pink-400" />
          </div>
          <div className="text-xl font-black font-mono tabular-nums mt-1 text-pink-400">
            {metrics.girlsAssignedCount}
          </div>
          <div className={`text-[10.5px] font-mono truncate mt-0.5 ${mutedCls}`} title={activeGirlsPolicyLabel}>
            {activeGirlsPolicyLabel}
          </div>
        </div>
      </div>

      {/* Row 2: What Users Do + Theme & Mode Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Activity Breakdown & Live Activity */}
        <div className={`rounded-xl border p-4 space-y-4 ${surfaceCls}`}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider">What Users Do</h4>
              <p className={`text-[11px] ${mutedCls}`}>Cumulative time across workspaces &amp; live current activity</p>
            </div>
            <span className={`text-[11px] font-mono tabular-nums ${mutedCls}`}>
              {formatDurationMs(metrics.activityGrandTotal)} logged
            </span>
          </div>

          <div className="space-y-2.5">
            {metrics.activityRows.map((row) => (
              <div key={row.key} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: row.color }} />
                    <span>{row.label}</span>
                  </span>
                  <span className={`font-mono tabular-nums ${mutedCls}`}>
                    {formatDurationMs(row.ms)} · {row.pct}%
                  </span>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${trackCls}`}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${row.ms > 0 ? Math.max(3, row.pct) : 0}%`, backgroundColor: row.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className={`pt-3 border-t space-y-2 ${dividerCls}`}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold uppercase tracking-wider">Active Right Now</span>
              <span className={`font-mono tabular-nums ${mutedCls}`}>{metrics.onlineCount} online</span>
            </div>
            {metrics.onlineUsers.length === 0 ? (
              <p className={`text-[11px] py-2 ${mutedCls}`}>No user accounts are currently active.</p>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {metrics.onlineUsers.map((u) => (
                  <div
                    key={u.usernameLower}
                    className={`flex items-center justify-between gap-2 text-[11px] py-1 border-b last:border-b-0 ${dividerCls}`}
                  >
                    <div className="min-w-0 flex items-center gap-2">
                      <span className="font-mono font-bold truncate">@{u.username}</span>
                      <span className={`truncate ${mutedCls}`}>· {u.currentActivity || 'Online'}</span>
                    </div>
                    <span className="font-mono tabular-nums text-[10.5px] shrink-0">
                      {formatDurationMs(u.todayMs)} today
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Theme & Light/Dark Mode Breakdown */}
        <div className={`rounded-xl border p-4 space-y-4 ${surfaceCls}`}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                <span>Themes &amp; Appearance Mode</span>
              </h4>
              <p className={`text-[11px] ${mutedCls}`}>Saved theme choices and Light / Dark preference</p>
            </div>
            <span className={`text-[11px] font-mono tabular-nums ${mutedCls}`}>
              {metrics.girlsAssignedCount} Girls-assigned
            </span>
          </div>

          {metrics.themeRows.length === 0 ? (
            <p className={`text-[11px] py-4 ${mutedCls}`}>No accounts available yet.</p>
          ) : (
            <div className="space-y-2">
              {metrics.themeRows.map((row) => (
                <div key={row.key} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: row.swatch }} />
                      <span>{row.label}</span>
                    </span>
                    <span className={`font-mono tabular-nums ${mutedCls}`}>
                      {row.count} user{row.count === 1 ? '' : 's'} · {row.pct}%
                    </span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${trackCls}`}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${row.count > 0 ? Math.max(3, row.pct) : 0}%`, backgroundColor: row.swatch }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={`pt-3 border-t space-y-2 ${dividerCls}`}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold uppercase tracking-wider">Display Mode Split</span>
              <span className={`font-mono tabular-nums ${mutedCls}`}>
                Dark {metrics.modeCounts.dark} · Light {metrics.modeCounts.light} · Unset {metrics.modeCounts.unset}
              </span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden flex ${trackCls}`}>
              {metrics.total > 0 && (
                <>
                  <div
                    className="h-full bg-indigo-500"
                    style={{ width: `${(metrics.modeCounts.dark / metrics.total) * 100}%` }}
                    title={`Dark: ${metrics.modeCounts.dark}`}
                  />
                  <div
                    className="h-full bg-amber-400"
                    style={{ width: `${(metrics.modeCounts.light / metrics.total) * 100}%` }}
                    title={`Light: ${metrics.modeCounts.light}`}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Popular Games & Workspace Access / Login Recency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Most Favorited & Recently Played Games */}
        <div className={`rounded-xl border p-4 space-y-3 ${surfaceCls}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                <span>Popular Games</span>
              </h4>
              <p className={`text-[11px] ${mutedCls}`}>Aggregated across all accounts</p>
            </div>
            <div
              className={`flex items-center p-0.5 rounded-lg border ${
                isLight ? 'bg-neutral-100 border-neutral-200' : 'bg-black/40 border-white/10'
              }`}
            >
              <button
                type="button"
                onClick={() => setGameMetricTab('favorites')}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-mono font-bold cursor-pointer transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                  gameMetricTab === 'favorites'
                    ? 'bg-[var(--accent-color)] text-[var(--bg-color)]'
                    : mutedCls
                }`}
              >
                <Star className="w-3 h-3" />
                <span>Favorited</span>
              </button>
              <button
                type="button"
                onClick={() => setGameMetricTab('recent')}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-mono font-bold cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                  gameMetricTab === 'recent'
                    ? 'bg-[var(--accent-color)] text-[var(--bg-color)]'
                    : mutedCls
                }`}
              >
                Recently Played
              </button>
            </div>
          </div>

          {activeGamesList.length === 0 ? (
            <div className={`py-8 text-center text-xs ${mutedCls}`}>
              {gameMetricTab === 'favorites'
                ? 'No users have bookmarked any games yet.'
                : 'No recent game launches recorded across accounts yet.'}
            </div>
          ) : (
            <div className="space-y-2">
              {activeGamesList.map((g, idx) => {
                const pct = Math.round((g.count / maxGameCount) * 100);
                return (
                  <div key={g.id} className="space-y-1">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <div className="min-w-0 flex items-center gap-2">
                        <span className={`font-mono tabular-nums text-[10px] w-4 shrink-0 ${mutedCls}`}>
                          {idx + 1}.
                        </span>
                        <span className="font-semibold truncate">{g.title}</span>
                        <span className={`text-[10px] truncate hidden sm:inline ${mutedCls}`}>· {g.category}</span>
                      </div>
                      <span className={`font-mono tabular-nums shrink-0 ${mutedCls}`}>
                        {g.count} user{g.count === 1 ? '' : 's'}
                      </span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${trackCls}`}>
                      <div
                        className="h-full rounded-full bg-[var(--accent-color)]"
                        style={{ width: `${Math.max(5, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Workspace Access Coverage & Login Recency */}
        <div className={`rounded-xl border p-4 space-y-4 ${surfaceCls}`}>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider">Workspace Access Coverage</h4>
            <p className={`text-[11px] ${mutedCls}`}>Accounts permitted per workspace feature</p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {WORKSPACE_ACCESS_KEYS.map(({ key, label }) => {
              const count = metrics.workspaceCounts[key] || 0;
              const pct = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium truncate">{label}</span>
                    <span className={`font-mono tabular-nums ${mutedCls}`}>
                      {count}/{metrics.total}
                    </span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${trackCls}`}>
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{ width: `${count > 0 ? Math.max(4, pct) : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`pt-3 border-t space-y-2 ${dividerCls}`}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold uppercase tracking-wider">Login &amp; Activity Recency</span>
              <span className={`font-mono tabular-nums ${mutedCls}`}>{metrics.total} total</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className={`rounded-lg border p-2 ${kpiTileCls}`}>
                <div className={mutedCls}>Online Now</div>
                <div className="font-mono font-black tabular-nums text-sm mt-0.5 text-emerald-400">
                  {metrics.recency.online}
                </div>
              </div>
              <div className={`rounded-lg border p-2 ${kpiTileCls}`}>
                <div className={mutedCls}>Last 24h</div>
                <div className="font-mono font-black tabular-nums text-sm mt-0.5">{metrics.recency.day}</div>
              </div>
              <div className={`rounded-lg border p-2 ${kpiTileCls}`}>
                <div className={mutedCls}>Last 7d</div>
                <div className="font-mono font-black tabular-nums text-sm mt-0.5">{metrics.recency.week}</div>
              </div>
              <div className={`rounded-lg border p-2 ${kpiTileCls}`}>
                <div className={mutedCls}>Older / Never</div>
                <div className="font-mono font-black tabular-nums text-sm mt-0.5">
                  {metrics.recency.olderOrNever}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Per-User Usage & Activity Breakdown Table */}
      <div className={`rounded-xl border p-4 space-y-3 ${surfaceCls}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider">Per-User Activity &amp; Time Breakdown</h4>
            <p className={`text-[11px] ${mutedCls}`}>
              Duration, live activity, favorite workspace, and Girls-theme default per account
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-48 sm:w-56">
              <Search className={`w-3.5 h-3.5 absolute left-2.5 top-2 ${mutedCls}`} />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Filter user or activity..."
                className={`w-full pl-8 pr-2.5 py-1 rounded-lg border text-xs outline-none ${
                  isLight
                    ? 'bg-white border-neutral-300 text-neutral-900 focus:border-neutral-900'
                    : 'bg-black/40 border-white/15 text-white focus:border-[var(--accent-color)]'
                }`}
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-mono outline-none cursor-pointer ${
                isLight
                  ? 'bg-white border-neutral-300 text-neutral-900'
                  : 'bg-black/40 border-white/15 text-white'
              }`}
              aria-label="Sort user stats"
            >
              <option value="totalTime">Sort: Total Time</option>
              <option value="todayTime">Sort: Today Time</option>
              <option value="lastActive">Sort: Last Active</option>
              <option value="sessions">Sort: Sessions</option>
              <option value="favorites">Sort: Bookmarks</option>
            </select>
          </div>
        </div>

        {accounts.length === 0 ? (
          <div className={`py-8 text-center text-xs ${mutedCls}`}>
            No managed accounts exist yet. Create an account in the Accounts tab to begin tracking usage.
          </div>
        ) : userRows.length === 0 ? (
          <div className={`py-8 text-center text-xs space-y-2 ${mutedCls}`}>
            <div>No users match &quot;{tableSearch}&quot;.</div>
            <button
              type="button"
              onClick={() => setTableSearch('')}
              className="px-3 py-1 rounded-lg border border-current text-[11px] font-mono cursor-pointer"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`border-b text-[10px] font-mono uppercase ${dividerCls} ${mutedCls}`}>
                  <th className="py-2 pr-3 font-semibold">User</th>
                  <th className="py-2 px-3 font-semibold">Current / Last Activity</th>
                  <th className="py-2 px-3 font-semibold text-right">Today</th>
                  <th className="py-2 px-3 font-semibold text-right">Total Time</th>
                  <th className="py-2 px-3 font-semibold text-right">Sessions</th>
                  <th className="py-2 px-3 font-semibold">Top Activity</th>
                  <th className="py-2 px-3 font-semibold">Theme · Mode</th>
                  <th className="py-2 pl-3 font-semibold text-right">Girls Default</th>
                </tr>
              </thead>
              <tbody>
                {userRows.map(({ acc, online, todayMs, totalMs, sessions, topActivityLabel }) => {
                  const themeName = PORTAL_THEME_META[acc.preferredTheme || 'unset']?.label || acc.preferredTheme || 'Unset';
                  const modeName = acc.preferredMode ? (acc.preferredMode === 'light' ? 'Light' : 'Dark') : 'Auto';
                  const activityText = online
                    ? acc.currentActivity || 'Active now'
                    : acc.lastSeenAt
                      ? `Last seen ${formatLastSeen(acc.lastSeenAt, presenceNow)}`
                      : acc.lastLoginAt
                        ? `Signed in ${new Date(acc.lastLoginAt).toLocaleDateString()}`
                        : 'Never signed in';

                  return (
                    <tr
                      key={acc.usernameLower}
                      className={`border-b last:border-b-0 transition-colors ${dividerCls} ${
                        isLight ? 'hover:bg-neutral-100/70' : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <td className="py-2 pr-3 whitespace-nowrap">
                        <div className="font-mono font-bold">@{acc.username}</div>
                        <div className={`text-[10px] ${online ? 'text-emerald-400 font-semibold' : mutedCls}`}>
                          {online ? 'Online' : acc.isActive === false ? 'Disabled' : 'Offline'}
                          {acc.isAdmin ? ' · Admin' : ''}
                        </div>
                      </td>
                      <td className="py-2 px-3 max-w-[220px]">
                        <div className={`truncate ${online ? '' : mutedCls}`} title={activityText}>
                          {activityText}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                        {formatDurationMs(todayMs)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold tabular-nums whitespace-nowrap">
                        {formatDurationMs(totalMs)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                        {sessions}
                      </td>
                      <td className={`py-2 px-3 whitespace-nowrap ${mutedCls}`}>{topActivityLabel}</td>
                      <td className={`py-2 px-3 whitespace-nowrap ${mutedCls}`}>
                        {themeName} · {modeName}
                      </td>
                      <td className="py-2 pl-3 text-right whitespace-nowrap">
                        {onToggleGirlsTheme && (
                          <button
                            type="button"
                            disabled={busyKey === `${acc.usernameLower}:defaultGirlsTheme`}
                            onClick={() => onToggleGirlsTheme(acc)}
                            className={`px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                              acc.defaultGirlsTheme
                                ? 'bg-pink-500/20 border-pink-400/50 text-pink-300 hover:bg-pink-500/30'
                                : isLight
                                  ? 'bg-neutral-100 border-neutral-300 text-neutral-600 hover:bg-neutral-200'
                                  : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'
                            }`}
                          >
                            <Heart className="w-2.5 h-2.5" />
                            <span>{acc.defaultGirlsTheme ? 'ON' : 'OFF'}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
