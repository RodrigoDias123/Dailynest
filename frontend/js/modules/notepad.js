/* ── Notepad ─────────────────────────────────────────────────
   Two-panel: note list (left) + editor (right)
   API: GET/POST /notepads, PATCH /notepads/{id}, DELETE /notepads/{id}
──────────────────────────────────────────────────────────── */

var NOTES = [];
var _selectedNoteId = null;
var _isDirty        = false;
var _isPendingNew   = false;

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
  return document.getElementById(id);
}

/* ── Load notes from API ─────────────────────────────────── */

function reloadWorkspace() {
  _selectedNoteId = null;
  _isDirty        = false;
  _isPendingNew   = false;
  NOTES           = [];
  showEditor(false);
  loadNotes();
}

function loadNotes() {
  var ws = typeof getWorkspace === 'function' ? getWorkspace() : 'Work';
  apiGet('/notepads/?category=' + encodeURIComponent(ws))
    .then(function (data) {
      NOTES = Array.isArray(data) ? data.map(function (n) {
        return { id: n.id, title: n.title, body: n.content || '', wordCount: wordCountOf(n.content || '') };
      }) : [];
      renderNoteList();
    })
    .catch(function () {
      NOTES = [];
      renderNoteList();
      toast.error('Failed to load notes from server');
    });
}

/* ── Word count helper ───────────────────────────────────── */

function wordCountOf(text) {
  var t = (text || '').trim();
  return t ? t.split(/\s+/).length : 0;
}

/* ── Render note list ────────────────────────────────────── */

function renderNoteList() {
  var list    = npGet('notesList');
  var counter = npGet('notesCount');
  if (!list) return;

  if (!NOTES.length) {
    list.innerHTML = '<div class="notes-empty-msg">No notes yet.<br>Click <strong>New Note</strong> to get started.</div>';
    if (counter) counter.textContent = 0;
    return;
  }

  if (counter) counter.textContent = NOTES.length;

  list.innerHTML = NOTES.map(function (note) {
    var isActive = String(note.id) === String(_selectedNoteId);
    var titleCls = note.title ? 'note-item-title' : 'note-item-title is-untitled';
    var preview  = truncate(note.body, 60);
    return '<div class="note-list-item' + (isActive ? ' is-active' : '') + '"'
      + ' data-note-id="' + escNp(String(note.id)) + '">'
      + '<div class="' + titleCls + '">' + (note.title ? escNp(note.title) : 'Untitled') + '</div>'
      + '<div class="note-item-preview">' + escNp(preview || 'No content') + '</div>'
      + '</div>';
  }).join('');

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
  _selectedNoteId = id;
  _isDirty        = false;

  var note = NOTES.find(function (n) { return String(n.id) === String(id); });
  if (!note) return;

  npGet('noteTitle').value = note.title || '';
  npGet('noteBody').value  = note.body  || '';

  showEditor(true);
  _mobileOpenEditor();
  setSaveStatus('saved');
  renderNoteList();
  updateWordCount();
}

/* ── Show/hide editor ────────────────────────────────────── */

function showEditor(show) {
  var content = npGet('editorContent');
  var empty   = npGet('editorEmptyState');
  if (content) content.style.display = show ? 'flex' : 'none';
  if (empty)   empty.style.display   = show ? 'none' : 'flex';
}

/* ── Track edits ─────────────────────────────────────────── */

function onEditorInput() {
  _isDirty = true;
  updateWordCount();
  setSaveStatus('unsaved');
}

function onTitleInput() {
  onEditorInput();
}

/* ── Word count ──────────────────────────────────────────── */

function updateWordCount() {
  var bodyEl = npGet('noteBody');
  var wcEl   = npGet('wordCount');
  if (!bodyEl || !wcEl) return;
  wcEl.textContent = wordCountOf(bodyEl.value);
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
  var note = { id: 'local-' + Date.now(), title: '', body: '', wordCount: 0 };
  NOTES.unshift(note);

  _selectedNoteId = note.id;
  _isPendingNew   = true;
  _isDirty        = true;

  renderNoteList();
  selectNote(note.id);
  setSaveStatus('unsaved');

  var titleEl = npGet('noteTitle');
  if (titleEl) titleEl.focus();
}

/* ── Persist new note to backend ─────────────────────────── */

function _persistPendingNew(note, title, body) {
  _isPendingNew = false;
  var ws = typeof getWorkspace === 'function' ? getWorkspace() : 'Work';
  apiPost('/notepads/', { title: title, content: body, category: ws })
    .then(function (created) {
      note.id         = created.id;
      note.wordCount  = wordCountOf(body);
      _selectedNoteId = created.id;
      setSaveStatus('saved');
      renderNoteList();
      toast.success('Note created.');
    })
    .catch(function () {
      _isPendingNew = true; // allow retry
      toast.error('Failed to save note.');
      setSaveStatus('unsaved');
    });
}

/* ── Save current note ───────────────────────────────────── */

function saveNote() {
  if (!_selectedNoteId || !_isDirty) return;

  var title = npGet('noteTitle')?.value || '';
  var body  = npGet('noteBody')?.value  || '';

  var note = NOTES.find(function (n) { return String(n.id) === String(_selectedNoteId); });
  if (!note) return;

  var prevWordCount = note.wordCount || 0;
  var nextWordCount = wordCountOf(body);

  // Only save if word count actually changed or it's a new note
  if (!_isPendingNew && nextWordCount === prevWordCount) {
    setSaveStatus('saved');
    _isDirty = false;
    return;
  }

  note.title = title;
  note.body  = body;

  setSaveStatus('saving');

  if (_isPendingNew) {
    _persistPendingNew(note, title, body);
    return;
  }

  apiPatch('/notepads/' + note.id, { title: title, content: body })
    .then(function () {
      note.wordCount = nextWordCount;
      setSaveStatus('saved');
      _isDirty = false;
      renderNoteList();
    })
    .catch(function () {
      toast.error('Failed to save note.');
      setSaveStatus('unsaved');
    });
}

/* ── Delete current note ─────────────────────────────────── */

function deleteNote() {
  if (!_selectedNoteId) return;

  var idToDelete  = _selectedNoteId;
  NOTES           = NOTES.filter(function (n) { return n.id != idToDelete; });
  _selectedNoteId = null;
  _isDirty        = false;

  showEditor(false);
  mobileBackToList();
  renderNoteList();

  apiDelete('/notepads/' + idToDelete)
    .then(function ()  { toast.error('Note deleted.'); })
    .catch(function () { toast.error('Failed to delete note.'); });
}

/* ── Init ────────────────────────────────────────────────── */

(function init() {
  if (!document.getElementById('notesList')) return;
  loadNotes();
})();