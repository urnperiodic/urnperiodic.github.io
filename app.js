// app.js — converted from src/App.jsx (React) to vanilla JavaScript

// ── Safe localStorage helper ──
const storage = {
  get: (key) => { try { return localStorage.getItem(key); } catch { return null; } },
  set: (key, val) => { try { localStorage.setItem(key, val); } catch {} },
};

// ── State ──
let currentFilter = 'all';
let currentSearch = '';
let selectedGame = null;

// ── DOM refs ──
const grid       = document.getElementById('gamesGrid');
const emptyState = document.getElementById('emptyState');
const modal      = document.getElementById('modal');
const searchBox  = document.getElementById('searchBox');

// ── Init ──
function init() {
  loadTheme();
  bindEvents();
  renderGames();
}

// ── Theme ──
function loadTheme() {
  const theme = storage.get('unblocked-theme') || 'violet';
  const mode  = storage.get('unblocked-mode')  || 'dark';
  applyTheme(theme, mode);
}

function applyTheme(theme, mode) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-mode', mode);
  document.getElementById('themeToggle').textContent = mode === 'dark' ? '🌙 Dark' : '☀️ Light';

  document.querySelectorAll('.theme-option').forEach(el => {
    el.classList.toggle('active', el.dataset.theme === theme);
  });
}

// ── Events ──
function bindEvents() {
  // Search
  searchBox.addEventListener('input', () => {
    currentSearch = searchBox.value.toLowerCase();
    renderGames();
  });

  // Category filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderGames();
    });
  });

  // Theme swatches
  document.querySelectorAll('.theme-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const theme = opt.dataset.theme;
      const mode  = document.documentElement.getAttribute('data-mode') || 'dark';
      storage.set('unblocked-theme', theme);
      applyTheme(theme, mode);
    });
  });

  // Dark/light toggle
  document.getElementById('themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-mode');
    const newMode = current === 'dark' ? 'light' : 'dark';
    const theme   = document.documentElement.getAttribute('data-theme') || 'violet';
    storage.set('unblocked-mode', newMode);
    applyTheme(theme, newMode);
  });

  // Modal close via backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Modal close button
  document.getElementById('modalClose').addEventListener('click', closeModal);

  // Play button
  document.getElementById('playBtn').addEventListener('click', () => {
    if (selectedGame?.url) window.open(selectedGame.url, '_blank');
  });
}

// ── Render ──
function renderGames() {
  const filtered = games.filter(g => {
    const matchCat    = currentFilter === 'all' || g.category.toLowerCase() === currentFilter.toLowerCase();
    const matchSearch = !currentSearch ||
      g.title.toLowerCase().includes(currentSearch) ||
      g.description.toLowerCase().includes(currentSearch);
    return matchCat && matchSearch;
  });

  emptyState.style.display = filtered.length ? 'none' : 'block';
  grid.innerHTML = filtered.map(g => `
    <div class="game-card" data-id="${g.id}">
      <img
        class="game-thumbnail"
        src="${g.thumbnail || ''}"
        alt="${g.title}"
        onerror="this.src=''"
        loading="lazy"
      >
      <div class="game-info">
        <div class="game-title">${g.title}</div>
        <div class="game-description">${g.description || ''}</div>
        <span class="game-category">${g.category}</span>
      </div>
    </div>
  `).join('');

  // Attach click handlers after render
  grid.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id));
  });
}

// ── Modal ──
function openModal(id) {
  selectedGame = games.find(g => g.id === id);
  if (!selectedGame) return;

  document.getElementById('modalImage').src = selectedGame.thumbnail || '';
  document.getElementById('modalTitle').textContent = selectedGame.title;
  document.getElementById('modalDesc').textContent  = selectedGame.description || '';
  modal.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
  selectedGame = null;
}

// ── Go ──
init();
