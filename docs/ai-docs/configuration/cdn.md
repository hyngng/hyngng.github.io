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

Markdown 이미지 노드 중 로컬 경로만 CDN URL로 변환함. `shouldRewrite()` 함수가 `https://`, `http://`, `//` 스킴을 필터링하여 외부 URL은 무시하고, 절대경로와 상대경로 모두 변환 대상이 됨.

```md
![name](/yyyy-mm-dd/path/filename.webp)      ← 절대경로
![name](./hero.png)                            ← 상대경로
```

위 형태는 빌드 시 아래처럼 변환됨.

```text
https://cdn.jsdelivr.net/gh/hyngng/hyngng.github.io.resources@master/yyyy-mm-dd/path/filename.webp
https://cdn.jsdelivr.net/gh/hyngng/hyngng.github.io.resources@master/hero.png
```

`https://...` 같은 스킴 포함 URL이나 `//...` 같은 protocol-relative URL은 변경하지 않음.

## 아키텍처 원칙

이미지 URL은 두 개의 독립된 차원에서 동작함:

- **`public/` 정적 자산**: 파일 시스템이 직접 서비스. 라우터 개입 없음.
- **MDX 이미지**: `remarkCdnImages`가 CDN URL로 변환. 라우터와 무관.

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
- `src/settings/authors.settings.ts`: `getAuthor()`에서 `resolveCdnPath()` 호출
- `astro.config.mjs`: Markdown processor 연결
