# Frame 컴포넌트

`Frame` 컴포넌트는 블로그의 고정 프레임 레이아웃과 **오목한 모서리(concave corner)** 디자인을 담당합니다.

## 파일 위치

- 컴포넌트: `src/components/Frame.astro`
- 스타일 변수: `src/styles/global.css` (`:root`의 `--frame-radius`, `--frame-thickness`, `--button-size`)
- 라운드 구현: `src/components/Frame.astro` 내부 `<style>` 태그

## 구조 개요

```
fixed-actions (position: fixed; z-index: 100)
├── left-action (.action-block)
│   ├── 제목 버튼 (Button, href="/")
│   ├── concave-right (오목한 우측 상단 모서리)
│   └── concave-bottom (오목한 좌측 하단 모서리)
└── right-actions (.action-block)
    ├── right-actions-inner (overflow: hidden, 너비: 버튼×3)
    │   ├── 테마 토글 버튼 (Button, icon)
    │   ├── RSS 버튼 (Button, icon, href=동적: 작가별 또는 언어별 RSS URL)
    │   ├── 언어 토글 버튼 (Button, text, id="lang-toggle")
    │   └── lang-list (가로 오버플로우, 다른 언어 목록)
    ├── concave-left (오목한 좌측 상단 모서리)
    └── concave-bottom (오목한 우측 하단 모서리)
```

## 오목한 모서리(Concave Corner) 구현

`Frame`은 CSS만으로 **안쪽으로 패인(inward) 모서리** 효과를 구현합니다. CSS 표준에 `border-radius`의 반대 개념(내부 오목)이 없으므로, **둥근 div(펀치)를 프레임 테두리 바깥으로 밀어내어 모서리를 덮는 방식**을 사용합니다.

### 핵심 CSS 클래스

| 클래스 | 역할 |
|---|---|
| `.fixed-actions` | 고정 프레임 컨테이너. `position: fixed`, `z-index: 100`, `pointer-events: none` |
| `.action-block` | 좌우 콘텐츠 블록. `position: absolute`, `background-color: var(--color-frame)`, `pointer-events: auto` |
| `.concave-right` | 좌측 버튼의 우측 상단 오목 모서리 |
| `.concave-left` | 우측 버튼의 좌측 상단 오목 모서리 |
| `.concave-bottom` | 하단 오목 모서리 (좌/우 각각 별도) |

### 작동 원리

4개의 concave corner 요소는 공통 기본 스타일과 그룹별 위치/그라디언트로 구조화됩니다:

```css
/* 공통 기본 */
.concave-right, .concave-bottom, .concave-left {
  position: absolute;
  width: var(--frame-radius);
  height: var(--frame-radius);
  pointer-events: none;
}

/* 좌측 버튼: 그라디언트가 우하단에서 확장 */
.left-action .concave-right,
.left-action .concave-bottom {
  background: radial-gradient(
    circle at 100% 100%,
    transparent var(--frame-radius),
    var(--color-frame) var(--frame-radius)
  );
}

/* 우측 버튼: 그라디언트가 좌하단에서 확장 */
.right-actions .concave-left,
.right-actions .concave-bottom {
  background: radial-gradient(
    circle at 0 100%,
    transparent var(--frame-radius),
    var(--color-frame) var(--frame-radius)
  );
}
```

- **원형 div**를 `var(--frame-radius)` 크기로 생성
- `radial-gradient`로 **테두리 색상(`var(--color-frame)`)이 프레임 안쪽을 향해 확장**되도록 설정
- 결과적으로 프레임 테두리의 모서리 부분이 **원형 div 아래 가려져** 오목해 보이는 착시 발생
- 좌/우 버튼은 gradient 확장 방향만 다르고, 나머지 속성은 동일

### `--frame-radius` 변수

```css
:root {
  --frame-radius: calc(var(--button-size) / 2); /* 36px */
}
```

- `--button-size`(72px)의 절반으로 정의됨
- `Frame`의 `border-radius`와 완전히 동일한 값
- `.fixed-actions`의 `height` 계산, `.concave-*`의 크기/위치에 모두 연동
- 모바일(`max-width: 960px`)에서 `0px`으로 오버라이드
- 변경 시 **전체 프레임 구조가 자동 조정**됨

## 언어 전환 버튼 (Language Toggle)

### HTML 구조

```astro
<Button variant="text" id="lang-toggle" data-i18n="frame.lang">
  {locale.frame.lang}
</Button>

<div class="lang-list" id="lang-list" aria-hidden="true"
  data-locale-codes={allLocaleShortCodes.join(",")}
  data-default-locale={defaultLocale}>
  {otherLocales.map((l) => (
    <button class="lang-item" data-lang={l.code}>{l.label}</button>
  ))}
</div>
```

- `data-locale-codes`: 전체 언어 코드 목록 (콤마 구분). JS에서 `Set`으로 변환하여 URL 파싱에 사용.
- `data-default-locale`: 기본 언어 코드 (`'ko'`). URL에서 언어 세그먼트 제거/추가 기준.

