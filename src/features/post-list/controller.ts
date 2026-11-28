import { type PostListController, type PostListConfig, type ChunkPayload } from './types';
import { collectCards, findColumns, normalizePath, allPostsFromGrid, parseChunkResponse } from './dom';
import { appendChunkItems } from './append';
import { updateSpans } from './masonry';
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
      const { columns, loadMore } = findColumns(grid);
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

      // Hidden cards carry no spans; newly visible ones need measuring.
      if (visibleCount > 0) updateSpans(columns);
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

      updateSpans(columns);
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

      if (columns) updateSpans(columns);
    },

    async fetchSearchChunk(n: number) {
      if (searchLoadedChunks.has(n)) return;
      const chunkBaseUrl = grid.dataset.chunkBaseUrl || '';
      const html = await fetchChunkHtml(chunkBaseUrl, n);
      searchLoadedChunks.add(n);
      const { cards } = parseChunkResponse(html);
      if (cards.length === 0) return;
      const { columns } = findColumns(grid);
      if (!columns) return;
      const fragment = document.createDocumentFragment();
      for (const card of cards) fragment.appendChild(card);
      columns.appendChild(fragment);
      // Spans are assigned while the cards are still visible; they are then
      // hidden in the same task, so no intermediate paint happens.
      updateSpans(columns);
      // 검색용 카드는 숨김 상태로만 추가한다. 최종 showSearchResults의
      // 단일 커밋에서 매칭 카드만 표시되어, 비매칭 카드가 잠깐 노출되지 않는다.
      cards.forEach(card => {
        card.style.display = 'none';
        searchTagged.add(card);
      });
      initPostCardImages();
    },

    relayout() {
      const { columns } = findColumns(grid);
      if (columns) updateSpans(columns);
    },

    destroy() {
      searchTagged.clear();
      searchLoadedChunks.clear();
    },
  };

  return controller;
}
