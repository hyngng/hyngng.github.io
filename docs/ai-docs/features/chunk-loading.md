# 포스트 청크 로딩

HTML 조각 기반의 점진적 포스트 로딩 시스템. 빌드 타임에 정적 청크 페이지를 생성하고, 클라이언트에서 프리뷰 카드 클릭 시 다음 청크만 fetch하여 DOM에 append한다.

## 아키텍처 개요

```
초기 렌더링: PostListSection이 SSR 2열 masonry HTML 생성
     │         ─ `.posts-columns[data-layout="masonry"]`
     │         ─ 좌/우 `.posts-col`에 distributeByWeight() 분배
     │         ─ 각 카드: `style="--post-order: ${index}"`
     │
     ├─ desktop(>960px): SSR masonry 그대로 표시, JS init 스킵
     │
     ├─ mobile(≤960px): JS hydration 후 relayout()
     │     → display:contents + order:var(--post-order) → data-layout="flow"
     │     → flat DOM, order:0 (DOM 순서)
     │
     ├─ 프리뷰 카드 클릭 → createChunkLoader → loadChunk()
     │     → fetch → DOMParser → appendChunkItems → pushState
     │
     ├─ JS OFF: 네비게이션 → 청크 페이지 (CSS masonry/order로 시간순 표시)
     │
     └─ 스크롤 80% → prefetch(nextChunkUrl)
```

## 설정

`src/settings/site.settings.ts`:

```ts
postsPerPage: 8,  // 한 번에 표시할 포스트 수
```

## 모듈 구조 (`src/features/post-list/`)

| 파일 | 역할 |
|---|---|
| `types.ts` | 공유 타입 정의 (`PostListConfig`, `PostListController`, `ChunkPayload`) |
| `dom.ts` | DOM 유틸리티 (`parseChunkResponse`, `collectCards`, `findColumns`, `normalizePath`, `assertInvariant`) |
| `distribution.ts` | 공유 분배 알고리즘 (`distributeByWeight`, `cardWeight`, `SSR_COL_WIDTH`, `GAP`) |
| `layout.ts` | 반응형 masonry 레이아웃 (`restoreMobileFlow`, `buildDesktopColumns`, `relayoutGrid`) |
| `append.ts` | 증분 카드 배치 (`appendChunkItems`) — mobile flow guard 포함 |
| `controller.ts` | 단일 상태 소유자 (`createPostListController`) |
| `loader.ts` | 청크 fetch, prefetch, History, popstate 처리 (`createChunkLoader`) |
| `animate.ts` | 카드 등장 애니메이션 (`animateNewCards`) |
| `image-init.ts` | 포스트 카드 이미지 초기화 (`initPostCardImages`) — `loaded` 클래스 추가로 shimmer fade-out |
| `author-link.ts` | 모바일 카드 작가 링크 위임 (`initMobileAuthorLink`) — 문서 레벨 click 인터셉트 |
| `registry.ts` | controller 전역 레지스트리 (`setController`, `requireController`) |
| `index.ts` | 공개 API re-export |

### controller (`createPostListController`)

post-list의 모든 DOM 조작을 단일 controller가 소유한다:

| 메서드 | 역할 |
|---|---|
| `appendChunk(payload)` | 청크 카드 증분 배치 (load-more 교체 + 새 카드 삽입) |
| `showSearchResults(paths)` | 검색 결과 필터링 (매칭 카드만 표시, load-more 숨김, empty 상태) |
| `clearSearch()` | 검색 해제 (추가된 카드 제거, 모든 원본 카드 표시, masonry 복원) |
| `restoreChunkCount(target)` | popstate 시 이전 청크 수로 복원 |
| `relayout()` | 현재 viewport에 맞춰 masonry 재배치 |
| `fetchSearchChunk(n)` | 검색 전용 청크 fetch + parse + **숨김(`display: none`) 카드** 삽입 |

### loader (`createChunkLoader`)

청크 fetch, prefetch, popstate를 처리한다:

- `loadChunk(n)`: 청크 fetch → controller.appendChunk → history.pushState → animate
- prefetch: 스크롤 80% 도달 시 다음 청크 prefetch
- popstate: controller.restoreChunkCount → search 재실행
- 드래그 이벤트 blur 처리

## Masonry 레이아웃

포스트 목록은 2컬럼 masonry 레이아웃을 사용한다. 공유 분배 알고리즘(`distribution.ts`)이 서버와 클라이언트에서 동일한 로직으로 카드를 분배한다.

### SSR 2열 masonry

초기 HTML은 서버에서 2열로 렌더링된다. `__post_order`가 할당된 카드들(변수명 `weightedPosts`)을 `distributeByWeight()`로 좌/우 `.posts-col`에 분배한다. 각 PostCard에 `style="--post-order: ${index}"`가 추가된다.

데스크톱(>960px)에서는 SSR HTML이 그대로 2열 masonry로 표시된다. JS 초기화 시 `relayout()`을 스킵한다. 모바일(≤960px)에서는 `display: contents` + `order: var(--post-order)` CSS가 SSR 2열을 시간순으로 재배열한다.

