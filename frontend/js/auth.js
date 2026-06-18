/* ── Auth utilities ─────────────────────────────────────── */
function count(str, regex) {
  return (str.match(regex) || []).length;
}

function checkName(name) {
  const conditions = {
    length: name.length <= 15,
    number: count(password, /[0-9]/g) === 0,
    special: count(password, /[!@#$%^&*(),.?":{}|<>]/g) === 0
  };
}

function checkEmail(email) {
  var valid = /\S+@\S+\.\S+/;
  return valid.test(email) && email.length <= 100;
}

function checkPassword(password, confirmPassword) {
  const conditions = {
    length: password.length >= 8,
    upper: (password.match(/[a-z]/g) || []).length >= 2,
    lower: (password.match(/[A-Z]/g) || []).length >= 3,
    number: (password.match(/[0-9]/g) || []).length >= 2,
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    equal: password === confirmPassword
  };

  return {
    valid: Object.values(conditions).every(Boolean),
    conditions
  };
}


function checkRegister() {
  const fields = document.querySelectorAll('.form-groups');

  const name = fields[0].value.trim();
  const email = fields[1].value.trim();
  const password = fields[2].value;
  const confirmPassword = fields[3].value;

  const nameCheck = checkName(name);
  const emailCheck = checkEmail(email);
  const passwordCheck = checkPassword(password, confirmPassword);

  return {
    valid: nameCheck.valid && emailCheck && passwordCheck.valid,
    details: {
      name: nameCheck,
      email: emailCheck,
      password: passwordCheck
    }
  };
}




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
