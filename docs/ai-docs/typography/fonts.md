# 폰트 설정

## 현재 상태

Astro 내장 Fonts API를 사용하여 폰트를 선언하고 로드합니다.

### `astro.config.mjs`

Astro config 내에 `fonts` 옵션을 추가하여 사용할 로컬 폰트의 variant 목록과 생성될 CSS 변수명을 설정합니다.

```js
import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  // ...
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Pretendard",
      cssVariable: "--font-pretendard",
      options: {
        variants: [
          { weight: 300, style: "normal", src: ["./src/assets/fonts/Pretendard-1.3.9/web/static/woff2-subset/Pretendard-Light.subset.woff2"] },
          { weight: 400, style: "normal", src: ["./src/assets/fonts/Pretendard-1.3.9/web/static/woff2-subset/Pretendard-Regular.subset.woff2"] },
          { weight: 500, style: "normal", src: ["./src/assets/fonts/Pretendard-1.3.9/web/static/woff2-subset/Pretendard-Medium.subset.woff2"] },
          { weight: 600, style: "normal", src: ["./src/assets/fonts/Pretendard-1.3.9/web/static/woff2-subset/Pretendard-SemiBold.subset.woff2"] },
          { weight: 700, style: "normal", src: ["./src/assets/fonts/Pretendard-1.3.9/web/static/woff2-subset/Pretendard-Bold.subset.woff2"] },
        ],
      },
    },
  ],
});
```

### `src/components/Head.astro`

Astro 내장 `<Font />` 컴포넌트를 사용하여 헤더에서 최적화 및 preload 처리를 일임하도록 구현했습니다.

```astro
---
import { Font } from 'astro:assets';
---
<head>
    <Font cssVariable="--font-pretendard" preload />
    <!-- ... -->
</head>
```

### `src/settings/site.settings.ts`

`SITE.fonts.baseStack`에서 생성된 CSS 변수 `--font-pretendard`를 폰트 스택 최상단에 배치합니다.

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

1. `site.settings.ts`에 `preloads`/`faces` 객체를 주입하고 `Head.astro`에서 `@font-face` 문자열을 동적 생성하는 루프 방식 (폐기)
2. `src/styles/fonts.css`에서 직접 `@font-face` 및 상대경로 참조로 로드하는 방식 (폐기 - CLS 방지 및 최적화 폴백을 위해 Astro 내장 Fonts API로 교체됨)
