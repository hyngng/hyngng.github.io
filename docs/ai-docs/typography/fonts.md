# 폰트 설정

## 현재 상태

Pretendard 1.3.9를 self-host하고, 빌드 시 사이트에서 실제로 쓰는 글자만 남긴 WOFF2 서브셋을 생성한다.

- 사용 weight: `400`(본문), `700`(제목/강조). 기존 `800` 참조는 `700`으로 통일했다.
- 생성 결과: `public/fonts/Pretendard/Pretendard-Regular.woff2`, `Pretendard-Bold.woff2` (각 약 116 KiB).
- `src/styles/pretendard.css`는 두 개의 `@font-face`만 선언한다. unicode-range 92개를 나열하던 동적 서브셋 CSS는 제거했다.
- `Head.astro`에서 400/700 두 파일을 preload한다.
- 코드용 Reddit Mono는 TTF variable font를 WOFF2로 변환해 `public/fonts/Reddit_Mono/`에서 로드한다. 코드가 있는 화면에서만 필요하므로 preload하지 않는다.\n- 새 로케일을 추가할 때는 `scripts/build-fonts.mjs`의 `addIntlText()` 로케일 목록에도 추가해 해당 언어의 날짜 표시 글리프가 서브셋에 포함되게 한다.

### 파일 구조

| 경로 | 역할 |
|---|---|
| `src/assets/fonts/Pretendard-1.3.9/full/Pretendard-Regular.woff2` | 400 서브셋 생성 원본 |
| `src/assets/fonts/Pretendard-1.3.9/full/Pretendard-Bold.woff2` | 700 서브셋 생성 원본 |
| `src/assets/fonts/Pretendard-1.3.9/LICENSE.txt` | Pretendard 라이선스 |
| `scripts/build-fonts.mjs` | 사이트 텍스트 수집 + `subset-font` 실행 |
| `public/fonts/Pretendard/*.woff2` | 빌드 산출물(개발 서버용으로 저장소에도 커밋) |
| `src/styles/pretendard.css` | `@font-face` 선언 |
| `public/fonts/Reddit_Mono/RedditMono-VariableFont_wght.woff2` | 코드 폰트 |
| `public/fonts/Reddit_Mono/redditmono.css` | 코드 폰트 `@font-face` |

## 빌드 파이프라인

`scripts/build-fonts.mjs`는 다음 순서로 동작한다.

1. `posts/**/*.{md,mdx}`와 `src/**/*.{ts,astro,mjs,css}`에서 문자를 수집한다.
2. 7개 로케일의 `Intl.DateTimeFormat` 출력(날짜·시간대 이름)과 ASCII/공백 기본 문자를 추가한다.
3. full WOFF2 원본을 `subset-font`(harfbuzz wasm)로 서브셋해 `public/fonts/Pretendard/`에 쓴다.

`package.json`에서 `predev`와 `prebuild`가 `npm run fonts`를 실행하므로 개발 서버와 배포 빌드 모두 최신 글자 집합을 사용한다. 콘텐츠에 새 글자가 추가되면 다음 `npm run dev`/`npm run build`에서 자동 반영된다. 생성 파일은 개발 서버가 바로 사용할 수 있도록 저장소에 포함한다.

### `src/components/Head.astro`

```astro
<link rel="preload" href="/fonts/Pretendard/Pretendard-Regular.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
<link rel="preload" href="/fonts/Pretendard/Pretendard-Bold.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
```

### `src/settings/site.settings.ts`

`SITE.fonts.baseStack`에서 `--font-pretendard`를 폰트 스택 최상단에 배치한다.

```ts
  fonts: {
    baseStack: "var(--font-pretendard), Inter, system-ui, sans-serif",
  },
```

### 타이포그래피 간격 정책

`src/styles/typography.css`는 포스트 본문(`article`) 내부의 마크다운 콘텐츠에 대한 **시각적 스타일링과 간격(margin)을 모두 담당**합니다.

`article` 내부의 주요 HTML 요소별 간격 규칙:

| 요소 | 간격 변수 | 위치 |
|------|----------|------|
| `p` | `var(--space-post-paragraph) 0` | `typography.css:13` |
| `ol, ul` | `var(--space-post-paragraph) 0` | `typography.css:35` |
| `hr` | `calc(var(--space-post-paragraph) * 2) 0` | `typography.css:70` |
| `blockquote` | `1rem 0` | `typography.css:77` |
| `h1-h6` | `var(--space-post-heading-body) 0 1rem` 등 | `typography.css:88-109` |
| `pre` | `var(--block-margin)` | `typography.css:132` |
| `table` | `var(--space-post-paragraph) 0` | `typography.css:147` |

`PostLayout.astro`는 `article` 컨테이너의 외부 간격(PostBody 영역 마진 등)을 담당합니다. `global.css`의 `:root` 변수(`--space-post-paragraph`, `--space-post-heading-body` 등)가 간격 토큰의 단일 소스입니다.

Mermaid 다이어그램의 `line-height: 16px` 설정 및 코드블록의 `pre.mermaid` 배경색 오버라이드도 `typography.css` 내에서 처리됩니다.

## 이전 구조 (폐기됨)

1. Astro 내장 Fonts API(`fonts` config + `<Font preload>`)로 400/700 전체 서브셋(약 525 KiB)을 preload하던 방식 — 모바일 LCP를 지배해 제거.
2. unicode-range 92개 × 400/700/800 동적 서브셋(276파일, 약 3.5MB)을 `public/fonts/Pretendard/`에 두던 방식 — 첫 화면에서 22개 폰트 요청이 발생해 제거.
3. `site.settings.ts`에 `preloads`/`faces` 객체를 주입하고 `Head.astro`에서 `@font-face` 문자열을 동적 생성하는 루프 방식 (폐기)
4. `src/styles/fonts.css`에서 직접 `@font-face` 및 상대경로 참조로 로드하는 방식 (폐기)
