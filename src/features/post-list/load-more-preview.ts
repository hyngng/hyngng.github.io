const PROGRESS_VAR = '--lm-progress';
const FALLBACK_START_PX = 125;
const FALLBACK_END_PX = 25;

export function initLoadMorePreview(grid: HTMLElement, signal: AbortSignal): void {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const rootStyle = getComputedStyle(document.documentElement);
  const startDistance = parseFloat(rootStyle.getPropertyValue('--load-more-reveal-start')) || FALLBACK_START_PX;
  const endDistance = parseFloat(rootStyle.getPropertyValue('--load-more-reveal-end')) || FALLBACK_END_PX;
  const span = Math.max(1, startDistance - endDistance);

  let card: HTMLElement | null = null;
  let rafId = 0;

  function resolveCard() {
    card = grid.querySelector<HTMLElement>('.load-more-card:not([hidden])');
  }

  function update() {
    rafId = 0;
    if (!card || !card.isConnected) resolveCard();
    if (!card || reducedMotion.matches) return;

    const el = document.scrollingElement;
    if (!el) return;
    // Reads precede writes; the custom property only feeds transform/filter/color,
    // so scrollHeight stays clean and no forced reflow happens per frame.
    const remaining = el.scrollHeight - el.clientHeight - el.scrollTop;
    const progress = Math.min(1, Math.max(0, (startDistance - remaining) / span));
    card.style.setProperty(PROGRESS_VAR, progress.toFixed(4));
  }

  function scheduleUpdate() {
    if (!rafId) rafId = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true, signal });
  window.addEventListener('resize', scheduleUpdate, { signal });

  // Chunk loads and image reveals change the document height.
  const observer = new ResizeObserver(scheduleUpdate);
  observer.observe(document.body);

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && card) card.style.removeProperty(PROGRESS_VAR);
    // Resync in both directions: turning reduce off must recompute immediately,
    // not wait for the next scroll event.
    scheduleUpdate();
  }, { signal });

  signal.addEventListener('abort', () => {
    observer.disconnect();
    if (rafId) cancelAnimationFrame(rafId);
  }, { once: true });

  scheduleUpdate();
}
