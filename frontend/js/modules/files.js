/* ============================================================
   Files Module
   ============================================================ */

var _files = [];
var _currentView = 'list';
var _activeMenuFileId = null;
var _pendingFile = null;
var _usedBytes = 0;

var MAX_FILE_BYTES  = 1 * 1024 * 1024 * 1024;  // 1 GB
var MAX_TOTAL_BYTES = 10 * 1024 * 1024 * 1024; // 10 GB

/* ── Load files from API ─────────────────────────────────── */
function reloadWorkspace() {
  loadFiles();
}

function loadFiles() {
  var ws = typeof getWorkspace === 'function' ? getWorkspace() : 'Work';
  apiGet('/files/?category=' + encodeURIComponent(ws)).then(function (data) {
    if (!Array.isArray(data) || !data.length) return;
    _files = data.map(function (f) {
      var sb = f.size_bytes || 0;
      return {
        id:        f.id,
        name:      f.filename,
        type:      guessType(f.filename),
        items:     null,
        modified:  'Synced',
        size:      sb ? formatBytes(sb) : null,
        sizeBytes: sb
      };
    });
    _usedBytes = _files.reduce(function (a, f) { return a + (f.sizeBytes || 0); }, 0);
    renderFiles(_files);
    updateStorageBar();
  }).catch(function () { /* backend unavailable */ });
}

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  renderFiles(_files);
  updateNavBadge();
  updateStorageBar();
  loadFiles();

  document.addEventListener('click', function (e) {
    var menu = document.getElementById('actionsMenu');
    if (!menu) return;
    if (!menu.contains(e.target) && !e.target.closest('.file-actions-btn')) {
      hideActionsMenu();
    }
  });
});

/* ── Render ──────────────────────────────────────────────── */
function renderFiles(list) {
  renderListView(list);
  renderGridView(list);
  updateNavBadge();

  var empty = document.getElementById('filesEmpty');
  if (empty) empty.style.display = list.length === 0 ? 'flex' : 'none';
}

function renderListView(list) {
  var tbody = document.getElementById('fileTableBody');
  if (!tbody) return;

  tbody.innerHTML = list.map(function (f) {
    return '<tr onclick="handleRowClick(event,' + f.id + ')">' +
      '<td>' +
        '<div class="file-name-cell">' +
          '<div class="file-icon ' + getIconClass(f.type) + '">' + getIconSvg(f.type) + '</div>' +
          '<div class="file-name-info">' +
            '<span class="file-name-text">' + escHtml(f.name) + '</span>' +
          '</div>' +
        '</div>' +
      '</td>' +
      '<td>' + escHtml(f.modified) + '</td>' +
      '<td>' + (f.size || '—') + '</td>' +
      '<td>' +
        '<button class="file-actions-btn" onclick="openActionsMenu(event,' + f.id + ')" title="More actions">' +
          '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>' +
          '</svg>' +
        '</button>' +
      '</td>' +
    '</tr>';
  }).join('');
}

function renderGridView(list) {
  var grid = document.getElementById('gridView');
  if (!grid) return;

  grid.innerHTML = list.map(function (f) {
    return '<div class="grid-file-card" onclick="handleFileOpen(' + f.id + ')">' +
      '<div class="file-icon ' + getIconClass(f.type) + '">' + getIconSvg(f.type) + '</div>' +
      '<span class="grid-file-name">' + escHtml(f.name) + '</span>' +
      '<span class="grid-file-meta">' + (f.size || '—') + '</span>' +
    '</div>';
  }).join('');
}

/* ── View toggle ─────────────────────────────────────────── */
function setView(view) {
  _currentView = view;
  document.getElementById('listView').style.display = view === 'list' ? '' : 'none';
  document.getElementById('gridView').style.display = view === 'grid' ? 'grid' : 'none';
  document.getElementById('listViewBtn').classList.toggle('active', view === 'list');
  document.getElementById('gridViewBtn').classList.toggle('active', view === 'grid');
}

/* ── Search/filter ───────────────────────────────────────── */
function filterFiles() {
  var q = (document.getElementById('searchInput').value || '').trim().toLowerCase();
  var filtered = q
    ? _files.filter(function (f) { return f.name.toLowerCase().includes(q); })
    : _files;
  renderFiles(filtered);
}

/* ── Row / file interaction ──────────────────────────────── */
function handleRowClick(e, id) {
  if (e.target.closest('.file-actions-btn')) return;
  handleFileOpen(id);
}

function handleFileOpen(id) {
  // placeholder for folder navigation / file preview
}

/* ── Actions menu ────────────────────────────────────────── */
function openActionsMenu(e, id) {
  e.stopPropagation();
  _activeMenuFileId = id;
  var menu = document.getElementById('actionsMenu');
  if (!menu) return;
  var rect = e.currentTarget.getBoundingClientRect();
  menu.style.display = 'block';
  var top = rect.bottom + 4;
  var left = rect.right - menu.offsetWidth;
  if (left < 8) left = 8;
  if (top + menu.offsetHeight > window.innerHeight - 8) {
    top = rect.top - menu.offsetHeight - 4;
  }
  menu.style.top  = top + 'px';
  menu.style.left = left + 'px';
}

function hideActionsMenu() {
  var menu = document.getElementById('actionsMenu');
  if (menu) menu.style.display = 'none';
  _activeMenuFileId = null;
}

function renameFile() {
  var id = _activeMenuFileId;
  hideActionsMenu();
  var f = _files.find(function (x) { return x.id === id; });
  if (!f) return;
  var newName = window.prompt('Rename "' + f.name + '":', f.name);
  if (newName && newName.trim()) {
    var oldName = f.name;
    f.name = newName.trim();
    renderFiles(applySearch());
    if (typeof id === 'number') {
      apiPatch('/files/' + id, { filename: f.name }).catch(function () {});
    }
    toast.success('"' + oldName + '" renamed to "' + f.name + '".');
  }
}

