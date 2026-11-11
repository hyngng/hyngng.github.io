import type { Mermaid } from 'mermaid';

let mermaidInstance: Mermaid | null = null;
let mermaidAbortController: AbortController | undefined;
let renderRevision = 0;
let observer: IntersectionObserver | null = null;
const pendingRoots = new Set<HTMLElement>();
let flushScheduled = false;

async function loadMermaid(): Promise<Mermaid> {
  if (!mermaidInstance) {
    const mod = await import('mermaid');
    mermaidInstance = mod.default;
  }
  return mermaidInstance;
}

function currentTheme(): 'dark' | 'default' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'default';
}

function ensureMermaidContainers(): void {
  const unprocessed = document.querySelectorAll<HTMLPreElement>(
    'pre[data-language="mermaid"]:not([data-mermaid-processed])',
  );

  unprocessed.forEach((pre) => {
    pre.setAttribute('data-mermaid-processed', '1');
    const source = pre.textContent || '';
    const wrapper = document.createElement('div');
    wrapper.className = 'mermaid';
    wrapper.textContent = source;
    wrapper.setAttribute('data-mermaid-source', source);
    pre.replaceWith(wrapper);
  });
}

function scheduleFlush(): void {
  if (flushScheduled) return;
  flushScheduled = true;
  window.requestAnimationFrame(() => {
    flushScheduled = false;
    void flushPending();
  });
}

function observeMermaidRoots(): void {
  ensureMermaidContainers();

  const roots = Array.from(
    document.querySelectorAll<HTMLElement>('.mermaid:not([data-processed])'),
  );
  if (roots.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    roots.forEach((root) => pendingRoots.add(root));
    scheduleFlush();
    return;
  }

  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer?.unobserve(entry.target);
        pendingRoots.add(entry.target as HTMLElement);
      }
      scheduleFlush();
    },
    { rootMargin: '200px 0px' },
  );

  roots.forEach((root) => observer?.observe(root));
}

async function renderRoots(
  roots: HTMLElement[],
  theme: 'dark' | 'default',
  revision: number,
): Promise<void> {
  if (roots.length === 0) return;

  const mermaidPromise = loadMermaid();
  if ('fonts' in document) {
    await document.fonts.ready;
  }

  const mermaid = await mermaidPromise;
  if (revision !== renderRevision) {
    roots.forEach((root) => pendingRoots.add(root));
    scheduleFlush();
    return;
  }

  mermaid.initialize({ startOnLoad: false, theme });

  try {
    await mermaid.run({ nodes: roots });
    roots.forEach((root) => root.setAttribute('data-processed', '1'));
  } catch (error) {
    console.error('Failed to render mermaid diagrams:', error);
  }
}

async function flushPending(): Promise<void> {
  if (pendingRoots.size === 0) return;
  const roots = Array.from(pendingRoots);
  pendingRoots.clear();
  await renderRoots(roots, currentTheme(), renderRevision);
}

async function refreshMermaid(revision: number): Promise<void> {
  const rendered = Array.from(
    document.querySelectorAll<HTMLElement>('.mermaid[data-processed]'),
  );
  for (const el of rendered) {
    el.removeAttribute('data-processed');
    el.textContent = el.getAttribute('data-mermaid-source') || '';
  }
  await renderRoots(rendered, currentTheme(), revision);
}

export function initMermaidThemeSync(): void {
  mermaidAbortController?.abort();
  mermaidAbortController = new AbortController();
  const { signal } = mermaidAbortController;

  observer?.disconnect();
  observer = null;
  pendingRoots.clear();

  const onThemeChange = (): void => {
    const revision = ++renderRevision;
    void refreshMermaid(revision);
  };

  const onPageLoad = (): void => {
    renderRevision++;
    observeMermaidRoots();
  };

  window.addEventListener('themeChange', onThemeChange, { signal });

  if (document.readyState !== 'loading') {
    onPageLoad();
  } else {
    document.addEventListener('DOMContentLoaded', onPageLoad, {
      signal,
      once: true,
    });
  }
}
