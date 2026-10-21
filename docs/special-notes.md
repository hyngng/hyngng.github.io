# 특이사항 노트

> 출시용 README 또는 사용설명서에 옮길 **기본값과 다른 의도적 동작, 제약, 작성 함정**만 모은 초안이다. 일반 기능 소개, 설치 절차, 전체 설정 레퍼런스는 다루지 않는다.
>
> 각 항목은 현재 코드와 `docs/ai-docs/`를 기준으로 정리했다. README로 옮길 때 문장은 다듬어도 되지만, "의도적으로 끈 기능"과 "지원하지 않는 것"은 빠뜨리지 않는다.

## 1. Markdown과 콘텐츠 렌더링

### 1.1 GFM은 사용하지만 단일 물결표 취소선은 끈다

- GFM(GitHub Flavored Markdown)은 사용한다. 표, 각주, task list, autolink가 동작한다.
- **취소선은 `~~text~~`만 지원한다.** `~text~`는 취소선이 아니며 문자 그대로 출력된다.
- 이유: `1~2`, `10~11`처럼 범위를 나타내는 단일 `~`가 한 문단에 두 번 나오고 flanking 규칙을 만족하면, GFM 구현체의 기본값(`singleTilde: true`)이 두 `~`를 취소선 구분자로 짝지어 문단 중간을 `<del>`로 감싼다.
- 이 프로젝트는 Astro 기본 GFM 등록을 끄고(`gfm: false`) `remarkGfm({ singleTilde: false })`로 직접 등록한다. 표·각주·task list·autolink는 그대로 유지된다.
- 근거: [`features/posts.md`](./ai-docs/features/posts.md)의 "GFM 취소선과 단일 물결표".

### 1.2 수식과 Mermaid는 프론트매터로 명시해야 한다

- `math: true`가 없는 포스트에서는 `$...$`, `$$...$$`가 **수식으로 렌더링되지 않고 원문 텍스트로 출력된다.** KaTeX CSS도 로드하지 않는다.
- `mermaid: true`가 없는 포스트에서는 `mermaid` 코드 블록이 **다이어그램으로 렌더링되지 않는다.**
- 두 플래그 모두 대부분의 포스트에서 불필요한 CSS/JS를 줄이기 위한 의도적 조건부 로딩이다. Mermaid는 해당 포스트에서만 약 1MB를 동적 import한다.
- 근거: [`features/posts.md`](./ai-docs/features/posts.md), [`roadmap.md`](./ai-docs/roadmap.md)의 "Math/Mermaid 조건부 로딩".

### 1.3 본문 이미지 경로는 CDN으로 자동 변환된다

- Markdown 이미지와 HTML `<img>`의 로컬 경로는 빌드 시 `SITE.cdn.imageBaseUrl`(기본 jsDelivr)로 변환된다.
- `https://`, `//`(protocol-relative), `data:` 같은 스킴이 있는 URL은 변환하지 않는다.
- 이미지 파일은 저장소에 두지 않고 CDN 저장소에 두는 구성이 전제다. `SITE.cdn.imageBaseUrl`이 비어 있거나 잘못되면 이미지가 깨진다.
- 프론트매터 `image.path`는 `/...` 절대 경로 또는 전체 URL을 써야 한다. 상대 경로는 경고만 출력하고 그대로 두므로 이미지가 깨질 수 있다.
- 본문 이미지는 모두 `<span class="img-wrapper">`로 감싸지고 `loading="lazy"`가 붙는다. 로드 전에는 16:9 shimmer 자리표시자를 쓰고, 실제 이미지가 도착하면 원래 비율로 바뀐다. JS가 없으면 shimmer 없이 이미지를 즉시 표시한다.
- 근거: [`configuration/cdn.md`](./ai-docs/configuration/cdn.md), [`design/typography.md`](./ai-docs/design/typography.md).

