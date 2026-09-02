#!/usr/bin/env python3
"""
Builds index.html for The Playbook from the SKILL.md (+ references/*.md)
files in ../../claude-skills-library/skills/. Re-run this after editing
any skill there — it regenerates both the mindmap SVG and the category/
skill content, each between their own START/END markers in index.html,
leaving everything else (head, styles, script tag, flipchart modal)
untouched.

Usage: python3 build.py
"""
import re
import html
import math
from pathlib import Path

ROOT = Path(__file__).parent
SKILLS_DIR = ROOT / ".." / ".." / "claude-skills-library" / "skills"

SITE_NAME = "Vantage Point"  # change here to rename the mindmap's center label

CATEGORIES = [
    ("Strategic analysis", [
        "mece-problem-structuring",
        "swot-strategic-review",
        "porters-five-forces",
        "business-model-canvas",
        "market-sizing-tam-sam-som",
        "competitive-landscape-mapper",
        "root-cause-five-whys",
        "plan-on-a-page",
    ]),
    ("Client & stakeholder deliverables", [
        "executive-summary-writer",
        "consulting-deck-storyliner",
        "board-investor-memo",
        "proposal-sow-drafter",
        "government-tender-response",
        "workshop-agenda-designer",
        "stakeholder-influence-map",
        "stakeholder-engagement-log",
    ]),
    ("Change & program management", [
        "change-impact-assessment",
        "change-management-roadmap",
        "change-readiness-assessment",
        "communication-engagement-plan",
        "raid-log-builder",
        "program-governance-structure",
        "project-retrospective",
        "rapid-decision-framework",
        "benefits-realization-review",
    ]),
    ("Project methodologies", [
        "project-methodology-selector",
        "prince2-project-structuring",
        "pmbok-project-planning",
        "agile-delivery-setup",
        "waterfall-project-plan",
        "babok-requirements-elicitation",
    ]),
    ("Research & intelligence", [
        "competitor-research-brief",
        "discovery-interview-kit",
        "benchmark-comparator",
        "vendor-evaluation-scorecard",
        "data-insights-summarizer",
    ]),
    ("Financial & operational", [
        "unit-economics-breakdown",
        "financial-ratio-reviewer",
        "risk-register-builder",
        "raci-matrix-generator",
        "process-map-simplifier",
        "cost-benefit-analysis",
    ]),
    ("Business-owner day-to-day", [
        "meeting-notes-to-actions",
        "weekly-ops-report",
        "pre-mortem-facilitator",
        "okr-drafter",
        "impact-effort-prioritizer",
        "positioning-pitch-crafter",
        "negotiation-prep",
        "capability-competency-matrix",
    ]),
]

# Short labels for the mindmap (full names are used in the list headers).
MINDMAP_LABELS = {
    "Strategic analysis": "Strategic Analysis",
    "Client & stakeholder deliverables": "Client Deliverables",
    "Change & program management": "Change & Program",
    "Project methodologies": "Project Methods",
    "Research & intelligence": "Research",
    "Financial & operational": "Financial & Ops",
    "Business-owner day-to-day": "Day-to-Day",
}

CATEGORY_COLORS = {
    "Strategic analysis": "#1f6f5c",
    "Client & stakeholder deliverables": "#3a5a78",
    "Change & program management": "#c1502e",
    "Project methodologies": "#a6790f",
    "Research & intelligence": "#6b4a8a",
    "Financial & operational": "#2c3e5c",
    "Business-owner day-to-day": "#8a5a2f",
}

# Inner SVG markup only (no <svg> wrapper), 20x20 viewBox, currentColor.
CATEGORY_ICONS = {
    "Strategic analysis": '<circle cx="10" cy="10" r="7"/><circle cx="10" cy="10" r="3.6"/><circle cx="10" cy="10" r="0.9" fill="currentColor" stroke="none"/>',
    "Client & stakeholder deliverables": '<rect x="3" y="7.5" width="14" height="9" rx="1.5"/><path d="M7.2 7.5V5.8a1.8 1.8 0 011.8-1.8h2a1.8 1.8 0 011.8 1.8v1.7"/>',
    "Change & program management": '<path d="M16 9.5A6 6 0 106 13.2"/><path d="M16 5.5v4h-4"/>',
    "Project methodologies": '<circle cx="4.5" cy="5" r="2"/><circle cx="15.5" cy="5" r="2"/><circle cx="10" cy="15.5" r="2"/><path d="M6.3 6.4l2.8 6.6M13.7 6.4l-2.8 6.6"/>',
    "Research & intelligence": '<circle cx="8.3" cy="8.3" r="5.3"/><path d="M16.2 16.2l-3.7-3.7"/>',
    "Financial & operational": '<path d="M4.5 16V9.5M10 16V4M15.5 16v-5" stroke-linecap="round"/>',
    "Business-owner day-to-day": '<rect x="3" y="3" width="14" height="14" rx="2.5"/><path d="M6.3 10.2l2.1 2.1 5-5" stroke-linecap="round" stroke-linejoin="round"/>',
}

