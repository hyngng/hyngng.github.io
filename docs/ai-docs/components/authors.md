# Authors 컴포넌트

## 현재 상태

루트 페이지의 글쓴이 영역은 `src/components/Authors.astro`와 `src/components/Author.astro`로 분리함.

- 모바일(≤960px)에서는 `.authors` 섹션 자체가 `global.css`에서 `display: none` 처리되어 표시되지 않는다.
- 과거에 있던 모바일 전용 '접기/펼치기 토글'(`.authors-toggle` 버튼 + `initAuthorsToggle` 스크립트)은 모바일에서 글쓴이 섹션이 제거되면서 완전히 삭제됨. 관련 `toggleAria` 로케일 필드도 정리됨.

구조:

- 루트 페이지가 `Authors`를 포함함.
- `Authors`가 여러 `Author`를 포함함.
- `Author`는 다음 props를 받음:
    - `avatar`: (선택) 아바타 이미지 URL
    - `name`: 작가 이름 (prefix 없이 원본 name만 전달)
    - `info`: 부가 정보
    - `id`: 작가 식별자 (링크 생성용)
    - `clickable`: (선택, 기본값 `true`) 작가 영역 클릭 시 상세 페이지 이동 여부
- `AUTHOR_PREFIX = '@'` 상수는 `src/settings/authors.settings.ts`에 정의되어 `Author.astro`가 import하여 name 앞에 붙여 렌더링합니다.


`avatar`가 없거나 빈 문자열이면 `#F1F1F1` 배경의 원형 placeholder를 표시함.

섹션 제목은 `src/locales/ko-KR.ts`, `src/locales/en-US.ts`의 `authors.title`에서 가져옴. `Authors` 컴포넌트의 `title` prop으로 필요 시 override 가능함.

## 데이터 역할

`avatar`와 `name`은 `src/settings/authors.settings.ts`에서 제공하는 값을 사용함. 루트 페이지는 `ALL_AUTHORS`를 기준으로 전체 author를 렌더링해야 하며, 컴포넌트 호출부에서 author 이름을 직접 하드코딩하거나 일부 id 목록을 별도로 유지하지 않음.

## 라우팅

두 페이지 컴포넌트는 레이아웃과 스타일 중복을 방지하기 위해 `src/components/AuthorPageContent.astro` 컴포넌트를 사용함. 이를 통해 코드 중복 없이 일관된 스타일과 구조를 유지하며, 유지 보수가 용이해짐.

`info`는 화면 맥락에 따라 달라져야 함.

- 메인 페이지: 해당 계정으로 작성된 글 수.
- 포스트 카드: 포스트 작성 날짜의 상대값.
- 포스트 페이지: 해당 글이 해당 작가의 몇 번째 글인지.

## 페르소나 (Persona) 시스템 및 모달

SNS(X, Threads, Instagram 등)의 프로필 디자인을 모티브로, 별도의 사이드바/인라인 목록 대신 Hero 영역의 description 동일 행에 위치한 메타 링크와 네이티브 `<dialog>` 모달로 일원화함.

- **Hero 트리거 (`src/components/Hero.astro`)**:
  - `personaCountText` prop을 통해 Hero 설명(`description`)과 동일 행(`.hero-desc-row`)에 SNS 스타일의 메타 텍스트 링크를 표시 (`.hero-personas-trigger`).
  - 좌측의 `description`은 `flex: 1 1 auto; min-width: 0;`로 남은 너비에 맞춰 유연하게 줄바꿈되며, 우측의 페르소나 링크 영역을 절대 침범하지 않음.
  - 루트 페이지: `locale.authors.personaCount(n)` (예: `5개 페르소나`)
  - 작가 페이지: `locale.authors.otherPersonaCount(n)` (예: `4개 다른 페르소나`)
  - 폰트 크기는 사이트 메타 정보와 일치하는 `--author-name-size: 14px`, line-height는 description과 일치(22px)시켜 베이스라인 정렬.
  - 볼드 없이 일반 텍스트 굵기 및 description과 동일한 색상(`font-weight: 400; color: var(--color-heading);`)이며, 띄어쓰기 없는 단일 텍스트(`5개 페르소나`)로 렌더링. 호버 시 `--color-accent` 색상 전환.
  - 모바일(≤960px)에서는 동일 행을 유지하지 않고 세로 스택(`flex-direction: column; gap: 0.5rem;`)으로 전환되어 description 아래 다음 행에 적절한 간격으로 배치됨.
  - 접근성: `aria-haspopup="dialog"`, `aria-controls`, `data-modal-target` 속성 부여.

