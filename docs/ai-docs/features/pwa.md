# PWA (Progressive Web App) 지원

## 현재 상태

`@vite-pwa/astro` 패키지를 사용하여 PWA 기능을 통합함. 빌드 타임에 서비스 워커(`sw.js`)와 등록 스크립트(`registerSW.js`)가 동적 생성됨.

## 설정

### 1. `public/manifest.webmanifest` [정적 매니페스트 파일]

Astro 개발 서버(`npm run dev`)에서 가상 매니페스트 경로가 라우팅에 의해 차단되고 `404 (Not Found)` 오류를 유발하는 현상을 방지하기 위해, 매니페스트 파일을 `public/manifest.webmanifest`에 **정적 파일**로 고정 배치함.

내용:
```json
{
  "name": "HYNGNG",
  "short_name": "HYNGNG",
  "description": "반갑습니다 🔥",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F7F7F7",
  "theme_color": "#0a0a0a",
  "lang": "ko",
  "scope": "/",
  "icons": [
    {
      "src": "/assets/img/favicons/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/img/favicons/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2. `astro.config.mjs`

`AstroPWA` 통합 플러그인을 사용하여 서비스 워커 빌드 설정을 정의함:
- **`injectRegister`**: `null`로 구성하여 별도의 물리 등록 파일(`registerSW.js`)을 자동 생성하거나 주입하지 않고 개발자가 직접 핸들링하도록 설정함.
- **`workbox.globPatterns`**: 빌드된 정적 자산들을 자동으로 오프라인 캐싱하도록 지정.

### 3. `src/components/Head.astro`

Astro 개발 서버(`npm run dev`)에서 `/registerSW.js`나 `/sw.js`와 같은 가상 라우트에 대해 `404 (Not Found)` 오류가 지속적으로 던져지는 문제와, 개발 모드 중 스키마 및 콘텐츠 수정 시 서비스 워커 캐시로 인해 화면 갱신이 밀리는 Stale Cache 버그를 완벽히 해결하기 위해 **인라인 프로덕션 전용 등록** 방식을 도입함.

`<head>` 태그 내부에 매니페스트와 인라인 스크립트를 다음과 같이 정의함:
```html
<link rel="icon" type="image/svg+xml" href="/assets/img/favicons/favicon.svg" />
<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicons/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/assets/img/favicons/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/assets/img/favicons/apple-touch-icon.png" />
<link rel="manifest" href="/manifest.webmanifest" />
{import.meta.env.PROD && (
  <script is:inline>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' });
      });
    }
  </script>
)}
<meta name="theme-color" content="#0a0a0a" />
```
* **결과**: 개발 모드(`import.meta.env.PROD`가 `false`인 경우)에서는 스크립트 자체가 마운트되지 않아 불필요한 404 및 캐시 동기화 에러가 전혀 발생하지 않으며, 프로덕션 빌드 단계에서만 동작하여 네트워크 요청 횟수를 줄임과 동시에 PWA 규격을 완벽하게 충족시킵니다.

### 4. 캐싱 전략

커스텀 서비스 워커 작성 대신 `@vite-pwa/astro`의 기본 `generateSW` 및 `autoUpdate` 설정을 사용하여 정적 자산(HTML, CSS, JS, 이미지, 폰트 등)을 자동 캐싱함.

## 검증

`npm run build`를 완료하면 `dist/` 아래에 다음 핵심 자산이 생성 및 복사됨:
- `manifest.webmanifest` (정적 자산 복사)
- `sw.js` (Workbox 서비스 워커 생성)
