/* ============================================================
   DailyNest — app.js
   Main interactivity: modal, sidebar, workspace toggle,
   task CRUD, notepad stats.
   ============================================================ */

/* ── Modal ──────────────────────────────────────────────── */
function openModal(id) {
  var overlay = document.getElementById(id + 'Modal');
  if (overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  var overlay = document.getElementById(id + 'Modal');
  if (overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close on overlay click
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Close on Escape
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(function (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

/* ── Sidebar (mobile) ───────────────────────────────────── */
function toggleSidebar() {
  var sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function (e) {
  if (window.innerWidth > 768) return;
  var sidebar = document.getElementById('sidebar');
  var toggle  = document.querySelector('.sidebar-toggle');
  if (!sidebar || !sidebar.classList.contains('open')) return;
  if (!sidebar.contains(e.target) && toggle && !toggle.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

/* ── Workspace Toggle ───────────────────────────────────── */
function toggleWorkspace(btn) {
  var parent = btn.closest('.workspace-toggle');
  if (!parent) return;
  parent.querySelectorAll('.pill').forEach(function (p) {
    p.classList.remove('active');
  });
  btn.classList.add('active');
}

/* ── Password visibility ────────────────────────────────── */
function togglePassword(btn) {
  var wrap  = btn.closest('.input-wrap');
  if (!wrap) return;
  var input = wrap.querySelector('input[type="password"], input[type="text"]');
  if (!input) return;

  var isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';

  btn.innerHTML = isHidden
    ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
    : '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
}

