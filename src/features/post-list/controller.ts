import { type PostListController, type PostListConfig, type ChunkPayload } from './types';
import { collectCards, findColumns, normalizePath, allPostsFromGrid, sortByIndex, parseChunkResponse } from './dom';
import { relayoutGrid } from './layout';
import { appendChunkItems, distributeCards } from './append';
import { distributeByWeight, GAP } from './distribution';
import { initPostCardImages } from './image-init';
import { fetchChunkHtml } from './chunk-repository';

export function createPostListController(grid: HTMLElement): PostListController {
  const searchTagged = new Set<HTMLElement>();
  const searchLoadedChunks = new Set<number>();

  function getConfig(): PostListConfig {
    return {
      chunkBaseUrl: grid.dataset.chunkBaseUrl || '',
      chunkSize: parseInt(grid.dataset.chunkSize || '6', 10),
      currentChunk: parseInt(grid.dataset.currentChunk || '1', 10),
      totalChunks: parseInt(grid.dataset.totalChunks || '1', 10),
      totalPosts: parseInt(grid.dataset.totalPosts || '0', 10),
      posts: allPostsFromGrid(grid),
    };
  }

  const controller: PostListController = {
    appendChunk(payload: ChunkPayload): HTMLElement[] {
      return appendChunkItems(grid, payload.cards, payload.loadMore);
    },

    async showSearchResults(paths: string[]) {
      const { columns, leftCol, rightCol, loadMore } = findColumns(grid);
      if (!columns) return;

      const matchedSet = new Set(paths.map(normalizePath));
      const allCards = collectCards(grid);
      let visibleCount = 0;

      for (const card of allCards) {
        const path = normalizePath(card.dataset.path || '');
        const isMatch = matchedSet.has(path);
        card.style.display = isMatch ? '' : 'none';
        if (isMatch) visibleCount++;
      }

      if (loadMore) loadMore.hidden = true;

      const emptyEl = document.querySelector<HTMLElement>('.posts-section .search-empty');
      if (emptyEl) emptyEl.hidden = visibleCount > 0;

      if (visibleCount === 0) return;
      if (!leftCol || !rightCol) return;
      const visibleCards = allCards.filter(c => c.style.display !== 'none');
      const sorted = sortByIndex(visibleCards);

      const columnsWidth = columns.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(columns).gap) || GAP;
      const colWidth = (columnsWidth - gap) / 2;

      const { left: leftCards, right: rightCards } = distributeByWeight(
        sorted,
        colWidth,
        el => el.classList.contains('post-card--with-image'),
      );

      leftCards.forEach(card => leftCol.appendChild(card));
      rightCards.forEach(card => rightCol.appendChild(card));
    },

    clearSearch() {
      const { columns, loadMore } = findColumns(grid);
      if (!columns) return;

      for (const card of searchTagged) card.remove();
      searchTagged.clear();
      searchLoadedChunks.clear();

      collectCards(grid).forEach(card => { card.style.display = ''; });

      const emptyEl = document.querySelector<HTMLElement>('.posts-section .search-empty');
      if (emptyEl) emptyEl.hidden = true;

      const config = getConfig();
      if (loadMore) {
        loadMore.hidden = config.currentChunk >= config.totalChunks;
      }

      relayoutGrid(columns);
    },

    restoreChunkCount(target: number) {
      const config = getConfig();
      const targetCount = Math.min(target * config.chunkSize, config.totalPosts);

      const { columns, loadMore } = findColumns(grid);
      const allCards = columns ? collectCards(columns) : [];
      while (allCards.length > targetCount) {
        const card = allCards.pop();
        card?.remove();
      }

      if (loadMore) {
        if (target >= config.totalChunks) {
          loadMore.hidden = true;
        } else {
          loadMore.hidden = false;
          (loadMore as HTMLAnchorElement).href = `${config.chunkBaseUrl}/${target + 1}`;
        }
      }

      if (columns) relayoutGrid(columns);
    },

    async fetchSearchChunk(n: number) {
      if (searchLoadedChunks.has(n)) return;
      const chunkBaseUrl = grid.dataset.chunkBaseUrl || '';
      const html = await fetchChunkHtml(chunkBaseUrl, n);
      searchLoadedChunks.add(n);
      const { cards } = parseChunkResponse(html);
      if (cards.length === 0) return;
      const { columns, leftCol, rightCol } = findColumns(grid);
      if (!columns) return;
      distributeCards(columns, leftCol, rightCol, cards);
      cards.forEach(card => searchTagged.add(card));
      initPostCardImages();
    },

    relayout() {
      const { columns } = findColumns(grid);
      if (columns) relayoutGrid(columns);
    },

    destroy() {
      searchTagged.clear();
      searchLoadedChunks.clear();
    },
  };

  return controller;
}
