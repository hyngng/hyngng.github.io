import { initImageReveal } from '../../utils/image-reveal';

export function initPostCardImages() {
  initImageReveal(
    '.post-card-image img',
    (img) => img,
    'cardInit',
  );
}