### 1.4 이미지 속성 문법은 `.md`와 `.mdx`가 다르다

- `.md`에서는 이미지 바로 뒤에 `{.left .w-50}` 같은 클래스 속성을 붙인다.
- `.mdx`에서는 `{...}`가 JavaScript 표현식으로 해석되므로 이 문법을 쓸 수 없다. `:left[![alt](src)]{ .w-50 }` 같은 directive를 사용한다.
- 라이트/다크 이미지는 `.img-light` / `.img-dark` 클래스로 지정한다. 파일명이나 alt에 `light`/`dark`가 포함되면 자동으로 붙는다.
- 근거: [`features/remark-directives.md`](./ai-docs/features/remark-directives.md), [`roadmap.md`](./ai-docs/roadmap.md).

### 1.5 캡션과 float 이미지의 규칙이 다르다

- 일반 이미지 캡션은 이미지와 **같은 문단의 다음 줄**에 `_캡션_`으로 쓴다.
- `::video` / `::youtube` / `::audio` 캡션은 **바로 다음 문단**에 쓰며, 빈 줄이 있어도 된다.
- `:left`/`:right` 지시어 또는 `{.left}`/`{.right}` 클래스가 붙은 float 이미지는 `<figure>`/`<figcaption>`으로 변환되지 않는다. float 캡션은 제거된다.
- Admonition은 `:::tip`, `:::info`, `:::warning`, `:::danger` 블록으로 쓴다. 아이콘은 플러그인이 인라인 SVG로 주입한다.
- 근거: [`design/typography.md`](./ai-docs/design/typography.md), [`features/remark-directives.md`](./ai-docs/features/remark-directives.md).

### 1.6 raw HTML 블록에는 빈 줄을 넣지 않는다

- `.row` / `.col-md-6`로 2열 이미지를 배치할 때, **HTML 블록 내부에 빈 줄을 넣으면 안 된다.** CommonMark의 type-6 HTML 블록은 첫 빈 줄에서 끝나므로 `<div>`가 분리되고 내부 `<img>`가 코드 블록으로 바뀔 수 있다.
- `.row` 사이의 빈 줄은 문제없다.
- raw HTML `<img>`도 `rehype-raw`를 거쳐 CDN 변환·`img-wrapper`·lazy loading이 적용된다.
- 근거: [`roadmap.md`](./ai-docs/roadmap.md)의 "레거시 그리드 CSS 복원", [`configuration/cdn.md`](./ai-docs/configuration/cdn.md).

### 1.7 HTML 주석은 렌더링 결과에서 제거된다

- Markdown 본문의 `<!-- ... -->`는 빌드 시 제거된다. 작성자용 메모로 써도 독자에게 노출되지 않는다.
- 코드 펜스 안의 프로그래밍 언어 주석(`#`, `//`, `/* */`)은 제거 대상이 아니다.
- 번역 파이프라인도 HTML 주석을 삭제하라고 명시한다.
- 근거: `src/plugins/rehype-strip-comments.mjs`, [`translation/main.md`](./ai-docs/translation/main.md).

### 1.8 프론트매터에서 알아둘 동작

