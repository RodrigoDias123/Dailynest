/* ── Status conversion helpers ──────────────────────────── */
var statusMap = {
  'not-started': 'Not started',
  'in-progress':  'In progress',
  'completed':    'Completed'
};

function dbToFrontend(s) {
  var map = { 'Not-Started': 'not-started', 'In-Progress': 'in-progress', 'Completed': 'completed' };
  return map[s] || 'not-started';
}

function frontendToDb(s) {
  var map = { 'not-started': 'Not-Started', 'in-progress': 'In-Progress', 'completed': 'Completed' };
  return map[s] || 'Not-Started';
}

/* ── Load tasks from API ────────────────────────────────── */
function _fetchTasks() {
  var ws = typeof getWorkspace === 'function' ? getWorkspace() : 'Work';
  return apiGet('/tasks/?category=' + encodeURIComponent(ws));
}

(function loadTasks() {
  _fetchTasks().then(function (tasks) {
    var tbody = document.getElementById('taskTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    tasks.forEach(function (t) {
      tbody.insertAdjacentHTML('beforeend',
        buildRow({ id: t.id, name: t.title, status: dbToFrontend(t.status),
                   priority: t.priority || 'medium', dueDate: null, description: t.description }));
    });
    updateStatCards();
  }).catch(function () { /* backend unavailable — start with empty list */ });
}());

function reloadWorkspace() {
  var tbody = document.getElementById('taskTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  _fetchTasks().then(function (tasks) {
    tasks.forEach(function (t) {
      tbody.insertAdjacentHTML('beforeend',
        buildRow({ id: t.id, name: t.title, status: dbToFrontend(t.status),
                   priority: t.priority || 'medium', dueDate: null, description: t.description }));
    });
    updateStatCards();
  }).catch(function () { updateStatCards(); });
}

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

var priorityLabel = { high: 'High', medium: 'Medium', low: 'Low' };

