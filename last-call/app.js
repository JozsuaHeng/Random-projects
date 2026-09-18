(() => {
  const STORAGE_KEY = 'lastcall.trials.v1';
  const SETTINGS_KEY = 'lastcall.settings.v1';
  const MS_DAY = 86400000;
  const DEFAULT_SETTINGS = { reminderDaysBefore: 1, reminderHour: 9 };

  const STATUS_LABEL = {
    today: 'Ends today — cancel now',
    tomorrow: 'Ends tomorrow — cancel today',
    soon: (d) => `${d} days left`,
    later: (d) => `${d} days left`,
    ended: (d) => (d === -1 ? 'Ended yesterday' : `Ended ${Math.abs(d)} days ago`),
    cancelled: 'Cancelled',
  };

  const el = (id) => document.getElementById(id);
  const trialForm = el('trialForm');
  const serviceInput = el('service');
  const endDateInput = el('endDate');
  const priceInput = el('price');
  const notesInput = el('notes');
  const trialList = el('trialList');
  const emptyState = el('emptyState');
  const banner = el('banner');
  const cardTemplate = el('trialCardTemplate');
  const toastEl = el('toast');
  const savedStat = el('savedStat');

  const settingsBtn = el('settingsBtn');
  const settingsOverlay = el('settingsOverlay');
  const settingsCloseBtn = el('settingsCloseBtn');
  const settingsNotifyBtn = el('settingsNotifyBtn');
  const settingsNotifyStatus = el('settingsNotifyStatus');
  const reminderDaysInput = el('reminderDays');
  const reminderHourSelect = el('reminderHour');
  const exportBtn = el('exportBtn');
  const importBtn = el('importBtn');
  const importFile = el('importFile');

  // Demo cards shown only when there's nothing real tracked yet — purely
  // illustrative (see convene/memento for the same "sample state" pattern
  // elsewhere on this shelf). Never written to localStorage.
  function buildDemoTrials() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const fmt = (offsetDays) => {
      const d = new Date(today.getTime() + offsetDays * MS_DAY);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };
    return [
      { id: 'demo-1', service: 'Some Streaming Thing', endDate: fmt(1), price: '$14.99/mo', notes: 'cancel in account settings, not the app', cancelled: false, isDemo: true },
      { id: 'demo-2', service: 'A Productivity App', endDate: fmt(9), price: '$8/mo', notes: '', cancelled: false, isDemo: true },
    ];
  }

  // ---------------- persistence ----------------

  function loadTrials() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  function saveTrials() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trials));
  }

  let trials = loadTrials();

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return {
        reminderDaysBefore: Number.isFinite(parsed?.reminderDaysBefore) ? parsed.reminderDaysBefore : DEFAULT_SETTINGS.reminderDaysBefore,
        reminderHour: Number.isFinite(parsed?.reminderHour) ? parsed.reminderHour : DEFAULT_SETTINGS.reminderHour,
      };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }
  function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  let settings = loadSettings();

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  // ---------------- date helpers ----------------

  // Parsed as plain local-midnight Date objects (not via `new Date(string)`,
  // which treats a bare YYYY-MM-DD as UTC midnight and can shift the date by
  // a day depending on the viewer's own time zone offset) — same approach
  // used in convene/memento elsewhere on this shelf.
  function parseLocalDate(ymd) {
    const [y, m, d] = ymd.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function todayLocalMidnight() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function addDaysStr(days) {
    const d = todayLocalMidnight();
    d.setDate(d.getDate() + days);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  // A snooze doesn't touch the real end date — it only suppresses the
  // banner/notification nag for this one entry until the given day
  // arrives. Plain string comparison works because both sides are
  // YYYY-MM-DD.
  function isSnoozed(entry) {
    return !!entry.snoozedUntil && todayStr() < entry.snoozedUntil;
  }

  function daysLeftFor(entry) {
    return Math.round((parseLocalDate(entry.endDate) - todayLocalMidnight()) / MS_DAY);
  }

  function formatDate(ymd) {
    return parseLocalDate(ymd).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function statusFor(entry) {
    const daysLeft = daysLeftFor(entry);
    if (entry.cancelled) return { key: 'cancelled', label: STATUS_LABEL.cancelled, daysLeft };
    if (daysLeft < 0) return { key: 'ended', label: STATUS_LABEL.ended(daysLeft), daysLeft };
    if (daysLeft === 0) return { key: 'today', label: STATUS_LABEL.today, daysLeft };
    if (daysLeft === 1) return { key: 'tomorrow', label: STATUS_LABEL.tomorrow, daysLeft };
    if (daysLeft <= 3) return { key: 'soon', label: STATUS_LABEL.soon(daysLeft), daysLeft };
    return { key: 'later', label: STATUS_LABEL.later(daysLeft), daysLeft };
  }

  // ---------------- saved-money stat ----------------

  // The price field is free text ("$14.99/mo", "8/month", "USD 12"), so
  // this just grabs the first plain number in it rather than trying to
  // parse currency/period properly — good enough for a rough running
  // total, not meant to be exact accounting.
  function parsePriceNumber(price) {
    if (!price) return 0;
    const match = String(price).match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  }

  function renderSavedStat() {
    const cancelled = trials.filter((t) => t.cancelled);
    if (!cancelled.length) {
      savedStat.textContent = '💰 $0 saved so far — mark a trial "Cancelled" once you’ve actually cancelled it.';
      return;
    }
    const total = cancelled.reduce((sum, t) => sum + parsePriceNumber(t.price), 0);
    savedStat.textContent = `💰 $${total.toFixed(2)} saved so far, across ${cancelled.length} cancelled trial${cancelled.length === 1 ? '' : 's'}.`;
  }

  // ---------------- toast ----------------

  function showToast(content, ms = 5000) {
    toastEl.innerHTML = '';
    if (typeof content === 'string') toastEl.textContent = content;
    else toastEl.appendChild(content);
    toastEl.hidden = false;
    requestAnimationFrame(() => toastEl.classList.add('show'));
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toastEl.classList.remove('show');
      setTimeout(() => { toastEl.hidden = true; }, 200);
    }, ms);
  }

  // ---------------- render ----------------

  function render() {
    const usingDemo = trials.length === 0;
    const source = usingDemo ? buildDemoTrials() : trials;
    emptyState.hidden = !usingDemo;

    // Active trials first (soonest-ending / most overdue at the top —
    // plain string comparison works because YYYY-MM-DD sorts correctly as
    // text), cancelled trials pushed to the bottom.
    const active = source.filter((t) => !t.cancelled).sort((a, b) => a.endDate.localeCompare(b.endDate));
    const done = source.filter((t) => t.cancelled).sort((a, b) => b.endDate.localeCompare(a.endDate));
    const ordered = [...active, ...done];

    trialList.innerHTML = '';
    ordered.forEach((entry) => trialList.appendChild(renderCard(entry)));

    renderBanner();
    renderSavedStat();
  }

  function renderCard(entry) {
    const node = cardTemplate.content.firstElementChild.cloneNode(true);
    if (entry.isDemo) {
      node.classList.add('trial-card-demo');
      node.dataset.demo = 'true';
    } else {
      node.dataset.id = entry.id;
    }
    const status = statusFor(entry);
    node.dataset.status = status.key;

    node.querySelector('.trial-service').textContent = entry.service + (entry.isDemo ? '  ·  example' : '');

    const metaParts = [`Ends ${formatDate(entry.endDate)}`];
    if (entry.price) metaParts.push(entry.price);
    node.querySelector('.trial-meta').textContent = metaParts.join('  ·  ');

    const notesEl = node.querySelector('.trial-notes');
    if (entry.notes) {
      notesEl.textContent = entry.notes;
    } else {
      notesEl.remove();
    }

    const snoozed = isSnoozed(entry);
    const snoozedNoteEl = node.querySelector('.trial-snoozed');
    if (snoozed) {
      snoozedNoteEl.textContent = `😴 Snoozed — quiet until ${formatDate(entry.snoozedUntil)}`;
    } else {
      snoozedNoteEl.remove();
    }

    node.querySelector('.trial-badge').textContent = status.label;

    const cancelledBtn = node.querySelector('.cancelledBtn');
    cancelledBtn.textContent = entry.cancelled ? 'Undo cancel' : 'Cancelled ✓';

    // Snoozing only makes sense for the two states it actually silences
    // (today/tomorrow — see renderBanner/checkNotifications); it has no
    // effect on "soon"/"later"/"ended" cards, so the button doesn't
    // appear on them at all rather than doing nothing when clicked.
    const snoozeBtn = node.querySelector('.snoozeBtn');
    const canSnooze = !entry.cancelled && (status.key === 'today' || status.key === 'tomorrow');
    if (!canSnooze) {
      snoozeBtn.remove();
    } else {
      snoozeBtn.textContent = snoozed ? '😴 Undo snooze' : '😴 Snooze 1 day';
    }

    if (entry.isDemo) {
      node.querySelector('.trial-actions').remove();
    }

    return node;
  }

  // The day-of-charge nag (0) is always on — that's the core promise of
  // the app — plus whatever advance warning day Settings has configured
  // (default 1, "the day before"). If someone sets that to 0 as well,
  // this just collapses to a single day-of nag, which is fine.
  function isUrgent(entry) {
    const days = statusFor(entry).daysLeft;
    return days === 0 || days === settings.reminderDaysBefore;
  }

  function renderBanner() {
    const urgent = trials.filter((t) => !t.cancelled && !isSnoozed(t) && isUrgent(t));
    if (!urgent.length) {
      banner.hidden = true;
      return;
    }
    const names = urgent.map((t) => t.service).join(', ');
    banner.textContent = `🔔 About to charge: ${names} — cancel before it's too late.`;
    banner.hidden = false;
  }

  // ---------------- notifications ----------------
  // Best-effort only: this can only fire while the tab is actually open, since
  // there's no backend to push a notification while it's closed. `#icsBtn`
  // exists specifically to cover that gap — see the footer note in index.html.

  function initNotifyUI() {
    if (!('Notification' in window)) {
      settingsNotifyStatus.textContent = "This browser doesn't support notifications. The calendar reminders below still work regardless.";
      return;
    }
    if (Notification.permission === 'default') {
      settingsNotifyBtn.hidden = false;
      settingsNotifyBtn.addEventListener('click', async () => {
        const perm = await Notification.requestPermission();
        updateNotifyStatus(perm);
        if (perm === 'granted') checkNotifications();
      });
    }
    updateNotifyStatus(Notification.permission);
  }

  function updateNotifyStatus(perm) {
    settingsNotifyBtn.hidden = perm !== 'default';
    if (perm === 'granted') {
      settingsNotifyStatus.textContent = "🔔 Browser alerts are on — you'll get a pop-up while this tab is open.";
    } else if (perm === 'denied') {
      settingsNotifyStatus.textContent = "Browser alerts are blocked \u2014 enable them in your browser's site settings if you want pop-ups too.";
    } else {
      settingsNotifyStatus.textContent = "Browser alerts are off. Turn them on for a pop-up while this tab is open (calendar reminders below work either way).";
    }
  }

  // ---------------- settings panel ----------------

  function openSettings() {
    settingsOverlay.hidden = false;
  }
  function closeSettings() {
    settingsOverlay.hidden = true;
  }
  settingsBtn.addEventListener('click', openSettings);
  settingsCloseBtn.addEventListener('click', closeSettings);
  settingsOverlay.addEventListener('click', (e) => {
    if (e.target === settingsOverlay) closeSettings();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !settingsOverlay.hidden) closeSettings();
  });

  function initReminderInputs() {
    reminderHourSelect.innerHTML = '';
    for (let h = 0; h < 24; h++) {
      const opt = document.createElement('option');
      opt.value = String(h);
      const label = h === 0 ? '12:00 AM' : h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h - 12}:00 PM`;
      opt.textContent = label;
      reminderHourSelect.appendChild(opt);
    }
    reminderDaysInput.value = String(settings.reminderDaysBefore);
    reminderHourSelect.value = String(settings.reminderHour);
  }

  reminderDaysInput.addEventListener('change', () => {
    const v = Math.max(0, Math.min(14, Math.round(Number(reminderDaysInput.value)) || 0));
    reminderDaysInput.value = String(v);
    settings.reminderDaysBefore = v;
    saveSettings();
    render();
  });
  reminderHourSelect.addEventListener('change', () => {
    settings.reminderHour = Number(reminderHourSelect.value);
    saveSettings();
  });

  // ---------------- backup ----------------

  exportBtn.addEventListener('click', () => {
    downloadBlob(JSON.stringify({ trials, settings }, null, 2), `last-call-backup-${todayStr()}.json`, 'application/json');
    showToast('Backup downloaded');
  });

  importBtn.addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', () => {
    const file = importFile.files && importFile.files[0];
    importFile.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let parsed;
      try {
        parsed = JSON.parse(reader.result);
      } catch {
        showToast("That file isn't valid JSON");
        return;
      }
      // Accept both the current {trials, settings} shape and a bare
      // trials array (in case anyone hand-edits/exports just the list).
      const incoming = Array.isArray(parsed) ? parsed : parsed && parsed.trials;
      if (!Array.isArray(incoming)) {
        showToast("That doesn't look like a Last Call backup");
        return;
      }
      const ok = window.confirm(`Replace all ${trials.length} current trials with the ${incoming.length} trials in this backup? This can't be undone.`);
      if (!ok) return;
      trials = incoming.map((t) => ({
        id: typeof t.id === 'string' ? t.id : uid(),
        service: typeof t.service === 'string' ? t.service : 'Untitled',
        endDate: typeof t.endDate === 'string' ? t.endDate : todayStr(),
        price: typeof t.price === 'string' ? t.price : '',
        notes: typeof t.notes === 'string' ? t.notes : '',
        cancelled: !!t.cancelled,
        notifiedOn: Array.isArray(t.notifiedOn) ? t.notifiedOn : [],
        snoozedUntil: typeof t.snoozedUntil === 'string' ? t.snoozedUntil : undefined,
        createdAt: typeof t.createdAt === 'number' ? t.createdAt : Date.now(),
      }));
      saveTrials();
      if (!Array.isArray(parsed) && parsed && parsed.settings) {
        settings = {
          reminderDaysBefore: Number.isFinite(parsed.settings.reminderDaysBefore) ? parsed.settings.reminderDaysBefore : DEFAULT_SETTINGS.reminderDaysBefore,
          reminderHour: Number.isFinite(parsed.settings.reminderHour) ? parsed.settings.reminderHour : DEFAULT_SETTINGS.reminderHour,
        };
        saveSettings();
        initReminderInputs();
      }
      render();
      showToast('Backup restored');
    };
    reader.readAsText(file);
  });

  function checkNotifications() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const today = todayStr();
    let changed = false;
    trials.forEach((entry) => {
      if (entry.cancelled || isSnoozed(entry) || !isUrgent(entry)) return;
      const days = daysLeftFor(entry);
      const notifiedOn = entry.notifiedOn || [];
      if (notifiedOn.includes(today)) return;
      const body = days === 0
        ? `${entry.service} charges today — cancel now.`
        : `${entry.service} charges in ${days} day${days === 1 ? '' : 's'} — cancel before then.`;
      try {
        new Notification('Last Call', { body, icon: 'favicon.svg' });
      } catch {
        // Some browsers throw if notifications aren't actually available
        // even when permission reports granted (e.g. OS-level Do Not
        // Disturb) — nothing useful to do beyond not crashing the page.
      }
      entry.notifiedOn = [...notifiedOn, today];
      changed = true;
    });
    if (changed) saveTrials();
  }

  // ---------------- .ics export ----------------

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function icsEscape(s) {
    return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  }

  function slugify(s) {
    return (s || 'trial').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 50) || 'trial';
  }

  function downloadBlob(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Floating local time (no Z, no TZID) — the calendar app reads it in
  // whatever zone it's already set to, which is the right behavior here
  // since there's no account/server to know the viewer's real zone.
  function buildICS(entry) {
    const remind = parseLocalDate(entry.endDate);
    remind.setDate(remind.getDate() - settings.reminderDaysBefore);
    remind.setHours(settings.reminderHour, 0, 0, 0);
    const remindEnd = new Date(remind.getTime() + 30 * 60000);
    const stamp = new Date();

    const dt = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    const dtStamp = `${stamp.getUTCFullYear()}${pad(stamp.getUTCMonth() + 1)}${pad(stamp.getUTCDate())}T${pad(stamp.getUTCHours())}${pad(stamp.getUTCMinutes())}${pad(stamp.getUTCSeconds())}Z`;

    const summary = `Cancel ${entry.service} before it charges you`;
    const descParts = [];
    if (entry.price) descParts.push(`Then charges ${entry.price}.`);
    if (entry.notes) descParts.push(entry.notes);
    descParts.push(`Trial ends ${entry.endDate}.`);

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Last Call//lastcall//EN',
      'BEGIN:VEVENT',
      `UID:${entry.id}@lastcall.jozsuaheng`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${dt(remind)}`,
      `DTEND:${dt(remindEnd)}`,
      `SUMMARY:${icsEscape(summary)}`,
      `DESCRIPTION:${icsEscape(descParts.join(' '))}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${icsEscape(summary)}`,
      'TRIGGER:-PT0M',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
  }

  // Google Calendar has no API-key-free "download" format, but it does
  // accept a plain URL that pre-fills its own "create event" page — no
  // login flow, no API call, just query params. `dates` has to be in UTC
  // ("Z" time); building the reminder as a normal local Date and then
  // reading it back out with .toISOString() does that conversion for us
  // automatically, since a JS Date always stores a true UTC instant
  // internally regardless of which local fields were used to set it.
  function buildGoogleCalendarUrl(entry) {
    const remind = parseLocalDate(entry.endDate);
    remind.setDate(remind.getDate() - settings.reminderDaysBefore);
    remind.setHours(settings.reminderHour, 0, 0, 0);
    const remindEnd = new Date(remind.getTime() + 30 * 60000);
    const fmtUTC = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const summary = `Cancel ${entry.service} before it charges you`;
    const descParts = [];
    if (entry.price) descParts.push(`Then charges ${entry.price}.`);
    if (entry.notes) descParts.push(entry.notes);
    descParts.push(`Trial ends ${entry.endDate}.`);

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: summary,
      dates: `${fmtUTC(remind)}/${fmtUTC(remindEnd)}`,
      details: descParts.join(' '),
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  // ---------------- actions ----------------

  function deleteTrial(entry) {
    const idx = trials.findIndex((t) => t.id === entry.id);
    if (idx === -1) return;
    const [removed] = trials.splice(idx, 1);
    saveTrials();
    render();

    const wrap = document.createElement('span');
    wrap.className = 'toast-row';
    const label = document.createElement('span');
    label.textContent = `${removed.service} removed`;
    const undoBtn = document.createElement('button');
    undoBtn.type = 'button';
    undoBtn.textContent = 'Undo';
    undoBtn.addEventListener('click', () => {
      trials.splice(Math.min(idx, trials.length), 0, removed);
      saveTrials();
      render();
      toastEl.classList.remove('show');
      setTimeout(() => { toastEl.hidden = true; }, 200);
    });
    wrap.append(label, undoBtn);
    showToast(wrap);
  }

  // ---------------- events ----------------

  trialForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const service = serviceInput.value.trim();
    const endDate = endDateInput.value;
    if (!service || !endDate) return;
    trials.push({
      id: uid(),
      service,
      endDate,
      price: priceInput.value.trim(),
      notes: notesInput.value.trim(),
      cancelled: false,
      notifiedOn: [],
      createdAt: Date.now(),
    });
    saveTrials();
    trialForm.reset();
    serviceInput.focus();
    render();
    checkNotifications();
  });

  trialList.addEventListener('click', (e) => {
    const card = e.target.closest('.trial-card');
    if (!card || card.dataset.demo) return;
    const entry = trials.find((t) => t.id === card.dataset.id);
    if (!entry) return;

    if (e.target.closest('.snoozeBtn')) {
      if (isSnoozed(entry)) {
        delete entry.snoozedUntil;
      } else {
        entry.snoozedUntil = addDaysStr(1);
      }
      saveTrials();
      render();
    } else if (e.target.closest('.gcalBtn')) {
      window.open(buildGoogleCalendarUrl(entry), '_blank', 'noopener');
    } else if (e.target.closest('.icsBtn')) {
      downloadBlob(buildICS(entry), `${slugify(entry.service)}-cancel-reminder.ics`, 'text/calendar');
    } else if (e.target.closest('.cancelledBtn')) {
      entry.cancelled = !entry.cancelled;
      saveTrials();
      render();
    } else if (e.target.closest('.deleteBtn')) {
      deleteTrial(entry);
    }
  });

  // Re-check whenever the tab regains focus (e.g. it was left open
  // overnight and the day rolled over) — not just once at initial load.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkNotifications();
  });

  // ---------------- init ----------------

  endDateInput.min = todayStr();
  initReminderInputs();
  initNotifyUI();
  render();
  checkNotifications();
})();
