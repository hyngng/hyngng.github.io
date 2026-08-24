---
title: "블로그 기술사항"
authors: ["blog", "dev"]

categories: []
tags: []
start_with_ads: true

toc: true

date: 2026-08-19 00:00:00 +0900
last_modified_at: 2026-08-19 00:00:00 +0900
---

:::info
[이전 글]()에서 이어집니다!
:::

## **들어가며**

기술사항을 전시하듯이 나열하는 것은 큰 의미가 없다고 생각합니다. 다만 어떤 선택을을 왜, 어떻게 상행했는지는 앞으로도 사람들의 관심사로 남을 것 같다는 생각입니다.

## **문제 상황과 돌파구**

### **프레임 효과의 구현**

`Frame.astro` 컴포넌트를 구현합니다.

### **CSS 속성 부여**

- Astro에는 그런 거 없음.
- 기존의 `{: .class }` 문법도 나쁘지 않았음.
- 그렇다면 Jekyll 환경에서 마이그레이션할 수 있도록 커스텀 플러그인 작성해서 해결할 것.
- 이외의 bootstrap에서 자주 사용했던 몇 개를 커스텀으로 정의했음.

```css
/* boorstrap에서 따온 예시 css */
```

### **모바일 삼성 브라우저 대응**

![]()
*문제 상황*

- 안드로이드 기기에서의 삼성 브라우저 어플은 OS 다크모드 여부에 따라 웹 CSS를 강제로 재조정합니다. 네이버 등 메이저 플랫폼도 완벽한 대응이 어려운 모양입니다.

이 테마도 예외는 아니었습니다. 태블릿 환경에서 검은 프레임 테두리가 회색으로 변색되는 문제가 발생했고

- `border`를 일절 쓰지 않고, `position: fixed`된 4개의 독립 `.frame-edge` 자식 요소에 `background-color: var(--color-frame)`를 칠했습니다. 이렇게 하면 브라우저 렌더러가 헤더 액션 블록(`.action-block`)과 동일한 배경 페인트 경로를 타므로 Force Dark에서도 완전한 블랙을 유지합니다.

삼성 브라우저 Force Dark를 뚫는 '4면 백그라운드 프레임'과 1px 서브픽셀 트릭
- **문제**: Chromium의 `DarkModeFilter`와 삼성 인터넷의 Force Dark는 네이티브 CSS `border`에 강제 명도/대비 보정을 걸어버립니다. 
- **돌파구**: 
  - 브라우저 줌 배율(110% 등) 시 레이어 간 반올림 오차로 1px 흰 틈새가 보이는 현상은 `.action-block`을 1px 겹치게 밀어 넣고(`calc(12px - 1px)`) 내부 `padding: 1px`로 상쇄해 시각적 크기는 보존하면서 틈새를 지웠습니다.

### **청크 기반 더 보기 버튼**

2. "더 보기" 클릭 → 렌더 전체 흐름
#	단계	위치	비동기?	DOM 변이
1	클릭 감지 (위임)	loader.ts:91-96	-	-
2	네트워크 fetch (캐시 히트 시 즉시)	chunk-repository.ts:7	O	-
3	DOMParser 파싱 (오프스크린)	dom.ts:18	-	-
4	replaceWith(cards[0]) — LoadMoreCard → 첫 새 카드로 교체	append.ts:51	-	O
5	distributeCards() — 나머지 카드 배치	append.ts:52	-	O + reflow 유발(offsetHeight)
6	다음 LoadMoreCard 삽입	append.ts:53-59	-	O
7	history.pushState()	loader.ts:35	-	-
8	animateNewCards() — fade-in 클래스 추가	animate.ts:5-14	애니메이션 완료 비동기	class 추가
9	initPostCardImages() — img.decode() + rAF×2	image-reveal.ts:29-57	O (decode)	class 'loaded'
10	마지막 청크면 load-more 숨김	loader.ts:40-43	-	O
사용자 체감 지연 주범

### **이 외 기타 등등**

- SSR 2열 Masonry & 모바일 Flat Flow 전환

## **Astro 잘 활용하기**

## **AI도 잘 활용하기**

### **가난한 자의 고민**

시도해본 것

- OpenCode
- Antigravity
- Codex
- Cursor
- Kiro
- Devin
- Loom

사용한 AI

|모델명|사용기|
|---|---|
|BigPickle||
|Hy3 Free||
|Nemotron 3 Ultra Free||
|Gemini 3.1 Flash Lite||
|Gemini 3.5 Flash||
|Gemini 3.6 Flash||
|Gemini 3.7 Flash||

올해 초 VSCode Copilot 학생 티어에서 Claude Sonnet 4.6을 무료로 사용할 수 있었던 것을 기억함. 3월에 제미나이만 사용 가능하도록 칼질, 6월에 토큰을 완전히 칼질.

### ****