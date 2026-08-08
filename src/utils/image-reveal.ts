// Shared image-reveal logic for the shimmer (post content) and post-card
// image placeholders. Decodes the image, then marks the target element as
// `loaded` after two animation frames so the CSS fade-in is painted once the
// frame is composited.

function decodeAndMark(img: HTMLImageElement, target: HTMLElement): void {
  const markLoaded = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => target.classList.add('loaded'));
    });
  };

  const showImage = async () => {
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
    img.addEventListener('load', showImage, { once: true });
  }
}

export function initImageReveal(
  selector: string,
  getTarget: (img: HTMLImageElement) => HTMLElement | null,
  datasetKey: string,
): void {
  document.querySelectorAll<HTMLImageElement>(selector).forEach((img) => {
    if (img.dataset[datasetKey]) return;
    img.dataset[datasetKey] = 'true';

    const target = getTarget(img);
    if (!target) return;

    decodeAndMark(img, target);
  });
}
