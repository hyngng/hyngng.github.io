import { collectCards, sortByIndex } from './dom';
import { distributeByWeight, GAP } from './distribution';

export function isMobile(): boolean {
  return window.matchMedia('(max-width: 960px)').matches;
}

export function needsRelayout(columns: HTMLElement | null): boolean {
  return isMobile() || (columns?.querySelectorAll('.posts-col').length ?? 0) !== 2;
}

export function restoreMobileFlow(columns: HTMLElement, items: HTMLElement[], loadMore: HTMLElement | null): void {
  const fragment = document.createDocumentFragment();
  for (const el of items) fragment.appendChild(el);
  if (loadMore) fragment.appendChild(loadMore);
  columns.replaceChildren(fragment);
  columns.dataset.layout = 'flow';
}

export function buildDesktopColumns(columns: HTMLElement, items: HTMLElement[], loadMore: HTMLElement | null): void {
  const columnsWidth = columns.getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(columns).gap) || GAP;
  const colWidth = (columnsWidth - gap) / 2;

  const { left: leftEls, right: rightEls, leftWeight, rightWeight } = distributeByWeight(
    items,
    colWidth,
    el => el.classList.contains('post-card--with-image'),
  );

  const leftCol = document.createElement('div');
  leftCol.className = 'posts-col posts-col-left';
  const rightCol = document.createElement('div');
  rightCol.className = 'posts-col posts-col-right';

  for (const el of leftEls) leftCol.appendChild(el);
  for (const el of rightEls) rightCol.appendChild(el);
  if (loadMore) {
    const target = leftWeight <= rightWeight ? leftCol : rightCol;
    target.appendChild(loadMore);
  }

  const fragment = document.createDocumentFragment();
  fragment.appendChild(leftCol);
  fragment.appendChild(rightCol);
  columns.replaceChildren(fragment);
  columns.dataset.layout = 'masonry';
}

export function relayoutGrid(columns: HTMLElement): void {
  const allCards = collectCards(columns);
  const loadMore = columns.querySelector<HTMLElement>('.load-more-card');
  if (allCards.length === 0) return;

  const sorted = sortByIndex(allCards);

  if (isMobile()) {
    restoreMobileFlow(columns, sorted, loadMore);
  } else {
    buildDesktopColumns(columns, sorted, loadMore);
  }
}
