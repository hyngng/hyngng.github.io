# Sitemap 통합

## 현재 상태

`@astrojs/sitemap` integration 대신 `src/pages/sitemap.xml.ts` 라우트로 직접 생성함. 단일 `sitemap.xml` 파일에 모든 페이지 URL을 포함함.

XSL 스타일시트(`<?xml-stylesheet ...?>`)는 **의도적으로 사용하지 않음**. 브라우저 표시용(사람용)일 뿐 검색엔진은 XML 원문을 직접 파싱하므로, 관련 작업은 진행하지 않는다.

## URL 생성 방식

Sitemap의 절대 URL은 `request.url`에서 추출한 origin을 사용함. `SITE.url` 하드코딩 대신 실제 요청 호스트를 반영함.

```ts
const origin = new URL(request.url).origin;
// dev: http://localhost:4321
// production: https://hyngng.github.io
```

`astro.config.mjs`의 `site: SITE.url` 설정이 있어야 빌드 타임에 올바른 origin이 생성됨.

## 포함 대상

단일 `sitemap.xml`에 다음 4종의 URL을 모두 포함함:

| 유형 | 예시 | `<lastmod>` |
|------|------|------------|
| 루트 인덱스 | `https://hyngng.github.io/` | 없음 |
| 언어별 인덱스 | `https://hyngng.github.io/en/` | 없음 |
| 작가별 인덱스 | `https://hyngng.github.io/blog/` | 없음 |
| 포스트 | `https://hyngng.github.io/blog/first-post/` | `last_modified_at` 또는 `date` |

- 언어별 인덱스: 기본 로케일(ko)은 루트(`/`)와 겹므로 별도 항목 없음. 비기본 언어(`/en/` 등)만 포함.
- 작가별 인덱스: 해당 작가의 포스트가 존재할 때만 포함. 빈 작가 페이지는 제외.
- 포스트: `draft: true`인 글은 제외.

## 네임스페이스

`<urlset>` 루트는 3개 네임스페이스를 선언함:

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
```

- `xhtml`: 다국어 alternate(`hreflang`)용
- `image`: 구글 이미지 사이트맵 확장용

## 다국어 hreflang

동일 콘텐츠의 번역본을 연결하기 위해 `<xhtml:link rel="alternate" hreflang="..." href="..." />`를 사용함. 자기 자신을 포함한 전체 번역본을 출력해야 Google이 hreflang을 인식함.

**포스트**: `getPostSlug()`(파일명에서 날짜/확장자 제거)로 번역 그룹을 묶음. 그룹 내 번역본이 2개 이상일 때만 alternate 출력. 기본 로케일(ko) 버전이 존재하면 `hreflang="x-default"`도 함께 출력.

**언어별 홈페이지**: 루트(`/`)와 각 언어 홈페이지(`/en/`, `/ru/`, ...)가 서로를 alternate로 참조하고, 루트(`/`)를 `x-default`로 지정.

작가별 인덱스 페이지에는 hreflang을 적용하지 않음.

## 이미지 (`image:image`)

각 포스트의 대표 이미지 1장을 `<image:image>`로 출력 (구글 이미지 검색 노출용):

```xml
<image:image>
  <image:loc>https://cdn...</image:loc>
</image:image>
```

이미지 URL 우선순위: `og_image` 프론트매터 > `image.path`(썸네일). 두 값 모두 `content.config.ts`의 `absoluteImageUrl` transform으로 이미 CDN 절대 URL이 보장됨. 이미지가 없으면 `<image:image>`를 생략함.

## `<lastmod>` 규칙

포스트에만 `<lastmod>`를 포함함. 단순 페이지(루트, 언어별, 작가별 index)에는 포함하지 않음.

프론트매터의 `last_modified_at`이 있으면 사용, 없으면 `date`(게시 날짜) 사용. `YYYY-MM-DD` 형식.

## URL 생성 로직

```ts
// 한국어(기본 로케일): 프리픽스 없음
`/${author}/${slug}/`

// 비기본 언어: 언어 코드 프리픽스 포함
`/${lang}/${author}/${slug}/`
```

`getPostLang()`과 `getPostSlug()`은 `src/utils/posts.ts`에서 제공함.

## 동적 URL 생성 원칙

프로젝트 전반에 걸쳐 URL 생성 시 `SITE.url` 하드코딩 대신 실제 요청 URL을 사용함:

| 위치 | 파일 | 방식 |
|------|------|------|
| `.ts` 라우트 핸들러 | sitemap, robots, RSS | `new URL(request.url).origin` |
| `.astro` 컴포넌트 | PostFooter, PostLayout | `Astro.url.origin` / `Astro.url.href` |

`SITE.url`은 프로덕션 URL 상수로만 사용 (문서화, fallback).

## `robots.txt`

`src/pages/robots.txt.ts` 라우트로 동적 생성함. `Sitemap:` 지시어로 `/sitemap.xml`을 가리킴. origin은 동적으로 추출.

## 참고

- 공식 Astro 문서: https://docs.astro.build/en/guides/integrations-guide/sitemap/
- sitemap.xml 스펙: https://www.sitemaps.org/protocol.html

## RSS 라우트

RSS는 기본 언어(ko)는 접두사 없는 루트 경로, 비기본 언어는 `/[lang]/` 경로로 분리된 구조로 생성됨 (`@astrojs/rss`):

| 라우트 | 경로 | 대상 |
|--------|------|------|
| 루트 | `/rss.xml` | 기본 언어(ko) 포스트 |
| 언어별 | `/[lang]/rss.xml` | 해당 언어 포스트 |
| 작가별(기본 언어) | `/[author]/rss.xml` | 해당 작가 + 기본 언어 포스트 |
| 작가별(비기본 언어) | `/[lang]/[author]/rss.xml` | 해당 작가 + 해당 언어 포스트 |

`site` 필드는 `request.url` origin에서 동적 추출 (sitemap과 동일 원칙). Frame.astro의 RSS 버튼은 작가 페이지에서 작가별 RSS로, 그 외에서는 언어별 RSS로 링크됨. 기본 언어 작가 페이지는 `/[author]/rss.xml`(접두사 없음), 비기본 언어 작가 페이지는 `/[lang]/[author]/rss.xml`.
