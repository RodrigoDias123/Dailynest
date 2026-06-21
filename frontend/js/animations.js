// DailyNest — Framer Motion entrance & interactive animations
import { animate, inView, stagger } from 'https://esm.sh/framer-motion@11';

/* ── Easing presets ────────────────────────────────────────── */
const ease    = { duration: 0.45, ease: [0.22, 1, 0.36, 1] };
const spring  = { type: 'spring', stiffness: 280, damping: 22 };
const springB = { type: 'spring', stiffness: 420, damping: 22 };

/* ── DOM helpers ───────────────────────────────────────────── */
const q  = (sel) => document.querySelector(sel);
const qa = (sel) => [...document.querySelectorAll(sel)];

/* ══════════════════════════════════════════════════════════════
   LANDING PAGE
══════════════════════════════════════════════════════════════ */
if (q('.landing-page')) {

  // Stats items stagger (CSS sets them to opacity:0 initially)
  const statItems = qa('.stats-item');
  if (statItems.length) {
    animate(
      statItems,
      { opacity: [0, 1], y: [8, 0] },
      { ...ease, delay: stagger(0.1, { startDelay: 0.35 }) }
    );
  }

  // About section — reveal paragraphs as user scrolls to it
  if (q('#about')) {
    inView(
      '#about',
      () => {
        const els = qa('#about h2, #about p');
        if (els.length) {
          animate(
            els,
            { opacity: [0, 1], y: [10, 0] },
            { ...ease, delay: stagger(0.07) }
          );
        }
      },
      { amount: 0.15 }
    );
  }

  // CTA button press feedback
  qa('.landing-actions .btn, .landing-topbar-actions .btn').forEach(btn => {
    btn.addEventListener('mousedown',  () => animate(btn, { scale: 0.94 }, { duration: 0.08 }));
    btn.addEventListener('mouseup',    () => animate(btn, { scale: 1 },    springB));
    btn.addEventListener('mouseleave', () => animate(btn, { scale: 1 },    { duration: 0.1 }));
  });
}

/* ══════════════════════════════════════════════════════════════
   AUTH PAGES  (login / register)
══════════════════════════════════════════════════════════════ */
if (q('.auth-card')) {

  // Stagger the form fields in after the card slides up (handled by CSS)
  const fields = qa('.auth-form .form-group');
  if (fields.length) {
    animate(
      fields,
      { opacity: [0, 1], y: [8, 0] },
      { ...ease, delay: stagger(0.065, { startDelay: 0.3 }) }
    );
  }

  // Submit button press
  qa('.auth-form .btn').forEach(btn => {
    btn.addEventListener('mousedown',  () => animate(btn, { scale: 0.96 }, { duration: 0.08 }));
    btn.addEventListener('mouseup',    () => animate(btn, { scale: 1 },    springB));
    btn.addEventListener('mouseleave', () => animate(btn, { scale: 1 },    { duration: 0.1 }));
  });
}

