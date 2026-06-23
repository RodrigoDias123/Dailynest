/* ============================================================
   DailyNest — Sidebar Web Components
   <app-mobile-topbar> and <app-sidebar>
   Both use display:contents so they are transparent to layout.
   ============================================================ */
(function () {

  var NAV_LINKS = [
    {
      key: 'tasks',
      href: 'tasks.html',
      label: 'Tasks',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12l2 2 4-4"/></svg>'
    },
    {
      key: 'agenda',
      href: 'agenda.html',
      label: 'Agenda',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
    },
    {
      key: 'notepad',
      href: 'notepad.html',
      label: 'Notepad',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'
    },
    {
      key: 'files',
      href: 'files.html',
      label: 'Files',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>'
    }
  ];

  var LOGO_SVG = '<svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';

  var LOGO_TEXT = '<span class="logo-text"><span class="bold">Daily</span><span class="light">nest</span></span>';

  var HAMBURGER_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';

  var LOGOUT_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>';

  function detectActivePage() {
    var path = window.location.pathname;
    for (var i = 0; i < NAV_LINKS.length; i++) {
      if (path.indexOf(NAV_LINKS[i].key) !== -1) return NAV_LINKS[i].key;
    }
    return '';
  }

  /* ── <app-mobile-topbar> ─────────────────────────────────── */
  customElements.define('app-mobile-topbar', class extends HTMLElement {
    connectedCallback() {
      this.innerHTML =
        '<header class="mobile-topbar">' +
          '<button class="sidebar-toggle" onclick="toggleSidebar()" aria-label="Abrir menu">' + HAMBURGER_SVG + '</button>' +
          '<div class="mobile-topbar-logo">' + LOGO_SVG + LOGO_TEXT + '</div>' +
        '</header>';
    }
  });

  /* ── <app-sidebar> ───────────────────────────────────────── */
  customElements.define('app-sidebar', class extends HTMLElement {
    connectedCallback() {
      var active = this.getAttribute('active') || detectActivePage();

      var navLinks = NAV_LINKS.map(function (link) {
        var badge = (link.key === 'files') ? '<span class="nav-badge" id="navBadge">0</span>' : '';
        return (
          '<a href="' + link.href + '" class="nav-link' + (active === link.key ? ' active' : '') + '">' +
            link.svg + ' ' + link.label + badge +
          '</a>'
        );
      }).join('');

      this.innerHTML =
        '<aside class="sidebar" id="sidebar">' +
          '<div class="sidebar-logo">' + LOGO_SVG + LOGO_TEXT + '</div>' +

          '<div class="sidebar-section">' +
            '<div class="sidebar-label">Workspace</div>' +
            '<div class="workspace-toggle">' +
              '<button class="pill active" onclick="toggleWorkspace(this)">Work</button>' +
              '<button class="pill" onclick="toggleWorkspace(this)">Personal</button>' +
            '</div>' +
          '</div>' +

          '<div class="sidebar-section">' +
            '<div class="sidebar-label">Navigation</div>' +
            '<nav class="sidebar-nav">' + navLinks + '</nav>' +
          '</div>' +

          '<div class="sidebar-footer">' +
            '<a href="profile.html" class="sidebar-user-link">' +
              '<div class="avatar-circle" id="sidebarAvatar">?</div>' +
              '<div class="sidebar-user-meta">' +
                '<div class="sidebar-user-name" id="sidebarName">Loading...</div>' +
                '<div class="sidebar-user-email" id="sidebarEmail"></div>' +
              '</div>' +
            '</a>' +
            '<button class="sidebar-logout-btn" onclick="logout()" title="Logout" aria-label="Logout">' + LOGOUT_SVG + '</button>' +
          '</div>' +
        '</aside>';
    }
  });

}());
