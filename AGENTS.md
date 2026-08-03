## 답변

답변은 한국어로 할 것.

## 디버깅 및 롤백

문제 해결 과정에서 시도한 변경사항이 문제 해결에 도움이 되지 않았다면, 해당 변경사항을 즉시 롤백한다.

최종 해결책만 코드베이스에 남기고, 시행착오 과정의 코드는 제거한다.

예시:
- 문제: MDX 파일이 로드되지 않음
- 시도 1: `schema: ({ entry }) =>` 추가 → 효과 없음 → 롤백
- 시도 2: 파일명 변경 → 효과 없음 → 롤백
- 최종 해결: `@astrojs/mdx` 통합 추가 → 성공 → 유지

## 작업 순서 및 검증

작업을 시작하기 전에 `docs/ai-docs/roadmap.md`를 먼저 확인한다.

### 작업 원칙
1. 요청한 작업이 `roadmap.md`의 미해결 작업과 관련되면, 계획과 맥락을 참고해 작업한다.
2. 모든 작업을 완벽히 수행하고 검증까지 끝났음이 보장되면 `roadmap.md`에서 해당 항목을 완료 처리한다.
3. 계획은 있으나 이번 요청 범위가 아니거나 순서가 아니면 `roadmap.md`에 명시한다.
4. **모호한 상황**: 여러 해결책이 가능하거나 확신이 없을 경우, 임의로 결정하지 말고 사용자에게 질문하여 방향성을 확인한다. (기존 코드 스타일 유지 vs 더 나은 패턴 리팩토링 등)

### 검증 절차
작업 완료 후 반드시 다음을 실행하여 확인한다:
1. `npm run build` — 빌드 에러 및 경로 생성 확인
2. `npx astro check` — 타입 에러 확인

## 문서 동기화
코드/스타일/설정을 수정한 경우, 아래 테이블에 해당하는 문서가 있으면 변경사항을 함께 반영한다.

| 파일명 | 경로 | 의도 |
| --- | --- | --- |
| README.md | `README.md` | 프로젝트 개요, 의존성, CDN 리소스, 커스터마이징 |
| roadmap.md | `docs/ai-docs/roadmap.md` | 장기 계획 및 미해결 작업 목록 |
| cdn.md | `docs/ai-docs/configuration/cdn.md` | CDN 이미지 라우팅과 Markdown 변환 |
| sitemap.md | `docs/ai-docs/configuration/sitemap.md` | sitemap 생성 방식과 경로 정책 |
| locales.md | `docs/ai-docs/configuration/locales.md` | 지역화 및 언어 추가 규칙 |
| frame-layout.md | `docs/ai-docs/design/frame-layout.md` | 프레임 설계 및 concave corner |
| theme-toggle.md | `docs/ai-docs/features/theme-toggle.md` | 테마 관리 맥락 |
| posts.md | `docs/ai-docs/features/posts.md` | 포스트 라우팅 및 Jekyll 호환 |
| toc.md | `docs/ai-docs/features/toc.md` | TOC/ScrollSpy 구조 |

## 코드 컨벤션 및 다국어

### 코드 규칙
- 주석은 최소화하되, 꼭 필요하다면 영어로 작성.
- 하드코딩 금지: 색상, 크기 등은 `src/styles/` 내 중앙 관리 파일 사용.
- **다국어 사용**: 컴포넌트 내부에서 하드코딩하지 않고 로케일 유틸리티를 사용한다.
  ```typescript
  import { useLocale } from '../locales';
  const locale = useLocale(Astro);
  // 사용: locale.posts.title, locale.posts.count(5)
  ```

## AI Slop 방지

AI Slop의 공통 패턴은 하나다: **문제를 해결하려 하지 않고, 증상을 없애려 한다.**

수정을 시도하기 전, 지금 변경하려는 코드가 **왜** 문제를 해결하는지
브라우저/런타임 동작 수준에서 설명할 수 있어야 한다.
설명할 수 없으면 수정하지 말고 먼저 조사하고, 조사 결과를 바탕으로
다시 설명을 시도한다. 3회 이상 설명 실패(수정 실패와 동일) 시
사용자에게 현재 이해 수준과 막힌 지점을 질문한다.

이 규칙은 CSS, JS, 문서, 설정 등 작업 종류와 무관하게 항상 적용된다.

## 최소한의 수정 및 단순한 해결 지향

문제를 해결할 때 새로운 래퍼 태그, 복잡한 추가 논리, 신규 헬퍼를 성급하게 도입하기 전에, **기존의 코드를 삭제하거나 간단히 구조를 변경하는 정도로 단순하고 우아하게 해결할 수 있는지** 먼저 포착하고 검토한다. 불필요한 코드 추가는 유지보수 비용을 늘리므로 미니멀한 접근 방식을 최우선으로 고려한다.

## 안티패턴 및 자주 발생하는 실수 (반드시 피할 것)
1. **이벤트 리스너 누적**: `document`/`window`에 리스너 등록 시 `AbortController`로 스코프를 관리하여 중복 등록을 방지한다.
2. **px 단위 사용**: 여백/크기 값은 접근성을 위해 가능한 `rem`을 사용한다.
3. **매직 넘버**: 하드코딩된 여백/크기는 CSS 변수로 추출하고, 필요시 JS에서 CSS 변수를 읽어서 관리한다.
4. **언어 하드코딩 import**: `import locale from '../locales/ko-KR'` 같은 방식 대신 `useLocale(Astro)`를 통해 동적으로 로케일을 가져온다.
5. **CSS 땜빵 셀렉터**: `article p:has(img):not(:has(.left)):not(:has(.right))` 같은 반복되는 부정 셀렉터 패턴은 금지. 근본 원인(예: `display: flex` 컨테이너의 anonymous flex item)을 제거하여 셀렉터 자체를 단순화한다. 국소적 문제해결은 유지보수 부채가 된다.

## 언어 확장 체크리스트
새 언어(예: `ru-RU`) 추가 시:
1. `src/locales/`에 `xx-XX.ts` 파일 생성 및 `Locale` 인터페이스 구현
2. `src/locales/index.ts`에 등록
3. `sitemap-index.xml.ts` 등 라우팅 로직에 반영 여부 확인
4. 프로젝트 문서(`locales.md`) 업데이트