LIST_MARKER = re.compile(r"^(-|\d+\.)\s+(.*)$")
CHECKLIST_MARKER = re.compile(r"^-\s+\[ \]\s+(.*)$")
HEADING_MARKER = re.compile(r"^(#{1,6})\s+(.*)$")
TABLE_ROW = re.compile(r"^\|.*\|$")


def inline(text):
    text = html.escape(text, quote=False)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"`([^`]+?)`", r"<code>\1</code>", text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', text)
    return text


def render_table(lines):
    rows = [l.strip().strip("|").split("|") for l in lines]
    rows = [[c.strip() for c in r] for r in rows]
    header, _, *body = rows
    out = ["<div class=\"table-wrap\"><table><thead><tr>"]
    out += [f"<th>{inline(c)}</th>" for c in header]
    out.append("</tr></thead><tbody>")
    for r in body:
        out.append("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>")
    out.append("</tbody></table></div>")
    return "".join(out)


def render_list_block(lines):
    items = []
    checklist = bool(CHECKLIST_MARKER.match(lines[0]))
    ordered = bool(re.match(r"^\d+\.", lines[0]))
    for line in lines:
        cl_m = CHECKLIST_MARKER.match(line)
        m = LIST_MARKER.match(line)
        if cl_m:
            items.append(cl_m.group(1))
        elif m:
            items.append(m.group(2))
        else:
            items[-1] += " " + line.strip()
    if checklist:
        lis = "".join(f'<li class="check"><span class="box" aria-hidden="true"></span>{inline(i)}</li>' for i in items)
        return f'<ul class="checklist">{lis}</ul>'
    tag = "ol" if ordered else "ul"
    lis = "".join(f"<li>{inline(i)}</li>" for i in items)
    return f"<{tag}>{lis}</{tag}>"


def convert(md_text, heading_shift=0):
    blocks = re.split(r"\n\s*\n", md_text.strip())
    out = []
    for block in blocks:
        lines = [l for l in block.split("\n") if l.strip() != ""]
        if not lines:
            continue
        first = lines[0]
        if first.startswith("```"):
            code = "\n".join(lines[1:-1]) if lines[-1].strip() == "```" else "\n".join(lines[1:])
            out.append(f"<pre><code>{html.escape(code)}</code></pre>")
            continue
        hm = HEADING_MARKER.match(first)
        if hm and len(lines) == 1:
            level = min(6, len(hm.group(1)) + heading_shift)
            out.append(f"<h{level}>{inline(hm.group(2))}</h{level}>")
            continue
        if all(TABLE_ROW.match(l) for l in lines) and len(lines) >= 2:
            out.append(render_table(lines))
            continue
        if LIST_MARKER.match(first):
            out.append(render_list_block(lines))
            continue
        out.append(f"<p>{inline(' '.join(l.strip() for l in lines))}</p>")
    return "\n".join(out)


def parse_frontmatter(text):
    parts = text.split("---", 2)
    fm, body = parts[1], parts[2]
    name = re.search(r"^name:\s*(.+)$", fm, re.M).group(1).strip()
    desc = re.search(r"^description:\s*(.+)$", fm, re.M).group(1).strip()
    return name, desc, body.strip()


def title_case(slug):
    caps = {"mece", "raci", "swot", "okr", "okrs", "tam", "sam", "som", "sow",
            "prince2", "pmbok", "babok", "raid", "rfq", "rft"}
    return " ".join(w.upper() if w in caps else w.capitalize() for w in slug.split("-"))


