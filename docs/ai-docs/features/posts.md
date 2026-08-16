# 포스트 라우팅

## 결론

Astro는 Jekyll처럼 `content/`에 Markdown 파일을 넣는 것만으로 페이지를 자동 생성하지 않음.

이 프로젝트는 아래 두 축으로 포스트 페이지를 생성함.

- `src/content.config.ts`: `posts` content collection 등록. 현재 loader pattern은 `**/*.{md,mdx}`임.
- `src/pages/[author]/[slug].astro` 및 `src/pages/[lang]/[author]/[slug].astro`: collection entry를 정적 경로로 변환.

공식 문서 기준으로 content collections는 `defineCollection()`과 loader로 콘텐츠를 등록하고, 페이지는 `getStaticPaths()`에서 collection entry를 읽어 직접 생성함.

## 현재 라우팅 규칙

이 프로젝트는 **기본 언어(ko)**와 **비기본 언어(en, ru, fr, es)**를 구분하여 포스트 페이지를 생성함.

### 기본 언어 (ko)

`content/ko/blog/2022-08-13-first-post.mdx`는 아래 URL로 생성됨.

```text
/blog/first-post/
```

### 비기본 언어 (en, ru, fr, es)

같은 포스트가 비기본 언어로 존재하는 경우, 아래 URL로 생성됨.

```text
/en/blog/first-post/
/ru/blog/first-post/
/fr/blog/first-post/
/es/blog/first-post/
```

파일명 앞의 `yyyy-mm-dd-` 접두사는 `src/utils/posts.ts`의 `getPostSlug()`가 제거함.

포스트 URL의 작가 세그먼트는 작가 ID `{authorId}` 형태다 (예: `/dev/{slug}/`). 작가 인덱스 페이지(`/{author}/`)와 동일하다.

URL 전체 경로는 `getPostPath()`가 생성함. sitemap과 RSS 같은 기능은 이 helper를 재사용해야 함. 라우트(`[author]/[slug].astro`)의 `params.author`도 `getPostAuthorSegment()`를 통해 동일하게 조합한다.

## 구 URL 리다이렉트 (`/posts/{slug}/`)

이전 Jekyll 블로그의 URL 패턴 `/posts/{slug}/`를 보존하기 위해, 기본 언어(ko) 포스트에 한해 정적 리다이렉트 페이지를 생성한다.

- 파일: `src/pages/posts/[slug].astro`
- 동작: `/posts/{slug}/` → `/{authorId}/{slug}/`. `<head>` 최상단의 인라인 `<script is:inline>`(`location = absoluteTarget`)이 body 파싱 전 즉시 이동을 시작해 화면 깜빡임이 없다(`jekyll-redirect-from` 방식과 Unified/Astro 이전 완료). 0초 meta refresh는 JS 비활성화 폴백으로 병행.
- 타깃은 `Astro.site`를 기준으로 절대 URL로 변환(`new URL(target, Astro.site).toString()`).
- SEO: 구글 검색 센터 기준 0초 meta refresh는 영구 리다이렉트로 처리되어 인덱스를 신 URL로 이전한다. `<link rel="canonical">`로 신 URL을 명시하고, 리다이렉트 페이지 자체는 `<meta name="robots" content="noindex">`로 인덱스에서 제외한다.
- 대상: `draft`가 아닌 기본 언어(ko) 포스트만. 비기본 언어 포스트는 Jekyll 시절 `/posts/` 하위에 존재하지 않았으므로 제외.
- 타깃 경로는 `getPostPath()`를 재사용하므로, URL 규칙이 바뀌어도 리다이렉트가 자동으로 따라간다.
- `/posts/chunk/{n}/` 페이지네이션 라우트(`src/pages/posts/chunk/[n].astro`)와 경로가 겹치지 않는다. 커스텀 sitemap은 포스트 경로만 나열하므로 리다이렉트 페이지는 자동 제외된다.

### 본문 내 마크다운 하이퍼링크 규격

