# Frame Layout Strategy

## 목표
- 화면 전체에 고정된 프레임(Fixed Frame) 테두리(12px 두께)를 제공
- 내부 콘텐츠 영역은 프레임 안쪽에서 스크롤됨
- 헤더(상단 프레임)의 높이는 56px

## 핵심 원리
`position: fixed` 레이어와 루트 스크롤의 분리.

1. `html`은 `min-height: 100%; overflow-y: scroll; overflow-x: hidden`으로 브라우저 루트 스크롤바를 사용합니다. `background-color: var(--color-bg)`를 명시하여, CSS 명세상 `body` 배경이 canvas(scrollbar gutter 포함)로 전파되는 것을 차단합니다.
2. `body`의 `background-color: var(--color-frame)`은 layout viewport 내부에만 적용됩니다. 프레임 테두리는 사각형(`border-radius` 없음)이며, concave corner는 `Frame.astro`의 pseudo-element가 radial-gradient로 구현합니다.
3. `.viewport-container`는 `position: relative; min-height: 100dvh; isolation: isolate`로 일반 흐름에서 콘텐츠 래퍼 역할을 하며, 자체 stacking context를 형성합니다.
4. `.viewport-container::before` pseudo-element가 `position: fixed; inset: var(--frame-thickness); z-index: 0`으로 viewport 전체를 덮는 밝은 배경 패널을 그립니다. 네 면 모두 동일한 여백으로 대칭적입니다. `background-color: var(--color-bg)`를 가집니다.
5. `.page-content`는 `position: relative; z-index: 1`로 콘텐츠 레이어 역할만 합니다. 배경색은 투명이며, `min-height: calc(100dvh - var(--frame-thickness) * 2)`로 프레임 내부를 채웁니다.
6. `.frame-border` 요소가 `position: fixed; inset: 0; z-index: 2`로 프레임 바깥 영역을 검은색으로 덮는 foreground 마스크 역할을 합니다. 네이티브 `border`를 사용하지 않고 4개의 `.frame-edge`(`.frame-edge-top`, `.frame-edge-bottom`, `.frame-edge-left`, `.frame-edge-right`) 절대 위치 자식 요소에 `background-color: var(--color-frame)`를 적용하여 사각형 테두리를 그립니다. 이는 삼성 브라우저/Chromium 계열의 Force Dark 페인트 경로에서 `border` 전용 명도/대비 보정 알고리즘으로 인해 테두리가 회색으로 변색되는 현상을 방지하고, 상단 헤더 블록(`.action-block`)과 동일한 background 페인트 경로로 통일하기 위함입니다. `pointer-events: none`으로 클릭 및 스크롤을 방해하지 않습니다. `::before`/`::after` pseudo-element가 하단 좌우 모서리에 concave corner를 만듭니다 — `bottom: var(--frame-thickness); left: var(--frame-thickness)`(or `right: var(--frame-thickness)`)로 테두리 안쪽 모서리에 배치하고, `radial-gradient(circle at 반대쪽 상단, transparent → var(--color-frame))`로 검은 프레임이 콘텐츠 영역 안쪽으로 부드럽게 곡면 연결되도록 합니다.
7. `Frame.astro`의 `.fixed-actions`는 `z-index: 100`으로 모든 레이어 위에 버튼과 상단 concave를 렌더링합니다. concave corner는 `.left-action`과 `.right-actions`의 `::before`/`::after` pseudo-element로 구현되어, DOM 추가 없이 radial-gradient로 부드러운 전환을 만듭니다.
8. 네이티브 스크롤바는 `html`의 루트 스크롤바로 렌더링됩니다. canvas 배경(`--color-bg`)이 스크롤바 gutter 뒤에 비쳐, 테마와 일관된 색상을 보여줍니다.

### 레이어 순서 (z-index)

```
0   ::before — 밝은 패널 배경
1   .page-content — 스크롤 콘텐츠
2   .frame-border — 프레임 바깥 검은 마스크 (4개 .frame-edge + concave pseudo-element, pointer-events: none)
100 .fixed-actions — 버튼 + concave (pseudo-element)
```

