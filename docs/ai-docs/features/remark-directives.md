# remark-directive 통합 시스템

이 문서는 이미지 정렬, 라이트/다크 이미지, 유튜브 임베딩을 remark-directive 기반으로 통합하는 시스템을 설명합니다.

---

## 1. 배경

### `.md`에서의 이미지 속성: `{.class}` 구문

`.md` 파일에서는 이미지 바로 뒤에 `{.class}` 구문으로 클래스를 부여할 수 있습니다:

```markdown
![alt](src){.img-light}
![alt](src){.img-dark .border}
```

이는 `remark-image-attributes.mjs` 플러그인이 remark AST 단계에서 `{...}` 텍스트를 파싱하여 이미지 노드의 `hProperties`에 클래스를 주입합니다.

### `.mdx`에서의 제약: `{ .class }` 불가

MDX v3는 `{ }`를 JavaScript 표현식으로 해석하므로, `.md`에서 쓰는 `{.class}` 구문은 **MDX에서 사용할 수 없습니다**. MDX에서는 directive 구문(`:img-light[...]`)을 사용해야 합니다.

### 왜 remark-directive 순정이 아닌가

remark-directive는 AST 파싱만 하고 HTML 변환은 하지 않습니다:

```markdown
<!-- remark-directive 순정 — 의미 없는 <div> 생성 -->
:left[![alt](src)]{ .w-50 }
```

**결과:** `<div><img></div>` — 지시어 이름과 클래스 모두 소멸

### 최종 선택: remark-directive + custom plugin

```markdown
<!-- 최종 문법 — 올바르게 렌더링 -->
:left[![alt](src)]{ .w-50 }
```

**결과:** `<span class="left w-50"><img src="..." /></span>`

---

## 2. 문법 레퍼런스

### 이미지 정렬

```markdown
:left[![alt](src)]                          → class="left"
:right[![alt](src)]                         → class="right"
:center[![alt](src)]                        → class="center"
:left[![alt](src)]{ .w-50 .shadow }         → class="left w-50 shadow"
:right[![alt](src)]{ .w-75 .rounded }       → class="right w-75 rounded"
```

### 라이트/다크 이미지

#### `.md` 파일 (권장)
```markdown
![alt](/light.png){.img-light}
![alt](/dark.png){.img-dark}
```

#### `.mdx` 파일
```markdown
:img-light[![alt](/light.png)]
:img-dark[![alt](/dark.png)]
```

### 유튜브

```markdown
::youtube{id="dQw4w9WgXcQ"}
```

### 비디오

```markdown
::video{src="https://example.com/video.mp4"}
::video{src="/local/video.webm"}
::video{src="/local/video.ogv" type="video/ogg"}
```

지원 확장자: `.mp4`, `.webm`, `.ogv` (기본값 `video/mp4`). `type` 속성으로 MIME 타입 명시 가능.

### Admonitions

```markdown
:::tip
내용
:::
```

**출력:**
```html
<div class="admonition admonition-tip">
  <span class="admonition-icon" aria-hidden="true"></span>
  <div class="admonition-body">
    <p>내용</p>
  </div>
</div>
```

**구조:**
- `.admonition` — `position: relative` 컨테이너 (좌측 `padding-left: 3rem`으로 아이콘 영역 확보)
- `.admonition-icon` — `position: absolute` (레이아웃 흐름에서 분리). Font Awesome 6 Solid `::before` (`aria-hidden="true"`)
- `.admonition-body` — 본문 래퍼 (기본 블록 레이아웃, 추가 스타일 불필요)
- 타입: `tip` (lightbulb `\f0eb`), `info` (circle-info `\f05a`), `warning` (triangle-exclamation `\f071`), `danger` (circle-exclamation `\f06a`)
- 색상 변수: `--color-admonition-bg`, `--color-admonition-{type}-icon` (light.css / dark.css)

---

## 3. CSS 유틸리티 클래스

> 모든 유틸리티 클래스는 Bootstrap 5 규격을 따르며 `!important`로 선언되어 있습니다.

### 정렬 (Bootstrap 5 float)
```css
.left { float: left !important; margin-right: 1rem; margin-bottom: 1rem; }
.right { float: right !important; margin-left: 1rem; margin-bottom: 1rem; }
.float-start { float: left !important; }
.float-end { float: right !important; }
.float-none { float: none !important; }
```

