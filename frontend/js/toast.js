/* ── Toast Notifications ─────────────────────────────────── */
var toast = (function () {
  var container;

  function getContainer() {
    if (!container) {
      container = document.createElement('div');
      container.id = 'dn-toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  var icons = {
    success: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error:   '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    warning: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info:    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
  };

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
  }

  function dismiss(el) {
    el.classList.add('dn-toast-hide');
    el.addEventListener('transitionend', function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, { once: true });
  }

  function show(type, message, duration) {
    duration = duration || 4000;
    var c = getContainer();

    var el = document.createElement('div');
    el.className = 'dn-toast dn-toast-' + type;
    el.setAttribute('role', 'alert');
    el.innerHTML =
      '<div class="dn-toast-icon">' + icons[type] + '</div>' +
      '<span class="dn-toast-msg">' + escapeHtml(message) + '</span>' +
      '<button class="dn-toast-close" aria-label="Close">' +
        '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '</button>' +
      '<div class="dn-toast-progress"></div>';

    var progressEl = el.querySelector('.dn-toast-progress');
    progressEl.style.animationDuration = duration + 'ms';

    c.appendChild(el);

    var startTime = Date.now();
    var remaining = duration;
    var timer;

    function startTimer() {
      startTime = Date.now();
      timer = setTimeout(function () { dismiss(el); }, remaining);
      progressEl.style.animationPlayState = 'running';
    }

    el.querySelector('.dn-toast-close').addEventListener('click', function () {
      clearTimeout(timer);
      dismiss(el);
    });

    el.addEventListener('mouseenter', function () {
      clearTimeout(timer);
      remaining -= (Date.now() - startTime);
      if (remaining < 0) remaining = 0;
      progressEl.style.animationPlayState = 'paused';
    });

    el.addEventListener('mouseleave', function () {
      startTimer();
    });

    requestAnimationFrame(function () {
      el.classList.add('dn-toast-show');
    });

    startTimer();
  }

  function confirm(message, onConfirm, opts) {
    opts = opts || {};
    var title        = opts.title        || 'Are you sure?';
    var confirmLabel = opts.confirmLabel || 'Confirm';
    var confirmCls   = opts.confirmCls   || 'btn-danger';

    var overlay = document.createElement('div');
    overlay.className = 'dn-confirm-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<div class="dn-confirm-box">' +
        '<div class="dn-confirm-title">' + escapeHtml(title) + '</div>' +
        '<div class="dn-confirm-msg">'   + escapeHtml(message) + '</div>' +
        '<div class="dn-confirm-actions">' +
          '<button class="btn btn-ghost dn-confirm-cancel">Cancel</button>' +
          '<button class="btn ' + confirmCls + ' dn-confirm-ok">' + escapeHtml(confirmLabel) + '</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    function close() {
      overlay.classList.add('dn-confirm-hide');
      overlay.addEventListener('transitionend', function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, { once: true });
    }

    overlay.querySelector('.dn-confirm-cancel').addEventListener('click', close);

    overlay.querySelector('.dn-confirm-ok').addEventListener('click', function () {
      close();
      if (onConfirm) onConfirm();
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    function onEsc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onEsc); }
    }
    document.addEventListener('keydown', onEsc);

    requestAnimationFrame(function () {
      overlay.classList.add('dn-confirm-show');
    });
  }

  return {
    success: function (msg, dur) { show('success', msg, dur); },
    error:   function (msg, dur) { show('error',   msg, dur); },
    warning: function (msg, dur) { show('warning', msg, dur); },
    info:    function (msg, dur) { show('info',    msg, dur); },
    confirm: confirm
  };
}());