### 주요 CSS 변수

| 변수 | 값 | 설명 |
|---|---|---|
| `--frame-thickness` | `12px` | 프레임 테두리 두께 |
| `--button-size` | `56px` (모바일: `48px`) | 헤더 내 버튼 크기 (헤더 높이이기도 함). 전역 0.8배 스케일 다운에서 모바일 버튼은 접근성 최소 터치 타겟을 보존하기 위해 48px 유지 |
| `--font-size-action` | `22px` (모바일: `20px`) | 버튼 내 아이콘/텍스트 폰트 크기. 버튼 축소 비율에 맞춰 함께 축소됨 |
| `--frame-radius` | `calc(var(--button-size) / 2)` = `28px` | 콘텐츠 영역의 오목한 곡선 반경 |
| `--header-height` | `var(--button-size)` = `56px` (모바일: `48px`) | 상단 헤더 높이 |
| `--content-width` | `768px` | 콘텐츠 영역 최대 폭 |

## Side Content Fade

데스크톱에서 중앙 콘텐츠 폭 바깥의 좌우 영역은 `BaseLayout.astro`의 `.content-side-fade`(하단)와 `.content-side-fade-top`(상단)이 배경색으로 fade됨. 중앙 본문은 mask에서 제외되어 영향을 받지 않으며, TOC처럼 본문 외곽에 배치되는 콘텐츠는 위치나 길이와 무관하게 동일한 경계에서 자연스럽게 사라짐. 상하단 모두 `mask-image`로 중앙 콘텐츠 영역(768px)을 투명 처리하여 본문에는 영향 없음.

프레임 배경(`::before`, z-index: 0)과 foreground 마스크(`.frame-border`, z-index: 2)는 모두 `position: fixed`로 콘텐츠 뒤와 위에 위치합니다. side fade 요소(z-index: 1)는 그 사이에 위치하므로 시각적으로 마스크에 가려지지만, `mask-image`로 투명 처리된 중앙 콘텐츠 영역에는 영향을 받지 않습니다.

## 반응형 처리
- `@media (max-width: 960px)`에서 `--frame-thickness: 0px`, `--frame-radius: 0px`으로 오버라이드하여 프레임을 제거합니다.
- 모바일에서는 `::before`와 `.frame-border` 모두 `inset: 0`이 되어, 패널이 전체 화면을 덮고 마스크가 비활성화됩니다.
- 모바일에서는 `--button-size: 48px`, `--font-size-action: 20px`을 유지합니다. 전역 0.8배 스케일 다운에서 모바일 버튼은 접근성 최소 터치 타겟을 보존하기 위해 제외됩니다. 48px은 Material Design의 최소 터치 타겟 권장 크기(48×48dp)를 충족하며, Apple HIG(44×44pt)도 여유 있게 상회합니다.
- 버튼 크기가 줄어들면 파생 변수(`--header-height`, `--frame-radius`)도 자동으로 따라 줄어듭니다.
- 모바일 네이티브 스크롤바는 OS 설정에 따름.
- 모바일에서 `.fixed-actions`는 `position: relative`로 오버라이드되어 문서 흐름에 포함되며, 페이지 최상단에 놓인 일반 헤더처럼 동작합니다. `height: var(--header-height)`로 흐름에서 48px을 차지하고, `.left-action`/`.right-actions`(`position: absolute`)의 containing block 역할을 유지합니다. 데스크톱은 `position: fixed`를 유지합니다.

## 모바일 Frame 일반 요소화 (in-flow)

### 동작
모바일(`max-width: 960px`)에서 `.fixed-actions`는 `position: relative`로 오버라이드되어 화면 상단 고정을 해제하고 **일반 문서 흐름**에 포함됩니다. 페이지 최상단에 놓인 일반 헤더처럼 동작하므로, 스크롤하면 콘텐츠와 함께 자연스럽게 위로 사라지고, 다시 최상단까지 올려야 나타납니다. 자동 숨김/표시 JS 로직이 없으며 CSS만으로 동작합니다.

