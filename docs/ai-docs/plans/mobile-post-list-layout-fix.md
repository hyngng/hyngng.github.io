# 모바일 포스트 목록·더보기 레이아웃 수정 계획

## 목적

모바일(뷰포트 `<= 960px`)에서 포스트 카드의 너비와 카드 사이 간격을 일관되게 유지하고, 더보기로 추가된 카드도 처음 렌더링된 카드와 같은 DOM 흐름과 간격 규칙을 따르게 한다.

이번 작업은 단순히 모바일에서 `width: 100%`를 추가하는 CSS 보정이 아니다. 현재 증상은 **데스크톱용 2열 DOM과 모바일용 1열 표시 규칙이 서로 다른 부모·배치 규칙을 공유하는 구조적 문제**이므로, 포스트 목록의 DOM 소유권과 배치 절차를 바로잡는다.

## 관찰된 원인

대상: `src/components/PostListSection.astro`

현재 서버 HTML은 다음과 같다.

```html
<div class="posts-columns">
  <div class="posts-col posts-col-left">…카드 일부…</div>
  <div class="posts-col posts-col-right">…카드 일부…</div>
  <a class="load-more-card">…</a>
</div>
```

1. `.posts-columns`는 데스크톱에서 `display: flex; align-items: start`이다. 모바일에서 `flex-direction: column`만 적용하면, 교차축이 가로축으로 바뀐다. 이때 `align-items: start`는 `.posts-col`을 컨테이너 너비까지 stretch하지 않고 내용 기반 너비로 만든다. 열마다 가장 넓은 카드의 내용이 다르므로 카드 너비가 달라진다.
2. 일반 카드는 `.posts-col`의 `gap: var(--post-card-gap)`을 이용하지만, 더보기 카드는 `.posts-columns`의 직접 자식이다. 두 종류의 인접 항목이 같은 목록 컨테이너에 있지 않아 간격 규칙이 분리된다.
3. `loadChunk()`는 기존 더보기 카드를 첫 새 카드로 교체한 뒤, 남은 새 카드와 새 더보기 카드를 왼쪽 열에만 추가한다. 모바일에서도 같은 코드가 실행되어, 카드가 `.posts-col-left`, `.posts-col-right`, `.posts-columns`에 섞인다. 따라서 로딩 이후 카드의 순서·너비·간격을 하나의 규칙으로 보장할 수 없다.

`align-items: stretch`만 추가하면 첫 번째 증상은 일부 완화할 수 있지만, 더보기 이후 DOM이 여러 부모에 섞이는 두 번째·세 번째 증상은 남는다. 이 방식은 채택하지 않는다.

## 설계 원칙

- 모바일의 정본(canonical) 구조는 **시간순 카드와 더보기 카드가 하나의 세로 목록의 직접 자식**인 구조다.
- `gap: var(--post-card-gap)`은 그 단일 목록이 담당한다. 카드·더보기 카드에 개별 margin을 덧붙이지 않는다.
- 데스크톱 2열 배치는 정본 데이터를 바꾸지 않는 표시용 재배치다. 화면 폭이 바뀌면 언제나 현재 카드 전체를 수집하고, 해당 모드의 유일한 부모에 다시 배치한다.
- 새 청크 로딩, 뒤로/앞으로 이동, 검색용 카드 추가·정리는 모두 같은 배치 함수를 호출한다. 특정 열을 직접 `appendChild()`하는 호출을 남기지 않는다.
- JS가 비활성화된 경우에도 서버 HTML은 모바일과 같은 단일 목록이므로 순서·링크·더보기 링크가 정상 동작해야 한다. 데스크톱의 masonry는 progressive enhancement로 취급한다.

## 목표 DOM

서버에서 렌더링하는 최초 HTML은 다음처럼 순서가 보장된 단일 목록이어야 한다. `PostListSection`과 네 종류의 chunk 페이지가 동일한 구조를 출력해야 한다.

