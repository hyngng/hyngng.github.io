# 검색 excerpt로 Author 정보 대체

## 목표

Pagefind 검색 시 포스트 카드의 Author 영역(`.post-card-meta`)을 검색 결과 excerpt("왜 이 결과가 매칭됐는지"를 보여주는 본문 일부)로 동적 교체. 검색 비활성화 시 원본 Author 정보로 복원.

## 핵심 불변조건

매 검색 실행마다 전체 카드 상태를 원본 기준으로 재평가한다:

1. 모든 `.post-card-meta`를 캐싱된 원본 `innerHTML`로 리셋
2. 매칭된 카드에만 excerpt를 적용
3. 매칭되지 않은 카드는 원본 유지

이렇게 하면 검색어 변경 → 이전에 매칭됐던 카드의 excerpt가 방치되는 문제가 원천 차단됨. 검색 초기화(입력 클리어)는 매칭 결과 0개인 특수 케이스로 자연히 흡수.

## 동작 흐름

```
1. initSearch() 실행 시 모든 .post-card-meta의 innerHTML을 Map<Element, string>에 캐싱 (1회)
2. 사용자가 검색어 입력 (300ms 디바운스)

searchWithPagefind(query):
  2a. (상태 리셋) originalMeta의 캐싱된 HTML로 모든 .post-card-meta.innerHTML 교체
  2b. pagefind.search() → item.data()로 excerpt 획득
  2c. excerpt에 <mark 태그 포함?
      YES → .post-card-meta.innerHTML = excerpt, class +search-excerpt
      NO  → 원본 유지 (캐싱된 HTML 그대로)
  2c. display 토글 (기존과 동일)

3. 검색 초기화 (query 비었음):
  2a 단계만 실행 → 모든 .post-card-meta가 원본 복원. display 토글도 모두 보임. search-excerpt 클래스 제거.

searchWithDOM(query): 변경 없음
  원본대로 Author 유지, display만 토글
```

## 수정 파일 (2개)

### 1. `src/components/Search.astro`

Script 섹션 내 `searchWithPagefind()` 수정, 캐싱 Map 추가:

```typescript
// initSearch() 시작부에 추가 (1회 캐싱)
const originalMeta = new Map<HTMLElement, string>();
document.querySelectorAll<HTMLElement>('.post-card-meta').forEach(el => {
  originalMeta.set(el, el.innerHTML);
});
```

```typescript
async function searchWithPagefind(query: string) {
  const currentLocale = allInputs[0]?.dataset.locale || 'ko';
  const result = await pagefind.search(query, {
    filters: { lang: currentLocale },
  });

  // 상태 리셋: 모든 .post-card-meta를 원본으로 복원
  originalMeta.forEach((html, el) => {
    el.innerHTML = html;
    el.classList.remove('search-excerpt');
  });

  const matchedPaths = new Set<string>();

  for (const item of result.results) {
    const data = await item.data();
    if (data.url) {
      matchedPaths.add(data.url.replace(/\/$/, ''));
    }

    // excerpt 적용: 도미(미) NG 제외

    const excerptHtml = data.excerpt;
    const hasMark = excerptHtml && excerptHtml.includes('<mark');

    if (hasMark) {
      // data.url로부터 해당 카드 DOM 찾기
      const cardPath = (data.url || '').replace(/\/$/, '');

      // 카드 순회해서 el 결정

      const el = elForPath(cardPath);
      if (thisCardMeta) {
        thisCardMeta.innerHTML = excerptHtml;
        thisCardMeta.classList.add('search-excerpt');
      }
    }
  }

  // 나머지는 기존과 동일

}
```

추가로, `originalMap`에 없는 `el`이 생기지 않도록 `allCards`, `allInputs` 등 순회 구조를 통해 Map을 일관성 있게 유지.

### 2. `src/styles/global.css` 또는 `typography.css` — excerpt 전용 스타일:

```css
/* ── Search Excerpt ── */
.post-card-meta.search-excerpt {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.85rem;
  line-height: 1.45;
  color: var(--color-text);
}

.post-card-meta.search-excerpt mark {
  background: none;
  color: var(--color-accent);
  font-weight: 600;
}
```
- `line-clamp` 2줄 고정: excerpt 길이가 카드마다 달라도 높이 일관성 유지
- `mark` 배경 제거 + accent-color 글자 + 굵기: 강조가 자연스럽게
- 다크모드: `color: var(--color-accent)`에 의해 자동 대응
- overflow hidden: line-clamp로 잘린 텍스트가 영역을 벗어나지 않도록

## 제외 대상

- `PostCard.astro`: 불필요 (모듈 필요 없음, JavaScript가 순수히 class 조작)
- `HomePageContent.astro`
- `PostListSection.astro`
- DOM fallback(`searchWithDOM`): 변경 없음. fallback 상황에선 excerpt가 없으니 그냥 Author 유지.

## 추후 개선 가능

- DOM fallback에서도 제목 일치 시 `<mark>` 처리하고 excerpt 없으므로 그냥 ：「」
- Pagefind 인덱스가 생성되지 않은 dev 빌드에서도 검색 UI는 깨지지 않음 (기존 디스플레이 토글 유지)

## 검증

1. `npm run build`
2. dist HTML에 `search-excerpt` 및 `<mark>` 포함된 excerpt가 생성되지 않음 (Pagefind JS가 검색 런타임에 삽입하는 내용이므로 dist HTML에는 보이지 않음)
3. 브라우저에서 Pagefind 검색 시:
   - 검색 결과가 있으면 excerpt와 A, B 카테고리가 올바르게 표시되는지 확인
   - 검색어 제거 시 원래 Author 정보 복원
   - 다크/라이트모드 일치
   - 그리드 높이 일정 (line-clamp 적용 확인)
