# CDN 이미지 라우팅

## 현재 상태

CDN 설정은 `src/settings/site.settings.ts`의 `SITE.cdn`에서 관리함.

```ts
cdn: {
  imageBaseUrl: 'https://cdn.jsdelivr.net/gh/hyngng/hyngng.github.io.resources@master',
}
```

## Markdown 본문 이미지

`astro.config.mjs`에서 `remarkCdnImages` 플러그인을 연결함.

Markdown 이미지 노드(`![alt](url)`) 및 HTML `<img src="...">` 태그(인라인/블록 여부 무관) 중 로컬 경로를 CDN URL로 자동 변환함.
- `remarkCdnImages.ts`: remark 단계에서 마크다운 표준 이미지 노드 변환 (`shouldRewrite()`)
- `rehype-image-wrapper.mjs`: HAST AST 단계에서 HTML `<img>` 요소 변환 및 wrapper 주입 (`shouldRewrite()`)

```md
![name](/yyyy-mm-dd/path/filename.webp)      ← 마크다운 이미지
<img src="/yyyy-mm-dd/path/filename.webp">   ← HTML 이미지
```

위 형태는 빌드 시 모두 아래처럼 변환됨.

```text
https://cdn.jsdelivr.net/gh/hyngng/hyngng.github.io.resources@master/yyyy-mm-dd/path/filename.webp
```

`https://...` 같은 스킴 포함 URL이나 `//...` 같은 protocol-relative URL은 변경하지 않음.

### raw HTML 블록 이미지 처리 (`rehype-raw`)

블록 레벨 raw HTML(`<div class="row"><div class="col-md-6"><img ...></div></div>` 등)은 remark-parse에서 `html` 노드(문자열)로 파싱되고, remark-rehype를 거치면 `raw` 노드(문자열)로 남는다. `remarkCdnImages`(mdast `image` 노드만)와 `rehypeImageWrapper`(hast `element` 노드만)는 이를 처리하지 못해 CDN 변환이 누락되고 깨진 이미지(404)가 발생한다.

`astro.config.mjs`의 `rehypePlugins` 첫 항목에 `rehypeRaw`를 등록해 이 문제를 해결한다. `rehypeRaw`가 raw HTML 문자열을 hast `element` 노드로 파싱하므로, 이후 실행되는 `rehypeImageWrapper`가 `<img>`의 CDN 변환·`img-wrapper`·`loading=lazy`를 자동 적용한다. `rehypeKatex`보다 앞에 두어 raw HTML 내부의 KaTeX 수식도 변환되도록 한다.

### 레거시 그리드 raw HTML (`.row`/`.col-md-6`)

Jekyll 시절 포스트의 `row`/`col-md-6` 2열 그리드는 `src/styles/typography.css`의 `article .row`(CSS Grid, `repeat(2, 1fr)`)로 지원한다. `gap`은 `--space-image-grid-gap`(1rem), 상하 마진은 `--space-image-caption-margin`(2rem)을 사용하며, `@media (max-width: 960px)`에서 1열로 접힌다.

```html
<div class="row">
    <div class="col-md-6">
        <img src="/2022-08-24-lavad-devlog/lavad-bug1.webp" alt="lavad-bug1">
    </div>
    <div class="col-md-6">
        <img src="/2022-08-24-lavad-devlog/lavad-bug2.webp" alt="lavad-bug2">
    </div>
</div>
```

⚠️ **작성 규칙**: 각 `.row` 블록 내부에 **빈 줄을 넣지 말 것**. CommonMark type-6 HTML 블록은 첫 빈 줄에서 끝나므로, `.row` 안에 빈 줄이 있으면 `<div>`들이 분리되고 내부 `<img>`가 `<code>` 블록으로 변환되어 깨진다. 두 `.row` 사이의 빈 줄은 무해하다. 이미지의 CDN 변환·`img-wrapper`·`loading=lazy`는 `rehype-raw` → `rehype-image-wrapper`가 자동 적용한다.

## 아키텍처 원칙

이미지 URL은 두 개의 독립된 차원에서 동작함:

- **`public/` 정적 자산**: 파일 시스템이 직접 서비스. 라우터 개입 없음.
- **MDX 이미지**: `remarkCdnImages` 및 `rehypeImageWrapper`가 CDN URL로 변환. 라우터와 무관.

`onerror` 폴백 없이 CDN URL만 사용. 라우트 패턴(`[lang]/[author]/[slug]`)과 정적 자산이 절대 충돌하지 않는 구조.

## 작가 아바타 CDN 변환

`src/utils/cdn.ts`의 `resolveCdnPath()` 함수가 상대경로를 CDN URL로 자동 변환한다. `getAuthor()` 내부에서 호출되어 아바타 경로를 변환한다.

```typescript
resolveCdnPath('avatar/hyngng-white.webp')
→ 'https://cdn.jsdelivr.net/gh/.../avatar/hyngng-white.webp'
```

## 프론트매터 이미지 경로 규칙

포스트 프론트매터의 `image.path`와 `og_image`는 `/`로 시작하는 절대경로 또는 전체 URL(`https://...`)만 사용한다.

```yaml
image:
    path: /2026-03-12-sabok-logs/preview-image.webp
    lqip: data:image/webp;base64,...
    alt: "미리보기 이미지"
```

상대경로(`preview-image`, `dir/file.webp`)를 사용하면 `src/content.config.ts`가 빌드 시 `[content.config] ... should be an absolute path` 경고를 출력한다. 빌드는 실패하지 않지만 상대경로는 CDN URL로 변환되지 않아 깨진 이미지가 되므로 절대경로를 사용한다.

## 공유 유틸리티 (`src/utils/cdn.ts`)

CDN URL 변환 로직을 `content.config.ts`와 `authors.settings.ts`가 공유한다:

| 함수 | 용도 |
|---|---|
| `toAbsoluteImageUrl(val)` | 로컬 절대경로 → CDN URL 변환 (콘텐츠 스키마용) |
| `resolveCdnPath(path)` | 상대경로/절대경로 → CDN URL 변환 (작가 아바타용) |
| `isLocalAbsolutePath(url)` | 로컬 절대경로 여부 판별 |

## 관련 파일

- `src/settings/site.settings.ts`: `SITE.cdn.imageBaseUrl`
- `src/utils/cdn.ts`: CDN URL 변환 공유 유틸리티
- `src/plugins/remark-cdn-images.ts`: Markdown 이미지 URL 변환 (`shouldRewrite()`)
- `src/plugins/rehype-image-wrapper.mjs`: HTML <img> 태그 CDN URL 변환 및 wrapper 주입 (`shouldRewrite()`)
- `src/settings/authors.settings.ts`: `getAuthor()`에서 `resolveCdnPath()` 호출
- `astro.config.mjs`: Markdown processor 연결 (`rehypePlugins` 첫 항목의 `rehypeRaw`가 raw HTML 블록을 element로 파싱)
