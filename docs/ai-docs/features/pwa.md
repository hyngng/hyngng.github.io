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

### 카드 이미지 깜빡임 — 수정 시도 후 전면 롤백 (2026-11)

증상: 모바일(Samsung Internet)·PC 공통으로 새로고침할 때마다 카드 이미지가 lqip→본 이미지로 전환되며 짧게 깜빡임. 단, **네트워크를 차단해도 이미지가 렌더링됨** = CacheFirst 캐시는 정상 동작 중이며 재다운로드가 아님.

진단 사실 (롤백 후에도 유효한 지식):

- SW 캐시는 정상: 배포 사이트 실측에서 카드 썸네일 ~22ms·아바타 14~28ms, `transferSize: 0` (캐시 히트).
- 카드 이미지 reveal 애니메이션(`html[data-js]` 하 img `opacity: 0` → `image-init.ts`의 decode→2×rAF→`.loaded` → img/lqip 0.35s 크로스페이드)와 lqip 즉시 노출이 깜빡임의 유력 후보였으나, reveal 제거·lqip 250ms 지연 표시 등 일련의 수정 후에도 실기기에서 깜빡임 지속.
- Samsung Internet 다크 모드의 "이미지 어둡게" 설정이 켜져 있으면 이미지 로드 완료 시점마다 브라우저 레벨의 밝기 변화가 발생할 수 있다 — 사이트 코드로 제어 불가, 설정 확인 필요.
- dev 서버(`npm run dev`)는 PWA가 비활성(`import.meta.env.PROD` 가드)이므로 dev에서의 깜빡임은 캐시 부재+재검증으로 원래 존재 — 검증은 `npm run preview` 또는 배포 사이트로.

사용자 지시에 따라 **깜빡임 관련 수정 코드를 전면 롤백**해 원래 구조로 복원했다:

- 복원: `PostCard.astro`(img `loading="lazy"` + `decoding="async"` + `initPostCardImages` script 블록), `image-init.ts` 파일, `loader.ts`/`controller.ts` 호출부, `append.ts`의 `.loaded` 핵, `global.css`의 reveal 규칙(img `opacity: 0`/`.loaded`/`:has(img.loaded)::before`/`transition`/reduced-motion) — 모두 커밋 `66a35955` 시점 상태.
- 재시도한다면: 원인은 캐시가 아닌 렌더링 타이밍 쪽이므로, Samsung 기기에서 lqip 노출 시간·"이미지 어둡게" 설정·SW 콜드 스타트를 먼저 실측하는 방향.

### 아바타 깜빡임 — blur-up 적용 후 전면 롤백 (2026-11)

증상 재특정: 사용자가 보는 "이미지 깜빡임"의 주체는 **아바타**(카드 persona 아바타, 히어로 'n개 페르소나 보기' 옆 스택)였다. 카드 썸네일이 아니었다 — 그동안의 lqip 크로스페이드 수정들이 실패한 이유.

진단 사실 (롤백 후에도 유효한 지식):

- 아바타는 placeholder 이미지 없이 단색 배경(`--persona-avatar-placeholder`) + `loading="lazy"` + `decoding="async"`.
- SW 웜 캐시 히트는 0~47ms이지만 **콜드 스타트 시 ~210ms** 실측. Samsung 모바일은 SW를 공격적으로 suspend하므로 새로고침마다 콜드일 확률이 높다.
- 구조: 새로고침 → 첫 paint에 **단색 placeholder 원** → (layout 이후 lazy fetch → SW 라운드트립) → 이미지 도착 → 팝. eager여도 요청이 HTML 파싱 후에 시작되므로 race를 이긴다고 보장할 수 없다 (히어로 스택은 이미 eager인데도 증상 존재).

적용했던 해결(Medium/Next.js `blurDataURL`/Hugo와 동일한 blur-up + 인라인 data URI LQIP) — **사용자 지시로 전면 롤백**:

- 삭제: `scripts/build-avatar-lqip.mjs`(아바타 20×20 webp data URI 생성 → `src/generated/avatar-lqip.json`), `src/utils/avatar-swap.ts`(same-element src 교체 + blur 해제), `package.json`의 `avatar-lqip` 스크립트 연결, `Avatars.astro`의 lqip 렌더링·`.blur` CSS·init script, `loader.ts`/`controller.ts`의 `initAvatarSwap()` 호출.
- `Avatars.astro` 등 모두 커밋 `b056f629` 시점 상태로 복원 (직접 src + `onerror="this.remove()"`).
- 재시도한다면: 위 진단 사실과 `git log`의 blur-up 커밋(`826b3973`) 참조. race를 구조적으로 제거하는 유일한 방법은 첫 paint에 이미지가 그려지는 것(인라인 placeholder)이다.

### 본문 이미지 shimmer — 수정 시도 후 롤백 (2026-11)

사용자 관찰("새로고침 시 본문 이미지의 shimmer 재생")에 대해 `image-reveal.ts`의 complete 경로(`img.complete`)에서 decode→2×rAF를 생략하고 즉시 `.loaded`를 부여해 캐시 히트 시 shimmer 미재생으로 만드는 수정을 적용했으나, **사용자 지시로 롤백** — complete 경로는 원래 동작(decode→2×rAF→`.loaded`)으로 복원. shimmer는 현행 유지: `img.complete` 여부와 무관하게 decode·rAF를 거친 뒤 페이드인.

### 카드 썸네일 lqip (현행 유지)

카드 썸네일은 2-layer lqip 크로스페이드(흐릿→선명)를 유지한다. 사용자 관찰상 썸네일은 깜빡임 대상이 아니었고, 흐릿→선명 전환은 의도된 placeholder 동작으로 보인다. Chirpy식 same-element 교체로 바꾸려면 `PostCard.astro`/`LoadMoreCard.astro` + `image-init.ts`를 avatar-swap 방식으로 교체하면 된다(미적용).

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
