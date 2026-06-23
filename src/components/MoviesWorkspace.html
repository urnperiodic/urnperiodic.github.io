<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TTM Streaming — Watch Movies & TV Shows Free</title>
  <meta name="description" content="TTM Streaming — Stream and download thousands of movies and TV shows in HD. Multiple servers, custom themes, and continue-watching.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
  <style>
  /* ============================================================
     BASE / VARIABLES
     ============================================================ */
  :root {
    --accent: #e50914;
    --accent-soft: rgba(229, 9, 20, 0.15);
    --bg: #0a0a0f;
    --bg-elev: #14141c;
    --bg-card: #1a1a24;
    --text: #f5f5f7;
    --text-dim: #9a9aa8;
    --border: rgba(255, 255, 255, 0.08);
    --radius: 12px;
    --shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--bg); color: var(--text); line-height: 1.5; overflow-x: hidden;
  }
  a { color: inherit; text-decoration: none; }
  img { display: block; max-width: 100%; }
  button { font-family: inherit; cursor: pointer; }
  kbd { background:#222; border:1px solid var(--border); border-radius:4px; padding:1px 6px; font-size:0.78em; }
  ::selection { background: var(--accent); color: #fff; }
  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #2a2a36; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #3a3a48; }

  /* ---------- Header ---------- */
  .site-header {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; gap: 24px; padding: 16px 4vw;
    transition: background 0.3s, backdrop-filter 0.3s;
  }
  .site-header.scrolled { background: rgba(10,10,15,0.92); backdrop-filter: blur(14px); border-bottom: 1px solid var(--border); }
  .logo { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.5px; display: flex; align-items: center; gap: 8px; white-space: nowrap; }
  .logo i { color: var(--accent); }
  .logo .brand-ttm { color: var(--accent); }
  .main-nav { display: flex; gap: 20px; margin-left: 8px; }
  .main-nav a { color: var(--text-dim); font-weight: 500; font-size: 0.95rem; transition: color 0.2s; }
  .main-nav a:hover, .main-nav a.active { color: var(--text); }
  .header-spacer { flex: 1; }
  .search-box { display: flex; align-items: center; gap: 8px; background: var(--bg-elev); border: 1px solid var(--border); border-radius: 999px; padding: 8px 16px; width: 240px; transition: width 0.3s, border-color 0.2s; }
  .search-box:focus-within { border-color: var(--accent); width: 300px; }
  .search-box i { color: var(--text-dim); }
  .search-box input { background: none; border: none; outline: none; color: var(--text); width: 100%; font-size: 0.9rem; }
  .icon-btn { background: var(--bg-elev); border: 1px solid var(--border); color: var(--text); width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; transition: background 0.2s, border-color 0.2s; }
  .icon-btn:hover { background: var(--accent-soft); border-color: var(--accent); }

  /* ---------- Hero ---------- */
  .hero { position: relative; height: 82vh; min-height: 520px; display: flex; align-items: flex-end; padding: 0 4vw 6vh; overflow: hidden; }
  .hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center top; transition: opacity 0.6s; }
  .hero::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 4%, rgba(10,10,15,0.2) 55%, rgba(10,10,15,0.6) 100%), linear-gradient(to right, rgba(10,10,15,0.85) 0%, transparent 60%); }
  .hero-content { position: relative; z-index: 2; max-width: 640px; }
  .hero-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--accent); color: #fff; font-size: 0.75rem; font-weight: 700; padding: 5px 12px; border-radius: 6px; letter-spacing: 0.5px; margin-bottom: 16px; }
  .hero h1 { font-size: clamp(2rem, 5vw, 3.6rem); font-weight: 800; line-height: 1.05; letter-spacing: -1px; }
  .hero-meta { display: flex; flex-wrap: wrap; gap: 14px; margin: 16px 0; color: var(--text-dim); font-size: 0.95rem; align-items: center; }
  .hero-meta .rating { color: #ffce47; font-weight: 600; }
  .hero-overview { color: #d6d6e0; font-size: 1.02rem; max-width: 560px; margin-bottom: 24px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
  .btn { display: inline-flex; align-items: center; gap: 10px; padding: 12px 26px; border-radius: 8px; font-weight: 600; font-size: 1rem; border: none; transition: transform 0.15s, background 0.2s, opacity 0.2s; }
  .btn:active { transform: scale(0.97); }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { opacity: 0.88; }
  .btn-ghost { background: rgba(255,255,255,0.14); color: #fff; backdrop-filter: blur(6px); }
  .btn-ghost:hover { background: rgba(255,255,255,0.24); }
  .btn-outline { background: transparent; color: #fff; border: 1px solid var(--border); }
  .btn-outline:hover { border-color: var(--accent); background: var(--accent-soft); }

  /* ---------- Rows ---------- */
  main { padding-bottom: 60px; }
  .row { margin: 38px 0; }
  .row-head { display: flex; align-items: center; justify-content: space-between; padding: 0 4vw; margin-bottom: 14px; }
  .row-head h2 { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.3px; }
  .row-scroller { display: flex; gap: 14px; overflow-x: auto; padding: 4px 4vw 14px; scroll-snap-type: x mandatory; scrollbar-width: none; }
  .row-scroller::-webkit-scrollbar { display: none; }
  .card { flex: 0 0 auto; width: 168px; scroll-snap-align: start; cursor: pointer; transition: transform 0.2s; }
  .card:hover { transform: translateY(-6px); }
  .card-poster { position: relative; aspect-ratio: 2/3; border-radius: 10px; overflow: hidden; background: var(--bg-card); box-shadow: 0 8px 20px rgba(0,0,0,0.4); }
  .card-poster img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
  .card:hover .card-poster img { transform: scale(1.06); }
  .card-poster .play-overlay { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(0,0,0,0.45); opacity: 0; transition: opacity 0.2s; }
  .card:hover .play-overlay { opacity: 1; }
  .play-overlay i { font-size: 2.4rem; color: #fff; }
  .card-rating { position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.7); color: #ffce47; font-size: 0.72rem; font-weight: 700; padding: 3px 7px; border-radius: 6px; display: flex; align-items: center; gap: 3px; }
  .card-type { position: absolute; top: 8px; right: 8px; background: var(--accent); color: #fff; font-size: 0.62rem; font-weight: 700; padding: 3px 7px; border-radius: 5px; text-transform: uppercase; }
  .card-title { margin-top: 8px; font-size: 0.9rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .card-sub { font-size: 0.78rem; color: var(--text-dim); }
  .card-progress { position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: rgba(255,255,255,0.2); }
  .card-progress > span { display: block; height: 100%; background: var(--accent); }

  /* ---------- Grid ---------- */
  .grid-page { padding: 100px 4vw 60px; min-height: 100vh; }
  .grid-page h1 { font-size: 1.8rem; margin-bottom: 6px; }
  .grid-page .sub { color: var(--text-dim); margin-bottom: 24px; }
  .poster-grid { display: grid; gap: 18px; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
  .poster-grid .card { width: 100%; }
  .filter-bar { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 24px; }
  .chip { background: var(--bg-elev); border: 1px solid var(--border); color: var(--text-dim); padding: 7px 16px; border-radius: 999px; font-size: 0.85rem; font-weight: 500; transition: all 0.2s; cursor: pointer; }
  .chip:hover { color: var(--text); }
  .chip.active { background: var(--accent); border-color: var(--accent); color: #fff; }

  /* ---------- Skeleton ---------- */
  .skeleton { background: linear-gradient(100deg, #1a1a24 30%, #22222e 50%, #1a1a24 70%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ---------- Footer ---------- */
  .site-footer { border-top: 1px solid var(--border); padding: 30px 4vw; color: var(--text-dim); font-size: 0.85rem; text-align: center; }
  .site-footer a { color: var(--accent); }
  .disclaimer { max-width: 720px; margin: 10px auto 0; font-size: 0.78rem; line-height: 1.6; }

  /* ---------- Settings drawer ---------- */
  .drawer-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 200; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
  .drawer-backdrop.open { opacity: 1; pointer-events: auto; }
  .drawer { position: fixed; top: 0; right: 0; bottom: 0; width: 360px; max-width: 92vw; z-index: 201; background: var(--bg-elev); border-left: 1px solid var(--border); padding: 24px; transform: translateX(100%); transition: transform 0.3s; overflow-y: auto; }
  .drawer.open { transform: translateX(0); }
  .drawer h3 { font-size: 1.2rem; margin-bottom: 4px; }
  .drawer .muted { color: var(--text-dim); font-size: 0.85rem; margin-bottom: 20px; }
  .drawer-close { position: absolute; top: 18px; right: 18px; background: none; border: none; color: var(--text-dim); font-size: 1.2rem; }
  .drawer-close:hover { color: var(--text); }
  .field { margin-bottom: 22px; }
  .field > label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 8px; }
  .field input[type=text], .field input[type=password] { width: 100%; background: var(--bg-card); border: 1px solid var(--border); color: var(--text); padding: 10px 12px; border-radius: 8px; outline: none; font-size: 0.9rem; }
  .field input:focus { border-color: var(--accent); }
  .color-swatches { display: flex; flex-wrap: wrap; gap: 10px; }
  .swatch { width: 34px; height: 34px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: transform 0.15s; }
  .swatch:hover { transform: scale(1.12); }
  .swatch.active { border-color: #fff; }
  .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .toggle-row span { font-size: 0.92rem; }
  .switch { position: relative; width: 46px; height: 26px; flex: 0 0 auto; }
  .switch input { opacity: 0; width: 0; height: 0; }
  .slider { position: absolute; inset: 0; background: #333; border-radius: 999px; transition: 0.2s; }
  .slider::before { content: ''; position: absolute; height: 20px; width: 20px; left: 3px; top: 3px; background: #fff; border-radius: 50%; transition: 0.2s; }
  .switch input:checked + .slider { background: var(--accent); }
  .switch input:checked + .slider::before { transform: translateX(20px); }
  .season-select { background: var(--bg-elev); border: 1px solid var(--border); color: var(--text); padding: 8px 14px; border-radius: 8px; font-size: 0.9rem; outline: none; }

  /* server picker inside settings */
  .server-picker { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .server-opt { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text); padding: 10px 12px; border-radius: 10px; position: relative; text-align: left; }
  .server-opt:hover { border-color: var(--accent); }
  .server-opt.active { background: var(--accent-soft); border-color: var(--accent); }
  .server-opt .sname { font-weight: 700; font-size: 0.92rem; }
  .server-opt .sbadge { font-size: 0.7rem; color: var(--text-dim); }
  .server-opt.active .sbadge { color: var(--accent); }
  .server-opt .server-num { position: absolute; top: -7px; right: -7px; background: var(--accent); color:#fff; width: 20px; height: 20px; border-radius: 50%; font-size: 0.66rem; display: grid; place-items: center; font-weight: 700; }

  /* ---------- Toast ---------- */
  .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(120%); background: var(--bg-card); border: 1px solid var(--border); box-shadow: var(--shadow); padding: 12px 20px; border-radius: 10px; z-index: 9999; font-size: 0.9rem; transition: transform 0.35s; }
  .toast.show { transform: translateX(-50%) translateY(0); }
  .empty-state { text-align: center; color: var(--text-dim); padding: 80px 20px; }
  .empty-state i { font-size: 3rem; margin-bottom: 14px; opacity: 0.4; }

  /* ============================================================
     DETAILS PAGE
     ============================================================ */
  .details-page { min-height: 100vh; }
  .details-hero { position: relative; padding: 120px 4vw 40px; overflow: hidden; }
  .details-hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center 20%; }
  .details-hero::after { content:''; position:absolute; inset:0; background: linear-gradient(to top, var(--bg) 2%, rgba(10,10,15,0.65) 60%, rgba(10,10,15,0.8) 100%); }
  .details-inner { position: relative; z-index: 2; display: flex; gap: 32px; flex-wrap: wrap; max-width: 1200px; margin: 0 auto; }
  .details-poster { flex: 0 0 240px; border-radius: 14px; overflow: hidden; box-shadow: var(--shadow); background: var(--bg-card); }
  .details-poster img { width: 100%; }
  .details-meta { flex: 1; min-width: 300px; }
  .details-meta h1 { font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 800; letter-spacing: -1px; line-height: 1.05; }
  .details-meta .tagline { color: var(--text-dim); font-style: italic; margin: 8px 0 16px; }
  .fact-row { display: flex; flex-wrap: wrap; gap: 14px; color: var(--text-dim); font-size: 0.95rem; margin-bottom: 16px; align-items: center; }
  .fact-row .rating { color: #ffce47; font-weight: 700; }
  .genre-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
  .genre-tags span { background: rgba(255,255,255,0.08); border: 1px solid var(--border); padding: 4px 12px; border-radius: 999px; font-size: 0.8rem; }
  .details-overview { color: #d6d6e0; line-height: 1.7; max-width: 760px; margin-bottom: 24px; }
  .details-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
  .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; max-width: 760px; margin-bottom: 8px; }
  .info-cell { background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 10px; padding: 10px 14px; }
  .info-cell .k { font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.5px; }
  .info-cell .v { font-size: 0.92rem; font-weight: 600; margin-top: 3px; }
  .details-body { max-width: 1200px; margin: 0 auto; padding: 10px 4vw 60px; }
  .section-title { font-size: 1.3rem; font-weight: 700; margin: 34px 0 16px; display: flex; align-items: center; gap: 10px; }
  .section-title .accent-bar { width: 4px; height: 22px; background: var(--accent); border-radius: 4px; }

  /* download box on details page */
  .download-box { background: var(--bg-elev); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; max-width: 760px; }
  .download-box p { color: var(--text-dim); font-size: 0.86rem; margin-bottom: 14px; }
  .dl-links { display: flex; flex-wrap: wrap; gap: 10px; }
  .dl-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text); padding: 9px 16px; border-radius: 8px; font-weight: 600; font-size: 0.88rem; transition: all 0.2s; }
  .dl-btn:hover { border-color: var(--accent); background: var(--accent-soft); }
  .dl-btn i { color: var(--accent); }

  /* cast */
  .cast-row { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 10px; scrollbar-width: none; }
  .cast-row::-webkit-scrollbar { display: none; }
  .cast-card { flex: 0 0 auto; width: 100px; text-align: center; }
  .cast-card img, .cast-card .noimg { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; background: var(--bg-card); display: grid; place-items: center; color: #555; }
  .cast-card .name { font-size: 0.82rem; font-weight: 600; margin-top: 8px; }
  .cast-card .role { font-size: 0.74rem; color: var(--text-dim); }

  /* episodes list (details page) */
  .ep-head { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; flex-wrap: wrap; }
  .ep-list { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
  .ep-card { display: flex; gap: 12px; background: var(--bg-elev); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; transition: all 0.2s; }
  .ep-card:hover { border-color: var(--accent); transform: translateY(-2px); }
  .ep-thumb { flex: 0 0 120px; aspect-ratio: 16/9; background: var(--bg-card); position: relative; cursor: pointer; }
  .ep-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .ep-thumb .ep-num { position: absolute; bottom: 4px; left: 4px; background: rgba(0,0,0,0.75); padding: 2px 7px; border-radius: 5px; font-size: 0.72rem; font-weight: 700; }
  .ep-thumb .ep-play-ov { position:absolute; inset:0; display:grid; place-items:center; background:rgba(0,0,0,0.4); opacity:0; transition:opacity 0.2s; }
  .ep-thumb:hover .ep-play-ov { opacity:1; }
  .ep-thumb .ep-play-ov i { font-size:1.6rem; color:#fff; }
  .ep-body { padding: 10px 12px 10px 0; flex: 1; min-width: 0; display:flex; flex-direction:column; }
  .ep-body .ep-title { font-weight: 600; font-size: 0.92rem; margin-bottom: 4px; }
  .ep-body .ep-ov { color: var(--text-dim); font-size: 0.8rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex:1; }
  .ep-act { display:flex; gap:8px; margin-top:8px; }
  .ep-act button { display:inline-flex; align-items:center; gap:6px; font-size:0.76rem; font-weight:600; padding:5px 10px; border-radius:6px; border:1px solid var(--border); background:var(--bg-card); color:var(--text); }
  .ep-act .ep-play-btn:hover { border-color:var(--accent); background:var(--accent-soft); }
  .ep-act .ep-dl-btn:hover { border-color:var(--accent); }
  .ep-act .ep-dl-btn i { color: var(--accent); }

  [hidden] { display: none !important; }

  /* ============================================================
     WATCH PAGE
     ============================================================ */
  .watch-top { position: fixed; top: 0; left: 0; right: 0; z-index: 50; display: flex; align-items: center; gap: 16px; padding: 14px 4vw; background: linear-gradient(to bottom, rgba(0,0,0,0.85), transparent); }
  .back-link { display: inline-flex; align-items: center; gap: 8px; color: var(--text); font-weight: 600; cursor: pointer; background: none; border: none; }
  .back-link:hover { color: var(--accent); }
  .watch-title { font-size: 1rem; font-weight: 600; color: var(--text-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .player-stage { width: 100%; aspect-ratio: 16/9; background: #000; position: relative; }
  .player-stage iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
  .player-loading { position: absolute; inset: 0; display: grid; place-items: center; color: var(--text-dim); z-index: 1; transition: opacity 0.3s; }
  .player-loading.hide { opacity: 0; pointer-events: none; }
  .spinner { width: 46px; height: 46px; border: 4px solid rgba(255,255,255,0.15); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.9s linear infinite; }

  /* Player controls — moved to BOTTOM-RIGHT so the top-right settings button never overlaps them */
  .player-controls {
    position: absolute; bottom: 14px; right: 14px; z-index: 6;
    display: flex; gap: 8px; opacity: 0; transition: opacity 0.25s;
  }
  .player-stage:hover .player-controls,
  .player-stage.theater .player-controls,
  .player-stage:focus-within .player-controls { opacity: 1; }
  .pc-btn {
    background: rgba(0,0,0,0.72); border: 1px solid rgba(255,255,255,0.2); color: #fff;
    height: 40px; padding: 0 14px; border-radius: 8px; display: inline-flex; align-items: center;
    gap: 7px; font-size: 0.82rem; font-weight: 600; backdrop-filter: blur(4px); transition: background 0.2s, border-color 0.2s;
  }
  .pc-btn:hover { background: rgba(0,0,0,0.9); border-color: var(--accent); }
  .pc-btn i { font-size: 0.95rem; }
  .pc-btn .pc-label { white-space: nowrap; }
  @media (max-width: 560px) { .pc-btn .pc-label { display: none; } .pc-btn { padding: 0; width: 40px; justify-content: center; } }

  /* Theater / Window mode */
  .player-stage.theater { position: fixed; inset: 0; width: 100vw; height: 100vh; aspect-ratio: auto; z-index: 999; background: #000; }
  body.theater-open .watch-top { z-index: 1000; background: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent); }
  body.theater-open { overflow: hidden; }

  .player-stage:fullscreen { width: 100vw; height: 100vh; aspect-ratio: auto; }
  .player-stage:-webkit-full-screen { width: 100vw; height: 100vh; }
  .player-stage:fullscreen iframe, .player-stage:-webkit-full-screen iframe { width: 100%; height: 100%; }

  .watch-wrap { max-width: 1100px; margin: 0 auto; padding: 0 4vw; }
  .watch-bar { display:flex; align-items:center; gap:16px; flex-wrap:wrap; margin: 18px 0 6px; }
  .watch-bar h2 { font-size:1.4rem; font-weight:800; }
  .watch-bar .ep-tag { color: var(--text-dim); font-weight:600; font-size:0.95rem; }
  .tip { background: var(--bg-elev); border: 1px solid var(--border); border-radius: 10px; padding: 12px 16px; color: var(--text-dim); font-size: 0.85rem; margin: 14px 0; display: flex; gap: 10px; align-items: flex-start; }
  .tip i { color: var(--accent); margin-top: 2px; }
  .watch-actions { display:flex; gap:10px; flex-wrap:wrap; margin: 8px 0 4px; }

  /* episode quick switcher on watch page */
  .ep-switcher { margin: 24px 0; }
  .ep-switcher .ep-head { margin-bottom: 12px; }

  @media (max-width: 768px) {
    .main-nav { display: none; }
    .search-box { width: 150px; }
    .search-box:focus-within { width: 180px; }
    .card { width: 130px; }
    .hero { height: 70vh; }
    .details-poster { flex-basis: 150px; }
  }
  @media (max-width: 480px) { .search-box { width: 120px; } }
  </style>
</head>
<body>

  <!-- ===================== HEADER (home/browse/details) ===================== -->
  <header class="site-header" id="site-header" hidden>
    <a href="#/" class="logo"><i class="fa-solid fa-clapperboard"></i> <span class="brand-ttm">TTM</span>&nbsp;Streaming</a>
    <nav class="main-nav" id="main-nav">
      <a href="#/">Home</a>
      <a href="#/browse?type=movie">Movies</a>
      <a href="#/browse?type=tv">TV Shows</a>
      <a href="#/browse?trending=1">Trending</a>
    </nav>
    <div class="header-spacer"></div>
    <div class="search-box">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="text" id="search-input" placeholder="Search movies, shows…" aria-label="Search">
    </div>
    <button class="icon-btn" id="settings-btn" aria-label="Settings"><i class="fa-solid fa-sliders"></i></button>
  </header>

  <!-- ===================== WATCH HEADER ===================== -->
  <header class="watch-top" id="watch-top" hidden>
    <button class="back-link" id="watch-back"><i class="fa-solid fa-arrow-left"></i> Back</button>
    <span class="watch-title" id="watch-title">Loading…</span>
    <div class="header-spacer"></div>
    <button class="icon-btn" id="settings-btn-watch" aria-label="Settings"><i class="fa-solid fa-sliders"></i></button>
  </header>

  <!-- ===================== VIEW CONTAINER ===================== -->
  <div id="app"></div>

  <footer class="site-footer" id="site-footer">
    <p><span class="brand-ttm" style="color:var(--accent);font-weight:700">TTM</span> Streaming &middot; Metadata by <a href="https://www.themoviedb.org" target="_blank" rel="noopener">TMDB</a></p>
    <p class="disclaimer">
      TTM Streaming does not host any files on its server. All content is provided by non-affiliated third-party
      embed and download providers. TTM Streaming only links to externally hosted players/files and is intended as a
      demonstration interface. Please ensure you have the rights to view or download any content.
    </p>
  </footer>

  <script>
  /* ============================================================
     TMDB API helper
     ============================================================ */
  const TMDB = (() => {
    const DEFAULT_KEY = '8265bd1679663a7ea12ac168da84d2e8';
    const BASE = 'https://api.themoviedb.org/3';
    const IMG = 'https://image.tmdb.org/t/p';
    function key() { return localStorage.getItem('tmdb_key') || DEFAULT_KEY; }
    function setKey(k) { if (k && k.trim()) localStorage.setItem('tmdb_key', k.trim()); else localStorage.removeItem('tmdb_key'); }
    async function api(path, params = {}) {
      const url = new URL(BASE + path);
      url.searchParams.set('api_key', key());
      url.searchParams.set('language', 'en-US');
      Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v); });
      const res = await fetch(url);
      if (!res.ok) throw new Error('TMDB request failed: ' + res.status);
      return res.json();
    }
    const poster = (p, size = 'w500') => p ? `${IMG}/${size}${p}` : null;
    const backdrop = (p, size = 'w1280') => p ? `${IMG}/${size}${p}` : null;
    const profile = (p, size = 'w185') => p ? `${IMG}/${size}${p}` : null;
    const trending = (media = 'all', window = 'week') => api(`/trending/${media}/${window}`);
    const popularMovies = (page = 1) => api('/movie/popular', { page });
    const topRatedMovies = (page = 1) => api('/movie/top_rated', { page });
    const nowPlaying = (page = 1) => api('/movie/now_playing', { page });
    const upcoming = (page = 1) => api('/movie/upcoming', { page });
    const popularTV = (page = 1) => api('/tv/popular', { page });
    const topRatedTV = (page = 1) => api('/tv/top_rated', { page });
    const airingTV = (page = 1) => api('/tv/on_the_air', { page });
    const byGenre = (media, genreId, page = 1) => api(`/discover/${media}`, { with_genres: genreId, sort_by: 'popularity.desc', page });
    const searchMulti = (q, page = 1) => api('/search/multi', { query: q, page });
    const movieDetails = (id) => api(`/movie/${id}`, { append_to_response: 'credits,videos,recommendations,images' });
    const tvDetails = (id) => api(`/tv/${id}`, { append_to_response: 'credits,videos,recommendations,images' });
    const seasonDetails = (id, season) => api(`/tv/${id}/season/${season}`);
    const externalIds = (media, id) => api(`/${media}/${id}/external_ids`);
    const GENRES = {
      movie: { 28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',36:'History',27:'Horror',10402:'Music',9648:'Mystery',10749:'Romance',878:'Sci-Fi',53:'Thriller',10752:'War',37:'Western' },
      tv: { 10759:'Action & Adventure',16:'Animation',35:'Comedy',80:'Crime',99:'Documentary',18:'Drama',10751:'Family',10765:'Sci-Fi & Fantasy',9648:'Mystery',10764:'Reality',10768:'War & Politics' }
    };
    return { key, setKey, DEFAULT_KEY, poster, backdrop, profile, trending, popularMovies, topRatedMovies, nowPlaying, upcoming, popularTV, topRatedTV, airingTV, byGenre, searchMulti, movieDetails, tvDetails, seasonDetails, externalIds, GENRES };
  })();

  /* ============================================================
     Streaming + Download source providers
     ============================================================ */
  const PROVIDERS = [
    { id:'vidsrc', name:'VidSrc', badge:'Subs', build({type,tmdb,season,episode}) {
        return type==='movie' ? `https://vidsrc.to/embed/movie/${tmdb}` : `https://vidsrc.to/embed/tv/${tmdb}/${season}/${episode}`;
    }},
    { id:'vidlink', name:'VidLink', badge:'Multi', build({type,tmdb,season,episode,opt}) {
        let base = type==='movie' ? `https://vidlink.pro/movie/${tmdb}` : `https://vidlink.pro/tv/${tmdb}/${season}/${episode}`;
        const p = new URLSearchParams();
        if (opt && opt.color) p.set('primaryColor', opt.color);
        p.set('autoplay', opt && opt.autoplay === false ? 'false' : 'true');
        if (type==='tv') p.set('nextbutton','true');
        const qs = p.toString(); return qs ? `${base}?${qs}` : base;
    }},
    { id:'vidsrccc', name:'VidSrc.cc', badge:'HD', build({type,tmdb,season,episode,opt}) {
        let base = type==='movie' ? `https://vidsrc.cc/v2/embed/movie/${tmdb}` : `https://vidsrc.cc/v2/embed/tv/${tmdb}/${season}/${episode}`;
        return base + (opt && opt.autoplay === false ? '?autoPlay=false' : '?autoPlay=true');
    }},
    { id:'vidking', name:'VidKing', badge:'Fast', build({type,tmdb,season,episode,opt}) {
        let base = type==='movie' ? `https://www.vidking.net/embed/movie/${tmdb}` : `https://www.vidking.net/embed/tv/${tmdb}/${season}/${episode}`;
        const p = new URLSearchParams();
        if (opt && opt.color) p.set('color', opt.color);
        p.set('autoPlay', opt && opt.autoplay === false ? 'false' : 'true');
        if (type==='tv') { p.set('nextEpisode','true'); p.set('episodeSelector','true'); }
        const qs = p.toString(); return qs ? `${base}?${qs}` : base;
    }}
  ];
  function getProvider(id) { return PROVIDERS.find(p => p.id === id) || PROVIDERS[0]; }

  /* Download providers — these open external "download/source" pages.
     They are third-party indexers that resolve direct links per title/episode. */
  const DOWNLOAD_PROVIDERS = [
    { id:'dl_vidsrc', name:'VidSrc Sources', build({type,tmdb,season,episode}) {
        return type==='movie' ? `https://vidsrc.to/embed/movie/${tmdb}` : `https://vidsrc.to/embed/tv/${tmdb}/${season}/${episode}`;
    }},
    { id:'dl_dwnld', name:'Download Server 1', build({type,tmdb,season,episode}) {
        return type==='movie' ? `https://dl.vidsrc.vip/movie/${tmdb}` : `https://dl.vidsrc.vip/tv/${tmdb}/${season}/${episode}`;
    }},
    { id:'dl_vidking', name:'Download Server 2', build({type,tmdb,season,episode}) {
        return type==='movie' ? `https://www.vidking.net/embed/movie/${tmdb}?download=true` : `https://www.vidking.net/embed/tv/${tmdb}/${season}/${episode}?download=true`;
    }}
  ];
  function downloadLinks(args) {
    return DOWNLOAD_PROVIDERS.map(p => ({ name: p.name, url: p.build(args) }));
  }

  /* ============================================================
     Settings + History
     ============================================================ */
  const Settings = (() => {
    const KEY = 'ttm_settings';
    const DEFAULTS = { color:'e50914', autoplay:true, muted:false, defaultProvider:'vidsrc' };
    function get() { try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return { ...DEFAULTS }; } }
    function save(s) { localStorage.setItem(KEY, JSON.stringify({ ...get(), ...s })); applyTheme(); }
    function applyTheme() {
      const s = get();
      document.documentElement.style.setProperty('--accent', '#' + s.color);
      const r = parseInt(s.color.slice(0,2),16), g = parseInt(s.color.slice(2,4),16), b = parseInt(s.color.slice(4,6),16);
      document.documentElement.style.setProperty('--accent-soft', `rgba(${r},${g},${b},0.15)`);
    }
    return { get, save, applyTheme, DEFAULTS };
  })();

  const SWATCHES = ['e50914','ff6b00','f5a623','46d369','00b4d8','4361ee','9146ff','e91e63','ffffff'];

  const History = (() => {
    const KEY = 'ttm_history';
    function all() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
    function save(list) { localStorage.setItem(KEY, JSON.stringify(list.slice(0,60))); }
    function record(item) {
      const list = all();
      const idx = list.findIndex(x => x.id == item.id && x.type === item.type);
      const entry = { ...item, updated: Date.now() };
      if (idx >= 0) list[idx] = { ...list[idx], ...entry }; else list.unshift(entry);
      list.sort((a,b) => b.updated - a.updated); save(list);
    }
    function get(id, type) { return all().find(x => x.id == id && x.type === type); }
    function clear() { localStorage.removeItem(KEY); }
    return { all, record, get, clear };
  })();
  Settings.applyTheme();

  function toast(msg) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._timer); t._timer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ============================================================
     Settings drawer  (now also contains SERVER selection)
     ============================================================ */
  function buildSettingsDrawer() {
    if (document.getElementById('settings-drawer')) return;
    const s = Settings.get();
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div class="drawer-backdrop" id="drawer-backdrop"></div>
      <aside class="drawer" id="settings-drawer" aria-label="Settings">
        <button class="drawer-close" id="drawer-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
        <h3>Settings</h3>
        <p class="muted">Personalize the player, server and theme.</p>

        <div class="field">
          <label><i class="fa-solid fa-server"></i> Streaming server</label>
          <div class="server-picker" id="server-picker">
            ${PROVIDERS.map((p,i) => `
              <button class="server-opt ${p.id===s.defaultProvider?'active':''}" data-id="${p.id}">
                <span class="server-num">${i+1}</span>
                <span class="sname">${p.name}</span>
                <span class="sbadge">${p.badge}</span>
              </button>`).join('')}
          </div>
          <p class="muted" style="margin-top:10px">If a video won't play, switch the server here (or press 1–4 while watching).</p>
        </div>

        <div class="field">
          <label>Accent color</label>
          <div class="color-swatches" id="swatch-list">
            ${SWATCHES.map(c => `<button class="swatch ${c===s.color?'active':''}" data-color="${c}" style="background:#${c}" aria-label="color ${c}"></button>`).join('')}
          </div>
          <div style="margin-top:12px;display:flex;align-items:center;gap:10px">
            <input type="color" id="custom-color" value="#${s.color}" style="width:42px;height:36px;border:none;background:none;cursor:pointer">
            <span class="muted">Custom</span>
          </div>
        </div>

        <div class="field">
          <label>Playback</label>
          <div class="toggle-row"><span>Autoplay</span><label class="switch"><input type="checkbox" id="opt-autoplay" ${s.autoplay?'checked':''}><span class="slider"></span></label></div>
          <div class="toggle-row"><span>Start muted</span><label class="switch"><input type="checkbox" id="opt-muted" ${s.muted?'checked':''}><span class="slider"></span></label></div>
        </div>

        <form class="field" autocomplete="off" onsubmit="return false">
          <label>TMDB API key (optional)</label>
          <input type="password" id="tmdb-key" autocomplete="off" placeholder="Use your own key" value="${(localStorage.getItem('tmdb_key')||'')}">
          <p class="muted" style="margin-top:6px">Get a free key at themoviedb.org. Leave blank to use the default.</p>
        </form>

        <button class="btn btn-primary" id="clear-history" style="width:100%;justify-content:center;margin-top:6px;background:#2a2a36">
          <i class="fa-solid fa-trash"></i> Clear watch history
        </button>
      </aside>`;
    document.body.appendChild(wrap);
    const backdrop = document.getElementById('drawer-backdrop');
    const drawer = document.getElementById('settings-drawer');
    const close = () => { backdrop.classList.remove('open'); drawer.classList.remove('open'); };
    backdrop.addEventListener('click', close);
    document.getElementById('drawer-close').addEventListener('click', close);

    // server selection
    document.querySelectorAll('#server-picker .server-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#server-picker .server-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Settings.save({ defaultProvider: btn.dataset.id });
        toast('Server set to ' + getProvider(btn.dataset.id).name);
        // if currently watching, reload player live
        if (window._reloadPlayer) window._reloadPlayer(btn.dataset.id);
      });
    });

    document.querySelectorAll('#swatch-list .swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#swatch-list .swatch').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Settings.save({ color: btn.dataset.color });
        document.getElementById('custom-color').value = '#' + btn.dataset.color;
      });
    });
    document.getElementById('custom-color').addEventListener('input', e => {
      const c = e.target.value.replace('#','');
      document.querySelectorAll('#swatch-list .swatch').forEach(b => b.classList.remove('active'));
      Settings.save({ color: c });
    });
    document.getElementById('opt-autoplay').addEventListener('change', e => Settings.save({ autoplay: e.target.checked }));
    document.getElementById('opt-muted').addEventListener('change', e => Settings.save({ muted: e.target.checked }));
    document.getElementById('tmdb-key').addEventListener('change', e => { TMDB.setKey(e.target.value); toast('TMDB key saved — reloading'); setTimeout(render, 800); });
    document.getElementById('clear-history').addEventListener('click', () => { if (confirm('Clear all watch history?')) { History.clear(); toast('Watch history cleared'); if (parseHash().route==='home') render(); } });
    window.openSettings = () => { backdrop.classList.add('open'); drawer.classList.add('open'); };
  }

  /* ============================================================
     Shared card helpers
     ============================================================ */
  function ratingBadge(v) { return v ? `<span class="card-rating"><i class="fa-solid fa-star"></i>${v.toFixed(1)}</span>` : ''; }

  function cardHTML(item) {
    const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');
    if (type !== 'movie' && type !== 'tv') return '';
    const title = item.title || item.name || 'Untitled';
    const date = item.release_date || item.first_air_date || '';
    const year = date ? date.slice(0,4) : '';
    const img = TMDB.poster(item.poster_path, 'w342');
    const poster = img ? `<img loading="lazy" src="${img}" alt="${title}">`
      : `<div class="skeleton" style="width:100%;height:100%;display:grid;place-items:center;color:#555"><i class="fa-solid fa-film fa-2x"></i></div>`;
    return `
      <article class="card" data-id="${item.id}" data-type="${type}" tabindex="0">
        <div class="card-poster">${poster}
          <span class="card-type">${type==='tv'?'TV':'Movie'}</span>
          ${ratingBadge(item.vote_average)}
          <div class="play-overlay"><i class="fa-solid fa-circle-info"></i></div>
        </div>
        <div class="card-title">${title}</div>
        <div class="card-sub">${year}</div>
      </article>`;
  }

  function continueCardHTML(item) {
    const img = TMDB.poster(item.poster, 'w342');
    const sub = item.type==='tv' && item.season ? `S${item.season} E${item.episode}` : (item.year || '');
    return `
      <article class="card" data-id="${item.id}" data-type="${item.type}" data-resume="1" data-season="${item.season||''}" data-episode="${item.episode||''}" tabindex="0">
        <div class="card-poster">
          ${img ? `<img loading="lazy" src="${img}" alt="${item.title}">` : ''}
          <span class="card-type">${item.type==='tv'?'TV':'Movie'}</span>
          <div class="play-overlay"><i class="fa-solid fa-circle-play"></i></div>
        </div>
        <div class="card-title">${item.title}</div>
        <div class="card-sub">${sub}</div>
      </article>`;
  }

  /* Cards -> details page (resume cards -> straight to watch) */
  function navigateToDetails(id, type) { location.hash = `#/details?type=${type}&id=${id}`; }
  function navigateToWatch(id, type, season, episode) {
    let url = `#/watch?type=${type}&id=${id}`;
    if (type === 'tv') url += `&s=${season||1}&e=${episode||1}`;
    location.hash = url;
  }

  function wireCards(scope) {
    scope.querySelectorAll('.card').forEach(card => {
      const go = () => {
        if (card.dataset.resume === '1') navigateToWatch(card.dataset.id, card.dataset.type, card.dataset.season, card.dataset.episode);
        else navigateToDetails(card.dataset.id, card.dataset.type);
      };
      card.addEventListener('click', go);
      card.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    });
  }

  /* ============================================================
     Hash router
     ============================================================ */
  function parseHash() {
    let h = location.hash.replace(/^#/, '');
    if (!h || h === '/') return { route: 'home', params: {} };
    const [path, query] = h.split('?');
    const params = {};
    new URLSearchParams(query || '').forEach((v, k) => params[k] = v);
    if (path === '/browse') return { route: 'browse', params };
    if (path === '/details') return { route: 'details', params };
    if (path === '/watch') return { route: 'watch', params };
    return { route: 'home', params: {} };
  }

  const app = document.getElementById('app');
  const siteHeader = document.getElementById('site-header');
  const watchTop = document.getElementById('watch-top');
  const siteFooter = document.getElementById('site-footer');

  function setChrome(route) {
    if (route === 'watch') {
      siteHeader.hidden = true; watchTop.hidden = false; siteFooter.style.display = 'none';
      document.body.style.background = '#000';
    } else {
      siteHeader.hidden = false; watchTop.hidden = true; siteFooter.style.display = '';
      document.body.style.background = 'var(--bg)';
    }
  }

  function initHeaderScroll() {
    const onScroll = () => siteHeader.classList.toggle('scrolled', window.scrollY > 30);
    window.removeEventListener('scroll', window._sv_scroll || (()=>{}));
    window._sv_scroll = onScroll;
    window.addEventListener('scroll', onScroll); onScroll();
  }

  /* ---------- HOME ---------- */
  async function renderHome() {
    setChrome('home');
    siteHeader.classList.remove('scrolled');
    document.querySelectorAll('#main-nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#/'));
    app.innerHTML = `
      <section class="hero" id="hero">
        <div class="hero-bg"></div>
        <div class="hero-content"><h1 class="skeleton" style="height:48px;width:60%;border-radius:8px">&nbsp;</h1></div>
      </section>
      <main id="rows"></main>`;
    initHeaderScroll();
    await buildHero();
    const rows = document.getElementById('rows');
    buildContinueWatching(rows);
    await buildRow('Trending This Week', () => TMDB.trending('all','week'), rows);
    await buildRow('Popular Movies', () => TMDB.popularMovies(), rows);
    await buildRow('Popular TV Shows', () => TMDB.popularTV(), rows);
    await buildRow('Now Playing in Theaters', () => TMDB.nowPlaying(), rows);
    await buildRow('Top Rated Movies', () => TMDB.topRatedMovies(), rows);
    await buildRow('Top Rated TV', () => TMDB.topRatedTV(), rows);
    await buildRow('Action & Adventure', () => TMDB.byGenre('movie',28), rows);
    await buildRow('Comedy', () => TMDB.byGenre('movie',35), rows);
    await buildRow('Sci-Fi', () => TMDB.byGenre('movie',878), rows);
  }

  async function buildHero() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    try {
      const data = await TMDB.trending('all','week');
      const items = (data.results || []).filter(x => x.backdrop_path && (x.title || x.name));
      const pick = items[Math.floor(Math.random() * Math.min(5, items.length))];
      const type = pick.media_type || (pick.first_air_date ? 'tv' : 'movie');
      const title = pick.title || pick.name;
      const year = (pick.release_date || pick.first_air_date || '').slice(0,4);
      hero.querySelector('.hero-bg').style.backgroundImage = `url(${TMDB.backdrop(pick.backdrop_path, 'original')})`;
      hero.querySelector('.hero-content').innerHTML = `
        <div class="hero-badge"><i class="fa-solid fa-fire"></i> Trending Now</div>
        <h1>${title}</h1>
        <div class="hero-meta">
          <span class="rating"><i class="fa-solid fa-star"></i> ${(pick.vote_average||0).toFixed(1)}</span>
          <span>${year}</span>
          <span style="text-transform:uppercase">${type==='tv'?'TV Series':'Movie'}</span>
        </div>
        <p class="hero-overview">${pick.overview || ''}</p>
        <div class="hero-actions">
          <button class="btn btn-primary" id="hero-play"><i class="fa-solid fa-play"></i> Play</button>
          <button class="btn btn-ghost" id="hero-info"><i class="fa-solid fa-circle-info"></i> Details</button>
        </div>`;
      document.getElementById('hero-play').addEventListener('click', () => navigateToWatch(pick.id, type, 1, 1));
      document.getElementById('hero-info').addEventListener('click', () => navigateToDetails(pick.id, type));
    } catch (e) {
      hero.querySelector('.hero-content').innerHTML = `<h1>Welcome to TTM Streaming</h1><p class="hero-overview">Browse thousands of movies and TV shows. If content fails to load, set your own TMDB key in settings.</p>`;
    }
  }

  async function buildRow(title, fetcher, container) {
    const section = document.createElement('section');
    section.className = 'row';
    section.innerHTML = `
      <div class="row-head"><h2>${title}</h2></div>
      <div class="row-scroller">${Array(7).fill('<div class="card"><div class="card-poster skeleton" style="height:252px"></div></div>').join('')}</div>`;
    container.appendChild(section);
    try {
      const data = await fetcher();
      const items = (data.results || []).filter(x => x.poster_path);
      section.querySelector('.row-scroller').innerHTML = items.map(cardHTML).join('') || '<p style="color:#888">Nothing here.</p>';
      wireCards(section);
    } catch (e) {
      section.querySelector('.row-scroller').innerHTML = '<p style="color:#888;padding:20px">Failed to load.</p>';
    }
  }

  function buildContinueWatching(container) {
    const items = History.all();
    if (!items.length) return;
    const section = document.createElement('section');
    section.className = 'row';
    section.innerHTML = `
      <div class="row-head"><h2><i class="fa-solid fa-clock-rotate-left" style="color:var(--accent)"></i> Continue Watching</h2></div>
      <div class="row-scroller">${items.map(continueCardHTML).join('')}</div>`;
    container.prepend(section);
    wireCards(section);
  }

  /* ---------- BROWSE / SEARCH ---------- */
  let browseState = null;
  async function renderBrowse(params) {
    setChrome('home');
    siteHeader.classList.add('scrolled');
    app.innerHTML = `
      <main class="grid-page">
        <h1 id="page-title">Browse</h1>
        <p class="sub" id="page-sub"></p>
        <nav class="filter-bar" id="filter-bar"></nav>
        <section class="poster-grid" id="grid"></section>
        <div id="loader" style="text-align:center;padding:40px"><div class="spinner" style="margin:0 auto;width:36px;height:36px"></div></div>
      </main>`;
    initHeaderScroll();

    const MODE = {
      q: params.q || '', type: params.type || '', trending: params.trending === '1',
      genre: params.genre || '', page: 1, loading: false, done: false, fetcher: null, title: 'Browse'
    };
    document.querySelectorAll('#main-nav a').forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('active', (MODE.trending && href.includes('trending')) || (!MODE.trending && href.includes('type='+MODE.type) && MODE.type));
    });

    function makeFetcher() {
      if (MODE.q) { MODE.title = `Results for “${MODE.q}”`; return () => TMDB.searchMulti(MODE.q, MODE.page); }
      if (MODE.trending) { MODE.title = 'Trending'; return () => TMDB.trending('all','week'); }
      if (MODE.genre && MODE.type) { MODE.title = (TMDB.GENRES[MODE.type] && TMDB.GENRES[MODE.type][MODE.genre]) || 'Browse'; return () => TMDB.byGenre(MODE.type, MODE.genre, MODE.page); }
      if (MODE.type === 'tv') { MODE.title = 'TV Shows'; return () => TMDB.popularTV(MODE.page); }
      MODE.title = 'Movies'; return () => TMDB.popularMovies(MODE.page);
    }

    function renderFilters() {
      const bar = document.getElementById('filter-bar');
      if (MODE.q || MODE.trending) { bar.style.display = 'none'; return; }
      const type = MODE.type === 'tv' ? 'tv' : 'movie';
      const genres = TMDB.GENRES[type];
      bar.innerHTML = `
        <a class="chip ${!MODE.genre?'active':''}" href="#/browse?type=${type}">All</a>
        ${Object.entries(genres).map(([id,name]) => `<a class="chip ${MODE.genre==id?'active':''}" href="#/browse?type=${type}&genre=${id}">${name}</a>`).join('')}`;
    }

    async function loadMore() {
      if (MODE.loading || MODE.done) return;
      MODE.loading = true;
      const grid = document.getElementById('grid');
      try {
        const data = await MODE.fetcher();
        let items = (data.results || []).filter(x => x.poster_path);
        if (MODE.q) items = items.filter(x => x.media_type === 'movie' || x.media_type === 'tv');
        if (!items.length && MODE.page === 1) {
          grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="fa-solid fa-film"></i><p>No results found.</p></div>`;
          MODE.done = true; return;
        }
        grid.insertAdjacentHTML('beforeend', items.map(cardHTML).join(''));
        wireCards(grid);
        MODE.page++;
        if (MODE.trending || MODE.page > (data.total_pages || 1)) MODE.done = true;
      } catch (e) {
        if (MODE.page === 1) grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="fa-solid fa-triangle-exclamation"></i><p>Failed to load. Check your TMDB key in settings.</p></div>`;
        MODE.done = true;
      } finally {
        MODE.loading = false;
        const ld = document.getElementById('loader'); if (ld) ld.style.display = MODE.done ? 'none' : 'block';
      }
    }

    MODE.fetcher = makeFetcher();
    document.getElementById('page-title').textContent = MODE.title;
    document.getElementById('page-sub').textContent = MODE.q ? 'Movies & TV shows' : (MODE.type === 'tv' ? 'Series' : 'Films');
    renderFilters();
    await loadMore();

    if (browseState && browseState.io) browseState.io.disconnect();
    const io = new IntersectionObserver(entries => { if (entries[0].isIntersecting) loadMore(); }, { rootMargin: '600px' });
    const loaderEl = document.getElementById('loader');
    if (loaderEl) io.observe(loaderEl);
    browseState = { io };

    const input = document.getElementById('search-input');
    if (input && MODE.q) input.value = MODE.q;
  }

  /* ============================================================
     DETAILS PAGE  (info + download + episodes; no scrolling under player)
     ============================================================ */
  async function renderDetails(params) {
    setChrome('home');
    siteHeader.classList.add('scrolled');
    const type = params.type === 'tv' ? 'tv' : 'movie';
    const id = params.id;
    let season = parseInt(params.s) || 1;

    app.innerHTML = `<div class="details-page"><div class="player-loading" style="position:static;padding:140px 20px"><div class="spinner"></div></div></div>`;
    initHeaderScroll();

    let details;
    try {
      details = type === 'movie' ? await TMDB.movieDetails(id) : await TMDB.tvDetails(id);
    } catch (e) {
      app.innerHTML = `<div class="details-page"><div class="empty-state" style="padding:160px 20px"><i class="fa-solid fa-triangle-exclamation"></i><p>Could not load details. Check your TMDB key in settings.</p></div></div>`;
      return;
    }

    const title = details.title || details.name || 'Untitled';
    const year = (details.release_date || details.first_air_date || '').slice(0,4);
    const runtime = details.runtime ? `${details.runtime} min` : (details.episode_run_time && details.episode_run_time[0] ? `${details.episode_run_time[0]} min/ep` : '—');
    const genres = (details.genres || []).map(g => `<span>${g.name}</span>`).join('');
    const posterImg = TMDB.poster(details.poster_path, 'w500');
    const bg = TMDB.backdrop(details.backdrop_path, 'original') || posterImg;
    const director = (details.credits && details.credits.crew || []).find(c => c.job === 'Director');
    const creators = (details.created_by || []).map(c => c.name).join(', ');
    const status = details.status || '—';
    const lang = (details.original_language || '').toUpperCase();

    app.innerHTML = `
      <div class="details-page">
        <section class="details-hero">
          <div class="details-hero-bg" style="background-image:url('${bg||''}')"></div>
          <div class="details-inner">
            <div class="details-poster">${posterImg ? `<img src="${posterImg}" alt="${title}">` : '<div class="skeleton" style="aspect-ratio:2/3"></div>'}</div>
            <div class="details-meta">
              <h1>${title}</h1>
              ${details.tagline ? `<p class="tagline">${details.tagline}</p>` : ''}
              <div class="fact-row">
                <span class="rating"><i class="fa-solid fa-star"></i> ${(details.vote_average||0).toFixed(1)}</span>
                ${year ? `<span>${year}</span>` : ''}
                <span>${runtime}</span>
                ${type==='tv' && details.number_of_seasons ? `<span>${details.number_of_seasons} season(s)</span>` : ''}
                <span style="text-transform:uppercase">${type==='tv'?'TV Series':'Movie'}</span>
              </div>
              <div class="genre-tags">${genres}</div>
              <p class="details-overview">${details.overview || 'No description available.'}</p>
              <div class="details-actions">
                <button class="btn btn-primary" id="det-play"><i class="fa-solid fa-play"></i> ${type==='tv'?'Play S'+season+' E1':'Play'}</button>
                <a class="btn btn-outline" href="#download-section"><i class="fa-solid fa-download"></i> Download</a>
              </div>
              <div class="info-grid">
                ${director ? `<div class="info-cell"><div class="k">Director</div><div class="v">${director.name}</div></div>` : ''}
                ${creators ? `<div class="info-cell"><div class="k">Created by</div><div class="v">${creators}</div></div>` : ''}
                <div class="info-cell"><div class="k">Status</div><div class="v">${status}</div></div>
                <div class="info-cell"><div class="k">Language</div><div class="v">${lang || '—'}</div></div>
                ${type==='tv' && details.number_of_episodes ? `<div class="info-cell"><div class="k">Episodes</div><div class="v">${details.number_of_episodes}</div></div>` : ''}
                ${details.vote_count ? `<div class="info-cell"><div class="k">Votes</div><div class="v">${details.vote_count.toLocaleString()}</div></div>` : ''}
              </div>
            </div>
          </div>
        </section>

        <div class="details-body">
          ${type==='movie' ? `
          <section id="download-section">
            <h2 class="section-title"><span class="accent-bar"></span> Download</h2>
            <div class="download-box">
              <p>Download links are provided by third-party indexers. Open a link, then choose your quality/source on the provider page. Use an ad-blocker for the best experience.</p>
              <div class="dl-links">
                ${downloadLinks({type,tmdb:id}).map(l => `<a class="dl-btn" href="${l.url}" target="_blank" rel="noopener"><i class="fa-solid fa-download"></i> ${l.name}</a>`).join('')}
              </div>
            </div>
          </section>` : `
          <section class="episodes-section" id="episodes-section">
            <h2 class="section-title" id="download-section"><span class="accent-bar"></span> Episodes &amp; Downloads</h2>
            <div class="ep-head">
              <select class="season-select" id="season-select"></select>
              <span class="muted" style="color:var(--text-dim);font-size:0.85rem">Play or download each episode below.</span>
            </div>
            <div class="ep-list" id="ep-list"><div class="player-loading" style="position:static;padding:30px"><div class="spinner"></div></div></div>
          </section>`}

          <section id="cast-section"></section>
          <section class="row" id="recs-section" style="padding:0"></section>
        </div>
      </div>`;

    document.getElementById('det-play').onclick = () => navigateToWatch(id, type, season, 1);

    // Cast
    (function renderCast(){
      const sec = document.getElementById('cast-section');
      const cast = (details.credits && details.credits.cast || []).slice(0, 18);
      if (!cast.length) { sec.innerHTML = ''; return; }
      sec.innerHTML = `<h2 class="section-title"><span class="accent-bar"></span> Cast</h2>
        <div class="cast-row">${cast.map(p => {
          const img = TMDB.profile(p.profile_path);
          return `<div class="cast-card">${img?`<img loading="lazy" src="${img}" alt="${p.name}">`:`<div class="noimg"><i class="fa-solid fa-user fa-lg"></i></div>`}<div class="name">${p.name}</div><div class="role">${p.character||''}</div></div>`;
        }).join('')}</div>`;
    })();

    // Recommendations -> "You may like"
    (function renderRecs(){
      const sec = document.getElementById('recs-section');
      const recs = (details.recommendations && details.recommendations.results || []).filter(x => x.poster_path).slice(0, 16);
      if (!recs.length) { sec.innerHTML = ''; return; }
      sec.innerHTML = `<h2 class="section-title" style="padding:0"><span class="accent-bar"></span> You may like</h2>
        <div class="row-scroller" style="padding-left:0;padding-right:0">${recs.map(r => cardHTML({...r, media_type: type})).join('')}</div>`;
      wireCards(sec);
    })();

    // TV episodes + per-episode download
    if (type === 'tv') {
      const seasons = (details.seasons || []).filter(s => s.season_number > 0);
      const sel = document.getElementById('season-select');
      if (seasons.length && sel) {
        sel.innerHTML = seasons.map(s => `<option value="${s.season_number}" ${s.season_number===season?'selected':''}>${s.name || 'Season '+s.season_number}</option>`).join('');
        sel.onchange = () => { season = parseInt(sel.value); loadSeasonEpisodes(); };
        await loadSeasonEpisodes();
      } else {
        document.getElementById('ep-list').innerHTML = '<p style="color:#888">No episodes available.</p>';
      }
    }

    async function loadSeasonEpisodes() {
      const listEl = document.getElementById('ep-list');
      listEl.innerHTML = `<div class="player-loading" style="position:static;padding:30px"><div class="spinner"></div></div>`;
      try {
        const data = await TMDB.seasonDetails(id, season);
        const eps = data.episodes || [];
        listEl.innerHTML = eps.map(ep => {
          const thumb = ep.still_path ? TMDB.backdrop(ep.still_path, 'w300') : '';
          const dls = downloadLinks({type:'tv',tmdb:id,season,episode:ep.episode_number});
          return `<div class="ep-card">
            <div class="ep-thumb" data-ep="${ep.episode_number}">${thumb?`<img loading="lazy" src="${thumb}" alt="">`:''}<span class="ep-num">E${ep.episode_number}</span><div class="ep-play-ov"><i class="fa-solid fa-circle-play"></i></div></div>
            <div class="ep-body">
              <div class="ep-title">E${ep.episode_number}. ${ep.name||('Episode '+ep.episode_number)}</div>
              <div class="ep-ov">${ep.overview||''}</div>
              <div class="ep-act">
                <button class="ep-play-btn" data-ep="${ep.episode_number}"><i class="fa-solid fa-play"></i> Play</button>
                <button class="ep-dl-btn" data-ep="${ep.episode_number}" data-links='${JSON.stringify(dls).replace(/'/g,"&#39;")}'><i class="fa-solid fa-download"></i> Download</button>
              </div>
            </div>
          </div>`;
        }).join('') || '<p style="color:#888">No episodes found.</p>';

        // play handlers
        listEl.querySelectorAll('.ep-thumb, .ep-play-btn').forEach(el => {
          el.addEventListener('click', () => navigateToWatch(id, 'tv', season, parseInt(el.dataset.ep)));
        });
        // download handlers (open a small picker if multiple, else direct)
        listEl.querySelectorAll('.ep-dl-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            let links = [];
            try { links = JSON.parse(btn.dataset.links.replace(/&#39;/g,"'")); } catch {}
            openDownloadPicker(`${title} — S${season} E${btn.dataset.ep}`, links);
          });
        });
      } catch (e) { listEl.innerHTML = '<p style="color:#888">Failed to load episodes.</p>'; }
    }

    History.record({
      id, type, title, poster: details.poster_path, backdrop: details.backdrop_path,
      year, viewedDetails: true
    });
    window.scrollTo({ top: 0 });
  }

  /* Small modal-ish download picker (reuses drawer-backdrop style via a quick element) */
  function openDownloadPicker(label, links) {
    if (!links || !links.length) { toast('No download links available'); return; }
    let modal = document.getElementById('dl-modal');
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'dl-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:9000;display:grid;place-items:center;background:rgba(0,0,0,0.65);padding:20px';
    modal.innerHTML = `
      <div style="background:var(--bg-elev);border:1px solid var(--border);border-radius:14px;max-width:440px;width:100%;padding:22px;box-shadow:var(--shadow)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <h3 style="font-size:1.1rem">Download</h3>
          <button id="dl-modal-close" style="background:none;border:none;color:var(--text-dim);font-size:1.2rem;cursor:pointer"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <p style="color:var(--text-dim);font-size:0.85rem;margin-bottom:16px">${label}</p>
        <div class="dl-links">
          ${links.map(l => `<a class="dl-btn" href="${l.url}" target="_blank" rel="noopener" style="flex:1;justify-content:center"><i class="fa-solid fa-download"></i> ${l.name}</a>`).join('')}
        </div>
        <p style="color:var(--text-dim);font-size:0.78rem;margin-top:14px">Links open on a third-party provider. Use an ad-blocker.</p>
      </div>`;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    modal.querySelector('#dl-modal-close').addEventListener('click', close);
  }

  /* ============================================================
     WATCH PAGE  (player + servers in settings + fullscreen fixed)
     ============================================================ */
  let watchState = null;
  async function renderWatch(params) {
    setChrome('watch');
    const type = params.type === 'tv' ? 'tv' : 'movie';
    const id = params.id;
    let season = parseInt(params.s) || 1;
    let episode = parseInt(params.e) || 1;
    let currentProvider = Settings.get().defaultProvider;

    app.innerHTML = `
      <div class="player-stage" id="player-stage" tabindex="0">
        <div class="player-loading" id="player-loading"><div class="spinner"></div></div>
        <div class="player-controls" id="player-controls">
          <button class="pc-btn" id="btn-theater" title="Fill window (theater mode)">
            <i class="fa-solid fa-up-right-and-down-left-from-center"></i><span class="pc-label">Window</span>
          </button>
          <button class="pc-btn" id="btn-fullscreen" title="True fullscreen (whole screen)">
            <i class="fa-solid fa-expand"></i><span class="pc-label">Fullscreen</span>
          </button>
        </div>
      </div>
      <div class="watch-wrap">
        <div class="watch-bar">
          <h2 id="wb-title">Loading…</h2>
          <span class="ep-tag" id="wb-eptag"></span>
        </div>
        <div class="watch-actions" id="watch-actions"></div>
        <div class="tip"><i class="fa-solid fa-circle-info"></i>
          <span>Server is controlled from <strong>Settings</strong> (top-right <i class="fa-solid fa-sliders"></i>) — or press <kbd>1</kbd>–<kbd>4</kbd> to switch. If a video won't play, switch the server.
          <br><strong>Window</strong> mode fills the browser window (press <kbd>W</kbd>). <strong>Fullscreen</strong> fills your whole screen (press <kbd>F</kbd>). Press <kbd>Esc</kbd> to exit either.</span>
        </div>
        <section class="ep-switcher" id="ep-switcher"></section>
      </div>`;

    document.getElementById('watch-back').onclick = () => {
      // prefer going back to the details page for this title
      location.hash = `#/details?type=${type}&id=${id}${type==='tv'?'&s='+season:''}`;
    };

    let details = null;
    try {
      details = type === 'movie' ? await TMDB.movieDetails(id) : await TMDB.tvDetails(id);
    } catch (e) {
      document.getElementById('player-stage').innerHTML = `<div class="player-loading"><div class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>Could not load metadata. Check your TMDB key in settings.</p></div></div>`;
      return;
    }

    const title = details.title || details.name || 'Untitled';
    document.getElementById('watch-title').textContent = title;
    document.getElementById('wb-title').textContent = title;

    /* ---- loader control ---- */
    let loaderTimer = null;
    function showLoader() { const l = document.getElementById('player-loading'); if (l) { l.innerHTML = '<div class="spinner"></div>'; l.classList.remove('hide'); } }
    function hideLoader() { const l = document.getElementById('player-loading'); if (l) l.classList.add('hide'); }

    function updateEpTag() {
      const tag = document.getElementById('wb-eptag');
      if (tag) tag.textContent = type==='tv' ? `Season ${season} · Episode ${episode}` : ((details.release_date||'').slice(0,4) || '');
    }

    function renderWatchActions() {
      const wrap = document.getElementById('watch-actions');
      const dls = downloadLinks({type,tmdb:id,season,episode});
      const dlLabel = type==='tv' ? `Download S${season} E${episode}` : 'Download';
      wrap.innerHTML = `
        <button class="btn btn-outline" id="wa-details"><i class="fa-solid fa-circle-info"></i> View details</button>
        <button class="btn btn-primary" id="wa-download" style="background:var(--bg-elev);border:1px solid var(--border)"><i class="fa-solid fa-download"></i> ${dlLabel}</button>`;
      document.getElementById('wa-details').onclick = () => location.hash = `#/details?type=${type}&id=${id}${type==='tv'?'&s='+season:''}`;
      document.getElementById('wa-download').onclick = () => openDownloadPicker(type==='tv' ? `${title} — S${season} E${episode}` : title, dls);
    }

    function loadPlayer() {
      const stage = document.getElementById('player-stage');
      const opt = { color: Settings.get().color, autoplay: Settings.get().autoplay, muted: Settings.get().muted };
      const prov = getProvider(currentProvider);
      const src = prov.build({ type, tmdb: id, season, episode, opt });

      const oldFrame = stage.querySelector('iframe');
      if (oldFrame) oldFrame.remove();
      showLoader();

      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.setAttribute('allowfullscreen', '');
      iframe.referrerPolicy = 'origin';
      iframe.addEventListener('load', hideLoader);
      stage.appendChild(iframe);

      clearTimeout(loaderTimer);
      loaderTimer = setTimeout(hideLoader, 3500);

      History.record({
        id, type, title, poster: details.poster_path, backdrop: details.backdrop_path,
        season: type==='tv'?season:undefined, episode: type==='tv'?episode:undefined,
        year: (details.release_date || details.first_air_date || '').slice(0,4)
      });
      updateEpTag();
      renderWatchActions();
    }

    // allow settings drawer to live-reload the player when the server changes
    window._reloadPlayer = (provId) => { if (parseHash().route !== 'watch') return; currentProvider = provId; loadPlayer(); window.scrollTo({top:0,behavior:'smooth'}); };

    /* ---- Theater / Window mode ---- */
    const stageEl = () => document.getElementById('player-stage');
    function toggleTheater() {
      const stage = stageEl(); if (!stage) return;
      const on = stage.classList.toggle('theater');
      document.body.classList.toggle('theater-open', on);
      const btn = document.getElementById('btn-theater');
      if (btn) {
        btn.querySelector('i').className = on ? 'fa-solid fa-down-left-and-up-right-to-center' : 'fa-solid fa-up-right-and-down-left-from-center';
        btn.querySelector('.pc-label').textContent = on ? 'Exit Window' : 'Window';
      }
      if (on) window.scrollTo({ top: 0 });
    }
    function exitTheater() { const stage = stageEl(); if (stage && stage.classList.contains('theater')) toggleTheater(); }

    /* ---- True fullscreen ---- */
    function toggleFullscreen() {
      const stage = stageEl(); if (!stage) return;
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      if (!fsEl) {
        const req = stage.requestFullscreen || stage.webkitRequestFullscreen || stage.msRequestFullscreen;
        if (req) { try { req.call(stage); } catch (e) { toast('Fullscreen not supported here'); } }
        else { toast('Fullscreen not supported by this browser'); }
      } else {
        const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
        if (exit) exit.call(document);
      }
    }
    function syncFullscreenBtn() {
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      const btn = document.getElementById('btn-fullscreen'); if (!btn) return;
      const on = !!fsEl;
      btn.querySelector('i').className = on ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
      btn.querySelector('.pc-label').textContent = on ? 'Exit' : 'Fullscreen';
    }

    document.getElementById('btn-theater').onclick = toggleTheater;
    document.getElementById('btn-fullscreen').onclick = toggleFullscreen;

    /* ---- Episode quick switcher (TV) ---- */
    async function renderEpSwitcher() {
      const sec = document.getElementById('ep-switcher');
      if (type !== 'tv') { sec.innerHTML = ''; return; }
      const seasons = (details.seasons || []).filter(s => s.season_number > 0);
      if (!seasons.length) { sec.innerHTML = ''; return; }
      sec.innerHTML = `
        <div class="ep-head">
          <h2 class="section-title" style="margin:0"><span class="accent-bar"></span> Episodes</h2>
          <select class="season-select" id="w-season-select">
            ${seasons.map(s => `<option value="${s.season_number}" ${s.season_number===season?'selected':''}>${s.name || 'Season '+s.season_number}</option>`).join('')}
          </select>
        </div>
        <div class="ep-list" id="w-ep-list"><div class="player-loading" style="position:static;padding:30px"><div class="spinner"></div></div></div>`;
      const sel = document.getElementById('w-season-select');
      sel.onchange = () => { season = parseInt(sel.value); episode = 1; loadWSeason(); loadPlayer(); window.scrollTo({top:0,behavior:'smooth'}); };
      await loadWSeason();

      async function loadWSeason() {
        const listEl = document.getElementById('w-ep-list');
        try {
          const data = await TMDB.seasonDetails(id, season);
          const eps = data.episodes || [];
          listEl.innerHTML = eps.map(ep => {
            const thumb = ep.still_path ? TMDB.backdrop(ep.still_path, 'w300') : '';
            const dls = downloadLinks({type:'tv',tmdb:id,season,episode:ep.episode_number});
            return `<div class="ep-card ${ep.episode_number===episode?'':''}" >
              <div class="ep-thumb" data-ep="${ep.episode_number}">${thumb?`<img loading="lazy" src="${thumb}" alt="">`:''}<span class="ep-num">E${ep.episode_number}</span><div class="ep-play-ov"><i class="fa-solid fa-circle-play"></i></div></div>
              <div class="ep-body">
                <div class="ep-title">E${ep.episode_number}. ${ep.name||('Episode '+ep.episode_number)}</div>
                <div class="ep-ov">${ep.overview||''}</div>
                <div class="ep-act">
                  <button class="ep-play-btn" data-ep="${ep.episode_number}"><i class="fa-solid fa-play"></i> Play</button>
                  <button class="ep-dl-btn" data-ep="${ep.episode_number}" data-links='${JSON.stringify(dls).replace(/'/g,"&#39;")}'><i class="fa-solid fa-download"></i> Download</button>
                </div>
              </div>
            </div>`;
          }).join('') || '<p style="color:#888">No episodes found.</p>';

          listEl.querySelectorAll('.ep-thumb, .ep-play-btn').forEach(el => {
            el.addEventListener('click', () => {
              episode = parseInt(el.dataset.ep);
              location.hash = `#/watch?type=tv&id=${id}&s=${season}&e=${episode}`;
              loadPlayer(); window.scrollTo({top:0,behavior:'smooth'});
            });
          });
          listEl.querySelectorAll('.ep-dl-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              let links = [];
              try { links = JSON.parse(btn.dataset.links.replace(/&#39;/g,"'")); } catch {}
              openDownloadPicker(`${title} — S${season} E${btn.dataset.ep}`, links);
            });
          });
        } catch (e) { listEl.innerHTML = '<p style="color:#888">Failed to load episodes.</p>'; }
      }
    }

    await renderEpSwitcher();
    loadPlayer();
    window.scrollTo({ top: 0 });

    /* ---- keyboard ---- */
    if (watchState && watchState.keyHandler) document.removeEventListener('keydown', watchState.keyHandler);
    if (watchState && watchState.fsHandler) {
      document.removeEventListener('fullscreenchange', watchState.fsHandler);
      document.removeEventListener('webkitfullscreenchange', watchState.fsHandler);
    }
    const keyHandler = (e) => {
      if (['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)) return;
      const k = e.key.toLowerCase();
      if (k === 'w') { e.preventDefault(); toggleTheater(); return; }
      if (k === 'f') { e.preventDefault(); toggleFullscreen(); return; }
      if (k === 'escape') { exitTheater(); return; }
      const n = parseInt(e.key);
      if (n >= 1 && n <= PROVIDERS.length) { currentProvider = PROVIDERS[n-1].id; Settings.save({defaultProvider:currentProvider}); loadPlayer(); window.scrollTo({top:0,behavior:'smooth'}); toast('Server: '+PROVIDERS[n-1].name); }
    };
    document.addEventListener('keydown', keyHandler);
    const fsHandler = () => syncFullscreenBtn();
    document.addEventListener('fullscreenchange', fsHandler);
    document.addEventListener('webkitfullscreenchange', fsHandler);
    watchState = { keyHandler, fsHandler };
  }

  /* ============================================================
     Router dispatch
     ============================================================ */
  async function render() {
    document.body.classList.remove('theater-open');
    window._reloadPlayer = null;
    const { route, params } = parseHash();
    window.scrollTo({ top: 0 });
    if (route === 'watch') return renderWatch(params);
    if (route === 'details') return renderDetails(params);
    if (route === 'browse') return renderBrowse(params);
    return renderHome();
  }

  /* ============================================================
     Global init
     ============================================================ */
  function initGlobal() {
    buildSettingsDrawer();
    document.getElementById('settings-btn').addEventListener('click', () => window.openSettings());
    document.getElementById('settings-btn-watch').addEventListener('click', () => window.openSettings());

    const input = document.getElementById('search-input');
    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      const q = input.value.trim();
      timer = setTimeout(() => { if (q.length >= 2) location.hash = `#/browse?q=${encodeURIComponent(q)}`; }, 600);
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && input.value.trim()) location.hash = `#/browse?q=${encodeURIComponent(input.value.trim())}`;
    });
  }

  window.addEventListener('hashchange', render);
  document.addEventListener('DOMContentLoaded', () => { initGlobal(); render(); });
  </script>
</body>
</html>
