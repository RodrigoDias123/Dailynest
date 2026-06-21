/* ── Profile page ───────────────────────────────────────── */

(function init() {
  apiGet('/users/profile').then(function (user) {
    document.getElementById('profileName').value  = user.name  || '';
    document.getElementById('profileEmail').value = user.email || '';
    updateProfileHeader(user.name, user.email);
    updateSidebarMeta(user.name, user.email);
  }).catch(function () {
    logout();
  });
}());

function getInitials(name) {
  return (name || '').trim()
    .split(/\s+/).filter(Boolean)
    .map(function (w) { return w[0].toUpperCase(); })
    .join('').slice(0, 2) || '?';
}

function updateProfileHeader(name, email) {
  var avatarEl = document.getElementById('profileAvatar');
  var nameEl   = document.getElementById('profileAvatarName');
  var emailEl  = document.getElementById('profileAvatarEmail');
  if (avatarEl) avatarEl.textContent = getInitials(name);
  if (nameEl)   nameEl.textContent   = name;
  if (emailEl)  emailEl.textContent  = email;
}

function updateSidebarMeta(name, email) {
  var avatarEl = document.getElementById('sidebarAvatar');
  var nameEl   = document.getElementById('sidebarName');
  var emailEl  = document.getElementById('sidebarEmail');
  if (avatarEl) avatarEl.textContent = getInitials(name);
  if (nameEl)   nameEl.textContent   = name;
  if (emailEl)  emailEl.textContent  = email;
}

function setMsg(id, text, type) {
  var el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className   = 'form-msg ' + type;
}

function submitProfile(e) {
  e.preventDefault();
  var name  = document.getElementById('profileName').value.trim();
  var email = document.getElementById('profileEmail').value.trim();

  apiPatch('/users/profile', { name: name, email: email }).then(function (user) {
    setMsg('profileMsg', 'Profile updated successfully.', 'success');
    updateProfileHeader(user.name, user.email);
    updateSidebarMeta(user.name, user.email);
    toast.success('Profile updated successfully.');
  }).catch(function () {
    setMsg('profileMsg', 'Failed to update profile. Please try again.', 'error');
    toast.error('Failed to update profile. Please try again.');
  });
}

function submitPassword(e) {
  e.preventDefault();
  var newPw  = document.getElementById('newPassword').value;
  var confPw = document.getElementById('confirmPassword').value;

  if (newPw.length < 6) {
    setMsg('passwordMsg', 'Password must be at least 6 characters.', 'error');
    return;
  }
  if (newPw !== confPw) {
    setMsg('passwordMsg', 'Passwords do not match.', 'error');
    return;
  }

  apiPatch('/users/profile', { password: newPw }).then(function () {
    setMsg('passwordMsg', 'Password updated successfully.', 'success');
    document.getElementById('passwordForm').reset();
    toast.success('Password updated successfully.');
  }).catch(function () {
    setMsg('passwordMsg', 'Failed to update password. Please try again.', 'error');
    toast.error('Failed to update password. Please try again.');
  });
}

function confirmDeleteAccount() {
  apiDelete('/users/profile').then(function () {
    logout();
  }).catch(function () {
    closeModal('deleteAccount');
    toast.error('Failed to delete account. Please try again.');
  });
}
