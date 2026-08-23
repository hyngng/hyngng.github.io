# 아카이브: 모바일 LoadMoreCard 스크롤 근접 기반 Author 프리뷰 (대체됨)

> **상태: 대체됨 (2026-08)** — 현재 구현은 "문서 최하단 도달 시 `.is-active` 토글" 방식이다 (`chunk-loading.md` 및 `roadmap.md` 해당 항목 참조). 이 문서는 사라진 연출의 요구사항·설계·운영 사건·코드를 보존한다.

## 요구사항과 의도

- PC에서는 `.load-more-card`에 마우스를 올리면 "더 보기" 텍스트가 위로 슬라이드아웃되고 `<Author>` 정보가 올라온다. 모바일에는 호버가 없어 이 서사가 재현 불가했다.
- touchstart 유예(≈220ms), 아바타 배지 상시 노출 등 대안 검토 후 기각하고, **"문서 하단까지 남은 px 거리"를 트리거로 쓰는 방식**(다가감→전환)을 채택했다.
- 전환 구간: 잔여 거리 `--load-more-reveal-start`(125px) 이하에서 시작, `--load-more-reveal-end`(25px)에서 완료. 절대 px인 이유는 페이지 길이와 무관한 일정 물리 거리, 그리고 최하단 도달 전 완료로 완성 상태를 볼 시간 확보.

## 설계 (진행 상태 변수 방식)

- JS(`src/features/post-list/load-more-preview.ts`)가 scroll/resize(rAF 스로틀)+`ResizeObserver(document.body)`마다 `--lm-progress`(0~1)를 산술해 인라인 설정. CSS는 `calc(var(--lm-progress))`로 transform/color/filter를 직결 구동(keyframe 없음).
- 토큰: `src/styles/global.css`의 `--load-more-reveal-start: 125px` / `--load-more-reveal-end: 25px`.
- 활성 게이트는 처음 `(hover: none)`이었다가 `@media (max-width: 960px)`(=`MOBILE_QUERY`)로 변경(아래 사건 1).

## 운영 기록 (사건 3건)

1. **실기기 미동작 → 게이트 변경**: 실기기가 `hover: hover`로 평가하면 `(hover: none)` 블록이 아예 적용되지 않음(JS는 progress를 1까지 계산했으므로 CSS 게이트가 원인). `max-width: 960px`로 통일해 해결. 교훈: 입력 장치 리포팅은 들쭉날쭉 — 레이아웃 기준(폭)으로 통일.
2. **grayscale 커튼 리프트 시도 → 제거**: 이미지에 `grayscale 1→0` 추가 연출을 시도했으나 (a) 같은 위치라 캐스케이드에서 무효였고(사건 3), (b) 사용자 결정으로 PC와의 일관성 우선하여 제거.
3. **캐스케이드 순서 버그**: 정적 기본값 `filter: brightness(0.9) opacity(0.9)`가 동일 특이도 변수 구동 규칙보다 소스상 뒤에 선언되어 항상 승리 — 모바일 이미지 효과(및 grayscale)가 처음부터 렌더링 무효였음. 스타일 섹션을 기본 → PC 호버 → 모바일 → reduced-motion 순으로 재배치해 구조적으로 해결. 교훈: 동일 특이도 규칙의 순서 의존은 주석이 아니라 파일 구조로 보장.

## 코드 스냅샷 (삭제 시점 기준)

### `src/features/post-list/load-more-preview.ts` (전체)

```typescript
const PROGRESS_VAR = '--lm-progress';
const FALLBACK_START_PX = 125;
const FALLBACK_END_PX = 25;

export function initLoadMorePreview(grid: HTMLElement, signal: AbortSignal): void {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const rootStyle = getComputedStyle(document.documentElement);
  const startDistance = parseFloat(rootStyle.getPropertyValue('--load-more-reveal-start')) || FALLBACK_START_PX;
  const endDistance = parseFloat(rootStyle.getPropertyValue('--load-more-reveal-end')) || FALLBACK_END_PX;
  const span = Math.max(1, startDistance - endDistance);

  let card: HTMLElement | null = null;
  let rafId = 0;

  function resolveCard() {
    card = grid.querySelector<HTMLElement>('.load-more-card:not([hidden])');
  }

  function update() {
    rafId = 0;
    if (!card || !card.isConnected) resolveCard();
    if (!card || reducedMotion.matches) return;

    const el = document.scrollingElement;
    if (!el) return;
    // Reads precede writes; the custom property only feeds transform/filter/color,
    // so scrollHeight stays clean and no forced reflow happens per frame.
    const remaining = el.scrollHeight - el.clientHeight - el.scrollTop;
    const progress = Math.min(1, Math.max(0, (startDistance - remaining) / span));
    card.style.setProperty(PROGRESS_VAR, progress.toFixed(4));
  }

  function scheduleUpdate() {
    if (!rafId) rafId = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true, signal });
  window.addEventListener('resize', scheduleUpdate, { signal });

  // Chunk loads and image reveals change the document height.
  const observer = new ResizeObserver(scheduleUpdate);
  observer.observe(document.body);

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && card) card.style.removeProperty(PROGRESS_VAR);
    // Resync in both directions: turning reduce off must recompute immediately,
    // not wait for the next scroll event.
    scheduleUpdate();
  }, { signal });

  signal.addEventListener('abort', () => {
    observer.disconnect();
    if (rafId) cancelAnimationFrame(rafId);
  }, { once: true });

  scheduleUpdate();
}
```

### `src/components/LoadMoreCard.astro` 모바일 블록

```css
/* ── Mobile layout: scroll-proximity driven preview (--lm-progress: 0..1) ──
   Gated by max-width (the MOBILE_QUERY breakpoint), not (hover: none): some
   devices/webviews report hover:hover and would never match. Placed after
   every base rule — at equal specificity, source order decides. */

@media (max-width: 960px) {
  .load-more-title,
  .load-more-default,
  .load-more-hover,
  .load-more-card .load-more-hover span,
  .load-more-card .load-more-hover p,
  .load-more-card .post-card-image {
    transition: none;
  }

  .load-more-card .load-more-default {
    transform: translateY(calc(var(--lm-progress, 0) * -100%));
  }

  .load-more-card .load-more-hover {
    transform: translateY(calc((1 - var(--lm-progress, 0)) * 100%));
  }

  .load-more-card .load-more-title {
    color: color-mix(in srgb, var(--color-muted), var(--color-heading) calc(var(--lm-progress, 0) * 100%));
  }

  /* PC hover parity: dimmed rest state restored as the card completes. */
  .load-more-card .post-card-image {
    filter: brightness(calc(0.9 + 0.1 * var(--lm-progress, 0)))
      opacity(calc(0.9 + 0.1 * var(--lm-progress, 0)));
  }

  .load-more-card .load-more-hover span {
    color: color-mix(in srgb, var(--color-muted), var(--color-text) calc(var(--lm-progress, 0) * 100%));
  }

  .load-more-card .load-more-hover p {
    color: color-mix(in srgb, var(--color-muted), var(--color-heading) calc(var(--lm-progress, 0) * 100%));
  }
}
```

### `src/styles/global.css` 토큰

```css
--load-more-reveal-start: 125px;
--load-more-reveal-end: 25px;
```

## 교훈 (후속 설계에 반영)

- 연속 스크럽은 시각적 이득 대비 JS/CSS 복잡도와 캐스케이드 노출 면이 컸다 → 이산 상태 토글로 단순화.
- 상태 진입점을 하나로 모으지 않고 PC/모바일 블록을 분리하면 중복과 순서 함정이 생긴다 → 선택자 병렬 나열로 단일 정의.
