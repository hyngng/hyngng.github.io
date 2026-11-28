import { findColumns } from './dom';
import { updateSpans } from './masonry';

export function appendChunkItems(
  grid: HTMLElement,
  cards: HTMLElement[],
  nextLoadMore: HTMLElement | null,
): HTMLElement[] {
  if (cards.length === 0) return [];

  const { columns, loadMore: currentLoadMore } = findColumns(grid);
  if (!columns) return [];

  const appended = cards.slice(1);

  const firstCardImg = cards[0].querySelector('.post-card-image img');
  if (firstCardImg) {
    firstCardImg.classList.add('loaded');
  }

  // The load-more card is the container's last child; the chunk's first card
  // takes its place and the rest follow, keeping recency DOM order intact.
  currentLoadMore?.replaceWith(cards[0]);
  const fragment = document.createDocumentFragment();
  for (const el of appended) fragment.appendChild(el);
  columns.appendChild(fragment);
  if (nextLoadMore) columns.appendChild(nextLoadMore);

  updateSpans(columns);
  return appended;
}
