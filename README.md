# HYNGNG Blog Theme

Astro 7 기반의 개인 블로그 테마입니다.

## 요구사항

- **Node.js** >= 22.12.0
- **npm** (Node.js에 포함됨)

## 시작하기

```sh
npm install
npm run dev
```

개발 서버가 `http://localhost:4321`에서 시작됩니다.

## 명령어

| 명령어 | 설명 |
| :--- | :--- |
| `npm install` | 의존성 설치 |
| `npm run dev` | 로컬 개발 서버 시작 (`localhost:4321`) |
| `npm run fonts` | 사이트에서 쓰는 글자만 남긴 Pretendard 서브셋 재생성 |
| `npm run avatar-lqip` | 페르소나 아바타의 초소형 인라인 placeholder(webp data URI) 재생성 (`predev`/`prebuild`에서 자동 실행) |
| `npm run build` | 프로덕션 빌드 (`./dist/`) |
| `npm run preview` | 빌드 결과 로컬 미리보기 |
| `npm run check` | 타입 검사 (`astro check`) |
| `npm run test` | 단위 테스트 실행 (vitest) |

## 의존성

### 런타임 의존성 (`dependencies`)

| 패키지 | 용도 |
| :--- | :--- |
| `astro` | 정적 사이트 생성 프레임워크 |
| `@astrojs/mdx` / `@astrojs/markdown-remark` | MDX·Markdown 처리 |
| `@astrojs/rss` | RSS 피드 생성 |
| `js-yaml` | 프론트매터 YAML 파싱 (`gray-matter` 대체) |
| `remark-math` + `rehype-katex` + `katex` | 수학 수식 렌더링 및 self-host CSS |
| `mermaid` | 다이어그램 렌더링 (뷰포트 진입 시 동적 import) |
| `remark-deflist` | 정의 목록(`<dl>`) 지원 |
| `remark-gfm` | GFM 표·각주·task list·autolink (단일 `~` 취소선은 비활성) |
| `remark-directive` / `mdast-util-*` / `micromark-extension-*` | directive·표·수식 AST 확장 |
| `rehype-raw` / `unist-util-visit` | raw HTML 복원 및 AST 순회 |
| `qrcode` | 포스트 하단 QR 코드 |

### 외부 리소스

코드와 폰트는 런타임 CDN에 의존하지 않습니다.

| 리소스 | 위치 | 용도 |
| :--- | :--- | :--- |
| Pretendard 1.3.9 | self-host (`public/fonts/Pretendard/`) | 400/700 사이트 전용 서브셋 |
| Reddit Mono | self-host (`public/fonts/Reddit_Mono/`) | 코드 블록용 WOFF2 variable font |
| KaTeX 0.19 CSS·폰트 | Vite 로컬 asset (`katex/dist/katex.min.css?url`) | 수식 있는 포스트만 로드 |
| Mermaid 12 | 로컬 npm 번들 | 다이어그램 (IntersectionObserver 지연 렌더) |
| 포스트 이미지 | jsDelivr CDN (`SITE.cdn.imageBaseUrl`) | `src/plugins`/`src/utils/cdn.ts`에서 URL 변환 |

> `Head.astro`의 preconnect는 이미지 CDN과 분석 도구용입니다. 폰트·KaTeX·Mermaid는 빌드 산출물 또는 로컬 번들에서 제공됩니다.

## 커스터마이징

### 사이트 정보

`src/settings/site.settings.ts`에서 사이트 제목, 설명, URL, 소셜 링크 등을 수정합니다.

지원 언어는 포스트 프론트매터의 `lang` 값에서 빌드 시점에 **자동 파생**되므로 중앙 목록 편집이 필요 없습니다(자세한 규칙은 `docs/ai-docs/configuration/locales.md` 참고). `src/settings/site.settings.ts`의 `LOCALE_REGISTRY`는 알려진 언어의 SEO 메타 보강용이며, `defaultLocale`(`ko`)은 항상 포함됩니다.

SNS/공유 메타데이터:

- **`ogImage`** — 기본 OG 이미지(`public/default-og.webp`, 1200x630). 포스트에 별도 이미지가 없을 때 `og:image`/`twitter:image`로 사용됩니다.
- **`social.fediverse`** — Fediverse 핸들(`@user@domain`). `fediverse:creator` meta로 출력됩니다. 포스트는 페르소나별 `social.fediverse`를 우선하고, 없으면 이 값으로 폴백합니다.
- **`resourceHints`** — 외부 CDN(jsdelivr/googletagmanager) preconnect 목록. `Head.astro`에서 `<link rel="preconnect">`로 조건부 출력됩니다.
- `twitter:card`는 기본값 `summary_large_image`로 출력됩니다.