### 구현
- **CSS** (`Frame.astro` 모바일 미디어쿼리): `.fixed-actions`에 `position: relative`만 오버라이드합니다. `height: var(--header-height)`(48px)로 흐름에서 높이를 차지하고, `.left-action`/`.right-actions`(`position: absolute`)의 containing block 역할을 그대로 유지하므로 배치가 깨지지 않습니다.
- **JS 없음**: 기존 스크롤 연동 코드(`updateFrameOffset`, `scheduleFrameUpdate`, scroll/resize 리스너, rAF 스로틀, abort 시 `cancelAnimationFrame`, `--header-height` 읽기)와 `openLangList()`/`closeLangList()` 내 transform 처리(`updateFrameOffset()` 호출)를 모두 제거했습니다.
- **데스크톱 전용 유지**: 데스크톱(>960px)은 `position: fixed` 그대로 화면 상단에 고정되어 항상 보입니다.
- **언어 목록 / reduced-motion**: transform 조작이 없으므로 별도 처리 불필요. `lang-list`는 열린 상태에서도 헤더 안에 자연스럽게 표시됩니다.

## 스크롤 컨테이너 구조

스크롤 컨테이너는 `html`입니다 (`min-height: 100%; overflow-y: scroll`). 브라우저 루트 스크롤바가 사용됩니다.

프레임 배경은 `.viewport-container::before` pseudo-element가 담당합니다 (`position: fixed; inset: var(--frame-thickness); z-index: 0`). 네 면 모두 동일한 여백으로, viewport 안에서 프레임 두께만큼 안쪽으로 들어간 영역을 밝은 배경으로 채웁니다. 콘텐츠 흐름에 관여하지 않습니다.

프레임 foreground 마스크는 `.frame-border` 독립 DOM 요소와 4개의 `.frame-edge` 자식 요소가 담당합니다 (`position: fixed; inset: 0; z-index: 2`). 네 면 각각을 `background-color: var(--color-frame)`인 독립 요소로 덮어 브라우저의 Force Dark border 왜곡을 방지합니다. `position: fixed; inset: 0`은 layout viewport(스크롤바 gutter 제외)를 기준으로 하므로, 테두리가 스크롤바 gutter를 침범하지 않습니다. `pointer-events: none`으로 스크롤 및 클릭을 방해하지 않습니다.

`.viewport-container`에 `isolation: isolate`가 설정되어, `::before`/`.frame-border`와 `.page-content`가 같은 stacking context 안에서 z-index가 작동합니다.

`.page-content`는 스크롤 컨테이너가 아닙니다. `position: relative; z-index: 1`로 콘텐츠 레이어 역할만 합니다.

`Frame.astro`의 `.fixed-actions`는 `position: fixed`로 viewport 좌표계를 따릅니다. `top: 0; left: 0; right: 0`으로 화면 상단에 고정됩니다. `.left-action { left: var(--frame-thickness) }`와 `.right-actions { right: var(--frame-thickness) }`는 좌우 대칭으로 `position: absolute`로 배치됩니다. concave corner는 각 요소의 `::before`(좌우 측면)와 `::after`(하단) pseudo-element가 radial-gradient로 구현합니다. 모바일에서는 `.fixed-actions`가 `position: relative`로 문서 흐름에 포함되며 `max-width: 100vw`가 적용됩니다.

스크롤 관련 JS는 window를 대상으로 합니다:
- `TOC.astro`: TH는 표준 hash 앵커로 이동하며, `scroll-margin-top`과 같은 기준선으로 현재 PH를 선택함
- `PostListSection.astro`: `window.addEventListener('scroll', ...)` + `document.scrollingElement`의 `scrollTop / (scrollHeight - clientHeight)`로 스크롤 위치 계산

## (Historical) Bug Fix: Language Switching Design Flaw

