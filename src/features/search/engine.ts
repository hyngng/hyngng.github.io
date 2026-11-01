import { normalizePath } from '../post-list/dom';

export interface SearchContext {
  lang: string;
  personaId?: string;
}

export interface SearchEngine {
  readonly mode: 'pagefind' | 'dom';
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
  init: (language?: string) => Promise<void>;
};

const PAGEFIND_URL = '/pagefind/pagefind.js';
const PAGEFIND_LOAD_TIMEOUT_MS = 2500;
const PAGEFIND_SEARCH_TIMEOUT_MS = 2500;

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Pagefind timeout')), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

class PagefindEngine implements SearchEngine {
  private degraded = false;
  private pagefind: PagefindModule | null = null;
  private loadPromise: Promise<boolean> | null = null;
  private initializedLang: string | null = null;

  constructor(private readonly fallback: DomFallbackEngine) {}

  get mode(): SearchEngine['mode'] {
    return this.degraded ? 'dom' : 'pagefind';
  }

  load(): Promise<boolean> {
    if (this.pagefind) return Promise.resolve(true);
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = (async () => {
      try {
        const mod = await withTimeout(
          import(/* @vite-ignore */ PAGEFIND_URL),
          PAGEFIND_LOAD_TIMEOUT_MS
        );
        this.pagefind = mod as PagefindModule;
        return true;
      } catch {
        return false;
      }
    })();

    return this.loadPromise;
  }

  async search(query: string, ctx: SearchContext): Promise<string[]> {
    if (!this.pagefind || this.degraded) return this.fallback.search(query);
    const pagefind = this.pagefind;

    try {
      if (this.initializedLang !== ctx.lang) {
        // Pagefind index keys are lowercase, but filter values keep the page lang.
        await withTimeout(
          pagefind.init(ctx.lang.toLowerCase()),
          PAGEFIND_LOAD_TIMEOUT_MS
        );
        this.initializedLang = ctx.lang;
      }

      const result = await withTimeout(
        pagefind.search(query, {
          filters: {
            lang: ctx.lang,
            ...(ctx.personaId ? { persona: ctx.personaId } : {}),
          },
        }),
        PAGEFIND_SEARCH_TIMEOUT_MS
      );

      const resultsData = await withTimeout(
        Promise.all(result.results.map(r => r.data().catch(() => null))),
        PAGEFIND_SEARCH_TIMEOUT_MS
      );

      return resultsData
        .filter((d): d is { url: string } => !!d?.url)
        .map(d => normalizePath(d.url));
    } catch {
      this.degraded = true;
      return this.fallback.search(query);
    }
  }
}

// DOM fallback: 제목/설명만 필터. 페르소나 페이지의 data-all-posts는 이미 해당 페르소나 범위다.
class DomFallbackEngine implements SearchEngine {
  readonly mode = 'dom' as const;
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

  const fallbackEngine = new DomFallbackEngine(allPosts);
  const pagefindEngine = new PagefindEngine(fallbackEngine);
  resolvingEngine = pagefindEngine.load().then((loaded) => {
    resolvedEngine = loaded ? pagefindEngine : fallbackEngine;
    resolvingEngine = null;
    return resolvedEngine;
  });

  return resolvingEngine;
}
