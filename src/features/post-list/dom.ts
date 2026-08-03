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
  leftCol: HTMLElement | null;
  rightCol: HTMLElement | null;
  loadMore: HTMLElement | null;
} {
  const columns = grid.querySelector<HTMLElement>('.posts-columns');
  if (!columns) return { columns: null, leftCol: null, rightCol: null, loadMore: null };
  return {
    columns,
    leftCol: columns.querySelector<HTMLElement>('.posts-col-left'),
    rightCol: columns.querySelector<HTMLElement>('.posts-col-right'),
    loadMore: columns.querySelector<HTMLElement>('.load-more-card'),
  };
}

export function assertInvariant(grid: HTMLElement): void {
  if (import.meta.env.DEV) {
    const { columns, leftCol, rightCol } = findColumns(grid);
    if (!columns) return;

    const loadMoreCount = columns.querySelectorAll('.load-more-card').length;
    if (loadMoreCount > 1) {
      console.warn('[post-list] invariant: >1 .load-more-card found', loadMoreCount);
    }

    const isDesktop = leftCol && rightCol;
    if (isDesktop) {
      const directChildren = Array.from(columns.children).filter(
        c => c.classList.contains('posts-col')
      );
      if (directChildren.length !== 2) {
        console.warn('[post-list] invariant: desktop expects exactly 2 .posts-col, got', directChildren.length);
      }
    }

    if (columns.dataset.layout === 'flow') {
      const hasCols = Array.from(columns.children).some(c => c.classList.contains('posts-col'));
      if (hasCols) {
        console.warn('[post-list] invariant: flow should have no .posts-col children');
      }
      const loadMoreCards = Array.from(columns.querySelectorAll('.load-more-card'));
      if (loadMoreCards.length > 1) {
        console.warn('[post-list] invariant: flow should have at most 1 .load-more-card, got', loadMoreCards.length);
      }
      if (loadMoreCards.length === 1 && columns.lastElementChild !== loadMoreCards[0]) {
        console.warn('[post-list] invariant: flow .load-more-card must be last child');
      }
    }
  }
}