### 웹 분석 (Analytics)

`site.settings.ts`의 `analytics` 객체에서 분석 도구를 설정합니다:

```ts
analytics: {
  google: { id: undefined },              // 'G-XXXXXXX' (Google Analytics 4)
  googleTagManager: { id: 'GTM-XXXXXXX' }, // Google Tag Manager
  goatcounter: { id: undefined },         // 'your-code' (GoatCounter)
  adsense: { client: 'ca-pub-...', adSlot: '...' }, // Google AdSense
},
```

- **Google Analytics**: `google.id` 설정 시 `<head>`에 gtag.js가 자동 삽입됩니다.
- **Google Tag Manager**: `googleTagManager.id` 설정 시 `<head>`에 GTM 컨테이너 스크립트가 자동 삽입됩니다.
- **GoatCounter**: `goatcounter.id` 설정 시 `<head>`에 트래킹 스크립트가 자동 삽입됩니다.
- **AdSense**: `adsense.client`/`adsense.adSlot` 사용. `src/components/seo/analytics/Adsense.astro` 컴포넌트로 포스트 레이아웃(`PostLayout.astro`) 본문 상단에 연결되어 있으며, 포스트 프론트매터의 `start_with_ads: true` 설정 시 조건부 노출됩니다. AdSense 승인에는 `/ads.txt`가 필요하며 `public/ads.txt`에서 관리됩니다 (클라이언트 ID 변경 시 함께 수정).

각 도구는 `src/components/seo/analytics/` 아래에 컴포넌트로 분리되어 있으며, 값이 `undefined`면 로드되지 않습니다. 또한 분석 스크립트는 **프로덕션 빌드(`astro build`)에서만** 로드됩니다. (`import.meta.env.PROD` 게이트 — dev 서버에서 로드되지 않아 개발 중 콘솔 에러와 분석 트래픽 오염을 방지)

### 웹마스터 도구 검증 (Webmaster Verification)

`site.settings.ts`의 `verification` 객체에서 검색 엔진 검증 토큰을 설정합니다:

```ts
verification: {
  google: undefined,   // Google Search Console
  yandex: undefined,   // Yandex Webmaster
  baidu: undefined,    // Baidu Webmaster
  pinterest: '...',    // Pinterest
},
```

값이 설정되면 `src/components/seo/webmasters_verifications/WebmasterVerifications.astro`가 해당 `<meta name="...-site-verification">`를 `<head>`에 조건부 출력합니다.

> Bing은 Google Search Console과 연동되는 구조라 별도 검증 설정이 필요 없으며, Daum은 별도로 처리되어 검증 대상에서 제외됩니다.

### 페르소나 설정

`src/settings/personas.settings.ts`에서 페르소나 정보를 추가하거나 수정합니다. 포스트 프론트매터의 `personas` 필드와 연결됩니다. 검색·라우팅·화면 표시는 페르소나를 기준으로 하며, SEO 메타데이터처럼 표준이 `author`를 요구하는 출력은 렌더링 단계에서 변환합니다.

### 폰트 설정

Pretendard는 self-host하며 **400/700 두 weight만** 사용합니다. 빌드 전 `scripts/build-fonts.mjs`가 포스트·로케일·컴포넌트에서 실제 사용하는 문자를 모아 full WOFF2 원본을 사이트 전용 서브셋으로 만듭니다. 결과 파일은 `public/fonts/Pretendard/`에 생성되고 `Head.astro`에서 preload됩니다.

- **`src/assets/fonts/Pretendard-1.3.9/full/`** — 서브셋 생성용 원본과 라이선스
- **`src/styles/pretendard.css`** — 400/700 `@font-face`
- **`src/settings/site.settings.ts`** — `fonts.baseStack`에서 `var(--font-pretendard)` 사용
- **`npm run fonts`** — 서브셋 수동 재생성 (`predev`/`prebuild`에서 자동 실행)

코드용 Reddit Mono는 `public/fonts/Reddit_Mono/`의 WOFF2 variable font를 사용합니다. 자세한 구조는 `docs/ai-docs/typography/fonts.md`를 참고하세요.

### 아바타 placeholder