### data-layout 상태

`data-layout` 속성이 masonry/flow 두 상태를 관리한다:

| data-layout | 용도 | 모바일 CSS | JS 역할 |
|---|---|---|---|
| `masonry` | SSR 초기 상태 + desktop | `display:contents; order:var(--post-order)` | 없음 (SSR-only) |
| `flow` | mobile hydration 후 | `order:0` (DOM 순서) | `restoreMobileFlow()`로 전환 |

모바일 초기화 흐름: `isMobile()` → `controller.relayout()` → `restoreMobileFlow()` (flat DOM, `data-layout='flow'`)

### 레이아웃 트리거

`relayoutGrid(columns, grid)` 함수가 다음 시점에 호출된다:

1. **모바일 페이지 로드**: `restoreMobileFlow()`로 flow 전환 (desktop은 SSR masonry 스킵)
2. **미디어 쿼리 변경**: `(max-width: 960px)` 변화 감지
3. **popstate**: 브라우저 뒤/앞 네비게이션 시 `controller.restoreChunkCount()` 내부에서 호출
4. **검색 해제**: `controller.clearSearch()` 내부에서 호출

`loadChunk()`는 `relayoutGrid`를 호출하지 않는다. 새로 로드된 카드만 기존 컬럼에 증분 추가한다 (appendChunkItems).

### `appendChunkItems` 증분 배치

1. 현재 `.load-more-card`를 첫 번째 새 카드로 교체 (`replaceWith`)
2. 나머지 새 카드를 더 짧은 컬럼에 append (데스크톱: offsetHeight 비교 / 모바일: grid에 직접 append)
3. **모바일 flow guard**: 모바일에서 `data-layout !== 'flow'`이면 `relayoutGrid()` 후 append (모바일 masonry → flow 전환 누락 방지)
4. 새 `.load-more-card`를 더 짧은 컬럼에 배치

### Dev invariant 검사

dev 모드에서 `assertInvariant()`가 flow 상태의 DOM 구조를 검증한다:
- `.posts-col` 요소가 없어야 함 (flow는 flat list)
- `.load-more-card`는 최대 1개, 마지막 자식이어야 함

## 청크 페이지 (4라우트)

| 파일 경로 | URL 패턴 | 설명 |
|---|---|---|
| `src/pages/posts/chunk/[n].astro` | `/posts/chunk/{n}` | 기본 언어 홈 |
| `src/pages/[lang]/posts/chunk/[n].astro` | `/{lang}/posts/chunk/{n}` | 다국어 홈 |
| `src/pages/[author]/chunk/[n].astro` | `/{author}/chunk/{n}` | 기본 언어 작가 |
| `src/pages/[lang]/[author]/chunk/[n].astro` | `/{lang}/{author}/chunk/{n}` | 다국어 작가 |

각 청크 페이지는 독립 HTML로, SSR 2열 masonry로 렌더링된다. 검색·청크 로더 기능은 없다(홈/작가 페이지에서만 동작). 단, 모바일 작가 링크(`initMobileAuthorLink`)는 청크 페이지의 `ChunkPostListBody` 스크립트에서도 등록되어 홈/작가 페이지와 동일하게 작동한다.

## CSS 변수

| 변수 | 값 | 설명 |
|---|---|---|
| `--post-card-height-no-image` | `136px` | 이미지 없는 카드 높이 |
| `--post-card-image-aspect-ratio` | `40/21` | 이미지 카드 종횡비 |
| `--post-card-gap` | `20px` | 카드 간 간격 |

## 로드 흐름 (`loadChunk`)

```
1. fetch(${chunkBaseUrl}/${n})
2. DOMParser → .post-card 추출
3. appendChunkItems: 현재 .load-more-card → 첫 번째 새 카드로 교체
4. 나머지 새 카드를 더 짧은 컬럼에 append (mobile flow guard 체크)
5. 새 .load-more-card를 더 짧은 컬럼에 배치
6. history.pushState({ chunk: n }, '', `?p=${n}`)
7. animateNewCards(animatedCards) — staggered opacity fade-in
8. initPostCardImages() — 새로 로드된 카드의 이미지 shimmer/fade-in 초기화
9. 마지막 청크이면 .load-more-card 숨김 (hidden)
```

### 카드 등장 애니메이션

새로 로드된 카드에 `is-new` 클래스가 추가되어 opacity 페이드인 애니메이션이 적용된다. 50ms 간격 순차 페이드인 (staggered animation).

## SEO 정책

청크 페이지는 홈의 파생 뷰이므로 독립 인덱싱되지 않는다:

```html
<meta name="robots" content="noindex,follow" />
```

- `noindex`: 중복 인덱싱 방지
- `follow`: 링크 그래프 유지
- 커스텀 `sitemap.xml`에서 청크 URL 자동 제외

## Progressive Enhancement

