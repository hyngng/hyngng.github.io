import { normalizePath } from '../post-list/dom';

export interface SearchContext {
  lang: string;
  authorId?: string;
}

export interface SearchEngine {
  search(query: string, ctx: SearchContext): Promise<string[]>;
}

interface PostMeta {
  path: string;
  title: string;
  description?: string;
}

type PagefindModule = {
  search: (
    query: string,
    options?: { filters?: Record<string, string | string[]> }
  ) => Promise<{ results: Array<{ data: () => Promise<{ url: string }> }> }>;
  init: () => Promise<void>;
};

const PAGEFIND_URL = '/pagefind/pagefind.js';
const PAGEFIND_LOAD_TIMEOUT_MS = 2500;

class PagefindEngine implements SearchEngine {
  private pagefind: PagefindModule | null = null;
  private loadPromise: Promise<boolean> | null = null;

  load(): Promise<boolean> {
    if (this.pagefind) return Promise.resolve(true);
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = (async () => {
      try {
        const timeout = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Pagefind load timeout')), PAGEFIND_LOAD_TIMEOUT_MS)
        );
        const mod = await Promise.race([
          import(/* @vite-ignore */ PAGEFIND_URL),
          timeout,
        ]);
        await mod.init();
        this.pagefind = mod as PagefindModule;
        return true;
      } catch {
        return false;
      }
    })();

    return this.loadPromise;
  }

  async search(query: string, ctx: SearchContext): Promise<string[]> {
    if (!this.pagefind) return [];

    const result = await this.pagefind.search(query, {
      filters: {
        lang: ctx.lang,
        ...(ctx.authorId ? { author: ctx.authorId } : {}),
      },
    });

    const resultsData = await Promise.all(
      result.results.map(r => r.data().catch(() => null))
    );

    return resultsData
      .filter((d): d is { url: string } => !!d?.url)
      .map(d => normalizePath(d.url));
  }
}

// DOM fallback: 제목/설명만 필터. 작가 페이지의 data-all-posts는 이미 작가 스코프.
class DomFallbackEngine implements SearchEngine {
  constructor(private readonly allPosts: PostMeta[]) {}

  search(query: string): Promise<string[]> {
    const q = query.toLowerCase();
    return Promise.resolve(
      this.allPosts
        .filter(p =>
          p.title.toLowerCase().includes(q) ||
          (!!p.description && p.description.toLowerCase().includes(q))
        )
        .map(p => normalizePath(p.path))
    );
  }
}

// 세션당 1회 엔진 확정: pagefind 로드 성공 시 pagefind, 실패 시 DOM 폴백.
let resolvedEngine: SearchEngine | null = null;
let resolvingEngine: Promise<SearchEngine> | null = null;

export function getSearchEngine(allPosts: PostMeta[]): Promise<SearchEngine> {
  if (resolvedEngine) return Promise.resolve(resolvedEngine);
  if (resolvingEngine) return resolvingEngine;

  const pagefindEngine = new PagefindEngine();
  resolvingEngine = pagefindEngine.load().then((loaded) => {
    resolvedEngine = loaded ? pagefindEngine : new DomFallbackEngine(allPosts);
    resolvingEngine = null;
    return resolvedEngine;
  });

  return resolvingEngine;
}