### 너비 (Bootstrap 5 sizing)
```css
.w-25 { width: 25% !important; }
.w-50 { width: 50% !important; }
.w-75 { width: 75% !important; }
.w-100 { width: 100% !important; }
.w-auto { width: auto !important; }
.mw-100 { max-width: 100% !important; }
```

### 테두리 (Bootstrap 5 border)
```css
.border { border: var(--border-width, 1px) var(--border-style, solid) var(--color-border) !important; }
.border-0 { border: 0 !important; }
.border-top { border-top: var(--border-width, 1px) var(--border-style, solid) var(--color-border) !important; }
.border-end { border-right: ... !important; }
.border-bottom { border-bottom: ... !important; }
.border-start { border-left: ... !important; }
```
- 테두리 굵기: `.border-1` ~ `.border-5`
- 테두리 색상: CSS 변수 `--color-border` (라이트 `#dee2e6`, 다크 `#495057`)

### 모서리 곡률 (Bootstrap 5 border-radius)
```css
.rounded { border-radius: 0.375rem !important; }
.rounded-0 { border-radius: 0 !important; }
.rounded-1 { border-radius: 0.25rem !important; }
.rounded-2 { border-radius: 0.375rem !important; }
.rounded-3 { border-radius: 0.5rem !important; }
.rounded-4 { border-radius: 0.75rem !important; }
.rounded-5 { border-radius: 1rem !important; }
.rounded-10 { border-radius: 10px !important; } /* custom extension */
.rounded-circle { border-radius: 50% !important; }
.rounded-pill { border-radius: 50rem !important; }
```
방향별: `.rounded-top`, `.rounded-end`, `.rounded-bottom`, `.rounded-start`

### Clearfix

`.clearfix` 유틸리티는 제거됨 (2026-08). float 정리는 `article::after { clear: both; }`(`src/styles/typography.css`)가 담당하므로 별도 클래스가 필요 없다.

### 라이트/다크 모드
```css
.img-light { display: block; }
.img-dark { display: none; }
html.dark .img-light { display: none; }
html.dark .img-dark { display: block; }
```

---

## 4. 플러그인 구조

### `remark-image-attributes.mjs`

`.md` 파일에서 `![alt](url){.class1 .class2}` 구문을 파싱하여 이미지 노드에 클래스를 부여합니다.

**동작:**
1. `image` 노드를 순회
2. 바로 다음 텍스트 노드에서 `{...}` 패턴을 찾음
3. `.class` 형태의 값을 파싱하여 `data.hProperties.className`에 주입
4. 텍스트 노드에서 `{...}` 부분을 제거 (raw 텍스트 유출 방지)

**출력 예시:**
```
![alt](src){.img-light .border}
→ <img src="src" alt="alt" class="img-light border" />
```

> **참고:** `astro.config.mjs`에서 `markdown.processor: unified({...})`를 사용해야 `.md` 파일에서 remark/rehype 플러그인이 정상 동작합니다. 표준 `remarkPlugins`/`rehypePlugins` 배열만으로는 `.md` 파일에 플러그인이 적용되지 않을 수 있습니다.

### `remark-directive-classes.mjs`

textDirective를 `<span class="...">`로 변환합니다.

**동작:**
1. textDirective 노드를 순회
2. 지시어 이름(`node.name`)을 클래스로 추출
3. `{ }` 속성(`node.attributes`)을 클래스로 추출
4. `data.hName = 'span'`, `data.hProperties = { class: '...' }` 설정

**출력 예시:**
```
:left[![alt](src)]{ .w-50 .shadow }
→ <span class="left w-50 shadow"><img src="src" alt="alt" /></span>
```

### `remark-youtube.mjs`

`::youtube{id="..."}` leafDirective를 YouTube iframe으로 변환합니다.

**출력 예시:**
```
::youtube{id="dQw4w9WgXcQ"}
→ <div class="video-embed"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" ...></iframe></div>
```

**캡션:** 바로 다음 줄에 `*캡션*`을 작성하면 `<figure class="media-figure"><div class="video-embed">…</div><figcaption>…</figcaption></figure>`로 변환됩니다 (빈 줄 허용).

### `remark-video.mjs`

`::video{src="..."}` leafDirective를 `<video>` 요소로 변환합니다.

