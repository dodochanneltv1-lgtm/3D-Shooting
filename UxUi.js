// UI styles, modern tactical theme, online game-icons (with inline SVG fallback), and static markup;
// Keep all element IDs and structural hooks in sync with index.html game logic.
(function injectExternalAssets() {
  const head = document.head || document.documentElement;
  const ensureLink = (id, rel, href, crossOrigin) => {
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = rel;
    link.href = href;
    if (crossOrigin) link.crossOrigin = crossOrigin;
    head.appendChild(link);
  };
  ensureLink('ux-font-preconnect-1', 'preconnect', 'https://fonts.googleapis.com');
  ensureLink('ux-font-preconnect-2', 'preconnect', 'https://fonts.gstatic.com', 'anonymous');
  ensureLink(
    'ux-google-fonts',
    'stylesheet',
    'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Noto+Sans+Thai:wght@400;500;600;700;800&display=swap'
  );
  ensureLink(
    'ux-remixicon-css',
    'stylesheet',
    'https://cdn.jsdelivr.net/npm/remixicon@4.9.0/fonts/remixicon.css'
  );
})();

const ICONIFY_BASE = 'https://api.iconify.design/game-icons/';
const FALLBACK_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f8fafc" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="2" fill="#f59e0b" stroke="none"/></svg>'
  );

const gameIconImg = (slug, alt = '', cls = 'gx-icon') =>
  `<img class="${cls}" src="${ICONIFY_BASE}${slug}.svg?color=%23f1f5f9" alt="${alt}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${FALLBACK_SVG}'" />`;