> **참고**: 이 섹션은 이전에 작성된 기록용 문서다. 현재 코드에서는 `window.__AVAILABLE_LANG_CODES__`를 사용하지 않으며, 언어 전환은 `Frame.astro`의 `changeLang()` 함수가 `pathSegments` 기반으로 처리한다.

### Symptom
When switching languages from a non-Korean page (e.g., `/en/`), the URL would incorrectly append the new language code instead of replacing the existing one.
- **Before (Bug):** `/en/` → `/fr/en/` (404)
- **After (Fixed):** `/en/` → `/fr/`

### Root Cause
The `nonDefaultLocaleCodes` array was generated using `window.__OTHER_LOCALES__` (which excluded the *current* language by design). When checking `nonDefaultLocaleCodes.includes(currentLang)`, it always evaluated to `false` for non-KO pages because the current language was explicitly excluded from the array. This caused the logic to fall into the `else` branch (`pathSegments.unshift(langCode)`), incorrectly prepending the new language code.

### Solution
1. Added `window.__AVAILABLE_LANG_CODES__` to the client-side script, representing the **complete** list of normalized language codes (e.g., `['ko', 'en', 'fr', 'ru', 'es']`).
2. Updated the `nonDefaultLocaleCodes` logic to filter from `window.__AVAILABLE_LANG_CODES__` instead of `window.__OTHER_LOCALES__`.
3. Added `normalizedLangCode` to handle locale codes like `en-US` correctly against URL segments like `en`.

### Additional Hardening (Post-Fix Review)
After the initial fix, a thorough review identified three additional issues that were addressed:

#### (A) Unified Path Construction (Eliminates Conditional Branching)
The original fix still used a complex `if/else` chain to decide between replacing vs. prepending the language segment. This was replaced with a simpler, more robust two-step algorithm:

1. **Remove** any existing language segment from the path (if the first segment is a known language code)
2. **Prepend** the target language code **unless** the target is Korean (KO content lives at root `/`, not `/ko/`)

This approach automatically handles edge cases without explicit conditionals:
| Scenario | Old Logic | New Logic |
|---|---|---|
| `/en/blog` → `fr` | `includes('en')==true` → replace | `shift()` → `['blog']` → `unshift('fr')` → `/fr/blog` |
| `/blog` → `fr` | `includes('blog')==false` → prepend | `shift()` not triggered → `unshift('fr')` → `/fr/blog` |
| `/` → `en` | `includes(undefined)==false` → prepend | `shift()` not triggered → `unshift('en')` → `/en` |
| `/ko/blog` → `en` | `includes('ko')==false`(ko is excluded!) → **WRONG: `/en/ko/blog`** | `shift()` triggers (ko is in validLangSet!) → `['blog']` → `unshift('en')` → **`/en/blog`** |

#### (B) Query String & Hash Preservation
The original handler used only `window.location.pathname`, discarding `search` (query string) and `hash` (anchor). The fixed handler preserves both:
```javascript
const search = window.location.search;
const hash = window.location.hash;
window.location.href = newPath + search + hash;
```

#### (C) Guard Clause for `window.__AVAILABLE_LANG_CODES__`
A runtime guard was added to prevent crashes if the global variable is not yet initialized (e.g., due to script loading timing issues):
```javascript
const allLangCodes = window.__AVAILABLE_LANG_CODES__;
const defaultLang = window.__DEFAULT_LOCALE__;
const validLangSet = new Set(allLangCodes);
```

### Design Principle: `__AVAILABLE_LANG_CODES__` Must Be Complete
`window.__AVAILABLE_LANG_CODES__` **must** contain all language codes, unfiltered by the current page's language. If it were filtered (like `__OTHER_LOCALES__`), the `validLangSet.has(currentLang)` check would fail for the current page's own language segment, and the edge case `/ko/blog` → `en` would again produce the wrong URL `/en/ko/blog`. This is why `__AVAILABLE_LANG_CODES__` and `__OTHER_LOCALES__` serve fundamentally different purposes and must not be conflated.

## Bug Fix: Side Content Fade Corner Bleeding