```html
<div class="posts-grid" data-…>
  <div class="posts-columns">
    <!-- 최신순 PostCard 0..N-1 -->
    <article class="post-card" data-path="…" data-index="0">…</article>
    <article class="post-card" data-path="…" data-index="1">…</article>
    <!-- 다음 청크가 있을 때만 마지막 항목 -->
    <a class="load-more-card" href="…">…</a>
  </div>
</div>
```

데스크톱 JS 활성화 후에는 같은 실제 DOM 노드를 아래처럼 옮긴다.

```html
<div class="posts-columns">
  <div class="posts-col posts-col-left">…균형 배치된 카드…</div>
  <div class="posts-col posts-col-right">…균형 배치된 카드와 더보기 카드…</div>
</div>
```

모바일로 되돌아오면 두 `.posts-col`을 제거하고 모든 카드와 더보기 카드를 다시 `.posts-columns`의 직접 자식으로 복원한다. DOM 노드를 복제하지 않으므로 이미지 상태, 포커스, 이벤트 위임, 검색 상태가 중복되지 않는다.

## 실제 수정 계획

### 1. 공통 포스트 목록 렌더링을 단일 구조로 통합

대상 파일:

- `src/components/PostListSection.astro`
- `src/pages/posts/chunk/[n].astro`
- `src/pages/[lang]/posts/chunk/[n].astro`
- `src/pages/[author]/chunk/[n].astro`
- `src/pages/[lang]/[author]/chunk/[n].astro`
- `src/scripts/chunk-masonry.ts`

작업:

1. 서버 렌더링 단계의 `distributeByWeight()` 호출과 `leftPosts`/`rightPosts` 분할을 제거한다.
2. 각 경로가 청크의 포스트를 원래 정렬 순서대로 한 번만 렌더링하고, 더보기 카드는 항상 마지막 형제 요소로 렌더링한다.
3. 다섯 파일에 중복된 카드 목록 마크업과 배치 스크립트는 공통 컴포넌트/공통 클라이언트 모듈로 모은다. 최소한 동일한 DOM 계약과 `layoutPosts(grid)` API를 사용하도록 한다.
4. 기존 `chunk-masonry.ts`는 별도의, 초기 1회용 배치 구현을 유지하지 않는다. 공통 배치 모듈로 흡수하거나 제거한다. 두 개의 서로 다른 masonry 알고리즘이 다시 생기지 않게 한다.

이 단계의 핵심은 **서버 HTML에서부터 모바일 순서가 맞아야 한다**는 점이다. CSS `order`로 좌·우 열을 재조합하거나 모바일 전용 카드 사본을 렌더링하지 않는다.

### 2. 화면 모드별 재배치 함수를 명확히 분리

대상: `PostListSection.astro`의 현재 `distributeAll()` 및 `initMasonryLayout()`에 해당하는 공통 스크립트.

다음 책임을 가진 함수를 만든다.

```ts
function collectPostItems(grid: HTMLElement): {
  cards: HTMLElement[];
  loadMore: HTMLElement | null;
}

function layoutMobile(grid: HTMLElement): void
function layoutDesktop(grid: HTMLElement): void
function layoutPosts(grid: HTMLElement): void
```

- `collectPostItems()`은 grid 내부의 모든 `.post-card`와 `.load-more-card`를 수집한다. 카드는 `data-all-posts`의 path 순서(또는 `data-index`)로 정렬한다. 이 정렬은 화면 전환·청크 추가 후에도 시간순을 보존하는 기준이다.
- `layoutMobile()`은 수집한 모든 카드를 `.posts-columns`의 직접 자식으로 순서대로 넣고, 더보기 카드를 마지막에 둔다. 남아 있는 `.posts-col`은 빈 상태로 제거한다.
- `layoutDesktop()`은 필요할 때만 좌·우 `.posts-col`을 생성하고, 현재의 높이 추정 규칙(이미지 비율과 `--post-card-height-no-image`)으로 카드를 균형 배치한다. 더보기 카드는 더 낮은 열의 마지막에 둔다.
- `layoutPosts()`는 `matchMedia('(max-width: 960px)')` 결과에 따라 위 둘 중 하나만 호출한다.
- media query의 `change` 리스너는 `AbortController` signal로 등록하고, 화면 크기 전환 때마다 `layoutPosts(grid)`를 호출한다.

