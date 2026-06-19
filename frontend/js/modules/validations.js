document.addEventListener("DOMContentLoaded", function () {

  function count(str, regex) {
    return (str.match(regex) || []).length;
  }

  function checkName(name) {
    const conditions = {
      min: name.length >= 3,
      max: name.length <= 15,
      number: count(name, /[0-9]/g) === 0,
      special: count(name, /[!@#$%^&*(),.?":{}|<>]/g) === 0
    };

    return {
      valid: Object.values(conditions).every(Boolean),
      message: "Invalid name: 3–15 chars, no numbers or special symbols."
    };
  }

  function checkEmail(email) {
    const valid = /\S+@\S+\.\S+/;
    const ok = email.length >= 5 && email.length <= 100 && valid.test(email);

    return {
      valid: ok,
      message: "Invalid email format or too short."
    };
  }

  function checkPassword(password, confirmPassword) {
    const conditions = {
      length: password.length >= 8,
      upper: count(password, /[A-Z]/g) >= 1,
      lower: count(password, /[a-z]/g) >= 1,
      number: count(password, /[0-9]/g) >= 1,
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      equal: password === confirmPassword
    };

    return {
      valid: Object.values(conditions).every(Boolean),
      message: "Password does not meet the required rules."
    };
  }

  function checkRegister() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const nameCheck = checkName(name);
    if (!nameCheck.valid) return { valid: false, error: nameCheck.message };

    const emailCheck = checkEmail(email);
    if (!emailCheck.valid) return { valid: false, error: emailCheck.message };

    const passwordCheck = checkPassword(password, confirmPassword);
    if (!passwordCheck.valid) return { valid: false, error: passwordCheck.message };

    return { valid: true };
  }

  window.handleRegister = function (e) {
    e.preventDefault();

    const validation = checkRegister();
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    apiPost('/auth/register', { name, email, password })
      .then(function (data) {
        localStorage.setItem('dn_token', data.access_token);
        return apiGet('/users/profile');
      })
      .then(function (profile) {
        localStorage.setItem('dn_user_id', profile.id);
        window.location.href = 'tasks.html';
      })
      .catch(function () {
        alert("Registration failed. Email may already be in use.");
      });
  };

});