// Blur-up swap for avatar images (see scripts/build-avatar-lqip.mjs).
//
// Markup renders `src` as a tiny inline LQIP data URI and the real CDN
// URL as `data-real-src`, with a `.blur` filter on the wrapper. This
// swaps the real URL into the same <img> element as early as possible
// and removes the blur once it has loaded — so the avatar area always
// shows an image, never a blank placeholder circle, no matter how slow
// the (cold) service-worker round-trip is.
//
// Idempotent per element (dataset guard) so callers can invoke it again
// after dynamically appending post cards.

const REAL_SRC_ATTR = 'data-real-src';

export function initAvatarSwap(root: ParentNode | Iterable<ParentNode> = document): void {
  const roots: Iterable<ParentNode> =
    'querySelectorAll' in root ? [root as ParentNode] : (root as Iterable<ParentNode>);
  for (const scope of roots) {
    scope.querySelectorAll<HTMLImageElement>(`img[${REAL_SRC_ATTR}]`).forEach((img) => {
      if (img.dataset.avatarSwapped) return;
      img.dataset.avatarSwapped = 'true';

      const real = img.getAttribute(REAL_SRC_ATTR);
      if (!real) return;
      img.removeAttribute(REAL_SRC_ATTR);

      const wrapper = img.parentElement;
      if (!wrapper) return;
      const lqip = img.currentSrc || img.src; // the inline data URI

      img.addEventListener('load', () => wrapper.classList.remove('blur'), { once: true });
      img.addEventListener('error', () => {
        // Real image failed: fall back to the blurry placeholder instead of
        // a blank circle.
        img.src = lqip;
      }, { once: true });

      img.src = real;
    });
  }
}
