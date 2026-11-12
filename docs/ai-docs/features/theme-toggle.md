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

### 해결: Chirpy식 카드 그림자 경계 (2026-11)

먼저 UA 스니핑(`SamsungBrowser` → `<html data-samsung>` 플래그)으로 카드에 `box-shadow: inset 0 0 0 1px var(--color-border)` 링을 부여하는 우회를 시도했으나 라이트 렌더링에서 링이 눈에 띄어 **롤백**했다. 이후 Chirpy 테마의 카드 경계 구조를 차용해 최종 해결했다:

- Chirpy 테마 자체는 Samsung 대응 코드가 전혀 없다(라이트 모드에 `color-scheme` 선언조차 없음). 카드가 강제 다크에서 무사한 이유는 경계를 배경색 대비(페이지·카드 모두 흰색)가 아닌 `--card-shadow` 그림자로 표현하기 때문이다.
- Chirpy의 `--card-shadow`는 드롭 섀도 + **헤어라인 링 box-shadow**(`0 0 0 1px`)의 2겹 구조다. box-shadow는 Samsung 필터에서 배경(0.03–0.12)보다 훨씬 밝은 대역(0.28–0.33)으로 매핑되므로 강제 다크에서도 경계가 살아남는다. 브라우저 분기 없이 모든 환경에서 동작한다.
- Vignette 적용: 테마 파일에 `--color-card-shadow` 토큰을 신설하고(Chirpy 값 그대로 — 라이트 `rgb(104 104 104 / 5%) 0 2px 6px 0, rgb(211 209 209 / 15%) 0 0 0 1px`, 다크 `rgb(21 21 21 / 72%) 0 6px 18px 0, rgb(137 135 135 / 24%) 0 0 0 1px`), `global.css`에서 `.post-card` / `.load-more-card`에 `box-shadow: var(--color-card-shadow)`를 적용한다. 두 테마의 색상 시스템(페이지 배경 / 카드 배경 2색 구조)은 변경하지 않는다.
- 라이트 렌더링에서 링은 15% 알파라 카드 배경(#EDEDED) 위 합성 시 채널당 ±5 수준의 차이로 사실상 보이지 않는다(롤백된 불투명 `#dee2e6` 링보다 훨씬 미세). spread ring은 레이아웃에 영향이 없고 `border-radius`를 따라간다.
- 다크 모드에도 동일 구조를 적용한다(Chirpy 다크도 같은 구조). 사이트 자체 다크 테마가 Samsung 강제 다크로 렌더링될 때도 배경 대비는 같은 방식으로 압축되므로, 그림자 경계가 양쪽 모두에서 경계를 보존한다.
- 색상 차용: 다크 테마의 페이지 배경(`--color-bg`)과 카드 배경(`--color-post-card-bg`)은 Chirpy 다크 팔레트(`--main-bg: rgb(27 27 30)` = `#1b1b1e`, `--card-bg: #1e1e1e`) 값을 그대로 사용한다. 라이트 테마 색상은 변경하지 않는다. 카드가 더 이상 `--color-bg-soft`를 재사용하지 않으므로, 다크 모드에서 인라인 코드·표 헤드·어드모니션(`--color-bg-soft: #2a2a2e`)이 카드(#1e1e1e) 위에서 미묘한 대비를 갖는다(기존에는 카드와 동일 색이라 구분되지 않았음).
- 동일 메커니즘의 프레임 확장: 프레임 edge와 헤더 블록도 Chirpy `--card-shadow`의 드롭 레이어 값을 `--color-frame-shadow` 토큰으로 차용해 방향성 섀도를 적용했다. 강제 다크에서 검은 프레임과 콘텐츠 사이 경계가 밝은 섀도 밴드로 보존된다(헤어라인 링은 concave fillet과의 충돌로 제외). 상세는 `frame-layout.md`의 "Frame Edge Depth" 섹션 참조.
