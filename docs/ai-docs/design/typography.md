# Typography Design System

## Principles
1. **Semantic Fallback**: 포스트 목록이나 검색 결과가 비어있을 때 표시되는 메시지는 본문 텍스트 규격과 동일한 위계를 가져야 합니다.
2. **Visual Consistency**: 이를 위해 `.post-preview-state` 클래스를 정의하고, 본문과 동일한 폰트 사이즈(20px), 라인 하이트(1.8)를 공유합니다.

## Image Captions

### 구현 계약

- Markdown 이미지 바로 다음에 `_캡션 텍스트_`를 배치합니다.
- 캡션 요소는 `figcaption`이 아니라 `<em>`을 사용합니다. 기존 게시글 작성 규칙에서 이미지 다음 줄의 기울임꼴 문법을 캡션으로 사용하고 있으며, 기존 콘텐츠와 Markdown 작성 경험의 호환성을 유지해야 하기 때문입니다.
- `rehype-image-wrapper.mjs`가 `<img>`를 `<span class="img-wrapper">`로 감싸므로 캡션은 이미지와 같은 `<p>`의 직접 자식 `<em>`이어야 합니다.
- 현재 캡션 선택자는 `article p:has(img) > em`입니다. 이미지가 포함된 문단의 직접 자식 `<em>`만 캡션으로 취급합니다.
- 이미지와 캡션 사이에 빈 줄을 넣어 캡션이 별도 `<p>`로 분리되면 위 선택자의 대상이 아닙니다. 따라서 이미지 다음 줄에 바로 `_캡션 텍스트_`를 작성합니다.
- 이미지 DOM 구조나 캡션 문법을 바꾸면 `src/styles/typography.css`의 선택자와 이 DOM 계약을 함께 갱신해야 합니다.
- 마크다운 표준 문법 `![alt](src)`를 입력한 후, 다음 줄에 `_캡션 텍스트_`를 배치합니다.
- CSS `:has()` 선택자와 자식 결합자(`>`)를 활용하여 별도 플러그인 없이 순수 CSS로 캡션 스타일을 적용합니다 (`article p:has(img) > em`).

## Image Shimmer Loading
- 모든 본문 이미지는 `<span class="img-wrapper">`로 래핑됨 (`rehype-image-wrapper.mjs`).
- Shimmer 로딩 애니메이션: `::after` 의사 요소에 그라디언트 애니메이션, `loaded` 클래스 추가 시 fade-out.
- 로딩 중: `aspect-ratio: 16 / 9`로 영역 확보 (CLS 방지).
- 로드 후: `.img-wrapper.loaded`에서 `aspect-ratio: auto` + `object-fit: contain`으로 원본 비율 표시.

## Table Styling
- `article thead th`에 `text-align: left` 적용. 브라우저 UA 기본값(`center`)을 덮어써 `td`와 정렬 일관성 확보.
- 마크다운 정렬 지정(`| :---: |`, `| ---: |`) 시 파서가 생성하는 인라인 스타일이 CSS보다 우선하여 정상 동작.

## Mermaid Diagrams
- Mermaid 다이어그램은 `article .mermaid`로 중앙 정렬됨.
- `line-height: normal` + `font-size: 16px`으로 `article`의 `line-height: 1.8` 상속 방지.
- `renderMermaid()`에서 `await document.fonts.ready`로 웹폰트 로드 완료 후 렌더링 보장 (BBox 계산 정확도).

## Utility Classes
- `.border`: Bootstrap 스타일 테두리 유틸리티. `var(--border-width)`, `var(--border-style)`, `var(--color-border)` 변수 사용.
- `.left`, `.right`: float 기반 이미지 배치.
- `.w-25`, `.w-50`, `.w-75`, `.w-100`: 너비 유틸리티.
- `.rounded-10`: 라운딩 유틸리티.
- `.shadow`: 박스 쉐도우 유틸리티.

## Admonitions

### 문법

```markdown
:::tip
내용
:::
```

타입: `tip`, `info`, `warning`, `danger`

### HTML 구조

```
.admonition (position: relative)
  ├── .admonition-icon (position: absolute) — Font Awesome 6 Solid ::before
  └── .admonition-body (본문 래퍼)
        └── 마크다운 콘텐츠 (p, ul, ol, blockquote, table, code 등)
```

### 레이아웃 철학: "틀만 바꾸고 내용물은 존중"

아이콘은 `position: absolute`로 레이아웃 흐름에서 분리하여 본문 콘텐츠에 어떤 영향도 주지 않습니다.

- **아이콘**: `left: 1rem; top: 1rem`에 절대 고정. `height: calc(1em * 1.8)`으로 `article`의 `line-height: 1.8`과 자동 동기화 (폰트 크기 변경 시 자동 적응).
- **본문**: `padding-left: 3rem`으로 아이콘 영역을 확보하고, 내부 마크다운 요소는 브라우저 기본값을 따름.
- **최소 오버라이드**: 첫/마지스트 자식 마진 제거(`margin-top/bottom: 0`)와 리스트 마진 축소(`0.5rem`)만 개입. 나머지(p, blockquote, table, code 등)는 기본 스타일 그대로.

### 아이콘 및 색상

- 타입별 아이콘: tip (lightbulb `\f0eb`), info (circle-info `\f05a`), warning (triangle-exclamation `\f071`), danger (circle-exclamation `\f06a`)
- 타입별 색상: `--color-admonition-{type}-icon` 변수 (light.css / dark.css)
- 배경: `--color-admonition-bg`

### 충돌 주의사항

- `.admonition-body blockquote`에서 `border-left`, `margin`, `padding` 리셋 (기존 `article blockquote` 스타일 충돌 방지)
