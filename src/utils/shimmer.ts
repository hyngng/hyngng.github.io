import { initImageReveal } from './image-reveal';

export function initShimmer(): void {
  initImageReveal(
    '.img-wrapper img',
    (img) => img.closest('.img-wrapper'),
    'shimmerInit',
    true,
  );
}
