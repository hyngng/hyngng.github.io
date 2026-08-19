# Theme Toggle (다크모드 / 라이트모드)

## 구현 방식
`<html>` 요소의 `class` 속성(`dark` 또는 `light`)을 설정하여 구현합니다. CSS 변수 기반 테마 전환이 아닌, `classList`를 통한 클래스 토글 방식이며, Tailwind의 `dark:` modifier나 CSS 변수 스코핑과 연동됩니다.

## 초기화 (`ThemeInit.astro`)
페이지 로드 시 FOUC를 방지하기 위해 `<head>` 내에서 인라인 스크립트가 실행됩니다.
1. `localStorage.getItem('theme')`으로 사용자 선택 확인
2. 저장된 값이 없으면 `window.matchMedia('(prefers-color-scheme: dark)')`로 OS 설정 확인
3. `<html>`에 `dark` 또는 `light` 클래스 적용

## 테마 토글 (`src/utils/theme.ts`)
`toggleTheme()` 함수가 다음을 수행합니다:
1. `document.documentElement`의 `dark`/`light` 클래스를 토글
2. `localStorage.setItem('theme', 'dark' | 'light')`로 사용자 선택을 persist
3. `themeChange` 커스텀 이벤트를 dispatch (Mermaid 테마 동기화, Giscus 등에서 수신)

## Frame 통합
`Frame.astro` 내부의 테마 토글 버튼(`id="theme-toggle"`) 클릭 시 `toggleTheme()`을 호출합니다.
- 테마별 색상 변수는 `themes/` 폴더 내 `light.css`와 `dark.css`로 분리하여 관리합니다.
- 테마 무관 상수(예: `--color-button-text: #ffffff` — Frame의 버튼 텍스트는 항상 흰색으로 고정)는 `src/styles/global.css`의 `:root`에 두어 중복 정의를 피합니다.
- 테마별 소프트 배경 토큰 `--color-bg-soft`(light: `#F1F1F1`, dark: `#2a2a2e`)를 테마 파일에 정의하며, 인라인 코드/코드 블럭(`--astro-code-background`)/테이블 헤드/아바타 placeholder/admonition(다크의 포스트 카드 포함) 배경이 이를 참조하여 반복 색상값을 제거합니다.
- 다크 모드 스타일은 `<html>` 요소의 `dark` 클래스 선택자를 통해 적용됩니다. (`html.dark .some-class` 형태)
