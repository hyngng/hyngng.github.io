---
title: "깃허브 블로그 템플릿 테마 커스터마이징하기"
categories: [블로그]
tags: [깃허브 블로그, 깃허브, 블로그, 커스텀, 커스터마이징, Github, Chirpy, Blog, Liquid, CSS]
start_with_ads: true

toc: true
toc_sticky: true

date: 2023-11-25
last_modified_at: 2023-12-12
---

# **들어가며**

![new-files-dark](/2023-11-25-first-blog-customization/new-files-dark.png){: .dark .w-50 .right .shadow }
![new-files-light](/2023-11-25-first-blog-customization/new-files-light.png){: .light .w-50 .right .shadow }

지금 사용중인 블로그 템플릿이 그동안 꾸준히 **[개선](https://github.com/cotes2020/jekyll-theme-chirpy)**되었나 봅니다. 버전이 어느새 **6.3.1**로 올라갔습니다. 새단장을 한 테마를 살펴보니 메인 페이지의 포스트에 미리보기 이미지를 띄우는 기능이 생겼고, 전체적으로 색감이 정갈하게 다듬어졌다는 점이 눈에 띕니다.

그래서 업데이트 방법을 찾아보고 있었는데, 찾다보니 하나 알게 된 것이 제가 블로그를 처음 개설할 때 **Chirpy starter** 방식을 사용했다는 것이었습니다. 이 방식은 과정은 간단하지만 커스터마이징 폭이 상당히 좁다는 단점이 있습니다.
일반적인 티스토리, 네이버 블로그 대신 깃허브 블로그를 개설한 이유가 폭넓은 커스터마이징이 가능하다는 장점이 있기 때문이었는데 의미가 퇴색된 느낌입니다. 빠르게 공식 페이지에서 안내하고 있는 **GitHub Fork** 방식으로 변경해주었습니다.

차근차근 이 방식을 따라하니 블로그 파일 개수가 확연히 늘어났습니다. 새로 생긴 `_includes`{: .filepath }, `_javascript`{: .filepath }, `_layouts`{: .filepath }, `_sass`{: .filepath } 폴더를 확인해보니 저장되어 있는 자바스크립트, CSS 파일을 수정하여 블로그 페이지 구성요소를 직접 편집할 수 있도록 되어있어서 몇 가지를 만져줬습니다.

# **템플릿 수정**

## **글씨 크기 수정**

그동안 신경쓰였던 것 중 하나가 폰트 크기가 살짝 크다는 것이었습니다. 글씨 크기를 어떻게 수정하는지 잘 모르기도 했고 기능적으로 불편한 것도 아니었기 때문에 지금까지는 그려러니 하고 넘겼지만 이번에 블로그 새단장을 한 김에 수정하기로 했습니다.

포스트의 글 속성은 `_scss/addon/commons.scss`{: .filepath }의 `.content` 선택자가 담당하는 식으로 되어 있었고, `_scss`{: .filepath }폴더의 CSS 파일은 모두 `assets/css/jekyll-theme-chirpy.scss`{: .filepath }로 `@import`되고 있어 이 파일에 `font-size` 값을 0.98정도로 설정해주었습니다.

```css
.content {
  font-size: 0.98rem;
}
```
{: file="assets/css/jekyll-theme-chirpy.scss" }

## **단락 간격 조정**

마찬가지로 `assets/css/jekyll-theme-chirpy.scss`{: .filepath }에서 단락 간격도 수정해주었습니다. 기본값은 1.25rem 정도로 주어져 있던데 티스토리나 네이버 등 타 블로그 플랫폼과 비교했을 때 글이 너무 빽빽하고 읽기 힘들다는 느낌이 들어 1.5rem 정도로 늘려주었습니다.

다만 이렇게 사용해보니 prompt 또한 `<p>` 태그를 이용하는 관계로 상단에 공백을 같이 생성하는 문제가 있어 `<blockquote>` 태그에 한해 공백이 생성되지 않도록 코드를 별도로 작성했습니다.

```css
p {
  margin-top: 1.5rem;
}

blockquote p {
  margin-top: 0;
}
```
{: file="assets/css/jekyll-theme-chirpy.scss" }

## **Footer 제거**

![footer-remove-light](/2023-11-25-first-blog-customization/footer-remove-light.png){: .light }
![footer-remove-dark](/2023-11-25-first-blog-customization/footer-remove-dark.png){: .dark }
_적용 전후 비교_

순정 Chirpy 테마는 블로그 하단에 왼쪽의 "ⓒ {년도} {이름} 일부 권리 보유'와 오른쪽의 'Powered by Jekyll with Chirpy theme"라는 Footer를 생성합니다. 이중 오른쪽 Footer는 특히 중요한 정보가 아니므로 삭제해 주었습니다. Footer를 생성하는 코드를 찾아 주석처리했어요.

{% raw %}
```liquid
<p>
    {%- capture _platform -%}
        <a href="https://jekyllrb.com" target="_blank" rel="noopener">Jekyll</a>
    {%- endcapture -%}

    {%- capture _theme -%}
        <a href="https://github.com/cotes2020/jekyll-theme-chirpy" target="_blank" rel="noopener">Chirpy</a>
    {%- endcapture -%}

    {{ site.data.locales[include.lang].meta | replace: ':PLATFORM', _platform | replace: ':THEME', _theme }}
</p>
```
{: file="_includes/Footer.html" }
{% endraw %}

## **포스트 네비게이션 제거**

![post-nav-light](/2023-11-25-first-blog-customization/post-nav-light.png){: .light }
![post-nav-dark](/2023-11-25-first-blog-customization/post-nav-dark.png){: .dark }
_포스트 네비게이션. "이전 글"과 "다음 글"로 유저를 안내하고 있다._

포스트 네비게이션은 게시글의 가장 아래에서 현재 글이 작성되기 바로 이전의 글과 다음의 글로 연결하는 기능인데 개인적으로는 왜 있는지 의문입니다. 단순히 시간선상에서 가장 연관성이 있다고 노출을 시키기에는 글 주제가 연관이 없기 때문이죠. 오히려 페이지 하단을 난잡하게 만드는 것 같아 "관련된 글" 섹션만 남기고 싶었고 포스트 네비게이션과 관련된 코드를 모두 주석처리했습니다.

{% raw %}
```liquid
<!--
<nav class="post-navigation d-flex justify-content-between" aria-label="Post Navigation">
  ...
</nav>
-->
```
{: file="_includes/post-nav.html" }
{% endraw %}

## **사이드바 배경색 수정**

사이드바의 배경 색을 수정하고 싶은데 `background-color` 속성을 바로 사용했다간 색상이 다크모드 여부에 상관없이 고정됩니다. 제가 원하는 것은 라이트모드 전용 색상은 그대로 놔두고 다크모드의 색상만 변경하는 것인데, 다행히 Chirpy 테마는 `_sass/colors`{: .filepath } 경로에 다크모드용 `typography-dark.scss`{: .filepath }를 라이트모드용과 구분하고 있어 이 파일에서 다크모드시 사이드바 배경색을 **#1D1D1E**정도로 변경했습니다.

```scss
--sidebar-bg: #1D1D1E;
```
{: file="_sass/colors/typography-dark.scss" }

## **TOC 수정**

Chirpy 테마는 기본적으로 포스트 페이지창 우측에 TOC(Table Of Contents)를 지원합니다. 게시글의 읽고 있는 지점을 확인하거나 원하는 지점으로 바로 이동할 수 있는 등 유용한 기능이기는 하지만, 문제는 테마를 업데이트하니 동작 방식이 불편하게 바뀌었습니다.

정확히 어느 버전부터 이렇게 변경되었는지는 모르겠지만 이전에는 h1 부터 목차를 생성해주던 것이 이제는 h2 이하의 태그가 있어야 목차를 생성해줍니다. 아마 나름의 이유가 있겠지만, 개인적으로 별로라고 생각해서 원래대로 수정해 주었습니다. 코드가 길어 변경한 부분만 작성했습니다.

```js
document.querySelector("main h1")&&tocbot.init({tocSelector:"#toc",contentSelector:".content",ignoreSelector:"[data-toc-skip]",headingSelector:"h1, h2, h3",orderedList:!1,scrollSmooth:!1})
```
{: file="assets/js/dist/post.min.js" }

```js
export function toc() {
  if (document.querySelector('main h2')) {
    // see: https://github.com/tscanlin/tocbot#usage
    tocbot.init({
      tocSelector: '#toc',
      contentSelector: '.content',
      ignoreSelector: '[data-toc-skip]',
      headingSelector: 'h1, h2, h3',
      orderedList: false,
      scrollSmooth: false
    });
  }
}
```
{: file="_javascript/modules/components/toc.js" }

{% raw %}
```liquid
{% if page.content contains '<h1' or page.content contains '<h2' or page.content contains '<h3' and site.toc and page.toc %}
  {% assign urls = urls | append: ',' | append: site.data.origin[type].toc.js %}
{% endif %}
```
{: file="_includes/js-selector.html" }
{% endraw %}

<br>

# **마치며**

![post-push-light](/2023-11-25-first-blog-customization/post-push-light.png){: .light }
![post-push-dark](/2023-11-25-first-blog-customization/post-push-dark.png){: .dark }
_워크플로우에 걸리는 시간이 2m 내외로 줄어들었다!_

이유는 모르겠지만.. 블로그 테마를 업데이트하니 푸시 이후 글이 블로그에 실제로 반영되기까지 걸리는 시간이 상당히 줄었습니다! 오래걸릴 때는 10분 가까이 걸렸는데, 이제 2분정도 기다리면 반영이 되네요.

이외에도 트위터 아이콘을 제거한다거나, 한국어 문장에서 단어기준 줄넘김을 적용한다거나 시도해본 것은 많은데 아이콘 중앙정렬이 안 되고 왼쪽으로 쏠리거나 글 문단이 못생겨지는 부작용이 있어 적용하진 않았습니다. 다음에 또 생각이 들면 다시 시도해봐야겠습니다.

<!--
구현해보고 싶은 것

- 글 미리보기에서 h1 태그는 제외
-->