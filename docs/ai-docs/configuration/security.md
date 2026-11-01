# 보안 헤더와 배포 제약

## 현재 배포 환경

이 사이트는 GitHub Pages의 정적 호스팅을 사용한다. GitHub Pages는 저장소 파일만으로 임의의 HTTP 응답 헤더를 설정하는 기능을 제공하지 않는다. 따라서 다음 헤더는 현재 적용되지 않는다.

- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `X-Frame-Options` / `frame-ancestors`
- `Referrer-Policy`
- `Permissions-Policy`

`public/_headers`나 `_config.yml`에 값을 추가해도 GitHub Pages가 이를 해석하지 않는다.

## 현재 적용한 범위

- **의존성 감사**: `.github/workflows/deploy.yml`에서 `npm audit --omit=dev --audit-level=high`를 빌드 전에 실행한다.
- **외부 스크립트 최소화**: Google Analytics/GTM/GoatCounter/AdSense는 `site.settings.ts`에서 설정한 경우에만 로드한다.
- **KaTeX self-host**: KaTeX CSS와 폰트를 CDN이 아닌 Vite 로컬 asset으로 제공한다.
- **폰트 self-host**: Pretendard와 Reddit Mono를 저장소에서 제공한다.
- **이미지 CDN**: 포스트 이미지는 `SITE.cdn.imageBaseUrl`(jsDelivr)에서 로드한다. 원본 이미지의 무결성 검증(SRI)은 이미지 URL 변환 특성상 적용하지 않는다.

## 호스팅 이전 시 권장 헤더

Cloudflare Pages, Netlify, Vercel 등 헤더 제어가 가능한 호스팅으로 이전할 때 다음을 검토한다. 실제 값은 분석 도구·Giscus·이미지 CDN·광고 설정에 따라 조정해야 한다.

```text
Content-Security-Policy: default-src 'self'; img-src 'self' data: https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://gc.zgo.at; frame-src https://www.youtube.com https://giscus.app; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://gc.zgo.at
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

`script-src`의 `'unsafe-inline'`은 Astro 인라인 테마 초기화와 JSON-LD 때문에 필요하다. nonce/hash 기반 CSP로 좁히려면 빌드 산출물의 인라인 스크립트를 모두 식별해야 하므로 별도 작업이 필요하다.

## 관련 파일

- `.github/workflows/deploy.yml`
- `src/pages/robots.txt.ts`
- `public/ads.txt`
- `src/components/Head.astro`
- `src/layouts/PostLayout.astro`