Jekyll 시절의 구 URL 형식(`https://hyngng.github.io/posts/{slug}/`)으로 작성된 본문 하이퍼링크는 현재 프로젝트의 다국어 라우팅 규칙에 맞춰 일괄 재정의됨:
- **기본 언어 (ko)**: `https://hyngng.github.io/{author}/{slug}/`
- **비기본 언어 (en, ru, fr, es, ja, zh)**: `https://hyngng.github.io/{lang}/{author}/{slug}/`
- 대상 포스트가 해당 언어 버전으로 존재하는 경우에만 언어 경로를 반영하며, 존재하지 않거나 무효한 슬러그인 경우 원본 링크를 유지하여 리다이렉트에 위임함. 앵커(#)가 포함된 링크도 그대로 보존됨.

## 언어 코드 추출

포스트의 언어 코드는 파일명의 첫 번째 세그먼트에서 추출함. 예: `content/ko/blog/2022-08-13-first-post.mdx`의 언어 코드는 `ko`.

`src/utils/posts.ts`의 `getPostLang(postId)` 함수가 이 역할을 수행함.

```typescript
// 예시
getPostLang('ko/blog/2022-08-13-first-post.mdx') // 'ko' 반환
getPostLang('en/blog/2022-08-13-first-post.mdx') // 'en' 반환
```

> 포스트는 프로젝트 루트 `posts/{lang}/{author}/` 아래에 위치한다 (`content.config.ts`의 `base: './posts'`). 예: `posts/ko/blog/2022-08-13-first-post.mdx`.

## URL 생성

`src/utils/posts.ts`의 `getPostPath(id, authorId, currentLocale?)` 함수가 포스트 URL을 생성함. 작가 세그먼트에는 `getPostAuthorSegment()`가 적용되어 작가 ID가 그대로 사용된다.

`currentLocale`을 전달하지 않으면 기본 로케일(`ko`)로 동작하여 `/ko/` 프리픽스 없이 URL을 생성함. `id`에서 언어 코드를 추출하지 않으므로, 비기본 언어 URL을 생성하려면 반드시 `currentLocale`을 전달해야 함.

```typescript
// 예시
getPostPath('ko/blog/2022-08-13-first-post.mdx', 'blog')                    // '/blog/first-post/' 반환 (기본 언어)
getPostPath('en/blog/2022-08-13-first-post.mdx', 'blog')                    // '/blog/first-post/' 반환 (currentLocale 미전달 → 기본 'ko')
getPostPath('en/blog/2022-08-13-first-post.mdx', 'blog', 'en')             // '/en/blog/first-post/' 반환
getPostPath('ko/blog/2022-08-13-first-post.mdx', 'blog', 'en')             // '/en/blog/first-post/' 반환 (id의 언어와 무관)
```

## Content Collection 경로

콘텐츠 디렉토리는 프로젝트 루트의 `posts/`에 위치한다 (`content.config.ts`의 `base: './posts'`). 기존 `src/content/`에서 이동됨.

## Schema

`posts` collection schema는 현재 아래 필드를 관리함.

- `title`: 필수.
- `description`: 선택.
- `date`: 필수, `z.string().transform(parseDateWithTimezone)`으로 문자열 날짜를 타임존 보정하여 Date로 변환. 타임오프셋이 없는 날짜는 `SITE.timezone`(`Asia/Seoul`) 기준으로 보정됨.
- `last_modified_at`: 선택, `date`와 동일한 타임존 보정 적용.
- `authors`: `src/settings/authors.settings.ts`의 author id(배열)로 정규화, 기본값 `["dev"]`.
- `categories`, `tags`: 배열, 기본값 `[]`.
- `draft`: boolean, 기본값 `false`.
- `image`: 선택, `imageSchema` (`path`, `lqip`, `alt`). `path`가 로컬 절대 경로(`/`로 시작)이면 CDN URL로 변환됨. `lqip`은 placeholder 이미지 (base64 또는 저해상도 URL).
- `start_with_ads`, `toc`: 이전 Jekyll frontmatter 호환용 선택 필드. `toc_sticky`는 TOC가 항상 sticky이므로 2026-08 스키마에서 제거됨.

## Author 호환

이전 Jekyll frontmatter의 `author: [hyngng.dev]` 같은 배열 값은 `src/content.config.ts`에서 `dev`로 정규화함.

현재 등록된 author id는 `blog`, `dev`, `art`, `essay`, `photography` 5개임. `src/settings/authors.settings.ts`의 `getAuthor()` 함수는 미등록 author id가 들어오면 throw하여 빌드를 실패시킴. 복수 개를 등록하면 해당 글은 여러 author 인덱스에 동시에 노출됨(언어판별 간 일관 유지 필요).

## Jekyll 이전 호환

이전 Jekyll Markdown에는 `<!--
...
-->` Liquid comment가 있을 수 있음.

Astro Markdown은 Liquid를 실행하지 않으므로 그대로 두면 본문에 노출될 수 있음.

## 디자인

포스트 페이지는 `src/layouts/PostLayout.astro`를 사용함.

기존 Tailwind Typography 플러그인(`prose`) 및 커스텀 클래스(`.prose-custom`) 의존성을 완전히 제거하고, **`src/styles/typography.css`에서 `article` 태그를 직접 스타일링하는 독립 타이포그래피 설계**로 이전함.

홈 Hero와 포스트 페이지는 `src/styles/global.css`의 `.content-shell`, `--content-width`, `--color-bg`, layout token을 공유함. 포스트 페이지의 Figma 기준은 "포스트 페이지 - 라이트 - 기믹"이며, 현재 주요 값은 다음처럼 token화 및 `typography.css`에 직접 하드코딩 또는 변수로 적용함.

- content width: `768px`.
- title: `40px / 48px`, bold.
- title과 author meta 사이: `24px`.
- author meta와 본문 사이: `64px`.
- body: `16px / 1.8` (`typography.css`에서 `article`에 직접 부여).
- 인라인 코드: 포인트 컬러(`--color-accent`)를 활용한 배경 및 여유로운 패딩 설계.
- 테이블: 둥근 모서리(`10px`)와 깔끔한 테두리를 가진 카드 형태 레이아웃. `overflow: hidden`으로 `thead` 배경색이 라운딩 밖으로 삐져나오지 않도록 클리핑.

## 구문 강조 (Syntax Highlighting)

포스트 본문 내 코드 블록은 Shiki를 통해 하이라이트됩니다. 테마는 CSS 변수 기반으로 동작하며, 라이트/다크 모드에 따라 자동으로 전환됩니다.

```css
/* 예: 다크 모드 */
:root.dark {
  --shiki-background: #1e1e1e;
  --shiki-text: #d4d4d4;
}
```

인라인 코드(`code`)와 프리포맷 코드 블록(`pre`)의 색상은 `src/styles/typography.css`의 `article code`, `article pre`, `article pre code` 선택자에서 관리합니다.

## Mermaid 다이어그램

포스트 내 Mermaid 다이어그램(` ```mermaid ` 코드 블록)은 빌드 타임에 정적 HTML로 변환되지 않고, **런타임에 클라이언트 측에서 렌더링**됩니다.

### 렌더링 파이프라인

1. Astro 마크다운 파서가 `` ```mermaid `` 블록을 `<pre data-language="mermaid">`로 변환합니다 (Shiki는 mermaid 언어를 지원하지 않아 구문 강조 없이 통과).
2. `initMermaidThemeSync()`가 페이지 로드 시 CDN(`mermaid@10`)에서 mermaid를 동적으로 import합니다.
3. `ensureMermaidContainers()`가 `<pre>`를 `div.mermaid`로 교체하고, 원본 소스를 `data-mermaid-source` 속성에 저장합니다.
4. `mermaid.run({ nodes })`가 `.mermaid:not([data-processed])` 요소를 찾아 SVG로 렌더링합니다.

### 테마 동기화

Mermaid는 렌더링 완료 후 SVG로 고정되므로, CSS 클래스 기반 테마 전환이 SVG 내부 색상을 자동으로 업데이트하지 못합니다. 이 프로젝트는 **테마 변경 시 모든 다이어그램을 원본 마크다운으로 복원한 뒤 새 테마로 재렌더링**합니다.

- `themeChange` 커스텀 이벤트 또는 `astro:page-load` 이벤트 발생 시 `refreshMermaid()` 호출
- 모든 `.mermaid` 요소의 `data-processed`를 제거하고 `textContent`를 `data-mermaid-source`에서 복원
- `renderRevision` 카운터로 동시에 발생한 여러 렌더 요청 중 최신만 반영

### 구현 참고

- **`nodes` 파라미터 사용**: `mermaid.run({ querySelector })` 대신 `nodes: Array.from(roots)`를 사용하여 DOM 재쿼리 레이스를 방지합니다. mermaid v10의 `run()` API는 `querySelector`와 `nodes`를 모두 지원합니다.
- **`data-processed` 속성**: mermaid 내부에서 렌더링 전에 `data-processed="true"`를 설정하고, 해당 속성이 있는 요소는 스킵합니다. therefore `refreshMermaid()`에서 이 속성을 제거해야 재렌더링이 가능합니다.
- **CDN 로드**: `mermaid@10` 태그로 로드하며, 인스턴스를 캐싱하여 중복 로딩을 방지합니다.

### 관련 파일

| 파일 | 역할 |
|---|---|
| `src/utils/mermaidThemeSync.ts` | 런타임 렌더링 및 테마 동기화 핵심 로직 |
| `src/types/mermaid.d.ts` | CDN mermaid v10 API TypeScript 선언 (initialize, run만 선언) |
| `src/styles/typography.css` | `.mermaid` 중앙 정렬, `line-height` 리셋, SVG 반응형 스타일 |

## `<head>` 슬롯 아키텍처 (OG + JSON-LD + SEO)

`<head>` 내 동적 콘텐츠(OG 메타 태그, JSON-LD, KaTeX CSS 등)는 Astro의 `<slot>` 메커니즘으로 관리됨.

- **`Head.astro`**: `<head>` 요소 내부에 기본 `<slot />`을 두어 자식 콘텐츠 삽입 가능하게 함.
- **`BaseLayout.astro`**: `<Head>`에 자식으로 `<slot name="head">`를 전달. 포스트가 아닌 페이지(홈, 작가)에서는 이 슬롯의 기본값으로 전역 OG 태그(`og:title`, `og:description`, `og:type="website"`, `og:url`, `og:site_name`, `twitter:card`, `fediverse:creator`)가 렌더링됨. `fediverse:creator`는 `SITE.social.fediverse`(`@hyngng.main@threads.net`)를 사용. `noindex` prop이 true면 `<meta name="robots" content="noindex">`를 넣고 canonical을 생략함 (404 페이지가 사용).
- **`PostLayout.astro`**: `<Fragment slot="head">`로 BaseLayout의 슬롯을 오버라이드하여 포스트 전용 OG 태그(`og:type="article"` 포함), JSON-LD, KaTeX CSS를 `<head>` 안에 주입.

### 동작 원리

| 페이지 유형 | slot="head" 내용 | 결과 |
|---|---|---|
| 홈/작가 | 미사용 → 기본값 렌더링 | `og:title=SITE.title`, `og:type="website"` |
| 포스트 | PostLayout이 오버라이드 | `og:title=post.data.title`, `og:type="article"` |
| 404 | 미사용 + `noindex` | `robots=noindex`, canonical 없음 |

### OG/SEO 태그 목록

**전역 기본값 (BaseLayout 슬롯 기본값):**
- `og:title`, `og:description`, `og:type="website"`, `og:url`, `og:site_name`, `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `fediverse:creator=SITE.social.fediverse`
- `canonical` (자기 자신, `noindex` 시 생략), `twitter:site` (`SITE.social.twitter` 비어있지 않을 때만)

**포스트 오버라이드 (PostLayout 슬롯):**
- `og:title=post.data.title`, `og:description=post.data.description`, `og:type="article"`, `og:url=canonicalUrl`, `og:site_name=SITE.title`, `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`
- `fediverse:creator=작가별 social.fediverse` (없으면 `SITE.social.fediverse`로 폴백, 중복 제거)
- `canonical` (자기 자신), `hreflang` alternate (같은 slug의 번역본 전체 + 기본 로케일 존재 시 `x-default`), `author` (작가명들), `article:published_time=post.data.date`, `article:modified_time=post.data.last_modified_at || date`, `twitter:site`, `twitter:creator` (작가별 social.twitter, 없으면 `SITE.social.twitter`로 폴백, `@` 프리픽스 자동 부여)

### JSON-LD

구조화 데이터 빌더는 `src/utils/jsonLd.ts`에 순수 함수로 모아 두고(`buildWebSiteJsonLd`, `buildBreadcrumbJsonLd`, `buildBlogPostingJsonLd`), 로직을 테스트하는 `src/utils/jsonLd.test.ts`가 함께 관리됨.

- **안전한 직렬화**: `serializeJsonLd()`가 `JSON.stringify(data).replace(/</g, '\\u003c')`로 특수문자를 이스케이프 처리. 모든 JSON-LD 스크립트는 이 함수를 경유함.
- **사이트 전역 `WebSite`** (`Head.astro`): BaseLayout을 쓰는 모든 페이지(홈/작가/포스트/404)에 주입. `name=SITE.title`, `description=getSiteMeta(lang).description`, `image=ogImage` 절대 URL. PostLayout이 head 슬롯을 오버라이드해도 유지됨.
  - **`SearchAction` 미포함** (사용자 결정): 사이트 자체 검색 UI(Pagefind)가 이미 제공되므로 구조화된 검색 액션은 중복으로 판단하여 제외. WebSite는 기본 필드(name/url/description/image)만 유지.
- **`BlogPosting`** (`PostLayout.astro`): `headline`, `description`, `image`, `datePublished`, `dateModified`, `author`(Person 배열), `inLanguage`(BCP-47, `getLocaleEntry(lang).bcp47`), `url`, `mainEntityOfPage`(`WebPage`/@id=canonical). `image`는 `og_image`보다 썸네일(`image.path`)을 우선.
- **`BreadcrumbList`**: 포스트 페이지는 Home → 작가 → 포스트 (PostLayout에서 직접 주입), 작가 페이지는 Home → 작가 (`BaseLayout`의 `breadcrumbItems` prop으로 전달). 작가 URL은 현재 페이지 로케일 경로 사용 (`getAuthorPath(id, lang)` — `PostCard`/`Author` 컴포넌트와 동일 규칙).
- **author `sameAs` 파생** (`src/settings/authors.settings.ts`): 하드코딩 없이 `SOCIAL_PROFILE_URLS` 레지스트리로 핸들을 URL로 변환 (`github`→`github.com/`, `twitter`→`x.com/`, `instagram`→`instagram.com/`, `website`는 그대로, `fediverse` `@user@domain`→`https://domain/@user`). 미래의 새 SNS는 `Social` 인터페이스에 필드 추가 + 레지스트리에 항목 1줄 추가만으로 확장 가능.

## Dev Server

`astro.config.mjs`의 `server.host: true`, `server.port: 4321`로 dev server 접근 주소를 고정함.

`npm run dev`는 `astro dev`를 실행함. 현재 `http://127.0.0.1:4321/blog/first-post/`에서 확인 가능함.

## MDX

사용자가 넣은 첫 포스트 파일은 `.mdx` 확장자임.

Astro에서 content collection이 `.mdx` entry를 인식하려면 `@astrojs/mdx` integration이 필요함. 현재 `astro.config.mjs`에 `mdx()`를 등록했고, collection loader는 `.md`와 `.mdx`를 모두 대상으로 함.

## 검증

`npm run build`에서 `/blog/first-post/index.html` 생성 확인됨.

## 포스트 청크 로딩

홈/작가 페이지의 포스트 목록은 `postsPerPage`(기본 8개) 단위로 분할되어 로딩된다. 상세는 `docs/ai-docs/features/chunk-loading.md` 참조.

### 레이아웃

데스크톱(>960px)에서는 2컬럼 masonry 레이아웃을 사용한다. `distributeByWeight()` 유틸리티가 이미지 유무에 따른 가중치(2.5:1)로 좌/우 컬럼에 분배한다. 모바일(≤960px)에서는 단일 컬럼으로 전환된다.

### 라우트 구조

| URL 패턴 | 설명 |
|---|---|
| `/posts/chunk/{n}` | 기본 언어 홈 청크 |
| `/{lang}/posts/chunk/{n}` | 다국어 홈 청크 |
| `/{author}/chunk/{n}` | 기본 언어 작가 청크 |
| `/{lang}/{author}/chunk/{n}` | 다국어 작가 청크 |

### SEO

청크 페이지는 `<meta name="robots" content="noindex,follow">` 적용. 중복 인덱싱 방지면서 링크 그래프 유지. 커스텀 sitemap에서 자동 제외.

## 포스트 카드 이미지 아키텍처

포스트 카드(`PostCard.astro`)와 더 보기 버튼(`LoadMoreCard.astro`)은 미리보기 이미지를 표시할 때 LQIP(Low Quality Image Placeholder) 기반의 점진적 로딩 패턴을 동일한 구조로 공유한다.

### 이미지 로딩 및 전환 메커니즘 (`PostCard` 및 `LoadMoreCard` 공통)

- `image.lqip`가 존재할 경우, `.post-card-image`에 `--lqip-url` CSS 변수를 주입한다.
- `::before` 의사 요소가 LQIP 이미지를 배경(`background-image`)으로 미리 표시한다 (블러 필터 없음).
- `img` 원본 이미지는 초기 `opacity: 0` 상태로 숨겨져 있다.
- Client-side Script (`image-init.ts`)가 `img.decode()`를 완료하면 `.loaded` 클래스를 주입한다.
- `.loaded`가 부여되면:
  - 원본 `img`가 `opacity: 1`로 0.35초간 페이드인된다.
  - `::before` (LQIP)가 `opacity: 0`으로 0.35초간 페이드아웃되어 원본 이미지로 부드럽게 교체된다.
- **더 보기 교체 카드 (`cards[0]`) 예외 처리**: "더 보기" 버튼 위치에 대체 교체되는 첫 번째 포스트 카드는 카드 등장 애니메이션(`is-new`)에서 제외될 뿐만 아니라, 미리보기 이미지도 LQIP 교체 트랜지션 없이 원본 이미지(`img.loaded`)로 즉시 표출되어 시각적 이질감을 방지한다.
- `LoadMoreCard` 호버 필터: 기본 `brightness(0.9) opacity(0.9)` 상태에서 마우스 호버 시 `brightness(1) opacity(1)`로 밝기/투명도가 복원된다. 호버 계열 애니메이션(`transform`/`color`/`filter` transition + `:hover`/`:focus-within` 규칙)은 `@media (hover: hover) and (pointer: fine)` 블록 안에만 있어 터치 입력에서는 동작하지 않는다.

### 관련 파일

| 파일 | 역할 |
|---|---|
| `src/components/PostCard.astro` | 일반 포스트 카드 (LQIP `::before` -> 원본 `img` 페이드인) |
| `src/components/LoadMoreCard.astro` | 더 보기 버튼 카드 (동일한 LQIP -> 원본 `img` 구조 + 호버 밝기/투명도 효과) |
| `src/features/post-list/image-init.ts` | `img.decode()` 성공 후 `.loaded` 클래스 추가 처리 |

## 포스트 글자수 집계

포스트 본문의 글자수는 `src/utils/posts.ts`의 `countCharacters()` 함수가 계산하며, `PostFooter.astro`에서 `toLocaleString()`으로 표시된다.

### 집계 정책

- **공백 포함**: 연속된 공백/개행은 1칸으로 정규화되어 카운트된다.
- **수식은 내용만**: 인라인 수식(`$...$`)과 블록 수식(`$$...$$`)은 델리미터(`$`)를 제외한 내용만 집계한다. `singleDollarTextMath: true` 옵션으로 델리미터 자체가 `text` 노드로 잡히는 것을 방지한다.
- **긍정 선택 방식**: "무엇을 버릴지" 나열하는 블랙리스트가 아니라, 집계할 노드 타입(`text`, `inlineCode`, `inlineMath`, `math`)만 화이트리스트로 수집한다.
- **코드블록/HTML/디렉티브/이미지 제외**: `code`, `html`, `containerDirective`, `textDirective`, `image`, `imageReference` 노드는 집계에서 제외된다.
- **인라인 코드 포함**: `inlineCode` 노드는 내용(백틱 제외)을 집계한다.
- **유니코드 기준**: `Array.from(normalized).length`로 자소 분리된 이모지 등을 코드포인트 단위로 셀 수 있게 한다.

### 전처리

파싱 전 본문에서 제거하는 패턴은 두 가지다 (`extractExcerpt`와 동일):

1. MDX 주석 `{/* ... */}` (multiline 포함) → 빌드 시 노출되지 않으므로 집계에서 제외.
2. Kramdown 속성 스팬 `{: .class .attr }` → `extractExcerpt`에서 셀렉터로 거르기 어려운 텍스트 노드로 남으므로 원천 제거. `{:` 구문은 directive 속성과 충돌하지 않아 안전하다 (전체 379개 포스트 전수 검증, leftover 0건).

### 파서 확장

`extractExcerpt`와 동일한 확장에 수식을 위한 두 확장을 더한다:

| 확장 | 역할 |
|---|---|
| `micromark-extension-math` + `mdast-util-math` | 인라인/블록 수식을 `inlineMath`/`math` 노드로 파싱 |
| `micromark-extension-gfm-table` + `mdast-util-gfm-table` | 테이블의 `|`를 텍스트로 집계하지 않도록 `table` 노드로 파싱 |
| `micromark-extension-directive` + `mdast-util-directive` | 디렉티브 구문이 `text` 노드로 집계되지 않도록 파싱 |

`micromark-extension-*`/`mdast-util-*` 6개 패키지는 `package.json`의 `dependencies`에 명시 등록되어 있다 (전이 의존성에 기대지 않음).

> **E3 동기화 규칙**: `posts.ts`의 `countCharacters()`/`extractExcerpt()`가 사용하는 micromark 확장 목록은 `astro.config.mjs`의 `markdown.processor` remarkPlugins(렌더링)와 **수동으로 동기화**해야 한다. 새 마크다운 문법 플러그인(예: remark-xxx)을 추가하면 ① astro.config의 remarkPlugins, ② posts.ts의 `extensions`/`mdastExtensions`, ③ package.json dependencies, 이렇게 세 곳을 함께 갱신한다.

## 포스트 Excerpt 추출

포스트 카드(`PostCard.astro`)의 요약 텍스트, 포스트 페이지의 메타 description(`PostLayout.astro`), RSS 아이템 description(`getRssItems()`) 모두 `src/utils/posts.ts`의 `extractExcerpt()` 함수가 생성한다.

### 우선순위

1. 프론트매터 `description`이 있으면 그대로 사용 (SEO 및 UX 측면에서 정석).
2. 없으면 마크다운 `body`에서 자동 추출.

### 자동 추출 로직

`mdast-util-from-markdown`으로 body를 AST로 파싱한 뒤, **루트 레벨의 paragraph 노드를 순서대로 수집**하여 `maxLength`까지 채운다 (기본 `100`, 메타 description용 `META_DESCRIPTION_MAX_LENGTH = 155`).

- **긍정 선택 방식**: "무엇을 버릴지" 나열하는 블랙리스트가 아니라, "paragraph인가?"와 "이미지를 포함하는가?" 두 조건만으로 동작.
- 비문단 노드(heading, table, directive, blockquote 등)는 `continue`로 건너뜀.
- 이미지 paragraph(이미지 alt 텍스트/캡션)는 `continue`로 건너뜀.
- 루트 레벨의 연속 paragraph를 순서대로 모아 `maxLength`에 도달하면 중단.
- **메타 description**: 프론트매터가 없는 포스트도 본문 기반의 페이지별 고유 description을 가지므로 사이트 전역 기본 메타로의 폴백이 최소화된다.

### 파서 확장

기본 `fromMarkdown`(CommonMark 전용)은 GFM 테이블을 paragraph로 잘못 분류하므로, 두 확장을 사용하여 AST 구조를 정확하게 만든다:

| 확장 | 역할 |
|---|---|
| `micromark-extension-gfm-table` + `mdast-util-gfm-table` | 테이블을 `table` 노드로 파싱 |
| `micromark-extension-directive` + `mdast-util-directive` | `:::tip` 같은 directive를 `containerDirective` 노드로 파싱 |

이 확장들이 없으면 테이블과 directive 블록이 paragraph로 분류되어 excerpt에 마크다운 원문이 노출된다.

## 포스트 카드 작가 영역 (모바일 링크)

포스트 카드(`PostCard.astro`)는 전체가 단일 `<a class="post-card-link">`로 감싸져 있고, 작가 영역은 데스크톱에서 카드 호버 시 본문 excerpt로 전환된다. `<a>` 내부에 `<a>`를 넣는 것은 HTML 위반(파서가 바깥 링크를 끊어 카드 레이아웃이 깨짐)이므로, 모바일에서 작가 페이지로 이동시키기 위해 오버레이 링크 대신 JS 위임 이벤트를 사용한다.

### 동작

- **모바일(≤960px, `isMobile()`)**: `.post-card-author` 영역 탭 → `data-author-href`로 이동 (첫 번째 작가 `authors[0]`의 페이지).
- **히트 영역 제한**: `.post-card-author`는 `width: fit-content; max-width: 100%`로 콘텐츠 크기(아바타 + 이름/날짜)로 수축하므로, 탭 히트 영역 = 눈에 보이는 작가 콘텐츠 박스. 텍스트가 없는 빈 공간(카드 폭 우측 여백)은 카드 링크에 귀속되어 포스트를 연다.
- **데스크톱(>960px)**: 기존대로 작가 영역 포함 카드 전체가 포스트를 연다. 호버 애니메이션(작가↔excerpt 전환)과 레이아웃은 변경 없음.
- 다중 작가 포스트: 표시 중인 primary author(`authors[0]`) 페이지로 이동.

### 구현

- `PostCard.astro`: `getAuthorPath(authorIds[0], currentLocale)`로 `data-author-href`를 `.post-card-author`에 주입.
- `src/features/post-list/author-link.ts`의 `initMobileAuthorLink(signal)`: 문서 레벨 위임 `click` 리스너 등록 — `closest('.post-card-author')`로 탭 대상 감지 → `isMobile()` 가드 후 `e.preventDefault()`로 카드 링크 네비게이션 차단, `window.location.assign()`으로 이동.
- 등록 지점: `PostListSection.astro` `init()`(AbortController 스코프)과 `ChunkPostListBody.astro`(청크 페이지). 카드가 렌더링되는 홈/작가/청크 페이지에서 동일 동작.
- 위임 방식이라 청크 로딩·검색으로 동적 추가된 카드에도 자동 적용.
- 모바일 판정은 `src/features/post-list/layout.ts`의 `isMobile()`을 재사용. 브레이크포인트는 `MOBILE_QUERY`(`'(max-width: 960px)'`) 상수로 중앙 관리하므로 JS에서 중복 정의 없음.

## 다른 글 더 보기 (MorePosts)

포스트 하단 메타데이터(`PostFooter`) 영역과 연계하여, 첫 번째 작가(`post.data.authors[0]`)의 시간순서상 가장 인접한 글 목록(최대 3개)을 SEO 내부 링크 및 탐색용으로 제공한다.

### 동작 및 레이아웃 정책

- **데이터 수집 (시간순 인접 탐색)**:
  - 현재 포스트와 동일 언어(`lang`)의 발행 포스트 중, 첫 번째 작가(`post.data.authors[0]`)가 동일하고 현재 글을 제외한(`p.id !== post.id`) 글들을 대상으로 한다.
  - 단순 최신순이 아닌 **현재 포스트 작성일과의 시간 차이(`Math.abs(p.date - currentPost.date)`)가 가장 작은 3개 글**을 추출한다. (단순 최신순 추천 시 모든 글이 동일한 최신 글 3개만 추천하는 문제를 방지하고 촘촘한 내부 링크 네트워크를 형성).
  - 최종 렌더링 시에는 추출된 3개의 글을 최신순으로 정렬하여 일관된 목록 순서를 제공한다. 다른 글이 없으면 렌더링하지 않는다.
- **스타일링 (`MorePosts.astro`)**:
  - `TOC.astro`의 텍스트 및 간격 토큰(`--toc-title-list-gap`, `--toc-item-gap`, `--post-card-font-title`, `--toc-link-font-size`, `text-overflow: ellipsis`)을 공유한다.
  - 마우스 호버 시 포인트 컬러(`--color-accent`)로 부드럽게 전환된다.
  - 접기/펼치기 및 ScrollSpy 감지 스크립트 없이 항상 펼쳐진 정적 순수 HTML/CSS 목록으로 경량 동작한다.
- **반응형 배치 (`PostLayout.astro`)**:
  - **데스크톱 (>1280px, 좌우 영역 존재 시)**:
    - 외곽 래퍼 `.post-footer-container`(`position: relative; margin-top: var(--post-footer-margin-top); margin-bottom: var(--post-footer-margin-bottom);`)가 여백을 소유하고, 내부 `PostFooter`는 `margin: 0`으로 배치된다.
    - 우측 사이드바 컨테이너 `.post-more-posts-container`는 `position: absolute; left: 100%; top: 0; width: var(--post-toc-width); margin-left: var(--space-post-toc-gap);`로 위치한다.
    - 이에 따라 TOC와 정확히 일치하는 우측 컬럼 그리드 라인에서, **포스트 메타데이터(CC 라이선스 텍스트)와 정확히 동일한 수평 높이(Y축)**에서 나란히 고정(non-sticky) 렌더링된다.
  - **인라인 (≤1280px, 좌우 영역 부재 시)**:
    - `.post-more-posts-container`가 `position: static; width: 100%;`로 전환되어 `PostFooter` 아래에 인라인으로 렌더링된다.
    - 상단 간격은 `--space-post-comments-margin-top`(`3.2rem`)으로 설정되어, `포스트 메타데이터 ↔ 다른 글 더 보기` 사이의 간격과 `다른 글 더 보기 ↔ 댓글창(Comments)` 사이의 간격이 완벽히 동일하게 대칭을 이룬다.
- **i18n**: 7개 언어 로케일(`ko-KR`, `en-US`, `ru-RU`, `fr-FR`, `es-ES`, `ja-JP`, `zh-CN`)의 `locale.morePosts.title`('다른 글 더 보기' 등) 및 `aria` 라벨을 지원한다.