이렇게 하면 모바일에서는 카드·더보기 카드의 부모가 언제나 하나이므로 `gap`과 `width`가 같은 레이아웃 알고리즘에서 계산된다.

### 3. CSS를 구조에 맞게 단순화

대상: `src/components/PostListSection.astro`의 스타일. chunk 페이지 전용 중복 스타일이 남아 있다면 `src/styles/global.css`도 함께 정리한다.

목표 규칙:

```css
.posts-columns {
  display: flex;
  flex-direction: column;
  gap: var(--post-card-gap);
  width: 100%;
}

.posts-columns > .post-card,
.posts-columns > .load-more-card,
.posts-col > .post-card,
.posts-col > .load-more-card {
  width: 100%;
}

@media (min-width: 961px) {
  .posts-columns {
    flex-direction: row;
    align-items: flex-start;
  }

  .posts-col {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--post-card-gap);
  }
}
```

정확한 selector는 구현한 공통 구조에 맞춰 조정하되, 다음 제약은 지킨다.

- 모바일에서 `.posts-columns`는 `align-items: stretch`가 기본이거나 `width: 100%`를 명시해 모든 직접 자식이 동일 너비가 되게 한다.
- 모바일 카드 간격은 오직 `.posts-columns`의 `gap`으로 관리한다.
- 데스크톱 열 간격과 열 내부 카드 간격은 모두 `--post-card-gap`을 사용한다.
- 음수 margin, `:has()` 기반 예외 셀렉터, 카드별 margin 보정으로 증상을 가리지 않는다.
- `px` 값이나 새 매직 넘버를 추가하지 않는다.

### 4. 청크 로더를 ‘직접 열 삽입’에서 ‘목록 갱신 후 재배치’로 변경

대상: `PostListSection.astro`의 `loadChunk()`과 `popstate` 처리.

현재처럼 모바일에서 `left!.appendChild(card)` 또는 데스크톱에서 `left/right`를 직접 선택하는 코드를 제거한다.

권장 흐름:

```ts
const { cards: incomingCards, loadMore: incomingLoadMore } = parseChunk(html);
const previousLoadMore = grid.querySelector<HTMLElement>('.load-more-card');

// 이전 preview는 실제 첫 카드가 된다.
previousLoadMore?.replaceWith(incomingCards[0]);

// 나머지 카드는 현재 항목 집합에 추가한다.
for (const card of incomingCards.slice(1)) {
  appendToCanonicalFlow(grid, card);
}

if (incomingLoadMore) {
  appendToCanonicalFlow(grid, incomingLoadMore);
}

layoutPosts(grid);
```

`appendToCanonicalFlow()`는 특정 좌·우 열이 아니라 현재 모드의 정본 흐름에 추가한다. 구현 순서는 달라도 되지만, 최종적으로 다음을 만족해야 한다.

- 첫 preview는 정확히 한 번만 실제 포스트 카드가 된다.
- 새 카드에는 현재의 `is-new` 및 stagger animation을 유지한다. preview였던 첫 카드는 애니메이션 대상에서 제외한다.
- 새 더보기 카드는 모든 새 카드 뒤에 정확히 한 개만 존재한다.
- 마지막 청크면 더보기 카드를 숨기거나 제거하되 빈 간격을 남기지 않는다.
- `history.pushState`, prefetch, URL의 `?p=` 복원 동작은 유지한다.
- `popstate`에서 카드를 제거한 뒤에도 반드시 `layoutPosts(grid)` 한 번만 호출한다.

### 5. Search와의 상호작용 회귀 방지

대상: `src/components/Search.astro`

