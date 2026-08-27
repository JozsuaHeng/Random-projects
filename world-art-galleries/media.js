// Tiny shared DOM helper for rendering a gallery/artwork "media" slot: a
// curated gradient placeholder (shown immediately, so nothing ever waits on
// the network to look intentional) that crossfades to a real <img> once
// wiki-images.js has resolved a thumbnail. Used by render-world.js,
// render-gallery.js, and render-artwork.js so this markup/behavior lives in
// exactly one place instead of three.

export function createMediaElement({ gradient, caption }) {
  const wrap = document.createElement("div");
  wrap.className = "media";

  const placeholder = document.createElement("div");
  placeholder.className = "media-placeholder";
  placeholder.style.background = `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`;

  const captionEl = document.createElement("span");
  captionEl.className = "placeholder-caption";
  captionEl.textContent = caption;
  placeholder.appendChild(captionEl);

  wrap.appendChild(placeholder);
  return wrap;
}

// Call once an image lookup has resolved for this element's wikiTitle.
// No-op (keeps the placeholder) when the lookup came back as 'placeholder'.
export function applyImageResult(mediaEl, imageResult, altText) {
  if (!mediaEl || !imageResult || imageResult.status !== "image") return;
  const img = document.createElement("img");
  img.src = imageResult.url;
  img.alt = altText;
  img.loading = "lazy";
  img.addEventListener("load", () => img.classList.add("loaded"));
  mediaEl.appendChild(img);
}
