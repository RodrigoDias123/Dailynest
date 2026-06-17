/* ============================================================
   Files Module
   ============================================================ */

var _files = [
  { id: 1, name: 'Work Projects',       type: 'folder',      example: true, items: 12,   modified: 'Today',      size: null     },
  { id: 2, name: 'Design Assets',       type: 'folder',      example: true, items: 34,   modified: 'Yesterday',  size: null     },
  { id: 3, name: 'Meeting Notes.doc',   type: 'document',    example: true, items: null, modified: 'Today',      size: '24 KB'  },
  { id: 4, name: 'Q2 Report.xlsx',      type: 'spreadsheet', example: true, items: null, modified: '2 days ago', size: '118 KB' },
  { id: 5, name: 'Brand Guidelines.pdf',type: 'pdf',         example: true, items: null, modified: '3 days ago', size: '3.4 MB' },
  { id: 6, name: 'index.tsx',           type: 'code',        example: true, items: null, modified: 'Today',      size: '8 KB'   },
  { id: 7, name: 'Screenshots',         type: 'folder',      example: true, items: 7,    modified: 'Last week',  size: null     },
  { id: 8, name: 'App Mockup.png',      type: 'image',       example: true, items: null, modified: 'Last week',  size: '2.1 MB' },
];

var _currentView = 'list';
var _selectedType = null;
var _activeMenuFileId = null;

/* ── Load files from API ─────────────────────────────────── */
function loadFiles() {
  apiGet('/files/').then(function (data) {
    if (!Array.isArray(data) || !data.length) return;
    _files = data.map(function (f) {
      return {
        id:       f.id,
        name:     f.filename,
        type:     'default',
        items:    null,
        modified: 'Synced',
        size:     null
      };
    });
    renderFiles(_files);
  }).catch(function () { /* backend unavailable — keep example data */ });
}

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  renderFiles(_files);
  updateNavBadge();
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
            (f.items !== null ? '<span class="file-name-meta">' + f.items + ' items</span>' : '') +
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
      '<span class="grid-file-meta">' + (f.size || (f.items !== null ? f.items + ' items' : '—')) + '</span>' +
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

/* ── New item panel ──────────────────────────────────────── */
function selectType(card) {
  document.querySelectorAll('.type-card').forEach(function (c) { c.classList.remove('selected'); });
  card.classList.add('selected');
  _selectedType = card.dataset.type;
  updateCreateBtn();
}

function onNewNameInput() {
  updateCreateBtn();
}

function updateCreateBtn() {
  var btn = document.getElementById('createBtn');
  if (!btn) return;
  var name = (document.getElementById('newItemName').value || '').trim();
  btn.disabled = !(name && _selectedType);
}

function clearExamples() {
  _files = _files.filter(function (f) { return !f.example; });
}

function createItem() {
  var name = (document.getElementById('newItemName').value || '').trim();
  if (!name || !_selectedType) return;

  clearExamples();

  var newFile = {
    id: Date.now(),
    name: name,
    type: _selectedType,
    items: _selectedType === 'folder' ? 0 : null,
    modified: 'Just now',
    size: null,
  };

  _files.unshift(newFile);
  renderFiles(_files);

  var userId = parseInt(localStorage.getItem('dn_user_id'), 10) || 0;
  apiPost('/files/', { filename: name, filepath: name, category: 'Personal', user_id: userId })
    .then(function (created) {
      if (created && created.id) newFile.id = created.id;
    })
    .catch(function () {});

  document.getElementById('newItemName').value = '';
  document.querySelectorAll('.type-card').forEach(function (c) { c.classList.remove('selected'); });
  _selectedType = null;
  updateCreateBtn();
}

/* ── Row / file interaction ──────────────────────────────── */
function handleRowClick(e, id) {
  if (e.target.closest('.file-actions-btn')) return;
  handleFileOpen(id);
}

function handleFileOpen(id) {
  var f = _files.find(function (x) { return x.id === id; });
  if (!f) return;
  if (f.type === 'folder') {
    document.getElementById('breadcrumbCurrent').textContent = f.name;
  }
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
    f.name = newName.trim();
    renderFiles(applySearch());
    if (typeof id === 'number' && !f.example) {
      apiPatch('/files/' + id, { filename: f.name }).catch(function () {});
    }
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
  if (!window.confirm('Delete "' + f.name + '"?')) return;
  _files = _files.filter(function (x) { return x.id !== f.id; });
  renderFiles(applySearch());
  if (typeof id === 'number' && !f.example) {
    apiDelete('/files/' + id).catch(function () {});
  }
}

/* ── Upload modal ────────────────────────────────────────── */
function openUploadModal() {
  openModal('upload');
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
  document.getElementById('dropzoneText').textContent = file.name;
  var nameInput = document.getElementById('uploadFileName');
  if (!nameInput.value) nameInput.value = file.name;
}

function uploadFile() {
  var name = (document.getElementById('uploadFileName').value || '').trim();
  if (!name) {
    document.getElementById('uploadFileName').focus();
    return;
  }

  clearExamples();

  var ext = name.split('.').pop().toLowerCase();
  var type = 'default';
  if (['doc','docx','txt','md'].includes(ext))            type = 'document';
  else if (['xls','xlsx','csv'].includes(ext))            type = 'spreadsheet';
  else if (ext === 'pdf')                                  type = 'pdf';
  else if (['js','ts','tsx','jsx','html','css'].includes(ext)) type = 'code';
  else if (['png','jpg','jpeg','gif','svg','webp'].includes(ext)) type = 'image';

  _files.unshift({ id: Date.now(), name: name, type: type, items: null, modified: 'Just now', size: null });
  renderFiles(applySearch());

  document.getElementById('uploadFileName').value  = '';
  document.getElementById('uploadCategory').value  = '';
  document.getElementById('uploadDescription').value = '';
  document.getElementById('dropzoneText').textContent = 'Click to upload';
  document.getElementById('fileInput').value = '';
  closeModal('upload');
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
