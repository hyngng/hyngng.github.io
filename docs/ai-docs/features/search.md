# Search Feature Specification (Pagefind)

This document describes the requirements and the client-side search implementation.

## Requirements

1. **Pagefind 기반 정적 전문(full-text) 검색** — 빌드 타임 인덱싱 (`pagefind --site dist --output-path dist/pagefind`).
2. **언어 격리** — 검색 쿼리는 현재 페이지의 BCP-47 로케일로 필터링한다 (`lang:ko-KR`, `lang:en-US`, ...). 한국어 뷰는 한국어 포스트만 검색한다.
3. **인덱싱 범위** — 포스트 본문만 인덱스 (`data-pagefind-body`). 전역 네비/사이드바 제외.
4. **pagefind 미사용 환경 폴백** — `/pagefind/pagefind.js` 로드, 인덱스 초기화, 검색 요청이 2.5초 안에 끝나지 않거나 실패해도 (dev 빌드 직후, worker 차단 등) DOM 기반 제목/설명 필터로 검색 UI가 동작해야 한다. 폴백이 활성화되면 `.search-fallback` 상태 문구를 표시해 결과 없음과 구분한다.
5. **미로딩 청크 포함 전체 검색** — 결과 집합은 현재 DOM에 로드된 카드뿐 아니라 아직 fetch되지 않은 청크의 포스트도 포함한다.
6. **다중 입력 동기화** — 데스크 사이드바/모바일 두 검색 입력의 값이 동기화된다.
7. **검색 해제 시 원상복구** — 검색용으로 추가된 카드 제거, 원본 카드 전체 표시, load-more 복원, masonry 재배치.
8. **빈 상태** — 지역화된 "검색 결과가 없습니다" 메시지 (`.search-empty`, `aria-live="polite"`).
9. **Controller 단일 소유** — 검색은 PostListController를 통해서만 DOM을 조작한다.
10. **pagination 무영향** — 검색용 청크 fetch는 `?p=` 상태를 변경하지 않는다. popstate 시 활성 검색어가 재실행된다.

## Architecture

### 단일 엔진, 단일 커밋 (Single Engine, Single Commit)

검색 파이프라인의 핵심 불변조건은 **한 검색 = 한 엔진 = 한 번의 원자적 커밋**이다.

- 결과 집합을 결정하는 엔진은 세션당 1회만 확정된다 (`src/features/search/engine.ts`의 `getSearchEngine`).
  - pagefind 모듈 import 성공 → `PagefindEngine` (정규, 초기 `mode: 'pagefind'`)
  - import 실패/타임아웃 → `DomFallbackEngine` (dev 폴백, 세션 내내 유지, `mode: 'dom'`)
- `PagefindEngine`은 인덱스 초기화·검색·결과 `data()` 단계에도 각각 타임아웃을 적용한다. 실패하면 같은 인스턴스가 `mode: 'dom'`으로 전환되어 이후 검색을 DOM 폴백으로 처리한다.
- `Search.astro`는 검색 전후로 `engine.mode`를 확인해 `.search-fallback`(`role="status"`)을 표시하거나 숨긴다. 따라서 "Pagefind를 쓸 수 없음"과 "검색 결과 0건"이 서로 다른 문구로 전달된다.
- 두 엔진의 결과를 혼합하거나, 잠정(provisional) 결과를 먼저 렌더링하지 않는다.
- `controller.showSearchResults(paths)`는 검색당 정확히 1회만 호출된다.
  - 이전의 2-Stage Pipeline(Fast-Path 잠정 렌더 + Pagefind 확장)은 결과 집합이 두 소스에서 나와
    플리커(잠정 결과 → 최종 결과)를 유발했으므로 폐기됨.

### 첫 검색 지연 제거 (focus 프리로드)

pagefind를 첫 검색 시에만 로드하면 지연(먹통)이 생긴다. 따라서 **검색 input의 `focus` 이벤트에서
백그라운드로 pagefind 모듈 import를 프리로드**한다. 인덱스 초기화(`init(locale)`)는 현재 페이지 로케일을
알 수 있는 첫 검색까지 미뤄, 기본 언어 인덱스가 먼저 로드되는 것을 막는다. 사용자가 타이핑하는 동안
로드가 끝나 첫 검색도 즉시 커밋된다. 대기 중에는 카드 그리드를 변이하지 않는다 (잠정 결과 없음).

### 검색 흐름

