# AI Context: new-blogging

이 디렉토리는 AI와 협업하며 결정된 주요 디자인 및 아키텍처 맥락을 저장한다.
단일 책임 원칙(SRP)에 따라 각 문서는 하나의 주제만 다룬다.

> **정확성 보증**: 모든 문서는 코드베이스를 단일 소스 오브 트루스로 하여 감사되었다.
> 수치를 인용할 때는 항상 해당 소스 파일(예: `src/styles/global.css`)을 함께 표기한다.
> 새로운 코드 변경 시 이 문서들도 동기화 대상이다(AGENTS.md "문서 동기화" 표 참조).

## 문서 맵

### Design (설계 원칙)
- [Frame Layout](./design/frame-layout.md) — Fixed Frame 구조, 오목한 곡선(concave corner)의 `::before`/`::after` 의사 요소 원리, action-block 위치 계산
- [Typography](./design/typography.md) — 타이포그래피 설계 원칙, 이미지 캡션, Mermaid 다이어그램 정렬

### Configuration (설정)
- [Locales](./configuration/locales.md) — 다국어 문자열 관리, `Locale` 인터페이스, `useLocale()` / `getLocale()` 사용법, `SITE.lang` 표기 이슈
- [CDN](./configuration/cdn.md) — 이미지 라우팅 및 Markdown→HTML CDN URL 변환(`rehype-image-wrapper`, `resolveCdnPath`)
- [Sitemap](./configuration/sitemap.md) — sitemap 생성 방식, 다국어 URL 정책

### Components (컴포넌트)
- [Frame](./components/frame-layout.md) — Frame 컴포넌트, 오목한 모서리 구현, `data-js` 이미지 게이트, `astro:before-preparation` 테마 주입
- [Button](./components/button.md) — Button 다형성 및 스타일링(`--button-size`, `--button-padding-*`)
- [Hero](./components/hero.md) — Hero 컴포넌트(`HomePageContent.astro` → `getSiteMeta` 데이터 흐름)
- [Authors](./components/authors.md) — Authors/Author 컴포넌트, `AUTHOR_PREFIX` 기반 경로
- [Footer](./components/footer.md) — Footer 컴포넌트

### Architecture (아키텍처)
- [Routing](./architecture/routing.md) — URL 라우팅 아키텍처(`[lang]/[author]/[slug]`)
- [Comment System](./architecture/comment-system.md) — Giscus 댓글 시스템

### Features (기능)
- [Post routing & i18n](./features/posts.md) — content collection 기반 포스트 라우팅, 다국어 라우팅, 스키마 필드, Mermaid/KaTeX 조건부 로딩
- [Chunk Loading](./features/chunk-loading.md) — HTML 조각 기반 점진적 포스트 로딩, 가로 채움 배치 알고리즘, CSS 변수
- [Table of contents](./features/toc.md) — headings 기반 계층 구조 TOC 및 기준선 기반 ScrollSpy
- [Theme Toggle](./features/theme-toggle.md) — 다크/라이트 전환 로직, `themeChange` 이벤트, Mermaid/Giscus 동기화
- [Search](./features/search.md) — Pagefind 기반 검색 UI
- [Remark Directives](./features/remark-directives.md) — remark-directive 통합(admonition, media, scroller 등)
- [Footnotes](./features/footnotes.md) — 각주 툴팁(`rehype-footnote-tooltip.mjs`, `ariaDescribedby` 일관 키)
- [PWA](./features/pwa.md) — 커스텀 `astro-pwa` 통합(`vite-plugin-pwa` 기반), `@vite-pwa/astro` 미사용 사유

### Typography
- [Fonts](./typography/fonts.md) — Astro Fonts API 기반 폰트 로딩, `Head.astro` `@font-face` 생성

### Development
- [Build Cache](./development/build-cache.md) — `data-store.json` 빌드 캐시, remark/rehype 수정 후 캐시 삭제 필요, `optimizeDeps.include`와 dev-toolbar MIME 오류

### Translation (번역 파이프라인)
- [Translation Main](./translation/main.md) — 번역 프롬프트 구조, `===TRANSLATION===`/`===NOTES===` 마커 형식, fidelity 원칙
- [Translation Languages](./translation/languages/) — 언어별 번역 가이드라인
- [Translation Issues](./translation/issues/) — 언어별 번역 이슈 로그(EN/KO 등)

### Plans (보관/제안)
- [Mobile Post List Layout Fix](./plans/mobile-post-list-layout-fix.md) — 모바일 배치 모듈 공통화 계획(상태: 구현 반영됨)
- [Search Excerpt Replacement](./plans/search-excerpt-replacement.md) — 검색 excerpt를 Author 정보로 대체 제안(상태: **미구현**)
- [Load More Scroll Proximity Archive](./plans/load-more-scroll-proximity-archive.md) — Scroll Proximity 기반 load-more 설계(상태: **ScrollSpy 구현으로 대체되어 보관**)

## 문서 간 관계 (흐름)

- **포스트 렌더링 파이프라인**: `features/posts.md` → `features/remark-directives.md`(마크다운 확장) → `configuration/cdn.md`(이미지) → `features/footnotes.md`(각주) → `features/theme-toggle.md`(Mermaid/KaTeX 테마 동기화) → `design/typography.md`(표현)
- **Frame → 레이아웃**: `components/frame-layout.md`(구현) ↔ `design/frame-layout.md`(원리) ↔ `features/chunk-loading.md`(카드 배치) ↔ `features/posts.md`(경로)
- **검색**: `features/search.md` → `features/chunk-loading.md`(카드 DOM 재사용) → `features/posts.md`(메타데이터)
- **i18n**: `configuration/locales.md` → `features/posts.md`(다국어 라우팅) → `translation/main.md`(번역 워크플로) → `configuration/sitemap.md`(다국어 URL)
