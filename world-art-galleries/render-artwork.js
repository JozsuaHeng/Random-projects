// Renders the artwork focus view (#artwork-focus, inside the <dialog>):
// the magnified image on one side, sharing a view-transition-name with
// whichever carousel/hero media element it morphed from, and the
// "wall of text" — description, medium, and history — on the other.

import { resolveImages, THUMB_SIZE } from "./wiki-images.js";
import { ART_MOVEMENTS } from "./artworks-data.js";
import { createMediaElement, applyImageResult } from "./media.js";

function movementInfo(slug) {
  return ART_MOVEMENTS.find((m) => m.slug === slug) ?? { slug, label: slug, gradient: ["#ccc", "#999"] };
}

export function renderArtworkFocus(container, artwork, gallery) {
  container.innerHTML = "";

  const media = createMediaElement({
    gradient: movementInfo(artwork.movements[0]).gradient,
    caption: artwork.title,
  });
  media.style.viewTransitionName = `artwork-${artwork.id}`;
  container.appendChild(media);

  const text = document.createElement("div");
  text.className = "focus-text";

  const eyebrow = document.createElement("div");
  eyebrow.className = "focus-eyebrow";
  eyebrow.textContent = gallery.name;
  text.appendChild(eyebrow);

  const heading = document.createElement("h2");
  heading.textContent = artwork.title;
  text.appendChild(heading);

  const artistLine = document.createElement("div");
  artistLine.className = "focus-artist";
  artistLine.textContent = `${artwork.artist} · ${artwork.yearDisplay}`;
  text.appendChild(artistLine);

  const tags = document.createElement("div");
  tags.className = "focus-tags";
  for (const label of [...artwork.movements.map((m) => movementInfo(m).label), artwork.category, artwork.medium]) {
    const tag = document.createElement("span");
    tag.className = "architecture-tag";
    tag.textContent = label;
    tags.appendChild(tag);
  }
  text.appendChild(tags);

  const descHeading = document.createElement("h4");
  descHeading.textContent = "About the work";
  text.appendChild(descHeading);
  const desc = document.createElement("p");
  desc.textContent = artwork.description;
  text.appendChild(desc);

  const historyHeading = document.createElement("h4");
  historyHeading.textContent = "History";
  text.appendChild(historyHeading);
  const history = document.createElement("p");
  history.textContent = artwork.history;
  text.appendChild(history);

  container.appendChild(text);

  resolveImages([artwork.wikiTitle], THUMB_SIZE.HERO).then((results) => {
    applyImageResult(media, results.get(artwork.wikiTitle), artwork.title);
  });
}
