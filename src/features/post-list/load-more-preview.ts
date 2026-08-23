import { MOBILE_QUERY } from './layout';

// Integer-rounded scroll metrics leave a few px of residual at true bottom
// (measured 3px); 8px absorbs rounding across device pixel ratios.
const BOTTOM_EPSILON_PX = 8;

export function initLoadMorePreview(grid: HTMLElement, signal: AbortSignal): void {
  const mobile = window.matchMedia(MOBILE_QUERY);
  let card: HTMLElement | null = null;
  let rafId = 0;

  function resolveCard() {
    card = grid.querySelector<HTMLElement>('.load-more-card:not([hidden])');
  }

  function update() {
    rafId = 0;
    if (!card || !card.isConnected) resolveCard();
    if (!card || !mobile.matches) return;

    const el = document.scrollingElement;
    if (!el) return;
    // Reads precede writes; toggling a class only dirties the card subtree,
    // so scrollHeight stays clean and no forced reflow happens per frame.
    const remaining = el.scrollHeight - el.clientHeight - el.scrollTop;
    card.classList.toggle('is-active', remaining <= BOTTOM_EPSILON_PX);
  }

  function scheduleUpdate() {
    if (!rafId) rafId = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true, signal });
  window.addEventListener('resize', scheduleUpdate, { signal });

  // Chunk loads and image reveals change the document height.
  const observer = new ResizeObserver(scheduleUpdate);
  observer.observe(document.body);

  // Leaving the mobile layout must clear the state even without a scroll event.
  mobile.addEventListener('change', () => {
    if (!mobile.matches && card) card.classList.remove('is-active');
    scheduleUpdate();
  }, { signal });

  signal.addEventListener('abort', () => {
    observer.disconnect();
    if (rafId) cancelAnimationFrame(rafId);
  }, { once: true });

  scheduleUpdate();
}