- `personas`는 기본값이 `['dev']`다. **첫 번째 값(`personas[0]`)이 URL의 페르소나 세그먼트와 카드의 대표 페르소나가 된다.** 등록되지 않은 페르소나는 스키마 오류다. 디렉토리 이름은 URL에 영향을 주지 않는다.
- `lang`은 **full BCP-47 코드**(`ko-KR`, `zh-CN` 등)를 권장한다. `ko` 같은 2자리 코드도 CLDR로 정규화되지만, 지역까지 명시하는 편이 안전하다. 유효하지 않으면 빌드 오류다. 지원 언어는 포스트의 `lang` 값에서 자동 파생되며 중앙 목록이 없다.
- `draft: true` 포스트는 목록·라우트·RSS·검색에서 제외된다.
- `toc: false`면 목차를 숨긴다. 기본값은 표시다.
- `start_with_ads: true`는 Jekyll 호환 필드다. AdSense가 설정된 경우에만 본문 상단 광고가 노출된다.
- `description`이 없으면 본문에서 자동 excerpt를 만든다. 카드용은 150자, 메타 description은 155자 기준이며, heading·table·image 문단은 excerpt에서 제외된다.
- `categories`와 `tags`는 사이트 로직에서 사용하지 않는다. 번역본에서도 번역하지 않고 원문(한국어)을 유지한다.
- 타임존이 없는 `date`/`last_modified_at`은 `SITE.timezone`(기본 `Asia/Seoul`) 기준으로 해석한다. `Z`나 `+09:00` 같은 오프셋이 있으면 그 값을 우선한다.
- OG 이미지 우선순위는 `og_image` → `image.path` → `SITE.ogImage` 순서다. 다만 JSON-LD `BlogPosting.image`는 `image.path`를 먼저 쓴다.
- `redirect_from`에 경로를 나열하면 레거시 URL 리다이렉트를 생성할 수 있다.
- 근거: `src/content.config.ts`, [`features/posts.md`](./ai-docs/features/posts.md), [`roadmap.md`](./ai-docs/roadmap.md).

### 1.9 파일명과 URL

- 파일명은 `YYYY-MM-DD-{slug}.md` 형식을 관례로 쓰고, URL slug에서는 날짜 접두사와 확장자를 제거한다.
- 같은 `(lang, persona, slug)` 조합이 중복되면 빌드 검증에서 충돌로 처리한다.
- Jekyll 시절 `/posts/{slug}/` 링크는 현재 라우트로 리다이렉트된다. 본문 링크 235개도 현재 규칙으로 마이그레이션되었다.
- 근거: [`features/posts.md`](./ai-docs/features/posts.md), [`architecture/routing.md`](./ai-docs/architecture/routing.md).

### 1.10 TOC는 h2~h4만 담는다

- 목차에는 `h2`, `h3`, `h4`만 들어간다. `h5`/`h6`는 본문에 렌더링되지만 TOC에는 나오지 않는다.
- `toc: false`이거나 수집된 heading이 없으면 TOC 자체를 렌더링하지 않는다.
- TOC 항목은 h2를 기본 그룹으로 묶고, h2 이전에 h3/h4가 먼저 나오면 첫 heading을 독립 루트로 처리한다.
- 근거: [`features/toc.md`](./ai-docs/features/toc.md).

## 2. 라우팅과 SEO

### 2.1 기본 언어는 URL 접두사가 없다

- 기본 언어(`ko-KR`)는 `/{persona}/{slug}/`에 위치한다.
- 비기본 언어는 `/{locale-segment}/{persona}/{slug}/`에 위치한다.
- 언어 세그먼트는 지원 언어 집합을 보고 자동 계산한다. 같은 언어 코드를 공유하는 로케일이 둘 이상이면 `zh-cn`/`zh-tw`처럼 전체 코드로 승격되고, 하나뿐이면 `en`처럼 짧은 코드를 쓴다. 충돌이 남으면 빌드가 실패한다.
- 새 언어는 포스트의 `lang` 값만 추가해도 라우팅·언어 스위처·hreflang·sitemap·RSS에 자동 반영된다. UI 문자열까지 번역하려면 `src/locales/xx-XX.ts`에서 `Locale` 인터페이스를 구현하면 되고, 파일은 자동 검색되므로 별도 등록이 필요 없다.
- 근거: [`configuration/locales.md`](./ai-docs/configuration/locales.md), [`architecture/routing.md`](./ai-docs/architecture/routing.md).

### 2.2 번역본은 persona와 slug가 모두 같아야 한다

