# Hero 컴포넌트

## 현재 상태

`src/components/Hero.astro`에서 구현함.

props:

- `title`: 표시할 제목.
- `description`: 표시할 설명.

메인 페이지에서는 `src/pages/index.astro`에서 `SITE.title`, `SITE.description`을 넘겨 사용함.

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
- `--font-size-hero-description`
- `--line-height-hero-title`
- `--line-height-hero-description`
- `--hero-margin-top`
- `--space-hero-title-description`
- `--hero-margin-top-mobile` (모바일 breakpoint에서 `--hero-margin-top`을 오버라이드하는 용도로 사용)
