export const CLASSROOM_VIDEO_BASE = 'https://classroom.google.com/u/0/n/pck?v=';

export const CLARITY_THEMES = [
  { id: 'midnight', name: 'Midnight', sw: 'linear-gradient(135deg,#0b0d14,#1c2133)' },
  { id: 'slate',    name: 'Slate',    sw: 'linear-gradient(135deg,#101318,#222834)' },
  { id: 'ocean',    name: 'Ocean',    sw: 'linear-gradient(135deg,#071118,#14405a)' },
  { id: 'emerald',  name: 'Emerald',  sw: 'linear-gradient(135deg,#08120d,#155e3e)' },
  { id: 'sunset',   name: 'Sunset',   sw: 'linear-gradient(135deg,#170d0c,#8a3a24)' },
  { id: 'lavender', name: 'Lavender', sw: 'linear-gradient(135deg,#100d1a,#4d3a85)' },
  { id: 'light',    name: 'Light',    sw: 'linear-gradient(135deg,#ffffff,#dfe4f0)' },
  { id: 'amoled',   name: 'AMOLED',   sw: 'linear-gradient(135deg,#000,#141417)' },
];

export const CLARITY_PALETTE = [
  { name: 'Indigo · Midnight',  h: 226, s: 100, l: 71 },
  { name: 'Sky · Ocean',        h: 199, s: 95,  l: 60 },
  { name: 'Cyan · Midnight',    h: 190, s: 90,  l: 55 },
  { name: 'Teal · Ocean',       h: 170, s: 80,  l: 45 },
  { name: 'Emerald · Emerald',  h: 152, s: 70,  l: 52 },
  { name: 'Lime · Emerald',     h: 90,  s: 70,  l: 50 },
  { name: 'Amber · Sunset',     h: 45,  s: 95,  l: 58 },
  { name: 'Orange · Sunset',    h: 18,  s: 95,  l: 62 },
  { name: 'Rose · Sunset',      h: 340, s: 85,  l: 60 },
  { name: 'Magenta · Lavender', h: 310, s: 80,  l: 62 },
  { name: 'Purple · Midnight',  h: 280, s: 85,  l: 62 },
  { name: 'Violet · Lavender',  h: 265, s: 90,  l: 70 },
  { name: 'Steel · Slate',      h: 215, s: 40,  l: 55 },
  { name: 'Snow · Light',       h: 220, s: 15,  l: 88 },
];

export const CLARITY_YT_ACCENT = { name: 'YouTube Red', h: 0, s: 100, l: 50 };

export const DEFAULT_CLARITY_SETTINGS = {
  theme: 'midnight',
  systemTheme: false,
  accent: { h: 226, s: 100, l: 71 },
  radius: 16,
  density: 1,
  glass: 62,
  motion: 1,
  fx: true,
  autoplay: true,
  saveHistory: true,
  ytMode: false,
  preYT: null,
  history: [],
  favorites: [],
};

export const CLARITY_STORAGE_KEY = 'clarity.v1';

export const INVIDIOUS_INSTANCES = [
  'https://inv.nadeko.net',
  'https://invidious.nerdvpn.de',
  'https://yewtu.be',
  'https://invidious.f5.si',
  'https://iv.melmac.space',
];

