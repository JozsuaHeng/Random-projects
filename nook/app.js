(() => {
  const BOARD_KEY = 'nook.board.v2';
  const ZONES_KEY = 'nook.zones.v1';
  const CONNECTORS_KEY = 'nook.connectors.v1';
  const VIEW_KEY = 'nook.view.v2';
  const THEME_KEY = 'nook.theme.v1';
  const OLD_NOTES_KEY = 'nook.notes.v1';
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const MIN_ZOOM = 0.3;
  const MAX_ZOOM = 2.5;
  // Deep, slightly muted tones — deliberately not the "6 basic sticky-note
  // colors." Shapes vary how the accent is applied (stripe/fold/tab) so a
  // board of notes reads as a mixed set of index cards, not a uniform grid.
  const ACCENTS = ['clay', 'ink', 'moss', 'plum', 'ochre', 'berry'];
  const SHAPES = ['stripe-left', 'stripe-top', 'corner-fold', 'tab'];
  const NOTE_TEMPLATES = {
    meeting: 'Meeting notes\nDate: \nAttendees: \n\nKey Findings:\n\nAction Items:\n- [ ] ',
    todo: 'To-do\n- [ ] \n- [ ] \n- [ ] ',
  };
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomRot = () => Math.round((Math.random() * 4 - 2) * 100) / 100;

  const el = (id) => document.getElementById(id);
  const board = el('board');
  const boardInner = el('boardInner');
  const emptyHint = el('emptyHint');
  const zoomLabel = el('zoomLabel');
  const toastEl = el('toast');
  const importFile = el('importFile');
  const noteTemplate = el('noteTemplate');
  const colorPopoverTemplate = el('colorPopoverTemplate');
  const templatePopoverTemplate = el('templatePopoverTemplate');
  const zoneTemplate = el('zoneTemplate');
  const connectorLayer = el('connectorLayer');
  const createGhost = el('createGhost');
  const trashZone = el('trashZone');
  const pinnedLayer = el('pinnedLayer');
  const minimapEl = el('minimap');
  const minimapContent = el('minimapContent');
  const minimapViewport = el('minimapViewport');
  const statsPill = el('statsPill');

  const expandOverlay = el('expandOverlay');
  const expandCard = el('expandCard');
  const expandColorDot = el('expandColorDot');
  const expandRender = el('expandRender');
  const expandEdit = el('expandEdit');
  const expandFormatActions = el('expandFormatActions');
  const expandHeadActions = el('expandHeadActions');

  // ---------------- utils ----------------

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function inlineMd(s) {
    // Pull inline `code spans` out before anything else touches the
    // string, so **/++ /==/^^ formatting markers (or literal code like
    // `a==b` or `i++`) inside them are never misread as bold/underline/
    // highlight/caps syntax — substituted back in, escaped, at the end.
    const inlineCodes = [];
    s = s.replace(/`([^`]+)`/g, (m, code) => {
      const idx = inlineCodes.length;
      inlineCodes.push(code);
      // No surrounding spaces in the placeholder (unlike the fenced-code
      // one below, which always sits on its own line) — inline code can
      // sit hard against punctuation mid-sentence, and padding this with
      // spaces would visibly insert whitespace that wasn't there.
      return `⁣IC${idx}⁣`;
    });
    s = escapeHtml(s);
    s = s.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<em>$2</em>');
    s = s.replace(/\+\+(.+?)\+\+/g, '<u>$1</u>');
    s = s.replace(/==(.+?)==/g, '<mark>$1</mark>');
    s = s.replace(/\^\^(.+?)\^\^/g, '<span class="caps-text">$1</span>');
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    // Tags (#project, #idea) — run after the link rule above, and require
    // the # to be at a word boundary (start of string or after
    // whitespace), specifically so a URL's own "#fragment" (already
    // tucked inside an href="..." attribute by this point) or a literal
    // "/#123" never gets misread as a tag.
    s = s.replace(/(^|\s)#([a-zA-Z][\w-]{0,30})/g, (m, pre, tag) => `${pre}<span class="tag-pill" data-tag="${tag.toLowerCase()}">#${tag}</span>`);
    s = s.replace(/⁣IC(\d+)⁣/g, (m, idx) => `<code>${escapeHtml(inlineCodes[+idx])}</code>`);
    return s;
  }

  function renderMarkdown(raw) {
    const codeBlocks = [];
    let text = (raw || '').replace(/\r\n/g, '\n');
    text = text.replace(/```(?:\w*)\n?([\s\S]*?)```/g, (m, code) => {
      const idx = codeBlocks.length;
      codeBlocks.push(code.replace(/\n$/, ''));
      return ` CB${idx} `;
    });

    const lines = text.split('\n');
    let html = '';
    let inList = null;
    let paragraphBuf = [];
    // Tracks whether any block has been emitted yet, so a lone standalone
    // first line (no blank-line-free run-on) can be treated as an implicit
    // title and bolded, even when the source has no literal ** or # — this
    // is what makes plain pasted text (not already Markdown) still read
    // as "intelligently" formatted.
    let firstBlockEmitted = false;
    // Counts checklist lines in the order encountered, used as the
    // data-task index checkboxes are toggled by (see toggleChecklistLine).
    // Deliberately NOT the raw line number: the fenced-code-block collapse
    // above merges multi-line blocks into one placeholder line, which
    // would throw off a raw index but never affects *this* count, since a
    // checklist line inside a fenced block was already swallowed into that
    // placeholder and never reaches this loop as its own line either way.
    let taskIndex = -1;

    function flushParagraph() {
      if (paragraphBuf.length) {
        const isTitle = !firstBlockEmitted && paragraphBuf.length === 1;
        const joined = paragraphBuf.join(' ');
        html += isTitle
          ? `<p class="note-title-line"><strong>${inlineMd(joined)}</strong></p>`
          : `<p>${inlineMd(joined)}</p>`;
        firstBlockEmitted = true;
        paragraphBuf = [];
      }
    }
    function closeList() {
      if (inList === 'task') { html += '</ul>'; inList = null; }
      else if (inList) { html += `</${inList}>`; inList = null; }
    }

    for (const line of lines) {
      const codeMatch = line.match(/^ CB(\d+) $/);
      if (codeMatch) {
        flushParagraph(); closeList();
        html += `<pre><code>${escapeHtml(codeBlocks[+codeMatch[1]])}</code></pre>`;
        firstBlockEmitted = true;
        continue;
      }
      if (/^\s*$/.test(line)) { flushParagraph(); closeList(); continue; }

      const h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h) { flushParagraph(); closeList(); const lvl = h[1].length; html += `<h${lvl}>${inlineMd(h[2])}</h${lvl}>`; firstBlockEmitted = true; continue; }

      if (/^(-{3,}|\*{3,})\s*$/.test(line)) { flushParagraph(); closeList(); html += '<hr>'; firstBlockEmitted = true; continue; }

      const bq = line.match(/^>\s?(.*)$/);
      if (bq) { flushParagraph(); closeList(); html += `<blockquote>${inlineMd(bq[1])}</blockquote>`; firstBlockEmitted = true; continue; }

      // A short standalone line ending in a colon ("Key Findings:") reads as
      // a section label even without explicit ** markup — bold it.
      const label = !inList && line.match(/^([A-Za-z][A-Za-z0-9 ,'&/()-]{1,60}):\s*$/);
      if (label) { flushParagraph(); html += `<p><strong>${inlineMd(label[1])}:</strong></p>`; firstBlockEmitted = true; continue; }

      // Checklist syntax — checked before the generic bullet rule below,
      // since "- [ ] foo" would otherwise match that instead (the literal
      // "[ ]" would just become bullet text).
      const task = line.match(/^[-*]\s+\[([ xX])\]\s+(.*)$/);
      if (task) {
        flushParagraph();
        if (inList !== 'task') { closeList(); html += '<ul class="task-list">'; inList = 'task'; }
        taskIndex += 1;
        const checked = task[1].toLowerCase() === 'x';
        html += `<li class="task-item"><label><input type="checkbox" class="task-checkbox" data-task="${taskIndex}"${checked ? ' checked' : ''}><span class="${checked ? 'task-done' : ''}">${inlineMd(task[2])}</span></label></li>`;
        firstBlockEmitted = true;
        continue;
      }

      // Bullet glyphs beyond -/*, since pasted text often carries • ‣ ○ etc.
      const ul = line.match(/^[-*•‣◦○·]\s+(.*)$/);
      if (ul) { flushParagraph(); if (inList !== 'ul') { closeList(); html += '<ul>'; inList = 'ul'; } html += `<li>${inlineMd(ul[1])}</li>`; firstBlockEmitted = true; continue; }

      // "1." or "1)" — and since these render as real <ol><li> elements,
      // the browser renumbers sequentially regardless of what digits the
      // source actually had (fixes repeated/inconsistent source numbering).
      const ol = line.match(/^\d+[.)]\s+(.*)$/);
      if (ol) { flushParagraph(); if (inList !== 'ol') { closeList(); html += '<ol>'; inList = 'ol'; } html += `<li>${inlineMd(ol[1])}</li>`; firstBlockEmitted = true; continue; }

      closeList();
      paragraphBuf.push(line);
    }
    flushParagraph(); closeList();
    return html;
  }

  // Flips a checklist line's [ ]/[x] by scanning note.content the same
  // way renderMarkdown() does (skipping fenced-code interiors, counting
  // checklist lines in order) so `taskIndex` from a rendered checkbox's
  // data-task always resolves to the right raw line regardless of what
  // else is in the note.
  function toggleChecklistLine(note, taskIndex) {
    const lines = note.content.split('\n');
    let count = -1;
    let inFence = false;
    for (let i = 0; i < lines.length; i++) {
      if (/^\s*```/.test(lines[i])) { inFence = !inFence; continue; }
      if (inFence) continue;
      const m = lines[i].match(/^(\s*[-*]\s+\[)([ xX])(\]\s*.*)$/);
      if (!m) continue;
      count += 1;
      if (count !== taskIndex) continue;
      lines[i] = m[1] + (m[2].toLowerCase() === 'x' ? ' ' : 'x') + m[3];
      note.content = lines.join('\n');
      note.updatedAt = Date.now();
      saveBoard();
      const refs = noteRefs.get(note.id);
      if (refs && refs.editEl.hidden) refs.renderEl.innerHTML = renderMarkdown(note.content);
      if (expandedId === note.id && expandEdit.hidden) expandRender.innerHTML = renderMarkdown(note.content);
      return;
    }
  }

  function noteTitle(note) {
    const firstLine = (note.content || '').split('\n').find((l) => l.trim().length > 0) || '';
    const cleaned = firstLine.replace(/^#{1,6}\s*/, '').replace(/[*_`>]/g, '').trim();
    return cleaned || 'untitled';
  }

  function slugify(s) {
    return (s || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 50) || 'untitled';
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

  // ---------------- toast ----------------

  function showToast(content, ms = 2200) {
    toastEl.innerHTML = '';
    if (typeof content === 'string') toastEl.textContent = content;
    else toastEl.appendChild(content);
    toastEl.hidden = false;
    requestAnimationFrame(() => toastEl.classList.add('show'));
    clearTimeout(showToast._t);
    showToast._t = setTimeout(hideToast, ms);
  }
  function hideToast() {
    toastEl.classList.remove('show');
    setTimeout(() => { toastEl.hidden = true; }, 200);
  }
  function toast(msg) { showToast(msg); }

  // ---------------- persistence ----------------

  function migrateOldNotes() {
    try {
      const raw = localStorage.getItem(OLD_NOTES_KEY);
      if (!raw) return null;
      const old = JSON.parse(raw);
      if (!Array.isArray(old) || !old.length) return null;
      const cols = 4, gapX = 300, gapY = 250;
      return old.map((n, i) => ({
        id: n.id || uid(),
        x: 40 + (i % cols) * gapX,
        y: 40 + Math.floor(i / cols) * gapY,
        w: 280,
        h: 220,
        content: typeof n.content === 'string' ? n.content : '',
        color: ACCENTS[i % ACCENTS.length],
        shape: pick(SHAPES),
        rot: randomRot(),
        createdAt: n.createdAt || Date.now(),
        updatedAt: n.updatedAt || Date.now(),
      }));
    } catch {
      return null;
    }
  }

  function loadBoard() {
    try {
      const raw = localStorage.getItem(BOARD_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch { /* fall through */ }
    return migrateOldNotes() || [];
  }

  function saveBoard() {
    localStorage.setItem(BOARD_KEY, JSON.stringify(notes));
  }

  function loadView() {
    try {
      const raw = localStorage.getItem(VIEW_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && typeof parsed.panX === 'number' && typeof parsed.panY === 'number' && typeof parsed.zoom === 'number') {
        return parsed;
      }
    } catch { /* fall through */ }
    return { panX: 0, panY: 0, zoom: 1 };
  }
  function saveView() {
    localStorage.setItem(VIEW_KEY, JSON.stringify(view));
  }

  function loadZones() {
    // No preset "Category 1..4" zones any more — the board starts with
    // none; the zone system itself (create/drag/resize/rename/delete)
    // is unchanged, there's just nothing seeded on first load.
    const raw = localStorage.getItem(ZONES_KEY);
    if (raw === null) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  function saveZones() {
    localStorage.setItem(ZONES_KEY, JSON.stringify(zones));
  }

  function loadConnectors() {
    try {
      const raw = localStorage.getItem(CONNECTORS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  function saveConnectors() {
    localStorage.setItem(CONNECTORS_KEY, JSON.stringify(connectors));
  }

  const boardKeyExistedAtLoad = !!localStorage.getItem(BOARD_KEY);
  const zonesKeyExistedAtLoad = localStorage.getItem(ZONES_KEY) !== null;
  let notes = loadBoard();
  saveBoard();
  let zones = loadZones();
  saveZones();
  let connectors = loadConnectors();
  // Drop any connector left dangling by a note deleted outside the normal
  // delete flow (e.g. an older backup import) rather than rendering a
  // line to nothing.
  connectors = connectors.filter((c) => notes.some((n) => n.id === c.from) && notes.some((n) => n.id === c.to));
  saveConnectors();
  let view = boardKeyExistedAtLoad ? loadView() : { panX: 0, panY: 0, zoom: 1 };

  const noteRefs = new Map();
  const zoneRefs = new Map();
  const connectorRefs = new Map();
  let zCounter = 50;
  let zoneZCounter = 2;
  let expandedId = null;
  let currentPopover = null;
  let cascadeStep = 0;
  let zoneCascadeStep = 0;
  // True for the duration of any drag/pan/resize/connect gesture — used to
  // suppress the "double-click here" cursor ghost while something else is
  // already happening.
  let interacting = false;
  function setInteracting(v) {
    interacting = v;
    if (v) hideGhost();
  }
  // Cached scale/offset mapping board-space coordinates into the minimap's
  // pixel box — recomputed only when notes/zones actually change (see
  // refreshMinimap), not on every pan/zoom frame (see updateMinimapViewport).
  let minimapLayout = null;
  // The tag currently spotlighted (lowercase, matching a tag-pill's
  // data-tag), or null when nothing's filtered.
  let activeTagHighlight = null;

  // ---------------- theme ----------------

  (function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark') document.documentElement.dataset.theme = 'dark';
  })();

  el('themeBtn').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    if (next === 'dark') document.documentElement.dataset.theme = 'dark';
    else delete document.documentElement.dataset.theme;
    localStorage.setItem(THEME_KEY, next);
  });

  // ---------------- view (pan/zoom) ----------------

  function applyView() {
    boardInner.style.transform = `translate(${view.panX}px, ${view.panY}px) scale(${view.zoom})`;
    updateMinimapViewport();
  }
  function animateApplyView() {
    boardInner.classList.add('animate');
    applyView();
    setTimeout(() => boardInner.classList.remove('animate'), 380);
  }
  function updateZoomLabel() {
    zoomLabel.textContent = Math.round(view.zoom * 100) + '%';
  }

  function screenToBoard(clientX, clientY) {
    const rect = board.getBoundingClientRect();
    return {
      x: (clientX - rect.left - view.panX) / view.zoom,
      y: (clientY - rect.top - view.panY) / view.zoom,
    };
  }

  function zoomAt(screenX, screenY, newZoom, animate) {
    newZoom = clamp(newZoom, MIN_ZOOM, MAX_ZOOM);
    const rect = board.getBoundingClientRect();
    const bx = (screenX - rect.left - view.panX) / view.zoom;
    const by = (screenY - rect.top - view.panY) / view.zoom;
    view.zoom = newZoom;
    view.panX = screenX - rect.left - bx * newZoom;
    view.panY = screenY - rect.top - by * newZoom;
    (animate ? animateApplyView : applyView)();
    saveView();
    updateZoomLabel();
  }

  function fitToContent(instant) {
    // Pinned notes left the canvas for a fixed screen corner — they no
    // longer have a meaningful position to frame.
    const items = [...notes.filter((n) => !n.pinned), ...zones];
    if (!items.length) { toast('Nothing to fit yet'); return; }
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of items) {
      minX = Math.min(minX, n.x); minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + n.w); maxY = Math.max(maxY, n.y + n.h);
    }
    const padding = 90;
    const contentW = (maxX - minX) + padding * 2;
    const contentH = (maxY - minY) + padding * 2;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    let newZoom = Math.min(viewportW / contentW, viewportH / contentH, 1.4);
    newZoom = clamp(newZoom, MIN_ZOOM, MAX_ZOOM);
    const centerX = (minX + maxX) / 2, centerY = (minY + maxY) / 2;
    view.zoom = newZoom;
    view.panX = viewportW / 2 - centerX * newZoom;
    view.panY = viewportH / 2 - centerY * newZoom;
    (instant ? applyView : animateApplyView)();
    saveView();
    updateZoomLabel();
  }

  el('fitBtn').addEventListener('click', () => fitToContent(false));
  el('zoomInBtn').addEventListener('click', () => zoomAt(window.innerWidth / 2, window.innerHeight / 2, view.zoom * 1.25, true));
  el('zoomOutBtn').addEventListener('click', () => zoomAt(window.innerWidth / 2, window.innerHeight / 2, view.zoom / 1.25, true));

  board.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.01);
      zoomAt(e.clientX, e.clientY, view.zoom * factor, false);
      return;
    }
    // Let a note/expand body with overflowing text scroll natively instead
    // of the wheel panning the whole board out from under the cursor.
    if (e.target.closest('.note-body, .expand-body')) return;
    e.preventDefault();
    view.panX -= e.deltaX;
    view.panY -= e.deltaY;
    applyView();
    saveView();
  }, { passive: false });

  const zoneControlSelector = '.note-card, .zone-edge, .zone-label-row, .zone-resize-handle, .zone-delete, .note-connect-handle, .connector-label';

  board.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    if (e.target.closest(zoneControlSelector)) return;
    setInteracting(true);
    const startX = e.clientX, startY = e.clientY;
    const startPanX = view.panX, startPanY = view.panY;
    let moved = false;
    board.classList.add('panning');
    function onMove(ev) {
      const dx = ev.clientX - startX, dy = ev.clientY - startY;
      if (!moved && Math.hypot(dx, dy) > 3) moved = true;
      view.panX = startPanX + dx;
      view.panY = startPanY + dy;
      applyView();
    }
    function onUp() {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      board.classList.remove('panning');
      setInteracting(false);
      if (moved) saveView();
    }
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  });

  board.addEventListener('dblclick', (e) => {
    if (e.target.closest(zoneControlSelector)) return;
    const pos = screenToBoard(e.clientX, e.clientY);
    createNoteAt(pos.x - 140, pos.y - 110);
  });

  // ---------------- create-here cursor ghost ----------------

  function showGhostAt(clientX, clientY) {
    createGhost.style.left = (clientX - 90) + 'px';
    createGhost.style.top = (clientY - 70) + 'px';
    createGhost.style.opacity = '0.4';
  }
  function hideGhost() {
    createGhost.style.opacity = '0';
  }

  board.addEventListener('pointermove', (e) => {
    if (interacting || e.target.closest(zoneControlSelector)) { hideGhost(); return; }
    showGhostAt(e.clientX, e.clientY);
  });
  board.addEventListener('pointerleave', hideGhost);
  board.addEventListener('pointerdown', hideGhost);

  // ---------------- trash zone ----------------

  // Generous invisible padding around the small circular trash button —
  // makes it a realistic drop target while dragging, not just its literal
  // 36px circle.
  function pointOverTrash(clientX, clientY) {
    const rect = trashZone.getBoundingClientRect();
    const pad = 16;
    return clientX >= rect.left - pad && clientX <= rect.right + pad &&
      clientY >= rect.top - pad && clientY <= rect.bottom + pad;
  }

  // ---------------- minimap ----------------

  // Full relayout: recomputes the board-space bounding box over every note
  // + zone and rebuilds the dots/outlines. Called whenever the set of
  // notes/zones or their position/size changes (create, delete, drag-end,
  // resize-end, import) — NOT on every drag frame, since the bounding box
  // rarely changes mid-drag and this is O(n) over the whole board.
  function refreshMinimap() {
    // Pinned notes aren't part of the canvas's spatial layout any more —
    // leave them off the overview the same way fitToContent() does.
    const canvasNotes = notes.filter((n) => !n.pinned);
    const items = [...canvasNotes, ...zones];
    minimapEl.hidden = items.length === 0;
    if (!items.length) { minimapLayout = null; return; }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const it of items) {
      minX = Math.min(minX, it.x); minY = Math.min(minY, it.y);
      maxX = Math.max(maxX, it.x + it.w); maxY = Math.max(maxY, it.y + it.h);
    }
    const pad = 60;
    minX -= pad; minY -= pad; maxX += pad; maxY += pad;
    const contentW = Math.max(1, maxX - minX);
    const contentH = Math.max(1, maxY - minY);
    const box = minimapContent.getBoundingClientRect();
    const scale = Math.min(box.width / contentW, box.height / contentH);
    const offsetX = (box.width - contentW * scale) / 2 - minX * scale;
    const offsetY = (box.height - contentH * scale) / 2 - minY * scale;
    minimapLayout = { scale, offsetX, offsetY };

    minimapContent.querySelectorAll('.minimap-dot, .minimap-zone-rect').forEach((n) => n.remove());
    for (const z of zones) {
      const rect = document.createElement('div');
      rect.className = 'minimap-zone-rect';
      rect.style.left = (z.x * scale + offsetX) + 'px';
      rect.style.top = (z.y * scale + offsetY) + 'px';
      rect.style.width = Math.max(3, z.w * scale) + 'px';
      rect.style.height = Math.max(3, z.h * scale) + 'px';
      minimapContent.appendChild(rect);
    }
    for (const n of canvasNotes) {
      const dot = document.createElement('div');
      dot.className = 'minimap-dot';
      dot.style.left = ((n.x + n.w / 2) * scale + offsetX) + 'px';
      dot.style.top = ((n.y + n.h / 2) * scale + offsetY) + 'px';
      dot.style.background = `var(--accent-${n.color})`;
      minimapContent.appendChild(dot);
    }
    updateMinimapViewport();
  }

  // Cheap path: only repositions the outline showing what's currently on
  // screen, reusing the last computed scale/offset — this is what runs on
  // every pan/zoom frame via applyView(), so it can't afford to touch
  // notes/zones at all.
  function updateMinimapViewport() {
    if (!minimapLayout || minimapEl.hidden) return;
    const { scale, offsetX, offsetY } = minimapLayout;
    const topLeft = screenToBoard(0, 0);
    const bottomRight = screenToBoard(window.innerWidth, window.innerHeight);
    minimapViewport.style.left = (topLeft.x * scale + offsetX) + 'px';
    minimapViewport.style.top = (topLeft.y * scale + offsetY) + 'px';
    minimapViewport.style.width = Math.max(4, (bottomRight.x - topLeft.x) * scale) + 'px';
    minimapViewport.style.height = Math.max(4, (bottomRight.y - topLeft.y) * scale) + 'px';
  }

  // ---------------- zone note counts ----------------

  // "Inside" a zone means the note's center point falls within the zone's
  // rectangle — simplest reasonable definition, and matches how the app
  // otherwise treats zones as purely visual (no stored membership list).
  function computeZoneNoteCount(zone) {
    let count = 0;
    for (const n of notes) {
      if (n.pinned) continue;
      const cx = n.x + n.w / 2, cy = n.y + n.h / 2;
      if (cx >= zone.x && cx <= zone.x + zone.w && cy >= zone.y && cy <= zone.y + zone.h) count += 1;
    }
    return count;
  }
  function refreshZoneCounts() {
    for (const z of zones) {
      const refs = zoneRefs.get(z.id);
      if (!refs) continue;
      const count = computeZoneNoteCount(z);
      refs.countEl.textContent = count > 0 ? String(count) : '';
    }
  }

  // Small board-wide "N notes · M words" pill (see .stats-pill in
  // style.css) — the only one of these overlays that also needs
  // refreshing on a plain content edit, not just create/delete/move, so
  // it additionally gets called directly from saveAndRender()/
  // saveExpandEdit() rather than only through syncOverlays() below.
  function refreshStats() {
    let words = 0;
    for (const n of notes) {
      const text = (n.content || '').trim();
      if (text) words += text.split(/\s+/).length;
    }
    statsPill.hidden = notes.length === 0;
    statsPill.textContent = `${notes.length} note${notes.length === 1 ? '' : 's'} · ${words} word${words === 1 ? '' : 's'}`;
  }

  // Notes/zones changing position, size, or existence affects both the
  // minimap and every zone's count at once — one call at each mutation
  // point instead of remembering to call both separately.
  function syncOverlays() {
    refreshMinimap();
    refreshZoneCounts();
    refreshStats();
  }

  minimapEl.addEventListener('pointerdown', (e) => {
    if (!minimapLayout) return;
    e.stopPropagation();
    const rect = minimapContent.getBoundingClientRect();
    const boardX = (e.clientX - rect.left - minimapLayout.offsetX) / minimapLayout.scale;
    const boardY = (e.clientY - rect.top - minimapLayout.offsetY) / minimapLayout.scale;
    view.panX = window.innerWidth / 2 - boardX * view.zoom;
    view.panY = window.innerHeight / 2 - boardY * view.zoom;
    animateApplyView();
    saveView();
  });

  // ---------------- note lifecycle ----------------

  function getNote(id) {
    return notes.find((n) => n.id === id);
  }

  function maybeShowEmptyHint() {
    emptyHint.hidden = notes.length > 0;
  }

  function bringToFront(note, cardEl) {
    zCounter += 1;
    cardEl.style.zIndex = String(zCounter);
  }

  function createNoteAt(x, y, content = '') {
    const now = Date.now();
    const note = {
      id: uid(), x, y, w: 280, h: 220, content,
      color: pick(ACCENTS), shape: pick(SHAPES), rot: randomRot(),
      createdAt: now, updatedAt: now,
    };
    notes.push(note);
    saveBoard();
    syncOverlays();
    const refs = createNoteDOM(note);
    bringToFront(note, refs.card);
    maybeShowEmptyHint();
    enterEditMode(note, refs);
    return note;
  }

  function isBlank(content) {
    return !content || !content.trim();
  }

  function removeNoteQuietly(note) {
    const idx = notes.findIndex((n) => n.id === note.id);
    if (idx === -1) return;
    notes.splice(idx, 1);
    saveBoard();
    syncOverlays();
    removeConnectorsForNote(note.id);
    const refs = noteRefs.get(note.id);
    if (refs) refs.card.remove();
    noteRefs.delete(note.id);
    maybeShowEmptyHint();
  }

  function createNoteAtViewportCenter(content = '') {
    const offset = (cascadeStep % 7) * 24;
    cascadeStep += 1;
    const c = screenToBoard(window.innerWidth / 2, window.innerHeight / 2);
    return createNoteAt(c.x - 140 + offset, c.y - 110 + offset, content);
  }

  function createNoteDOM(note, popDelayMs = 0) {
    const card = noteTemplate.content.firstElementChild.cloneNode(true);
    card.dataset.id = note.id;
    card.dataset.color = note.color;
    card.dataset.shape = note.shape || 'stripe-left';
    card.style.setProperty('--rot', (note.rot || 0) + 'deg');
    if (note.pinned) {
      card.classList.add('pinned');
    } else {
      card.style.left = note.x + 'px';
      card.style.top = note.y + 'px';
      card.style.width = note.w + 'px';
      card.style.height = note.h + 'px';
    }
    card.classList.add('pop-in');
    card.style.animationDelay = popDelayMs + 'ms';
    card.addEventListener('animationend', () => card.classList.remove('pop-in'), { once: true });

    const renderEl = card.querySelector('.note-render');
    const editEl = card.querySelector('.note-edit');
    const colorDot = card.querySelector('.note-color-dot');
    const pinBtn = card.querySelector('.pin-btn');
    const expandBtn = card.querySelector('.expand-btn');
    const copyBtn = card.querySelector('.copy-btn');
    const deleteBtn = card.querySelector('.delete-btn');
    const resizeHandle = card.querySelector('.note-resize-handle');
    const connectHandle = card.querySelector('.note-connect-handle');
    const headActions = card.querySelector('.note-head-actions');
    const formatActions = card.querySelector('.note-format-actions');

    renderEl.innerHTML = renderMarkdown(note.content);
    pinBtn.classList.toggle('active', !!note.pinned);

    const refs = { card, renderEl, editEl, colorDot, pinBtn, headActions, formatActions };
    noteRefs.set(note.id, refs);
    (note.pinned ? pinnedLayer : boardInner).appendChild(card);

    wireFormatButtons(formatActions, editEl);

    pinBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleNotePinned(note); });

    // A checklist checkbox or a tag pill handles its own click (see
    // below) — neither should start a card drag or fall through to
    // click-to-edit.
    renderEl.addEventListener('click', (e) => {
      const cb = e.target.closest('.task-checkbox');
      if (cb) { toggleChecklistLine(note, Number(cb.dataset.task)); return; }
      const tagEl = e.target.closest('.tag-pill');
      if (tagEl) toggleTagHighlight(tagEl.dataset.tag);
    });

    // click-to-edit / drag from anywhere on the card body
    card.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.note-action, .note-color-dot, .note-resize-handle, .note-connect-handle, .note-format-actions, .task-item, .tag-pill')) return;
      if (e.target.tagName === 'TEXTAREA') return;
      e.preventDefault();
      // Pinned notes live in a fixed column, not on the canvas — dragging
      // one reorders it within that column instead of repositioning it.
      if (note.pinned) { startPinnedReorder(e, note, card, refs); return; }
      bringToFront(note, card);
      setInteracting(true);
      const startX = e.clientX, startY = e.clientY;
      const startLeft = note.x, startTop = note.y;
      let dragging = false;
      function onMove(ev) {
        const dx = (ev.clientX - startX) / view.zoom;
        const dy = (ev.clientY - startY) / view.zoom;
        if (!dragging && Math.hypot(ev.clientX - startX, ev.clientY - startY) > 4) dragging = true;
        if (dragging) {
          note.x = startLeft + dx;
          note.y = startTop + dy;
          card.style.left = note.x + 'px';
          card.style.top = note.y + 'px';
          card.classList.add('dragging');
          updateConnectorsForNote(note.id);
          trashZone.classList.add('armed');
          const overTrash = pointOverTrash(ev.clientX, ev.clientY);
          card.classList.toggle('will-delete', overTrash);
          trashZone.classList.toggle('hover', overTrash);
        }
      }
      function onUp(ev) {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        card.classList.remove('dragging');
        setInteracting(false);
        trashZone.classList.remove('armed', 'hover');
        if (dragging && pointOverTrash(ev.clientX, ev.clientY)) {
          deleteNote(note);
          return;
        }
        card.classList.remove('will-delete');
        if (dragging) {
          note.updatedAt = Date.now();
          saveBoard();
          syncOverlays();
        } else if (e.target.closest('.note-body') && editEl.hidden) {
          enterEditMode(note, refs);
        }
      }
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });

    editEl.addEventListener('blur', () => saveAndRender(note, refs));

    resizeHandle.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      bringToFront(note, card);
      setInteracting(true);
      const startX = e.clientX, startY = e.clientY;
      const startW = note.w, startH = note.h;
      function onMove(ev) {
        const dw = (ev.clientX - startX) / view.zoom;
        const dh = (ev.clientY - startY) / view.zoom;
        note.w = clamp(startW + dw, 200, 760);
        note.h = clamp(startH + dh, 150, 640);
        card.style.width = note.w + 'px';
        card.style.height = note.h + 'px';
        updateConnectorsForNote(note.id);
      }
      function onUp() {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        setInteracting(false);
        note.updatedAt = Date.now();
        saveBoard();
        syncOverlays();
      }
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });

    colorDot.addEventListener('click', (e) => {
      e.stopPropagation();
      openColorPopover(colorDot, (color) => {
        note.color = color;
        saveBoard();
        refreshNoteColor(note);
      });
    });
    expandBtn.addEventListener('click', (e) => { e.stopPropagation(); openExpand(note); });
    copyBtn.addEventListener('click', (e) => { e.stopPropagation(); copyNoteText(note); });
    deleteBtn.addEventListener('click', (e) => { e.stopPropagation(); deleteNote(note); });

    // Drag from the connect handle to another note to draw a connector.
    connectHandle.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      setInteracting(true);
      const tempLine = document.createElementNS(SVG_NS, 'path');
      tempLine.setAttribute('class', 'connector-drawing');
      connectorLayer.appendChild(tempLine);
      const startX = note.x + note.w / 2, startY = note.y + note.h / 2;
      function onMove(ev) {
        const pos = screenToBoard(ev.clientX, ev.clientY);
        tempLine.setAttribute('d', quadPath(startX, startY, pos.x, pos.y).d);
      }
      function onUp(ev) {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        tempLine.remove();
        setInteracting(false);
        const targetEl = document.elementFromPoint(ev.clientX, ev.clientY);
        const targetCard = targetEl && targetEl.closest('.note-card');
        if (targetCard && targetCard.dataset.id && targetCard.dataset.id !== note.id) {
          createConnector(note.id, targetCard.dataset.id);
        }
      }
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });

    if (activeTagHighlight) applyTagHighlight();
    return refs;
  }

  // Wraps the current textarea selection in the given Markdown-ish marker
  // (bold/underline/highlight/caps all use the same wrap-the-raw-text
  // approach — see renderMarkdown/inlineMd for how each renders). Clicking
  // again on an already-wrapped selection un-wraps it, so the buttons
  // double as toggles.
  const FORMAT_MARKS = { bold: '**', italic: '*', underline: '++', highlight: '==', caps: '^^' };
  function applyFormat(textarea, kind) {
    const mark = FORMAT_MARKS[kind];
    if (!mark || !textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const selected = value.slice(start, end);
    const before = value.slice(Math.max(0, start - mark.length), start);
    const after = value.slice(end, end + mark.length);
    // Italic's single `*` is a substring of bold's `**` — toggling italic
    // on a selection that's actually wrapped in **bold** would otherwise
    // match "one `*` immediately adjacent" and strip a single asterisk
    // off each side, corrupting the bold marker instead of doing nothing.
    // Only treat it as a real italic wrap if there isn't *another* `*`
    // just outside the one being matched.
    const oneMoreBefore = value.slice(Math.max(0, start - mark.length - 1), start - mark.length);
    const oneMoreAfter = value.slice(end + mark.length, end + mark.length + 1);
    const isAmbiguousStar = mark === '*' && (oneMoreBefore === '*' || oneMoreAfter === '*');
    let newValue, newStart, newEnd;
    if (selected && before === mark && after === mark && !isAmbiguousStar) {
      newValue = value.slice(0, start - mark.length) + selected + value.slice(end + mark.length);
      newStart = start - mark.length;
    } else {
      newValue = value.slice(0, start) + mark + selected + mark + value.slice(end);
      newStart = start + mark.length;
    }
    newEnd = newStart + selected.length;
    textarea.value = newValue;
    textarea.focus();
    textarea.setSelectionRange(newStart, newEnd);
  }

  function wireFormatButtons(container, textarea) {
    if (!container) return;
    container.querySelectorAll('button[data-format]').forEach((btn) => {
      // pointerdown + preventDefault (not click) so the textarea never
      // loses focus to the button — losing focus would fire its blur
      // handler and swap it back to rendered view before this even runs,
      // and would also lose the selection applyFormat needs to read.
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        applyFormat(textarea, btn.dataset.format);
      });
    });
  }

  function enterEditMode(note, refs) {
    refs.renderEl.hidden = true;
    refs.editEl.hidden = false;
    refs.editEl.value = note.content;
    // The header's own actions (expand/copy/delete) don't apply mid-type;
    // swap that slot for the formatting toolbar for the duration of the edit.
    if (refs.headActions) refs.headActions.hidden = true;
    if (refs.formatActions) refs.formatActions.hidden = false;
    requestAnimationFrame(() => {
      refs.editEl.focus();
      const len = refs.editEl.value.length;
      refs.editEl.setSelectionRange(len, len);
    });
  }

  function saveAndRender(note, refs) {
    note.content = refs.editEl.value;
    // A note left blank when you click away (or a freshly double-clicked
    // note nobody typed into) shouldn't sit on the board as clutter —
    // quietly remove it instead of leaving an empty card behind.
    if (isBlank(note.content)) {
      removeNoteQuietly(note);
      return;
    }
    note.updatedAt = Date.now();
    saveBoard();
    refs.editEl.hidden = true;
    refs.renderEl.innerHTML = renderMarkdown(note.content);
    refs.renderEl.hidden = false;
    if (refs.headActions) refs.headActions.hidden = false;
    if (refs.formatActions) refs.formatActions.hidden = true;
    if (activeTagHighlight) applyTagHighlight();
    refreshStats();
  }

  function deleteNote(note) {
    const idx = notes.findIndex((n) => n.id === note.id);
    if (idx === -1) return;
    const [removed] = notes.splice(idx, 1);
    saveBoard();
    syncOverlays();
    removeConnectorsForNote(note.id);
    const refs = noteRefs.get(note.id);
    if (refs) refs.card.remove();
    noteRefs.delete(note.id);
    if (expandedId === note.id) closeExpand();
    maybeShowEmptyHint();

    const wrap = document.createElement('span');
    wrap.style.display = 'flex';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '10px';
    const label = document.createElement('span');
    label.textContent = 'Note deleted';
    const undoBtn = document.createElement('button');
    undoBtn.textContent = 'Undo';
    undoBtn.addEventListener('click', () => {
      notes.splice(Math.min(idx, notes.length), 0, removed);
      saveBoard();
      syncOverlays();
      const newRefs = createNoteDOM(removed);
      bringToFront(removed, newRefs.card);
      maybeShowEmptyHint();
      hideToast();
    });
    wrap.appendChild(label);
    wrap.appendChild(undoBtn);
    showToast(wrap, 6000);
  }

  async function copyNoteText(note) {
    try {
      await navigator.clipboard.writeText(note.content);
      toast('Copied');
    } catch {
      const tmp = document.createElement('textarea');
      tmp.value = note.content;
      tmp.style.position = 'fixed';
      tmp.style.opacity = '0';
      document.body.appendChild(tmp);
      tmp.select();
      try { document.execCommand('copy'); toast('Copied'); }
      catch { toast('Copy failed — select the text and copy manually'); }
      document.body.removeChild(tmp);
    }
  }

  function exportNote(note) {
    downloadBlob(note.content, `${slugify(noteTitle(note))}.md`, 'text/markdown');
    toast('Exported');
  }

  // Breadth-first walk of the connector graph from startId — connectors
  // have no direction in the UI (an A-B line means the same thing either
  // way), so both c.from and c.to are followed. Returns notes in
  // "this note, then what's directly connected, then what's connected to
  // that" order, which is what makes the exported file read start-to-
  // finish as a chain rather than a random bag of notes.
  function collectConnectedNotes(startId) {
    const visited = new Set([startId]);
    const queue = [startId];
    const order = [startId];
    while (queue.length) {
      const id = queue.shift();
      for (const c of connectors) {
        const otherId = c.from === id ? c.to : (c.to === id ? c.from : null);
        if (otherId && !visited.has(otherId)) {
          visited.add(otherId);
          queue.push(otherId);
          order.push(otherId);
        }
      }
    }
    return order.map((id) => getNote(id)).filter(Boolean);
  }

  function exportConnectorChain(note) {
    const chain = collectConnectedNotes(note.id);
    if (chain.length === 1) { toast('Nothing connected to this note yet'); return; }
    const md = chain.map((n) => `## ${noteTitle(n)}\n\n${n.content}`).join('\n\n---\n\n');
    downloadBlob(md, `${slugify(noteTitle(note))}-chain.md`, 'text/markdown');
    toast(`Exported ${chain.length} connected notes`);
  }

  function refreshNoteColor(note) {
    const refs = noteRefs.get(note.id);
    if (refs) refs.card.dataset.color = note.color;
    if (expandedId === note.id) expandCard.dataset.color = note.color;
  }

  // ---------------- tags ----------------

  function noteHasTag(note, tag) {
    const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('(^|\\s)#' + escaped + '(?![\\w-])', 'i').test(note.content || '');
  }

  // Everything sharing the active tag stays full-strength; everything
  // else dims rather than disappears, so the board's layout is still
  // legible while scanning for matches (see .tag-dimmed/.tag-highlighted
  // in style.css).
  function applyTagHighlight() {
    for (const n of notes) {
      const refs = noteRefs.get(n.id);
      if (!refs) continue;
      if (!activeTagHighlight) {
        refs.card.classList.remove('tag-dimmed', 'tag-highlighted');
        continue;
      }
      const match = noteHasTag(n, activeTagHighlight);
      refs.card.classList.toggle('tag-highlighted', match);
      refs.card.classList.toggle('tag-dimmed', !match);
    }
  }

  function toggleTagHighlight(tag) {
    activeTagHighlight = activeTagHighlight === tag ? null : tag;
    applyTagHighlight();
    if (activeTagHighlight) toast(`Highlighting #${activeTagHighlight} — click the tag again to clear`);
  }

  // Moves the note's actual DOM element between .board-inner (canvas,
  // board-space coordinates) and #pinnedLayer (fixed corner, no
  // coordinates at all — CSS just stacks it in the column). note.x/y/w/h
  // are left untouched while pinned, so unpinning drops it back exactly
  // where it was.
  function toggleNotePinned(note) {
    note.pinned = !note.pinned;
    note.updatedAt = Date.now();
    saveBoard();
    const refs = noteRefs.get(note.id);
    if (refs) {
      refs.card.classList.toggle('pinned', note.pinned);
      refs.pinBtn.classList.toggle('active', note.pinned);
      if (note.pinned) {
        refs.card.style.left = '';
        refs.card.style.top = '';
        refs.card.style.width = '';
        refs.card.style.height = '';
        pinnedLayer.appendChild(refs.card);
      } else {
        refs.card.style.left = note.x + 'px';
        refs.card.style.top = note.y + 'px';
        refs.card.style.width = note.w + 'px';
        refs.card.style.height = note.h + 'px';
        boardInner.appendChild(refs.card);
        bringToFront(note, refs.card);
      }
    }
    if (expandedId === note.id) el('expandPinBtn').classList.toggle('active', note.pinned);
    updateConnectorsForNote(note.id);
    syncOverlays();
  }

  // Reordering within the pinned column. The dragged card gets a live
  // translateY offset (via the --drag-y custom property the .reordering
  // CSS rule reads) so it visibly follows the cursor; its siblings are
  // ordinary flex items, so as soon as the drag crosses a neighbor's
  // midpoint, physically moving the card in the DOM (insertBefore/After)
  // makes that neighbor snap into the vacated slot for free — no manual
  // layout math for anyone but the dragged card itself.
  function startPinnedReorder(e, note, card, refs) {
    setInteracting(true);
    const startY = e.clientY;
    let dragging = false;
    function onMove(ev) {
      const dy = ev.clientY - startY;
      if (!dragging && Math.abs(dy) > 4) { dragging = true; card.classList.add('reordering'); }
      if (!dragging) return;
      card.style.setProperty('--drag-y', dy + 'px');
      const cardRect = card.getBoundingClientRect();
      const cardMid = cardRect.top + cardRect.height / 2;
      for (const sib of pinnedLayer.querySelectorAll('.note-card.pinned')) {
        if (sib === card) continue;
        const sibRect = sib.getBoundingClientRect();
        const sibMid = sibRect.top + sibRect.height / 2;
        const cardIsBefore = !!(card.compareDocumentPosition(sib) & Node.DOCUMENT_POSITION_FOLLOWING);
        if (cardIsBefore && cardMid > sibMid) sib.after(card);
        else if (!cardIsBefore && cardMid < sibMid) sib.before(card);
      }
    }
    function onUp() {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      setInteracting(false);
      card.classList.remove('reordering');
      card.style.removeProperty('--drag-y');
      if (dragging) {
        const orderedNotes = [...pinnedLayer.querySelectorAll('.note-card.pinned')]
          .map((el) => getNote(el.dataset.id));
        let cursor = 0;
        notes = notes.map((n) => (n.pinned ? orderedNotes[cursor++] : n));
        saveBoard();
      } else if (e.target.closest('.note-body') && refs.editEl.hidden) {
        enterEditMode(note, refs);
      }
    }
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }

  // ---------------- color popover ----------------

  function closeAnyOpenPopover() {
    if (currentPopover) { currentPopover.remove(); currentPopover = null; }
  }

  // Shared by note and zone color pickers — the popover itself doesn't
  // care what it's coloring, just hands the picked key to onPick.
  function openColorPopover(anchorEl, onPick) {
    closeAnyOpenPopover();
    const pop = colorPopoverTemplate.content.firstElementChild.cloneNode(true);
    const rect = anchorEl.getBoundingClientRect();
    pop.style.position = 'fixed';
    pop.style.left = rect.left + 'px';
    pop.style.top = (rect.bottom + 8) + 'px';
    pop.addEventListener('click', (e) => {
      e.stopPropagation();
      const btn = e.target.closest('button[data-color]');
      if (!btn) return;
      onPick(btn.dataset.color);
      closeAnyOpenPopover();
    });
    document.body.appendChild(pop);
    currentPopover = pop;
    setTimeout(() => document.addEventListener('click', closeAnyOpenPopover, { once: true }), 0);
  }

  // ---------------- connectors ----------------

  function quadPath(ax, ay, bx, by) {
    const mx = (ax + bx) / 2, my = (ay + by) / 2;
    const dx = bx - ax, dy = by - ay;
    const dist = Math.hypot(dx, dy) || 1;
    const nx = -dy / dist, ny = dx / dist;
    const bulge = Math.min(46, dist * 0.16);
    const cx = mx + nx * bulge, cy = my + ny * bulge;
    return {
      d: `M ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`,
      mid: { x: (ax + 2 * cx + bx) / 4, y: (ay + 2 * cy + by) / 4 },
    };
  }

  function updateConnectorPath(conn) {
    const a = getNote(conn.from), b = getNote(conn.to);
    const refs = connectorRefs.get(conn.id);
    if (!a || !b || !refs) return;
    // A pinned note has left the canvas for a fixed screen-space corner
    // (see "pinned notes"), so its board-space x/y is a frozen, stale
    // position — drawing a line to it would point at nowhere meaningful.
    // Hide the connector (and its label) rather than delete it: the
    // relationship comes back automatically as soon as the note unpins.
    const hide = a.pinned || b.pinned;
    refs.g.style.display = hide ? 'none' : '';
    refs.labelEl.style.display = hide ? 'none' : '';
    if (hide) return;
    const ax = a.x + a.w / 2, ay = a.y + a.h / 2;
    const bx = b.x + b.w / 2, by = b.y + b.h / 2;
    const { d, mid } = quadPath(ax, ay, bx, by);
    refs.hit.setAttribute('d', d);
    refs.line.setAttribute('d', d);
    refs.delBg.setAttribute('cx', mid.x);
    refs.delBg.setAttribute('cy', mid.y);
    refs.delX1.setAttribute('x1', mid.x - 3); refs.delX1.setAttribute('y1', mid.y - 3);
    refs.delX1.setAttribute('x2', mid.x + 3); refs.delX1.setAttribute('y2', mid.y + 3);
    refs.delX2.setAttribute('x1', mid.x - 3); refs.delX2.setAttribute('y1', mid.y + 3);
    refs.delX2.setAttribute('x2', mid.x + 3); refs.delX2.setAttribute('y2', mid.y - 3);
    // Offset below the exact midpoint so the label doesn't sit under the
    // delete-× that appears there on hover.
    refs.labelEl.style.left = mid.x + 'px';
    refs.labelEl.style.top = (mid.y + 16) + 'px';
  }

  function updateConnectorsForNote(noteId) {
    for (const c of connectors) {
      if (c.from === noteId || c.to === noteId) updateConnectorPath(c);
    }
  }

  function deleteConnector(conn) {
    const idx = connectors.findIndex((c) => c.id === conn.id);
    if (idx === -1) return;
    connectors.splice(idx, 1);
    saveConnectors();
    const refs = connectorRefs.get(conn.id);
    if (refs) { refs.g.remove(); refs.labelEl.remove(); }
    connectorRefs.delete(conn.id);
  }

  function removeConnectorsForNote(noteId) {
    for (const c of connectors.filter((c) => c.from === noteId || c.to === noteId)) deleteConnector(c);
  }

  function createConnectorDOM(conn) {
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('class', 'connector-group');
    g.dataset.id = conn.id;
    const hit = document.createElementNS(SVG_NS, 'path');
    hit.setAttribute('class', 'connector-hit');
    const line = document.createElementNS(SVG_NS, 'path');
    line.setAttribute('class', 'connector-line');
    const delBg = document.createElementNS(SVG_NS, 'circle');
    delBg.setAttribute('class', 'connector-delete-bg');
    delBg.setAttribute('r', '9');
    const delX1 = document.createElementNS(SVG_NS, 'line');
    delX1.setAttribute('class', 'connector-delete-x');
    const delX2 = document.createElementNS(SVG_NS, 'line');
    delX2.setAttribute('class', 'connector-delete-x');
    g.append(hit, line, delBg, delX1, delX2);
    connectorLayer.appendChild(g);

    // A plain HTML div, not SVG text — it lives in .board-inner alongside
    // note cards and zones, so it just uses board-space x/y directly and
    // rides the same pan/zoom transform for free, same as they do.
    const labelEl = document.createElement('div');
    labelEl.className = 'connector-label';
    labelEl.spellcheck = false;
    labelEl.textContent = conn.label || '';
    boardInner.appendChild(labelEl);

    const refs = { g, hit, line, delBg, delX1, delX2, labelEl };
    connectorRefs.set(conn.id, refs);
    updateConnectorPath(conn);

    hit.addEventListener('pointerdown', (e) => e.stopPropagation());
    const onDeleteClick = (e) => { e.stopPropagation(); deleteConnector(conn); };
    delBg.addEventListener('click', onDeleteClick);
    delX1.addEventListener('click', onDeleteClick);
    delX2.addEventListener('click', onDeleteClick);

    // The label lives outside the SVG group it's conceptually part of, so
    // its own hover state can't be reached with a CSS sibling selector —
    // mirror the group's hover into a class on the label by hand instead.
    // Both elements need their OWN enter/leave pair, not just the group's:
    // the label visually overlaps the group's hit-path, so moving the
    // mouse from the path onto the label crosses out of `g`'s subtree
    // (label isn't a descendant of it) and fires `g`'s pointerleave right
    // as the cursor arrives — hiding the very label being moved onto. The
    // label's own pointerenter fires immediately after in the same tick
    // and re-adds the class, so it settles visible before the next paint.
    const showLabelHint = () => labelEl.classList.add('hint-visible');
    const hideLabelHint = () => labelEl.classList.remove('hint-visible');
    g.addEventListener('pointerenter', showLabelHint);
    g.addEventListener('pointerleave', hideLabelHint);
    labelEl.addEventListener('pointerenter', showLabelHint);
    labelEl.addEventListener('pointerleave', hideLabelHint);
    labelEl.addEventListener('pointerdown', (e) => e.stopPropagation());
    labelEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (labelEl.getAttribute('contenteditable') === 'true') return;
      beginInlineTextEdit(labelEl);
    });
    labelEl.addEventListener('blur', () => {
      labelEl.setAttribute('contenteditable', 'false');
      conn.label = labelEl.textContent.trim();
      labelEl.textContent = conn.label;
      saveConnectors();
    });

    return refs;
  }

  function createConnector(fromId, toId) {
    if (fromId === toId) return;
    if (connectors.some((c) => (c.from === fromId && c.to === toId) || (c.from === toId && c.to === fromId))) {
      toast('Already connected');
      return;
    }
    const conn = { id: uid(), from: fromId, to: toId, label: '' };
    connectors.push(conn);
    saveConnectors();
    createConnectorDOM(conn);
  }

  // ---------------- expand overlay ----------------

  function openExpand(note) {
    expandedId = note.id;
    expandCard.dataset.color = note.color;
    el('expandPinBtn').classList.toggle('active', !!note.pinned);
    expandRender.innerHTML = renderMarkdown(note.content);
    expandRender.hidden = false;
    expandEdit.hidden = true;
    expandFormatActions.hidden = true;
    expandHeadActions.hidden = false;
    expandOverlay.hidden = false;
  }

  function saveExpandEdit() {
    const note = getNote(expandedId);
    if (!note) return;
    note.content = expandEdit.value;
    if (isBlank(note.content)) {
      removeNoteQuietly(note);
      expandOverlay.hidden = true;
      expandedId = null;
      return;
    }
    note.updatedAt = Date.now();
    saveBoard();
    expandEdit.hidden = true;
    expandFormatActions.hidden = true;
    expandHeadActions.hidden = false;
    expandRender.innerHTML = renderMarkdown(note.content);
    expandRender.hidden = false;
    const refs = noteRefs.get(note.id);
    if (refs && refs.editEl.hidden) refs.renderEl.innerHTML = renderMarkdown(note.content);
    if (activeTagHighlight) applyTagHighlight();
    refreshStats();
  }

  function closeExpand() {
    if (expandEdit.hidden === false) saveExpandEdit();
    expandOverlay.hidden = true;
    expandedId = null;
  }

  expandRender.addEventListener('click', (e) => {
    const cb = e.target.closest('.task-checkbox');
    const tagEl = e.target.closest('.tag-pill');
    const note = getNote(expandedId);
    if (!note) return;
    if (cb) { toggleChecklistLine(note, Number(cb.dataset.task)); return; }
    if (tagEl) { toggleTagHighlight(tagEl.dataset.tag); return; }
    expandRender.hidden = true;
    expandEdit.hidden = false;
    expandEdit.value = note.content;
    expandHeadActions.hidden = true;
    expandFormatActions.hidden = false;
    expandEdit.focus();
  });
  expandEdit.addEventListener('blur', saveExpandEdit);
  wireFormatButtons(expandFormatActions, expandEdit);
  expandColorDot.addEventListener('click', (e) => {
    e.stopPropagation();
    const note = getNote(expandedId);
    if (note) openColorPopover(expandColorDot, (color) => {
      note.color = color;
      saveBoard();
      refreshNoteColor(note);
    });
  });
  el('expandPinBtn').addEventListener('click', () => { const n = getNote(expandedId); if (n) toggleNotePinned(n); });
  el('expandCopyBtn').addEventListener('click', () => { const n = getNote(expandedId); if (n) copyNoteText(n); });
  el('expandExportBtn').addEventListener('click', () => { const n = getNote(expandedId); if (n) exportNote(n); });
  el('expandChainBtn').addEventListener('click', () => { const n = getNote(expandedId); if (n) exportConnectorChain(n); });
  el('expandDeleteBtn').addEventListener('click', () => { const n = getNote(expandedId); if (n) deleteNote(n); });
  el('expandCloseBtn').addEventListener('click', closeExpand);
  expandOverlay.addEventListener('click', (e) => { if (e.target === expandOverlay) closeExpand(); });

  // ---------------- toolbar actions ----------------

  el('newBtn').addEventListener('click', () => createNoteAtViewportCenter());
  el('emptyNewBtn').addEventListener('click', () => createNoteAtViewportCenter());

  el('templateBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    closeAnyOpenPopover();
    const pop = templatePopoverTemplate.content.firstElementChild.cloneNode(true);
    const rect = e.currentTarget.getBoundingClientRect();
    pop.style.position = 'fixed';
    pop.style.left = rect.left + 'px';
    pop.style.top = (rect.bottom + 8) + 'px';
    pop.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const btn = ev.target.closest('button[data-template]');
      if (!btn) return;
      createNoteAtViewportCenter(NOTE_TEMPLATES[btn.dataset.template] || '');
      closeAnyOpenPopover();
    });
    document.body.appendChild(pop);
    currentPopover = pop;
    setTimeout(() => document.addEventListener('click', closeAnyOpenPopover, { once: true }), 0);
  });

  el('pasteBtn').addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) { toast('Clipboard is empty'); return; }
      createNoteAtViewportCenter(text);
      toast('Pasted into a new note');
    } catch {
      toast('Couldn’t read clipboard — paste it in with Ctrl/Cmd+V instead');
    }
  });

  document.addEventListener('paste', (e) => {
    const activeTag = document.activeElement && document.activeElement.tagName;
    if (activeTag === 'TEXTAREA' || activeTag === 'INPUT') return;
    const text = (e.clipboardData || window.clipboardData).getData('text');
    if (!text || !text.trim()) return;
    e.preventDefault();
    createNoteAtViewportCenter(text);
    toast('Pasted into a new note');
  });

  // Cmd/Ctrl+B/I/U while actually typing in a note — deliberately not a
  // custom shortcut scheme (that was cut earlier for needing to be
  // learned): these three are muscle memory from every other Mac/Windows
  // text app, so supporting them is "make it easy," not a shortcut you
  // have to discover. Scoped to .note-edit specifically so it can never
  // fire while typing a zone label or anywhere else. Deliberately not
  // extended to highlight/caps — there's no standard OS binding for
  // either, so a made-up one would be exactly the kind of thing-to-
  // remember this app avoids; those stay toolbar/mouse-only.
  document.addEventListener('keydown', (e) => {
    if (!(e.metaKey || e.ctrlKey)) return;
    if (!e.target.classList || !e.target.classList.contains('note-edit')) return;
    const kind = { b: 'bold', i: 'italic', u: 'underline' }[e.key.toLowerCase()];
    if (!kind) return;
    e.preventDefault();
    applyFormat(e.target, kind);
  });

  el('exportBtn').addEventListener('click', () => {
    const date = new Date().toISOString().slice(0, 10);
    downloadBlob(JSON.stringify({ notes, zones, connectors }, null, 2), `nook-backup-${date}.json`, 'application/json');
    toast('Backup downloaded');
  });

  el('importBtn').addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', () => {
    const file = importFile.files && importFile.files[0];
    importFile.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let parsed;
      try { parsed = JSON.parse(reader.result); }
      catch { toast('That file isn’t valid JSON'); return; }
      // Accept both the current {notes, zones} export shape and a bare
      // notes array (older export format), so old backups still restore.
      const incomingNotes = Array.isArray(parsed) ? parsed : (parsed && Array.isArray(parsed.notes) ? parsed.notes : null);
      const incomingZones = Array.isArray(parsed && parsed.zones) ? parsed.zones : null;
      const incomingConnectors = Array.isArray(parsed && parsed.connectors) ? parsed.connectors : [];
      if (!incomingNotes) { toast('That doesn’t look like a Nook backup'); return; }
      const ok = window.confirm(`Replace all ${notes.length} current notes with the ${incomingNotes.length} notes in this backup? This can’t be undone.`);
      if (!ok) return;
      const cols = 4, gapX = 300, gapY = 250;
      notes = incomingNotes.map((n, i) => ({
        id: n.id || uid(),
        x: typeof n.x === 'number' ? n.x : 40 + (i % cols) * gapX,
        y: typeof n.y === 'number' ? n.y : 40 + Math.floor(i / cols) * gapY,
        w: typeof n.w === 'number' ? n.w : 280,
        h: typeof n.h === 'number' ? n.h : 220,
        content: typeof n.content === 'string' ? n.content : '',
        color: ACCENTS.includes(n.color) ? n.color : pick(ACCENTS),
        shape: SHAPES.includes(n.shape) ? n.shape : pick(SHAPES),
        rot: typeof n.rot === 'number' ? n.rot : randomRot(),
        pinned: !!n.pinned,
        createdAt: n.createdAt || Date.now(),
        updatedAt: n.updatedAt || Date.now(),
      }));
      zones = incomingZones ? incomingZones.map((z) => ({
        id: z.id || uid(),
        x: typeof z.x === 'number' ? z.x : 40,
        y: typeof z.y === 'number' ? z.y : 40,
        w: typeof z.w === 'number' ? z.w : 560,
        h: typeof z.h === 'number' ? z.h : 380,
        label: typeof z.label === 'string' && z.label.trim() ? z.label : 'Untitled',
        color: ACCENTS.includes(z.color) ? z.color : undefined,
      })) : zones;
      const noteIds = new Set(notes.map((n) => n.id));
      connectors = incomingConnectors
        .filter((c) => noteIds.has(c.from) && noteIds.has(c.to))
        .map((c) => ({ id: c.id || uid(), from: c.from, to: c.to, label: typeof c.label === 'string' ? c.label : '' }));
      saveBoard();
      saveZones();
      saveConnectors();
      boardInner.innerHTML = '';
      connectorLayer.innerHTML = '';
      boardInner.appendChild(connectorLayer);
      pinnedLayer.innerHTML = '';
      noteRefs.clear();
      zoneRefs.clear();
      connectorRefs.clear();
      for (const z of zones) createZoneDOM(z);
      for (const n of notes) createNoteDOM(n);
      for (const c of connectors) createConnectorDOM(c);
      maybeShowEmptyHint();
      syncOverlays();
      fitToContent(true);
      toast('Backup restored');
    };
    reader.readAsText(file);
  });

  // ---------------- zones (default demarcations for future categories) ---

  function bringZoneToFront(frame) {
    zoneZCounter += 1;
    frame.style.zIndex = String(zoneZCounter);
  }

  // Shared by zone-label rename and connector-label edit — both are a
  // plain contenteditable span entered by clicking it, focused with
  // everything selected so typing replaces rather than appends.
  function beginInlineTextEdit(el) {
    el.setAttribute('contenteditable', 'true');
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function deleteZone(zone) {
    const idx = zones.findIndex((z) => z.id === zone.id);
    if (idx === -1) return;
    zones.splice(idx, 1);
    saveZones();
    syncOverlays();
    const refs = zoneRefs.get(zone.id);
    if (refs) refs.frame.remove();
    zoneRefs.delete(zone.id);
  }

  // Separate from deleteZone() (used by the × button, no undo — matches
  // its existing, deliberately terse behavior) because dragging onto the
  // trash is much easier to trigger by accident than clicking a small ×,
  // so it gets the same undo-toast safety net deleteNote() already has.
  function deleteZoneWithUndo(zone) {
    const idx = zones.findIndex((z) => z.id === zone.id);
    if (idx === -1) return;
    zones.splice(idx, 1);
    saveZones();
    syncOverlays();
    const refs = zoneRefs.get(zone.id);
    if (refs) refs.frame.remove();
    zoneRefs.delete(zone.id);

    const wrap = document.createElement('span');
    wrap.style.display = 'flex';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '10px';
    const label = document.createElement('span');
    label.textContent = 'Category deleted';
    const undoBtn = document.createElement('button');
    undoBtn.textContent = 'Undo';
    undoBtn.addEventListener('click', () => {
      zones.splice(Math.min(idx, zones.length), 0, zone);
      saveZones();
      const newRefs = createZoneDOM(zone);
      bringZoneToFront(newRefs.frame);
      syncOverlays();
      hideToast();
    });
    wrap.appendChild(label);
    wrap.appendChild(undoBtn);
    showToast(wrap, 6000);
  }

  function createZoneDOM(zone) {
    const frame = zoneTemplate.content.firstElementChild.cloneNode(true);
    frame.dataset.id = zone.id;
    frame.style.left = zone.x + 'px';
    frame.style.top = zone.y + 'px';
    frame.style.width = zone.w + 'px';
    frame.style.height = zone.h + 'px';

    const labelRow = frame.querySelector('.zone-label-row');
    const colorDot = frame.querySelector('.zone-color-dot');
    const label = frame.querySelector('.zone-label');
    const countEl = frame.querySelector('.zone-count');
    const deleteBtn = frame.querySelector('.zone-delete');
    const resizeHandle = frame.querySelector('.zone-resize-handle');
    const edges = frame.querySelectorAll('.zone-edge');
    label.textContent = zone.label;
    if (zone.color) {
      frame.dataset.color = zone.color;
      colorDot.style.background = `var(--accent-${zone.color})`;
      colorDot.style.borderColor = 'transparent';
    }

    const refs = { frame, label, countEl, colorDot };
    zoneRefs.set(zone.id, refs);
    boardInner.insertBefore(frame, boardInner.firstChild);

    colorDot.addEventListener('click', (e) => {
      e.stopPropagation();
      openColorPopover(colorDot, (color) => {
        zone.color = color;
        saveZones();
        frame.dataset.color = color;
        colorDot.style.background = `var(--accent-${color})`;
        colorDot.style.borderColor = 'transparent';
      });
    });

    // Grab any edge of the outline (or the label) to move the whole zone —
    // there's no separate header bar now that zones are just a thin line.
    function startZoneMove(e, isLabel) {
      e.preventDefault();
      setInteracting(true);
      bringZoneToFront(frame);
      const startX = e.clientX, startY = e.clientY;
      const startLeft = zone.x, startTop = zone.y;
      let dragging = false;
      function onMove(ev) {
        const dx = (ev.clientX - startX) / view.zoom;
        const dy = (ev.clientY - startY) / view.zoom;
        if (!dragging && Math.hypot(ev.clientX - startX, ev.clientY - startY) > 4) dragging = true;
        if (dragging) {
          zone.x = startLeft + dx;
          zone.y = startTop + dy;
          frame.style.left = zone.x + 'px';
          frame.style.top = zone.y + 'px';
          trashZone.classList.add('armed');
          const overTrash = pointOverTrash(ev.clientX, ev.clientY);
          frame.classList.toggle('will-delete', overTrash);
          trashZone.classList.toggle('hover', overTrash);
        }
      }
      function onUp(ev) {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        setInteracting(false);
        trashZone.classList.remove('armed', 'hover');
        if (dragging && pointOverTrash(ev.clientX, ev.clientY)) {
          deleteZoneWithUndo(zone);
          return;
        }
        frame.classList.remove('will-delete');
        if (dragging) { saveZones(); syncOverlays(); }
        else if (isLabel) beginInlineTextEdit(label);
      }
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    }
    edges.forEach((edge) => edge.addEventListener('pointerdown', (e) => startZoneMove(e, false)));
    // Grabbing the row moves the zone whether the pointer landed on the
    // label text or the count badge beside it; only a no-movement click
    // that actually started on the label itself enters rename mode.
    labelRow.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.zone-color-dot')) return;
      if (label.getAttribute('contenteditable') === 'true') return;
      startZoneMove(e, !!e.target.closest('.zone-label'));
    });

    label.addEventListener('blur', () => {
      label.setAttribute('contenteditable', 'false');
      const text = label.textContent.trim() || 'Untitled';
      zone.label = text;
      label.textContent = text;
      saveZones();
    });

    resizeHandle.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      setInteracting(true);
      bringZoneToFront(frame);
      const startX = e.clientX, startY = e.clientY;
      const startW = zone.w, startH = zone.h;
      function onMove(ev) {
        const dw = (ev.clientX - startX) / view.zoom;
        const dh = (ev.clientY - startY) / view.zoom;
        zone.w = clamp(startW + dw, 220, 2400);
        zone.h = clamp(startH + dh, 160, 2000);
        frame.style.width = zone.w + 'px';
        frame.style.height = zone.h + 'px';
      }
      function onUp() {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        setInteracting(false);
        saveZones();
        syncOverlays();
      }
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });

    deleteBtn.addEventListener('click', (e) => { e.stopPropagation(); deleteZone(zone); });

    return refs;
  }

  el('zoneBtn').addEventListener('click', () => {
    const offset = (zoneCascadeStep % 5) * 30;
    zoneCascadeStep += 1;
    const c = screenToBoard(window.innerWidth / 2, window.innerHeight / 2);
    const zone = { id: uid(), x: c.x - 260 + offset, y: c.y - 180 + offset, w: 520, h: 360, label: 'New category' };
    zones.push(zone);
    saveZones();
    const refs = createZoneDOM(zone);
    bringZoneToFront(refs.frame);
    syncOverlays();
  });

  // ---------------- init ----------------

  for (const z of zones) createZoneDOM(z);
  notes.forEach((n, i) => createNoteDOM(n, Math.min(i, 8) * 40));
  for (const c of connectors) createConnectorDOM(c);
  maybeShowEmptyHint();
  syncOverlays();
  // Only auto-fit if there's actually something to frame — with no preset
  // zones any more, a brand-new board has zero notes and zero zones, and
  // fitToContent() would otherwise show a "Nothing to fit yet" toast on
  // a completely empty first load.
  if ((!boardKeyExistedAtLoad || !zonesKeyExistedAtLoad) && (notes.length || zones.length)) fitToContent(true);
  else applyView();
  updateZoomLabel();
})();
