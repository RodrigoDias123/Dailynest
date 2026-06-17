/* ============================================================
   Agenda — Month View
   ============================================================ */

/* ── Events (populated from API) ────────────────────────── */
var EVENTS = [];

/* ── Event helpers ───────────────────────────────────────── */
var _EVT_COLORS = ['blue', 'yellow', 'green', 'purple'];
function evtColor(id)    { return _EVT_COLORS[(id - 1) % _EVT_COLORS.length]; }
function evtDate(isoStr) { return isoStr ? isoStr.slice(0, 10) : ''; }
function evtTime(isoStr) { return isoStr ? isoStr.slice(11, 16) : ''; }

/* ── State ──────────────────────────────────────────────── */
var monthViewDate = new Date();
monthViewDate.setDate(1);
var selectedDay   = null;
var currentView   = 'week';
var weekViewDate  = new Date(); // Monday of the displayed week
var dayViewDate   = new Date(); // The displayed day
var _editingEventId = null;
/* ── View toggle ────────────────────────────────────────── */
function setView(btn) {
  var parent = btn.closest('.view-toggle');
  if (!parent) return;
  parent.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');

  var view = btn.textContent.trim().toLowerCase();
  currentView = view;

  var weekView      = document.getElementById('week-view');
  var monthView     = document.getElementById('month-view');
  var miniCalPanel  = document.getElementById('mini-cal-card');
  var upcomingPanel = document.getElementById('upcoming-panel');
  var dayEvtPanel   = document.getElementById('day-events-panel');

  var dayView = document.getElementById('day-view');

  if (view === 'month') {
    if (weekView)      weekView.style.display      = 'none';
    if (dayView)       dayView.style.display       = 'none';
    if (monthView)     monthView.style.display     = '';
    if (miniCalPanel)  miniCalPanel.style.display  = 'none';
    if (upcomingPanel) upcomingPanel.style.display = 'none';
    if (dayEvtPanel)   dayEvtPanel.style.display   = '';
    buildMonthGrid();
  } else if (view === 'day') {
    if (weekView)      weekView.style.display      = 'none';
    if (dayView)       dayView.style.display       = '';
    if (monthView)     monthView.style.display     = 'none';
    if (miniCalPanel)  miniCalPanel.style.display  = '';
    if (upcomingPanel) upcomingPanel.style.display = '';
    if (dayEvtPanel)   dayEvtPanel.style.display   = 'none';
    buildDayView();
  } else {
    if (weekView)      weekView.style.display      = '';
    if (dayView)       dayView.style.display       = 'none';
    if (monthView)     monthView.style.display     = 'none';
    if (miniCalPanel)  miniCalPanel.style.display  = '';
    if (upcomingPanel) upcomingPanel.style.display = '';
    if (dayEvtPanel)   dayEvtPanel.style.display   = 'none';
    buildWeekView();
  }
}

