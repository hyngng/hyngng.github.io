# Theme Toggle (다크모드 / 라이트모드)

## 구현 방식
`<html>` 요소의 `class` 속성(`dark` 또는 `light`)을 설정하여 구현합니다. CSS 변수 기반 테마 전환이 아닌, `classList`를 통한 클래스 토글 방식이며, Tailwind의 `dark:` modifier나 CSS 변수 스코핑과 연동됩니다.

## 초기화 (`ThemeInit.astro`)
페이지 로드 시 FOUC를 방지하기 위해 `<head>` 내에서 인라인 스크립트가 실행됩니다.
1. `localStorage.getItem('theme')`으로 사용자 선택 확인 (저장소 접근이 차단되면 무시)
2. 저장된 값이 없으면 `window.matchMedia('(prefers-color-scheme: dark)')`로 OS 설정 확인
3. `<html>`에 `dark` 또는 `light` 클래스 적용

사생활 보호 모드나 저장소 차단 환경에서도 초기 테마가 깨지지 않도록 `getItem`을 `try/catch`로 감싼다.

## 테마 토글 (`src/utils/theme.ts`)
`toggleTheme()` 함수가 다음을 수행합니다:
1. `document.documentElement`의 `dark`/`light` 클래스를 토글
2. `localStorage.setItem('theme', 'dark' | 'light')`로 사용자 선택을 persist (`setItem` 실패는 무시하고 현재 세션의 클래스 상태 유지)
3. `themeChange` 커스텀 이벤트를 dispatch (Mermaid 테마 동기화, Giscus 등에서 수신)

## Frame 통합
`Frame.astro` 내부의 테마 토글 버튼(`id="theme-toggle"`) 클릭 시 `toggleTheme()`을 호출합니다.
- 테마별 색상 변수는 `themes/` 폴더 내 `light.css`와 `dark.css`로 분리하여 관리합니다.
- 테마 무관 상수(예: `--color-button-text: #ffffff` — Frame의 버튼 텍스트는 항상 흰색으로 고정)는 `src/styles/global.css`의 `:root`에 두어 중복 정의를 피합니다.
- 테마별 소프트 배경 토큰 `--color-bg-soft`(light: `#F1F1F1`, dark: `#2a2a2e`)를 테마 파일에 정의하며, 인라인 코드/코드 블럭(`--astro-code-background`)/테이블 헤드/아바타 placeholder/admonition(다크의 포스트 카드 포함) 배경이 이를 참조하여 반복 색상값을 제거합니다.
- 다크 모드 스타일은 `<html>` 요소의 `dark` 클래스 선택자를 통해 적용됩니다. (`html.dark .some-class` 형태)

## Samsung Internet 강제 다크 모드 (브라우저 레벨 색상 변환)

Samsung Internet은 브라우저 설정의 다크 모드가 켜지면 사이트의 선언(`color-scheme`, `prefers-color-scheme`)과 무관하게 **렌더링 직전에 모든 요소 색상을 요소 유형별 루미넌스 대역으로 강제 압축**한다. 필터는 렌더 단계에서 적용되므로 `getComputedStyle`은 원본 값을 반환하고, JS로 야간 모드 적용 여부를 감지할 수 없다.

| 요소 유형 | 매핑 대역 (루미넌스) |
|---|---|
| `html` 배경 | 0.03–0.08 |
| 모든 CSS 배경 | 0.03–0.12 |
| 테두리 | 0.27–0.33 |
| box-shadow | 0.28–0.33 |
| 텍스트 | 0.29–1.0 (역전) |

- 라이트 테마의 페이지 배경(`#F7F7F7`, 루미넌스 ≈0.97)과 포스트 카드 배경(`#EDEDED`, ≈0.85)은 같은 대역으로 스케일 다운되어 차이가 대역 폭(0.09) 비율로 압축 → 카드 경계가 사실상 소실된다. 이는 색상 지정 방식(`background` vs `background-color`)과 **무관**하며, Samsung 변환 결과에 맞춘 색 재지정은 다른 모든 브라우저의 라이트모드 디자인을 해친다.
- Chromium 계열 표준 옵트아웃(`<meta name="color-scheme" content="only light">`, Chrome 공식)은 Samsung Internet 기본 설정에서 무시된다(MDN browser-compat-data [#17408](https://github.com/mdn/browser-compat-data/issues/17408)/[#29347](https://github.com/mdn/browser-compat-data/issues/29347), 2022–2026 지속 보고). 설정(웹 페이지 보기 → 다크 모드 → "웹 콘텐츠 강제 다크 모드" 끄기)에서만 해제된다.
- 게다가 이 사이트는 자체 다크 테마를 제공하므로 `only light` 선언 자체가 부적합하다.

### 우회 시도와 롤백

Samsung 필터는 배경을 어두운 대역(0.03–0.12)으로 눌러 담지만 **테두리/box-shadow는 그보다 훨씬 밝은 대역(0.27–0.33)으로 매핑**한다. 이를 이용해 UA 스니핑(`SamsungBrowser` → `<html data-samsung>` 플래그)으로 `html[data-samsung]:not(.dark)` 카드에 `box-shadow: inset 0 0 0 1px var(--color-border)` 링을 부여하는 우회를 적용했으나, **롤백되었다**(2026-11 — 사용자 결정). 현재 코드베이스에 Samsung 대응 코드는 없으며, 위 메커니즘 분석만 남아 이후 재시도를 방지한다.

- 만약 재시도한다면: inset ring은 레이아웃 영향이 없고(border 대비 — 전역 border-box 리셋 부재), 필터가 box-shadow를 밝은 대역으로 매핑해 강제 다크에서만 경계가 살아난다는 점이 유효한 레버다. 야간 모드 on/off 감지가 불가하므로 Samsung 라이트 모드 사용자에게도 링이 함께 적용되는 한계는 그대로다.
