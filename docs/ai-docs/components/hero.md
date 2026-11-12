# Hero 컴포넌트

## 현재 상태

`src/components/Hero.astro`에서 구현함.

props:

- `title`: 표시할 제목.
- `description`: 표시할 설명.

메인 페이지에서는 `src/pages/index.astro`가 `HomePageContent.astro`를 렌더링하고, `HomePageContent.astro`가 `<Hero title={siteMeta.title} description={siteMeta.description} />`로 주입합니다. `siteMeta`는 `getSiteMeta()`가 현재 로케일 기준으로 반환한 값이며, `description`은 `SITE.description`이 아니라 로케일별 `description`입니다.

## Figma 기준

Figma 파일 `BLOGGING`의 `메인 페이지 - 라이트` Frame 기준.

- Frame: `1920 x 2271`
- 배경: `#FFFFFE`
- 콘텐츠 시작: `x=480`
- 콘텐츠 폭: `960`
- Hero title: `x=480`, `y=158`, `w=215`, `h=58`
- Hero title color: `#2E2E2E`
- Hero title font: Inter Bold, `48px`, weight `700`
- Hero description: `x=480`, `y=224`, `w=130`, `h=27`
- Hero description color: `#2E2E2E`
- Hero description font: Inter Regular, `22px`, weight `400`
- title과 description 사이 시각적 간격: 약 `8px` (실제 구현은 `--space-hero-title-description` 변수 사용)

## 토큰

관련 값은 `src/styles/global.css`에서 관리함.

- `--color-heading`
- `--font-size-hero-title`
- `--font-size-hero-title-mobile` (모바일: X/Bluesky 프로필 헤더의 표시 이름 크기(20px) 기준)
- `--font-size-hero-description`
- `--font-size-hero-description-mobile` (모바일: `13px` — X bio(15px)보다 한 단계 더 축소, 사용자 지정)
- `--line-height-hero-title`
- `--line-height-hero-title-mobile` (모바일: `24px`)
- `--line-height-hero-description`
- `--line-height-hero-description-mobile` (모바일: `18px`)
- `--hero-margin-top`
- `--space-hero-title-description` (모바일 ≤960px에서 `8px`으로 오버라이드 — X의 name→bio 간격)
- `--hero-margin-top-mobile` (`16px` — 모바일 breakpoint에서 `--hero-margin-top`을 오버라이드)

## 모바일 스케일

`@media (max-width: 960px)`에서 Hero 전체가 X/Bluesky 프로필 헤더 메트릭을 따른다 (`Hero.astro`):

- `h1`: `--font-size-hero-title-mobile` (`20px`/700) / `--line-height-hero-title-mobile` (`24px`)
- `.hero-description`: `--font-size-hero-description-mobile` (`13px`) / `--line-height-hero-description-mobile` (`18px`)
- 블록 리듬 (X 프로필 헤더 기준): Hero 상단 여백 `16px` → name→description `8px` → description→트리거 `12px` (`.hero-desc-row` gap `0.75rem`)
- `.hero-personas-trigger` ("n개 페르소나 보기"): bio와 동일 라인 (`var(--font-size-hero-description-mobile)`, `13px`) + 로컬 아바타 스택 축소/밀착 — `--avatar-stack-size: 20px`, `--avatar-stack-overlap: 12px` (스택 아바타당 노출 폭 8px)
- 검색창과의 간격은 `global.css`의 `.search-mobile-wrapper { margin-top: 1rem }` (≤960px, `16px`) — X의 팔로워 행→알약 버튼 간격 리듬. 트리거가 검색창 바로 위에 위치.
