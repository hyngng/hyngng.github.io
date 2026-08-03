export function initPostCardImages() {
  document
    .querySelectorAll<HTMLImageElement>(".post-card-image img")
    .forEach((img) => {
      if (img.dataset.cardInit) return;
      img.dataset.cardInit = "true";

      const showImage = async () => {
        try {
          await img.decode();
        } catch {
          // decode failure must not keep a loaded image hidden.
        }
        requestAnimationFrame(() => {
          requestAnimationFrame(() => img.classList.add("loaded"));
        });
      };

      if (img.complete && img.naturalWidth > 0) {
        showImage();
      } else {
        img.addEventListener("load", showImage, { once: true });
      }
    });
}