### 클릭 처리 로직

`Frame.astro`는 초기 문서 로드 시 `initFrame()`을 한 번 호출해 이벤트 리스너를 등록합니다. ViewTransitions/ClientRouter를 사용하지 않으므로 `astro:after-swap` 재초기화는 두지 않습니다.

#### 언어 변경 흐름

1. 사용자가 `.lang-item` 버튼 클릭
2. `langCode` (`item.dataset.lang`) 읽기
3. `getLocalizedPath()` 함수 호출:
   - `#lang-list`의 `data-locale-codes`에서 전체 언어 코드 `Set` 생성
   - `data-default-locale`에서 기본 언어 코드 읽기
   - 현재 URL 경로 파싱, 기존 언어 세그먼트 제거 후 새 언어 코드 삽입
4. 새 경로 구성 후 `window.location.href`로 리다이렉트

### 언어 코드 전달 방식

언어 코드는 `define:vars`나 전역 변수 대신 DOM 데이터 속성으로 전달됩니다:

- `#lang-list` 요소의 `data-locale-codes` 속성에 전체 언어 코드를 콤마 구분으로 저장
- `#lang-list` 요소의 `data-default-locale` 속성에 기본 언어 코드를 저장
- JS에서 `dataset`을 통해 읽어 `Set`으로 변환 후 사용

이 방식의 장점:
- 전역 `window.__*` 변수 불필요
- `define:vars`/`getClientLocales()` import 불필요
- 데이터가 DOM 요소에 직접 부착되어 디버깅 용이

### 연관된 설정 파일

| 파일 | 역할 |
|---|---|
| `src/locales/index.ts` | `availableLocales`, `getLocale()` 정의 |
| `src/settings/site.settings.ts` | `SITE.lang` (기본 언어) |
| `src/components/Frame.astro` | 현재 파일 |

## 데스크톱 레이아웃

데스크톱에서 `.action-block`은 `position: absolute`로 양쪽 끝에 배치됩니다:

- `.left-action { left: var(--frame-thickness) }` — 좌측 프레임 안쪽
- `.right-actions { right: var(--frame-thickness) }` — 우측 프레임 안쪽

`.right-actions-inner`는 `display: flex; overflow: hidden; width: calc(var(--button-size) * 3)`으로, 닫힌 상태에서 3개의 고정 버튼(테마, RSS, 언어 토글)만 표시합니다.

## 모바일 레이아웃 (`max-width: 960px`)

모바일에서 `.fixed-actions`는 프레임 두께가 `0px`이므로 헤더 바 역할을 합니다:

```css
.fixed-actions {
  background-color: var(--color-frame);
  height: var(--header-height);
  pointer-events: auto;
  max-width: 100vw;  /* 문서가 넓어져도 헤더는 뷰포트 내에 고정 */
}
```

- `.left-action`과 `.right-actions`는 모두 `position: absolute`로 유지
- `max-width: 100vw`가 뷰포트 밖으로의 확장을 방지 (가로 스크롤 발생 시 문서 너비가 늘어나지만, 헤더는 보이는 화면에 고정)

### 언어 목록 열기/닫기 동작

언어 토글을 누르면 `.right-actions-inner`가 확장됩니다. 핵심 메커니즘:

1. `.right-actions`는 `position: absolute; right: 0`에 고정
2. `.right-actions-inner`의 너비가 늘어나면, 오른쪽은 막혀 있으므로 **왼쪽으로 확장**
3. 데스크톱: 언어 토글이 왼쪽으로 밀리고, 언어 아이템이 오른쪽에 펼쳐짐
4. 모바일: `width: calc(100vw + var(--button-size) * 2)`로 확장하여, 처음 두 버튼(테마, RSS)이 뷰포트 밖으로 밀려나고 언어 토글이 뷰포트 좌측 끝에 위치

```css
/* 모바일 */
.right-actions-inner.lang-open {
  width: calc(100vw + var(--button-size) * 2);
}
.lang-list {
  max-width: calc(100vw - var(--button-size));
  touch-action: pan-x;
}
```

### 모바일 언어 목록 스크롤

`.lang-list`의 내용이 표시 영역보다 길 때, `overflow-x: auto`와 `max-width`로 가로 스크롤이 가능합니다:

- `max-width: calc(100vw - var(--button-size))` — 남은 화면 폭으로 제한
- `scrollbar-width: none` + `::-webkit-scrollbar { display: none }` — 스크롤바 숨김
- `touch-action: pan-x` — 모바일 터치 드래그가 스크롤로 우선 처리

## 테마 토글

테마 토글 버튼(`#theme-toggle`) 클릭 시 `src/utils/theme.ts`의 `toggleTheme()`을 호출합니다:

- `dark`/`light` 클래스를 `<html>`에 토글
- `localStorage`에 테마 저장
- `themeChange` 커스텀 이벤트 디스패치 (외부 리스너가 반응)
