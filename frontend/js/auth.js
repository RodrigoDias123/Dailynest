/* ── Auth utilities ─────────────────────────────────────── */
function checkAuth() {
  if (!localStorage.getItem('dn_token')) {
    window.location.href = 'login.html';
  }
}

function logout() {
  localStorage.removeItem('dn_token');
  localStorage.removeItem('dn_user_id');
  window.location.href = 'login.html';
}

function getInitials(name) {
  return (name || '').trim()
    .split(/\s+/).filter(Boolean)
    .map(function (w) { return w[0].toUpperCase(); })
    .join('').slice(0, 2) || '?';
}

function loadSidebarUser() {
  apiGet('/users/profile').then(function (user) {
    var name  = (user.name  || '').trim();
    var email = (user.email || '');

    var avatarEl = document.getElementById('sidebarAvatar');
    var nameEl   = document.getElementById('sidebarName');
    var emailEl  = document.getElementById('sidebarEmail');

    if (avatarEl) avatarEl.textContent = getInitials(name);
    if (nameEl)   nameEl.textContent   = name;
    if (emailEl)  emailEl.textContent  = email;
  }).catch(function () {
    logout();
  });
}

/* Auto-run on every app page */
checkAuth();
loadSidebarUser();
