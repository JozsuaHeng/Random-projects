# CLAUDE.md

## What this project is

**Nook** — a minimal, freeform notes board (a pan/zoom canvas of notes,
optional connector lines between them, and lightweight labeled zones) for
stashing text you want to keep visible while doing something else. The
main use case: copy a long reply out of the Claude app, paste it onto the
board, then put the browser window side-by-side (half-and-half) with
whatever else you're doing, so the text stays readable while you work
from it elsewhere.

No accounts, no backend, no sync — everything lives in the browser's
`localStorage`, so notes persist across closing the tab/browser/restarting
the machine, but only on the machine + browser they were written in.

## Design constraints driven directly by user feedback

This app has gone through three rounds of user feedback after the initial
build, each of which permanently ruled things out — worth knowing before
"improving" any of this back toward what was already tried and rejected:

- **No custom keyboard shortcuts.** Every action is a click — not even
  Escape-to-close exists; overlays/popovers close by clicking an × or the
  backdrop. **The one deliberate exception**: `⌘/Ctrl+B/I/U` while a
  `.note-edit` textarea is focused apply bold/italic/underline (see the
  `keydown` listener near the `paste` listener in `app.js`). These aren't
  a scheme you have to learn — they're standard Mac/Windows text-editing
  shortcuts every user already knows from every other text app, which is
  categorically different from the app-specific `⌘N`/`⌘F`/`⌘\` scheme cut
  in the first round for needing to be discovered. Don't extend this
  pattern to highlight/caps (no standard OS binding exists for either —
  inventing one would just recreate the thing this rule avoids), and
  don't add any shortcut that isn't a pre-existing, universally-known one.
- **No sidebar, no note list, no search box.** Notes live directly on a
  pannable/zoomable canvas. "Fit everything in view" (`#fitBtn`) is the
  recovery mechanism if you pan away and lose track.
- **Bright by default, dark available via toggle.** Default is light
  regardless of OS preference — not `prefers-color-scheme`-driven.
- **Not a sticky-note board, not a Notion clone.** Solid pastel fills on
  plain cards read as both "post-it" and "Notion" — fixed by moving
  color into a slim accent (stripe/fold/tab, see "Note shapes") on a
  shared warm-paper body instead of a full-bleed fill. **Don't
  reintroduce a full-color note fill** — already tried, moved away from.
- **The board background went through several rounds and landed back on
  the plain dot grid.** The crisp dot-grid was originally cut for
  reading too much like Miro/FigJam/Excalidraw's own canvas chrome — it
  was replaced with paper grain + a vignette, then a warm glow + a fine
  linen-weave crosshatch (this one caused genuine eye strain — small,
  tightly-repeating high-contrast patterns can trigger a scintillating-
  grid-style effect regardless of how low the opacity is; see the
  memento project's CLAUDE.md for the same lesson learned once already
  elsewhere on this shelf), then a larger 56px box+diamond lattice
  (called "too obvious"). None of the alternatives landed, and the dot
  grid was explicitly asked back by name (`--board-dot`, `.board` in
  `style.css`) — this is a deliberate final call, made *after* trying
  the alternatives, not an oversight. **If "make it less Miro" comes up
  again, don't reach for another grid variant** (box+diamond was
  already one) — the paper-grain/glow family is the unexplored direction
  actually worth revisiting, and keep any repeating pattern at a large,
  sparse scale (50px+) to avoid the eye-strain failure mode.
- **Zones are a thin grey outline, not a filled/dashed/labeled box.** The
  first zones implementation (dashed border, translucent fill, pill-
  shaped colored label badge) was called out as "too obvious." Zones are
  now just a 1px `var(--zone-line)` rectangle with a small plain-text
  label — see "Zones" below for how they're still draggable/resizable
  without any header chrome to grab.
