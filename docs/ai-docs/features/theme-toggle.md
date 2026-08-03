# Theme Toggle (다크모드 / 라이트모드)

## 구현 방식
`<html>` 요소의 `class` 속성(`dark` 또는 `light`)을 설정하여 구현합니다. CSS 변수 기반 테마 전환이 아닌, `classList`를 통한 클래스 토글 방식이며, Tailwind의 `dark:` modifier나 CSS 변수 스코핑과 연동됩니다.

## Head.astro와 Frame.astro의 이중 조작 통합

과거에는 두 컴포넌트가 독립적으로 `classList`를 조작하였으나, 현재는 테마 토글 로직이 `src/utils/theme.ts` 유틸리티로 통합되어 관리됩니다.

- **`src/utils/theme.ts`**: `toggleTheme()` 함수를 통해 테마 상태(`dark`/`light`)를 클래스에 적용하고 `localStorage`에 동기화하며 `themeChange` 이벤트를 발생시킵니다.
- **`Frame.astro`**: 이제 직접 DOM을 조작하지 않고 `toggleTheme()` 유틸리티를 임포트하여 사용합니다.
- **`Head.astro`**: 페이지 로드 시 FOUC 방지를 위해 초기화 스크립트는 유지하되, 향후에는 `theme.ts`에서 상태를 로드하는 방식으로 일원화할 예정입니다.

## Frame 통합
`Frame.astro` 내부의 테마 토글 버튼(`id="theme-toggle"`) 클릭 시 동작합니다.
- CSS 변수를 `themes/` 폴더 내 `light.css`와 `dark.css`로 분리하여 관리합니다.
- 다크 모드 스타일은 `<html>` 요소의 `dark` 클래스 선택자를 통해 적용됩니다. (`html.dark .some-class` 형태)
- `Head.astro`에서 스크립트를 통해 `localStorage`에 저장된 테마를 불러오거나 기본값(`light`)을 적용하여 다크 모드 고착화 문제를 방지합니다.
