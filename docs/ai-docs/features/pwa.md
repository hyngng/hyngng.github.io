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
- `workbox.globPatterns` — 빌드된 **불변 해시 자산**(JS, CSS, SVG, PNG, ICO, WOFF/WOFF2)만 프리캐시 대상. HTML은 프리캐시하지 않는다.
- `workbox.navigateFallback: null` — 정적 MPA에서 SPA 폴백 비활성화.
- `workbox.runtimeCaching` — 네비게이션(`request.mode === 'navigate'`) 요청을 `NetworkFirst`로 처리하는 런타임 라우트(`pages` 캐시, `networkTimeoutSeconds: 3`, 최대 100개·30일). 상세는 아래 [캐싱 전략](#캐싱-전략) 참조.

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
- `<link rel="manifest">`도 동일 조건으로 렌더링. 매니페스트는 빌드 타임에만 생성되므로 dev 모드에서 참조하면 `/manifest.webmanifest` 404와 함께 라우터가 동적 라우트(`[author]`, `[lang]`)를 탐색하는 WARN이 발생한다. PROD 전용 렌더링으로 이 경고를 원천 차단한다.

### 3. 매니페스트

`manifest.webmanifest`는 빌드 시 `astro.config.mjs`의 `manifest` 옵션에서 생성되어 `dist/`에 출력된다. `<head>`의 `<link rel="manifest" href="/manifest.webmanifest" />`가 이를 참조하며, 링크는 `Head.astro`에서 PROD 전용으로 조건부 렌더링된다 (dev 모드에서는 404 방지를 위해 미출력).

## 캐싱 전략

커스텀 서비스 워커 작성 대신 `vite-plugin-pwa`의 기본 `generateSW` 전략을 사용하되, **HTML은 프리캐시하지 않고 네트워크 우선(NetworkFirst)으로 서빙**한다.

- **불변 자산** (`js`, `css`, `svg`, `png`, `ico`, `woff/woff2`): 프리캐시(캐시 우선). 파일명에 해시가 포함되어 갱신 시 항상 최신 버전을 참조한다.
- **HTML**: `globPatterns`에서 제외하고 `runtimeCaching`의 `NetworkFirst` 라우트(`pages` 캐시)로 처리. 매 네비게이션마다 네트워크에서 최신 HTML을 가져오므로, 서비스 워커가 갱신되기 전에도 **강제 새로고침 없이 새 콘텐츠가 즉시 반영**된다. 오프라인에서는 마지막 방문 시점의 HTML 사본으로 폴백한다.

> 주의: HTML을 프리캐시에 유지한 채 `NetworkFirst` 라우트를 추가해도 소용없다. Workbox는 프리캐시 라우트를 먼저 등록하므로, 프리캐시에 HTML이 있으면 캐시 우선으로 먼저 응답해 런타임 라우트가 동작하지 않는다. 따라서 `globPatterns`에서 `html` 제외가 필수다.

### 배포 환경 한계

- GitHub Pages는 커스텀 `Cache-Control` 헤더를 지원하지 않으며(`_headers` 미지원), `sw.js`·HTML 모두 `max-age=600`으로 서빙된다(실측). 따라서 "sw.js 헤더 비활성화" 방식의 갱신 개선은 이 환경에서 불가능하다.
- 다만 기본 `updateViaCache: 'imports'`가 이미 **sw.js 본문의 업데이트 체크를 HTTP 캐시에서 우회**하므로(MDN), 헤더 캐싱이 sw.js 갱신을 막는 주범은 아니다. 실제 지연 요인은 브라우저의 24시간 업데이트 체크 스로틀로 헤더로 해결 불가다.
- `updateViaCache: 'none'`은 `registerOptions`를 지원하지 않는 `vite-plugin-pwa`(main 브랜치 포함 어떤 버전에도 없음)로 주입 불가하며, 설령 적용해도 해시된 `importScripts` 모듈의 HTTP 캐시만 우회하는 것이라 실익이 없다.

## 검증

`npm run build` 완료 시 `dist/` 아래에 다음 핵심 자산이 생성됨:

- `manifest.webmanifest` (manifest 옵션에서 생성)
- `sw.js` (Workbox 서비스 워커 생성)

`npm run build && npm run preview` 후 브라우저 devtools의 Application 탭에서 서비스 워커 등록, manifest 로드, 오프라인 모드 동작을 확인한다.
