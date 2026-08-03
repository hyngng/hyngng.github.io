import { isMobile as checkMobile, relayoutGrid } from './layout';
import { findColumns } from './dom';

export function minCol(a: HTMLElement, b: HTMLElement): HTMLElement {
  return a.offsetHeight <= b.offsetHeight ? a : b;
}

export function distributeCards(
  columns: HTMLElement,
  leftCol: HTMLElement | null,
  rightCol: HTMLElement | null,
  cards: HTMLElement[],
): void {
  const mobile = checkMobile();
  if (mobile || !leftCol || !rightCol) {
    cards.forEach(card => columns.appendChild(card));
    return;
  }
  cards.forEach(card => minCol(leftCol, rightCol).appendChild(card));
}

export function appendChunkItems(
  grid: HTMLElement,
  cards: HTMLElement[],
  nextLoadMore: HTMLElement | null,
): HTMLElement[] {
  if (cards.length === 0) return [];

  let { columns, leftCol, rightCol, loadMore: currentLoadMore } = findColumns(grid);
  if (!columns) return [];

  const mobile = checkMobile();

  if (mobile && columns.dataset.layout !== 'flow') {
    relayoutGrid(columns);
    const fresh = findColumns(grid);
    if (!fresh.columns) return [];
    columns = fresh.columns;
    leftCol = fresh.leftCol;
    rightCol = fresh.rightCol;
    currentLoadMore = fresh.loadMore;
  }

  const appended = cards.slice(1);

  const firstCardImg = cards[0].querySelector('.post-card-image img');
  if (firstCardImg) {
    firstCardImg.classList.add('loaded');
  }

  currentLoadMore?.replaceWith(cards[0]);
  distributeCards(columns, leftCol, rightCol, appended);
  if (nextLoadMore) {
    if (mobile || !leftCol || !rightCol) {
      columns.appendChild(nextLoadMore);
    } else {
      minCol(leftCol, rightCol).appendChild(nextLoadMore);
    }
  }

  return appended;
}
