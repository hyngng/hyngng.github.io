# AI Context: new-blogging

## Maintained Context

- [CDN image routing](./configuration/cdn.md)
- [Sitemap integration](./configuration/sitemap.md)
- [Locales](./configuration/locales.md)
- [Hero component](./components/hero.md)
- [Authors component](./components/authors.md)
- [Font configuration](./typography/fonts.md)
- [Post routing & i18n](./features/posts.md)
- [Table of contents](./features/toc.md)

이 디렉토리는 AI와 협업하며 결정된 주요 디자인 및 아키텍처 맥락을 저장함.
단일 책임 원칙(SRP)에 따라 각 문서는 하나의 주제만 다룸.

## 목차

### Design
- [Frame Layout](./design/frame-layout.md): Fixed Frame 레이아웃 및 오목한 곡선(concave corner) 원리
- [Typography](./design/typography.md): 타이포그래피 설계 원칙, 이미지 캡션

### Configuration
- [Locales](./configuration/locales.md): 다국어 문자열 관리, `Locale` 인터페이스, `useLocale()` / `getLocale()` 사용법, 키 네이밍 불일치 및 `SITE.lang` 불일치 이슈
- [CDN](./configuration/cdn.md): CDN 이미지 라우팅
- [Sitemap](./configuration/sitemap.md): sitemap 생성 방식, **다국어 URL 누락 이슈**

### Components
- [Button](./components/button.md): Button 다형성 및 스타일링
- [Frame](./components/frame-layout.md): Frame 컴포넌트, **오목한 모서리(concave corner) 구현 원리**
- [Hero](./components/hero.md): Hero 컴포넌트
- [Authors](./components/authors.md): Authors/Author 컴포넌트

### Architecture
- [Routing](./architecture/routing.md): URL 라우팅 아키텍처
- [Comment System](./architecture/comment-system.md): Giscus 댓글 시스템

### Features
- [Post routing & i18n](./features/posts.md): content collection 기반 포스트 라우팅, **다국어 라우팅 구조**
- [Table of contents](./features/toc.md): headings 기반 계층 구조 TOC 및 기준선 기반 ScrollSpy
- [Theme Toggle](./features/theme-toggle.md): 다크모드/라이트모드 전환 로직
- [Search](./features/search.md): Pagefind 기반 검색
- [Chunk Loading](./features/chunk-loading.md): HTML 조각 기반 점진적 포스트 로딩 시스템
- [Remark Directives](./features/remark-directives.md): remark-directive 통합 시스템
- [PWA](./features/pwa.md): 커스텀 `astro-pwa` 통합(`vite-plugin-pwa` 기반) PWA 설정과 `@vite-pwa/astro` 미사용 사유

### Typography
- [Fonts](./typography/fonts.md): Astro Fonts API 기반 폰트 로딩