- `hreflang`과 sitemap의 번역본 판정은 `lang`만 보지 않고 **같은 페르소나 + 같은 slug**를 요구한다.
- `hreflang`에는 자기 자신도 포함하고, 기본 언어 버전이 있으면 `x-default`를 붙인다. 번역본이 하나뿐이면 canonical만 출력하고 hreflang은 생략한다.
- 홈의 hreflang은 sitemap에서만 관리하고 `<head>`에는 출력하지 않는다. 페르소나 인덱스에는 hreflang을 적용하지 않는다.
- 근거: [`features/posts.md`](./ai-docs/features/posts.md), [`configuration/sitemap.md`](./ai-docs/configuration/sitemap.md).

### 2.3 Sitemap은 단일 파일이며 XSL을 의도적으로 쓰지 않는다

- `@astrojs/sitemap`을 쓰지 않고 `src/pages/sitemap.xml.ts`에서 직접 생성한다.
- 포함 대상: 루트, 비기본 언어 인덱스, 포스트가 있는 페르소나 인덱스, 포스트. 빈 페르소나는 제외한다.
- XSL 스타일시트는 의도적으로 사용하지 않는다. 검색엔진은 XML 원문을 파싱하므로 브라우저용 뷰는 불필요하다는 판단이다.
- 네임스페이스 URL은 반드시 `http://`를 쓴다. `https://`로 바꾸면 hreflang과 image 확장을 검색엔진이 인식하지 않는다.
- 청크 페이지는 sitemap에서 제외되고 `noindex,follow`가 붙는다.
- 근거: [`configuration/sitemap.md`](./ai-docs/configuration/sitemap.md).

### 2.4 의도적으로 넣지 않은 SEO 항목

- JSON-LD에 `SearchAction`을 넣지 않는다. 사이트에 이미 검색 UI가 있어 중복 구조화를 피한다.
- `theme-color`는 테마와 무관하게 `#0a0a0a` 하나로 고정한다.
- 404 페이지는 `noindex`이며 canonical을 출력하지 않는다.
- 근거: [`features/posts.md`](./ai-docs/features/posts.md), [`roadmap.md`](./ai-docs/roadmap.md).

### 2.5 llms.txt는 영어판(`en-US`)만 가리킨다

- `/llms.txt`는 영어 문서이며, 포스트·페르소나 링크도 모두 `/en/...` 경로를 쓴다. 기본 언어(`ko`) 링크를 섞지 않는다.
- 페르소나별로 최근 10개까지만 나열하고, 설명이 없으면 excerpt로 대체한다.
- 근거: `src/utils/llms.ts`, [`roadmap.md`](./ai-docs/roadmap.md)의 "llms.txt 동적 생성".

### 2.6 RSS는 언어·페르소나 조합별로 제공된다

- 기본 언어 전체: `/rss.xml`
- 비기본 언어 전체: `/{locale-segment}/rss.xml`
- 기본 언어 페르소나: `/{persona}/rss.xml`
- 비기본 언어 페르소나: `/{locale-segment}/{persona}/rss.xml`
- 프레임의 RSS 버튼은 페르소나 페이지에서는 페르소나 RSS를, 그 외 페이지에서는 언어 RSS를 가리킨다.
- 근거: [`configuration/sitemap.md`](./ai-docs/configuration/sitemap.md)의 RSS 섹션, `src/pages/**/rss.xml.ts`.

## 3. UI와 상호작용

### 3.1 프레임은 데스크톱과 모바일이 다르다

- 데스크톱(>960px)은 화면 가장자리에 두께 12px의 고정 프레임이 있고, 본문 폭은 768px이다.
- 모바일(≤960px)은 프레임 두께가 0이 된다. 상단 바는 `position: sticky`로 동작하고, 화면 상단·하단 좌우 모서리에 28px 오목 곡선(concave corner)이 들어간다.
- 모바일에서 프레임은 고정 레이어가 아니라 문서 흐름의 sticky 헤더다. 이 때문에 헤더 높이만큼 본문 오프셋을 따로 주지 않는다.
- 근거: [`design/frame-layout.md`](./ai-docs/design/frame-layout.md), `src/components/Frame.astro`.

