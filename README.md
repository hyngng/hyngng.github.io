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
| `npm run build` | 프로덕션 빌드 (`./dist/`) |
| `npm run preview` | 빌드 결과 로컬 미리보기 |
| `npm run check` | 타입 검사 (`astro check`) |
| `npm run test` | 단위 테스트 실행 (vitest) |

## 의존성

### 런타임 의존성 (`dependencies`)

| 패키지 | 용도 |
| :--- | :--- |
| `astro` | 정적 사이트 생성 프레임워크 |
| `@astrojs/mdx` | MDX 콘텐츠 지원 |
| `@astrojs/markdown-remark` | Markdown 처리 |
| `remark-math` + `rehype-katex` | 수학 수식 렌더링 (KaTeX) |
| `remark-deflist` | 정의 목록(`<dl>`) 지원 |

### 외부 CDN 리소스

다음 리소스는 빌드 타임이 아닌 런타임(브라우저)에서 CDN을 통해 로드됩니다. 오프라인 환경이나 네트워크 제한이 있는 경우 대체 방안이 필요합니다.

| 리소스 | CDN | 용도 |
| :--- | :--- | :--- |
| Font Awesome 6.5.1 | cdnjs.cloudflare.com | 아이콘 |
| KaTeX 0.16.10 CSS | cdn.jsdelivr.net | 수식 스타일 |
| Mermaid 10 | cdn.jsdelivr.net | 다이어그램 렌더링 |

> CDN URL은 `src/components/Head.astro`에서 관리됩니다.

## 커스터마이징

### 사이트 정보

`src/settings/site.settings.ts`에서 사이트 제목, 설명, URL, 소셜 링크 등을 수정합니다.

지원 언어와 기본 언어는 동일 파일의 `LOCALE_REGISTRY`에서 단일 관리됩니다 (`defaultLocale`, `supportedLocales`가 파생됩니다).

SNS/공유 메타데이터:

- **`ogImage`** — 기본 OG 이미지(`public/default-og.webp`, 1200x630). 포스트에 별도 이미지가 없을 때 `og:image`/`twitter:image`로 사용됩니다.
- **`social.fediverse`** — Fediverse 핸들(`@user@domain`). `fediverse:creator` meta로 출력됩니다. 포스트는 작가별 `social.fediverse`를 우선하고, 없으면 이 값으로 폴백합니다.
- **`resourceHints`** — 외부 CDN(jsdelivr/cdnjs/googletagmanager) preconnect 목록. `Head.astro`에서 `<link rel="preconnect">`로 조건부 출력됩니다.
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
- **AdSense**: `adsense.client`/`adsense.adSlot` 사용. `src/components/seo/analytics/Adsense.astro`로 분리되어 있으며 아직 레이아웃에 연결되지 않았습니다. AdSense 승인에는 `/ads.txt`가 필요하며 `public/ads.txt`에서 관리됩니다 (클라이언트 ID 변경 시 함께 수정).

각 도구는 `src/components/seo/analytics/` 아래에 컴포넌트로 분리되어 있으며, 값이 `undefined`면 로드되지 않습니다.

### 웹마스터 도구 검증 (Webmaster Verification)

`site.settings.ts`의 `verification` 객체에서 검색 엔진 검증 토큰을 설정합니다:

```ts
verification: {
  google: undefined,   // Google Search Console
  yandex: undefined,   // Yandex Webmaster
  baidu: undefined,    // Baidu Webmaster
  naver: undefined,    // Naver Search Advisor
  pinterest: '...',    // Pinterest
},
```

값이 설정되면 `src/components/seo/webmasters_verifications/WebmasterVerifications.astro`가 해당 `<meta name="...-site-verification">`를 `<head>`에 조건부 출력합니다.

> Bing은 Google Search Console과 연동되는 구조라 별도 검증 설정이 필요 없으며, Daum은 별도로 처리되어 검증 대상에서 제외됩니다.

### 작가 설정

`src/settings/authors.settings.ts`에서 작가 정보를 추가하거나 수정합니다. 포스트 프론트매터의 `authors` 필드와 매칭됩니다.

### 폰트 설정

폰트는 Astro 내장 Fonts API를 사용하여 관리됩니다:

- **`astro.config.mjs`** — `fonts` 옵션에서 로컬 폰트 variant와 CSS 변수명을 설정합니다
- **`src/settings/site.settings.ts`** — `fonts.baseStack`에서 최종 적용할 폰트 패밀리 이름을 지정합니다

로컬 폰트 파일은 `src/assets/fonts/`에 배치합니다.

### 다국어

사용자에게 표시되는 모든 고정 문구는 `src/locales/` 폴더에서 관리됩니다.

- `ko-KR.ts` — 한국어 (기본)
- `en-US.ts` — 영어
- `ru-RU.ts` — 러시아어
- `fr-FR.ts` — 프랑스어
- `es-ES.ts` — 스페인어
- `ja-JP.ts` — 일본어
- `zh-CN.ts` — 중국어

지원 언어 추가/제거는 `src/settings/site.settings.ts`의 `LOCALE_REGISTRY`를 수정하고, `src/locales/index.ts`에 로케일 파일을 등록합니다. 자세한 규칙은 `docs/ai-docs/configuration/locales.md`를 참고하세요.

### 디자인 토큰

색상, 간격, 타이포그래피 등 전역 디자인 값은 `src/styles/global.css`의 `:root` 변수에서 관리됩니다.

## 콘텐츠 작성

포스트는 `posts/{lang}/{author}/` 디렉토리에 `.md` 또는 `.mdx` 파일로 작성합니다 (예: `posts/ko/blog/2026-01-01-example.md`). 파일명은 `YYYY-MM-DD-{slug}` 형식이며, `lang`은 지원 언어 코드(`ko`, `en`, `ru`, `fr`, `es`, `ja`, `zh`)여야 합니다. 기본 언어(`ko`) 외 언어 디렉토리는 라우팅에서 `/en/`, `/ru/` 등 접두사가 붙습니다.

### 프론트매터 예시

```yaml
---
title: 포스트 제목
description: 간단한 설명
authors: [blog]
date: 2026-01-01 12:00:00 +0900
categories: [카테고리1, 카테고리2]
tags: [태그1, 태그2]
---
```

### 지원하는 확장 문법

- **KaTeX 수식**: `$inline$` 또는 `$$block$$`
- **Mermaid 다이어그램**: ` ```mermaid ` 코드 블록
- **정의 목록**: 용어 아래 `: 설명` 형식

## 크로스 플랫폼 참고사항

이 프로젝트는 Windows 환경에서 개발되었습니다. macOS 또는 Linux에서 사용 시:

- 파일 경로 구분자 차이로 인한 문제는 없습니다 (Node.js/Astro가 자동 처리).
- `npm install` 시 `sharp` 등 네이티브 모듈이 OS에 맞게 자동 빌드됩니다.
- 개발 서버 실행 방법은 동일합니다: `npm run dev`.

## 라이선스

MIT
