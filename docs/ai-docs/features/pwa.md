# PWA (Progressive Web App) 지원

## 현재 상태

커스텀 Astro 통합인 `astro-pwa`(`src/integrations/astro-pwa.ts`)가 `vite-plugin-pwa` 기반으로 서비스 워커(`sw.js`)와 매니페스트(`manifest.webmanifest`)를 빌드 타임에 생성함. `vite-plugin-pwa`는 `devDependencies`로 직접 관리함.

## 왜 `@vite-pwa/astro`를 사용하지 않는가

`@vite-pwa/astro`는 공식 Astro 통합이지만 **Astro 5까지만 지원**한다.

- 최신 `@vite-pwa/astro@1.2.0`(2025-11-27 배포)의 `peerDependencies.astro` 범위: `^1.6.0 || ^2.0.0 || ^3.0.0 || ^4.0.0 || ^5.0.0`
- 이 프로젝트는 **Astro 7.x** 사용 중 → peer 의존성 충돌 및 Astro 7 빌드 파이프라인(client environment 기반)과의 호환성 미보장.

이에 따라 공식 통합의 핵심 동작을 로컬에 벤더링(`src/integrations/astro-pwa.ts`)했다.

- **동작 원리**: Astro의 vite 빌드는 SSR 컨텍스트로 실행되어 `vite-plugin-pwa`의 `closeBundle` 훅이 서비스 워커 생성을 건너뛴다. 따라서 `astro:config:setup`에서 VitePWA 플러그인을 클라이언트 빌드에 등록하고, `astro:build:done`에서 `api.generateSW()`를 직접 호출한다.
- **URL 재작성**: Astro의 `trailingSlash`/`build.format`(directory format)에 맞춰 프리캐시 항목의 HTML URL을 재작성하는 `createManifestTransform` 포함.
- **제거된 기능**: 사용하지 않는 pwa-assets 아이콘 파이프라인(`injectManifestIcons`, `pwaAssets`)과 `experimental.directoryAndTrailingSlashHandler`. 아이콘은 `public/assets/img/favicons/` 정적 파일을 사용한다.
- `navigateFallback: null` 기본값 등 `vite-plugin-pwa` 옵션 체계는 그대로 사용한다.

## 설정

### 1. `astro.config.mjs`

`astroPwa({...})` 통합으로 서비스 워커 빌드 설정을 정의함 (`SITE.pwa.enabled`일 때만 활성화):

