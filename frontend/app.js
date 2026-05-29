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

/* ── API ────────────────────────────────────────────────── */
var API_BASE = 'http://localhost:8000';

function apiPost(path, body) {
  return fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  });
}

function apiPut(path, body) {
  return fetch(API_BASE + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  });
}

function apiDelete(path) {
  return fetch(API_BASE + path, { method: 'DELETE' }).then(function (r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
  });
}

/* ── Task helpers ───────────────────────────────────────── */
var statusMap = {
  'not-started': 'Not started',
  'in-progress':  'In progress',
  'completed':    'Completed'
};

// Internal counter for local row IDs
var _taskIdCounter = 1;

function formatDate(dateStr) {
  if (!dateStr) return 'No date';
  var d = new Date(dateStr + 'T00:00:00');
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var diff = d - today;
  if (diff === 0) return 'Today';
  if (diff === 86400000) return 'Tomorrow';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

function buildRow(task) {
  var label   = statusMap[task.status] || 'Not started';
  var dateStr = task.dueDate ? formatDate(task.dueDate) : 'No date';
  var id      = task.id || ('local-' + _taskIdCounter++);

  return '<tr'
    + ' data-id="'       + id                                   + '"'
    + ' data-status="'   + task.status                          + '"'
    + ' data-priority="' + (task.priority   || 'medium')        + '"'
    + ' data-name="'     + escapeHtml(task.name)                + '"'
    + ' data-due="'      + escapeHtml(task.dueDate      || '')  + '"'
    + ' data-desc="'     + escapeHtml(task.description  || '')  + '">'
    + '<td><span class="task-name">' + escapeHtml(task.name) + '</span></td>'
    + '<td><span class="status-badge ' + task.status + '"><span class="dot"></span>' + label + '</span></td>'
    + '<td><span class="due-date">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>'
    + '<line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
    + escapeHtml(dateStr) + '</span></td>'
    + '<td><span class="created-at">Just now</span></td>'
    + '<td class="task-actions">'
    + '<button class="action-btn edit-btn" onclick="openEditModal(this)" title="Edit task">'
    + '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'
    + '</button>'
    + '<button class="action-btn delete-btn" onclick="deleteTask(this)" title="Delete task">'
    + '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>'
    + '</button>'
    + '</td>'
    + '</tr>';
}

function updateStatCards() {
  var tbody = document.getElementById('taskTableBody');
  if (!tbody) return;

  var rows = tbody.querySelectorAll('tr');
  var total = rows.length, notStarted = 0, inProgress = 0, completed = 0;

  rows.forEach(function (row) {
    var s = row.getAttribute('data-status');
    if (s === 'not-started') notStarted++;
    else if (s === 'in-progress') inProgress++;
    else if (s === 'completed') completed++;
  });

  var set = function (id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set('statTotal',      total);
  set('statNotStarted', notStarted);
  set('statInProgress', inProgress);
  set('statCompleted',  completed);

  var countEl = document.getElementById('taskCount');
  if (countEl) countEl.textContent = 'Showing ' + total + ' of ' + total + ' task' + (total !== 1 ? 's' : '');
}

function filterTasks() {
  var searchVal   = (document.getElementById('searchInput')    || {}).value || '';
  var statusVal   = (document.getElementById('statusFilter')   || {}).value || '';
  var priorityVal = (document.getElementById('priorityFilter') || {}).value || '';
  var tbody = document.getElementById('taskTableBody');
  if (!tbody) return;

  var rows = tbody.querySelectorAll('tr');
  var visible = 0;

  rows.forEach(function (row) {
    var name     = (row.querySelector('.task-name') || {}).textContent || '';
    var status   = row.getAttribute('data-status')   || '';
    var priority = row.getAttribute('data-priority') || '';

    var matchSearch   = !searchVal   || name.toLowerCase().includes(searchVal.toLowerCase());
    var matchStatus   = !statusVal   || status === statusVal;
    var matchPriority = !priorityVal || priority === priorityVal;

    var show = matchSearch && matchStatus && matchPriority;
    row.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  var countEl = document.getElementById('taskCount');
  if (countEl) countEl.textContent = 'Showing ' + visible + ' of ' + rows.length + ' task' + (rows.length !== 1 ? 's' : '');
}

/* ── Create / Edit Task Form ────────────────────────────── */

// Tracks which row is being edited (null = create mode)
var _editingRow = null;

function openNewTaskModal() {
  _editingRow = null;
  var modalTitle = document.getElementById('modalTitle');
  var submitBtn  = document.getElementById('taskSubmitBtn');
  if (modalTitle) modalTitle.textContent = 'Create New Task';
  if (submitBtn)  submitBtn.textContent  = 'Create Task';
  var form = document.getElementById('createTaskForm');
  if (form) form.reset();
  openModal('createTask');
}

function openEditModal(btn) {
  var row = btn.closest('tr');
  if (!row) return;
  _editingRow = row;

  var modalTitle = document.getElementById('modalTitle');
  var submitBtn  = document.getElementById('taskSubmitBtn');
  if (modalTitle) modalTitle.textContent = 'Edit Task';
  if (submitBtn)  submitBtn.textContent  = 'Save Changes';

  document.getElementById('taskName').value        = row.getAttribute('data-name')    || '';
  document.getElementById('taskStatus').value      = row.getAttribute('data-status')  || 'not-started';
  document.getElementById('taskPriority').value    = row.getAttribute('data-priority')|| 'medium';
  document.getElementById('taskDueDate').value     = row.getAttribute('data-due')     || '';
  document.getElementById('taskDescription').value = row.getAttribute('data-desc')    || '';

  openModal('createTask');
}

function deleteTask(btn) {
  var row = btn.closest('tr');
  if (!row) return;
  var id = row.getAttribute('data-id');

  if (!window.confirm('Delete this task?')) return;

  if (id && !String(id).startsWith('local-')) {
    apiDelete('/tasks/' + id).catch(function () { /* already removed locally */ });
  }

  row.remove();
  updateStatCards();
}

function submitCreateTask(e) {
  e.preventDefault();

  var name        = document.getElementById('taskName').value.trim();
  var status      = document.getElementById('taskStatus').value;
  var priority    = document.getElementById('taskPriority').value;
  var dueDate     = document.getElementById('taskDueDate').value;
  var description = document.getElementById('taskDescription').value.trim();

  if (!name) return;

  var payload = {
    title:       name,
    status:      status,
    priority:    priority,
    due_date:    dueDate || null,
    description: description || null
  };

  if (_editingRow) {
    // ── EDIT MODE ── PUT /tasks/{id}
    var id = _editingRow.getAttribute('data-id');
    var row = _editingRow;

    if (id && !String(id).startsWith('local-')) {
      apiPut('/tasks/' + id, payload).catch(function () { /* fallback: update locally only */ });
    }

    // Update row attributes and cells locally
    row.setAttribute('data-name',     name);
    row.setAttribute('data-status',   status);
    row.setAttribute('data-priority', priority);
    row.setAttribute('data-due',      dueDate || '');
    row.setAttribute('data-desc',     description);

    var label   = statusMap[status] || 'Not started';
    var dateStr = dueDate ? formatDate(dueDate) : 'No date';

    row.querySelector('.task-name').textContent = name;
    row.querySelector('.status-badge').className = 'status-badge ' + status;
    row.querySelector('.status-badge').innerHTML =
      '<span class="dot"></span>' + label;
    row.querySelector('.due-date').innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
      + '<rect x="3" y="4" width="18" height="18" rx="2"/>'
      + '<line x1="16" y1="2" x2="16" y2="6"/>'
      + '<line x1="8" y1="2" x2="8" y2="6"/>'
      + '<line x1="3" y1="10" x2="21" y2="10"/></svg>' + escapeHtml(dateStr);

    _editingRow = null;

  } else {
    // ── CREATE MODE ── POST /tasks
    apiPost('/tasks', payload)
      .then(function (created) {
        // If API returns the created task with an id, use it
        var tbody = document.getElementById('taskTableBody');
        if (tbody) tbody.insertAdjacentHTML('beforeend',
          buildRow({ id: created.id, name: created.title, status: created.status,
                     priority: created.priority, dueDate: created.due_date,
                     description: created.description }));
        updateStatCards();
      })
      .catch(function () {
        // Offline / no backend — add locally
        var tbody = document.getElementById('taskTableBody');
        if (tbody) tbody.insertAdjacentHTML('beforeend',
          buildRow({ name: name, status: status, priority: priority,
                     dueDate: dueDate, description: description }));
        updateStatCards();
      });
  }

  closeModal('createTask');
  document.getElementById('createTaskForm').reset();
  updateStatCards();
}

/* ── Notepad ────────────────────────────────────────────── */
(function initNotepad() {
  var noteTitle = document.getElementById('noteTitle');
  var noteBody  = document.getElementById('noteBody');
  if (!noteTitle && !noteBody) return;

  // Restore saved content
  var savedTitle = localStorage.getItem('dn_note_title');
  var savedBody  = localStorage.getItem('dn_note_body');
  if (noteTitle && savedTitle) noteTitle.value = savedTitle;
  if (noteBody  && savedBody)  noteBody.value  = savedBody;

  function updateStats() {
    if (!noteBody) return;
    var text  = noteBody.value.trim();
    var words = text ? text.split(/\s+/).length : 0;
    var chars = noteBody.value.length;
    var read  = Math.max(1, Math.ceil(words / 200));

    var set = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
    set('wordCount', words);
    set('charCount', chars);
    set('readTime',  words === 0 ? 0 : read);

    var saveStatus = document.getElementById('saveStatus');
    if (saveStatus) {
      saveStatus.innerHTML = '<span class="unsaved-dot"></span> Unsaved changes';
    }
  }

  if (noteBody)  noteBody.addEventListener('input',  updateStats);
  if (noteTitle) noteTitle.addEventListener('input', updateStats);

  // Run once on load to update stats if restored
  updateStats();

  // Save
  var saveBtn = document.getElementById('saveNoteBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      var title = noteTitle ? noteTitle.value : '';
      var body  = noteBody  ? noteBody.value  : '';
      localStorage.setItem('dn_note_title', title);
      localStorage.setItem('dn_note_body',  body);

      var saveStatus = document.getElementById('saveStatus');
      if (saveStatus) {
        saveStatus.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><polyline points="20 6 9 17 4 12"/></svg> Saved';
      }
    });
  }

  // Clear
  var clearBtn = document.getElementById('clearNoteBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      if (!window.confirm('Clear the note? This cannot be undone.')) return;
      if (noteTitle) noteTitle.value = '';
      if (noteBody)  noteBody.value  = '';
      localStorage.removeItem('dn_note_title');
      localStorage.removeItem('dn_note_body');
      updateStats();
      var saveStatus = document.getElementById('saveStatus');
      if (saveStatus) saveStatus.textContent = 'Not saved yet';
    });
  }
})();