const UX_UI_STYLES = String.raw`
    :root {
      --bg-deep: #060911;
      --panel: rgba(11, 16, 27, 0.88);
      --panel-strong: rgba(9, 13, 22, 0.96);
      --panel-soft: rgba(255, 255, 255, 0.045);
      --border: rgba(255, 255, 255, 0.11);
      --border-strong: rgba(255, 255, 255, 0.22);
      --red: #ef4444;
      --red-glow: rgba(239, 68, 68, 0.35);
      --blue: #3b82f6;
      --blue-glow: rgba(59, 130, 246, 0.35);
      --gold: #f59e0b;
      --gold-bright: #fbbf24;
      --gold-glow: rgba(245, 158, 11, 0.3);
      --green: #10b981;
      --cyan: #06b6d4;
      --text: #f8fafc;
      --muted: #94a3b8;
      --font-sans: 'Chakra Petch', 'Noto Sans Thai', 'Segoe UI', Tahoma, sans-serif;
      --radius-lg: 16px;
      --radius-md: 11px;
      --radius-sm: 8px;
      --st: env(safe-area-inset-top, 0px);
      --sr: env(safe-area-inset-right, 0px);
      --sb: env(safe-area-inset-bottom, 0px);
      --sl: env(safe-area-inset-left, 0px);
    }

    * { box-sizing: border-box; user-select: none; margin: 0; padding: 0; }
    body, html {
      width: 100%; height: 100%; overflow: hidden; overscroll-behavior: none; touch-action: none;
      background: var(--bg-deep); color: var(--text); font-family: var(--font-sans);
      -webkit-font-smoothing: antialiased;
    }
    button, input, select { font-family: inherit; }
    .num, #fps-counter, .score-box, .match-timer, .ammo-hud, #hud-armor, #hud-headarmor, #hud-coins {
      font-variant-numeric: tabular-nums;
    }

    /* Custom tactical scrollbars */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.03); border-radius: 99px; }
    ::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.28); border-radius: 99px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(245, 158, 11, 0.55); }

    .gx-icon {
      width: 24px; height: 24px; object-fit: contain; display: inline-block; vertical-align: middle;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.65));
      transition: transform 0.16s ease, filter 0.16s ease;
    }
    .gx-icon-sm { width: 16px; height: 16px; }
    .gx-icon-xs { width: 14px; height: 14px; }
    .ri { vertical-align: middle; line-height: 1; }

    #game-canvas { position: fixed; inset: 0; z-index: 1; display: block; width: 100%; height: 100%; }

    .screen {
      position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center;
      padding: 16px;
      background:
        radial-gradient(circle at 18% 20%, rgba(239, 68, 68, 0.14), transparent 42%),
        radial-gradient(circle at 82% 80%, rgba(59, 130, 246, 0.16), transparent 45%),
        linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
        radial-gradient(circle at center, rgba(15, 23, 42, 0.88), rgba(4, 7, 13, 0.97));
      background-size: auto, auto, 38px 38px, 38px 38px, auto;
      backdrop-filter: blur(12px);
    }
    .hidden { display: none !important; }

    .card {
      position: relative;
      background: linear-gradient(165deg, rgba(18, 25, 42, 0.94), rgba(9, 13, 22, 0.96));
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 22px;
      box-shadow: 0 28px 80px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.09);
      max-width: 96vw;
    }
    .card::before {
      content: '';
      position: absolute; top: 0; left: 20px; right: 20px; height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold), rgba(56, 189, 248, 0.75), transparent);
      opacity: 0.75; border-radius: 99px; pointer-events: none;
    }

    .brand { text-align: center; margin-bottom: 18px; }
    .brand-badge {
      display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; margin-bottom: 8px;
      font-size: 0.68rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
      color: #fde68a; background: rgba(245, 158, 11, 0.14); border: 1px solid rgba(245, 158, 11, 0.32);
      border-radius: 999px;
    }
    .brand h1 {
      font-size: 2.15rem; letter-spacing: 4px; font-weight: 800; line-height: 1.1;
      background: linear-gradient(95deg, #f87171 0%, #fbbf24 50%, #60a5fa 100%);
      -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 4px 14px rgba(245, 158, 11, 0.18));
    }
    .brand p { color: var(--muted); font-size: 0.8rem; margin-top: 5px; letter-spacing: 0.6px; }

    .tabs {
      display: flex; gap: 6px; margin-bottom: 14px; padding: 4px;
      background: rgba(0, 0, 0, 0.42); border: 1px solid var(--border); border-radius: 10px;
    }
    .tab-btn {
      flex: 1; padding: 9px 12px; border: 1px solid transparent; background: transparent;
      color: var(--muted); border-radius: 7px; cursor: pointer; font-weight: 700; font-size: 0.86rem;
      transition: all 0.18s ease;
    }
    .tab-btn:hover { color: #fff; background: rgba(255, 255, 255, 0.05); }
    .tab-btn.active {
      background: linear-gradient(135deg, #ef4444, #b91c1c); color: #fff;
      border-color: rgba(252, 165, 165, 0.45);
      box-shadow: 0 4px 16px rgba(239, 68, 68, 0.35);
    }

    .form-group { margin-bottom: 10px; }
    .form-group label {
      display: flex; align-items: center; gap: 5px;
      font-size: 0.76rem; font-weight: 600; color: #cbd5e1; margin-bottom: 5px;
    }
    .form-group input, .form-group select {
      width: 100%; padding: 9px 11px; border-radius: 9px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: rgba(6, 10, 18, 0.72); color: #f8fafc; font-size: 0.86rem; outline: none;
      transition: border-color 0.16s, box-shadow 0.16s, background 0.16s;
    }
    .form-group input:focus, .form-group select:focus {
      border-color: var(--gold); background: rgba(12, 18, 32, 0.95);
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
    }
    .form-group select:disabled, .form-group input:disabled { opacity: 0.45; cursor: not-allowed; }
    select option { background: #0f172a; color: #f8fafc; }

    .btn {
      padding: 9px 15px; border: 1px solid transparent; border-radius: 9px;
      font-weight: 700; cursor: pointer; transition: all 0.16s cubic-bezier(0.2, 0.8, 0.2, 1);
      color: #fff; font-size: 0.86rem; display: inline-flex; align-items: center; justify-content: center; gap: 7px;
      letter-spacing: 0.2px;
    }
    .btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
    .btn:active:not(:disabled) { transform: translateY(0) scale(0.985); }
    .btn:disabled { opacity: 0.45; cursor: not-allowed; }
    .btn-primary {
      background: linear-gradient(135deg, #ef4444, #b91c1c); width: 100%;
      border-color: rgba(252, 165, 165, 0.35); box-shadow: 0 6px 20px rgba(239, 68, 68, 0.28);
    }
    .btn-blue {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-color: rgba(147, 197, 253, 0.32); box-shadow: 0 6px 20px rgba(37, 99, 235, 0.28);
    }
    .btn-green {
      background: linear-gradient(135deg, #10b981, #047857);
      border-color: rgba(110, 231, 183, 0.35); box-shadow: 0 6px 20px rgba(16, 185, 129, 0.25);
    }
    .btn-gold {
      background: linear-gradient(135deg, #fbbf24, #d97706); color: #090d16;
      border-color: rgba(254, 240, 138, 0.45); box-shadow: 0 6px 22px rgba(245, 158, 11, 0.28);
    }
    .btn-ghost {
      background: rgba(255, 255, 255, 0.065); border: 1px solid rgba(255, 255, 255, 0.14); width: 100%;
      color: #e2e8f0;
    }
    .btn-ghost:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.28);
    }
    .msg-error { color: #fca5a5; font-size: 0.8rem; margin-top: 8px; min-height: 16px; text-align: center; }

    /* Lobby */
    #lobby-card {
      width: 1180px; max-height: 94vh; overflow-y: auto;
      display: grid; grid-template-columns: 1.24fr 1fr; gap: 16px;
    }
    @media (max-width: 920px) { #lobby-card { grid-template-columns: 1fr; } }

    .lobby-header {
      display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;
      padding: 10px 12px; border-radius: 12px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
      border: 1px solid var(--border);
    }
    .lobby-profile { display: flex; align-items: center; gap: 10px; }
    .lobby-avatar-badge {
      width: 40px; height: 40px; border-radius: 10px; display: grid; place-items: center;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(239, 68, 68, 0.18));
      border: 1px solid rgba(245, 158, 11, 0.4); color: #fde68a; font-size: 1.25rem;
    }
    .lobby-actions { display: flex; gap: 6px; flex-wrap: wrap; }

    .section-box {
      background: rgba(6, 10, 18, 0.54); border: 1px solid var(--border);
      border-radius: 12px; padding: 13px;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }
    .section-title {
      font-size: 0.84rem; font-weight: 800; letter-spacing: 0.9px; color: #fde68a;
      margin-bottom: 10px; text-transform: uppercase;
      display: flex; justify-content: space-between; align-items: center; gap: 8px;
    }
    .section-title-label { display: inline-flex; align-items: center; gap: 7px; }

    .loadout-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
    @media (max-width: 560px) { .loadout-grid { grid-template-columns: 1fr; } }

    .weapon-select-card {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
      border: 1px solid var(--border); border-radius: 10px; padding: 10px;
      transition: border-color 0.18s;
    }
    .weapon-select-card:hover { border-color: rgba(245, 158, 11, 0.35); }
    .weapon-select-card label {
      font-size: 0.74rem; font-weight: 700; color: #cbd5e1;
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;
    }
    .slot-tag {
      font-size: 0.62rem; font-weight: 700; letter-spacing: 0.8px; color: var(--gold);
      background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.28);
      padding: 1px 6px; border-radius: 99px;
    }
    .weapon-select-card select {
      width: 100%; padding: 7px 9px; border-radius: 7px;
      background: rgba(8, 13, 24, 0.92); color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.18); font-size: 0.8rem; outline: none;
    }
    .weapon-select-card select:focus { border-color: var(--gold); }
    .weapon-stats {
      margin-top: 7px; padding-top: 6px; border-top: 1px dashed rgba(255, 255, 255, 0.1);
      font-size: 0.71rem; color: #cbd5e1; line-height: 1.4;
    }
    .weapon-stats b { color: #fde68a; }

    .loadout-icon-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 8px;
      max-height: 132px; overflow-y: auto; padding-right: 2px;
    }
    .icon-choice {
      min-height: 58px; border: 1px solid rgba(255, 255, 255, 0.11); border-radius: 9px;
      background: rgba(15, 23, 42, 0.78); color: #e2e8f0; cursor: pointer;
      padding: 6px 4px; font-size: 0.67rem; font-weight: 600; line-height: 1.15;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
      transition: all 0.15s ease; text-align: center;
    }
    .icon-choice:hover {
      border-color: rgba(255, 255, 255, 0.3); background: rgba(30, 41, 59, 0.92); transform: translateY(-1px);
    }
    .icon-choice .icon { display: flex; align-items: center; justify-content: center; height: 26px; font-size: 1.25rem; }
    .icon-choice .icon img.gx-icon { width: 25px; height: 25px; }
    .icon-choice span:last-child {
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; word-break: break-word;
    }
    .icon-choice.active {
      border-color: var(--gold);
      background: linear-gradient(180deg, rgba(245, 158, 11, 0.22), rgba(245, 158, 11, 0.08));
      color: #fef08a; box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.3), 0 6px 14px rgba(245, 158, 11, 0.15);
    }
    .icon-choice.active .icon img.gx-icon {
      filter: drop-shadow(0 0 6px rgba(251, 191, 36, 0.7)); transform: scale(1.08);
    }

    .room-list { max-height: 195px; overflow-y: auto; display: flex; flex-direction: column; gap: 7px; margin-bottom: 10px; padding-right: 2px; }
    .room-item {
      display: flex; justify-content: space-between; align-items: center; gap: 10px;
      padding: 10px 12px; border-radius: 10px;
      background: rgba(255, 255, 255, 0.045); border: 1px solid var(--border);
      transition: border-color 0.16s, background 0.16s;
    }
    .room-item:hover { background: rgba(255, 255, 255, 0.08); border-color: rgba(59, 130, 246, 0.4); }
    .room-item strong { font-size: 0.9rem; color: #f8fafc; }
    .room-item small { color: var(--muted); display: block; font-size: 0.74rem; margin-top: 2px; }

    #character-card { width: 540px; max-width: 94vw; }
    .character-options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0; }
    .character-options .form-group { margin: 0; }
    .character-actions { display: flex; gap: 10px; }
    .character-actions .btn { flex: 1; }

    /* Settings */
    #settings-overlay { z-index: 60; }
    .settings-card { width: 880px; max-height: 92vh; overflow-y: auto; }
    .settings-filter-bar {
      display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; padding: 4px;
      background: rgba(0, 0, 0, 0.42); border: 1px solid var(--border); border-radius: 10px;
    }
    .settings-tab-btn {
      flex: 1; min-width: 110px; padding: 7px 10px; border-radius: 7px; border: 1px solid transparent;
      background: transparent; color: var(--muted); font-size: 0.8rem; font-weight: 700; cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center; gap: 6px; transition: 0.15s;
    }
    .settings-tab-btn:hover { color: #fff; background: rgba(255, 255, 255, 0.05); }
    .settings-tab-btn.active {
      background: rgba(245, 158, 11, 0.2); color: #fde68a; border-color: rgba(245, 158, 11, 0.45);
    }
    .settings-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .settings-cols.single-col { grid-template-columns: 1fr; }
    @media (max-width: 760px) { .settings-cols { grid-template-columns: 1fr; } }
    .keybind-list { display: flex; flex-direction: column; gap: 6px; max-height: 390px; overflow-y: auto; padding-right: 4px; }
    .kb-row {
      display: flex; justify-content: space-between; align-items: center;
      background: rgba(255, 255, 255, 0.045); border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 7px 11px; border-radius: 8px; font-size: 0.8rem;
    }
    .kb-btn {
      padding: 5px 12px; min-width: 124px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.16);
      background: #0b1220; color: #fde68a; font-weight: 700; cursor: pointer; font-size: 0.76rem;
      transition: 0.15s;
    }
    .kb-btn:hover { border-color: var(--gold); }
    .kb-btn.listening { background: #dc2626; color: #fff; border-color: #fca5a5; animation: pulseRing 1s infinite; }
    @keyframes pulseRing { 0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.6); } 50% { box-shadow: 0 0 0 4px rgba(239,68,68,0); } }

    .gfx-list { max-height: 390px; overflow-y: auto; padding-right: 4px; }
    .gfx-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 7px 9px; margin-bottom: 5px; font-size: 0.81rem; gap: 10px;
      background: rgba(255, 255, 255, 0.035); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .gfx-row.ux-tab-hidden { display: none !important; }
    .gfx-row b { color: #fde68a; }
    .gfx-row input[type="range"] { width: 145px; accent-color: var(--gold); cursor: pointer; }
    .gfx-row select {
      width: 155px; padding: 6px 8px; border-radius: 7px; background: #0b1220;
      color: #fff; border: 1px solid rgba(255, 255, 255, 0.18); font-size: 0.78rem;
    }
    /* Modern Toggle Switch styling on native checkbox (preserves .checked & onchange) */
    .gfx-row input[type="checkbox"] {
      appearance: none; -webkit-appearance: none; position: relative;
      width: 42px; height: 22px; border-radius: 999px; flex-shrink: 0;
      background: rgba(148, 163, 184, 0.25); border: 1px solid rgba(255, 255, 255, 0.2);
      cursor: pointer; transition: background 0.18s, border-color 0.18s;
    }
    .gfx-row input[type="checkbox"]::after {
      content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px;
      border-radius: 50%; background: #e2e8f0; transition: transform 0.18s ease, background 0.18s;
    }
    .gfx-row input[type="checkbox"]:checked {
      background: rgba(16, 185, 129, 0.85); border-color: #6ee7b7;
    }
    .gfx-row input[type="checkbox"]:checked::after { transform: translateX(20px); background: #fff; }

    /* Gunsmith / Attachment Shop */
    #attachment-overlay { z-index: 65; }
    .attachment-card { width: 700px; max-width: 95vw; max-height: 94vh; overflow-y: auto; }
    .coin-pill {
      display: inline-flex; align-items: center; gap: 7px; padding: 6px 12px; border-radius: 999px;
      background: rgba(245, 158, 11, 0.14); border: 1px solid rgba(245, 158, 11, 0.35);
      color: #fde68a; font-size: 0.82rem; font-weight: 700; margin-bottom: 12px;
    }
    .attachment-icon-strip {
      display: flex; gap: 7px; margin: 4px 0 12px; overflow-x: auto; padding: 4px 2px 6px;
    }
    .attachment-icon {
      min-width: 56px; height: 56px; padding: 5px 6px; flex: 0 0 auto;
      border: 1px solid var(--border); border-radius: 10px;
      background: rgba(15, 23, 42, 0.85); color: #cbd5e1; font-size: 0.65rem; font-weight: 700;
      cursor: pointer; position: relative;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
      transition: all 0.15s ease;
    }
    .attachment-icon:hover { border-color: var(--gold); color: #fde68a; transform: translateY(-1px); }
    .attachment-icon.active { border-color: var(--gold); color: #fde68a; background: rgba(245, 158, 11, 0.18); }
    .attachment-icon .att-lbl { font-size: 0.62rem; color: #94a3b8; white-space: nowrap; }
    .attachment-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: left; }
    @media (max-width: 560px) { .attachment-grid { grid-template-columns: 1fr; } }
    .attachment-grid .form-group { margin: 0; }
    .attachment-grid select {
      width: 100%; padding: 8px 10px; border-radius: 8px; background: #0b1220; color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.16);
    }
    .attachment-summary-box {
      margin-top: 12px; padding: 10px 12px; border-radius: 10px;
      background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.25);
      color: #cbd5e1; font-size: 0.8rem; line-height: 1.45;
    }

    /* Results */
    #results-overlay { z-index: 70; }
    .results-card { width: 920px; max-width: 96vw; max-height: 94vh; display: flex; flex-direction: column; text-align: center; }
    .results-overlay { pointer-events: auto; }
    .res-cols { display: flex; gap: 12px; margin: 12px 0; min-height: 0; flex: 1 1 auto; }
    .res-col { flex: 1; min-width: 0; display: flex; flex-direction: column; border-radius: 12px; padding: 10px; }
    .res-col h3 { margin-bottom: 6px; font-size: 1rem; }
    .res-col.red { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.55); }
    .res-col.red h3 { color: #f87171; }
    .res-col.blue { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.55); }
    .res-col.blue h3 { color: #60a5fa; }
    .res-scroll { overflow-y: auto; min-height: 0; max-height: 48vh; }
    .res-col td:first-child, .res-col th:first-child { text-align: left; }
    .res-actions { flex: 0 0 auto; position: relative; z-index: 2; }
    @media (max-width: 700px) { .res-cols { flex-direction: column; overflow-y: auto; } .res-scroll { max-height: 22vh; } }
    .results-card table { width: 100%; margin: 8px 0 12px; border-collapse: collapse; font-size: 0.84rem; }
    .results-card th { color: var(--muted); font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .results-card th, .results-card td { padding: 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }

    /* ================= IN-GAME HUD ================= */
    #hud { position: fixed; inset: 0; pointer-events: none; z-index: 20; }

    .hud-minimap {
      position: absolute; top: 14px; left: 14px; width: 170px; height: 170px;
      border-radius: 14px; border: 1.5px solid rgba(255, 255, 255, 0.22);
      background: radial-gradient(circle at center, rgba(16, 24, 39, 0.88), rgba(7, 10, 18, 0.94));
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.65), inset 0 0 18px rgba(6, 182, 212, 0.12);
      overflow: hidden;
    }
    .hud-minimap::after {
      content: 'N';
      position: absolute; top: 4px; left: 50%; transform: translateX(-50%);
      font-size: 0.62rem; font-weight: 800; color: rgba(253, 224, 71, 0.85);
      background: rgba(6, 10, 18, 0.75); padding: 0 5px; border-radius: 4px;
      pointer-events: none;
    }
    #minimap-canvas { width: 170px; height: 170px; display: block; }

    #fps-counter {
      position: absolute; top: 14px; left: 194px;
      background: rgba(8, 12, 20, 0.82); backdrop-filter: blur(8px);
      padding: 5px 11px; border-radius: 8px; border: 1px solid var(--border);
      font-size: 0.74rem; font-weight: 700; color: #34d399;
      display: inline-flex; align-items: center; gap: 6px;
      max-width: calc(100vw - 220px); flex-wrap: wrap;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
    }

    .hud-top-center { position: absolute; top: 12px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .score-pill {
      display: flex; align-items: center; gap: 14px;
      background: rgba(9, 13, 22, 0.86); backdrop-filter: blur(10px);
      padding: 6px 20px; border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.55);
    }
    .score-box { font-size: 1.4rem; font-weight: 800; min-width: 42px; text-align: center; position: relative; }
    .score-red { color: #f87171; text-shadow: 0 0 14px rgba(239, 68, 68, 0.45); }
    .score-blue { color: #60a5fa; text-shadow: 0 0 14px rgba(59, 130, 246, 0.45); }
    .match-timer {
      font-size: 1.08rem; font-weight: 700; color: #f8fafc; padding: 0 12px;
      border-left: 1px solid var(--border); border-right: 1px solid var(--border); letter-spacing: 1px;
    }
    #hud-alive-bar {
      font-size: 0.74rem; font-weight: 700; background: rgba(9, 13, 22, 0.82); backdrop-filter: blur(8px);
      padding: 4px 12px; border-radius: 999px; border: 1px solid var(--border); color: #e2e8f0;
    }

    .hud-killfeed { position: absolute; top: 14px; right: 14px; display: flex; flex-direction: column; gap: 6px; align-items: flex-end; width: 390px; }
    .kf-item {
      background: linear-gradient(90deg, rgba(12, 17, 29, 0.78), rgba(10, 14, 24, 0.92));
      backdrop-filter: blur(8px);
      padding: 6px 12px; border-radius: 8px; font-size: 0.78rem;
      border: 1px solid rgba(255, 255, 255, 0.08); border-right: 3px solid var(--gold);
      display: flex; align-items: center; gap: 6px;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.45);
      animation: kfSlideIn 0.18s ease-out;
    }
    @keyframes kfSlideIn { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }

    .hud-bottom-left {
      position: absolute; bottom: 18px; left: 18px; min-width: 286px;
      background: linear-gradient(155deg, rgba(12, 18, 30, 0.88), rgba(7, 10, 18, 0.92));
      backdrop-filter: blur(12px);
      border: 1px solid var(--border); border-left: 3px solid var(--cyan);
      padding: 12px 15px; border-radius: 12px;
      box-shadow: 0 12px 34px rgba(0, 0, 0, 0.6);
    }
    .hp-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .hud-armor-row {
      display: flex; justify-content: space-between; align-items: center;
      font-size: 0.74rem; font-weight: 700; color: #7dd3fc; margin-bottom: 3px;
    }
    .hud-headarmor-row {
      display: flex; justify-content: space-between; align-items: center;
      font-size: 0.72rem; font-weight: 700; color: #c4b5fd; margin-bottom: 3px;
    }
    .hud-label-with-icon { display: inline-flex; align-items: center; gap: 5px; }
    .hp-val { font-size: 1.5rem; font-weight: 800; color: #fff; }
    .bar-bg { width: 100%; height: 7px; background: rgba(255, 255, 255, 0.1); border-radius: 99px; overflow: hidden; margin-bottom: 6px; }
    .hp-bar-fill { height: 100%; background: linear-gradient(90deg, #ef4444, #f59e0b 45%, #10b981); width: 100%; transition: width 0.14s ease; border-radius: 99px; }
    .armor-bar-fill { height: 100%; background: linear-gradient(90deg, #0284c7, #38bdf8); width: 0%; transition: width 0.14s ease; border-radius: 99px; }

    .body-hp-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin: 7px 0; }
    .body-hp-item {
      display: grid; grid-template-columns: 24px 1fr; align-items: center; gap: 6px;
      font-size: 0.64rem; color: #cbd5e1;
      background: rgba(255, 255, 255, 0.035); border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 4px 6px; border-radius: 7px;
    }
    .body-hp-icon {
      width: 24px; height: 24px; display: grid; place-items: center;
      border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 7px;
      background: rgba(15, 23, 42, 0.85); font-size: 12px;
    }
    .body-hp-item .bar-bg { height: 4px; margin: 2px 0; }
    .body-hp-item.dead { color: #fca5a5; border-color: rgba(239, 68, 68, 0.45); background: rgba(127, 29, 29, 0.28); }
    .body-hp-item.dead .body-hp-icon { border-color: #ef4444; background: rgba(153, 27, 27, 0.8); }
    .hud-meta-line { font-size: 0.7rem; color: var(--muted); margin-top: 2px; }

    .hud-bottom-right {
      position: absolute; bottom: 18px; right: 18px; min-width: 280px;
      background: linear-gradient(205deg, rgba(12, 18, 30, 0.88), rgba(7, 10, 18, 0.92));
      backdrop-filter: blur(12px);
      border: 1px solid var(--border); border-right: 3px solid var(--gold);
      padding: 12px 18px; border-radius: 12px; text-align: right;
      box-shadow: 0 12px 34px rgba(0, 0, 0, 0.6);
    }
    .weapon-name-hud { font-size: 1.05rem; font-weight: 800; color: #fde68a; letter-spacing: 0.4px; }
    .hud-coins-row {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 0.74rem; color: #fde68a; margin-top: 2px;
      padding: 2px 8px; border-radius: 99px; background: rgba(245, 158, 11, 0.12);
    }
    .ammo-hud { font-size: 2rem; font-weight: 800; letter-spacing: 1px; line-height: 1.1; margin-top: 4px; }
    .ammo-hud span { font-size: 0.88rem; color: var(--muted); font-weight: 600; }
    .slot-strip { display: flex; gap: 6px; justify-content: flex-end; margin-top: 8px; }
    .slot-pill {
      font-size: 0.7rem; font-weight: 700; padding: 4px 8px; border-radius: 6px;
      background: rgba(255, 255, 255, 0.06); color: var(--muted); border: 1px solid rgba(255, 255, 255, 0.08);
      transition: 0.15s;
    }
    .slot-pill.active {
      background: rgba(245, 158, 11, 0.22); color: #fef08a; border-color: var(--gold);
      box-shadow: 0 0 12px rgba(245, 158, 11, 0.25);
    }

    #respawn-control {
      position: absolute; left: 50%; bottom: 12%; transform: translateX(-50%);
      pointer-events: auto; min-width: 250px; z-index: 40; font-size: 1rem; padding: 12px 22px;
      border-radius: 12px;
    }

    /* Crosshair & feedback */
    #crosshair { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); pointer-events: none; z-index: 25; }
    .ch-line { position: absolute; background: rgba(34, 255, 148, 0.94); box-shadow: 0 0 4px rgba(0, 0, 0, 0.95); border-radius: 1px; }
    .ch-top { width: 2px; height: 10px; left: -1px; bottom: 6px; }
    .ch-bot { width: 2px; height: 10px; left: -1px; top: 6px; }
    .ch-left { height: 2px; width: 10px; top: -1px; right: 6px; }
    .ch-right { height: 2px; width: 10px; top: -1px; left: 6px; }
    .ch-dot { width: 3px; height: 3px; border-radius: 50%; background: #fff; position: absolute; left: -1.5px; top: -1.5px; box-shadow: 0 0 3px #000; }
    #crosshair.aim-dot .ch-line { display: none; }
    #crosshair.aim-dot .ch-dot { width: 5px; height: 5px; left: -2.5px; top: -2.5px; background: #ff3030; box-shadow: 0 0 7px #ff3030; }

    #hitmarker { position: fixed; top: 50%; left: 50%; width: 28px; height: 28px; transform: translate(-50%,-50%) scale(0.85); pointer-events: none; z-index: 26; opacity: 0; transition: opacity 0.08s, transform 0.08s; }
    #hitmarker.show { opacity: 1; transform: translate(-50%,-50%) scale(1); }
    #hitmarker::before, #hitmarker::after { content: ''; position: absolute; left: 50%; top: 50%; width: 24px; height: 2.5px; background: #fff; border-radius: 2px; box-shadow: 0 0 4px rgba(0,0,0,0.8); }
    #hitmarker.head::before, #hitmarker.head::after { background: #ef4444; height: 3.5px; box-shadow: 0 0 8px rgba(239,68,68,0.8); }
    #hitmarker::before { transform: translate(-50%,-50%) rotate(45deg); }
    #hitmarker::after { transform: translate(-50%,-50%) rotate(-45deg); }

    #kill-confirm-popup { position: fixed; top: 62%; left: 50%; transform: translate(-50%, 6px); z-index: 29; pointer-events: none; text-align: center; opacity: 0; transition: opacity 0.16s, transform 0.22s ease-out; }
    #kill-confirm-popup.show { opacity: 1; transform: translate(-50%, -8px); }
    .kc-badge {
      display: inline-flex; align-items: center; gap: 8px; padding: 7px 18px; border-radius: 999px;
      background: linear-gradient(135deg, rgba(153, 27, 27, 0.94), rgba(88, 13, 13, 0.95));
      border: 1px solid rgba(252, 165, 165, 0.7); color: #fff; font-weight: 800; font-size: 0.95rem;
      box-shadow: 0 8px 26px rgba(239, 68, 68, 0.5);
    }

    /* Scope */
    #scope-overlay { position: fixed; inset: 0; z-index: 22; pointer-events: none; background: radial-gradient(circle at center, transparent 36%, rgba(0, 0, 0, 0.97) 38%); }
    #scope-overlay::before { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 1.5px; background: rgba(0, 0, 0, 0.9); }
    #scope-overlay::after { content: ''; position: absolute; top: 0; bottom: 0; left: 50%; width: 1.5px; background: rgba(0, 0, 0, 0.9); }
    #scope-overlay.thermal-scope { background: radial-gradient(circle at center, transparent 36%, rgba(3, 8, 18, 0.98) 38%); }
    #scope-overlay.thermal-scope::before, #scope-overlay.thermal-scope::after { background: rgba(251, 191, 36, 0.8); }
    #scope-overlay.thermal-scope .scope-dot { background: #fde047; box-shadow: 0 0 7px #f97316; }
    #scope-thermal-targets { position: absolute; inset: 0; overflow: hidden; }
    .thermal-signature { position: absolute; border: 2px solid #fde047; border-radius: 45% 45% 18% 18%; box-shadow: 0 0 8px #f97316, inset 0 0 8px rgba(249, 115, 22, 0.75); }
    .thermal-signature::before { content: ''; position: absolute; left: 50%; top: -24%; width: 38%; aspect-ratio: 1; transform: translateX(-50%); border: 2px solid currentColor; border-radius: 50%; background: rgba(253, 224, 71, 0.55); box-shadow: 0 0 8px #f97316; }
    .thermal-signature.friendly { color: #67e8f9; border-color: #67e8f9; box-shadow: 0 0 8px #0891b2, inset 0 0 8px rgba(34, 211, 238, 0.65); }
    .thermal-signature.friendly::before { background: rgba(103, 232, 249, 0.5); box-shadow: 0 0 8px #0891b2; }
    .scope-dot { position: absolute; top: 50%; left: 50%; width: 6px; height: 6px; background: #ef4444; border-radius: 50%; transform: translate(-50%,-50%); }
    #scope-zoom-label { position: absolute; top: 58%; left: 54%; font-size: 0.95rem; font-weight: 800; color: #38bdf8; text-shadow: 0 0 6px #000; }
    #scope-zoom-help { display: none; position: absolute; top: calc(58% + 17px); left: 54%; color: #cbd5e1; font: 700 10px/1.2 monospace; text-shadow: 0 1px 4px #000; white-space: nowrap; }
    #scope-overlay.zoom-adjustable #scope-zoom-help { display: block; }
    #scope-range-reticle { display: none; position: absolute; inset: 24% 43% 22%; border-left: 1px solid rgba(255, 255, 255, 0.82); }
    #scope-overlay.rangefinder #scope-range-reticle { display: block; }
    .range-mark { position: absolute; left: -6px; width: 12px; height: 1px; background: rgba(255, 255, 255, 0.9); }
    .range-mark span { position: absolute; left: 10px; top: -7px; color: #fff; font: 700 10px/1 monospace; text-shadow: 0 1px 3px #000; white-space: nowrap; }
    .range-mark:nth-child(1) { top: 38%; width: 10px; left: -5px; }
    .range-mark:nth-child(2) { top: 52%; }
    .range-mark:nth-child(3) { top: 66%; }
    #scope-range-readout { display: none; position: absolute; top: 66%; left: 54%; color: #fde68a; font: 800 13px/1.2 monospace; text-shadow: 0 1px 4px #000; }
    #scope-overlay.rangefinder #scope-range-readout { display: block; }
    #scope-smart-readout { display: none; position: absolute; top: calc(58% + 24px); left: 54%; color: #67e8f9; font: 800 12px/1.25 monospace; text-shadow: 0 1px 4px #000; white-space: nowrap; }
    #scope-overlay.smart-scope #scope-smart-readout { display: block; }
    #scope-overlay.smart-scope.zoom-adjustable #scope-smart-readout { top: calc(58% + 31px); }
    #scope-overlay.smart-scope #scope-range-readout { display: block; }
    #scope-smart-marker { display: none; position: absolute; left: 50%; top: 50%; width: 20px; height: 20px; transform: translate(-50%,-50%); border: 1px solid #67e8f9; border-radius: 50%; box-shadow: 0 0 7px #0891b2; }
    #scope-smart-marker::before, #scope-smart-marker::after { content: ''; position: absolute; left: 50%; top: 50%; background: #67e8f9; transform: translate(-50%,-50%); }
    #scope-smart-marker::before { width: 28px; height: 1px; }
    #scope-smart-marker::after { width: 1px; height: 28px; }
    #scope-overlay.smart-scope #scope-smart-marker { display: block; }
    #scope-smart-marker span { position: absolute; left: 50%; top: 24px; transform: translateX(-50%); color: #67e8f9; font: 800 10px/1 monospace; white-space: nowrap; text-shadow: 0 1px 4px #000; }
    #scope-smart-marker.aligned { border-color: #22c55e; box-shadow: 0 0 12px #22c55e; width: 24px; height: 24px; }
    #scope-smart-marker.aligned::before, #scope-smart-marker.aligned::after { background: #22c55e; }
    #scope-smart-marker.aligned span { color: #4ade80; }

    #damage-vignette { position: fixed; inset: 0; pointer-events: none; z-index: 24; box-shadow: inset 0 0 90px rgba(239, 68, 68, 0); transition: box-shadow 0.15s; }
    #lowhp-vignette { position: fixed; inset: 0; pointer-events: none; z-index: 23; background: radial-gradient(circle at center, transparent 52%, rgba(160, 10, 10, 0.72) 100%); opacity: 0; transition: opacity 0.2s; }
    #death-fade { position: fixed; inset: 0; pointer-events: none; z-index: 33; background: #000; opacity: 0; }
    #flash-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 35; background: #fff; opacity: 0; }
    #center-banner { position: fixed; top: 20%; left: 50%; transform: translateX(-50%); z-index: 38; pointer-events: none; text-align: center; font-size: 1.6rem; font-weight: 800; text-shadow: 0 4px 18px rgba(0, 0, 0, 0.95); opacity: 0; transition: opacity 0.25s; }
    #center-banner.show { opacity: 1; }
    #pickup-toast {
      position: fixed; bottom: 138px; left: 50%; transform: translateX(-50%); z-index: 28; pointer-events: none;
      background: rgba(9, 14, 26, 0.9); backdrop-filter: blur(8px);
      border: 1px solid rgba(6, 182, 212, 0.55); color: #a5f3fc;
      padding: 7px 16px; border-radius: 999px; font-size: 0.84rem; font-weight: 700;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55); opacity: 0; transition: opacity 0.2s;
    }
    #pickup-toast.show { opacity: 1; }
    #reload-bar-wrap {
      position: fixed; top: 58%; left: 50%; transform: translateX(-50%);
      width: 170px; height: 8px; background: rgba(6, 10, 18, 0.82);
      border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 99px; overflow: hidden; z-index: 26; display: none;
    }
    #reload-bar-fill {
      width: 0%; height: 100%; border-radius: 99px;
      background: linear-gradient(90deg, #f59e0b, #fde047);
      box-shadow: 0 0 10px rgba(245, 158, 11, 0.7);
    }

    #scoreboard {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 40;
      width: 740px; max-width: 94vw; max-height: 82vh; overflow-y: auto;
      background: rgba(9, 13, 22, 0.95); backdrop-filter: blur(12px);
      border: 1px solid var(--border-strong); border-radius: 14px; padding: 20px; pointer-events: none;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.85);
    }
    .sb-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .sb-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
    .sb-table th { text-align: left; padding: 6px; border-bottom: 1px solid var(--border); color: var(--muted); font-size: 0.74rem; }
    .sb-table td { padding: 6px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }

    .modal-overlay {
      position: fixed; inset: 0; z-index: 45;
      background: rgba(5, 8, 15, 0.78); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center; padding: 14px;
    }

    .chip { display: inline-block; margin: 3px; padding: 7px 11px; background: #1e293b; border: 1px solid #475569; border-radius: 6px; cursor: grab; font-size: .85rem; user-select: none; }
    @keyframes dmgup { from { opacity: 1; transform: translate(-50%, 0); } to { opacity: 0; transform: translate(-50%, -48px); } }
    .dmgn { position: fixed; z-index: 30; pointer-events: none; font-weight: 800; font-size: 1.1rem; color: #fff; text-shadow: 0 0 5px #000, 0 0 2px #000; animation: dmgup .8s ease-out forwards; }
    .dmgn.hs { color: #fbbf24; font-size: 1.4rem; }
    #vig { position: fixed; inset: 0; pointer-events: none; z-index: 5; background: radial-gradient(ellipse at center, transparent 58%, rgba(0, 0, 0, .42) 100%); }

    /* ================= MOBILE TOUCH CONTROLS ================= */
    #touch { position: fixed; inset: 0; z-index: 40; display: none; pointer-events: none; touch-action: none; -webkit-touch-callout: none; -webkit-tap-highlight-color: transparent; }
    #touch.on { display: block; }
    #touch > * { pointer-events: auto; position: absolute; touch-action: none; user-select: none; -webkit-user-select: none; }
    #joyzone { left: 0; top: 30%; width: 42%; height: 70%; }
    #touch > #joy {
      pointer-events: none; width: 124px; height: 124px; border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.04), rgba(15, 23, 42, 0.25));
      border: 2px solid rgba(255, 255, 255, 0.25); opacity: .65;
      box-shadow: inset 0 0 18px rgba(0, 0, 0, 0.35);
    }
    #joy.on { opacity: 1; border-color: rgba(245, 158, 11, 0.55); }
    #joyk {
      position: absolute; left: 36px; top: 36px; width: 52px; height: 52px; border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.82), rgba(203, 213, 225, 0.45));
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    }
    .tb {
      border-radius: 50%;
      background: rgba(11, 16, 27, 0.58);
      backdrop-filter: blur(6px);
      border: 1.5px solid rgba(255, 255, 255, 0.32);
      color: #f8fafc; font-size: .72rem; font-weight: 700; line-height: 1.1; text-align: center;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
      opacity: .86; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.45);
      transition: transform .06s, background .06s, border-color .06s;
    }
    .tb.dn { background: rgba(245, 158, 11, 0.6); border-color: #fbbf24; opacity: 1; transform: scale(.93); }
    .tb small { font-size: .5rem; font-weight: 600; opacity: .88; }
    .tb .ri { font-size: 1rem; }
    .tb .gx-icon { width: 20px; height: 20px; }

    #t-fire, #t-fire-left {
      width: 68px; height: 68px; font-size: .84rem;
      border-color: rgba(248, 113, 113, 0.85);
      background: radial-gradient(circle, rgba(185, 28, 28, 0.65), rgba(127, 29, 29, 0.55));
      box-shadow: 0 0 18px rgba(239, 68, 68, 0.35);
    }
    #t-fire { right: calc(var(--sr) + 119px); bottom: calc(var(--sb) + 81px); }
    #t-fire-left { left: calc(var(--sl) + 18px); top: calc(50% - 34px); }
    #t-cancel-aim { right: calc(var(--sr) + 32px); bottom: calc(var(--sb) + 202px); width: 54px; height: 48px; font-size: .62rem; border-color: rgba(248, 113, 113, .85); background: rgba(127, 29, 29, .78); }
    #t-jump { right: calc(var(--sr) + 34px); bottom: calc(var(--sb) + 124px); width: 58px; height: 58px; }
    #t-aim { right: calc(var(--sr) + 120px); bottom: calc(var(--sb) + 158px); width: 52px; height: 52px; }
    #t-reload { right: calc(var(--sr) + 196px); bottom: calc(var(--sb) + 30px); width: 48px; height: 48px; font-size: .6rem; }
    #t-swap { right: calc(var(--sr) + 196px); bottom: calc(var(--sb) + 84px); width: 48px; height: 48px; font-size: .6rem; }
    #t-split { right: calc(var(--sr) + 250px); bottom: calc(var(--sb) + 30px); width: 48px; height: 48px; font-size: .6rem; }
    #t-pickup { right: calc(var(--sr) + 250px); bottom: calc(var(--sb) + 84px); width: 48px; height: 48px; font-size: .6rem; }
    #tstance { right: calc(var(--sr) + 24px); bottom: calc(var(--sb) + 24px); display: flex; gap: 8px; }
    #tstance .tb { width: 48px; height: 48px; font-size: .6rem; position: static; }
    #touch.layout-editing .tb { outline: 2px dashed #fbbf24; outline-offset: 2px; }
    #touch.layout-editing::after {
      content: 'ลากปุ่มเพื่อจัดตำแหน่ง • เปิดเมนูเพื่อเสร็จ';
      position: fixed; left: 50%; top: calc(var(--st) + 8px); transform: translateX(-50%);
      padding: 6px 12px; border-radius: 999px; background: rgba(8, 12, 20, .92);
      border: 1px solid rgba(251, 191, 36, .45); font-size: .72rem; white-space: nowrap; pointer-events: none;
    }
    #t-menu { top: calc(var(--st) + 8px); right: calc(var(--sr) + 10px); width: 42px; height: 42px; border-radius: 12px; font-size: 1.15rem; }
    #t-view { top: calc(var(--st) + 8px); right: calc(var(--sr) + 60px); width: 52px; height: 42px; border-radius: 12px; font-size: .62rem; }
    #touch.controls-hidden { display: none !important; }
    #tmenu {
      top: calc(var(--st) + 56px); right: calc(var(--sr) + 10px);
      display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 10px;
      background: rgba(9, 13, 22, .94); backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, .18); border-radius: 14px; z-index: 2;
      box-shadow: 0 16px 40px rgba(0, 0, 0, .75);
    }
    #tmenu .mi { position: static; width: 124px; height: 46px; border-radius: 10px; font-size: .76rem; opacity: 1; background: rgba(30, 41, 59, .88); flex-direction: row; gap: 6px; padding: 0 8px; }
    #tchips { top: calc(var(--st) + 98px); right: calc(var(--sr) + 10px); display: flex; gap: 6px; }
    #tchips .chip { position: static; width: 42px; height: 42px; border-radius: 10px; font-size: .85rem; }
    #tchips .chip.act { border-color: #fbbf24; background: rgba(180, 83, 9, .65); opacity: 1; }
    #tlean { left: calc(var(--sl) + 30px); bottom: calc(var(--sb) + 176px); display: flex; gap: 12px; }
    #tlean .tb { position: static; width: 52px; height: 52px; font-size: .95rem; }
    .tb.lat { border-color: #38bdf8; background: rgba(14, 116, 144, .7); opacity: 1; }
    #tzoom { right: calc(var(--sr) + 196px); bottom: calc(var(--sb) + 90px); display: flex; flex-direction: column; gap: 8px; }
    #tzoom .tb { position: static; width: 46px; height: 46px; font-size: .86rem; }

    /* Mobile HUD compact layout */
    body.mob { -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
    body.mob #fps-counter { display: none !important; }
    body.mob .hud-minimap { top: calc(var(--st) + 6px); left: calc(var(--sl) + 8px); width: 104px; height: 104px; border-width: 1px; border-radius: 10px; opacity: .9; }
    body.mob #minimap-canvas { width: 104px; height: 104px; }
    body.mob .hud-top-center { top: calc(var(--st) + 4px); transform: translateX(-50%) scale(.76); transform-origin: top center; }
    body.mob .hud-killfeed { top: calc(var(--st) + 66px); left: calc(var(--sl) + 118px); right: auto; width: 185px; max-height: 54px; overflow: hidden; align-items: flex-start; font-size: .66rem; opacity: .94; }
    body.mob .hud-bottom-left {
      top: calc(var(--st) + 6px); left: calc(var(--sl) + 118px); bottom: auto; right: auto; transform: none;
      min-width: 0; width: 112px; padding: 5px 8px; border-radius: 8px;
      background: rgba(9, 13, 22, .68); border: 1px solid rgba(255, 255, 255, 0.14); border-left: 2px solid var(--cyan);
    }
    body.mob #hud-team-badge, body.mob #hud-stance, body.mob #hud-injuries, body.mob .body-hp-strip,
    body.mob .hud-armor-row span:first-child, body.mob .hud-headarmor-row span:first-child { display: none; }
    body.mob .hud-bottom-left .hp-row { display: none; }
    body.mob .hud-armor-row, body.mob .hud-headarmor-row { font-size: .66rem; margin-bottom: 2px; justify-content: flex-start; gap: 4px; }
    body.mob #hud-armor::before { content: 'เกราะ '; font-size: .6rem; opacity: .8; }
    body.mob #hud-headarmor::before { content: 'หมวก '; font-size: .6rem; opacity: .8; }
    body.mob .hud-bottom-left .bar-bg { height: 4px !important; margin: 0 0 3px !important; }
    body.mob .hud-bottom-right {
      top: calc(var(--st) + 56px); bottom: auto; right: calc(var(--sr) + 10px);
      min-width: 0; padding: 4px 10px; display: flex; gap: 8px; align-items: baseline; border-radius: 8px;
    }
    body.mob .hud-coins-row { display: none; }
    body.mob .weapon-name-hud { font-size: .76rem; }
    body.mob .ammo-hud { font-size: 1.15rem; margin-top: 0; }
    body.mob .ammo-hud span { font-size: .65rem; }
    body.mob .slot-strip { display: none !important; }
    body.mob .modal-overlay > * { max-height: 94dvh; overflow: auto; }
`;

