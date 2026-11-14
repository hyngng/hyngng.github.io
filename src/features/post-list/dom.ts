export function normalizePath(path: string): string {
  return path.replace(/\/$/, '');
}

export function collectCards(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>('.post-card'));
}

export function sortByIndex(cards: HTMLElement[]): HTMLElement[] {
  return [...cards].sort((a, b) => {
    const ai = parseInt(a.dataset.index || '0', 10);
    const bi = parseInt(b.dataset.index || '0', 10);
    return ai - bi;
  });
}

export function parseChunkResponse(html: string): { cards: HTMLElement[]; loadMore: HTMLElement | null } {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const container = doc.querySelector('[data-post-chunk]') || doc;
  return {
    cards: sortByIndex(Array.from(container.querySelectorAll<HTMLElement>('.post-card'))),
    loadMore: container.querySelector('.load-more-card'),
  };
}

export function allPostsFromGrid(grid: HTMLElement): { path: string; title: string; description?: string }[] {
  try {
    return JSON.parse(grid.dataset.allPosts || '[]');
  } catch {
    return [];
  }
}

export function findColumns(grid: HTMLElement): {
  columns: HTMLElement | null;
  loadMore: HTMLElement | null;
} {
  const columns = grid.querySelector<HTMLElement>('.posts-columns');
  if (!columns) return { columns: null, loadMore: null };
  return {
    columns,
    loadMore: columns.querySelector<HTMLElement>('.load-more-card'),
  };
}

export function assertInvariant(grid: HTMLElement): void {
  if (import.meta.env.DEV) {
    const { columns } = findColumns(grid);
    if (!columns) return;

    const loadMoreCards = Array.from(columns.querySelectorAll('.load-more-card'));
    if (loadMoreCards.length > 1) {
      console.warn('[post-list] invariant: >1 .load-more-card found', loadMoreCards.length);
    }
    if (loadMoreCards.length === 1 && columns.lastElementChild !== loadMoreCards[0]) {
      console.warn('[post-list] invariant: .load-more-card must be last child');
    }
  }
}