/* ── Build month grid ───────────────────────────────────── */
function buildMonthGrid() {
  var year  = monthViewDate.getFullYear();
  var month = monthViewDate.getMonth();

  var titleEl = document.getElementById('month-nav-title');
  if (titleEl) {
    titleEl.textContent = monthViewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  var grid = document.getElementById('month-grid-body');
  if (!grid) return;
  grid.innerHTML = '';

  var today     = new Date();
  var firstDay  = new Date(year, month, 1);
  var lastDate  = new Date(year, month + 1, 0).getDate();

  // Monday-based offset (0=Mon … 6=Sun)
  var startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1;

  var totalCells = Math.ceil((startDow + lastDate) / 7) * 7;

  for (var i = 0; i < totalCells; i++) {
    var dayOffset  = i - startDow;
    var cellDate   = new Date(year, month, 1 + dayOffset);
    var cellMonth  = cellDate.getMonth();
    var cellDay    = cellDate.getDate();
    var cellYear   = cellDate.getFullYear();
    var dateStr    = cellYear + '-' +
                     String(cellMonth + 1).padStart(2, '0') + '-' +
                     String(cellDay).padStart(2, '0');

    var isToday         = cellDate.toDateString() === today.toDateString();
    var isCurrentMonth  = cellMonth === month;
    var isSelected      = selectedDay === dateStr;
    var dayEvents       = EVENTS.filter(function (e) { return evtDate(e.start_date) === dateStr; });

    var cls = 'month-day-cell';
    if (!isCurrentMonth) cls += ' other-month';
    if (isToday)         cls += ' is-today';
    if (isSelected)      cls += ' is-selected';

    var dotsHtml = dayEvents.slice(0, 3).map(function (e) {
      return '<span class="event-dot ' + evtColor(e.id) + '"></span>';
    }).join('');

    var cell = document.createElement('div');
    cell.className       = cls;
    cell.dataset.date    = dateStr;
    cell.innerHTML =
      '<div class="month-day-num">' + cellDay + '</div>' +
      '<div class="month-day-dots">' + dotsHtml + '</div>';

    (function (ds, cd) {
      cell.addEventListener('click', function () { selectDay(ds, cd); });
    }(dateStr, cellDate));

    grid.appendChild(cell);
  }
}

/* ── Select day ─────────────────────────────────────────── */
function selectDay(dateStr, date) {
  selectedDay = dateStr;
  buildMonthGrid();

  var panel = document.getElementById('day-events-panel');
  if (!panel) return;

  var titleEl = panel.querySelector('.day-events-title');
  var listEl  = panel.querySelector('.day-events-list');

  if (titleEl) {
    titleEl.textContent = date.toLocaleDateString('en-US', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
  }

  var dayEvents = EVENTS.filter(function (e) { return evtDate(e.start_date) === dateStr; });

  if (listEl) {
    if (dayEvents.length === 0) {
      listEl.innerHTML = '<p class="no-events-msg">No events for this day.</p>';
    } else {
      var solid = { blue: '#3b82f6', yellow: '#f59e0b', green: '#22c55e', purple: '#a855f7' };
      listEl.innerHTML = dayEvents.map(function (e) {
        var color = evtColor(e.id);
        return '<div class="day-event-item">' +
          '<div class="upcoming-event-dot" style="background:' + (solid[color] || '#999') + ';"></div>' +
          '<div style="flex:1;">' +
            '<div class="upcoming-event-name">' + e.title + '</div>' +
            '<div class="upcoming-event-time">' + evtTime(e.start_date) + '</div>' +
          '</div>' +
          '<button class="event-edit-btn" onclick="openEventModal(\'edit\',' + e.id + ')" title="Edit">&#9998;</button>' +
        '</div>';
      }).join('');
    }
  }
}

/* ── Month navigation ───────────────────────────────────── */
function prevMonth() {
  monthViewDate.setMonth(monthViewDate.getMonth() - 1);
  selectedDay = null;
  buildMonthGrid();
  resetDayPanel();
  updateDateRangeLabel();
}

function nextMonth() {
  monthViewDate.setMonth(monthViewDate.getMonth() + 1);
  selectedDay = null;
  buildMonthGrid();
  resetDayPanel();
  updateDateRangeLabel();
}

function resetDayPanel() {
  var panel = document.getElementById('day-events-panel');
  if (!panel) return;
  var titleEl = panel.querySelector('.day-events-title');
  var listEl  = panel.querySelector('.day-events-list');
  if (titleEl) titleEl.textContent = 'Select a day';
  if (listEl)  listEl.innerHTML    = '<p class="no-events-msg">Click on a day to see its events.</p>';
}

/* ── Update date range label ─────────────────────────── */
function updateDateRangeLabel() {
  var el = document.getElementById('agenda-date-range-text');
  if (!el) return;
  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  if (currentView === 'week') {
    var end = new Date(weekViewDate);
    end.setDate(weekViewDate.getDate() + 6);
    if (weekViewDate.getMonth() === end.getMonth()) {
      el.textContent = weekViewDate.getDate() + ' – ' + end.getDate() + ' ' +
        MONTHS[end.getMonth()] + ' ' + end.getFullYear();
    } else {
      el.textContent = weekViewDate.getDate() + ' ' + MONTHS[weekViewDate.getMonth()] +
        ' – ' + end.getDate() + ' ' + MONTHS[end.getMonth()] + ' ' + end.getFullYear();
    }
  } else if (currentView === 'day') {
    el.textContent = dayViewDate.toLocaleDateString('en-US', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  } else {
    el.textContent = monthViewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
}

/* ── Build week view ─────────────────────────────────── */
function buildWeekView() {
  var HOURS    = [7,8,9,10,11,12,13,14,15,16,17];
  var DAY_NAMES = ['MON','TUE','WED','THU','FRI','SAT','SUN'];

  // Dates for each column
  var weekDates = [];
  for (var i = 0; i < 7; i++) {
    var d = new Date(weekViewDate);
    d.setDate(weekViewDate.getDate() + i);
    weekDates.push(d);
  }

  var today = new Date();
  today.setHours(0, 0, 0, 0);

  // Header
  var headerEl = document.getElementById('week-header');
  if (headerEl) {
    var headerHtml = '<div class="time-spacer"></div>';
    weekDates.forEach(function (d, i) {
      var isToday = d.toDateString() === today.toDateString();
      headerHtml +=
        '<div class="day-col">' +
          '<div class="day-name">' + DAY_NAMES[i] + '</div>' +
          '<div class="day-number' + (isToday ? ' today' : '') + '">' + d.getDate() + '</div>' +
        '</div>';
    });
    headerEl.innerHTML = headerHtml;
  }

  // Grid
  var gridEl = document.getElementById('week-grid');
  if (!gridEl) return;

  var gridHtml = '';
  HOURS.forEach(function (h) {
    gridHtml += '<div class="time-label">' + h + ':00</div>';
    weekDates.forEach(function (d) {
      var dateStr = d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
      var cellEvents = EVENTS.filter(function (e) {
        return evtDate(e.start_date) === dateStr &&
               parseInt(evtTime(e.start_date).split(':')[0], 10) === h;
      });
      gridHtml += '<div class="day-cell">';
      cellEvents.forEach(function (e) {
        gridHtml += '<div class="calendar-event ' + evtColor(e.id) + '" ' +
          'onclick="openEventModal(\'edit\',' + e.id + ')" style="cursor:pointer;">' +
          e.title + '<br/>' + evtTime(e.start_date) + '</div>';
      });
      gridHtml += '</div>';
    });
  });
  gridEl.innerHTML = gridHtml;
}

/* ── Build day view ───────────────────────────────────── */
function buildDayView() {
  var dateStr = dayViewDate.getFullYear() + '-' +
    String(dayViewDate.getMonth() + 1).padStart(2, '0') + '-' +
    String(dayViewDate.getDate()).padStart(2, '0');

  var titleEl = document.getElementById('day-view-title');
  if (titleEl) {
    titleEl.textContent = dayViewDate.toLocaleDateString('en-US', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  var listEl = document.getElementById('day-view-list');
  if (!listEl) return;

  var dayEvents = EVENTS.filter(function (e) { return evtDate(e.start_date) === dateStr; });
  dayEvents.sort(function (a, b) {
    return evtTime(a.start_date).localeCompare(evtTime(b.start_date));
  });

  if (dayEvents.length === 0) {
    listEl.innerHTML = '<p class="no-events-msg">No events for this day.</p>';
    return;
  }

  listEl.innerHTML = dayEvents.map(function (e) {
    return '<div class="day-view-event" onclick="openEventModal(\'edit\',' + e.id + ')" style="cursor:pointer;">' +
      '<div class="day-view-event-time">' + evtTime(e.start_date) + '</div>' +
      '<div class="day-view-event-body calendar-event ' + evtColor(e.id) + '">' +
        '<div class="day-view-event-title">' + e.title + '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

/* ── Period navigation (toolbar arrows) ──────────────────── */
function prevPeriod() {
  if (currentView === 'week') {
    weekViewDate.setDate(weekViewDate.getDate() - 7);
    buildWeekView();
  } else if (currentView === 'day') {
    dayViewDate.setDate(dayViewDate.getDate() - 1);
    buildDayView();
  } else {
    prevMonth();
    return;
  }
  updateDateRangeLabel();
}

function nextPeriod() {
  if (currentView === 'week') {
    weekViewDate.setDate(weekViewDate.getDate() + 7);
    buildWeekView();
  } else if (currentView === 'day') {
    dayViewDate.setDate(dayViewDate.getDate() + 1);
    buildDayView();
  } else {
    nextMonth();
    return;
  }
  updateDateRangeLabel();
}

/* ── Rebuild current visible view ────────────────────────── */
function rebuildViews() {
  if (currentView === 'week')       buildWeekView();
  else if (currentView === 'day')   buildDayView();
  else                              buildMonthGrid();
}

/* ── Map backend agenda to frontend event format ─────────── */
function agendaToEvent(a) {
  return {
    id:          a.id,
    title:       a.event,
    start_date:  a.date + 'T00:00:00',
    end_date:    a.date + 'T01:00:00',
    description: ''
  };
}

/* ── Load events from API (with fallback sample data) ────── */
function loadEvents() {
  apiGet('/agendas/').then(function (data) {
    EVENTS = Array.isArray(data) ? data.map(agendaToEvent) : [];
    rebuildViews();
    renderUpcomingPanel();
  }).catch(function () {
    // Fallback when the backend is not running
    EVENTS = [
      { id: 1, title: 'Team Meeting',    start_date: '2026-06-01T09:00:00', end_date: '2026-06-01T10:00:00', description: '' },
      { id: 2, title: 'Project Review',  start_date: '2026-06-05T10:00:00', end_date: '2026-06-05T11:00:00', description: '' },
      { id: 3, title: 'Lunch Break',     start_date: '2026-06-05T12:00:00', end_date: '2026-06-05T13:00:00', description: '' },
      { id: 4, title: 'Client Call',     start_date: '2026-06-10T14:00:00', end_date: '2026-06-10T15:00:00', description: '' },
      { id: 5, title: 'Sprint Planning', start_date: '2026-06-15T09:30:00', end_date: '2026-06-15T10:30:00', description: '' },
      { id: 6, title: 'Design Review',   start_date: '2026-06-20T11:00:00', end_date: '2026-06-20T12:00:00', description: '' },
      { id: 7, title: '1:1 Meeting',     start_date: '2026-06-22T16:00:00', end_date: '2026-06-22T17:00:00', description: '' },
      { id: 8, title: 'Release Demo',    start_date: '2026-06-28T15:00:00', end_date: '2026-06-28T16:00:00', description: '' },
    ];
    rebuildViews();
    renderUpcomingPanel();
  });
}

/* ── Open / close event modal ────────────────────────────── */
function openEventModal(mode, eventId) {
  _editingEventId = null;
  var titleEl  = document.getElementById('eventModalTitle');
  var submitEl = document.getElementById('eventSubmitBtn');
  var form     = document.getElementById('eventForm');
  if (form) form.reset();

  if (mode === 'edit' && eventId != null) {
    var ev = EVENTS.filter(function (e) { return e.id === eventId; })[0];
    if (!ev) return;
    _editingEventId = eventId;
    if (titleEl)  titleEl.textContent  = 'Edit Event';
    if (submitEl) submitEl.textContent = 'Save Changes';
    var titleInput = document.getElementById('eventTitle');
    var descInput  = document.getElementById('eventDescription');
    var startInput = document.getElementById('eventStartDate');
    var endInput   = document.getElementById('eventEndDate');
    if (titleInput) titleInput.value = ev.title        || '';
    if (descInput)  descInput.value  = ev.description  || '';
    if (startInput) startInput.value = ev.start_date ? ev.start_date.slice(0, 16) : '';
    if (endInput)   endInput.value   = ev.end_date   ? ev.end_date.slice(0, 16)   : '';
  } else {
    if (titleEl)  titleEl.textContent  = 'New Event';
    if (submitEl) submitEl.textContent = 'Create Event';
  }
  openModal('createEvent');
}

function closeEventModal() {
  closeModal('createEvent');
}

/* ── Submit event form (create or edit) ──────────────────── */
function submitEventForm(e) {
  e.preventDefault();
  var title     = (document.getElementById('eventTitle')       || {}).value || '';
  var desc      = (document.getElementById('eventDescription') || {}).value || '';
  var startDate = (document.getElementById('eventStartDate')   || {}).value || '';
  var endDate   = (document.getElementById('eventEndDate')     || {}).value || '';

  if (!title || !startDate || !endDate) return;

  // ── Apply locally first (synchronous) ──────────────────
  if (_editingEventId != null) {
    for (var i = 0; i < EVENTS.length; i++) {
      if (EVENTS[i].id === _editingEventId) {
        EVENTS[i].title       = title;
        EVENTS[i].description = desc;
        EVENTS[i].start_date  = startDate;
        EVENTS[i].end_date    = endDate;
        break;
      }
    }
  } else {
    var newId = EVENTS.reduce(function (max, ev) { return Math.max(max, ev.id || 0); }, 0) + 1;
    EVENTS.push({ id: newId, title: title, description: desc, start_date: startDate, end_date: endDate });
  }

  closeEventModal();
  rebuildViews();
  renderUpcomingPanel();
  if (selectedDay) {
    var panel = document.getElementById('day-events-panel');
    if (panel && panel.style.display !== 'none') selectDay(selectedDay, new Date(selectedDay));
  }

  // ── Sync to API in background ───────────────────────────
  var dateOnly = startDate ? startDate.slice(0, 10) : '';
  var apiPayload = { event: title, date: dateOnly, category: 'Personal' };
  if (_editingEventId != null) {
    apiPatch('/agendas/' + _editingEventId, apiPayload).catch(function () {});
  } else {
    var userId = parseInt(localStorage.getItem('dn_user_id'), 10) || 0;
    apiPost('/agendas/', Object.assign({ user_id: userId }, apiPayload))
      .then(function (created) {
        // Replace the locally-created event with the server response (gets real id)
        if (created && created.id) {
          var serverEvt = agendaToEvent(created);
          var localId = EVENTS[EVENTS.length - 1].id;
          for (var j = 0; j < EVENTS.length; j++) {
            if (EVENTS[j].id === localId) { EVENTS[j] = serverEvt; break; }
          }
        }
      })
      .catch(function () {});
  }
}

/* ── Render upcoming panel (sorted by start_date) ────────── */
function renderUpcomingPanel() {
  var listEl = document.getElementById('upcoming-list');
  if (!listEl) return;

  var now = new Date();
  var solid = { blue: '#3b82f6', yellow: '#f59e0b', green: '#22c55e', purple: '#a855f7' };

  var upcoming = EVENTS
    .filter(function (e) { return e.start_date && new Date(e.start_date) >= now; })
    .sort(function (a, b) { return new Date(a.start_date) - new Date(b.start_date); })
    .slice(0, 5);

  if (upcoming.length === 0) {
    listEl.innerHTML = '<p class="no-events-msg">No upcoming events.</p>';
    return;
  }

  listEl.innerHTML = upcoming.map(function (e) {
    var color = evtColor(e.id);
    var d     = new Date(e.start_date);
    var label = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }) +
                ' \u00b7 ' + evtTime(e.start_date);
    return '<div class="upcoming-event">' +
      '<div class="upcoming-event-dot" style="background:' + (solid[color] || '#999') + ';"></div>' +
      '<div>' +
        '<div class="upcoming-event-name">' + e.title + '</div>' +
        '<div class="upcoming-event-time">' + label + '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

/* ── Initialise ─────────────────────────────────────────── */
(function init() {
  var now = new Date();
  now.setHours(0, 0, 0, 0);

  // Monday of this week
  var dow  = now.getDay();
  var diff = dow === 0 ? -6 : 1 - dow;
  weekViewDate = new Date(now);
  weekViewDate.setDate(now.getDate() + diff);

  dayViewDate = new Date(now);

  buildWeekView();
  updateDateRangeLabel();
  loadEvents();
}());