const UX_UI_MARKUP = String.raw`
  <canvas id="game-canvas"></canvas>

  <div id="auth-screen" class="screen">
    <div class="card" style="width: 420px;">
      <div class="brand">
        <div class="brand-badge"><i class="ri-crosshair-2-line"></i> TACTICAL COMBAT SIMULATOR</div>
        <h1>3D STRIKE</h1>
        <p>Abandoned City • Physics Ragdoll • Tactical AI</p>
      </div>
      <div class="tabs">
        <button class="tab-btn active" id="tab-login"><i class="ri-login-circle-line"></i> เข้าสู่ระบบ</button>
        <button class="tab-btn" id="tab-reg"><i class="ri-user-add-line"></i> สมัครบัญชีใหม่</button>
      </div>
      <form id="auth-form">
        <div class="form-group">
          <label><i class="ri-user-3-line"></i> ชื่อผู้ใช้ (Username)</label>
          <input type="text" id="auth-username" placeholder="เช่น SniperTH01" required minlength="3" maxlength="16" autocomplete="username" />
        </div>
        <div class="form-group">
          <label><i class="ri-lock-password-line"></i> รหัสผ่าน (Password อย่างน้อย 6 ตัวอักษร)</label>
          <input type="password" id="auth-password" placeholder="••••••" required minlength="6" autocomplete="current-password" />
        </div>
        <button type="submit" class="btn btn-primary" id="auth-submit-btn">เข้าสู่ระบบ</button>
      </form>
      <div id="auth-msg" class="msg-error"></div>
      <div style="margin-top: 14px; border-top: 1px solid var(--border); padding-top: 14px;">
        <button class="btn btn-ghost" id="btn-offline-guest"><i class="ri-play-circle-line"></i> เล่นโหมดออฟไลน์ทันที (ไม่ต้องล็อกอิน)</button>
      </div>
    </div>
  </div>

  <div id="lobby-screen" class="screen hidden">
    <div class="card" id="lobby-card">
      <div style="display:flex; flex-direction:column; gap:12px;">
        <div class="lobby-header">
          <div class="lobby-profile">
            <div class="lobby-avatar-badge"><i class="ri-shield-star-line"></i></div>
            <div>
              <h2 style="font-size:1.15rem; color:#fde68a;" id="lobby-user-label">Soldier</h2>
              <small style="color:var(--muted);" id="lobby-stats-label">Kills: 0 | Deaths: 0</small>
            </div>
          </div>
          <div class="lobby-actions">
            <button class="btn btn-ghost" style="width:auto; padding:7px 12px; font-size:0.8rem;" id="btn-open-character"><i class="ri-user-smile-line"></i> ตัวละคร</button>
            <button class="btn btn-ghost" style="width:auto; padding:7px 12px; font-size:0.8rem;" id="btn-open-settings-lobby"><i class="ri-settings-3-line"></i> ตั้งค่า</button>
            <button class="btn btn-ghost" style="width:auto; padding:7px 12px; font-size:0.8rem; color:#fca5a5;" id="btn-logout"><i class="ri-logout-box-r-line"></i> ออก</button>
          </div>
        </div>

        <div class="section-box">
          <div class="section-title">
            <span class="section-title-label">${gameIconImg('ak47', 'Loadout', 'gx-icon gx-icon-sm')} คลังอาวุธเริ่มต้น (Loadout)</span>
          </div>
          <div class="loadout-grid">
            <div class="weapon-select-card">
              <label><span>1. ปืนหลัก</span><span class="slot-tag">PRIMARY</span></label>
              <select id="sel-primary"></select>
              <div class="loadout-icon-grid" id="icons-primary"></div>
              <div class="weapon-stats" id="stat-primary"></div>
            </div>
            <div class="weapon-select-card">
              <label><span>2. อาวุธรอง</span><span class="slot-tag">SIDEARM</span></label>
              <select id="sel-secondary"></select>
              <div class="loadout-icon-grid" id="icons-secondary"></div>
              <div class="weapon-stats" id="stat-secondary"></div>
            </div>
            <div class="weapon-select-card">
              <label><span>3. อาวุธประชิด</span><span class="slot-tag">MELEE</span></label>
              <select id="sel-melee"></select>
              <div class="loadout-icon-grid" id="icons-melee"></div>
              <div class="weapon-stats" id="stat-melee"></div>
            </div>
            <div class="weapon-select-card">
              <label><span>4. ระเบิดยุทธวิธี</span><span class="slot-tag">TACTICAL</span></label>
              <select id="sel-grenade"></select>
              <div class="loadout-icon-grid" id="icons-grenade"></div>
              <div class="weapon-stats" id="stat-grenade"></div>
            </div>
          </div>
          <button class="btn btn-ghost" style="width:100%; margin-top:10px; border-color:rgba(245,158,11,0.35); color:#fde68a;" id="btn-open-attachments-lobby">
            <i class="ri-tools-line"></i> ร้านค้าปรับแต่งอาวุธ (B / Coins)
          </button>
        </div>

        <div class="section-box">
          <div class="section-title">
            <span class="section-title-label"><i class="ri-robot-2-line"></i> โหมดออฟไลน์ (Offline AI)</span>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:9px; margin-bottom:10px;">
            <div class="form-group" style="margin:0;"><label>รูปแบบเกม</label><select id="offline-gamemode"><option value="tdm">Team Deathmatch (เกิดใหม่ตลอด)</option><option value="permadeath">Permadeath (สิงร่างบอทที่รอด / ศพไม่หาย)</option><option value="deathmatch">Deathmatch 1v49 • 50 คน • 12 นาที</option><option value="battle_royale">Battle Royale • 100 คน • วงพายุ + ยานพาหนะ</option></select></div>
            <div class="form-group" style="margin:0;"><label>ความยากบอท</label><select id="offline-diff"><option value="dumb">เอ๋อ (Dumb)</option><option value="easy">ง่าย (Easy)</option><option value="normal">ปกติ (Normal)</option><option value="hard" selected>ยาก (Hard)</option><option value="pro">เท่าผู้เล่น (Pro)</option></select></div>
            <div class="form-group" style="margin:0;"><label>ระบบเลือด</label><select id="offline-health-mode"><option value="bodyparts">บาดเจ็บตามส่วนต่าง ๆ ของร่างกาย</option><option value="single">HP 100% หลอดเดียว</option></select></div>
            <div class="form-group" style="margin:0;"><label>จำนวนผู้เล่น</label><select id="offline-bots"><option value="2">1 vs 1 (2 คน)</option><option value="6" selected>3 vs 3 (6 คน)</option><option value="10">5 vs 5 (10 คน)</option><option value="20">10 vs 10 (20 คน)</option><option value="40">20 vs 20 (40 คน)</option><option value="60">30 vs 30 (60 คน)</option><option value="100">50 vs 50 (100 คน)</option></select></div>
            <div class="form-group" style="margin:0;"><label>ทีม &amp; เวลา (นาที)</label><div style="display:flex; gap:6px;"><select id="offline-team"><option value="red">ทีมแดง</option><option value="blue">ทีมน้ำเงิน</option></select><input type="number" id="offline-minutes" min="1" max="60" value="5" style="width:72px;" /></div></div>
            <div class="form-group hidden" id="offline-br-team-mode-group" style="margin:0;"><label>รูปแบบทีม Battle Royale</label><select id="offline-br-team-mode"><option value="solo">Solo • เดี่ยว</option><option value="duo">Duo • ทีมละ 2</option><option value="squad" selected>Squad • ทีมละ 4</option></select></div>
            <div class="form-group" style="margin:0;"><label>แผนที่</label><select id="offline-map"><option value="default">แมพเริ่มต้น (ในเกม)</option><option value="maps_1">Maps-1: Abandoned Metropolis</option><option value="maps_2">Maps-2: Battle Royale Island</option></select></div>
          </div>
          <button class="btn btn-gold" style="width:100%;" id="btn-start-offline"><i class="ri-play-fill"></i> เริ่มรบโหมดออฟไลน์</button>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px;">
        <div class="section-box" style="flex:1; display:flex; flex-direction:column;">
          <div class="section-title">
            <span class="section-title-label"><i class="ri-global-line"></i> โหมดออนไลน์ (Firebase RTDB)</span>
            <button class="btn btn-ghost" style="width:auto; padding:5px 11px; font-size:0.75rem;" id="btn-refresh-rooms"><i class="ri-refresh-line"></i> รีเฟรชห้อง</button>
          </div>
          <div id="online-status-note" style="font-size:0.77rem; color:var(--muted); margin-bottom:8px; padding:6px 10px; border-radius:8px; background:rgba(255,255,255,0.035); border:1px solid rgba(255,255,255,0.06);"></div>
          <div class="room-list" id="room-list"><div style="color:var(--muted); font-size:0.84rem; text-align:center; padding:18px;">กำลังโหลดรายชื่อห้อง...</div></div>
          <div style="margin-top:auto; border-top:1px solid var(--border); padding-top:12px;">
            <div class="form-group"><label>สร้างห้องออนไลน์ (ชื่อห้อง / ทีม / เวลา)</label><div style="display:flex; gap:6px;"><input type="text" id="new-room-name" placeholder="Abandoned City" maxlength="24" /><select id="online-team" style="width:118px;"><option value="red">ทีมแดง</option><option value="blue">ทีมน้ำเงิน</option></select><input type="number" id="online-minutes" min="1" max="60" value="5" style="width:70px;" /></div></div>
            <div class="form-group"><label>โหมดออนไลน์</label><select id="online-mode"><option value="tdm">Team Deathmatch</option><option value="deathmatch">Deathmatch 1v49 • 50 คน • 12 นาที</option><option value="battle_royale">Battle Royale • 100 คน</option></select></div>
            <div class="form-group"><label>ระบบเลือด (โฮสต์เลือกใช้ทั้งห้อง)</label><select id="online-health-mode"><option value="bodyparts">บาดเจ็บตามส่วนต่าง ๆ ของร่างกาย</option><option value="single">HP 100% หลอดเดียว</option></select></div>
            <div class="form-group hidden" id="online-br-team-mode-group"><label>รูปแบบทีม Battle Royale</label><select id="online-br-team-mode"><option value="solo">Solo • เดี่ยว</option><option value="duo">Duo • ทีมละ 2</option><option value="squad" selected>Squad • ทีมละ 4</option></select></div>
            <div class="form-group"><label>แผนที่</label><select id="online-map"><option value="default">แมพเริ่มต้น (ในเกม)</option><option value="maps_1">Maps-1: Abandoned Metropolis</option><option value="maps_2">Maps-2: Battle Royale Island</option></select></div>
            <div class="form-group" id="online-tdm-settings"><label>ขนาดทีม / เป้าคะแนน (โหมด Team Deathmatch)</label><div style="display:flex; gap:6px;"><select id="online-perteam"><option value="1">1 vs 1</option><option value="2">2 vs 2</option><option value="3">3 vs 3</option><option value="5" selected>5 vs 5</option><option value="10">10 vs 10</option></select><select id="online-score"><option value="25">ถึง 25 คะแนน</option><option value="50" selected>ถึง 50 คะแนน</option><option value="100">ถึง 100 คะแนน</option></select></div></div>
            <button class="btn btn-blue" style="width:100%;" id="btn-create-room"><i class="ri-add-circle-line"></i> สร้างห้อง &amp; เข้าห้องรอ</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="character-screen" class="screen hidden">
    <div class="card" id="character-card">
      <div class="brand">
        <div class="brand-badge"><i class="ri-user-settings-line"></i> OPERATOR CUSTOMIZATION</div>
        <h1>เลือกตัวละคร</h1>
        <p>ปรับแต่งรูปลักษณ์ของตัวละครที่จะใช้ในทุกโหมด</p>
      </div>
      <div class="character-options">
        <div class="form-group"><label for="character-gender">ตัวละคร</label><select id="character-gender"><option value="male">หน่วยรบชาย</option><option value="female">หน่วยรบหญิง</option></select></div>
        <div class="form-group"><label for="character-hairstyle">ทรงผม / หมวก</label><select id="character-hairstyle"></select></div>
        <div class="form-group" style="grid-column:1/-1;"><label for="character-outfit">ชุด</label><select id="character-outfit"></select></div>
      </div>
      <div id="character-selection-status" class="msg-error" aria-live="polite"></div>
      <div class="character-actions">
        <button class="btn btn-ghost" id="btn-cancel-character"><i class="ri-arrow-left-line"></i> กลับ</button>
        <button class="btn btn-primary" id="btn-save-character"><i class="ri-check-line"></i> ใช้ตัวละครนี้</button>
      </div>
    </div>
  </div>

  <div id="hud" class="hidden">
    <div class="hud-minimap"><canvas id="minimap-canvas" width="170" height="170"></canvas></div>
    <div id="fps-counter">FPS: 60</div>
    <div class="hud-top-center">
      <div class="score-pill">
        <div class="score-box score-red" id="hud-red-score">0</div>
        <div class="match-timer" id="hud-timer">05:00</div>
        <div class="score-box score-blue" id="hud-blue-score">0</div>
      </div>
      <div id="hud-deathmatch-status" class="hidden" style="color:#fde68a; font-weight:800; font-size:0.82rem; background:rgba(9,13,22,0.8); padding:4px 12px; border-radius:999px; border:1px solid rgba(245,158,11,0.35); text-align:center;"></div>
      <div id="hud-alive-bar" class="hidden">Red รอด: 0 | Blue รอด: 0</div>
    </div>
    <div class="hud-killfeed" id="hud-killfeed"></div>
    <div class="hud-bottom-left">
      <div class="hp-row"><span style="font-size:0.78rem; font-weight:700; color:var(--muted);" id="hud-team-badge">RED TEAM</span></div>
      <div class="hud-armor-row"><span class="hud-label-with-icon">${gameIconImg('kevlar-vest', '', 'gx-icon gx-icon-xs')} เสื้อเกราะ (Armor)</span><span id="hud-armor">50</span></div>
      <div class="bar-bg" style="height:6px;"><div class="armor-bar-fill" id="hud-armor-bar" style="width:50%;"></div></div>
      <div class="hud-headarmor-row"><span class="hud-label-with-icon">${gameIconImg('stahlhelm', '', 'gx-icon gx-icon-xs')} เกราะศีรษะ</span><span id="hud-headarmor">100</span></div>
      <div class="bar-bg" style="height:5px;"><div class="armor-bar-fill" id="hud-headarmor-bar" style="width:100%; background:linear-gradient(90deg,#7c3aed,#c4b5fd);"></div></div>
      <div class="body-hp-strip" id="body-hp-strip">
        <div class="body-hp-item" id="body-head"><span class="body-hp-icon">${gameIconImg('headshot', 'หัว', 'gx-icon gx-icon-xs')}</span><div><b>หัว</b><div class="bar-bg"><div class="hp-bar-fill" id="body-hp-head-bar"></div></div><span id="body-hp-head">100</span></div></div>
        <div class="body-hp-item" id="body-torso"><span class="body-hp-icon">${gameIconImg('muscular-torso', 'ลำตัว', 'gx-icon gx-icon-xs')}</span><div><b>ลำตัว</b><div class="bar-bg"><div class="hp-bar-fill" id="body-hp-torso-bar"></div></div><span id="body-hp-torso">100</span></div></div>
        <div class="body-hp-item" id="body-leftArm"><span class="body-hp-icon">${gameIconImg('gauntlet', 'แขนซ้าย', 'gx-icon gx-icon-xs')}</span><div><b>แขนซ้าย</b><div class="bar-bg"><div class="hp-bar-fill" id="body-hp-leftArm-bar"></div></div><span id="body-hp-leftArm">100</span></div></div>
        <div class="body-hp-item" id="body-rightArm"><span class="body-hp-icon">${gameIconImg('gauntlet', 'แขนขวา', 'gx-icon gx-icon-xs')}</span><div><b>แขนขวา</b><div class="bar-bg"><div class="hp-bar-fill" id="body-hp-rightArm-bar"></div></div><span id="body-hp-rightArm">100</span></div></div>
        <div class="body-hp-item" id="body-leftLeg"><span class="body-hp-icon">${gameIconImg('armored-pants', 'ขาซ้าย', 'gx-icon gx-icon-xs')}</span><div><b>ขาซ้าย</b><div class="bar-bg"><div class="hp-bar-fill" id="body-hp-leftLeg-bar"></div></div><span id="body-hp-leftLeg">100</span></div></div>
        <div class="body-hp-item" id="body-rightLeg"><span class="body-hp-icon">${gameIconImg('armored-pants', 'ขาขวา', 'gx-icon gx-icon-xs')}</span><div><b>ขาขวา</b><div class="bar-bg"><div class="hp-bar-fill" id="body-hp-rightLeg-bar"></div></div><span id="body-hp-rightLeg">100</span></div></div>
      </div>
      <div id="single-hp-display" class="hidden" style="margin:7px 0;">
        <div class="hud-armor-row" style="color:#86efac; margin-bottom:3px;"><span>พลังชีวิต (HP)</span><span><b id="single-hp-value">100</b> / 100</span></div>
        <div class="bar-bg" style="height:7px;"><div class="hp-bar-fill" id="single-hp-bar"></div></div>
      </div>
      <div id="br-bleedout-display" class="hidden" style="margin:7px 0;">
        <div class="hud-armor-row" style="color:#fb7185; margin-bottom:3px;"><span>เลือดขณะล้ม • หมดแล้วเสียชีวิต</span><span><b id="br-bleedout-value">100</b> / 100</span></div>
        <div class="bar-bg" style="height:7px;"><div class="hp-bar-fill" id="br-bleedout-bar" style="background:linear-gradient(90deg,#991b1b,#ef4444);"></div></div>
      </div>
      <div class="hud-meta-line" id="hud-stance">ยืน • ตั้งค่าปุ่มได้ใน [Esc]</div>
      <div class="hud-meta-line" style="color:#fca5a5;" id="hud-injuries">บาดเจ็บ: ไม่มี</div>
    </div>
    <div class="hud-bottom-right">
      <div class="weapon-name-hud" id="hud-weapon-name">AUG A3</div>
      <div class="hud-coins-row"><i class="ri-copper-coin-fill"></i> Coins: <b id="hud-coins">0</b></div>
      <div class="ammo-hud" id="hud-ammo">30 <span>| 6 แม็ก</span></div>
      <div class="slot-strip"><div class="slot-pill active" id="slot-1">1 หลัก</div><div class="slot-pill" id="slot-2">2 พก</div><div class="slot-pill" id="slot-3">3 มีด</div><div class="slot-pill" id="slot-4">4 ระเบิด</div></div>
    </div>
    <div id="crosshair"><div class="ch-line ch-top"></div><div class="ch-line ch-bot"></div><div class="ch-line ch-left"></div><div class="ch-line ch-right"></div><div class="ch-dot"></div></div>
    <div id="hitmarker"></div>
    <div id="kill-confirm-popup"><div class="kc-badge" id="kc-text">สังหารเป้าหมาย!</div></div>
    <div id="scope-overlay" class="hidden"><div id="scope-thermal-targets"></div><div class="scope-dot"></div><div id="scope-zoom-label">4.0x</div><div id="scope-zoom-help">ล้อเมาส์ หรือ [ / ] ปรับซูม</div><div id="scope-range-reticle" aria-hidden="true"><i class="range-mark"><span>50m</span></i><i class="range-mark"><span>100m</span></i><i class="range-mark"><span>150m</span></i></div><div id="scope-range-readout">ศัตรู: -- m</div><div id="scope-smart-readout">กำลังค้นหาเป้าหมาย</div><div id="scope-smart-marker"><span>จุดยิง</span></div></div>
    <div id="lowhp-vignette"></div><div id="damage-vignette"></div><div id="death-fade"></div><div id="flash-overlay"></div>
    <button id="respawn-control" class="btn btn-green hidden" disabled>เกิดใหม่ใน 5 วินาที</button>
    <div id="center-banner"></div><div id="pickup-toast"></div>
    <div id="reload-bar-wrap"><div id="reload-bar-fill"></div></div>
  </div>

  <div id="scoreboard" class="hidden">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;"><strong id="sb-mode-title" style="color:#fde68a;">TEAM DEATHMATCH</strong><span id="sb-room-code" style="color:var(--gold); font-weight:700;"></span></div>
    <div class="sb-cols" id="sb-team-columns"><div><div style="color:var(--red); font-weight:800; margin-bottom:6px;">RED TEAM</div><table class="sb-table" id="sb-red"></table></div><div><div style="color:var(--blue); font-weight:800; margin-bottom:6px;">BLUE TEAM</div><table class="sb-table" id="sb-blue"></table></div></div>
    <div id="sb-deathmatch" class="hidden"><table class="sb-table"><thead><tr><th>อันดับ</th><th>ผู้เล่น</th><th>K</th><th>D</th></tr></thead><tbody id="sb-deathmatch-body"></tbody></table></div>
  </div>

  <div id="nextlife-overlay" class="modal-overlay hidden">
    <div class="card" style="width: 540px; text-align:center;">
      <h2 style="color: var(--cyan); margin-bottom: 6px;"><i class="ri-exchange-box-line"></i> เลือกอาวุธสำหรับรอบเกิดใหม่</h2>
      <p style="font-size:0.82rem; color:var(--muted); margin-bottom:14px;">อาวุธที่เลือกจะเปลี่ยนให้ทันทีเมื่อเกิดใหม่ (หากตายอยู่ เกมจะรอจนกว่าคุณจะกดยืนยัน)</p>
      <div class="loadout-grid" style="text-align:left; margin-bottom:16px;">
        <div class="weapon-select-card"><label>ปืนหลัก</label><select id="t-sel-primary"></select><div class="loadout-icon-grid" id="t-icons-primary"></div></div>
        <div class="weapon-select-card"><label>ปืนพก</label><select id="t-sel-secondary"></select><div class="loadout-icon-grid" id="t-icons-secondary"></div></div>
        <div class="weapon-select-card"><label>อาวุธประชิด</label><select id="t-sel-melee"></select><div class="loadout-icon-grid" id="t-icons-melee"></div></div>
        <div class="weapon-select-card"><label>ระเบิด</label><select id="t-sel-grenade"></select><div class="loadout-icon-grid" id="t-icons-grenade"></div></div>
      </div>
      <button class="btn btn-green" style="width:100%;" id="btn-confirm-t-loadout"><i class="ri-check-double-line"></i> ยืนยันอาวุธ &amp; กลับเข้าสู้</button>
    </div>
  </div>

  <div id="pause-overlay" class="modal-overlay hidden">
    <div class="card" style="width: 420px; text-align:center;">
      <div class="brand-badge"><i class="ri-pause-circle-line"></i> MISSION PAUSED</div>
      <h2 style="color: #fde68a; margin-bottom: 14px;">พักการรบ (PAUSE)</h2>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <button class="btn btn-green" id="btn-resume-game"><i class="ri-play-fill"></i> กลับเข้าสู่สนามรบ (ล็อกเมาส์)</button>
        <button class="btn btn-ghost" id="btn-open-t-from-pause"><i class="ri-exchange-line"></i> เลือกอาวุธสำหรับเกิดใหม่</button>
        <button class="btn btn-ghost" id="btn-open-attachments-pause"><i class="ri-tools-line"></i> ร้านค้าปรับแต่งอาวุธ (B / Coins)</button>
        <button class="btn btn-ghost" id="btn-open-settings-pause"><i class="ri-settings-3-line"></i> ตั้งค่า (ปุ่มทั้งหมด / กราฟฟิค / FPS)</button>
        <button class="btn btn-ghost" style="color:#fca5a5; border-color:rgba(239,68,68,0.3);" id="btn-leave-match"><i class="ri-door-open-line"></i> ออกจากแมตช์กลับล็อบบี้</button>
      </div>
    </div>
  </div>

  <div id="settings-overlay" class="modal-overlay hidden">
    <div class="card settings-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; gap:10px;">
        <h2 style="color:#fde68a; display:flex; align-items:center; gap:8px;"><i class="ri-settings-4-line"></i> ตั้งค่าเกม (Settings)</h2>
        <button class="btn btn-green" style="padding:8px 18px;" id="btn-close-settings"><i class="ri-save-3-line"></i> บันทึก &amp; ปิด</button>
      </div>

      <div class="settings-filter-bar" id="ux-settings-tabs">
        <button type="button" class="settings-tab-btn active" data-stab="all"><i class="ri-apps-line"></i> ทั้งหมด</button>
        <button type="button" class="settings-tab-btn" data-stab="keys"><i class="ri-keyboard-line"></i> ปุ่มควบคุม</button>
        <button type="button" class="settings-tab-btn" data-stab="graphics"><i class="ri-sparkling-2-line"></i> ภาพ &amp; เสียง</button>
        <button type="button" class="settings-tab-btn" data-stab="mobile"><i class="ri-smartphone-line"></i> มือถือ &amp; มุมมอง</button>
      </div>

      <div class="settings-cols" id="ux-settings-cols">
        <div class="section-box" id="ux-settings-keys-box">
          <div class="section-title">
            <span class="section-title-label"><i class="ri-keyboard-box-line"></i> ตั้งค่าปุ่ม (รองรับเมาส์ Back/Forward)</span>
            <button class="btn btn-ghost" style="width:auto; padding:4px 10px; font-size:0.72rem;" id="btn-reset-keys"><i class="ri-restart-line"></i> รีเซ็ตปุ่ม</button>
          </div>
          <div class="keybind-list" id="keybind-list"></div>
        </div>
        <div class="section-box" id="ux-settings-gfx-box">
          <div class="section-title"><span class="section-title-label"><i class="ri-sliders-line"></i> กราฟฟิค &amp; การแสดงผล</span></div>
          <div class="gfx-list">
            <div class="gfx-row" data-cat="graphics"><span>เสียง VFX: <b id="val-vfx-vol">100%</b></span><input type="range" id="set-vfx-vol" min="0" max="100" step="5" value="100" /></div>
            <div class="gfx-row" data-cat="graphics"><span>เสียง BGM: <b id="val-bgm-vol">100%</b></span><input type="range" id="set-bgm-vol" min="0" max="100" step="5" value="100" /></div>
            <div class="gfx-row" data-cat="graphics"><span>แสดงตัวเลข FPS</span><input type="checkbox" id="set-show-fps" checked /></div>
            <div class="gfx-row" data-cat="graphics"><span>ความละเอียดภาพ: <b id="val-res">100%</b></span><input type="range" id="set-res" min="0.5" max="1.5" step="0.1" value="1.0" /></div>
            <div class="gfx-row" data-cat="mobile"><span>ความคมชัดมือถือ: <b id="val-mobile-sharpness">1.0x</b></span><input type="range" id="set-mobile-sharpness" min="0.5" max="1.5" step="0.1" value="1.0" /></div>
            <div class="gfx-row" data-cat="graphics"><span>เงา (PCF • 1024)</span><input type="checkbox" id="set-shadows" checked /></div>
            <div class="gfx-row" data-cat="graphics"><span>ความละเอียดเงา</span><select id="set-shadow-res"><option value="1024" selected>มาตรฐาน (1024)</option></select></div>
            <div class="gfx-row" data-cat="graphics"><span>ระยะมองเห็น (Fog): <b id="val-fog">260m</b></span><input type="range" id="set-fog" min="110" max="420" step="10" value="260" /></div>
            <div class="gfx-row" data-cat="graphics"><span>พรีเซ็ตกราฟฟิค</span><select id="set-preset"><option value="">กำหนดเอง</option><option value="low">ต่ำ</option><option value="mid">กลาง</option><option value="high">สูง</option><option value="ultra">สูงสุด</option></select></div>
            <div class="gfx-row" data-cat="mobile"><span>FOV: <b id="val-fov">75</b></span><input type="range" id="set-fov" min="60" max="110" step="1" value="75" /></div>
            <div class="gfx-row" data-cat="mobile"><span>แสดงเส้นผม (มุมมองบุคคลที่ 1)</span><input type="checkbox" id="set-first-person-hair" /></div>
            <div class="gfx-row" data-cat="mobile"><span>มุมก้ม/เงยเพิ่ม (บุคคลที่ 1): <b id="val-first-person-tilt">0°</b></span><input type="range" id="set-first-person-tilt" min="-30" max="30" step="1" value="0" /></div>
            <div class="gfx-row" data-cat="mobile"><span>มุมเอียงซ้าย/ขวา (Lean): <b id="val-lean-angle">46°</b></span><input type="range" id="set-lean-angle" min="0" max="50" step="1" value="46" /></div>
            <div class="gfx-row" data-cat="graphics"><span>แสดงเลขดาเมจ</span><input type="checkbox" id="set-dmg" checked /></div>
            <div class="gfx-row" data-cat="graphics"><span>เส้นทางกระสุน (Tracer)</span><input type="checkbox" id="set-tracers" checked /></div>
            <div class="gfx-row" data-cat="graphics"><span>สี/คอนทราสต์: <b id="val-grade">1.15</b></span><input type="range" id="set-grade" min="0.9" max="1.5" step="0.05" value="1.15" /></div>
            <div class="gfx-row" data-cat="graphics"><span>Vignette (ขอบมืด)</span><input type="checkbox" id="set-vig" checked /></div>
            <div class="gfx-row" data-cat="mobile"><span>โหมดมือถือ (Touch)</span><input type="checkbox" id="set-mobile" /></div>
            <div class="gfx-row" data-cat="mobile"><span>ช่วยเล็ง (มือถือ)</span><input type="checkbox" id="set-aimassist" checked /></div>
            <div class="gfx-row" data-cat="mobile"><span>ความแรงช่วยเล็ง (ล็อกไว้): <b id="val-aimstr">25%</b></span><input type="range" id="set-aimstr" min="25" max="25" step="1" value="25" disabled /></div>
            <div class="gfx-row" data-cat="mobile"><span>ความไวการหันมือถือ: <b id="val-touch-sens">1.6x</b></span><input type="range" id="set-touch-sens" min="0.5" max="3" step="0.1" value="1.6" /></div>
            <div class="gfx-row" data-cat="mobile"><span>ไจโรสโคป (มือถือ)</span><input type="checkbox" id="set-gyro" /></div>
            <div class="gfx-row" data-cat="graphics"><span>ความสว่าง: <b id="val-exp">1.1</b></span><input type="range" id="set-exp" min="0.7" max="1.6" step="0.05" value="1.1" /></div>
            <div class="gfx-row" data-cat="graphics"><span>สะท้อนแสงน้ำ/กระจก (PMREM)</span><input type="checkbox" id="set-env" checked /></div>
            <div class="gfx-row" data-cat="graphics"><span>ฝุ่นละอองในอากาศ</span><input type="checkbox" id="set-dust" checked /></div>
            <div class="gfx-row" data-cat="mobile"><span>ความไวเมาส์: <b id="val-sens">1.0x</b></span><input type="range" id="set-sens" min="0.3" max="2.5" step="0.1" value="1.0" /></div>
            <div class="gfx-row" data-cat="mobile"><span>ระบบแรงดีด/กล้องสั่น</span><select id="set-recoil-mode"><option value="classic">คลาสสิก (แบบเดิม — ค่าเริ่มต้น)</option><option value="avatar">ตามโมเดลตัวละคร (แบบใหม่)</option></select></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="attachment-overlay" class="modal-overlay attachment-overlay hidden">
    <div class="card attachment-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; gap:10px;">
        <h2 style="color:#fde68a; display:flex; align-items:center; gap:8px;">${gameIconImg('crosshair', '', 'gx-icon')} ร้านค้าปรับแต่งอาวุธ [B ปิด]</h2>
        <button class="btn btn-green" id="btn-close-attachments"><i class="ri-check-line"></i> บันทึก &amp; ปิด</button>
      </div>
      <div class="coin-pill"><i class="ri-copper-coin-fill"></i> Coins: <b id="attachment-balance">0</b> • เปลี่ยนอุปกรณ์แต่ละครั้งจะหักเหรียญทันที</div>
      <div class="attachment-icon-strip" id="attachment-icons" aria-label="หมวดของแต่ง"></div>
      <div class="attachment-grid">
        <div class="form-group"><label for="attachment-weapon">อาวุธปืน</label><select id="attachment-weapon"></select></div>
        <div class="form-group"><label for="attachment-sight">ศูนย์เล็ง</label><select id="attachment-sight"></select></div>
        <div class="form-group"><label for="attachment-mag">แมกกาซีน</label><select id="attachment-mag"></select></div>
        <div class="form-group"><label for="attachment-barrel">ลำกล้อง</label><select id="attachment-barrel"></select></div>
        <div class="form-group"><label for="attachment-grip">ด้ามจับลดแรงดีด</label><select id="attachment-grip"></select></div>
        <div class="form-group"><label for="attachment-stock">พานท้ายลดแรงดีด</label><select id="attachment-stock"></select></div>
        <div class="form-group"><label for="attachment-muzzle">อุปกรณ์ปากกระบอก</label><select id="attachment-muzzle"></select></div>
        <div class="form-group"><label for="attachment-trigger">ชุดลั่นไก</label><select id="attachment-trigger"></select></div>
        <div class="form-group"><label for="attachment-flashlight">ไฟฉายปืน</label><select id="attachment-flashlight"></select></div>
        <div class="form-group"><label for="attachment-laser">เลเซอร์ช่วยเล็ง</label><select id="attachment-laser"></select></div>
        <div class="form-group"><label for="attachment-ammunition">ประเภทกระสุน</label><select id="attachment-ammunition"></select></div>
      </div>
      <p id="attachment-summary" class="attachment-summary-box"></p>
    </div>
  </div>

  <div id="room-screen" class="screen hidden">
    <div class="card" style="width:800px; max-width:96vw; max-height:94vh; overflow-y:auto;">
      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:4px;">
        <h2 id="room-title" style="color:#fde68a;">ห้องรอ</h2>
        <span class="brand-badge" style="margin:0;"><i class="ri-wifi-line"></i> LOBBY READY</span>
      </div>
      <small id="room-info" style="color:var(--muted);"></small>
      <div id="room-team-panel" style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin:14px 0;">
        <div class="section-box" style="border-color:rgba(239,68,68,0.35);">
          <div class="section-title"><span style="color:#f87171;">ทีมแดง <b id="room-count-red"></b></span></div>
          <div class="room-list" id="room-red" style="max-height:260px; min-height:90px;"></div>
          <button class="btn btn-ghost" style="width:100%;" id="btn-join-red">เข้าทีมแดง</button>
          <button class="btn btn-ghost" style="width:100%; margin-top:6px;" id="btn-bot-red">+ เพิ่มบอททีมแดง</button>
        </div>
        <div class="section-box" style="border-color:rgba(59,130,246,0.35);">
          <div class="section-title"><span style="color:#60a5fa;">ทีมน้ำเงิน <b id="room-count-blue"></b></span></div>
          <div class="room-list" id="room-blue" style="max-height:260px; min-height:90px;"></div>
          <button class="btn btn-ghost" style="width:100%;" id="btn-join-blue">เข้าทีมน้ำเงิน</button>
          <button class="btn btn-ghost" style="width:100%; margin-top:6px;" id="btn-bot-blue">+ เพิ่มบอททีมน้ำเงิน</button>
        </div>
      </div>
      <div id="room-deathmatch-panel" class="hidden" style="margin:14px 0;">
        <div class="section-title">ผู้เล่น Deathmatch <b id="room-deathmatch-count"></b></div>
        <div class="room-list" id="room-deathmatch-list" style="max-height:260px; min-height:90px;"></div>
        <small style="display:block; text-align:center; color:var(--muted); margin-top:8px;">เริ่มเกมแล้วระบบจะเติมบอทให้ครบ 50 คน • แข่งขัน 12 นาที</small>
      </div>
      <div style="display:flex; gap:10px;"><button class="btn btn-ghost" style="flex:1;" id="btn-room-leave"><i class="ri-logout-box-line"></i> ออกจากห้อง</button><button class="btn btn-green" style="flex:2;" id="btn-room-start"><i class="ri-play-fill"></i> เริ่มเกม</button></div>
      <div id="room-wait-note" style="color:var(--muted); text-align:center; margin-top:10px;">รอหัวห้องกดเริ่มเกม... (เลือกฝั่งได้ตามต้องการ)</div>
    </div>
  </div>

  <div id="results-overlay" class="modal-overlay results-overlay hidden">
    <div class="card results-card">
      <div class="brand-badge" style="margin:0 auto 8px;"><i class="ri-trophy-line"></i> MATCH SUMMARY</div>
      <h2 id="results-title" style="color:#fde68a; font-size:1.65rem;">จบการแข่งขัน</h2>
      <p id="results-reason" style="color:var(--muted); margin-top:5px;"></p>
      <div id="results-score" style="font-size:1.35rem; font-weight:900; margin-top:12px;"></div>
      <div class="res-cols" id="results-team-columns">
        <div class="res-col red"><h3>ทีมแดง</h3><div class="res-scroll"><table><thead><tr><th>ชื่อ</th><th>ฆ่า</th><th>ตาย</th><th>HS</th></tr></thead><tbody id="results-red"></tbody></table></div></div>
        <div class="res-col blue"><h3>ทีมน้ำเงิน</h3><div class="res-scroll"><table><thead><tr><th>ชื่อ</th><th>ฆ่า</th><th>ตาย</th><th>HS</th></tr></thead><tbody id="results-blue"></tbody></table></div></div>
      </div>
      <div id="results-deathmatch" class="hidden" style="max-height:340px; overflow:auto; margin-top:12px;">
        <table style="width:100%; border-collapse:collapse;"><thead><tr><th>อันดับ</th><th>ผู้เล่น</th><th>คิว</th><th>ตาย</th><th>รางวัล</th></tr></thead><tbody id="results-deathmatch-body"></tbody></table>
      </div>
      <div class="res-actions" style="display:flex; gap:10px;">
        <button class="btn btn-gold" id="btn-restart-match" style="flex:1;"><i class="ri-restart-line"></i> เริ่มใหม่</button>
        <button class="btn btn-ghost" id="btn-exit-results" style="flex:1;"><i class="ri-home-4-line"></i> ออกไปล็อบบี้</button>
      </div>
    </div>
  </div>

  <div id="vig"></div>
  <div id="touch"><div id="joyzone"></div><div id="joy"><div id="joyk"></div></div>
    <div class="tb" id="t-menu"><i class="ri-menu-line"></i></div>
    <div class="tb" id="t-view">มุมมอง<br>บุคคล 3</div>
    <div id="tmenu" class="hidden">
      <div class="tb mi" id="t-set"><i class="ri-settings-3-line"></i> ตั้งค่า</div>
      <div class="tb mi" id="t-loadout"><i class="ri-exchange-line"></i> เปลี่ยนปืน</div>
      <div class="tb mi" id="t-attachments"><i class="ri-tools-line"></i> ร้านค้าปรับแต่ง</div>
      <div class="tb mi" id="t-score"><i class="ri-bar-chart-2-line"></i> คะแนน</div>
      <div class="tb mi" id="t-fs"><i class="ri-fullscreen-line"></i> เต็มจอ</div>
      <div class="tb mi" id="t-layout"><i class="ri-drag-move-2-line"></i> จัดปุ่ม</div>
      <div class="tb mi" id="t-layout-reset"><i class="ri-restart-line"></i> รีเซ็ตตำแหน่ง</div>
      <div class="tb mi" id="t-exit" style="background:rgba(127,29,29,.92); border-color:rgba(248,113,113,0.4);"><i class="ri-door-open-line"></i> ออกจากด่าน</div>
      <div class="tb mi" id="t-pc-mode"><i class="ri-computer-line"></i> โหมด PC</div>
    </div>
    <div id="tchips">
      <div class="tb chip" id="t-1">1<small>หลัก</small></div>
      <div class="tb chip" id="t-2">2<small>พก</small></div>
      <div class="tb chip" id="t-3">3<small>มีด</small></div>
      <div class="tb chip" id="t-4">4<small>ระเบิด</small></div>
    </div>
    <div class="tb" id="t-fire-left">${gameIconImg('gunshot', 'ยิง', 'gx-icon')}<span>ยิง</span></div>
    <div class="tb" id="t-fire">${gameIconImg('gunshot', 'ยิง', 'gx-icon')}<span>ยิง</span></div>
    <div class="tb hidden" id="t-cancel-aim">ยกเลิก<br>ยิง</div>
    <div class="tb" id="t-aim">${gameIconImg('crosshair', 'เล็ง', 'gx-icon')}<span>เล็ง</span></div>
    <div class="tb" id="t-jump"><i class="ri-arrow-up-double-line"></i><span>กระโดด</span></div>
    <div class="tb" id="t-reload"><i class="ri-refresh-line"></i><span>รีโหลด</span></div>
    <div class="tb" id="t-swap"><i class="ri-arrow-left-right-line"></i><span>สลับปืน</span></div>
    <div class="tb hidden" id="t-split">แยก<br>คู่</div>
    <div class="tb" id="t-pickup"><i class="ri-hand-coin-line"></i><span>เก็บของ</span></div>
    <div id="tstance">
      <div class="tb" id="t-crouch"><i class="ri-arrow-down-s-line"></i><span>ย่อ</span></div>
      <div class="tb" id="t-prone"><i class="ri-hotel-bed-line"></i><span>นอน</span></div>
    </div>
    <div id="tlean">
      <div class="tb" id="t-leanL"><i class="ri-corner-up-left-line"></i><small>เอียงซ้าย</small></div>
      <div class="tb" id="t-leanR"><i class="ri-corner-up-right-line"></i><small>เอียงขวา</small></div>
    </div>
    <div id="tzoom" class="hidden">
      <div class="tb" id="t-zin"><i class="ri-zoom-in-line"></i></div>
      <div class="tb" id="t-zout"><i class="ri-zoom-out-line"></i></div>
    </div>
  </div>
`;