def build_skill(slug, color):
    folder = SKILLS_DIR / slug
    skill_md = (folder / "SKILL.md").read_text()
    name, desc, body = parse_frontmatter(skill_md)
    body_html = convert(body, heading_shift=0)

    refs_html = ""
    refs_dir = folder / "references"
    if refs_dir.is_dir():
        for ref_file in sorted(refs_dir.glob("*.md")):
            ref_text = ref_file.read_text().strip()
            ref_html = convert(ref_text, heading_shift=2)
            refs_html += f'<div class="reference">{ref_html}</div>'

    display_name = title_case(slug)
    search_blob = html.escape(f"{display_name} {desc}".lower(), quote=True)

    return f'''
      <div class="skill" id="{slug}" data-search="{search_blob}" data-skill-name="{html.escape(display_name)}" style="--cat-color:{color}">
        <div class="skill-summary">
          <span class="skill-name">{display_name}</span>
          <span class="skill-desc">{inline(desc)}</span>
          <a class="dl-link" href="dl/{slug}.zip" download title="Download this skill's folder as a .zip" onclick="event.stopPropagation()">&#8681; .zip</a>
        </div>
        <button type="button" class="read-more" data-skill="{slug}">Read more &rarr;</button>
        <div class="skill-body" hidden>
          {body_html}
          {f'<h3 class="ref-heading">Deeper methodology &amp; worked examples</h3>{refs_html}' if refs_html else ''}
        </div>
      </div>'''


def build_content():
    sections = []
    for cat_name, slugs in CATEGORIES:
        cat_id = re.sub(r"[^a-z0-9]+", "-", cat_name.lower()).strip("-")
        color = CATEGORY_COLORS[cat_name]
        icon = CATEGORY_ICONS[cat_name]
        skills_html = "\n".join(build_skill(s, color) for s in slugs)
        sections.append(f'''
    <details class="category" id="{cat_id}" style="--cat-color:{color}">
      <summary class="category-title">
        <svg class="cat-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">{icon}</svg>
        {cat_name}<span class="category-count">{len(slugs)}</span>
        <a class="dl-link dl-link-cat" href="dl/{cat_id}.zip" download title="Download all {len(slugs)} skills in this category as one .zip" onclick="event.stopPropagation()">&#8681; download {len(slugs)}</a>
      </summary>
      <div class="skill-list">{skills_html}
      </div>
    </details>''')
    return "\n".join(sections)


def build_zips():
    """Generates downloadable .zip files: one per skill, one per category
    (bundling that category's skill folders), and one with everything.
    Each zip preserves the real folder structure (skill-slug/SKILL.md,
    skill-slug/references/*.md) so extracting it and dropping the result
    into ~/.claude/skills/ works exactly like the source library does."""
    import zipfile

    dl_dir = ROOT / "dl"
    dl_dir.mkdir(exist_ok=True)
    for old in dl_dir.glob("*.zip"):
        old.unlink()

    def add_skill(zf, slug):
        folder = SKILLS_DIR / slug
        zf.write(folder / "SKILL.md", f"{slug}/SKILL.md")
        refs_dir = folder / "references"
        if refs_dir.is_dir():
            for ref_file in sorted(refs_dir.glob("*.md")):
                zf.write(ref_file, f"{slug}/references/{ref_file.name}")

    for cat_name, slugs in CATEGORIES:
        for slug in slugs:
            with zipfile.ZipFile(dl_dir / f"{slug}.zip", "w", zipfile.ZIP_DEFLATED) as zf:
                add_skill(zf, slug)

    for cat_name, slugs in CATEGORIES:
        cat_id = re.sub(r"[^a-z0-9]+", "-", cat_name.lower()).strip("-")
        with zipfile.ZipFile(dl_dir / f"{cat_id}.zip", "w", zipfile.ZIP_DEFLATED) as zf:
            for slug in slugs:
                add_skill(zf, slug)

    with zipfile.ZipFile(dl_dir / "all-skills.zip", "w", zipfile.ZIP_DEFLATED) as zf:
        for _, slugs in CATEGORIES:
            for slug in slugs:
                add_skill(zf, slug)

    n_zips = len(list(dl_dir.glob("*.zip")))
    print(f"Wrote {n_zips} zip files into {dl_dir}")


def jitter(seed, lo, hi):
    """Deterministic pseudo-random value in [lo, hi] from a string seed —
    stable across rebuilds (no randomness), used to break the mindmap out
    of a perfect circle: real mindmaps have branches of uneven length."""
    h = 0
    for c in seed:
        h = (h * 131 + ord(c)) % 2147483647
    return lo + (h % 10000) / 10000.0 * (hi - lo)


