# Comment System Architecture

## Overview
Giscus를 단일 댓글 시스템으로 구현하며, 프로젝트의 테마(Light/Dark) 시스템과 실시간으로 연동되도록 설계되었습니다.

## Integration Principles
1. **Zero-Pollution**: `public/` 폴더에 별도의 로더 파일을 두지 않고 `Giscus` 표준 로더를 사용합니다.
2. **Real-time Theme Sync**: 기존 테마 토글 시스템에서 발행하는 `themeChange` 이벤트를 구독하여, 테마 변경 즉시 `postMessage`를 통해 댓글창 테마를 실시간으로 전환합니다.
3. **Locale Sync**: `Astro.currentLocale`을 `data-lang` 속성에 바인딩하여 다국어 원칙을 준수합니다.