const uxUiStyle = document.createElement('style');
uxUiStyle.textContent = UX_UI_STYLES;
document.head.appendChild(uxUiStyle);
document.body.insertAdjacentHTML('beforeend', UX_UI_MARKUP);

// Enhance dynamic UI without modifying index.html (settings tabs + crisp online icons for weapon/attachment pickers)
(function enhanceUxUiInteractions() {
  const WEAPON_ICON_SLUGS = {
    // Primary Rifles / SMGs / Snipers / Shotguns / LMGs
    ar_aug: 'steyr-aug',
    ak47: 'ak47',
    m4a1: 'fn-fal',
    sg_spas: 'shotgun',
    sr_l115: 'lee-enfield',
    kar98: 'lee-enfield',
    m200: 'lee-enfield',
    barrett: 'lee-enfield',
    smg_kriss: 'mp5',
    thompson: 'thompson-m1',
    mp40: 'mp40',
    vector: 'mp5',
    vector_dual: 'mp5',
    lmg_mk46: 'minigun',
    p90: 'p90',
    // Pistols
    p_deagle: 'desert-eagle',
    p_glock: 'glock',
    dual_glock: 'crossed-pistols',
    p_usp: 'colt-m1911',
    spin_usp: 'colt-m1911',
    revolver: 'revolver',
    // Melee
    m_knife: 'bowie-knife',
    m_fang: 'switchblade',
    m_kukri: 'bowie-knife',
    dual_blades: 'crossed-swords',
    // Grenades
    g_frag: 'grenade',
    g_smoke: 'smoke-bomb',
    g_flash: 'flash-grenade'
  };

  function resolveWeaponSlug(btn, gridId) {
    const title = (btn.getAttribute('title') || '').toLowerCase();
    const label = (btn.textContent || '').trim().toLowerCase();
    for (const [wid, slug] of Object.entries(WEAPON_ICON_SLUGS)) {
      if (label.includes(wid.replace(/^[a-z]+_/, '').replace(/_/g, ' '))) return slug;
    }
    if (gridId.includes('secondary')) return label.includes('revolver') ? 'revolver' : label.includes('deagle') || label.includes('desert') ? 'desert-eagle' : 'glock';
    if (gridId.includes('melee')) return 'bowie-knife';
    if (gridId.includes('grenade')) return label.includes('smoke') ? 'smoke-bomb' : label.includes('flash') ? 'flash-grenade' : 'grenade';
    if (title.includes('สไนเปอร์') || label.includes('awp') || label.includes('svd') || label.includes('m200') || label.includes('barrett') || label.includes('kar98')) return 'lee-enfield';
    if (title.includes('ลูกซอง') || label.includes('spas') || label.includes('shotgun') || label.includes('saiga') || label.includes('aa12')) return 'shotgun';
    if (title.includes('กลหนัก') || label.includes('m249') || label.includes('mk.46') || label.includes('pkm')) return 'minigun';
    if (title.includes('กลเบา') || label.includes('kriss') || label.includes('mp5') || label.includes('p90') || label.includes('ump') || label.includes('vector')) return 'mp5';
    return 'ak47';
  }

  function enhanceLoadoutGrid(grid) {
    if (!grid) return;
    const select = grid.previousElementSibling;
    const options = select && select.tagName === 'SELECT' ? Array.from(select.options) : [];
    const buttons = grid.querySelectorAll('button.icon-choice');
    buttons.forEach((btn, idx) => {
      const iconSpan = btn.querySelector('.icon');
      if (!iconSpan || iconSpan.dataset.uxIconDone) return;
      const wid = options[idx]?.value || '';
      const slug = WEAPON_ICON_SLUGS[wid] || resolveWeaponSlug(btn, grid.id);
      iconSpan.innerHTML = gameIconImg(slug, btn.textContent.trim(), 'gx-icon');
      iconSpan.dataset.uxIconDone = '1';
    });
  }

  function enhanceAttachmentStrip(strip) {
    if (!strip) return;
    const map = [
      ['attachment-sight', 'targeting', 'ศูนย์เล็ง'],
      ['attachment-mag', 'machine-gun-magazine', 'แมก'],
      ['attachment-barrel', 'ak47', 'ลำกล้อง'],
      ['attachment-grip', 'gauntlet', 'ด้ามจับ'],
      ['attachment-stock', 'gun-stock', 'พานท้าย'],
      ['attachment-muzzle', 'supersonic-bullet', 'ปากกระบอก'],
      ['attachment-trigger', 'pistol-gun', 'ลั่นไก'],
      ['attachment-flashlight', 'flashlight', 'ไฟฉาย'],
      ['attachment-laser', 'laser-precision', 'เลเซอร์'],
      ['attachment-ammunition', 'bullets', 'กระสุน']
    ];
    strip.querySelectorAll('button.attachment-icon').forEach((btn, idx) => {
      if (btn.dataset.uxAttDone) return;
      const item = map[idx] || ['attachment-sight', 'crosshair', btn.title || ''];
      btn.innerHTML = `${gameIconImg(item[1], item[2], 'gx-icon gx-icon-sm')}<span class="att-lbl">${item[2]}</span>`;
      btn.dataset.uxAttDone = '1';
    });
  }

  // Settings category tabs
  const tabsBar = document.getElementById('ux-settings-tabs');
  if (tabsBar) {
    const keysBox = document.getElementById('ux-settings-keys-box');
    const gfxBox = document.getElementById('ux-settings-gfx-box');
    const cols = document.getElementById('ux-settings-cols');
    tabsBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.settings-tab-btn');
      if (!btn) return;
      const tab = btn.dataset.stab;
      tabsBar.querySelectorAll('.settings-tab-btn').forEach((b) => b.classList.toggle('active', b === btn));
      const rows = gfxBox ? gfxBox.querySelectorAll('.gfx-row') : [];
      if (tab === 'all') {
        keysBox?.classList.remove('hidden');
        gfxBox?.classList.remove('hidden');
        cols?.classList.remove('single-col');
        rows.forEach((r) => r.classList.remove('ux-tab-hidden'));
      } else if (tab === 'keys') {
        keysBox?.classList.remove('hidden');
        gfxBox?.classList.add('hidden');
        cols?.classList.add('single-col');
      } else {
        keysBox?.classList.add('hidden');
        gfxBox?.classList.remove('hidden');
        cols?.classList.add('single-col');
        rows.forEach((r) => r.classList.toggle('ux-tab-hidden', r.dataset.cat !== tab));
      }
    });
  }

  // Observe dynamic re-renders of weapon icon grids & attachment strip
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      const target = m.target;
      if (!(target instanceof HTMLElement)) continue;
      if (target.classList.contains('loadout-icon-grid')) enhanceLoadoutGrid(target);
      else if (target.id === 'attachment-icons') enhanceAttachmentStrip(target);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  document.querySelectorAll('.loadout-icon-grid').forEach(enhanceLoadoutGrid);
  enhanceAttachmentStrip(document.getElementById('attachment-icons'));
})();