페르소나 아바타는 CDN 외부 이미지라 새로고침 시 서비스워커 콜드 스타트 동안 빈 placeholder 원이 노출될 수 있습니다. 이를 막기 위해 `scripts/build-avatar-lqip.mjs`가 각 아바타를 20×20 webp(~0.2KB)로 축소해 data URI로 인라인하고, 렌더 시 흐린 placeholder를 첫 paint에 표시한 뒤 JS(`src/utils/avatar-swap.ts`)가 같은 `<img>` 요소에서 실제 URL로 교체합니다(blur-up 방식). 생성 파일은 `src/generated/avatar-lqip.json`이며 커밋되어 있어 오프라인 빌드도 동작합니다. 아바타를 추가·교체하면 `npm run avatar-lqip`로 재생성하세요(`predev`/`prebuild`에서 자동 실행).

### 보안 헤더

이 사이트는 GitHub Pages에 배포되므로 CSP, HSTS, `X-Frame-Options` 같은 응답 헤더를 저장소 설정만으로 지정할 수 없습니다. 현재는 외부 스크립트를 `site.settings.ts`에서 명시적으로 켜고, 의존성 감사(`npm audit --omit=dev --audit-level=high`)를 CI에서 수행하는 범위까지 적용했습니다. 헤더 정책은 Cloudflare/Netlify 등 헤더 제어가 가능한 호스팅으로 이전할 때 적용해야 합니다. 상세는 `docs/ai-docs/configuration/security.md`를 참고하세요.

### 다국어

사용자에게 표시되는 모든 고정 문구는 `src/locales/` 폴더에서 관리됩니다.

- `{BCP-47}.ts` — 해당 로케일의 UI 문자열. 현재 파일은 자동 검색되며 별도 등록이 필요하지 않습니다.

새 언어로 포스트를 작성하려면 프론트매터에 `lang: xx`만 설정하면 됩니다(중앙 목록 불필요). 사이트 크롬(UI)도 번역하려면 `src/locales/xx-XX.ts`를 추가하고 `Locale` 인터페이스를 구현하세요. 로케일 모듈은 자동 검색되므로 별도 목록 등록은 필요하지 않습니다. 자세한 규칙은 `docs/ai-docs/configuration/locales.md`를 참고하세요.

### 디자인 토큰

색상, 간격, 타이포그래피 등 전역 디자인 값은 `src/styles/global.css`의 `:root` 변수에서 관리됩니다.

## 콘텐츠 작성

포스트는 `posts/` 아래 `.md` 또는 `.mdx` 파일로 작성합니다 (예: `posts/ko/blog/2026-01-01-example.md`). 페르소나 값 `blog`는 폴더명과 프론트매터의 `personas` 값, URL, 화면의 `@blog` 표기에 공통으로 사용합니다. 파일명은 `YYYY-MM-DD-{slug}` 형식입니다. 언어는 **프론트매터 `lang` 필드**(2자리 코드, 예: `ko`, `en`, `ru`, `fr`, `es`, `ja`, `zh`)로 지정합니다. `lang` 값을 가진 포스트가 있으면 해당 언어가 자동 지원됩니다. 기본 언어(`ko`) 외 언어는 라우팅에서 `/en/`, `/ru/` 등 접두사가 붙습니다.

### 프론트매터 예시

```yaml
---
title: 포스트 제목
description: 간단한 설명
personas: [blog]
date: 2026-01-01 12:00:00 +0900
categories: [카테고리1, 카테고리2]
tags: [태그1, 태그2]
---
```

### 지원하는 확장 문법

- **KaTeX 수식**: `$inline$` 또는 `$$block$$`
- **Mermaid 다이어그램**: ` ```mermaid ` 코드 블록
- **정의 목록**: 용어 아래 `: 설명` 형식
- **GFM**: 표, 각주, task list, autolink. 취소선은 `~~text~~`만 지원하며, `~text~`는 취소선이 아니라 문자 그대로 출력됩니다.

## 크로스 플랫폼 참고사항

이 프로젝트는 Windows 환경에서 개발되었습니다. macOS 또는 Linux에서 사용 시:

- 파일 경로 구분자 차이로 인한 문제는 없습니다 (Node.js/Astro가 자동 처리).
- `npm install` 시 `sharp` 등 네이티브 모듈이 OS에 맞게 자동 빌드됩니다.
- 개발 서버 실행 방법은 동일합니다: `npm run dev`.

## 라이선스

MIT