> **참고**: 프레임 테두리에서 `border-radius`를 제거한 이후로 이 버그는 발생하지 않습니다. 아래는 historical 기록입니다.

### Symptom
On desktop screens, the bottom-left and bottom-right corners of the `.page-content` (which should look round/concave because of `border-radius: var(--frame-radius)`) appeared square, or were covered by a weird solid block matching the content background color (`var(--color-bg)`).

### Root Cause
1. `.page-content` has `border-radius: var(--frame-radius)` (28px). Its corners clip the content so the dark frame background shows through, creating the concave transition effect.
2. The side gradient mask blocks (`.content-side-fade` and `.content-side-fade-top`) are positioned on top (`z-index: 1`) with `background: var(--color-bg)`.
3. However, these mask blocks had square corners (no `border-radius`). Their bottom/top corners overlapped the rounded corners of `.page-content`, bleeding into the clipped area and making the frame's corners look square/buried.
4. Additionally, the height of the fade block was smaller than `--frame-radius` (28px). If we simply added `border-radius` to the fade blocks, the browser would downscale the radius to fit the smaller height, failing to perfectly match the 28px radius of `.page-content`.

### Solution
1. Changed the height of the fade blocks in `BaseLayout.astro` from `var(--content-side-fade-height)` to `var(--frame-radius)` (28px). This guarantees the height is at least equal to the border radius, so no downscaling of the radius occurs.
2. Added matched border-radii to the fade blocks:
   - For `.content-side-fade` (bottom): `border-bottom-left-radius: var(--frame-radius)` and `border-bottom-right-radius: var(--frame-radius)`.
   - For `.content-side-fade-top` (top): `border-top-left-radius: var(--frame-radius)` and `border-top-right-radius: var(--frame-radius)`.
   This aligns their boundaries perfectly with the rounded edges of the `.page-content` container, preventing any bleeding while preserving the beautiful fade mask.

### Current State
프레임 테두리가 `border-radius: 0`으로 변경되면서, content-side-fade의 `border-radius`도 제거되었습니다. 프레임이 사각형이므로 corner bleeding 문제가 더 이상 발생하지 않습니다.

## Bug Fix: 헤더 상단 1px 간격 (서브픽셀 반올림)

### Symptom
특정 줌 레벨(예: Ctrl+스크롤 110%)에서 `.frame-border`의 border-top 하단 경계와 `.action-block`(헤더 바) 상단 경계 사이에 1px 하얀 간격이 보임. 간격 사이로 배경색(`--color-bg`)이 비침.

### Root Cause
`.frame-border`(z-index: 2)와 `.fixed-actions`(z-index: 100)는 서로 다른 compositing layer로 렌더링됩니다. 두 요소의 경계가 모두 `12px`(= `--frame-thickness`)에 위치하지만, 브라우저가 각 레이어의 위치를 줌 배율에 따라 서브픽셀 반올림하면서 한쪽은 `13px`, 다른 쪽은 `12px`으로 처리되어 1px 간격이 생깁니다.

### Solution
`.action-block`의 `top`을 `calc(var(--frame-thickness) - 1px)`로 1px 위로 이동해 border-top과 반드시 겹치게 합니다. `padding-top: 1px`을 함께 추가하여 내부 콘텐츠(버튼)의 시각적 위치는 유지합니다 (`height` + `padding-top` = 총 높이 1px 증가, `top`도 1px 이동하므로 바닥 경계는 그대로).

좌우 경계도 동일하게 적용합니다. `.left-action { left: calc(var(--frame-thickness) - 1px); padding-left: 1px }`, `.right-actions { right: calc(var(--frame-thickness) - 1px); padding-right: 1px }`. shrink-to-fit 블록에서 `padding`만큼 너비가 늘고 반대쪽 오프셋이 1px 이동하므로 콘텐츠 위치와 반대쪽 끝 경계는 그대로 유지됩니다.