/* ══════════════════════════════════════════════════════════════
   APP PAGES  (sidebar layout — tasks, agenda, notepad, files, profile)
══════════════════════════════════════════════════════════════ */
if (q('.app-layout')) {

  /* ── Sidebar ── */
  animate('.sidebar',        { opacity: [0, 1], x: [-22, 0] }, { ...ease, delay: 0 });
  animate('.sidebar-footer', { opacity: [0, 1], y: [8,   0] }, { ...ease, delay: 0.4 });

  /* ── Nav links stagger ── */
  const navLinks = qa('.nav-link');
  if (navLinks.length) {
    animate(
      navLinks,
      { opacity: [0, 1], x: [-10, 0] },
      { ...ease, delay: stagger(0.055, { startDelay: 0.12 }) }
    );
  }

  /* ── Workspace toggle ── */
  const pills = qa('.workspace-toggle .pill');
  if (pills.length) {
    animate(
      pills,
      { opacity: [0, 1], scale: [0.88, 1] },
      { ...spring, delay: stagger(0.06, { startDelay: 0.22 }) }
    );
  }

  /* ── Page header ── */
  if (q('.page-header')) {
    animate('.page-header', { opacity: [0, 1], y: [-10, 0] }, { ...ease, delay: 0.08 });
  }

  /* ── Stat cards (Tasks page) ── */
  const statCards = qa('.stat-card');
  if (statCards.length) {
    animate(
      statCards,
      { opacity: [0, 1], y: [14, 0], scale: [0.95, 1] },
      { ...spring, delay: stagger(0.07, { startDelay: 0.2 }) }
    );
  }

  /* ── Task table section ── */
  if (q('.task-section')) {
    animate('.task-section', { opacity: [0, 1], y: [12, 0] }, { ...ease, delay: 0.3 });
  }

  /* ── Agenda ── */
  if (q('.agenda-layout')) {
    animate('.agenda-toolbar', { opacity: [0, 1], y: [-8, 0] }, { ...ease, delay: 0.08 });
    animate('.calendar-wrap',  { opacity: [0, 1], x: [-10, 0] }, { ...ease, delay: 0.16 });
    const miniPanels = qa('.mini-calendar > *');
    if (miniPanels.length) {
      animate(
        miniPanels,
        { opacity: [0, 1], x: [12, 0] },
        { ...ease, delay: stagger(0.1, { startDelay: 0.22 }) }
      );
    }
  }

  /* ── Notepad ── */
  if (q('.notepad-layout')) {
    animate('.notes-list-panel',   { opacity: [0, 1], x: [-12, 0] }, { ...ease, delay: 0.14 });
    animate('.notes-editor-panel', { opacity: [0, 1], x: [12,  0] }, { ...ease, delay: 0.2 });
  }

  /* ── Files ── */
  if (q('.files-body')) {
    animate('.files-toolbar',  { opacity: [0, 1], y: [-6, 0]  }, { ...ease, delay: 0.14 });
    animate('.files-content',  { opacity: [0, 1], y: [10, 0]  }, { ...ease, delay: 0.22 });
  }

  /* ── Profile / Settings cards ── */
  const settingsCards = qa('.settings-card');
  if (settingsCards.length) {
    animate(
      settingsCards,
      { opacity: [0, 1], y: [14, 0] },
      { ...ease, delay: stagger(0.1, { startDelay: 0.18 }) }
    );
  }

  /* ── Button press feedback ── */
  qa('.btn').forEach(btn => {
    btn.addEventListener('mousedown',  () => animate(btn, { scale: 0.94 }, { duration: 0.08 }));
    btn.addEventListener('mouseup',    () => animate(btn, { scale: 1 },    springB));
    btn.addEventListener('mouseleave', () => animate(btn, { scale: 1 },    { duration: 0.1 }));
  });

  /* ── Workspace toggle bounce on click ── */
  qa('.workspace-toggle .pill').forEach(pill => {
    pill.addEventListener('click', () => {
      animate(pill, { scale: [0.9, 1.06, 1] }, { duration: 0.35, ease: 'easeOut' });
    });
  });

  /* ── Action buttons spring on hover ── */
  qa('.action-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => animate(btn, { scale: 1.18 }, { ...springB, duration: 0.2 }));
    btn.addEventListener('mouseleave', () => animate(btn, { scale: 1 },    { ...springB, duration: 0.2 }));
    btn.addEventListener('mousedown',  () => animate(btn, { scale: 0.88 }, { duration: 0.07 }));
    btn.addEventListener('mouseup',    () => animate(btn, { scale: 1 },    springB));
  });

  /* ── Sidebar logout spring ── */
  const logoutBtn = q('.sidebar-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('mouseenter', () => animate(logoutBtn, { scale: 1.1 },  springB));
    logoutBtn.addEventListener('mouseleave', () => animate(logoutBtn, { scale: 1 },    springB));
    logoutBtn.addEventListener('mousedown',  () => animate(logoutBtn, { scale: 0.88 }, { duration: 0.07 }));
    logoutBtn.addEventListener('mouseup',    () => animate(logoutBtn, { scale: 1 },    springB));
  }
}
