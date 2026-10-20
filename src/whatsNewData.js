// ============================================================================
// WHAT'S NEW NOTIFICATION (EASY TO EDIT)
// ----------------------------------------------------------------------------
// Edit this single sentence below to announce new updates or messages!
// It will appear in the GoGuardian-style notification drop every time
// anyone opens the website or the games portal.
// ============================================================================

export const WHATS_NEW_SENTENCE = "Movies and TV shows actually work now! Stream your favorite movies and shows directly.";

// Version identifier (used if you want to track modal dismissals)
export const WHATS_NEW_VERSION = '2026-10-20';

// Detailed changelog items (viewable in the full "View all changes" modal)
export const WHATS_NEW_CHANGES = [
  {
    id: 'movies-tv-shows',
    icon: '🎬',
    iconBg: 'bg-amber-500/20 text-amber-400',
    title: 'Movies & TV Shows Actually Work Now',
    description: 'Movies and TV shows actually work now! Click below to stream movies and TV shows directly.',
    actionLabel: 'Go Watch Movies / TV Shows',
    actionFilter: 'moremovies'
  },
  {
    id: 'air-hockey',
    icon: '🏒',
    iconBg: 'bg-cyan-500/20 text-cyan-400',
    title: 'Air Hockey Added',
    description: 'Play Air Hockey multiplayer with a friend or take on the bot.',
    actionLabel: 'Play Now',
    actionGameTitle: 'Air Hockey'
  },
  {
    id: 'theme-dropdown',
    icon: '🎨',
    iconBg: 'bg-indigo-500/20 text-indigo-400',
    title: 'Theme Dropdown Selector',
    description: 'Switched color dot bars into a compact, modern theme dropdown menu with full preview swatches.'
  },
  {
    id: 'copy-messages',
    icon: '📋',
    iconBg: 'bg-sky-500/20 text-sky-400',
    title: 'Copy Chat Messages',
    description: 'Easily copy chat messages with the new Copy button or native text selection support.'
  },
  {
    id: 'delete-messages',
    icon: '🗑️',
    iconBg: 'bg-rose-500/20 text-rose-400',
    title: 'Delete All My Messages',
    description: 'Quickly delete all messages you sent across channels with the new delete tools and confirmation dialog.'
  },
  {
    id: 'optimized-chat',
    icon: '💬',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
    title: 'Optimized Slideout Chat',
    description: 'Compact sidebar chat with clean channel switching and no header clutter or clipping.'
  },
  {
    id: 'instant-launch',
    icon: '⚡',
    iconBg: 'bg-amber-500/20 text-amber-400',
    title: 'Instant Game Loading',
    description: 'Games now load smoothly and instantly without reloading the page or flashing home screens.'
  }
];