검색 코드는 현재 `.posts-col-left`를 찾아 검색용 카드를 직접 삽입하는 경로가 있다. 공통 레이아웃 전환 후에는 존재하지 않을 수 있으므로, 다음처럼 변경한다.

- 검색으로 가져온 카드를 canonical flow에 추가하고 `layoutPosts(postsGrid)`를 호출한다.
- 검색 해제 시 `[data-search-loaded]` 카드 제거와 더보기 카드 복원 후에도 `layoutPosts(postsGrid)`를 호출한다.
- `.posts-col-left`가 있다는 전제를 제거한다.
- 기존 `window.__postsDistributeCards` 공개 API가 필요하다면 이름과 책임을 `layoutPosts`로 맞추고, 모든 호출 지점을 함께 갱신한다. 임시 호환 alias를 장기간 남기지 않는다.

## 변경하지 않을 것

- 포스트 데이터 정렬 기준, `SITE.postsPerPage`, 청크 URL 구조, locale 문자열.
- 카드 자체(`PostCard.astro`)의 내용·이미지·hover 애니메이션.
- 더보기의 문구·접근성 레이블·progressive enhancement 링크 동작.
- 색상, radius, 간격 토큰 값. 이 작업은 레이아웃 소유권을 고치는 것이며 디자인 값을 바꾸는 작업이 아니다.

## 구현 순서

1. 공통 목록/청크 렌더링의 서버 HTML을 단일 순서 목록으로 변경한다.
2. 공통 `layoutMobile`·`layoutDesktop`·`layoutPosts`를 구현하고, viewport 전환을 검증한다.
3. CSS를 새 DOM 계약에 맞춰 정리한다.
4. 청크 로더와 history 복원을 공통 배치 API만 사용하도록 바꾼다.
5. Search의 직접 열 삽입을 제거한다.
6. 모든 청크 라우트와 JS 비활성화 fallback을 수동 검증한다.
7. 검증이 모두 끝난 뒤에만 `docs/ai-docs/roadmap.md`의 관련 청크 로딩 항목에 실제 완료 상태를 반영한다. 이 계획서 작성만으로는 완료 처리하지 않는다.

## 검증 기준

### 수동 브라우저 검증

모바일 폭(320px, 375px, 768px)과 데스크톱 폭(961px 이상)에서 루트·언어·작성자·언어+작성자 목록을 각각 확인한다.

- 모바일: 모든 `.post-card`와 `.load-more-card`의 좌우 폭이 같은지, `--post-card-gap`만큼의 간격이 모든 인접 항목에 적용되는지 확인.
- 모바일: 더보기 1회·2회 후에도 카드 순서가 시간순인지, preview가 중복되지 않는지, 새 카드와 더보기 카드 모두 같은 폭·간격인지 확인.
- 모바일: 960px 경계를 왕복해도 카드 누락·중복·순서 역전·이벤트 리스너 중복이 없는지 확인.
- 데스크톱: 두 열이 균형 배치되고 더보기 카드가 한 열의 마지막에 있는지 확인.
- 브라우저 뒤로/앞으로: `?p=` 상태에 맞는 카드 수·더보기 상태가 복원되는지 확인.
- 검색: 검색 결과를 위해 로드된 카드, 검색 해제 후 복원된 카드, 더보기 모두에서 레이아웃이 유지되는지 확인.
- JS 비활성화: 단일 열 카드와 다음 청크 링크가 정상적으로 표시·이동되는지 확인.

### 명령 검증

구현 완료 후 반드시 실행한다.

```powershell
npm run build
npx astro check
```

두 명령이 성공하고, 생성된 chunk 경로가 유지되어야 한다.

## 완료 정의

모바일에서 최초 렌더, 더보기 직전/직후, 화면 회전 또는 뷰포트 변경, 검색 활성화/해제 모두에서 카드와 더보기 카드가 단일 1열 흐름으로 같은 너비와 `--post-card-gap` 간격을 유지하면 완료다. 데스크톱의 2열 masonry와 청크·검색·history 기능이 회귀하지 않아야 한다.