**동작:**
1. `resolveCdnPath(src)`를 사용하여 상대/절대 로컬 경로인 경우 `SITE.cdn.imageBaseUrl`과 자동 결합된 CDN URL로 변환합니다.
2. `src`에서 확장자 추출 → MIME 타입 자동 결정 (`.webm` → `video/webm`, `.ogv` → `video/ogg`, 기본 `video/mp4`)
3. `type` 속성이 명시되면 자동 추론보다 우선

**출력 예시:**
```
::video{src="/local/video.mp4"}
→ <video class="video-native" controls playsinline><source src="https://cdn.jsdelivr.net/gh/.../local/video.mp4" type="video/mp4"></video>
```

**캡션:** 바로 다음 줄에 `*캡션*`을 작성하면 `<figure class="media-figure"><video class="video-native">…</video><figcaption>…</figcaption></figure>`로 변환됩니다 (빈 줄 허용).

**CSS:** `article .video-native` (typography.css) — `max-width: 100%`, `max-height: 432px`, 검은 배경. figure 내부에서는 마진이 0으로 리셋됩니다.

### `remark-audio.mjs`

`::audio{src="..."}` leafDirective를 브라우저 네이티브 `<audio>` 요소로 변환합니다.

**동작:**
1. `resolveCdnPath(src)`를 사용하여 상대/절대 로컬 경로인 경우 CDN URL로 변환합니다.
2. `src`에서 확장자 추출 → MIME 타입 자동 결정 (`.ogg`/`.oga`/`.opus` → `audio/ogg`, `.wav` → `audio/wav`, `.flac` → `audio/flac`, `.m4a` → `audio/mp4`, `.aac` → `audio/aac`, 기본 `audio/mpeg`)
3. `type` 속성이 명시되면 자동 추론보다 우선

**출력 예시:**
```
::audio{src="/local/audio.mp3"}
→ <audio class="audio-native" controls preload="metadata"><source src="https://cdn.jsdelivr.net/gh/.../local/audio.mp3" type="audio/mpeg"></audio>
```

**캡션:** 바로 다음 줄에 `*캡션*`을 작성하면 `<figure class="media-figure"><audio class="audio-native">…</audio><figcaption>…</figcaption></figure>`로 변환됩니다 (빈 줄 허용).

**CSS:** `article .audio-native` (typography.css) — `display: block`, `width: 100%`. figure 내부에서는 마진이 0으로 리셋됩니다.

---

## 4-1. `remark-media-caption.mjs`

미디어 + 인접 emphasis를 remark 단계에서 `<figure>`/`<figcaption>`으로 정규화합니다.

**동작:**
1. **Rule A**: 이미지(또는 `:x` 등 이미지를 감싼 textDirective)가 있는 문단에 직접 자식 `<em>`이 있으면 → `paragraph.data.hName = 'figure'`, 해당 `emphasis`들은 `data.hName = 'figcaption'`으로 변환.
2. **Rule B**: `::video`/`::youtube` leafDirective 바로 다음에 emphasis만으로 구성된 문단이 오면(빈 줄 허용) leafDirective를 문단 첫 자식으로 이동 후 Rule A 적용.
3. **제외**: float(`:left`/`:right` textDirective 또는 이미지의 `{ .left }` 클래스)가 있는 미디어는 figure로 변환하지 않음 — 기존 `<p class="has-float">` + `processFloats` 동작 유지.

변환은 mdast-util-to-hast의 표준 확장 메커니즘(`data.hName`/`data.hProperties`)만 사용하며, leafDirective 렌더링은 `defaultUnknownHandler`가 담당합니다.

**출력 예시:**
```
![alt](src)
*캡션*
→ <figure class="media-figure"><span class="img-wrapper"><img …></span><figcaption>캡션</figcaption></figure>
```

---

## 5. 기존 플러그인과의 관계

| 기존 플러그인 | 상태 | 대체 |
|--------------|------|------|
| `remark-image-align.mjs` | 삭제 | `remark-directive-classes.mjs` |
| `remark-theme-picture.mjs` | 삭제 | CSS 클래스 (`.img-light`, `.img-dark`) |
| `remark-image-attributes.mjs` | **신규** | `.md`에서 `{.class}` 이미지 속성 부여 |
| `remark-admonitions.mjs` | 유지 | icon + body 구조 주입 (Font Awesome 아이콘) |
| `remark-cdn-images.ts` | 유지 | 변경 없음 |