```
focus ──▶ getSearchEngine() 프리로드 (멤모이즈, 세션당 1회 엔진 확정)
입력 ──▶ debounce(150ms) ──▶ handleSearch(query)
  1. seq = ++searchSeq
  2. engine = await getSearchEngine()
  3. paths = await engine.search(query, { lang, personaId? })
     - PagefindEngine: pagefind.init(lang.toLowerCase()) 후
       pagefind.search(query, { filters: { lang, persona? } })
     - DomFallbackEngine: data-all-posts title/description 필터
  4. ensureChunksLoaded(paths) — 미로딩 청크 병렬 fetch, 숨김 append
  5. controller.showSearchResults(paths)  ← 유일한 커밋 지점 (검색당 1회)
```

경합 처리: 매 키 입력마다 `searchSeq`를 증가시키고, 모든 async 단계 후 현재 시퀀스가 최신인지
확인한다. 이전 검색의 응답은 커밋 전에 폐기된다.

### Multi-language Search Isolation

- 각 포스트는 `PostLayout.astro`에서 `data-pagefind-filter="lang:<lang>"`로 언어 태깅된다.
- Pagefind 인덱스 디렉터리 키는 소문자(`ko-kr`, `en-us`)이고, 필터 값은 HTML `lang`의 표기(`ko-KR`, `en-US`)를 보존한다. 따라서 `init(lang.toLowerCase())`로 현재 언어 인덱스를 선택하고, `filters: { lang: currentLocale }`로 원래 표기 그대로 필터링한다.
- 인덱스 초기화를 첫 검색까지 미루는 이유: `init()`을 언어 없이 호출하면 Pagefind가 기본(최상위) 언어 인덱스만 로드해 다른 로케일 검색이 0건이 된다.

### Persona Search Isolation (페르소나 페이지)

- 각 포스트는 `PostLayout.astro`에서 페르소나별 `data-pagefind-filter="persona:<id>"`로 태깅된다
  (공동 집필 시 다중 값, `<span hidden>`로 비노출).
- 페르소나 페이지(`/{persona}/`)에서는 `PersonaPageContent`가 `Search`에 `personaId` prop을 전달하고,
  `filters: { lang, persona: personaId }`로 검색한다 → 같은 언어의 다른 페르소나 포스트가 결과에 섞이지 않는다.
- DOM 폴백은 페르소나 페이지의 `data-all-posts`가 이미 페르소나 스코프이므로 추가 로직이 필요 없다.

### Indexing Scope

본문만 인덱스한다: `PostLayout.astro`의 `.post-content`에 `data-pagefind-body`.

### Dev Mode Fallback

- `vite-plugin-pagefind`(astro.config.mjs)가 빌드된 `dist/pagefind/`를 dev 서버에서 사용한다. 빌드 전이라 pagefind가 없으면 `getSearchEngine`이 `DomFallbackEngine`으로 확정되어 제목/설명 필터로 동작한다.
- pagefind 모듈은 로드됐지만 인덱스 초기화·검색·결과 조회가 실패/타임아웃되면 `PagefindEngine`이 `mode: 'dom'`으로 전환된다. 이때도 검색 자체는 DOM 폴백 결과로 완료되고, `.search-fallback` 문구가 표시된다.
- `public/pagefind/`는 저장소에 두지 않는다. `prebuild`가 이 디렉터리를 지워 구 언어 코드(`ko` 등)의 오래된 인덱스가 배포물에 섞이지 않게 한다. 실제 인덱스는 `postbuild`의 `dist/pagefind/`만 사용한다.
- 폴백은 `.posts-grid`의 `data-all-posts`(path/title/description JSON)를 사용한다.
  (레거시 `data-title` 속성은 2026-08 감사에서 제거됨)

## Design & Color Tokens

The Search component uses existing design tokens defined in the theme system (`light.css` / `dark.css`):
- **Search Title**: `var(--color-muted)` (maps to `#877575` in light mode)
- **Search Bar Container Background**: `var(--color-post-card-bg)` (maps to `#EDEDED` in light mode, `#1e1e1e` in dark mode)
- **Search Bar Boundary**: `box-shadow: var(--color-card-shadow)` — the same Chirpy-derived boundary (`--card-shadow` structure: soft drop shadow + hairline ring) already applied to post cards. The background tint alone is not enough under Samsung Internet forced dark, so the shadow band keeps the edge visible.
- **Search Input Text**: `var(--color-text)`
- **Search Icon**: `var(--color-muted)`

## Responsive & Mobile Layout

