# Button Component

## 다형성 (Polymorphism)
`Button.astro`는 `as` prop을 통해 자신이 렌더링될 HTML 태그를 결정할 수 있습니다.
- 기본적으로 `<button>`으로 렌더링됩니다.
- `href` prop이 전달되거나 `as="a"`로 지정되면 `<a>` 태그로 렌더링되어 네비게이션 역할을 수행합니다.

## Variants
`variant` prop을 통해 다양한 형태를 지원합니다:
- `title`: 헤더의 로고/타이틀용. 패딩(좌우 40px, 상하 18px), 굵은 텍스트.
- `icon`: 72px 정사각형/원형 뼈대의 아이콘 버튼 (예: RSS, 테마 전환).
- `text`: 아이콘 대신 짧은 텍스트가 들어가는 버튼 (예: 언어 선택 'KO').

## 스타일링
- 호버 시 엑센트 컬러(`var(--color-accent)`, `#CA4519`)로 배경이 부드럽게 전환됩니다.
- 아이콘 변형은 `--button-size` CSS 변수(72px)를 기준으로 설계됨.
- 타겟 크기 보장을 위해 최소 48x48px를 유지함.
- Frame의 lang-list 너비 계산 시 JavaScript에서 `getComputedStyle`으로 `--button-size` CSS 변수를 읽어 활용함.