def build_mindmap():
    """Radial tree: center hub -> category nodes -> skill leaf nodes.
    Radius (branch/leaf line length) is jittered per node so it reads as
    a hand-drawn mindmap rather than a perfect target — some lines longer,
    some shorter. Angular spacing between leaves is computed from a
    minimum pixel gap so labels don't collide, not from a fixed arc.
    Branch/leaf lines start at the HUB'S EDGE (not its center point) and
    the hub is drawn last, painted on top — otherwise lines from
    roughly-opposite branches visibly cross through the hub circle.
    Everything sits inside a #mm-viewport <g> that app.js pans/zooms, and
    every element carries an animation-delay so the whole thing draws
    itself outward from the hub on load (see .mm-pop / .mm-line in
    style.css for the actual keyframes)."""
    cx, cy = 1500, 1500
    r_center = 108
    r_cat_base, r_cat_jitter = 420, 36
    r_leaf_base, r_leaf_jitter = 900, 75
    min_leaf_gap_px = 88  # minimum straight-line distance between adjacent leaves
    max_arc_cap = 42  # never let one branch's leaves spread wider than this
    n = len(CATEGORIES)
    total_skills = sum(len(s) for _, s in CATEGORIES)

    branch_parts = []
    for i, (cat_name, slugs) in enumerate(CATEGORIES):
        cat_id = re.sub(r"[^a-z0-9]+", "-", cat_name.lower()).strip("-")
        color = CATEGORY_COLORS[cat_name]
        label = MINDMAP_LABELS[cat_name]
        base_angle_deg = -90 + i * (360 / n)
        angle_deg = base_angle_deg + jitter(cat_id, -4, 4)
        angle = math.radians(angle_deg)
        r_cat = r_cat_base + jitter(cat_id, -r_cat_jitter, r_cat_jitter)
        catx, caty = cx + r_cat * math.cos(angle), cy + r_cat * math.sin(angle)
        branch_delay = 200 + i * 70

        # Line starts at the hub's edge, not its exact center, so it
        # never visibly crosses the hub circle's interior.
        hub_edge_x, hub_edge_y = cx + r_center * math.cos(angle), cy + r_center * math.sin(angle)
        line_len = math.hypot(catx - hub_edge_x, caty - hub_edge_y)

        branch_parts.append(
            f'<line x1="{hub_edge_x:.1f}" y1="{hub_edge_y:.1f}" x2="{catx:.1f}" y2="{caty:.1f}" stroke="{color}" '
            f'stroke-width="2.5" opacity="0.6" class="mm-line" '
            f'style="--len:{line_len:.1f}px; animation-delay:{branch_delay}ms"/>'
        )

        n_leaves = len(slugs)
        # Minimum angular step so straight-line distance between adjacent
        # leaves (at the base leaf radius) is at least min_leaf_gap_px.
        step = 0.0
        if n_leaves > 1:
            step = math.degrees(2 * math.asin(min(1.0, min_leaf_gap_px / (2 * r_leaf_base))))
            arc_span = min(max_arc_cap, step * (n_leaves - 1))
            step = arc_span / (n_leaves - 1)
        cat_node_delay = branch_delay + 320

        for j, slug in enumerate(slugs):
            leaf_angle_deg = angle_deg + (j - (n_leaves - 1) / 2) * step + jitter(slug + "a", -1.2, 1.2)
            leaf_angle = math.radians(leaf_angle_deg)
            r_leaf = r_leaf_base + jitter(slug, -r_leaf_jitter, r_leaf_jitter)
            lx, ly = cx + r_leaf * math.cos(leaf_angle), cy + r_leaf * math.sin(leaf_angle)
            leaf_line_delay = cat_node_delay + 200 + j * 30
            leaf_node_delay = leaf_line_delay + 200
            leaf_line_len = math.hypot(lx - catx, ly - caty)

            branch_parts.append(
                f'<line x1="{catx:.1f}" y1="{caty:.1f}" x2="{lx:.1f}" y2="{ly:.1f}" stroke="{color}" '
                f'stroke-width="1.3" opacity="0.4" class="mm-line" '
                f'style="--len:{leaf_line_len:.1f}px; animation-delay:{leaf_line_delay}ms"/>'
            )
            anchor = "start" if math.cos(leaf_angle) >= -0.05 else "end"
            dx = 14 if anchor == "start" else -14
            display_name = title_case(slug)
            branch_parts.append(f'<a href="#{slug}" class="mm-leaf" data-cat="{cat_id}">')
            branch_parts.append(f'<g class="mm-pop" style="transform-origin:{lx:.1f}px {ly:.1f}px; animation-delay:{leaf_node_delay}ms">')
            branch_parts.append(f'<circle cx="{lx:.1f}" cy="{ly:.1f}" r="6" fill="var(--paper)" stroke="{color}" stroke-width="2.2"/>')
            branch_parts.append(f'<text x="{lx+dx:.1f}" y="{ly+6.5:.1f}" text-anchor="{anchor}" font-size="20" fill="var(--ink-soft)">{html.escape(display_name)}</text>')
            branch_parts.append('</g></a>')

        cat_anchor = "start" if math.cos(angle) >= -0.05 else "end"
        cat_dx = 24 if cat_anchor == "start" else -24
        branch_parts.append(f'<a href="#{cat_id}" class="mm-node">')
        branch_parts.append(f'<g class="mm-pop" style="transform-origin:{catx:.1f}px {caty:.1f}px; animation-delay:{cat_node_delay}ms">')
        branch_parts.append(f'<circle cx="{catx:.1f}" cy="{caty:.1f}" r="17" fill="{color}"/>')
        branch_parts.append(f'<svg x="{catx-11:.1f}" y="{caty-11:.1f}" width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="var(--paper)" stroke-width="1.8">{CATEGORY_ICONS[cat_name]}</svg>')
        branch_parts.append(f'<text x="{catx+cat_dx:.1f}" y="{caty+7.5:.1f}" text-anchor="{cat_anchor}" font-size="24" font-weight="700" fill="{color}">{html.escape(label)}</text>')
        branch_parts.append('</g></a>')

    # Hub is emitted LAST so it paints on top of every branch/leaf line —
    # combined with lines starting at its edge (not center) above, this
    # guarantees nothing is ever visible crossing through it.
    hub_parts = [f'<g class="mm-pop mm-hub" style="transform-origin:{cx}px {cy}px; animation-delay:0ms">']
    hub_parts.append(f'<circle cx="{cx}" cy="{cy}" r="{r_center}" fill="var(--paper)" stroke="var(--ink)" stroke-width="2.5"/>')
    name_lines = SITE_NAME.split(" ")
    if len(name_lines) > 1:
        mid = len(name_lines) // 2 + len(name_lines) % 2
        line1, line2 = " ".join(name_lines[:mid]), " ".join(name_lines[mid:])
        hub_parts.append(f'<text x="{cx}" y="{cy-20}" text-anchor="middle" font-family="Source Serif 4, Georgia, serif" font-weight="600" font-size="34" fill="var(--ink)">{html.escape(line1)}</text>')
        hub_parts.append(f'<text x="{cx}" y="{cy+18}" text-anchor="middle" font-family="Source Serif 4, Georgia, serif" font-weight="600" font-size="34" fill="var(--ink)">{html.escape(line2)}</text>')
        sub_y = cy + 46
    else:
        hub_parts.append(f'<text x="{cx}" y="{cy-8}" text-anchor="middle" font-family="Source Serif 4, Georgia, serif" font-weight="600" font-size="38" fill="var(--ink)">{html.escape(SITE_NAME)}</text>')
        sub_y = cy + 24
    hub_parts.append(f'<text x="{cx}" y="{sub_y}" text-anchor="middle" font-family="ui-monospace, monospace" font-size="18" fill="var(--muted)">{total_skills} skills</text>')
    hub_parts.append('</g>')

    inner = "\n".join(['<g id="mm-viewport">'] + branch_parts + hub_parts + ['</g>'])
    return f'''<svg id="mm-svg" viewBox="0 0 3000 3000" role="img" aria-label="Mindmap of {SITE_NAME}: {total_skills} skills across {n} categories, radiating from a central hub. Click any category or skill to jump to it below.">
{inner}
</svg>'''


def build():
    index_path = ROOT / "index.html"
    current = index_path.read_text()

    current = re.sub(
        r"(<!-- MINDMAP:START -->)(.*)(<!-- MINDMAP:END -->)",
        lambda m: m.group(1) + "\n" + build_mindmap() + "\n    " + m.group(3),
        current, flags=re.S,
    )
    current = re.sub(
        r"(<!-- CONTENT:START -->)(.*)(<!-- CONTENT:END -->)",
        lambda m: m.group(1) + build_content() + "\n    " + m.group(3),
        current, flags=re.S,
    )
    index_path.write_text(current)
    total = sum(len(s) for _, s in CATEGORIES)
    print(f"Wrote {total} skills across {len(CATEGORIES)} categories, plus the mindmap, into {index_path}")
    build_zips()


if __name__ == "__main__":
    build()
