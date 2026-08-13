---
title: 在GitHub博客注册站长工具并进行SEO优化
authors: ["blog"]

categories: [블로그]
tags: [블로그, 웹마스터도구, SEO]
start_with_ads: true

toc: true

date: 2024-05-23 11:53:00 +0900
last_modified_at: 2026-01-27 15:09:00 +0900

mermaid: true
---

## **引言**

在将近一年时间里，我的博客几乎处于深网状态，今年年初才注册到搜索引擎上。让我惊讶的是，Tistory或Naver博客即使不另行申请，主流平台也会自动生成索引并显示在搜索结果中，但GitHub博客这类个人站点，迈出第一步需要手动操作。

![search-console](/2024-05-23-webmasters-and-seo/search-console.webp){: .w-75 }
*代表性的站长工具——Google Search Console*

按照韩国门户网站占有率顺序，我注册了[Google Search Console](https://search.google.com/search-console/)、[Naver Search Advisor](https://searchadvisor.naver.com/)、[Daum站长工具](https://webmaster.daum.net/)、[Bing站长工具](https://www.bing.com/webmasters?lang=ko)共四个平台。特别的是，各站点在注册域名后到实际出现在搜索结果中的时间千差万别：3月20日左右申请域名后，Daum大约一天、Google大约两周、Naver和Bing大约三周后才开始出现。

:::info
**2024-05-25 更新！**

另外也注册了[Pinterest Business Hub](https://www.pinterest.co.kr/business/hub/)。确认网站所有权后，它会基于RSS收集图片并生成Pin。
:::

目前所有平台在输入`site:hyngng.github.io`搜索时均能确认博客已曝光。如果也有像我一样想在站长工具中注册个人站点的朋友，以下内容可能有所帮助。

### **Google Search Console**

- 在GitHub博客中，通过HTML标签验证网站所有权，直接写在`_includes/head.html`中也没有问题，但由于`jekyll-seo-tags`插件已支持相关功能，修改`_config.yml`中的`webmaster_verifications`值可能更为方便。

### **Naver Search Advisor**

- Naver Search Advisor无法提交Atom类型的Feed，因此需要单独创建RSS Feed并注册。文件示例可在[我的GitHub](https://github.com/hyngng/hyngng.github.io/blob/main/assets/rss.xml)中查看，在我的博客中的示例运行情况可[在此](https://hyngng.github.io/rss.xml)确认。
- 支持[IndexNow](https://www.indexnow.org/ko_kr/index)，因此可以自动化爬取请求。

### **Daun站长工具**

- [搜索注册申请网站](https://register.search.daum.net/index.daum)和[站长工具](https://webmaster.daum.net/)是分开的。首次在搜索注册申请网站注册站点后，需在站长工具中分别提交Sitemap和Feed。
- 即使搜索结果中站点注册已完成，新网站的Favicon也可能不显示。向[客服中心](https://cs.daum.net/)咨询后，得到的答复是"Favicon收集标准因政策原因无法详细公开"。虽然有些不安，但个人层面似乎无能为力。

### **Bing站长工具**

- 如果在Google Search Console中已正常注册站点，可以通过连接Google直接使用。跳过网站所有权验证后，提交的Sitemap、Feed等会自动同步。
- Bing站长工具也存在Favicon不显示的问题，但向[支持团队咨询](https://www.bing.com/webmasters/support)后会得到友好解决。我的情况是，提交咨询后仅两天Favicon就正常显示了。
- 与Naver一样支持[IndexNow](https://www.indexnow.org/ko_kr/index)。

## **SEO优化**

这是在申请博客搜索注册时首次接触的概念。SEO（搜索引擎优化）是指通过提高网站或网页质量，使其在搜索引擎中获得更好曝光和排名提升的过程。这是一个热门概念，[Naver](https://searchadvisor.naver.com/guide/seo-basic-intro)和[Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ko)都发布了官方指南。不过我的主要工作并非为了提升排名而刻意优化，而是在申请博客搜索注册后，在几个站长工具中收到SEO警告并解决问题的过程。下面简要整理了具体问题和解决方法。

### **使用webp优化图片**

为了评估网站性能，我使用Google提供的[PageSpeed Insights](https://pagespeed.web.dev/?utm_source=psi&utm_medium=redirect)进行了测试，结果在手机类别中显示性能较慢。查看附带的结果报告，在众多建议中有一条是降低图片文件大小，于是我对这部分进行了改进。

我平时会将[偶尔画的画](https://hyngng.github.io/posts/fourth-drawing/)和[拍摄的照片](https://hyngng.github.io/posts/photos-of-gyemyo/)写成博客文章，这些图片平均规格为4000x3000，扩展名为`.png`或`.jpg`，画作大小约200KB~1MB，照片约1~3MB。其他文章中使用的图片也遵循这一规格，文件都不小。参考其他网站，发现很多都处理到了100KB以下的低文件大小，为使我的博客也达到类似的优化水平，进行了以下处理：

1. 将图片尺寸缩小至1/4。4000x3000规格调整为2000x1500规格。
2. 将`.gif`、`.jpg`、`.png`扩展名的文件经有损压缩编码为`.webp`格式。

![before-after](/2024-05-23-webmasters-and-seo/before-after.webp)
*文件大小缩减前后的对比。*

左侧为原图，右侧为缩小尺寸后转换为`webp`的文件，画面质量没有致命差异，但文件大小分别为1.79MB和83.7KB，相差约20倍。虽然并非所有文件都有如此戏剧性的差异，但大部分确实显示出了明显的文件减小效果，效果很好，因此对其他文章中的图片文件也做了类似处理。

不过，使用质量较低的图片终究有些遗憾，因此对于画作或照片，我在文章末尾添加了"图片原件可在我的GitHub上查看！"之类的说明，以便有需要时能链接到原图。

### **解决两个以上H1标签重复问题**

Naver和Bing站长工具指出了这个问题。根据Web内容无障碍指南(WCAG)，一个网页最多只能包含一个h1标签，而我的博客左侧边栏中，站点标题和文章标题都被处理为了`<h1>`。

```html
{% if page.layout != 'home' %}
  <h2 class="site-title">
    <a href="{{ '/' | relative_url }}">{{ site.title }}</a>
  </h2>
{% else %}
  <h1 class="site-title">
    <a href="{{ '/' | relative_url }}">{{ site.title }}</a>
  </h1>
{% endif %}
```

修改后的代码如上。我认为将站点标题的标题标签降低比降低文章标题更合理，因此修改了显示`site.title`的代码。根URL显示为h1，其他URL显示为h2。

用Chrome开发者工具确认，博客首页显示为h1，当前页面显示为h2。修改后重新提交了相关URL，两天后通过Naver和Bing站长工具的站点诊断页面确认错误已修正。

### **自动生成meta description**

:::info
**2024-05-28 更新！**

现在已不使用此方法。实际解决方案请移至下方9月25日修改的内容！
:::

Bing站长工具指出的问题。我的博客中许多文章使用的"引言"部分作为多个页面的description被重复注册，因此我在front matter中分别编写了description，但由于只写了20字左右，又出现了"Meta Description过长或过短"的错误提示。

description的适当长度为25~160字。每页都要调整字数写出25字以上的内容实在太麻烦，于是我编写了自动生成description的代码。

```cs
<html lang="{{ page.lang | default: site.alt_lang | default: site.lang }}" {{ prefer_mode }}>
  {% include head.html post_content = content %}
  ...
```

```html
{% if page.layout == "post" %}
  {% assign description = include.post_content | content_filter | strip_html | truncate: 100 %}
{% else %}
  {% assign description = site.description %}
{% endif %}

<meta name="description" content="{{ description }}" />
<meta property="og:description" content="{{ description }}" />
<meta property="twitter:description" content="{{ description }}" />

{{ seo_tags }}
```

实现过程有点棘手。包含description的meta标签首先通过`jekyll-seo-tag`插件统一生成，因此我采用覆盖已生成`seo_tag`中description的方式实现。实现过程中，`_includes`文件夹中的文件（包括`head.html`）无法访问页面内容，但我通过在`_layouts/default.html`中获取`content`并传递的方式解决了问题。

```ruby
require 'nokogiri'

module Jekyll
  module ContentFilter
    def content_filter(input)
      doc = Nokogiri::HTML(input)
      content_div = doc.css('div.content').first
      output = content_div&.text&.strip || ''
      output.gsub(/\s+/, ' ').strip.gsub(/(들어가며|starting with)\s+/i, '')
    end
  end
end

Liquid::Template.register_filter(Jekyll::ContentFilter)
```

`content`经过`content_filter`这个自定义Ruby插件处理，旨在去除标题、发布日期、作者以及"引言"等作为description不需要的信息。利用文章正文全部传递到`<div class="content"></div>`标签的方式，虽然[之前实现过类似的代码](https://hyngng.github.io/zh/blog/blog-content-remove/)，但由于还不够熟悉，这部分咨询了GPT。


:::info
**2024-09-25 更新！**
:::

事实上，以上只是肤浅的解决方案。新生成的description与{% raw %}`{{ seo_tags }}`{% endraw %}中的description重复，导致页面中存在两个`<meta name="description" ... >`标签。我更想要根本性的解决方案，于是找到[jekyll-seo-tag](https://github.com/jekyll/jekyll-seo-tag/tree/master)插件中生成meta description的部分，直接修改如下：

```html
{% if page.layout == 'post' %}
  {% if page.content %}
    {% assign description = page.content | strip_html | strip_newlines | truncate: 150 %}
    <meta name="description" content="{{ description }}" />
    <meta property="og:description" content="{{ description }}" />
    <meta property="twitter:description" content="{{ description }}" />
  {% endif %}
{% else %}
  {% if seo_tag.description %}
    <meta name="description" content="{{ seo_tag.description }}" />
    <meta property="og:description" content="{{ seo_tag.description }}" />
    <meta property="twitter:description" content="{{ seo_tag.description }}" />
  {% endif %}
{% endif %}
```

```ruby
GIT
  remote: https://github.com/hyngng/jekyll-seo-tag.git
  revision: 8584ad6bd6788036ad17a35659c87737b11d02c6
  branch: master
  specs:
    jekyll-seo-tag (2.8.0)
      jekyll (>= 3.8, < 5.0)
```

```ruby
gem 'jekyll-seo-tag', git: 'https://github.com/hyngng/jekyll-seo-tag.git', branch: 'master'
```

修改后的代码根据页面布局，从`_config.yml`中读取description，或从文章内容中生成meta description。我将该GitHub项目[fork到个人仓库](https://github.com/hyngng/jekyll-seo-tag)后单独修改，在`Gemfile`中按如下方式引用使用，这是我所能找到的最干净的解决方案。

## **结语**

从申请搜索曝光到SEO优化，虽然匆忙完成了各项工作，但效果如何还不好说。不过我的博客更倾向于个人记录而非推广或生产对他人有用的信息，因此检索曝光管理更多是出于技术好奇心的层面，并不打算过于执着。