function downloadFile() {
  hideActionsMenu();
}

function deleteFile() {
  var id = _activeMenuFileId;
  hideActionsMenu();
  var f = _files.find(function (x) { return x.id === id; });
  if (!f) return;

  toast.confirm('Delete "' + f.name + '"? This cannot be undone.', function () {
    _usedBytes = Math.max(0, _usedBytes - (f.sizeBytes || 0));
    _files = _files.filter(function (x) { return x.id !== f.id; });
    renderFiles(applySearch());
    updateStorageBar();
    if (typeof id === 'number') {
      apiDelete('/files/' + id).catch(function () {});
    }
    toast.success('"' + f.name + '" deleted.');
  }, { title: 'Delete File', confirmLabel: 'Delete' });
}

/* ── Upload modal ────────────────────────────────────────── */
function openUploadModal() {
  resetUploadModal();
  openModal('upload');
}

function resetUploadModal() {
  _pendingFile = null;
  var nameInput = document.getElementById('uploadFileName');
  var fileInput = document.getElementById('fileInput');
  var dropText  = document.getElementById('dropzoneText');
  if (nameInput) nameInput.value = '';
  if (fileInput) fileInput.value = '';
  if (dropText)  dropText.textContent = 'Click to upload or drag & drop';
}

function onDragOver(e) {
  e.preventDefault();
  document.getElementById('dropzone').classList.add('drag-over');
}

function onDragLeave() {
  document.getElementById('dropzone').classList.remove('drag-over');
}

function onDrop(e) {
  e.preventDefault();
  document.getElementById('dropzone').classList.remove('drag-over');
  var file = e.dataTransfer.files[0];
  if (file) applyDroppedFile(file);
}

function onFileSelected(e) {
  var file = e.target.files[0];
  if (file) applyDroppedFile(file);
}

function applyDroppedFile(file) {
  if (file.size > MAX_FILE_BYTES) {
    toast.error('File exceeds the 1 GB limit per file.');
    return;
  }
  _pendingFile = file;
  document.getElementById('dropzoneText').textContent = file.name + ' (' + formatBytes(file.size) + ')';
  var nameInput = document.getElementById('uploadFileName');
  if (nameInput && !nameInput.value) nameInput.value = file.name;
}

function uploadFile() {
  if (!_pendingFile) {
    toast.error('Please select a file to upload.');
    return;
  }
  if (_usedBytes + _pendingFile.size > MAX_TOTAL_BYTES) {
    toast.error('Storage full. Maximum storage is 10 GB.');
    return;
  }

  var name = (document.getElementById('uploadFileName').value || '').trim() || _pendingFile.name;
  var sizeBytes = _pendingFile.size;
  _usedBytes += sizeBytes;

  var newFile = {
    id:        Date.now(),
    name:      name,
    type:      guessType(name),
    items:     null,
    modified:  'Just now',
    size:      formatBytes(sizeBytes),
    sizeBytes: sizeBytes
  };

  _files.unshift(newFile);
  renderFiles(applySearch());
  updateStorageBar();

  var userId = parseInt(localStorage.getItem('dn_user_id'), 10) || 0;
  var ws = typeof getWorkspace === 'function' ? getWorkspace() : 'Work';
  apiPost('/files/', { filename: name, filepath: name, category: ws, user_id: userId })
    .then(function (created) {
      if (created && created.id) newFile.id = created.id;
    })
    .catch(function () {});

  resetUploadModal();
  closeModal('upload');
  toast.success('"' + name + '" uploaded.');
}

/* ── Breadcrumb ──────────────────────────────────────────── */
function navigateTo(target) {
  if (target === 'root') {
    document.getElementById('breadcrumbCurrent').textContent = 'My Files';
  }
}

/* ── Helpers ─────────────────────────────────────────────── */
function applySearch() {
  var q = (document.getElementById('searchInput').value || '').trim().toLowerCase();
  return q ? _files.filter(function (f) { return f.name.toLowerCase().includes(q); }) : _files;
}

function updateNavBadge() {
  var badge = document.getElementById('navBadge');
  if (badge) badge.textContent = _files.length;
}

function updateStorageBar() {
  var pct   = Math.min((_usedBytes / MAX_TOTAL_BYTES) * 100, 100);
  var fill  = document.getElementById('storageBarFill');
  var label = document.getElementById('storageLabel');
  if (fill)  fill.style.width = pct.toFixed(2) + '%';
  if (label) label.textContent = formatBytes(_usedBytes) + ' used of 10 GB';
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  var k = 1024;
  var sizes = ['B', 'KB', 'MB', 'GB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function guessType(name) {
  var ext = (name || '').split('.').pop().toLowerCase();
  if (['doc','docx','txt','md'].includes(ext))               return 'document';
  if (['xls','xlsx','csv'].includes(ext))                    return 'spreadsheet';
  if (ext === 'pdf')                                          return 'pdf';
  if (['js','ts','tsx','jsx','html','css'].includes(ext))    return 'code';
  if (['png','jpg','jpeg','gif','svg','webp'].includes(ext)) return 'image';
  return 'default';
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function getIconClass(type) {
  var map = {
    folder: 'fi-folder', document: 'fi-doc', spreadsheet: 'fi-sheet',
    pdf: 'fi-pdf', code: 'fi-code', image: 'fi-image',
  };
  return map[type] || 'fi-default';
}

function getIconSvg(type) {
  switch (type) {
    case 'folder':
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>';
    case 'document':
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>';
    case 'spreadsheet':
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>';
    case 'pdf':
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/></svg>';
    case 'code':
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';
    case 'image':
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
    default:
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
  }
}
