---
title: "在GitHub博客中删除特定标签内容"
authors: ["blog", "dev"]

categories: [블로그]
tags: [블로그, 커스터마이징, Chirpy, Liquid]
start_with_ads: true

toc: true
toc_sticky: true

date: 2024-03-21 19:32:00 +0900
last_modified_at: 2025-10-20 22:29:00 +0900
---

:::info
本文撰写于使用Jekyll框架时期。现已迁移至Astro！
:::

## **引言**

Chirpy主题干净利落，但原始状态下偶尔会觉得有些地方需要改进。虽然[不时会进行修改](https://hyngng.github.io/posts/first-blog-customization/)，但个人仍然觉得有几个遗憾之处。

![before-light](/2024-03-21-blog-content-remove/before-light.webp){: .light .w-75 .border }
![before-dark](/2024-03-21-blog-content-remove/before-dark.webp){: .dark .w-75 }
*修改前博客首页显示的文章摘要*

其中之一是博客首页的文章摘要会原样显示图片标题、标题等原始内容。如上所示，图片标题或"引言"等不必要部分一并显示，导致可读性下降。这本应是默认处理好的功能，这次找到方法后进行了修改。

## **原因分析**

```html
<div class="card-text content mt-0 mb-3">
  <p>
    {% include no-linenos.html content=post.content %}
    {{ content | markdownify | strip_html | truncate: 200 | escape }}
  </p>
</div>
```

GitHub博客首页的相关内容写在`_layouts/home.html`中。原始代码如上所示，`<div class="card-text content mt-0 mb-3">`段落生成文章摘要。

查看代码后发现，内容仅经过`markdownify`和`strip_html`处理后直接显示为文本。我想在此基础上添加额外过滤器来移除特定标签，于是进行了以下步骤。

## **编写代码**

```ruby
require 'nokogiri'

module Jekyll
  module RemoveTagFilter
    def remove_tag(input, *tags)
      doc = Nokogiri::HTML(input)
      doc.remove_namespaces!
      tags.each do |tag|
        doc.search(tag).each do |node|
          node.content = ''
        end
      end
      doc.to_html.gsub(/\A<!DOCTYPE .*?>\n?/, '').gsub(/\n\z/, '')
    end
  end
end

Liquid::Template.register_filter(Jekyll::RemoveTagFilter)
```

```html
{%- if post.description -%}
  {{- post.description -}}
{%- else -%}
  ...
  {{- content | markdownify | remove_tag: 'h2', 'h3', 'em', 'blockquote', 'pre' | strip_html | newline_to_br | replace: '<br />', ' ' | strip_newlines -}}
  ...
{%- endif -%}
```

:::tip
对负责搜索结果的`assets/js/data/search.json`文件也可以进行类似处理。
:::

由于对Ruby和Liquid没有背景知识，在寻找方法上花了一些功夫。尝试仅用Liquid的`split`或`join`来解决，但难以达到预期效果，于是借助了GPT的帮助，通过在`_plugins/remove-tags.rb`路径下创建Ruby文件来使用。Ruby文件中创建了一个函数，接收标签类型作为参数，用正则表达式移除内部文本。使用了名为`Nokogiri`的解析库，在Liquid文件中像`remove_tag: 'h2', 'h3', 'em', 'blockquote'`这样调用。

:::info
2025-10-20 更新！
:::

Chirpy版本更新到`v7.4.0`后，`post-description.html`被替换为了`post-summary.html`。不过结构基本相似，可以按如下方式编写：

```html
  ...
  {%- assign content = content
    | markdownify
    | remove_tag: 'h2', 'h3', 'em', 'blockquote', 'pre'
    | strip_html
    | newline_to_br
    | replace: '<br />', ' '
    | strip_newlines
    | strip
  -%}
  ...
```

## **改进确认**

![after-light](/2024-03-21-blog-content-remove/after-light.webp){: .light .w-75 .border}
![after-dark](/2024-03-21-blog-content-remove/after-dark.webp){: .dark .w-75 }
*应用代码后改进的文章摘要*

代码编写完成后运行良好。与修改前相比，不必要的内容被移除，文章摘要的可读性大幅改善。修改前令人费解的感觉消失了，变得自然多了。另外，只需在`remove_tag:`后添加需要移除的标签即可，使用也非常简单。今后要好好利用。