export const ClarityParser = {
  parse(input) {
    const raw = (input || '').trim();
    if (!raw) return null;

    if (
      /^[A-Za-z0-9_-]{11}$/.test(raw) &&
      !/^https?:/.test(raw) &&
      !raw.includes('.') &&
      (/[0-9_-]/.test(raw) || (/[a-z]/.test(raw) && /[A-Z]/.test(raw)))
    ) {
      return { kind: 'video', videoId: raw, start: 0 };
    }

    let url;
    try {
      url = new URL(raw.match(/^https?:\/\//i) ? raw : 'https://' + raw);
    } catch {
      return null;
    }

    const host = url.hostname.replace(/^www\.|^m\./, '');
    const v = url.searchParams.get('v');
    const list = url.searchParams.get('list');
    const start = this.parseStart(url.searchParams.get('t') || url.searchParams.get('start'));

    // Also support already-translated Classroom video URLs: https://classroom.google.com/u/0/n/pck?v=<videoId>
    if (host === 'classroom.google.com' && v && /^[A-Za-z0-9_-]{11}$/.test(v)) {
      return { kind: 'video', videoId: v, listId: list || null, start };
    }

    if (!/(^|\.)((youtube\.com)|(youtube-nocookie\.com)|(youtu\.be))$/.test(host)) {
      return null;
    }

    const path = url.pathname;

    if (host === 'youtu.be') {
      const id = path.slice(1).split('/')[0];
      if (/^[A-Za-z0-9_-]{11}$/.test(id)) {
        return { kind: 'video', videoId: id, listId: list || null, start };
      }
      return null;
    }

    if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) {
      return { kind: 'video', videoId: v, listId: list || null, start };
    }

    const m = path.match(/^\/(shorts|embed|live|v)\/([A-Za-z0-9_-]{11})/);
    if (m) {
      return { kind: 'video', videoId: m[2], listId: list || null, start };
    }

    if (path.startsWith('/playlist') && list) {
      return { kind: 'playlist', listId: list, start: 0 };
    }

    if (list) {
      return { kind: 'playlist', listId: list, start: 0 };
    }

    return null;
  },

  looksLikeUrl(s) {
    return /^(https?:\/\/|www\.)/i.test(s) || /^[a-z0-9.-]+\.[a-z]{2,}\//i.test(s);
  },

  parseStart(t) {
    if (!t) return 0;
    if (/^\d+$/.test(t)) return parseInt(t, 10);
    const m = t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/);
    if (!m) return 0;
    return (
      parseInt(m[1] || '0', 10) * 3600 +
      parseInt(m[2] || '0', 10) * 60 +
      parseInt(m[3] || '0', 10)
    );
  },

  toClassroomUrl(itemOrId) {
    if (!itemOrId) return '';
    if (typeof itemOrId === 'string') {
      const parsed = this.parse(itemOrId);
      const id = parsed?.videoId || (/^[A-Za-z0-9_-]{11}$/.test(itemOrId.trim()) ? itemOrId.trim() : '');
      return id ? `${CLASSROOM_VIDEO_BASE}${id}` : '';
    }
    if (itemOrId.videoId) {
      return `${CLASSROOM_VIDEO_BASE}${itemOrId.videoId}`;
    }
    if (itemOrId.kind === 'playlist' && itemOrId.listId) {
      return `https://www.youtube.com/playlist?list=${itemOrId.listId}`;
    }
    return '';
  },

  shareUrl(item) {
    return this.toClassroomUrl(item);
  },
};