- **Logo: two flat shapes, not paper/notes imagery, not a circle-notch.**
  v1's icon (an arch with a dot) read as a gravestone. v2 (two overlapping
  "sticky note" squares) fixed that but reinforced the Notion/generic-
  notes-app read once combined with pastel note fills. v3 (a circle
  overlapping a square's corner) was described as reading like a moon.
  The **current** mark — a small cream square (`#f7ecd9`) nested inside
  the corner of a larger terracotta square (`#b9622d`), in `favicon.svg`
  and `.brand-mark` — is a literal visual pun on "a smaller space nested
  in a larger one." If revisited again, avoid: arch/headstone shapes,
  paper/note/document iconography, and circular notches (all tried).

## Architecture

Plain HTML/CSS/JS, no framework, no build step, no dependencies — same as
every other project in `ai-slop/`.

### The canvas: `.board` → `.board-inner` → zones + connectors + notes

`.board-inner` is a zero-size positioning anchor (`width:0; height:0`)
that gets `transform: translate(panX, panY) scale(zoom)` applied in
`applyView()`. Zones and note cards are ordinary HTML, `position:
absolute` inside it with plain unscaled board-space `left`/`top`/`width`/
`height` — this works at 0×0 size with `overflow` left at its default
because that's how CSS block-level layout always worked here.

**The connector layer is different, and this bit otherwise looks like an
obvious copy-paste of that same 0×0 pattern — don't revert it.**
`#connectorLayer` is an `<svg>`, and a **0×0 SVG root does not paint
overflowing children even with `overflow: visible`** — confirmed by an
isolated test (a bare 0×0 `<svg>` with a path drawn via absolute
coordinates rendered nothing in Chrome headless; giving it `width: 1px;
height: 1px;` instead, everything else identical, rendered correctly).
This is a real, non-obvious browser behavior difference between a plain
HTML block element and an SVG root at zero size, not a spec-reading
guess — if connector lines (or anything else added to this layer) ever
silently stop rendering after a refactor, check this first. `1px` is
enough; it doesn't need to track content bounds.

Pan/zoom mechanics, `fitToContent()` (bounding box over **notes and
zones together**), and the wheel-vs-scroll handling (wheel pans the board
except when the cursor is over `.note-body`/`.expand-body`, where it's
left alone so the browser's native `overflow-y: auto` scrolls that
element instead) are unchanged from before — see inline comments in
`app.js` if extending any of this.

### Zones: thin outlines you move by grabbing an edge

`zones`: `{ id, x, y, w, h, label }`, persisted under `nook.zones.v1`,
seeded with 4 defaults ("Category 1"–"4") only on a genuinely first-ever
load (existence-checked the same way as notes — present-but-empty must
never re-seed). A zone's fill has `pointer-events: none` so board
panning, double-click-to-create, and note dragging all pass straight
through its interior. Since the redesign dropped the old pill-shaped
header (see "Design constraints"), **there's no single header bar to
grab any more** — instead, four thin invisible strips
(`.zone-edge.edge-{top,right,bottom,left}`, ~10px, `pointer-events:
auto`, positioned centered on the visible border line) plus the label
text itself are each wired to the same `startZoneMove()` drag handler,
so grabbing *any* edge of the rectangle (or the label) moves the whole
zone — "shift the boundary" rather than "drag a handle bar." A plain
click on the label (no movement) enters rename mode
(`beginRenameZone()`, a `contenteditable` span, no `<input>`); the
resize corner handle is separate and unchanged in behavior. **Any new
interactive zone control needs adding to `zoneControlSelector`** in
`app.js` (used by the board's pan/dblclick/ghost handlers to know what
to treat as "not empty board") the same way `.zone-edge` etc. already
are — miss this and dragging that control also starts a simultaneous
board pan, since the pointerdown still bubbles up.

### Connectors: soft curved lines between notes

`connectors`: `{ id, from, to }` (note ids), persisted under
`nook.connectors.v1`, filtered at load time to drop anything referencing
a note that no longer exists. Each note has a small `.note-connect-handle`
dot (right edge, hover-only) — dragging from it draws a live dashed
preview line (`.connector-drawing`) following the cursor;
`document.elementFromPoint()` at pointerup determines whether it landed
on a different note's card, and if so `createConnector()` adds the pair
(silently no-ops on drag-to-self or an already-existing pair either
direction). Rendered as a quadratic Bézier (`quadPath()` — control point
offset perpendicular to the straight line between note centers, bulge
capped at 46px) between the two notes' *centers*; since the connector
layer's `z-index: 20` sits below notes (`z-index: 50+`) but above zones
(`z-index: 1`), the portion of the curve inside each note's rectangle is
simply occluded by the opaque card — no edge-intersection math needed for
it to read as "connecting the two cards." `updateConnectorsForNote(id)`
is called from inside both the note drag and resize `onMove` handlers so
connected lines track live, not just after the gesture ends. Deleting a
note calls `removeConnectorsForNote()` (both the explicit trash button
and the auto-delete-when-blank path below). Hovering a connector reveals
a small × at its midpoint (a wide invisible `.connector-hit` stroke makes
the thin visible line easier to hover/click) — clicking it removes just
that connector, no confirmation.

### Auto-delete on blank

Both `saveAndRender()` (card) and `saveExpandEdit()` (expand overlay)
check `isBlank(content)` before persisting; if the note has no non-
whitespace content when editing ends, `removeNoteQuietly()` deletes it
immediately instead of leaving an empty "Click to write…" card on the
board. This applies uniformly — a freshly double-clicked note nobody
typed into, *or* an existing note fully cleared out — rather than only
to newly-created ones, since there's no reliable way to distinguish those
cases at blur time that would be worth the complexity. No undo toast
here (unlike the explicit trash-button path) since there was never
anything written to lose.

### Trash zone: drag a note or category onto it to delete it

A small circular button, bottom-left (`#trashZone`, mirrors `.zoom-
control`'s position on the opposite corner). `pointOverTrash()` hit-tests
the pointer against its bounding rect with 16px of padding (a small
circular target is otherwise hard to actually land on mid-drag). Both the
note-card drag handler and `startZoneMove()` (zones) call it from their
`onMove`, toggling `.armed` on the trash button the moment a drag starts
(proves the target exists) and `.hover` + `.will-delete` on the dragged
item itself once the pointer is actually over it (about to delete on
release) — then check it again in `onUp` to decide delete-vs-normal-drop.
**A note dropped on the trash reuses `deleteNote()`** (same undo-toast
path as its own × button) rather than a separate code path. **Zones get a
new `deleteZoneWithUndo()`**, parallel to but separate from the existing
`deleteZone()` (still used by the zone's own × button, still no undo) —
dragging is easier to trigger by accident than clicking a small ×, so
only the drag path gets the undo-toast safety net.

### Minimap: spatial overview, not a note list

**This is not the sidebar/note-list `CLAUDE.md` already says was tried
and rejected** (see "Design constraints" above) — it carries no text, no
titles, nothing to read, just small colored dots (notes) and thin
outlines (zones) positioned spatially, plus a rectangle showing the
current viewport. `#minimap`/`#minimapContent`/`#minimapViewport`, hidden
whenever there are zero notes and zero zones (same pattern as
`emptyHint`).

Split into two functions on purpose, for cost reasons:
- `refreshMinimap()` is the expensive path — recomputes the board-space
  bounding box over every note + zone, rebuilds the scale/offset mapping
  (`minimapLayout`), and rebuilds every dot/outline element. Called only
  when the actual set of notes/zones or their position/size changes
  (create, delete, drag-end, resize-end, import, init) — **not** on every
  drag frame.
- `updateMinimapViewport()` is the cheap path — just repositions the one
  viewport-rectangle element using the cached `minimapLayout`. Called
  from inside `applyView()`, so it runs on every pan/zoom frame; it never
  touches notes/zones so that's affordable.

If a new note/zone mutation is ever added, it needs a `syncOverlays()`
call at wherever the equivalent `saveBoard()`/`saveZones()` call already
sits — easy to miss since nothing will error, the minimap (and zone note
counts, see below) will just silently drift out of sync with the board.
`syncOverlays()` is `refreshMinimap()` + `refreshZoneCounts()` together,
since almost every mutation that invalidates one invalidates the other —
call sites reach for `syncOverlays()`, not the two pieces separately.
Where a zone is being newly created or undo-restored, create its DOM
first and call `syncOverlays()` after — `refreshZoneCounts()` looks up
`zoneRefs`, so calling it before the zone's ref exists silently skips
that zone's badge for that one call.

Clicking anywhere inside the minimap pans the view so that point becomes
the new viewport center (zoom unchanged) — the inverse of the
scale/offset math `refreshMinimap()` computed. This is the one place a
click-to-jump exists in the whole app; deliberately not extended to
drag-to-pan-from-the-minimap, to keep it to the one interaction actually
asked for.

A pinned note (see "Pinned notes" below) is left out of the bounding box
and dots entirely — same reasoning as `fitToContent()` already excluding
it: it no longer has a meaningful canvas position.

### Checklists: `- [ ] foo` / `- [x] foo` as clickable checkboxes

Extends `renderMarkdown()` with a rule checked **before** the generic
bullet rule (`- [ ] foo` would otherwise become a bullet whose text is
the literal string "[ ] foo"). Consecutive checklist lines group under
one `<ul class="task-list">`, same `inList` mechanism the plain `ul`/`ol`
rules already use — `closeList()` needed a `'task'` case added since
that state doesn't map 1:1 to a closing tag the way `'ul'`/`'ol'` do.

Each rendered checkbox carries `data-task="N"`, N being **the checklist
line's occurrence order**, not its raw line number. This matters because
the fenced-code-block collapse earlier in `renderMarkdown()` merges a
multi-line code block into one placeholder line, which would throw off a
raw line index for any checklist below it — but never throws off the
*occurrence count*, since a checklist-looking line that was actually
inside a fenced block never reached the render loop as its own line
either way. `toggleChecklistLine()` (in app.js, not the renderer) redoes
this same skip-fenced-interiors scan directly over `note.content` to
find the Nth checklist line and flip its `[ ]`/`[x]`, so the two stay in
sync regardless of what else is in the note.

Checkboxes are wired via **event delegation** on each note's `renderEl`
(and once on the shared `expandRender`), not a per-checkbox listener —
the whole render gets rebuilt on every edit, so per-element listeners
would just leak. `.task-item` is added to the card's drag-initiation
exclusion list (alongside `.note-action`, `.note-color-dot`, etc.) so
clicking a checkbox neither starts a card drag nor falls through to
click-to-edit; `expandRender`'s click handler gets an explicit early
branch for the same reason, since it otherwise unconditionally enters
edit mode on any click.

### Zone note counts

A small badge (`.zone-count`) next to a zone's label, showing how many
notes currently have their **center point** inside the zone's rectangle
— simplest reasonable membership test, and consistent with zones being
purely visual (there's still no stored membership list anywhere).
`computeZoneNoteCount()`/`refreshZoneCounts()` recompute it for every
zone on every `syncOverlays()` call, same triggers as the minimap.

**The count element is a sibling of `.zone-label`, never text appended
inside it** — `zone.label`'s blur handler saves `label.textContent`
verbatim, so if the count were inside that same element it would
eventually get typed over or saved as literal text the next time
someone renames the zone. Both now live inside a wrapping
`.zone-label-row`, which is what actually carries the position/
background/move-cursor styling that `.zone-label` alone used to carry —
**any new zone control still needs adding to `zoneControlSelector`** the
same way this one was (`.zone-label-row`, not `.zone-label`, so the
count badge is covered too) — see the existing warning above.

### Connector labels

A small text label at a connector's midpoint (offset 16px below the
exact bezier midpoint, so it doesn't sit under the delete-× that also
lives there on hover). **Deliberately a plain HTML `<div>`, not SVG
text** — it's appended to `.board-inner` alongside note cards and zones,
so it rides the same pan/zoom transform for free using plain board-space
`left`/`top`, and can just be an ordinary `contenteditable` span reusing
`beginInlineTextEdit()` (the same helper zone-label renaming uses — the
two were identical code, factored out rather than duplicated) instead of
fighting with SVG `foreignObject` or text-editing-in-SVG.

**A real gotcha that cost real debugging time, worth knowing before
touching this again:** the label is hidden (`opacity:0; pointer-events:
none`) until its connector is hovered, mirrored via JS since the label
lives outside the SVG `<g class="connector-group">` it's conceptually
part of (no CSS sibling selector can reach across that gap). The first
version only listened for `pointerenter`/`pointerleave` on `g` itself —
which broke the moment the mouse actually moved from the connector's
hit-path *onto the label*, because the label visually overlaps the
hit-path but isn't a descendant of `g`, so that move fires `g`'s
`pointerleave` right as the cursor arrives, hiding the very label being
moved onto. Confirmed by scripted testing: `elementFromPoint` correctly
resolved to the label div, but nothing was clickable there because CSS
had already flipped it back to `pointer-events: none` by the time the
click landed. **Fixed by giving the label its own matching
`pointerenter`/`pointerleave` pair** that re-asserts/clears the same
`.hint-visible` class — `g`'s pointerleave and the label's pointerenter
both fire in the same synchronous dispatch when crossing that boundary,
so the class settles correctly before the next paint either direction.
If any other overlay element is ever positioned outside the element
whose hover it's meant to track, expect this same gap and use the same
fix (both sides own their own enter/leave, not just the "source" side).

Deleting a connector (`deleteConnector()`) also removes `refs.labelEl`,
not just `refs.g` — easy to forget since the label was bolted on after
the SVG group already existed. A pinned note (see below) hides its
connectors *and* their labels together in `updateConnectorPath()`, since
a connector to a note that's left the canvas has nothing meaningful to
draw a line — or a label — toward.

### Pinned notes

A note can leave the canvas entirely for a small fixed column in the
top-right corner (`#pinnedLayer`, below the topbar, mirroring where the
minimap sits on the opposite side) via a pin button in the note's own
action row (and the expand overlay's). It stays there — not panning,
not zooming — until unpinned, at which point it returns to exactly
where it was (`note.x`/`y`/`w`/`h` are left untouched the whole time
it's pinned; only the DOM element itself moves between containers).

**Why it has to be a real DOM move, not just a CSS `position: fixed`
toggle left in place:** `.note-card` is a `position: absolute` child of
`.board-inner`, which has `transform` applied for pan/zoom. Per the CSS
spec, an ancestor with `transform` becomes the containing block for
`position: fixed` descendants too, not just `position: absolute` ones —
a lesser-known rule most people only learn by hitting it. So a card
can't just flip to `fixed` while staying inside `.board-inner`; it would
still be positioned relative to the transformed box and pan/zoom right
along with everything else, silently defeating the entire point.
`toggleNotePinned()` in app.js physically re-parents the card between
`.board-inner` (board-space coordinates restored) and `#pinnedLayer`
(no coordinates at all — CSS just stacks it in a flex column) instead.

A pinned card gets `transform: none !important` (`.note-card.pinned` in
style.css) to cancel both its resting tilt and the hover/dragging
un-tilt transforms — `!important` is rare in this codebase (the global
`[hidden]` rule is the only other instance) but justified here: without
it, cascade specificity ties against `.note-card:hover`/`.note-card.
dragging` would be resolved by source order rather than intent, and a
fixed HUD element should just never tilt, full stop.

Pinned notes are excluded from: `fitToContent()`'s bounding box,
`refreshMinimap()`'s bounding box and dots, and `computeZoneNoteCount()`
— all for the same reason, they no longer have a meaningful canvas
position. Resizing and drawing new connectors are disabled while pinned
(the resize handle and connect handle are hidden via CSS) — but the
card's own pointerdown handler still runs otherwise unchanged, so
click-to-edit, the color popover, the format toolbar, copy/export/
delete, and unpinning all keep working exactly as before without needing
their own pinned-specific branches.

**Reordering within the pinned column.** Dragging a pinned card (from
the same pointerdown handler above — it now branches to
`startPinnedReorder()` instead of the canvas-drag path when
`note.pinned`) doesn't reposition it in board space; it reorders it
within `#pinnedLayer`. The dragged card gets a live `translateY` offset
via a `--drag-y` custom property (`.note-card.pinned.reordering` in
style.css) so it visibly follows the cursor — a plain inline
`style.transform` wouldn't work here, since `.note-card.pinned`'s own
`transform: none !important` would beat it outright; `.reordering`'s
higher selector specificity is what lets it win instead. Its siblings
are ordinary flex items, so the moment the drag crosses a neighbor's
vertical midpoint, physically moving the dragged card in the DOM
(`sib.before()`/`sib.after()`) makes that neighbor snap into the
vacated slot for free — no manual layout math for anything but the one
card actually being dragged. On drop, the final order is read straight
back out of the DOM (`#pinnedLayer`'s current child order) and spliced
into `notes` at the same array *slots* the pinned notes already
occupied, leaving every non-pinned note's position in the array alone —
array order has no visual meaning for canvas notes, so this only needs
to be "correct," not "preserve intent," for the non-pinned majority.

### Note templates

A small chevron button (`#templateBtn`) beside "New" opens a popover
(`#templatePopoverTemplate`, same pattern as the color popover) listing
"Blank note" / "Meeting notes" / "To-do list". Picking one just calls
`createNoteAtViewportCenter()` with a starter string from the
`NOTE_TEMPLATES` map instead of `''` — no new creation path, no new note
fields, the template is purely "different initial text." Templates are
plain strings (not objects with structure) specifically so they run
through the exact same edit/save/checklist pipeline as anything a user
types by hand — a to-do template is just a string that happens to start
with `- [ ] ` lines, nothing checklist-specific had to know about it.

### Zone accent color

Opt-in only — a zone stays the plain grey outline by default. Picking a
color (via `.zone-color-dot`, opening the same generalized
`openColorPopover()` templates/notes already use) just thickens the top
border into a slim accent (`.zone-frame[data-color]`), the same
restraint notes use instead of a fill — **deliberately not extending the
"zones are just a thin line" rule**, since this is additive/opt-in
rather than a default that could reintroduce the "too obvious" complaint
zones already went through several rounds to get away from (see "Design
constraints"). `openColorPopover(anchorEl, onPick)` was generalized from
note-only to accept a callback specifically to support this — the
popover itself doesn't know or care whether it's coloring a note or a
zone.

**The color dot lives inside `.zone-label-row`, not floating on its
own** — same reasoning as the note-count badge: it needs `pointer-events`
and its own click handler, and needs to be excluded from the row's
move-zone `pointerdown` handler (`e.target.closest('.zone-color-dot')`
returns early there) or clicking it would drag the zone instead of
opening the popover.

### Connector chain export

`expandChainBtn` (expand overlay only, not the compact card — the
overlay is already where single-note export lives, and the card's
action row is crowded enough) bundles a note and everything transitively
reachable from it via connectors into one `.md` file.
`collectConnectedNotes()` does a breadth-first walk of the connector
graph — connectors have no direction in the UI, so both `c.from` and
`c.to` are followed from whichever id is currently being visited — and
returns notes in "this one, then what's directly connected, then what's
connected to that" order, which is what makes the exported file read as
a chain rather than an arbitrary bag of notes. Bails with a toast instead
of downloading a useless one-note file if nothing is connected.

### Tags

`#word` in note text renders as a small pill (`.tag-pill`, via a rule
appended near the end of `inlineMd()`) and is clickable to spotlight
every note sharing that tag — matching notes stay full-strength,
everything else dims (`.tag-dimmed`/`.tag-highlighted`), rather than
non-matches being hidden outright, so the board's layout stays legible
while scanning. Clicking the same tag again clears it; clicking a
different tag switches to it. `activeTagHighlight` holds the one active
tag (lowercased); `noteHasTag()` re-tests it against a note's raw content
on demand rather than anything being precomputed or cached per note.

**The tag regex runs after the link rule, not before, and requires a
word-boundary before the `#`** (`(^|\s)#word`, not just `#word`)
specifically so a URL's own `...#section` fragment — already tucked
inside an `href="..."` attribute by the time this rule runs — is never
misread as a tag. If tag matching is ever touched, keep both of those:
running it earlier, or dropping the boundary requirement, reopens that
hole.

Newly created/restored notes call `applyTagHighlight()` once at the end
of `createNoteDOM()` (cheap no-op when nothing's highlighted); a content
edit re-applies it from `saveAndRender()`/`saveExpandEdit()`, since
editing a note's text is the one thing that can change whether it
matches the currently active tag.

### Stats pill

A small `#statsPill` ("N notes · M words") sits to the left of the zoom
control — both now live inside a shared `.bottom-right-cluster` flex
container specifically so neither one has to know the other's
(text-dependent, variable) width to avoid overlapping it; `.zoom-control`
itself dropped its own `position: fixed` once the wrapper took over that
job. `refreshStats()` is folded into `syncOverlays()` (covers
create/delete/import/init for free) but is also called directly from
`saveAndRender()`/`saveExpandEdit()`, since a plain content edit changes
the word count without changing anything `syncOverlays()`'s other
triggers (position, existence) care about.

### Cursor "create here" ghost

Replaces trying to detect a mid-double-click state, which no browser
event actually exposes. `#createGhost` is a small dashed-outline div,
`position: fixed`, that follows `board`'s `pointermove` whenever nothing
else is happening (`!interacting` and not over a note/zone control — see
`zoneControlSelector`), giving a persistent low-key "double-click here"
affordance instead of a one-off tooltip. `interacting` is a single
module-level flag flipped by `setInteracting()` around every drag-type
gesture (board pan, note drag/resize, zone move/resize, connector draw)
so the ghost never fights with something actually being dragged. If a
new drag gesture is added anywhere, wrap it in `setInteracting(true)` /
`setInteracting(false)` the same way.

### Board pulse on load

`createNoteDOM(note, popDelayMs)` adds a `.pop-in` class (a short scale+
fade keyframe animation, using the note's own `--rot` so it settles at
its resting tilt rather than snapping to it) and removes the class on
`animationend`. **The class removal matters, not just tidiness**: with
`animation-fill-mode: both` this animation would otherwise keep
overriding the `transform` property indefinitely (per the CSS animations
spec, a finished forwards-filling animation continues to win over
transitions on the same property), silently breaking the hover/drag
un-tilt transition for every note that ever played it — i.e. all of
them. If this animation is ever changed, keep the `animationend` cleanup.
Init staggers notes by `min(index, 8) * 40ms`; a single freshly created
note just gets `popDelayMs = 0` (an immediate small pop, no stagger).

### Data model & persistence (notes)

`notes`: `{ id, x, y, w, h, content, color, shape, rot, createdAt,
updatedAt }` under `nook.board.v2`. `color` is one of `ACCENTS` (`clay |
ink | moss | plum | ochre | berry`), `shape` one of `SHAPES` (`stripe-
left | stripe-top | corner-fold | tab`), `rot` a small random degree
value (−2 to 2) — assigned once via `pick()`/`randomRot()` at creation,
then persisted (not re-randomized on reload). View state under
`nook.view.v2`, theme under `nook.theme.v1`. Titles (export filenames)
are still derived from the first non-empty line of `content` — no
separate title field.

Colors/shapes are CSS-driven from named keys the same way as before
(`--note-accent` custom property per `data-color`, shape rules keyed off
`data-shape`) — see the block comment in `style.css` above the accent
variables for the full rationale. Both are picked randomly at note-
creation time (`pick(ACCENTS)`, `pick(SHAPES)`), an explicit ask so a
board of notes looks individually varied rather than defaulting to one
look. Cards also un-tilt on `:hover`/`:focus-within`/`.dragging` back to
`rotate(0deg)` — rotation is deliberately ignored (not un-rotated) in the
drag/resize pointer math, since at ±2° the error is imperceptible and
real trigonometry would add complexity for no visible benefit.

**Migration from the pre-board sidebar version** (`nook.notes.v1`) still
runs the same way it always has if `nook.board.v2` has never existed.

### Custom Markdown renderer, with light "intelligence" beyond literal syntax

Unchanged from the previous round: a hand-rolled, line-based parser
(`renderMarkdown()`/`inlineMd()`/`escapeHtml()`) that also auto-bolds an
implicit first-line title and standalone "Label:" lines, recognizes
bullet glyphs beyond `-`/`*` (`•‣◦○·`), and renders ordered lists as real
`<ol><li>` so numbering is always sequential regardless of what digits
were in the source. See inline comments in `renderMarkdown()` for the
`firstBlockEmitted` mechanics if extending this.

**Inline code is protected from every other inline rule.** `inlineMd()`
extracts `` `code spans` `` into a side array *before* escaping/bold/
italic/underline/highlight/caps run, substituting them back in (escaped)
at the very end — using invisible `⁣` (U+2063) delimiters, not spaces,
since inline code can sit hard against punctuation mid-sentence and a
space-padded placeholder would visibly insert whitespace that wasn't
there. This exists because `++`/`==`/`^^` are exactly the kind of
characters real code contains (`i++`, `a == b`, `x ^= 1`) — without this,
pasting a code snippet outside a fenced block would have those
misread as underline/highlight/caps markup. **If you ever touch the
placeholder format, don't go back to space-padding or to ` `** — a
literal NUL byte was tried once already and silently corrupted the file
in a way that made even `grep`/`Edit`-tool string matching fail against
the very byte sequence that was supposedly there; `⁣` doesn't have
that problem and is invisible when rendered either way.

### Formatting toolbar: bold, italic, underline, highlight, all-caps

Selecting text while editing swaps the note header's own actions
(expand/copy/delete) for a small toolbar (`.note-format-actions`) —
clicking B/I/U/H/AA wraps the current textarea selection in a marker
(`applyFormat()` + `FORMAT_MARKS`: `**`/`*`/`++`/`==`/`^^`) and
`renderMarkdown()` turns those into `<strong>`/`<em>`/`<u>`/`<mark>`/
`<span class="caps-text">`. Clicking again on an already-wrapped
selection un-wraps it — this is a **toggle**, not just an "insert
markers" action. All-caps is non-destructive: it wraps the text in
`^^...^^` and lets CSS `text-transform: uppercase` do the display work,
rather than mutating the actual stored characters, so toggling it back
off restores the original casing exactly.

Two non-obvious bits if extending this:

- **Toolbar buttons use `pointerdown` + `preventDefault()`, not
  `click`.** A `<button>` steals focus on click by default, which would
  blur the textarea *before* the click handler even runs — losing the
  selection `applyFormat()` needs, and (worse) triggering
  `saveAndRender()`'s blur handler, swapping back to rendered view out
  from under the toolbar. `preventDefault()` on `pointerdown` stops the
  browser's default focus-shift, so the textarea never loses focus at
  all.
- **Italic's `*` needs a same-character disambiguation guard against
  bold's `**`.** Since `**bold**` contains `*` as a substring, naively
  checking "is there one `*` immediately outside the selection" for
  italic would also match the inner edge of a `**` pair — toggling
  italic on already-bold text would then strip one asterisk from each
  side, corrupting the bold marker into a stray single `*`, instead of
  correctly stacking into `***bold and italic***`. `applyFormat()`
  guards this by also checking there isn't *another* `*` just beyond the
  one being matched (`isAmbiguousStar`) before treating it as a real
  italic-wrap-to-remove; if that guard is ever refactored away, this
  exact bug will come back.

**`⌘/Ctrl+B/I/U` also work**, but only while a `.note-edit` textarea is
focused (see the `keydown` listener near the `paste` listener) — see
"No custom keyboard shortcuts" above for why these three specifically
are an exception and highlight/caps deliberately aren't.

### Clipboard integration, delete-with-undo, backup/restore

All unchanged in mechanism from the previous round — `#pasteBtn` +
global paste listener, explicit-delete-with-undo-toast (distinct from
the silent auto-delete-on-blank above), and `#exportBtn`/`#importBtn`
round-tripping the whole board state. **Export/import now includes
`connectors` alongside `notes`/`zones`** (`{ notes, zones, connectors }`);
import still accepts a bare notes array (the oldest export format) and
fills in random color/shape/rotation plus grid-fallback position for any
note missing those fields, and drops any imported connector whose `from`/
`to` doesn't match an id in the imported notes.

## Hub page tile

Per `../CLAUDE.md`, every project here gets a themed tile on the
`ai-slop/` root hub ("The Quagmire"). Nook's tile
(`.tile[data-theme="nook"]` in `../style.css`) uses the same nested-
square mark as the app's own current logo (see "Design constraints"
above) — keep these in sync if the logo changes again.

## Running it

Open `index.html` directly in a browser, or serve the folder
(`python3 -m http.server`) — no build step needed either way.

## Deployment

Static hosting only, served as part of the shared `ai-slop` GitHub Pages
site. No environment variables, API keys, or backend. Nothing here ever
leaves the browser it was written in.