### 3.2 각주는 데스크톱과 모바일에서 다르게 동작한다

- 데스크톱(≥961px): 각주 번호에 호버하면 툴팁이 뜨고, 클릭하면 하단 각주 정의로 스크롤한다.
- 모바일(≤960px): 호버 툴팁을 끄고, 각주 번호를 터치하면 `<dialog>` 모달로 해당 각주만 보여준다. 복귀 링크를 누르면 모달을 닫고 각주 정의 위치로 이동한다.
- 각주 라벨(`각주`, `Footnotes` 등)은 로케일별로 번역되며, 시각적으로는 `.sr-only`로 숨기고 스크린리더에는 노출한다.
- 근거: [`features/footnotes.md`](./ai-docs/features/footnotes.md).

### 3.3 테마는 클래스 토글이며 OS 설정을 초기값으로 쓴다

- `<html>`에 `dark` 또는 `light` 클래스를 붙이는 방식이다.
- 저장된 `localStorage.theme`이 없으면 `prefers-color-scheme`을 따른다.
- FOUC 방지를 위해 `<head>`의 인라인 스크립트가 먼저 실행된다.
- 테마 변경 시 `themeChange` 커스텀 이벤트를 발생시켜 Mermaid·Giscus가 동기화된다.
- 근거: [`features/theme-toggle.md`](./ai-docs/features/theme-toggle.md).

### 3.4 모바일 포스트 카드는 탭 위치에 따라 목적지가 다르다

- 모바일(≤960px)에서 카드의 페르소나 영역(아바타+이름/날짜)을 누르면 페르소나 페이지로 간다.
- 그 외 카드 영역을 누르면 포스트로 간다.
- 데스크톱에서는 카드 어디를 눌러도 포스트로 간다.
- 근거: [`features/posts.md`](./ai-docs/features/posts.md)의 "포스트 카드 페르소나 영역".

### 3.5 언어 전환은 현재 경로의 언어 세그먼트만 교체한다

- 언어를 바꿔도 query string과 hash는 보존된다.
- 모바일에서 언어 목록을 열면 헤더가 왼쪽으로 확장되어 테마/RSS 버튼이 화면 밖으로 밀리고 언어 토글이 왼쪽 끝에 온다. 목록은 가로 스크롤된다.
- 닫힌 언어 목록은 `inert`로 탭 순서에서 제외된다.
- 근거: [`components/frame-layout.md`](./ai-docs/components/frame-layout.md), [`design/frame-layout.md`](./ai-docs/design/frame-layout.md).

### 3.6 검색은 Pagefind 기반이며 언어·페르소나로 격리된다

- 검색 결과는 현재 페이지 로케일의 `lang` 필터로 격리된다.
- 페르소나 페이지에서는 `persona` 필터가 추가되어 같은 언어의 다른 페르소나 결과를 배제한다.
- 아직 DOM에 로드되지 않은 청크의 포스트도 검색 대상에 포함하기 위해 검색 전용 청크 fetch를 사용한다. 이 fetch는 페이지네이션 상태(`?p=`)를 바꾸지 않는다.
- Pagefind 로드에 실패하면 DOM 기반 제목/설명 필터로 폴백한다.
- 검색 결과 카드는 매칭 excerpt로 바꾸지 않고 기존 페르소나/날짜 메타를 유지한다(의도적 보류).
- 검색 결과가 없으면 로케일별 빈 상태 메시지를 보여준다.
- 근거: [`features/search.md`](./ai-docs/features/search.md).

### 3.7 포스트 목록은 점진적 로딩이며 JS 없이도 동작한다