export function openClarityVideoInAboutBlank(item, decoyMeta = {}) {
  const targetUrl = ClarityParser.toClassroomUrl(item);
  if (!targetUrl) return { opened: false, url: '' };

  let win = null;
  try {
    win = window.open('about:blank', '_blank');
  } catch {
    win = null;
  }

  if (!win) {
    return { opened: false, url: targetUrl };
  }

  const safeTitle = String(decoyMeta.title || 'Google Classroom').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeFavicon = String(decoyMeta.favicon || 'https://ssl.gstatic.com/classroom/favicon.png').replace(/"/g, '&quot;');
  const safeSrc = targetUrl.replace(/"/g, '&quot;');
  const safeJsUrl = JSON.stringify(targetUrl).replace(/</g, '\\u003c');

  try {
    win.document.open();
    win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="referrer" content="no-referrer">
  <meta http-equiv="refresh" content="0;url=${safeSrc}">
  <title>${safeTitle}</title>
  <link rel="icon" href="${safeFavicon}">
  <link rel="shortcut icon" href="${safeFavicon}">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%; height: 100%;
      background: #0b0d14; color: #e5e7eb;
      font-family: system-ui, -apple-system, sans-serif;
      display: flex; align-items: center; justify-content: center;
    }
    a {
      color: #93c5fd; text-decoration: none; font-size: 14px;
      padding: 10px 16px; border: 1px solid rgba(147, 197, 253, 0.35);
      border-radius: 8px;
    }
    a:hover { background: rgba(147, 197, 253, 0.1); }
  </style>
</head>
<body>
  <a href="${safeSrc}" rel="noopener noreferrer">Opening Google Classroom…</a>
  <script>
    try { window.opener = null; } catch (e) {}
    window.location.replace(${safeJsUrl});
  </script>
</body>
</html>`);
    win.document.close();
    try {
      win.opener = null;
    } catch {
      // Ignore cross-origin opener errors
    }
  } catch {
    try {
      win.opener = null;
      win.location.replace(targetUrl);
    } catch {
      return { opened: false, url: targetUrl };
    }
  }

  return { opened: true, url: targetUrl };
}

export function timeAgo(ts) {
  if (!ts) return '';
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}

export function fmtViews(n) {
  if (!n && n !== 0) return '';
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B views';
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M views';
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K views';
  return n + ' views';
}

export function fmtDuration(sec) {
  if (!sec) return '';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
}

function decodeHtml(html) {
  if (!html) return '';
  if (typeof document === 'undefined') return String(html);
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

export function norm(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokens(s) {
  const STOP = new Set([
    'the', 'a', 'an', 'of', 'to', 'in', 'on', 'and', 'or', 'for', 'with', 'how', 'is', 'at', 'by', 'it',
  ]);
  return norm(s)
    .split(' ')
    .filter((t) => t && !STOP.has(t));
}

export function calculateRelevance(q, item) {
  const qn = norm(q);
  const qt = tokens(q);
  if (!qn) return 0;

  const title = norm(item.title);
  const chan = norm(item.author);
  const desc = norm(item.description || '').slice(0, 500);
  let score = 0;

  if (title === qn) score += 40;
  else if (title.includes(qn)) score += 18;

  if (chan === qn) score += 32;
  else if (chan && (chan.includes(qn) || qn.includes(chan))) score += 15;

  const tt = title.split(' ');
  const ct = chan.split(' ');
  const dt = new Set(desc.split(' '));

  for (const t of qt) {
    if (tt.includes(t)) score += 6;
    else if (tt.some((w) => w.startsWith(t) && t.length > 2)) score += 3;

    if (ct.includes(t)) score += 8;
    else if (ct.some((w) => w.startsWith(t) && t.length > 2)) score += 4;

    if (dt.has(t)) score += 1.5;
  }

  if (qt.length > 1) {
    for (let i = 0; i < qt.length - 1; i++) {
      const a = tt.indexOf(qt[i]);
      const b = tt.indexOf(qt[i + 1]);
      if (a !== -1 && b === a + 1) score += 2.5;
    }
  }

  if (item.viewCount) {
    score += Math.min(Math.log10(item.viewCount + 1) * 0.5, 4);
  }

  return score;
}

export async function fetchServerSearch(q) {
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item) => ({
          ...item,
          publishedText: item.publishedAt
            ? /^\d{4}-/.test(item.publishedAt)
              ? timeAgo(new Date(item.publishedAt).getTime())
              : item.publishedAt
            : '',
        }));
      }
    }
  } catch {
    // Fallback below
  }
  return null;
}

export async function fetchInvidiousSearch(q) {
  const tryInstance = (base) =>
    new Promise((resolve, reject) => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => {
        ctrl.abort();
        reject(new Error('timeout'));
      }, 7000);

      fetch(`${base}/api/v1/search?q=${encodeURIComponent(q)}&type=video`, {
        signal: ctrl.signal,
      })
        .then((r) => {
          if (!r.ok) throw new Error('http ' + r.status);
          return r.json();
        })
        .then((list) => {
          clearTimeout(timer);
          if (!Array.isArray(list) || !list.length) return reject(new Error('empty'));
          const mapped = list
            .filter((x) => x.type === 'video' && x.videoId)
            .map((x) => ({
              kind: 'video',
              videoId: x.videoId,
              title: decodeHtml(x.title),
              author: decodeHtml(x.author),
              description: decodeHtml(x.description || ''),
              viewCount: x.viewCount || 0,
              lengthSeconds: x.lengthSeconds || 0,
              publishedText: x.publishedText || '',
              thumb: `https://i.ytimg.com/vi/${x.videoId}/hqdefault.jpg`,
            }));
          resolve(mapped);
        })
        .catch((e) => {
          clearTimeout(timer);
          reject(e);
        });
    });

  try {
    return await Promise.any(INVIDIOUS_INSTANCES.map(tryInstance));
  } catch {
    return null;
  }
}

export async function fetchRemoteSearch(q) {
  const serverResults = await fetchServerSearch(q);
  if (serverResults !== null && serverResults.length > 0) {
    return serverResults;
  }
  return await fetchInvidiousSearch(q);
}

export function searchLibrary(q, libraryItems) {
  const seen = new Set();
  const all = [];
  for (const it of libraryItems) {
    const key = it.videoId || ('pl:' + it.listId);
    if (seen.has(key)) continue;
    seen.add(key);
    all.push(it);
  }
  return all
    .map((it) => ({ it, s: calculateRelevance(q, it) }))
    .filter((x) => x.s >= 5)
    .sort((a, b) => b.s - a.s)
    .slice(0, 8)
    .map((x) => ({ ...x.it }));
}