- **Desktop (>1280px)**: The search bar is placed in the right sidebar (`.search-sidebar`) using absolute positioning (`left: 100%`). It remains sticky as the page scrolls. The title (`.search-title`) and the input bar (`.search-bar`) are stacked vertically.
- **Mobile (≤1280px)**: The sidebar is hidden via `.search-sidebar { display: none }`. An inline search bar (`.search-mobile-wrapper`) is rendered directly above the post list in the central area. The `.search-title` (`검색` label) is hidden (`display: none`) since the label only appears in the desktop sidebar, and `.search-bar` expands to `width: 100%`.
- **Heading semantics**: `.search-title` is a `<p>` (not a heading). The same label renders twice in the DOM (mobile wrapper + desktop sidebar, one hidden via CSS) to support viewport switching, so a heading would create duplicate `<h2>` headings on every page and pollute the document outline.
- **Tablet (961–1280px)**: `.search-mobile-wrapper` is absolutely positioned (`right: 0`) against the `position: relative` `.content-body-layout`, so the search bar is vertically centered on the `포스트` section-title row and right-aligned to the content column edge. Its vertical offset is derived from tokens: `top: calc(var(--posts-section-margin-top) + (var(--section-title-line-height) - var(--search-bar-height)) / 2)`. The `.search-bar` width follows the wrapper's `var(--search-bar-width)`.
- **Mobile (≤960px)**: On the root page the `Personas` section is hidden and the `포스트` section title (`.section-title` in `PostListSection`) is visually hidden rather than removed from the accessibility tree. The search sits directly above the post cards. The border-radius stays `20px` (unlike the `12px` post cards). The gap between the search bar and the post list is `--space-search-posts-gap` (`16px`, applied as `.posts-section` margin-top on mobile), while the gap above the search is tightened to `0.5rem` (`.search-mobile-wrapper` margin-top override) so the search bar sits right under the hero personas trigger — mirroring the follower row that sits above the pill buttons on X/Bluesky profiles.
- **Query Sync**: Multiple search inputs synchronize their values when the user types, ensuring the search state is preserved during viewport resize or orientation changes.

## Search-Controller Integration

`Search.astro`는 `src/features/post-list/registry.ts`를 통해 controller에 접근한다.

| 메서드 | 용도 |
|---|---|
| `showSearchResults(paths)` | 검색 결과 1회 커밋 (비매칭 숨김, load-more 숨김, empty 토글) |
| `clearSearch()` | 검색 해제 (추가 카드 제거, 원본 표시, load-more 복원, masonry) |
| `fetchSearchChunk(n)` | 청크 fetch + **숨김(`display: none`) 카드** 추가 (pagination 상태 불변) |

`showSearchResults`는 레이아웃에 무관하게 동작한다: 카드 필터링(`display: none`), load-more 숨김,
empty 상태 토글은 공통으로 수행하고, `distributeByWeight` 2열 재분배는 `.posts-col`(masonry/데스크톱)이
존재할 때만 실행한다. 모바일 flow 레이아웃(`data-layout="flow"`, `.posts-col` 없음)에서는
`findColumns`의 `leftCol`/`rightCol`이 `null`이 되므로 재분배를 건너뛰고 필터링 결과를 DOM 순서 그대로
유지한다.

## Search-Chunk Integration

Pagefind는 빌드 시 전체 포스트를 인덱스하지만, DOM에는 현재 로드된 카드만 존재한다.

1. 결과 경로 집합을 받아, `data-all-posts`의 인덱스로 미로딩 청크를 계산한다.
2. 필요한 청크를 `Promise.allSettled`로 병렬 fetch하고 `controller.fetchSearchChunk(n)`으로
   카드를 **숨김 상태로만** 추가한다. → 청크의 비매칭 카드가 화면에 노출되는 중간 상태가 없음.
3. 최종 `showSearchResults(paths)`가 매칭 카드만 표시한다 (단일 커밋).

## Data Attributes

| Attribute | 위치 | 용도 |
|---|---|---|
| `data-all-posts` | `.posts-grid` | 전체 포스트 메타데이터(path/title/description) — 폴백 필터·청크 계산 |
| `data-path` | `.post-card` | 결과 URL과 카드 매칭 |
| `data-locale` / `data-default-locale` | `.search-input` | 검색 언어 필터 |
| `data-persona` | `.search-input` | 페르소나 페이지 검색 필터 (비페르소나 페이지는 미설정) |

## 관련 문서

- [Chunk Loading](./chunk-loading.md) — `controller`/`distributeByWeight`/`fetchSearchChunk` 재사용
- [Post routing & i18n](./posts.md) — `data-all-posts` 메타 소스, 포스트 카드 구조
- [Locales](../configuration/locales.md) — `data-locale`/`data-default-locale` 언어 필터