- `postsPerPage` 기본값은 8이다.
- 데스크톱은 SSR된 2열 masonry를 그대로 쓰고, 모바일은 시간순 단일 목록으로 재배치한다.
- JS가 켜져 있으면 다음 청크를 fetch해 append하고, 스크롤 80%에서 prefetch한다.
- JS가 꺼져 있으면 `load-more-card`가 청크 페이지로 이동한다. 청크 페이지는 `noindex,follow`이며 sitemap에서 제외된다.
- 모바일 LoadMoreCard는 스크롤 비례 연출이 아니라 **문서 최하단에 도달했을 때** PC 호버와 같은 전환을 재생하는 이산 토글이다.
- 근거: [`features/chunk-loading.md`](./ai-docs/features/chunk-loading.md), [`roadmap.md`](./ai-docs/roadmap.md).

### 3.8 댓글은 Giscus 단일 구현이다

- Utterances와 Disqus는 아직 지원하지 않는다.
- Giscus는 테마 변경과 로케일을 실시간으로 동기화한다.
- Giscus 설정은 `SITE.giscus`에 모여 있다.
- 근거: [`architecture/comment-system.md`](./ai-docs/architecture/comment-system.md).

### 3.9 PWA는 프로덕션에서만 등록된다

- 공식 `@vite-pwa/astro`는 Astro 5까지만 지원하므로 쓰지 않는다. `src/integrations/astro-pwa.ts`가 `vite-plugin-pwa`를 벤더링한 커스텀 통합이다.
- `SITE.pwa.enabled`가 참이고 프로덕션 빌드일 때만 서비스 워커와 manifest를 등록한다.
- 업데이트는 `autoUpdate`라 별도 프롬프트가 없다.
- 일반 페이지 HTML은 프리캐시하지 않고 `NetworkFirst`(3초 타임아웃, 최대 100개·30일)로 서빙한다. 오프라인이면 마지막 방문 HTML을 쓴다.
- 해시된 JS/CSS/이미지/폰트와 **청크 HTML 조각**은 프리캐시한다. 청크를 프리캐시하는 이유는 오프라인에서도 다음 목록 로딩이 동작하게 하기 위해서다.
- GitHub Pages는 `Cache-Control` 헤더를 지원하지 않고 `sw.js`도 `max-age=600`으로 서빙된다. 브라우저의 24시간 업데이트 체크 스로틀도 헤더로 해결할 수 없다.
- 근거: [`features/pwa.md`](./ai-docs/features/pwa.md).

### 3.10 폰트와 아이콘

- Pretendard 로컬 subset(300/400/500/600/700)만 Astro Fonts API로 로드한다. 외부 폰트 CDN을 쓰지 않는다.
- Font Awesome은 제거되었고, 프레임·검색·admonition 아이콘은 인라인 SVG다.
- 근거: [`typography/fonts.md`](./ai-docs/typography/fonts.md), [`roadmap.md`](./ai-docs/roadmap.md).

## 4. 빌드·배포·설정

### 4.1 Markdown 플러그인을 고치면 캐시를 지워야 한다

- Astro Content Layer 캐시는 **포스트 파일 내용 digest만** 본다. remark/rehype 플러그인 코드나 `astro.config.mjs`의 플러그인 순서를 바꿔도 캐시가 무효화되지 않는다.
- 플러그인을 수정한 뒤 결과가 반영되지 않으면 `.astro`, `node_modules/.astro`, `node_modules/.vite`를 모두 삭제하고 다시 빌드한다.
- 개발 캐시는 `.astro/data-store.json`, 빌드 캐시는 `node_modules/.astro/data-store.json`에 있다.
- 근거: [`development/build-cache.md`](./ai-docs/development/build-cache.md).

### 4.2 Mermaid는 dev 사전 번들에 고정되어 있다

