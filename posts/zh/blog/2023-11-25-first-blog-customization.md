---
title: "定制GitHub博客模板"
authors: ["blog", "dev"]

categories: [블로그]
tags: [블로그, 커스텀, 커스터마이징, Chirpy, Liquid, SCSS]
start_with_ads: true

toc: true
toc_sticky: true

date: 2023-11-25 23:24:00 +0900
last_modified_at: 2025-10-15 09:22:00 +0900
---

:::info
本文撰写于使用Jekyll框架时期。现已迁移至Astro！
:::

## **引言**

![new-files-dark](/2023-11-25-first-blog-customization/new-files-dark.webp){: .dark .w-50 .right .shadow }
![new-files-light](/2023-11-25-first-blog-customization/new-files-light.webp){: .light .w-50 .right .border }

现在使用的博客模板一直在持续[改进](https://github.com/cotes2020/jekyll-theme-chirpy)。版本不知不觉升到了`6.3.1`。焕然一新的主题中，主页面文章增加了预览图显示功能，整体色彩也变得更加精致。

于是我在寻找更新方法的过程中，发现了一件事：原来我在最初开设博客时使用的是Chirpy starter方式。这种方式虽然开设过程简单，但定制幅度相对受限。

选择GitHub博客而非普通Tistory、Naver博客的原因正是其广泛的定制可能性，这样一来就失去了意义。于是按照官方页面介绍的GitHub Fork方式进行了切换。

循序渐进地按照这种方式操作后，博客文件数量明显增加了。查看新生成的`_includes`、`_javascript`、`_layouts`、`_sass`文件夹，发现可以通过修改JavaScript和CSS文件来直接编辑网页组件，因此我对其中几项做了调整。

## **模板修改**

### **修改字号和段落间距**

一直让我在意的一点是字体稍微偏大。之前不知道如何修改字号，而且功能上也没什么不便，所以一直放着没管，这次趁着重新整修博客一并修改了。

SCSS可以在`assets/css/jekyll-theme-chirpy.scss`中修改或新增代码，因此可以在此文件中编写代码。文章字体属性由`_scss/addon/commons.scss`中的`.content`选择器负责，我将所有`.content`的`font-size`值设为0.98左右，段落间距参照Tistory和Naver博客的样式从1.25rem调整为1.5rem左右。

```css
.content {
  font-size: 0.98rem;
}

p:not(blockquote p) {
  margin-top: 1.5rem;
}
```

### **移除站点底部Footer**

原始Chirpy主题在博客底部生成了左侧的"ⓒ {年份} {姓名} 保留部分权利"和右侧的"Powered by Jekyll with Chirpy theme"这一Footer。其中后者并非重要信息，为了让页面更简洁，我找到Footer生成相关的代码并做了注释处理。

```html
<!--
<p>
    {%- capture _platform -%}
        <a href="https://jekyllrb.com" target="_blank" rel="noopener">Jekyll</a>
    {%- endcapture -%}

    {%- capture _theme -%}
        <a href="https://github.com/cotes2020/jekyll-theme-chirpy" target="_blank" rel="noopener">Chirpy</a>
    {%- endcapture -%}

    {{ site.data.locales[include.lang].meta | replace: ':PLATFORM', _platform | replace: ':THEME', _theme }}
</p>
-->
```

:::info
**2024-05-26 更新！**

在管理博客的过程中发现，Chirpy模板声明了[MIT许可证](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/LICENSE)，原则上不允许移除Footer。我恢复注释以遵守许可证。
:::

### **文章标题加粗处理**

看到其他写作平台[Medium](https://medium.com/)上文章标题以粗体处理吸引用户视线，我也希望博客中的文章标题能以粗体显示，于是在`assets/css/jekyll-theme-chirpy.scss`中添加了以下代码。

```css
.btn-outline-primary {
  font-weight: bold;
}
```

### **移除文章导航**

![post-nav-light](/2023-11-25-first-blog-customization/post-nav-light.webp){: .light .border }
![post-nav-dark](/2023-11-25-first-blog-customization/post-nav-dark.webp){: .dark }
*文章导航。根据当前文章引导用户至上一篇或下一篇文章。*

文章导航位于文章最底部，连接到当前文章之前和之后的文章。我个人一直觉得不太明白它的意义，因为它既不显示同一分类的文章，只是按时间线展示最相关的内容，但文章主题可能毫不相关。

我觉得文章导航反而会让页面底部显得杂乱，只想保留"相关文章"部分，于是在`_layouts/post.html`{: .filepath}中找到调用文章导航部分的`- post-nav`代码并移除了。

```html
---
layout: default
refactor: true
panel_includes:
  - toc
tail_includes:
  - comments
  - related-posts
---
```

:::info
**2024-04-16 更新！**

继续运营博客后，发现我写的文章主题其实相当多样。保留导航可以连接到这些不同主题的文章，于是把`- post-nav`部分也恢复了 😭
:::

### **修改侧边栏背景色**

想要修改侧边栏的背景色，但直接使用`background-color`属性会导致颜色在深色模式切换时固定不变。我希望保留浅色模式的颜色，只修改深色模式的颜色。幸运的是，Chirpy主题在`_sass/colors`路径中将深色模式的`typography-dark.scss`与浅色模式分开存放，因此在该文件中将深色模式下的侧边栏背景色改为了**#1D1D1E**。

```scss
--sidebar-bg: #1D1D1E;
```

### **修改TOC生成方式**

Chirpy主题默认在文章页面右侧生成TOC（目录）。虽然提供了检查当前阅读位置和跳转到目标位置等实用功能，但问题在于主题更新后其行为方式变得不便了。

不确定具体从哪个版本开始更改的，但之前是从h1开始生成目录，现在必须有h2及以下的标签才能生成目录。虽然可能自有其理由，但个人觉得不太好，于是恢复到了原来的方式。代码较长，只写了修改的部分。

```js
document.querySelector("main h1")&&tocbot.init({tocSelector:"#toc",contentSelector:".content",ignoreSelector:"[data-toc-skip]",headingSelector:"h1, h2, h3",orderedList:!1,scrollSmooth:!1})
```

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

```html
{% if page.content contains '<h1' or page.content contains '<h2' or page.content contains '<h3' and site.toc and page.toc %}
  {% assign urls = urls | append: ',' | append: site.data.origin[type].toc.js %}
{% endif %}
```

:::info
**2024-04-16 更新！**
:::

在将博客注册到网络的过程中，Naver Search Advisor和Bing站长工具给出了"发现多个h1标签"的警告。查找为什么会有这种类型警告时，了解到[Web内容无障碍指南(WCAG)](https://www.w3.org/TR/WCAG21/)。从h2以下标签开始生成TOC的原因，似乎就是为了按照该指南引导用户仅使用一个h1标签。实际用开发者工具查看[维基百科](https://ko.wikipedia.org/wiki/%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD)等文档，发现文章标题用h1标签，从目录开始用h2进行区分处理。

虽然不确定是否真的因为WCAG，但认为应该遵守该建议，于是将博客文章中使用的所有标题单位降低了一级。不过希望目录的字体大小保持不变，因此在`jekyll-theme-chirpy.scss`中单独设置了`font-size`属性如下：

```css
h2 {
  font-size: 1.9rem;
}

h3 {
  font-size: 1.6rem;
}

h4 {
  font-size: 1.3rem;
}
```

### **更改特定标签的字体**

```scss
$font-family-base: 'IBM Plex Sans KR', 'Source Sans Pro', 'Microsoft Yahei', sans-serif;
$font-family-heading: 'IBM Plex Sans KR', Lato, 'Microsoft Yahei', sans-serif;
```

默认字体感觉字间距较宽，于是在[Google Fonts](https://fonts.google.com)中找了字间距较窄的字体进行替换。与其直接修改定义字体的代码，不如利用模板中的`variables-hook.scss`在此单独编写代码。看到应用新字体后的效果，要好得多。

## **结语**

![post-push-light](/2023-11-25-first-blog-customization/post-push-light.webp){: .light .border }
![post-push-dark](/2023-11-25-first-blog-customization/post-push-dark.webp){: .dark }
*工作流时间缩短到了2分钟左右！*

虽然不清楚原因，但更新博客主题后，推送后文章实际反映到博客所需的时间大大缩短了！以前慢的时候需要将近10分钟，现在只需要等2分钟左右就能生效。

此外还尝试过移除Twitter图标、在韩语中应用按单词换行等许多方法，但由于图标无法居中对齐而偏左，或段落变得难看等副作用，最终没有应用。下次再想起来时再试试看。
