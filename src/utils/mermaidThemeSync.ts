import type { Mermaid } from 'mermaid';

let mermaidInstance: Mermaid | null = null;
let mermaidAbortController: AbortController | undefined;
let renderRevision = 0;

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

async function renderMermaid(theme: 'dark' | 'default', revision: number): Promise<void> {
  ensureMermaidContainers();

  const roots = document.querySelectorAll<HTMLElement>('.mermaid:not([data-processed])');
  if (roots.length === 0) return;

  // Import the ~1MB mermaid module only when a diagram actually needs rendering.
  if ('fonts' in document) {
    await document.fonts.ready;
  }

  const mermaid = await loadMermaid();
  if (revision !== renderRevision) return;

  mermaid.initialize({ startOnLoad: false, theme });

  try {
    await mermaid.run({ nodes: Array.from(roots) });
  } catch (error) {
    console.error('Failed to render mermaid diagrams:', error);
  }
}

async function refreshMermaid(revision: number): Promise<void> {
  const all = document.querySelectorAll<HTMLElement>('.mermaid[data-mermaid-source]');
  for (const el of all) {
    el.removeAttribute('data-processed');
    el.textContent = el.getAttribute('data-mermaid-source') || '';
  }
  await renderMermaid(currentTheme(), revision);
}

export function initMermaidThemeSync(): void {
  mermaidAbortController?.abort();
  mermaidAbortController = new AbortController();
  const { signal } = mermaidAbortController;

  const handler = async (): Promise<void> => {
    const revision = ++renderRevision;
    await refreshMermaid(revision);
  };

  window.addEventListener('themeChange', handler, { signal });
  window.addEventListener('astro:page-load', handler, { signal });

  if (document.readyState !== 'loading') {
    handler();
  }
}