- `vite.optimizeDeps.include: ['mermaid']`가 설정되어 있다. Mermaid가 런타임에만 동적 import되어 Vite 재최적화를 일으키고, 그 과정에서 dev-toolbar의 MIME 오류가 발생하는 것을 막기 위해서다.
- 이 설정을 바꾼 뒤에는 `node_modules/.vite`를 삭제하고 dev 서버를 재시작한다.
- 근거: [`development/build-cache.md`](./ai-docs/development/build-cache.md).

### 4.3 `npm run build`에는 Pagefind 인덱싱이 포함된다

- `postbuild` 스크립트가 `pagefind --site dist --output-path dist/pagefind`를 실행한다.
- 검색 인덱스는 포스트 본문(`data-pagefind-body`)만 대상으로 하며, 전역 네비/사이드바는 제외한다.
- 청크 페이지는 인덱싱 대상에서 제외된다.
- 근거: `package.json`, [`features/search.md`](./ai-docs/features/search.md).

### 4.4 분석 스크립트의 로드 조건이 도구마다 다르다

- Google Analytics, GTM, GoatCounter는 `import.meta.env.PROD` 게이트를 통과할 때만 삽입된다. 개발 중 콘솔 오류와 분석 트래픽 오염을 막기 위해서다.
- AdSense는 이 프로덕션 게이트가 없다. `SITE.analytics.adsense`가 설정되어 있고 포스트에 `start_with_ads: true`가 있으면 개발 모드에서도 삽입된다. `public/ads.txt`는 배포 시 함께 준비한다.
- 근거: `src/components/seo/analytics/`, `README.md`.

### 4.5 배포 전에 확인할 설정

- Node.js는 **22.12.0 이상**이 필요하다.
- `SITE.url`은 실제 배포 origin과 일치해야 한다. sitemap·RSS·OG의 절대 URL이 이 값을 기준으로 만들어진다.
- `SITE.cdn.imageBaseUrl`은 이미지 저장소를 가리켜야 한다.
- `SITE.timezone`은 오프셋 없는 날짜 해석에 사용된다.
- `SITE.postsPerPage`는 목록 청크 크기다.
- `SITE.pwa.enabled`는 PWA 등록 여부다.
- 번역본이 없어도 빌드는 실패하지 않는다. 번역 누락은 현재 자동 검증하지 않으므로, 배포 전에 언어별 인덱스와 hreflang을 직접 확인한다.
- 근거: `src/settings/site.settings.ts`, `src/integrations/validate-routes.ts`.

### 4.6 외부 런타임 의존성

- KaTeX CSS는 jsDelivr에서 런타임 로드한다. 수식 포스트에서만 로드된다.
- 이미지 CDN도 jsDelivr다.
- Mermaid는 CDN이 아니라 로컬 npm 번들에서 동적 import한다.
- 오프라인/폐쇄망에서는 KaTeX CSS와 이미지 CDN을 로컬로 바꾸거나 프록시해야 한다.
- 근거: `README.md`, [`typography/fonts.md`](./ai-docs/typography/fonts.md).

## 5. 번역 파이프라인

### 5.1 번역은 요약이 아니라 완전 번역이다

- 모든 문장과 문단을 빠짐없이 번역한다. 생략·압축·병합·요약은 금지한다.
- 코드·수식·마크업·verbatim 인용은 원문 그대로 보존한다.
- 출력은 정확히 `===TRANSLATION===` / `===NOTES===` 마커로 나눈다. 마커 구조를 바꾸면 파이프라인이 번역과 노트를 분리하지 못한다.
- 근거: [`translation/main.md`](./ai-docs/translation/main.md).

### 5.2 번역 대상과 제외 대상