function buildRow(task) {
  var label    = statusMap[task.status] || 'Not started';
  var dateStr  = task.dueDate ? formatDate(task.dueDate) : 'No date';
  var id       = task.id || ('local-' + _taskIdCounter++);
  var isDone   = task.status === 'completed';
  var priority = task.priority || 'medium';
  var pLabel   = priorityLabel[priority] || 'Medium';

  return '<tr'
    + ' data-id="'       + id                                   + '"'
    + ' data-status="'   + task.status                          + '"'
    + ' data-priority="' + priority                             + '"'
    + ' data-name="'     + escapeHtml(task.name)                + '"'
    + ' data-due="'      + escapeHtml(task.dueDate      || '')  + '"'
    + ' data-desc="'     + escapeHtml(task.description  || '')  + '">'
    + '<td class="task-check-cell"><input type="checkbox" class="task-check"'
    + (isDone ? ' checked' : '')
    + ' onchange="markComplete(this)" title="Mark as complete"></td>'
    + '<td><span class="task-name"' + (isDone ? ' style="text-decoration:line-through;color:var(--color-text-muted)"' : '') + '>' + escapeHtml(task.name) + '</span></td>'
    + '<td><span class="status-badge ' + task.status + '"><span class="dot"></span>' + label + '</span></td>'
    + '<td><span class="priority-badge ' + priority + '">' + pLabel + '</span></td>'
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

/* ── Filter state ────────────────────────────────────────── */
var filterSearch = '';   // current text search query
var filterStatus = '';   // '' | 'pending' | 'done'

function onSearchInput(value) {
  filterSearch = value;
  filterTasks();
}

function onStatusFilterChange(value) {
  filterStatus = value;
  filterTasks();
}

function filterTasks() {
  var priorityVal = (document.getElementById('priorityFilter') || {}).value || '';
  var tbody = document.getElementById('taskTableBody');
  if (!tbody) return;

  var rows = tbody.querySelectorAll('tr');
  var visible = 0;

  rows.forEach(function (row) {
    var name     = (row.querySelector('.task-name') || {}).textContent || '';
    var status   = row.getAttribute('data-status')   || '';
    var priority = row.getAttribute('data-priority') || '';

    var matchSearch   = !filterSearch || name.toLowerCase().includes(filterSearch.toLowerCase());

    var matchStatus;
    if (!filterStatus) {
      matchStatus = true;
    } else if (filterStatus === 'pending') {
      matchStatus = status === 'not-started' || status === 'in-progress';
    } else if (filterStatus === 'done') {
      matchStatus = status === 'completed';
    } else {
      matchStatus = true;
    }

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

function markComplete(cb) {
  var row = cb.closest('tr');
  if (!row) return;
  var id        = row.getAttribute('data-id');
  var newStatus = cb.checked ? 'completed' : 'not-started';

  if (id && !String(id).startsWith('local-')) {
    apiPatch('/tasks/' + id, { status: frontendToDb(newStatus) }).catch(function () { /* update locally only */ });
  }

  row.setAttribute('data-status', newStatus);

  var label = statusMap[newStatus] || 'Not started';
  var badge = row.querySelector('.status-badge');
  if (badge) {
    badge.className = 'status-badge ' + newStatus;
    badge.innerHTML = '<span class="dot"></span>' + label;
  }

  var taskName = row.querySelector('.task-name');
  if (taskName) {
    taskName.style.textDecoration = cb.checked ? 'line-through' : '';
    taskName.style.color = cb.checked ? 'var(--color-text-muted)' : '';
  }

  updateStatCards();
}

function deleteTask(btn) {
  var row = btn.closest('tr');
  if (!row) return;
  var id   = row.getAttribute('data-id');
  var name = row.getAttribute('data-name') || 'this task';

  toast.confirm('Delete "' + name + '"? This cannot be undone.', function () {
    if (id && !String(id).startsWith('local-')) {
      apiDelete('/tasks/' + id).catch(function () {});
    }
    row.remove();
    updateStatCards();
    toast.error('Task deleted.');
  }, { title: 'Delete Task', confirmLabel: 'Delete' });
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
    description: description || null,
    category:    typeof getWorkspace === 'function' ? getWorkspace() : 'Work',
    status:      frontendToDb(status),
    priority:    priority
  };

  if (_editingRow) {
    // ── EDIT MODE ── PUT /tasks/{id}
    var id = _editingRow.getAttribute('data-id');
    var row = _editingRow;

    if (id && !String(id).startsWith('local-')) {
      apiPatch('/tasks/' + id, { title: payload.title, description: payload.description, category: payload.category, status: payload.status, priority: priority }).catch(function () { /* fallback: update locally only */ });
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
    var pBadge = row.querySelector('.priority-badge');
    if (pBadge) {
      pBadge.className = 'priority-badge ' + priority;
      pBadge.textContent = priorityLabel[priority] || 'Medium';
    }
    row.querySelector('.due-date').innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
      + '<rect x="3" y="4" width="18" height="18" rx="2"/>'
      + '<line x1="16" y1="2" x2="16" y2="6"/>'
      + '<line x1="8" y1="2" x2="8" y2="6"/>'
      + '<line x1="3" y1="10" x2="21" y2="10"/></svg>' + escapeHtml(dateStr);

    toast.success('Task updated.');
    _editingRow = null;

  } else {
    // ── CREATE MODE ── POST /tasks/
    apiPost('/tasks/', payload)
      .then(function (created) {
        var tbody = document.getElementById('taskTableBody');
        if (tbody) tbody.insertAdjacentHTML('beforeend',
          buildRow({ id: created.id, name: created.title, status: status,
                     priority: priority, dueDate: dueDate,
                     description: created.description }));
        updateStatCards();
        toast.success('Task created.');
      })
      .catch(function () {
        var tbody = document.getElementById('taskTableBody');
        if (tbody) tbody.insertAdjacentHTML('beforeend',
          buildRow({ name: name, status: status, priority: priority,
                     dueDate: dueDate, description: description }));
        updateStatCards();
        toast.success('Task created.');
      });
  }

  closeModal('createTask');
  document.getElementById('createTaskForm').reset();
  updateStatCards();
}

