# 작가 및 페르소나 UI

## 현재 구조

홈과 작가 페이지의 작가 목록은 Hero의 페르소나 트리거와 네이티브 `<dialog>` 모달로 제공한다. 모달은 `src/components/PersonaModal.astro`가 렌더링하며, `src/components/HomePageContent.astro`와 `src/components/AuthorPageContent.astro`가 페이지별 작가 목록과 로케일 텍스트를 전달한다. 현재 `Authors.astro` 컴포넌트나 별도 작가 목록 섹션은 없다.

`src/components/Author.astro`는 포스트 메타데이터 등 개별 작가 표시에서 계속 사용한다. `src/components/Avatars.astro`는 단일 아바타와 여러 아바타 스택 렌더링을 공통 처리한다. `Hero.astro`는 스택 모드를, `Author.astro`와 `PersonaModal.astro`는 단일 모드를 사용한다.

## 작가 데이터와 링크

작가 정의와 표시 정보는 `src/settings/authors.settings.ts`에서 관리한다. 포스트는 콘텐츠의 `authors` 필드로 작가를 지정한다. 작가·포스트 링크는 기본 로케일과 번역 경로 규칙을 공유하도록 `getAuthorPath()`와 `getPostPath()` 등 공통 포스트 유틸리티를 사용한다.

페르소나 제목, 수량, 접근성 텍스트는 로케일 사전에서 가져온다. 컴포넌트에서 특정 언어의 문구를 하드코딩하지 않는다.

## 페르소나 다이얼로그 동작

- `Hero.astro`는 다이얼로그 관계 속성과 로케일별 수량 텍스트를 가진 트리거를 렌더링한다. 좁은 화면에서는 설명 아래로 배치한다.
- `PersonaModal.astro`는 작가 목록을 네이티브 `<dialog>`로 표시한다. 다이얼로그 ID, 제목, 작가 목록, 현재 로케일, 닫기 레이블을 입력으로 받는다.
- 모달 백드롭은 반투명 검정으로 배경을 어둡게 표시하며, 배경 블러는 적용하지 않는다.
- 닫기 버튼, Escape 키, 백드롭 조작으로 닫을 수 있다. 열고 닫을 때 문서 스크롤 잠금도 관리한다.
- 이벤트 리스너는 `AbortController`로 범위를 관리해 재초기화에 따른 누적을 막는다.
- 작가별 링크는 현재 로케일에 맞는 작가 페이지를 가리키며, 아바타 렌더링은 `Avatars.astro`에 맡긴다.

관련 컴포넌트를 수정할 때는 모든 지원 로케일의 문자열을 함께 확인하고, 키보드 조작과 다이얼로그의 접근 가능한 이름을 유지한다.
