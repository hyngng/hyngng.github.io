import { type PostListController } from './types';
import { parseChunkResponse } from './dom';
import { animateNewCards } from './animate';
import { initPostCardImages } from './image-init';
import { fetchChunkHtml } from './chunk-repository';

export function createChunkLoader(
  grid: HTMLElement,
  controller: PostListController,
  signal?: AbortSignal,
): () => void {
  const chunkBaseUrl = grid.dataset.chunkBaseUrl || '';
  const totalChunks = parseInt(grid.dataset.totalChunks || '1', 10);
  let currentChunk = parseInt(grid.dataset.currentChunk || '1', 10);
  let isLoading = false;

  let prefetchTimer: ReturnType<typeof setTimeout>;

  function clearPrefetch() {
    clearTimeout(prefetchTimer);
  }

  async function loadChunk(n: number) {
    if (isLoading || n > totalChunks) return;
    isLoading = true;
    try {
      const html = await fetchChunkHtml(chunkBaseUrl, n);
      const { cards, loadMore: newLoadMore } = parseChunkResponse(html);
      if (cards.length === 0) return;

      const animatedCards = controller.appendChunk({ cards, loadMore: newLoadMore });

      currentChunk = n;
      grid.dataset.currentChunk = String(currentChunk);
      history.pushState({ chunk: currentChunk }, '', `?p=${currentChunk}`);

      animateNewCards(animatedCards);
      initPostCardImages();

      if (currentChunk >= totalChunks) {
        const loadMore = grid.querySelector('.load-more-card') as HTMLElement | null;
        if (loadMore) loadMore.hidden = true;
      }
    } catch (err) {
      console.error('[chunk-load]', err);
    } finally {
      isLoading = false;
    }
  }

  function handlePopState(e: PopStateEvent) {
    const state = e.state as { chunk?: number } | null;
    if (state?.chunk) {
      const target = state.chunk;
      controller.restoreChunkCount(target);
      currentChunk = target;
      grid.dataset.currentChunk = String(currentChunk);

      const activeInput = document.querySelector<HTMLInputElement>('.search-input');
      if (activeInput?.value) {
        activeInput.dispatchEvent(new Event('input'));
      }
    }
  }

  function handleScroll() {
    clearPrefetch();
    prefetchTimer = setTimeout(() => {
      if (isLoading || currentChunk >= totalChunks) return;
      const el = document.scrollingElement;
      if (!el) return;
      const scrolled = el.scrollTop / (el.scrollHeight - el.clientHeight);
      if (scrolled > 0.8) {
        fetchChunkHtml(chunkBaseUrl, currentChunk + 1).catch(() => {});
      }
    }, 200);
  }

  function loadInitial(target: number) {
    if (target > 1 && target <= totalChunks) {
      (async () => {
        for (let i = 2; i <= target; i++) {
          await loadChunk(i);
        }
      })();
    }
  }

  const opts = signal ? { signal } : undefined;

  grid.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('.load-more-card');
    if (!target) return;
    e.preventDefault();
    loadChunk(currentChunk + 1);
  }, opts);

  if (signal) {
    signal.addEventListener('abort', clearPrefetch);
  }

  window.addEventListener('scroll', handleScroll, opts);

  window.addEventListener('popstate', handlePopState as EventListener, opts);

  document.addEventListener('dragend', (e) => {
    if (e.target instanceof HTMLElement) e.target.blur();
  }, opts);

  const params = new URLSearchParams(location.search);
  const targetChunk = parseInt(params.get('p') || '1', 10);
  if (targetChunk > 1) {
    loadInitial(targetChunk);
  }

  return function cleanup() {
    clearPrefetch();
  };
}
