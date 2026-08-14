// Shared image-reveal logic for the shimmer (post content) and post-card
// image placeholders. Decodes the image, then marks the target element as
// `loaded` after two animation frames so the CSS fade-in is painted once the
// frame is composited.

// Resizes the placeholder (e.g. .img-wrapper) to the image's real ratio as
// soon as the browser knows it. Browsers expose naturalWidth once the image
// header arrives (during streaming), well before the full download finishes,
// so the shimmer box is corrected early and smoothly instead of at load end.
function syncAspectRatio(img: HTMLImageElement, target: HTMLElement): boolean {
  if (target.style.aspectRatio) return true;
  if (img.naturalWidth > 0 && img.naturalHeight > 0) {
    target.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
    return true;
  }
  return false;
}

function pollAspectRatio(img: HTMLImageElement, target: HTMLElement): void {
  const tick = () => {
    if (syncAspectRatio(img, target)) return;
    // Stop polling once the image settles without a usable ratio (error).
    if (img.complete && img.naturalWidth === 0) return;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function decodeAndMark(
  img: HTMLImageElement,
  target: HTMLElement,
  syncRatio: boolean,
): void {
  const markLoaded = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => target.classList.add('loaded'));
    });
  };

  const showImage = async () => {
    if (syncRatio) syncAspectRatio(img, target);
    try {
      await img.decode();
    } catch {
      // decode failure must not keep a loaded image hidden.
    }

    markLoaded();
  };

  if (img.complete && img.naturalWidth > 0) {
    showImage();
  } else {
    if (syncRatio) pollAspectRatio(img, target);
    img.addEventListener('load', showImage, { once: true });
  }
}

export function initImageReveal(
  selector: string,
  getTarget: (img: HTMLImageElement) => HTMLElement | null,
  datasetKey: string,
  syncRatio = false,
): void {
  document.querySelectorAll<HTMLImageElement>(selector).forEach((img) => {
    if (img.dataset[datasetKey]) return;
    img.dataset[datasetKey] = 'true';

    const target = getTarget(img);
    if (!target) return;

    decodeAndMark(img, target, syncRatio);
  });
}
