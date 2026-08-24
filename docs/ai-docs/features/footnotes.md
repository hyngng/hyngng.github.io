# 각주 (Footnotes)

## 배경

`remark-rehype`가 각주 섹션을 렌더링할 때 `<h2>` 형태의 라벨을 항상 생성한다:

```html
<section data-footnotes class="footnotes">
  <h2 class="sr-only" id="footnote-label">Footnotes</h2>
  ...
</section>
```

`mdast-util-to-hast`의 `footer()`(`lib/footer.js`)가 이 라벨을 만든다. GFM 스펙(및 GitHub)은
이 라벨을 접근성 전용으로 설계했기 때문에 `className: ['sr-only']`를 기본으로 부여한다.
그러나 이 프로젝트에는 `.sr-only` CSS가 없어 라벨이 시각적으로 노출되었고, `h2`이므로
`rehypeHeadingIds`가 TOC headings에 포함시켜 목차까지 오염시켰다.

## 왜 rehype 플러그인으로 제거하지 않는가

`mdast-util-to-hast`의 `footer()`는 `footnoteLabel`(`default 'Footnotes'`)을 항상 출력하며,
빈 문자열을 주어도 `|| 'Footnotes'` 폴백이 있어 제거할 수 없다. `<section>`에는
`aria-label`도 없으므로(13.2.1 기준), 라벨 요소를 제거하면 스크린리더가 각주 섹션의
정체를 알 수 없다. 따라서 DOM 제거가 아닌 **요소 변환 + CSS 숨김**으로 해결한다.

## 해결 방식

### 1. 라벨 요소를 `h2` → `span`으로 변환 (`astro.config.mjs`)

```js
processor: unified({
  remarkRehype: {
    footnoteLabelTagName: 'span',
  },
  ...
})
```

- `rehypeHeadingIds`는 `tagName[0] !== 'h'`인 요소를 headings에서 제외하므로
  (`rehype-collect-headings.js`), TOC 오염이 사라진다.
- `id="footnote-label"`은 유지되어 각주 참조 링크의 `aria-describedby` 연결이 보존된다.

### 2. `.sr-only` CSS 추가 (`src/styles/global.css`)

`footer()`가 부여하는 `className: ['sr-only']`가 실제로 동작하도록 표준
`visually-hidden` 유틸리티를 정의한다. 시각적으로는 숨겨지고 스크린리더에는 읽힌다.

```css
.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}
```

### 3. 로케일별 라벨 번역 (`rehype-footnote-tooltip.mjs` + `src/locales/`)

라벨 텍스트는 `mdast-util-to-hast` 옵션(`footnoteLabel`)으로 지정할 수 있지만
이 옵션은 전역이라 포스트별 로케일에 대응할 수 없다. 따라서
`rehype-footnote-tooltip.mjs`가 `(tree, file)` 시그니처에서 `file.history[0]` 경로의
`/posts/{lang}/...` 구조로 로케일을 추정하고, `#footnote-label`의 텍스트를
`getLocale(lang).footnote.label`로 교체한다.

- `Locale` 인터페이스에 `footnote.label` 추가 (`src/locales/index.ts`)
- 7개 로케일 번역: ko=`각주`, en=`Footnotes`, ru=`Сноски`, fr=`Notes de bas de page`,
  es=`Notas al pie`, ja=`脚注`, zh=`脚注`

이 플러그인은 원래 각주 툴팁(`.footnote-tooltip`, `role="tooltip"`)을 만드는 기존
플러그인이므로, 라벨 교체 로직을 같은 플러그인에 합쳐 별도 플러그인 도입을 피한다.

## 산출 HTML

```html
<section data-footnotes class="footnotes">
  <span class="sr-only" id="footnote-label">각주</span>
  ...
</section>
```

## 참고: `aria-describedby` 처리

`rehype-footnote-tooltip.mjs`는 각주 참조 링크(`node`)의 `properties.ariaDescribedby`(hast 표준 속성명, 소문자 `b`)를 **일관되게 읽고 씁니다**.

```js
const existing = node.properties.ariaDescribedby;
node.properties.ariaDescribedby = existing ? `${existing} ${tooltipId}` : tooltipId;
```

즉 플러그인과 라이브러리 간 대소문자 불일치는 발생하지 않습니다. 각주 라벨은 `id="footnote-label"`로, 툴팁은 `id="fn-tooltip-{n}"`으로 각각 고유한 참조 지점을 가지며, 참조 링크는 툴팁 `id`를 가리킵니다.

## 검증

- `npm run build` 성공
- `npx astro check` 0 errors
- dist에서 각주 포스트(7개 언어)에 `<span class="sr-only" id="footnote-label">` 확인,
  `<h2 ... id="footnote-label">` 부재, TOC headings에 라벨 미포함 확인

## 관련 문서

- [Remark Directives](./remark-directives.md) — remark/rehype 단계 분리와의 대조
- [Post routing & i18n](./posts.md) — 포스트 본문 파이프라인 내 각주 위치
- [Typography](../design/typography.md) — `.footnote-ref-wrapper`/`.footnote-tooltip` 표현
