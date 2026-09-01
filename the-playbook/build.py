#!/usr/bin/env python3
"""
Builds index.html for The Playbook from the SKILL.md (+ references/*.md)
files in ../../claude-skills-library/skills/. Re-run this after editing
any skill there — it fully regenerates the <main> content block in
index.html between the START/END markers, leaving everything else
(head, styles, script tag) untouched.

Usage: python3 build.py
"""
import re
import html
from pathlib import Path

ROOT = Path(__file__).parent
SKILLS_DIR = ROOT / ".." / ".." / "claude-skills-library" / "skills"

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
    ]),
    ("Research & intelligence", [
        "competitor-research-brief",
        "discovery-interview-kit",
        "benchmark-comparator",
    ]),
    ("Financial & operational", [
        "unit-economics-breakdown",
        "financial-ratio-reviewer",
        "risk-register-builder",
        "raci-matrix-generator",
        "process-map-simplifier",
    ]),
    ("Business-owner day-to-day", [
        "meeting-notes-to-actions",
        "weekly-ops-report",
        "pre-mortem-facilitator",
        "okr-drafter",
        "impact-effort-prioritizer",
        "positioning-pitch-crafter",
        "capability-competency-matrix",
    ]),
]

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
    return " ".join(w.upper() if w in {"mece", "raci", "swot", "okr", "okrs", "tam", "sam", "som", "sow"} else w.capitalize()
                     for w in slug.split("-"))


def build_skill(slug):
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
      <details class="skill" data-search="{search_blob}">
        <summary>
          <span class="skill-name">{display_name}</span>
          <span class="skill-desc">{inline(desc)}</span>
        </summary>
        <div class="skill-body">
          {body_html}
          {f'<h3 class="ref-heading">Deeper methodology &amp; worked examples</h3>{refs_html}' if refs_html else ''}
        </div>
      </details>'''


def build():
    sections = []
    for cat_name, slugs in CATEGORIES:
        cat_id = re.sub(r"[^a-z0-9]+", "-", cat_name.lower()).strip("-")
        skills_html = "\n".join(build_skill(s) for s in slugs)
        sections.append(f'''
    <details class="category" id="{cat_id}">
      <summary class="category-title">{cat_name}<span class="category-count">{len(slugs)}</span></summary>
      <div class="skill-list">{skills_html}
      </div>
    </details>''')

    main_html = "\n".join(sections)

    index_path = ROOT / "index.html"
    current = index_path.read_text()
    new = re.sub(
        r"(<!-- CONTENT:START -->)(.*)(<!-- CONTENT:END -->)",
        lambda m: m.group(1) + main_html + "\n    " + m.group(3),
        current,
        flags=re.S,
    )
    index_path.write_text(new)
    print(f"Wrote {sum(len(s) for _, s in CATEGORIES)} skills into {index_path}")


if __name__ == "__main__":
    build()
