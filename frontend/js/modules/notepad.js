/* ── Notepad ─────────────────────────────────────────────────
   Two-panel: note list (left) + editor (right)
   API: GET/POST /notes, PUT /notes/{id}, DELETE /notes/{id}
   Fallback: localStorage when backend is unavailable
──────────────────────────────────────────────────────────── */

var NOTES = [];
var _selectedNoteId = null;
var _localIdCounter  = 1;
var _isDirty         = false;
var _isPendingNew    = false;

/* ── Helpers ─────────────────────────────────────────────── */

function escNp(str) {
  var d = document.createElement('div');
  d.appendChild(document.createTextNode(String(str || '')));
  return d.innerHTML;
}

function truncate(str, len) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
}

function npGet(id) {
  var el = document.getElementById(id);
  return el;
}

/* ── Persist to / restore from localStorage ──────────────── */

function persistLocal() {
  try { localStorage.setItem('dn_notes', JSON.stringify(NOTES)); } catch (e) {}
}

function loadFromLocal() {
  try {
    var raw = localStorage.getItem('dn_notes');
    if (raw) {
      NOTES = JSON.parse(raw);
      if (NOTES.length) {
        _localIdCounter = NOTES.reduce(function (m, n) {
          var num = parseInt(String(n.id).replace('local-', ''), 10);
          return isNaN(num) ? m : Math.max(m, num + 1);
        }, _localIdCounter);
      }
    }
  } catch (e) { NOTES = []; }
}

/* ── Load notes from API ─────────────────────────────────── */

function reloadWorkspace() {
  _selectedNoteId = null;
  _isDirty = false;
  _isPendingNew = false;
  NOTES = [];
  showEditor(false);
  loadNotes();
}

function loadNotes() {
  var ws = typeof getWorkspace === 'function' ? getWorkspace() : 'Work';
  apiGet('/notepads/?category=' + encodeURIComponent(ws))
    .then(function (data) {
      NOTES = Array.isArray(data) ? data.map(function (n) {
        return { id: n.id, title: n.title, body: n.content || '' };
      }) : [];
      renderNoteList();
    })
    .catch(function () {
      loadFromLocal();
      renderNoteList();
    });
}

/* ── Render note list ────────────────────────────────────── */

function renderNoteList() {
  var list    = npGet('notesList');
  var counter = npGet('notesCount');
  if (!list) return;

  // Filter out a brand-new pending note that has no title yet
  var visibleNotes = NOTES.filter(function (note) {
    return !(_isPendingNew && String(note.id) === String(_selectedNoteId) && !note.title);
  });

  if (!visibleNotes.length) {
    list.innerHTML = '<div class="notes-empty-msg">No notes yet.<br>Click <strong>New Note</strong> to get started.</div>';
    if (counter) counter.textContent = visibleNotes.length;
    return;
  }

  if (counter) counter.textContent = visibleNotes.length;

  list.innerHTML = visibleNotes.map(function (note) {
    var isActive = String(note.id) === String(_selectedNoteId);
    var titleCls = note.title ? 'note-item-title' : 'note-item-title is-untitled';
    var preview  = truncate(note.body, 60);
    return '<div class="note-list-item' + (isActive ? ' is-active' : '') + '"'
      + ' data-note-id="' + escNp(String(note.id)) + '">'  
      + '<div class="' + titleCls + '">' + (note.title ? escNp(note.title) : 'Untitled') + '</div>'
      + '<div class="note-item-preview">' + escNp(preview || 'No content') + '</div>'
      + '</div>';
  }).join('');

  // Event delegation — avoids inline onclick quoting issues with string IDs
  list.onclick = function (e) {
    var item = e.target.closest('.note-list-item');
    if (item && item.dataset.noteId !== undefined) {
      selectNote(item.dataset.noteId);
    }
  };
}

/* ── Mobile panel switching ──────────────────────────────── */

function mobileBackToList() {
  var layout = document.querySelector('.notepad-layout');
  if (layout) layout.classList.remove('mobile-editor-open');
}

function _mobileOpenEditor() {
  if (window.innerWidth > 700) return;
  var layout = document.querySelector('.notepad-layout');
  if (layout) layout.classList.add('mobile-editor-open');
}

/* ── Select a note ───────────────────────────────────────── */

function selectNote(id) {
  // Discard a pending new note that was never given a title
  if (_isPendingNew && _selectedNoteId) {
    NOTES = NOTES.filter(function (n) { return String(n.id) !== String(_selectedNoteId); });
    persistLocal();
  }
  _selectedNoteId = id;
  _isDirty = false;
  _isPendingNew = false;

  var note = NOTES.find(function (n) { return String(n.id) === String(id); });
  if (!note) return;

  var titleEl = npGet('noteTitle');
  var bodyEl  = npGet('noteBody');
  if (titleEl) titleEl.value = note.title || '';
  if (bodyEl)  bodyEl.value  = note.body  || '';

  showEditor(true);
  _mobileOpenEditor();
  setSaveStatus('saved');
  renderNoteList(); // re-render to update active state
  updateWordCount(); // call after render so DOM is settled
}

/* ── Show/hide editor vs empty state ─────────────────────── */

