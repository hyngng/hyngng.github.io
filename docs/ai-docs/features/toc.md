# 목차 (TOC)

## 현재 구조

Astro 정적 렌더링과 클라이언트 ScrollSpy 스크립트를 조합해 포스트 목차를 구현함.

## `src/pages/[author]/[slug].astro`

- `render(post)`에서 `Content`와 `headings`를 함께 받음.
- `headings`를 `PostLayout`에 전달함.
- headings는 `rehypeHeadingIds`가 수집하며, `h1`~`h6`가 아닌 요소(예: 각주 라벨 `<span id="footnote-label">`)는 제외됨. 상세는 `footnotes.md` 참조.

## `src/layouts/PostLayout.astro`

- `headings` 중 h2, h3, h4만 `tocHeadings`로 필터링함.
- `post.data.toc !== false`이고 `tocHeadings.length > 0`일 때만 TOC를 렌더링함.
- `toc: false` frontmatter는 목차를 확실히 숨김.
- TOC 폭과 간격은 `src/styles/global.css`의 `--post-toc-width`, `--space-post-toc-gap` 토큰을 사용함.

## `src/components/TOC.astro`

- h2를 기본 그룹 root로 사용함.
- h2 이전에 h3/h4가 먼저 나오면 첫 heading을 독립 root로 처리해 빈 TOC가 나오지 않게 함.
- TOC 제목은 locale의 `toc.title`을 사용함.
- ScrollSpy는 화면 상단의 활성 기준선을 지난 마지막 heading을 현재 heading으로 선택함. 스크롤 이벤트는 `requestAnimationFrame`으로 묶어 한 프레임에 한 번만 계산함.
- TOC 초기화가 다시 실행될 때 이전 스크롤·resize·hashchange 리스너와 예약된 animation frame은 `AbortController`로 정리함.
- 활성 heading이 속한 그룹만 `.expanded`가 되어 하위 heading을 보여줌.
- TH 클릭 시 `pendingSlug`를 설정하여 목적지 도달 전까지 `render()`를 억제함. `computeActiveSlug()`의 계산 결과가 `pendingSlug`와 같아지는 순간 억제를 해제하고 실제 위치로 동기화함.
- TH는 표준 hash 앵커로 PH를 이동시킴. 수동 `scrollTo()`를 사용하지 않아 클릭, hash 직접 진입, 뒤로가기 모두 같은 브라우저 스크롤 경로를 사용함.
- heading의 `scroll-margin-top`은 `--scroll-target-offset`임. 데스크톱에서는 중앙 본문을 가리는 프레임 두께를 사용하고, 모바일에서는 고정 헤더가 없으므로 0임.

## 이동과 활성 상태의 기준

TH 클릭으로 PH를 이동시키는 책임과 현재 PH를 선택하는 책임은 서로 분리함. 이동은 브라우저의 hash 앵커 기능에 맡기고, PH의 `scroll-margin-top`으로 도착 위치만 지정함. 이 구조는 클릭, 주소창 hash 진입, 새로고침, 브라우저 히스토리가 모두 동일한 이동 경로를 사용하게 함.

활성 TH는 IntersectionObserver가 동시에 보고하는 여러 항목의 콜백 순서로 결정하지 않음. 대신 `scroll-margin-top`의 계산값을 활성 기준선으로 읽고, 그 기준선을 지난 마지막 PH를 선택함. 따라서 PH가 목표 위치에 도착하면 같은 기준선으로 해당 TH가 활성화되어 이동 위치와 강조 상태가 어긋나지 않음.

`--header-height`는 버튼과 레이아웃의 기존 배치 용도이므로 스크롤 오프셋으로 재사용하지 않음. `--scroll-target-offset`을 별도로 둬 데스크톱의 중앙 본문은 프레임 두께만 보정함. 모바일에서는 헤더가 문서 흐름에 포함되어 화면을 가리지 않으므로 오프셋이 0임.

`html`의 `scroll-behavior: smooth`가 hash 이동을 부드럽게 처리하며, `prefers-reduced-motion: reduce`에서는 이를 비활성화함.

## 스크롤 억제 (Suppress)

TOC에서 헤더를 클릭하면 네이티브 smooth scroll이 발생하는데, 이동 경로 상의 중간 헤더를 통과하면서 `.expanded`가 잠깐 토글되었다가 해제되는 깜빡임이 발생함. 이를 방지하기 위해 `pendingSlug` 기반 억제 로직이 있음.

- `pendingSlug`: 클릭된 목적지의 slug. `null`이면 억제 중이 아님.
- 클릭 시 `render(destSlug)`로 즉시 목적지 상태를 렌더링하고, 매 스크롤 프레임마다 `computeActiveSlug()`가 계산한 실제 slug가 `pendingSlug`와 같아지는 순간 억제를 해제함.
- 네이티브 smooth scroll은 항상 목표 지점에 정확히 멈추므로, 애니메이션 종료 시점에 `computeActiveSlug() === pendingSlug`가 보장됨.
- 안전망: `setTimeout` 1초. 스크롤이 거의 없어 `scroll` 이벤트가 충분히 발생하지 않는 경우(이미 목적지 근처) 대비.

## 상하단 fade

긴 TOC가 viewport 위/아래로 잘릴 때 어색하지 않도록 `BaseLayout`의 `.content-side-fade`(하단)와 `.content-side-fade-top`(상단)이 좌우 콘텐츠 영역을 마스킹함. 중앙 본문 영역(`--content-width` = 768px)은 mask-image로 투명하게 제외하므로, TOC의 위치·길이·sticky 전환과 관계없이 fade 경계가 항상 화면 상단/하단과 일치함.

두 요소 모두 `background: var(--color-bg)`로 채워져 있고, `mask-image`로 중앙 콘텐츠 영역(768px)을 투명하게 제외하여 본문에는 영향을 주지 않음:

- 하단(`.content-side-fade`): `mask-image`에 `linear-gradient(to bottom, transparent, #000)` 포함 — 위쪽으로 점점 불투명
- 상단(`.content-side-fade-top`): `mask-image`에 `linear-gradient(to top, transparent, #000)` 포함 — 아래쪽으로 점점 불투명
- 좌우(`to right` 그라디언트): `--content-side-mask-boundary` 기준으로 중앙 768px만 마스크에서 제외

1281px 이상에서만 visible.

관련 토큰 (현재 `global.css` 변수 참조):

- `--post-toc-width`: TOC 폭 (`224px`).
- `--space-post-toc-gap`: 포스트 본문과의 간격.
- `--toc-title-list-gap`: 제목과 목록 사이 간격.
- `--toc-item-gap`: 항목 간격.
- `--header-height`: 고정 헤더 높이 (`--button-size` = `56px`).
- `--scroll-target-offset`: hash 이동과 ScrollSpy 활성 기준선에 공유하는 PH 상단 오프셋. 데스크톱은 `--frame-thickness`(모바일은 0).

## i18n

TOC 제목은 `src/locales/`에서 관리함. 서버 렌더링 시 `{title}`(locale 값)으로 주입되며, `data-i18n` 속성도 부착되어 있으나 TOC의 클라이언트 스크립트는 이 속성을 읽지 않음.

빈 TOC는 아예 렌더링하지 않음 (`tocHeadings.length > 0` 조건).

### TOC 항목 스타일

- `.toc-link`의 `font-size`: `14px`
- `.toc-link`에 `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;` 적용 — 긴 헤더는 말줄임표(`...`)로 축약
- 각 `<a>` 태그에 `title` 속성으로 전체 헤더 텍스트를 툴팁으로 제공

## 검증

`npm run build` 통과 확인함.