- `.md` 파일만 번역한다. 확장자가 없거나 다른 파일은 건드리지 않는다.
- YAML 프론트매터의 표시 문자열은 번역하되, `lang`은 대상 언어의 BCP-47 코드로 바꾸고 `categories`와 `tags`는 번역하지 않는다.
- `description`은 SEO를 고려해 대상 언어에 맞게 길이를 조정한다.
- 본문의 HTML 주석은 통째로 삭제한다. 코드 펜스 안의 주석은 번역한다.
- 코드 식별자(변수/함수/예약어)는 번역하지 않고, 주석만 번역한다.
- Mermaid는 구조 문법(화살표/괄호/키워드)을 보존하고 사람이 읽는 라벨만 번역한다.
- 수식 블록은 예외 없이 원문 그대로 둔다.
- 링크는 경로를 보존하고 링크 텍스트와 `#fragment`만 번역한다. 경로가 바뀌면 sitemap/CDN 라우팅이 깨진다.
- 근거: [`translation/main.md`](./ai-docs/translation/main.md).

### 5.3 날짜 표기와 한자 정책

- `04.13` 같은 압축 날짜 라벨은 풀어쓰지 않고, 대상 언어의 관습에 맞게 숫자 순서만 바꾼다(예: 영어 month/day, 프랑스어·러시아어 day.month).
- `zh` 번역은 **간체자**를 쓴다. `ja`는 일본어 한자 표기를 따르고, 그 외 언어는 한국어 원문의 전통 한자를 유지한다. 고전 중국어 인용은 모든 언어에서 원문 그대로 보존한다.
- 근거: [`translation/main.md`](./ai-docs/translation/main.md).

### 5.4 언어별 실패 패턴

- **en**: 주어 생략을 무조건 "you"로 채우지 않는다. 호흡이 긴 문장을 짧게 쪼개지 않는다. 격식 때문에 라틴어계 어휘를 과도하게 쓰지 않는다.
- **es**: pro-drop을 살리고 불필요한 대명사를 넣지 않는다. 중첩 종속절을 허용한다. 지역 표준(peninsular/LatAm)을 일관되게 적용한다.
- **fr**: 한국어보다 장황해지는 경향을 경계한다. 논리 연결어를 과도하게 넣지 않는다. 독자에게 직접 말할 때는 `vous`를 기본으로 한다.
- **ja**: 주어를 과도하게 복원하지 않는다. `~일지도 모른다` 같은 유보를 단정으로 바꾸지 않는다. だ/である体와 ます体 중 하나를 골라 일관되게 쓴다.
- **ru**: 완료/불완료 상을 문맥에서 판단한다. 어순을 강조 도구로 활용한다. 과도한 명사화를 피한다.
- **zh**: topic-prominent 구조를 살린다. aspect marker와 시간 부사를 이용해 회고적 시제를 표현한다. 成語/문언체를 과도하게 쓰지 않는다. 정치·역사적으로 민감한 주제도 원문의 입장을 그대로 옮긴다.
- 근거: [`translation/languages/`](./ai-docs/translation/languages/).

## 6. 의도적인 미지원·제약

- SPA/View Transitions를 쓰지 않는다. 포스트 목록의 청크 로딩은 점진적 향상(progressive enhancement)이며, JS가 없으면 일반 페이지 이동으로 폴백한다.
- sitemap은 단일 XML이며 XSL 뷰를 제공하지 않는다.
- JSON-LD에 `SearchAction`을 넣지 않는다.
- 댓글은 Giscus만 지원한다. Utterances/Disqus는 로드맵의 향후 항목이다.
- 분석 스크립트 중 GA/GTM/GoatCounter는 프로덕션에서만 로드된다. AdSense는 설정과 `start_with_ads`가 있으면 개발에서도 로드된다.
- PWA 업데이트는 브라우저의 24시간 체크 스로틀과 GitHub Pages의 캐시 헤더 제약을 그대로 받는다.
- `theme-color`는 테마별로 바뀌지 않는다.
- 번역본이 없는 포스트는 빌드를 실패시키지 않는다. 번역 누락은 자동 검증하지 않는다.
- `posts/` 아래 `.md`/`.mdx`만 콘텐츠로 인식한다. 확장자가 없는 파일은 무시된다.
