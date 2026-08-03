export function initShimmer(): void {
  document.querySelectorAll<HTMLImageElement>('.img-wrapper img').forEach((img) => {
    if (img.dataset.shimmerInit) return;
    img.dataset.shimmerInit = 'true';

    const wrapper = img.closest('.img-wrapper');
    if (!wrapper) return;

    const markLoaded = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => wrapper.classList.add('loaded'));
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
  });
}
