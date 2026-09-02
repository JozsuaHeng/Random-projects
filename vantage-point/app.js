(function () {
  var input = document.getElementById("search");
  var empty = document.getElementById("empty-state");
  var emptyQuery = document.getElementById("empty-query");
  var categories = Array.prototype.slice.call(document.querySelectorAll(".category"));

  function filter() {
    var q = input.value.trim().toLowerCase();
    var anyVisible = false;

    categories.forEach(function (cat) {
      var skills = cat.querySelectorAll(".skill");
      var catHasMatch = false;
      skills.forEach(function (skill) {
        var match = !q || skill.getAttribute("data-search").indexOf(q) !== -1;
        skill.hidden = !match;
        if (match) catHasMatch = true;
      });
      cat.hidden = !catHasMatch;
      if (catHasMatch) anyVisible = true;
      if (catHasMatch && q) cat.open = true;
    });

    empty.hidden = anyVisible || !q;
    if (!anyVisible && q) emptyQuery.textContent = input.value.trim();
  }

  input.addEventListener("input", filter);

  document.getElementById("expand-all").addEventListener("click", function () {
    document.querySelectorAll(".category").forEach(function (d) { d.open = true; });
  });
  document.getElementById("collapse-all").addEventListener("click", function () {
    document.querySelectorAll(".category").forEach(function (d) { d.open = false; });
  });

  // --- Skill modal: "Read more" (or clicking a skill card) opens the
  // full SKILL.md content in a centered popup instead of expanding
  // inline, since 50 cards expanding in place made the page unwieldy.
  var skillModal = document.getElementById("skill-modal");
  var skillModalTitle = document.getElementById("skill-modal-title");
  var skillModalBody = document.getElementById("skill-modal-body");
  var skillModalDl = document.getElementById("skill-modal-dl");

  function openSkillModal(slug) {
    var el = document.getElementById(slug);
    if (!el || !el.classList.contains("skill")) return;
    skillModalTitle.textContent = el.getAttribute("data-skill-name") || slug;
    skillModalBody.innerHTML = el.querySelector(".skill-body").innerHTML;
    skillModalDl.href = "dl/" + slug + ".zip";
    skillModal.hidden = false;
  }
  function closeSkillModal() { skillModal.hidden = true; }

  document.querySelectorAll(".skill").forEach(function (card) {
    var summary = card.querySelector(".skill-summary");
    var readMore = card.querySelector(".read-more");
    var slug = card.id;
    summary.addEventListener("click", function () { openSkillModal(slug); });
    readMore.addEventListener("click", function () { openSkillModal(slug); });
  });
  skillModal.querySelectorAll("[data-close]").forEach(function (el) {
    el.addEventListener("click", closeSkillModal);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !skillModal.hidden) closeSkillModal();
  });

  // --- Mindmap: pan + zoom ---
  var canvas = document.getElementById("mm-canvas");
  var svg = document.getElementById("mm-svg");
  var viewport = document.getElementById("mm-viewport");
  // Read the actual viewBox rather than hardcoding it — build.py now
  // computes canvas size dynamically from the resolved layout, so a
  // fixed constant here would drift out of sync with it.
  var vbParts = svg.getAttribute("viewBox").split(" ").map(Number);
  var CX = vbParts[2] / 2, CY = vbParts[3] / 2, VB = vbParts[2];
  var DEFAULT_SCALE = 1.3;
  var scale = DEFAULT_SCALE, tx = CX * (1 - scale), ty = CY * (1 - scale);
  var MIN_SCALE = 0.5, MAX_SCALE = 4;

  function applyTransform() {
    viewport.setAttribute("transform", "translate(" + tx.toFixed(1) + "," + ty.toFixed(1) + ") scale(" + scale.toFixed(3) + ")");
  }
  applyTransform();

  function zoomAtPoint(clientX, clientY, factor) {
    var newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * factor));
    if (newScale === scale) return;
    var pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    var svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());
    var contentX = (svgPt.x - tx) / scale;
    var contentY = (svgPt.y - ty) / scale;
    tx = svgPt.x - contentX * newScale;
    ty = svgPt.y - contentY * newScale;
    scale = newScale;
    applyTransform();
  }

  document.getElementById("mm-zoom-in").addEventListener("click", function () {
    var r = svg.getBoundingClientRect();
    zoomAtPoint(r.left + r.width / 2, r.top + r.height / 2, 1.25);
  });
  document.getElementById("mm-zoom-out").addEventListener("click", function () {
    var r = svg.getBoundingClientRect();
    zoomAtPoint(r.left + r.width / 2, r.top + r.height / 2, 1 / 1.25);
  });
  document.getElementById("mm-zoom-reset").addEventListener("click", function () {
    scale = DEFAULT_SCALE;
    tx = CX * (1 - scale);
    ty = CY * (1 - scale);
    applyTransform();
  });

  // Mouse-wheel zoom deliberately omitted: it fought with normal page
  // scrolling when the cursor happened to be over the mindmap. Zoom is
  // buttons + drag-to-pan only.

  // Drag to pan. Tracks whether a real drag happened so an accidental
  // click on a leaf/node right after dragging doesn't also navigate.
  var dragging = null;
  var didDrag = false;

  canvas.addEventListener("mousedown", function (e) {
    dragging = { x: e.clientX, y: e.clientY, tx: tx, ty: ty };
    didDrag = false;
    canvas.classList.add("dragging");
  });
  window.addEventListener("mousemove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - dragging.x, dy = e.clientY - dragging.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag = true;
    var rect = svg.getBoundingClientRect();
    tx = dragging.tx + dx * (VB / rect.width);
    ty = dragging.ty + dy * (VB / rect.height);
    applyTransform();
  });
  window.addEventListener("mouseup", function () {
    if (dragging) { dragging = null; canvas.classList.remove("dragging"); }
  });

  // Basic touch support: single-finger pan.
  canvas.addEventListener("touchstart", function (e) {
    if (e.touches.length !== 1) return;
    dragging = { x: e.touches[0].clientX, y: e.touches[0].clientY, tx: tx, ty: ty };
    didDrag = false;
  }, { passive: true });
  canvas.addEventListener("touchmove", function (e) {
    if (!dragging || e.touches.length !== 1) return;
    var dx = e.touches[0].clientX - dragging.x, dy = e.touches[0].clientY - dragging.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag = true;
    var rect = svg.getBoundingClientRect();
    tx = dragging.tx + dx * (VB / rect.width);
    ty = dragging.ty + dy * (VB / rect.height);
    applyTransform();
  }, { passive: true });
  canvas.addEventListener("touchend", function () { dragging = null; });

  // Mindmap: clicking a leaf opens that skill's popup directly (it's the
  // same "Read more" destination as clicking its card below). Clicking a
  // category node instead opens and scrolls to that category section,
  // since categories still expand inline. Suppressed if the click was
  // actually the end of a pan drag.
  document.querySelectorAll(".mm-leaf").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (didDrag) return;
      openSkillModal(link.getAttribute("href").slice(1));
    });
  });
  document.querySelectorAll(".mm-node").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (didDrag) return;
      var target = document.getElementById(link.getAttribute("href").slice(1));
      if (!target) return;
      target.open = true;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Flipchart guide modal
  var modal = document.getElementById("guide-modal");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".flip-card"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".flip-dot"));
  var prevBtn = document.getElementById("flip-prev");
  var nextBtn = document.getElementById("flip-next");
  var current = 0;

  function showCard(i) {
    current = i;
    cards.forEach(function (c, idx) { c.hidden = idx !== i; });
    dots.forEach(function (d, idx) { d.classList.toggle("active", idx === i); });
    prevBtn.disabled = i === 0;
    nextBtn.textContent = i === cards.length - 1 ? "✓" : "→";
    nextBtn.classList.toggle("flip-btn-done", i === cards.length - 1);
    nextBtn.setAttribute("aria-label", i === cards.length - 1 ? "Done" : "Next");
  }

  function openModal() {
    showCard(0);
    modal.hidden = false;
  }
  function closeModal() {
    modal.hidden = true;
  }

  document.getElementById("open-guide").addEventListener("click", openModal);
  document.querySelectorAll("[data-close]").forEach(function (el) {
    el.addEventListener("click", closeModal);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  prevBtn.addEventListener("click", function () {
    if (current > 0) showCard(current - 1);
  });
  nextBtn.addEventListener("click", function () {
    if (current < cards.length - 1) showCard(current + 1);
    else closeModal();
  });
  dots.forEach(function (dot, idx) {
    dot.addEventListener("click", function () { showCard(idx); });
  });
})();