- `registerType: 'autoUpdate'` — 사용자에게 업데이트 프롬프트 없이 자동 갱신.
- `injectRegister: null` — 물리 등록 파일(`registerSW.js`)을 자동 주입하지 않고 `Head.astro`에서 직접 핸들링.
- `manifest` — `SITE.title`/`SITE.description` 기반 매니페스트 정의. 빌드 시 `manifest.webmanifest`로 생성된다.
- `workbox.cacheId` — 빌드 시각 스탬프 캐시 접두사(`pwaCachePrefix`, 아래 [캐시 스탬핑](#캐시-스탬핑) 참조). generateSW가 이를 `setCacheNameDetails({prefix})`로 직렬화하여 precache 캐시명이 `hyngng-<스탬프>-precache-v2-*`가 된다.
- `workbox.globPatterns` — 빌드된 **불변 해시 자산**(JS, CSS, SVG, PNG, ICO, WOFF/WOFF2), **청크 HTML 조각**(`**/chunk/**/index.html`), **홈 페이지**(`index.html` + 각 로케일 세그먼트의 `index.html`, `supportedLocales × segmentMap`에서 파생)이 프리캐시 대상. 홈 외 일반 페이지 HTML은 프리캐시하지 않는다.
- `workbox.navigateFallback: null` — 정적 MPA에서 SPA 폴백 비활성화.
- `workbox.runtimeCaching` — 네비게이션(`request.mode === 'navigate'`)은 `CacheFirst`(`-pages` 캐시, 최대 100개), 이미지(`request.destination === 'image'`)는 `CacheFirst`(`-images` 캐시, 최대 300개·30일). 상세는 아래 [캐싱 전략](#캐싱-전략) 참조.

### 2. `src/components/Head.astro`

`virtual:pwa-register` 모듈로 `registerSW({ immediate: true })`를 호출한다.

```html
{import.meta.env.PROD && SITE.pwa.enabled && (
  <script>
    import { registerSW } from 'virtual:pwa-register';
    registerSW({ immediate: true });
  </script>
)}

{import.meta.env.PROD && SITE.pwa.enabled && (
  <link rel="manifest" href="/manifest.webmanifest" />
)}
```

- 프로덕션(`import.meta.env.PROD`)이고 `SITE.pwa.enabled`일 때만 스크립트가 번들에 포함 → 개발 모드에서 불필요한 `/sw.js` 요청과 캐시 동기화 문제를 원천 차단.
- `<link rel="manifest">`도 동일 조건으로 렌더링. 매니페스트는 빌드 타임에만 생성되므로 dev 모드에서 참조하면 `/manifest.webmanifest` 404와 함께 라우터가 동적 라우트(`[persona]`, `[lang]`)를 탐색하는 WARN이 발생한다. PROD 전용 렌더링으로 이 경고를 원천 차단한다.

### 3. 매니페스트

`manifest.webmanifest`는 빌드 시 `astro.config.mjs`의 `manifest` 옵션에서 생성되어 `dist/`에 출력된다. `<head>`의 `<link rel="manifest" href="/manifest.webmanifest" />`가 이를 참조하며, 링크는 `Head.astro`에서 PROD 전용으로 조건부 렌더링된다 (dev 모드에서는 404 방지를 위해 미출력).

## 캐싱 전략

Chirpy(Jekyll 테마)의 캐시 모델을 모방한다: **전부 Cache-First + 빌드 스탬프 캐시명**. 신선도는 네트워크 재검증이 아니라 캐시 네임스페이스 교체로 보장한다.

- **불변 자산** (`js`, `css`, `svg`, `png`, `ico`, `woff/woff2`): 프리캐시(캐시 우선). 파일명에 해시가 포함되어 갱신 시 항상 최신 버전을 참조한다.
- **청크 HTML 조각** (`**/chunk/**/index.html`): 프리캐시(캐시 우선). 점진적 포스트 목록 로딩 시 `fetch()`로 가져오는 정적 조각이므로, Workbox 프리캐시에 포함하여 오프라인에서도 다음 청크 로딩이 중단 없이 동작한다.
- **홈 페이지** (`index.html` + 각 로케일 홈): 프리캐시(캐시 우선). 오프라인 진입점(`start_url`)이 항상 열리도록 보장한다.
- **일반 HTML** (페르소나/포스트 페이지): `CacheFirst` 런타임 라우트(`-pages` 캐시, `cacheableResponse: [0, 200]`). 재방문 시 네트워크 없이 즉시 표시되며 오프라인에서도 열린다. 미방문 페이지는 캐시에 없으므로 오프라인에서 실패한다 — Chirpy와 동일한 수준의 한계다.
- **이미지** (`request.destination === 'image'`): `CacheFirst` 런타임 라우트(`-images` 캐시, `cacheableResponse: [0, 200]`, 최대 300개·30일). jsDelivr CDN 이미지(`max-age=604800` + CORS `*`)는 opaque 응답으로 저장되어 새로고침마다 재다운로드되지 않는다.

### 카드 이미지 깜빡임 — reveal 애니메이션 제거 (2026-11)

증상: 모바일(Samsung Internet)·PC 공통으로 새로고침할 때마다 카드 이미지가 lqip→본 이미지로 전환되며 깜빡임. 단, **네트워크를 차단해도 이미지가 렌더링됨** = CacheFirst 캐시는 정상 동작 중이며 재다운로드가 아니다.

원인: 캐시가 아니라 **카드 이미지 reveal 애니메이션이 매 새로고침마다 재생**되는 것. `html[data-js] .post-card-image img { opacity: 0 }`이 캐시 여부와 무관하게 모든 img를 숨기고, `image-init.ts`(→`image-reveal.ts`)가 load→`img.decode()`→2×rAF→`.loaded` 부여 후 img 0→1 + lqip 1→0을 **0.35초 크로스페이드**했다. SW 캐시 히트가 수십 ms로 끝나도 사용자는 매번 lqip + 약 400~500ms의 페이드를 보게 된다 (PC·모바일 동일).

시행착오(롤백됨): 1차로 카드 썸네일 `loading="lazy"`를 제거했으나 깜빡임 해소에 불충분(지배적 원인은 페이드) → lazy를 원복. lazy 자체는 유효(뷰포트 밖 썸네일 대역폭 절약).

해결 (제거 우선 원칙 — 전부 제거, 추가 코드 0건):

- `src/features/post-list/image-init.ts` 파일 삭제 + 호출부 3곳 제거 (`PostCard.astro` script 블록, `loader.ts`, `controller.ts`)
- `append.ts`의 첫 카드 img에 `.loaded`를 즉시 부여하던 핵 제거
- `global.css`: `html[data-js] .post-card-image img { opacity: 0 }`, `img.loaded { opacity: 1 }`, `:has(img.loaded)::before { opacity: 0 }` 및 카드 img의 `transition: opacity` 제거

결과 동작: 캐시 히트(새로고침) 시 이미지가 디코드 완료 즉시 1프레임에 페인트 — lqip는 img(`z-index: 1`)가 덮으며 자연 소멸, 깜빡임 소멸. 느린 네트워크 첫 방문에서는 lqip → 다운로드 완료 시점 하드컷(X 등 SNS·대부분 블로그 방식).

범위: `image-reveal.ts` 자체는 포스트 본문 shimmer용으로 유지 (본문 이미지는 페이지 진입이라 shimmer가 자연스럽다). 후속으로 플래시가 남으면 lqip 크로스페이드만 별도 검토.

### 캐시 스탬핑 (Chirpy의 `chirpy-{timestamp}` 모방)

Cache-First는 캐시가 절대 stale이면 안 된다는 전제로 성립한다. 이를 보장하는 장치가 **빌드 스탬프 캐시명**이다:

- `src/utils/pwa-cache.ts`가 모듈 로드 시점(= 빌드 프로세스당 1회)의 `Date.now()`를 계산해 `pwaCachePrefix = hyngng-<스탬프>`를 export한다. `astro.config.mjs`(캐시명 생성)와 `astro-pwa.ts`(구캐시 정리)가 같은 모듈 인스턴스를 공유하므로 양쪽이 항상 같은 스탬프를 쓴다.
- 배포마다 precache는 `hyngng-<스탬프>-precache-v2-*`, 런타임 캐시는 `hyngng-<스탬프>-pages` / `hyngng-<스탬프>-images`로 새로 생성된다. 새 서비스 워커는 절대 이전 빌드의 캐시를 읽지 않으므로 stale 불가능.

### 구캐시 정리 (activate cleanup)

Workbox의 `cleanupOutdatedCaches()`는 캐시명에 `-precache-`를 포함한 캐시만 정리한다 — 스탬프된 런타임 캐시(`-pages`, `-images`)는 정리 대상이 아니므로 배포마다 누적된다. 이에 Chirpy의 activate 핸들러(현재 캐시가 아닌 모든 캐시 삭제)를 모방한 스니펫을 `astro-pwa.ts`가 `api.generateSW()` 직후 `dist/sw.js`에 append한다:

- activate 시 `hyngng-` 접두사로 시작하되 현재 스탬프(`-<스탬프>-`)를 포함하지 않는 모든 캐시를 삭제한다.
- 스탬핑 도입 이전의 구형 런타임 캐시(`pages`)도 한 번 삭제되어 마이그레이션된다.

> 이전 계약("일반 HTML 프리캐시 금지 + NetworkFirst로 신선도 확보")은 폐기됐다. Workbox는 프리캐시 라우트를 먼저 등록하므로 프리캐시된 HTML은 런타임 라우트보다 우선한다 — 이제 이 동작이 의도된 설계이며, 신선도는 스탬프 캐시명 교체로 확보한다.

### 배포 환경 한계

- GitHub Pages는 커스텀 `Cache-Control` 헤더를 지원하지 않으며(`_headers` 미지원), `sw.js`·HTML 모두 `max-age=600`으로 서빙된다(실측). 따라서 "sw.js 헤더 비활성화" 방식의 갱신 개선은 이 환경에서 불가능하다.
- 다만 기본 `updateViaCache: 'imports'`가 이미 **sw.js 본문의 업데이트 체크를 HTTP 캐시에서 우회**하므로(MDN), 헤더 캐싱이 sw.js 갱신을 막는 주범은 아니다. 실제 지연 요인은 브라우저의 24시간 업데이트 체크 스로틀로 헤더로 해결 불가다.
- `updateViaCache: 'none'`은 `registerOptions`를 지원하지 않는 `vite-plugin-pwa`(main 브랜치 포함 어떤 버전에도 없음)로 주입 불가하며, 설령 적용해도 해시된 `importScripts` 모듈의 HTTP 캐시만 우회하는 것이라 실익이 없다.
- GitHub Pages의 `max-age=600` HTML 캐시 때문에 배포 직후 짧은 시간 동안 이전 sw.js가 로드될 수 있으나, `autoUpdate`로 다음 방문 시 갱신되며 그동안 이전 스탬프 캐시가 정상 동작한다.

## 검증

`npm run build` 완료 시 `dist/` 아래에 다음 핵심 자산이 생성됨:

- `manifest.webmanifest` (manifest 옵션에서 생성)
- `sw.js` (Workbox 서비스 워커 생성)

`npm run build && npm run preview` 후 브라우저 devtools의 Application 탭에서 서비스 워커 등록, manifest 로드, 오프라인 모드 동작을 확인한다.