겹침 영역은 모두 `--color-frame`이라 시각적으로 구분되지 않습니다. 모바일(`--frame-thickness: 0px`)에서는 `top/left/right: -1px`이 되지만 뷰포트 밖으로 나가 잘리고, 콘텐츠 위치는 기존과 동일해 영향이 없습니다.

## Footnote Tooltip 모바일 포지셔닝

### Symptom
모바일 등 좁은 화면에서 각주 참조를 호버하면, 툴팁이 뷰포트 우측 모서리에 잘림.

### Root Cause
`.footnote-ref-wrapper`에 `position: relative`가 설정되어 있어, `.footnote-tooltip`의 `left` 좌표는 래퍼의 좌측 경계 기준. Fallback에서 `left: 50%; translate: -50% 0;`은 래퍼 중앙 정렬인데, 래퍼가 기사 우측 끝에 가까우면 툴팁이 뷰포트 밖으로 넘어감. modern 브라우저의 `flip-inline`은 `top center` 정렬에서 효과 없음 (center는 flip해도 center).

### Solution
미디어 쿼리로 모바일/데스크톱 포지셔닝을 분리:

- **모바일 (≤768px)**: `position: fixed` 하단 시트. `left: 12px; right: 12px`으로 양쪽 여백 확보. `env(safe-area-inset-bottom)`으로 아이폰 노치 대응.
- **데스크톱 (≥769px)**: 기존 absolute 포지셔닝 유지. `position-try-fallbacks: flip-block, top left, top right`로 우측 넘침 시 좌측 전환.

## 언어 목록 스크롤

### 구조

```
.right-actions-inner (display: flex, overflow: hidden, width: calc(var(--button-size) * 3))
  ├─ 테마 토글 (var(--button-size))
  ├─ RSS (var(--button-size))
  ├─ 언어 선택 토글 (var(--button-size))
  └─ .lang-list (display: flex, width: 0 → JS가 열 때 설정)
       ├─ RU (var(--button-size))
       ├─ FR (var(--button-size))
       ├─ ES (var(--button-size))
       └─ EN (var(--button-size))
```

PC: --button-size = 56px → 56 × 3 = 168px
모바일: --button-size = 48px → 48 × 3 = 144px

### 문제점
`.lang-list`의 내용이 표시 영역보다 좌우 너비가 길 때 스크롤이 불가능했습니다 (`overflow: hidden`). 모바일 등 좁은 뷰포트에서 언어 수가 많아지면 `.right-actions-inner`가 뷰포트 왼쪽을 벗어날 수 있었습니다.

### 해결책
`.lang-list`에 `overflow-x: auto`와 `max-width`를 적용하여 CSS만으로 스크롤 가능하게 변경:

```css
.lang-list {
  overflow-x: auto;
  overflow-y: hidden;
  max-width: calc(100vw - var(--button-size) * 3 - var(--frame-thickness) * 2);
  scrollbar-width: none;
}
.lang-list::-webkit-scrollbar { display: none; }
```

- `max-width`: 뷰포트 전체 - 고정 버튼 3개 - 좌우 프레임 = 남은 공간
- 스크롤바 숨김: 헤더 바 미관 유지를 위해 브라우저 기본 스크롤바 차단
- JS 변경 없음: 기존 `width` 설정 로직 그대로 유지

### 모바일 언어 목록 열기 동작

모바일에서 `.right-actions-inner.lang-open`의 너비는 `calc(100vw + var(--button-size) * 2)`로 확장됩니다. `.right-actions`가 `position: absolute; right: 0`에 고정되어 있으므로, 확장된 너비만큼 **왼쪽으로** 뻗어나갑니다. 처음 두 버튼(테마, RSS)이 뷰포트 밖으로 밀려나고, 언어 토글이 뷰포트 좌측 끝에 위치합니다.

`.fixed-actions`의 `max-width: 100vw`가 문서 너비가 뷰포트를 초과해도 헤더가 뷰포트 폭을 넘지 않도록 합니다. 이를 통해 가로 스크롤 발생 시에도 우측 버튼이 화면 밖으로 밀려나지 않습니다.