- **모달 컴포넌트 (`src/components/PersonaModal.astro`)**:
  - 웹 표준 HTML5 `<dialog class="persona-modal">` 기반 구현.
  - props:
    - `modalId`: 다이얼로그 ID (루트: `'persona-modal'`, 작가: `'other-persona-modal'`)
    - `title`: 모달 헤더 제목 (기본: `locale.authors.persona`, 작가: `locale.authors.otherPersona`)
    - `authors`: `{ id, name, avatar?, description? }[]`
    - `currentLocale`: 작가 상세 링크용 로케일 문자열
    - `closeAria`: 닫기 버튼 접근성 라벨 (`locale.authors.closeAria`)
  - UI 구조:
    - 헤더: 섹션 제목 + 닫기(X) SVG 버튼
    - 본문: 원형 아바타(디자인 시스템 토큰 `--avatar-size: 40px`, CDN 연동) + `@이름`(`--author-name-size: 14px`) + 로컬라이즈 작가 소개글(`--author-info-size: 12px`) 목록
    - 각 아이템은 클릭 시 해당 작가 상세 페이지(`getAuthorPath`)로 이동.
  - 반응형 디자인:
    - 데스크톱: 화면 중앙 카드 모달 (`max-width: var(--persona-modal-width: 400px)`), 은은한 페이드인 애니메이션.
    - 모바일(≤640px): 화면 하단에 밀착되는 바텀시트(Bottom Sheet) 형태, 상단 모서리 라운딩(`20px 20px 0 0`), safe area 패딩, 슬라이드업 애니메이션.
    - 배경: `::backdrop`에 딤 컬러 및 블러 효과(`backdrop-filter: blur(4px)`).
  - 인터랙션 및 접근성:
    - 트리거 클릭 시 `dialog.showModal()` 호출 및 `html.modal-open` 클래스로 배경 스크롤 차단.
    - 닫기 버튼, ESC 키 누름, 배경(백드롭) 클릭 시 `dialog.close()` 호출 및 스크롤 복원.
    - 스크립트는 `AbortController`를 통해 이벤트 리스너를 누적 없이 안전하게 관리.

## 아바타 공통 컴포넌트 (`src/components/Avatars.astro`)

원형 아바타 UI 패턴과 Hero의 페르소나 아바타 스택 책임을 완전히 캡슐화한 전용 컴포넌트.

- **단일 아바타 모드 (`src?: string`)**:
  - `Author.astro`, `PersonaModal.astro` 등 단일 작가 아바타 렌더링에 사용.
  - 기본 크기는 `--avatar-size` (40px)를 사용하며 `size` prop으로 유연하게 조정 가능.
  - 플레이스홀더 배경(`--author-avatar-placeholder`), 원형 마스킹(`border-radius: 50%`), 지연 로딩(`loading="lazy"`) 및 이미지 로드 에러 처리(`onerror="this.remove()"`) 내장.
- **아바타 스택 모드 (`avatars?: string[]`)**:
  - `Hero.astro`의 페르소나 아바타 스택 렌더링에 사용.
  - 전달받은 목록 중 유효한 URL을 `limit`(기본 3개)만큼 슬라이스하여 겹친 형태로 렌더링.
  - 크기는 `--avatar-stack-size` (24px, 2의 배수 웹 관행), 겹침 간격은 `--avatar-stack-overlap` (8px, 음수 마진), 각 아바타 테두리는 `2px solid var(--color-bg)` 적용.
  - `Hero`는 아바타 스택의 개수 제한/마진/테두리 등 세부 렌더링 로직을 알 필요 없이 `<Avatars avatars={personaAvatars} loading="eager" />`를 호출하여 책임 분리 달성.

## Figma 기준

`메인 페이지 - 라이트` 기준:

- section title `글쓴이`: `x=480`, `y=377`, `w=78`, `h=34`
- 첫 author avatar: `x=480`, `y=443`, `48 x 48`
- 첫 author name: `x=544`, `y=443`, font `18px`, weight `700`
- 첫 author info: `x=544`, `y=472`, font `16px`, weight `400`
- avatar와 text 사이 간격: `16px`
- title과 list 사이 간격: `32px`
