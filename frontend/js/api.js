/* ── API ────────────────────────────────────────────────── */
var API_BASE = 'http://localhost:8000';

function getAuthHeaders() {
  var token = localStorage.getItem('dn_token');
  var headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  return headers;
}

function apiGet(path) {
  return fetch(API_BASE + path, {
    headers: getAuthHeaders()
  }).then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  });
}

function apiPost(path, body) {
  return fetch(API_BASE + path, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body)
  }).then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  });
}

function apiPut(path, body) {
  return fetch(API_BASE + path, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(body)
  }).then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  });
}

function apiPatch(path, body) {
  return fetch(API_BASE + path, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(body)
  }).then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  });
}

function apiDelete(path) {
  return fetch(API_BASE + path, {
    method: 'DELETE',
    headers: getAuthHeaders()
  }).then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
  });
}