function showEditor(show) {
  var content = npGet('editorContent');
  var empty   = npGet('editorEmptyState');
  if (content) content.style.display = show ? 'flex'  : 'none';
  if (empty)   empty.style.display   = show ? 'none'  : 'flex';
}

/* ── Track edits ─────────────────────────────────────────── */

function onEditorInput() {
  _isDirty = true;
  updateWordCount();
  setSaveStatus('unsaved');
}

/* Title input — auto-save pending new note when title is set ─ */

function onTitleInput() {
  onEditorInput();
  if (!_isPendingNew) return;
  var titleEl = npGet('noteTitle');
  var title   = titleEl ? titleEl.value.trim() : '';
  if (!title) return;
  // Title provided: persist the new note to the backend
  var note   = NOTES.find(function (n) { return String(n.id) === String(_selectedNoteId); });
  if (!note) return;
  var bodyEl = npGet('noteBody');
  note.title = titleEl ? titleEl.value : '';
  note.body  = bodyEl  ? bodyEl.value  : '';
  persistLocal();
  renderNoteList();
  setSaveStatus('saving');
  _persistPendingNew(note, note.title, note.body);
}

/* ── Word count ──────────────────────────────────────────── */

function updateWordCount() {
  var bodyEl = npGet('noteBody');
  var wcEl   = npGet('wordCount');
  if (!bodyEl || !wcEl) return;
  var text  = bodyEl.value.trim();
  var words = text ? text.split(/\s+/).length : 0;
  wcEl.textContent = words;
}

/* ── Save status indicator ───────────────────────────────── */

function setSaveStatus(state) {
  var el = npGet('saveStatus');
  if (!el) return;
  if (state === 'saved') {
    el.innerHTML = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px"><polyline points="20 6 9 17 4 12"/></svg>Saved';
  } else if (state === 'saving') {
    el.textContent = 'Saving…';
  } else {
    el.innerHTML = '<span class="unsaved-dot"></span>Unsaved changes';
  }
}

/* ── Create new note ─────────────────────────────────────── */

function newNote() {
  var note = { id: 'local-' + _localIdCounter++, title: '', body: '' };
  NOTES.unshift(note);
  persistLocal();
  renderNoteList();
  selectNote(note.id);
  _isPendingNew = true;   // mark as not yet saved to backend
  setSaveStatus('unsaved');
  var titleEl = npGet('noteTitle');
  if (titleEl) titleEl.focus();
  _mobileOpenEditor();
}

/* ── Persist a pending-new note to the backend ───────────── */

function _persistPendingNew(note, title, body) {
  _isPendingNew = false;
  var userId = parseInt(localStorage.getItem('dn_user_id'), 10) || 0;
  var ws = typeof getWorkspace === 'function' ? getWorkspace() : 'Work';
  apiPost('/notepads/', { title: title, content: body, category: ws, user_id: userId })
    .then(function (created) {
      if (created && created.id) { note.id = created.id; _selectedNoteId = created.id; }
      setSaveStatus('saved');
      persistLocal();
      renderNoteList();
      toast.success('Note created.');
    })
    .catch(function () {
      setSaveStatus('saved');
      toast.success('Note saved locally.');
    });
}

/* ── Save current note ───────────────────────────────────── */

function saveNote() {
  if (!_selectedNoteId) return;
  var titleEl = npGet('noteTitle');
  var bodyEl  = npGet('noteBody');
  var title   = titleEl ? titleEl.value : '';
  var body    = bodyEl  ? bodyEl.value  : '';

  var note = NOTES.find(function (n) { return n.id === _selectedNoteId; });
  if (!note) return;

  // Don't save a brand-new note until the user has provided a title
  if (_isPendingNew && !title.trim()) {
    setSaveStatus('unsaved');
    return;
  }

  note.title = title;
  note.body  = body;
  persistLocal();
  renderNoteList();
  setSaveStatus('saving');
  _isDirty = false;

  if (_isPendingNew) {
    _persistPendingNew(note, title, body);
  } else {
    apiPatch('/notepads/' + _selectedNoteId, { title: title, content: body })
      .then(function (updated) {
        if (updated && updated.id) { note.id = updated.id; _selectedNoteId = updated.id; }
        setSaveStatus('saved');
        persistLocal();
        renderNoteList();
      })
      .catch(function () {
        setSaveStatus('saved'); // saved locally
      });
  }
}

/* ── Delete current note ─────────────────────────────────── */

function deleteNote() {
  if (!_selectedNoteId) return;
  var note = NOTES.find(function (n) { return n.id === _selectedNoteId; });
  var name = (note && note.title) ? '"' + note.title + '"' : 'this note';

  toast.confirm('Delete ' + name + '? This cannot be undone.', function () {
    var idToDelete = _selectedNoteId;
    NOTES = NOTES.filter(function (n) { return n.id !== idToDelete; });
    persistLocal();
    _selectedNoteId = null;
    _isDirty = false;
    showEditor(false);
    mobileBackToList();
    renderNoteList();
    var counter = npGet('notesCount');
    if (counter) counter.textContent = NOTES.length;
    apiDelete('/notepads/' + idToDelete).catch(function () {});
    toast.success('Note deleted.');
  }, { title: 'Delete Note', confirmLabel: 'Delete' });
}

/* ── Init ────────────────────────────────────────────────── */

(function init() {
  if (!document.getElementById('notesList')) return;
  loadNotes();
})();

