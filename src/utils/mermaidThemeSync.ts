/**
 * Mermaid 다이어그램 테마 동기화 모듈
 *
 * - `pre[data-language="mermaid"]`를 `div.mermaid`로 변환하고
 *   원본 소스를 `data-mermaid-source` 속성에 저장합니다.
 * - 테마 변경(다크/라이트) 시 모든 다이어그램을 원본으로 복원한 뒤 새 테마로 재렌더링합니다.
 * - `renderRevision` 카운터로 동시에 발생한 여러 렌더 요청 중 최신만 반영합니다.
 */

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

/**
 * `pre[data-language="mermaid"]` → `div.mermaid` 변환.
 * 원본 소스는 `data-mermaid-source`에 저장하여 테마 전환 시 복원에 사용합니다.
 */
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

/**
 * 렌더링할 `.mermaid` 요소를 찾아 mermaid.run()으로 렌더링합니다.
 * `nodes` 파라미터를 사용하여 DOM 재쿼리 레이스를 방지합니다.
 */
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

/**
 * 모든 다이어그램을 원본 소스로 복원한 뒤 현재 테마로 재렌더링합니다.
 */
async function refreshMermaid(revision: number): Promise<void> {
  const all = document.querySelectorAll<HTMLElement>('.mermaid[data-mermaid-source]');
  for (const el of all) {
    el.removeAttribute('data-processed');
    el.textContent = el.getAttribute('data-mermaid-source') || '';
  }
  await renderMermaid(currentTheme(), revision);
}

/**
 * 초기화: `themeChange` / `astro:page-load` 이벤트에 반응하여 다이어그램을 재렌더링합니다.
 */
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
