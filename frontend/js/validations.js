document.addEventListener("DOMContentLoaded", function () {

  function count(str, regex) {
    return (str.match(regex) || []).length;
  }

  function checkName(name) {
    const conditions = {
      min: name.length >= 3,
      max: name.length <= 100,
      number: count(name, /[0-9]/g) === 0,
      special: count(name, /[!@#$%^&*(),.?":{}|<>]/g) === 0
    };

    return {
      valid: Object.values(conditions).every(Boolean),
      message: "Invalid name: 3–100 chars, no numbers or special symbols."
    };
  }

  function checkEmail(email) {
    const valid = /\S+@\S+\.\S+/;
    const ok = email.length >= 7 && email.length <= 100 && valid.test(email);
    
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
      toast.error(validation.error);
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
        toast.error("Registration failed. Email may already be in use.");
      });
  };

});

function handleLogin(e) {
  e.preventDefault();

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const remember = document.querySelector('input[name="remember"]').checked;

  if (remember) {
    localStorage.setItem('remember_email', email);
  } else {
    localStorage.removeItem('remember_email');
  }

  apiPost('/auth/login', { email, password })
    .then(data => {
      localStorage.setItem('token', data.access_token);

      return Promise.all([
        apiGet('/users/profile'),
        apiGet('/tasks'),
        apiGet('/agendas'),
        apiGet('/projects')
      ]);
    })
    .then(([profile, tasks, agendas, projects]) => {
      localStorage.setItem('user_id', profile.id);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      localStorage.setItem('agendas', JSON.stringify(agendas));
      localStorage.setItem('projects', JSON.stringify(projects));

      window.location.href = 'tasks.html';
    })
    .catch(() => {
      toast.error('Login failed. Check your credentials and try again.');
    });
}
