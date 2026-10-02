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

  let popstateSeq = 0;

  async function loadChunk(n: number, pushHistory: boolean = true, seq?: number) {
    if (isLoading || n > totalChunks) return;
    if (seq !== undefined && seq !== popstateSeq) return;
    isLoading = true;
    try {
      const html = await fetchChunkHtml(chunkBaseUrl, n);
      if (seq !== undefined && seq !== popstateSeq) return;
      const { cards, loadMore: newLoadMore } = parseChunkResponse(html);
      if (cards.length === 0) return;
      if (seq !== undefined && seq !== popstateSeq) return;

      const animatedCards = controller.appendChunk({ cards, loadMore: newLoadMore });

      currentChunk = n;
      grid.dataset.currentChunk = String(currentChunk);
      if (pushHistory) {
        history.pushState({ chunk: currentChunk }, '', `?p=${currentChunk}`);
      }

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
    const seq = ++popstateSeq;
    const state = e.state as { chunk?: number } | null;
    const target = state?.chunk ?? parseInt(new URLSearchParams(location.search).get('p') || '1', 10);

    if (target <= currentChunk) {
      controller.restoreChunkCount(target);
      currentChunk = target;
      grid.dataset.currentChunk = String(currentChunk);
    } else {
      (async () => {
        for (let i = currentChunk + 1; i <= target; i++) {
          if (seq !== popstateSeq) break;
          await loadChunk(i, false, seq);
        }
      })();
    }

    const activeInput = document.querySelector<HTMLInputElement>('.search-input');
    if (activeInput?.value) {
      activeInput.dispatchEvent(new Event('input'));
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
          await loadChunk(i, false);
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
  if (!history.state || typeof (history.state as { chunk?: unknown }).chunk !== 'number') {
    history.replaceState({ chunk: targetChunk }, '', location.href);
  }
  if (targetChunk > 1) {
    loadInitial(targetChunk);
  }

  return function cleanup() {
    clearPrefetch();
  };
}
