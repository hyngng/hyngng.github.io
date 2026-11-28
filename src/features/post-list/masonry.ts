// Single-container grid masonry. Cards render in recency (DOM) order, so
// keyboard focus follows the reading order. Each card spans enough implicit
// 2px rows to cover its measured height plus the column gap; grid
// auto-placement then fills the earliest gap, which preserves the old
// two-column masonry look and the "higher on the page = more recent" rule.
export const MOBILE_QUERY = '(max-width: 960px)';

const ROW_UNIT_PX = 2;

export function updateSpans(columns: HTMLElement): void {
  columns.setAttribute('data-masonry-js', '');
  const gap = parseFloat(getComputedStyle(columns).columnGap) || 0;
  for (const card of columns.querySelectorAll<HTMLElement>(
    ':scope > .post-card, :scope > .load-more-card',
  )) {
    // Not rendered (hidden load-more / search-filtered): skipped here and
    // re-measured by updateSpans once they become visible again.
    if (card.offsetParent === null) continue;
    // +0.5px absorbs fractional-height rounding before ceil().
    const h = card.getBoundingClientRect().height;
    const span = Math.max(1, Math.ceil((h + gap + 0.5) / ROW_UNIT_PX));
    card.style.gridRow = `span ${span}`;
  }
}

export function watchSpans(columns: HTMLElement, signal?: AbortSignal): void {
  updateSpans(columns);

  let timer: ReturnType<typeof setTimeout> | undefined;
  const recompute = () => {
    clearTimeout(timer);
    timer = setTimeout(() => updateSpans(columns), 120);
  };
  const opts: AddEventListenerOptions | undefined = signal ? { signal } : undefined;
  window.addEventListener('resize', recompute, opts);
  window.matchMedia(MOBILE_QUERY).addEventListener('change', recompute, opts);
  // Line counts may change when the webfont swaps in; re-measure once ready.
  document.fonts.ready.then(() => updateSpans(columns));

  if (signal) {
    signal.addEventListener('abort', () => clearTimeout(timer), { once: true });
  }
}