프리뷰 카드는 실제 `<a>` 링크다 (`LoadMoreCard.astro`로 추출):

- **JS 활성화**: `preventDefault()` → `fetch` → `DOMParser` → 카드 삽입 → `pushState`
- **JS 비활성화**: 청크 페이지로 네비게이션 (CSS masonry/order로 시간순 표시)
- `.posts-grid` 이벤트 위임으로 load-more 클릭 처리 (AbortController로 스코프 관리)

## URL 상태

- `?p=3` → 3번째 청크까지 로드된 상태
- `history.pushState` / `popstate` 이벤트 처리
- 페이지 로드 시 URL의 `?p=` 파라미터 읽어서 해당 청크까지 순차 로드

## 로케일

프리뷰 카드의 텍스트는 두 줄로 표시된다 (`.load-more-main` + `.load-more-sub`):

| 필드 | 용도 | ko 예시 |
|---|---|---|
| `loadMoreCount(n)` | 주 정보 (다음 청크 로드 개수) | `및 8개 포스트 불러오기` |
| `loadMoreSub(total, remaining)` | 부 정보 (전체 대비 남은 수) | `전체 24편 중 16편 남음` |
| `loadMoreHover(title, n)` | `aria-label`용 (접근성) | `{title} 외 8건` |

마우스 호버(`@media (hover: hover) and (pointer: fine)`) 시에는 텍스트 대신 `<Author>` 컴포넌트가 슬라이드업되어 다음 미리보기 글의 작가 정보를 표시한다.

모바일 레이아웃(`@media (max-width: 960px)` — JS의 `MOBILE_QUERY`와 동일 기준)에서는 동일한 슬라이드 연출이 **스크롤 근접 기반**으로 구동된다 (`src/features/post-list/load-more-preview.ts`). 입력 장치 리포팅 기반인 `(hover: none)`은 실기기·웹뷰·마우스 연결 상태에 따라 평가가 들쭉날쭉해 배제했다(실기기 미동작 원인이었음):

- 문서 하단까지 남은 거리가 `--load-more-reveal-start`(global.css 토큰, 125px) 이하로 줄어들면 `--lm-progress`(0~1)가 연속 계산되고, 잔여 거리가 `--load-more-reveal-end`(25px)에 도달하면 전환이 완료되어 Author가 고정된다. 카드의 `.load-more-default`/`.load-more-hover` transform과 제목·Author 색상이 이 변수로 구동된다 (PC와 동일한 시각 언어, keyframe 없음).
- 미리보기 이미지는 같은 구간에서 `brightness/opacity 0.9→1`로 복원된다 — PC 호버와 동일한 시작·종료 값, 동일 토큰 구동(사용자 결정: grayscale 등 추가 연출은 배제). 변수 미설정 시(reduced-motion 포함) 기본 딤 상태를 유지한다.
- 스타일 배치 제약: `LoadMoreCard` 스타일은 **기본 → PC 호버(`hover:hover`) → 모바일 변수 구동(`max-width:960px`) → reduced-motion** 순으로 배치한다. 동일 특이도 규칙의 승패는 소스 순서로 갈린다 — 과거 정적 이미지 `filter`가 변수 구동 규칙보다 뒤에 선언되어 무효화됐던 사건(모바일 이미지 무반응)의 원인이었다. 기본 선언을 옮기거나 새 규칙을 추가할 때 이 순서를 유지할 것.
- 양방향: 위로 스크롤해 시작 지점(125px) 밖으로 나가면 텍스트 상태로 복귀.
- 탭은 기존과 동일하게 즉시 `loadChunk()` 실행 — 이 연출이 탭 실행을 지연하지 않는다.
- 갱신 시점: scroll/resize(rAF 스로틀, 읽기→쓰기 순서로 리플로우 회피) + `ResizeObserver(document.body)`(청크 로드·이미지 reveal로 인한 문서 높이 변화 대응).
- `prefers-reduced-motion: reduce`에서는 변수를 설정하지 않아 텍스트 상태 고정. 설정 토글 시 즉시 재동기화된다.
- 접근성: Author 정보는 DOM에 상시 존재하며, `<a>`의 `aria-label`(`loadMoreHover`)이 AT 접근 이름을 제공하므로 시각 상태와 무관하게 항상 접근 가능하다.

트리거 거리를 절대 px(비율 아님)로 정의한 이유는 페이지 길이와 무관하게 일관된 물리적 거리에서 전환이 시작되도록 하기 위함이다. 전환 구간은 125px→25px(100px 폭)로, 문서 최하단에 도달하기 전에 전환이 완료되어 완성된 Author 상태를 볼 시간이 확보된다.

## 서비스 워커 상호작용

커스텀 `astro-pwa` 통합(`vite-plugin-pwa` 기반)이 빌드 시 `dist/sw.js`를 생성하며, Workbox 프리캐시에 청크 URL이 포함된다. `fetch('/posts/chunk/2')` 호출 시 SW가 프리캐시에서 즉시 응답한다.
