---
title: "为GitHub博客添加多语言支持"
authors: ["blog", "dev"]

categories: [블로그]
tags: [블로그, 다국어, jekyll-polyglot]
start_with_ads: true

toc: true
toc_sticky: true

date: 2024-06-07 22:00:00 +0900
last_modified_at: 2025-10-16 13:07:00 +0900
---

:::info
**2026-07-28 更新！**

本文撰写于使用Jekyll框架时期。现已迁移至Astro！
:::

:::info
**2024-09-15 更新！**

支持多语言功能虽好，但维护过于困难和复杂，因此已恢复至应用插件之前的状态。要真正支持多语言，需要修改的地方比想象中多得多，必须承受与原始主题合并过程极为复杂的不便。
:::

## **插件介绍**

在GitHub博客环境中实现多语言功能的Jekyll插件主要有jekyll-polyglot和`jekyll-multiple-languages-plugin`两种。我使用的是前者——jekyll-polyglot，该插件根据每个文章front matter中定义的`lang`值，在根URL后插入I18N语言代码，从而生成多语言翻译页面。该插件以后者`jekyll-multiple-languages-plugin`为模型开发，官方指南从安装方法到使用注意事项均在[GitHub Polyglot仓库](https://github.com/untra/polyglot?tab=readme-ov-file#how-to-use-it)中有详细说明。

## **准备工作**

### **安装和设置插件**

```ruby
group :jekyll_plugins do
  gem "jekyll-polyglot"
end
```

在`Gemfile`中如上注册插件，然后运行`gem install jekyll-polyglot`命令安装插件。

```yaml
plugins:
  - jekyll-polyglot

languages: ["ko", "en"]
default_lang: "ko"
exclude_from_localization: ['javascript', 'images', 'css', 'sitemap.xml']
parallel_localizaion: true
```

安装插件后，需在`_config.yml`中添加以上内容。`languages`填写页面支持的语言，`default_lang`填写页面的默认语言。需要注意的是，在Windows环境下`parallel_localization`选项无法正常工作，因此必须将其设为`false`。

### **修复正则表达式bug**

安装插件并构建时，会遇到"'relative_url_regex': target of repeat operator is not specified:"的错误。此错误是因为插件的`site.rb`文件中某些正则表达式无法处理Chirpy主题的`_config.yml`中`exlude: *.gem *.gemspec *.config.js`等通配符(*)。我向插件作者咨询了此问题，但得到的回答是[以此文档为依据](https://jekyllrb.com/docs/configuration/options/#global-configuration)，认为Chirpy主题在`_config.yml`中错误使用了全局模式。

然而，考虑到Minimal-Mistakes等其他Jekyll主题[也在使用全局模式](https://github.com/mmistakes/minimal-mistakes/blob/master/_config.yml#L168-L169)，似乎有必要修改插件代码本身。这种情况下需要自行修改并使用插件，因此我将项目[fork到了我的GitHub仓库](https://github.com/hyngng/jekyll-polyglot)，并在`Gemfile`中如下引用：

```ruby
gem 'jekyll-polyglot', git: 'https://github.com/hyngng/jekyll-polyglot', branch: 'master'
```

然后将插件`jekyll-polyglot-1.8.0/lib/jekyll/polyglot/patches/jekyll`路径下`site.rb`中的`relative_url_regex()`和`absolute_url_regex()`两个函数修改如下：

```ruby
def relative_url_regex(disabled = false)
  regex = ''
  unless disabled
    @exclude.each do |x|
      escaped_x = Regexp.escape(x)
      regex += "(?!#{escaped_x})"
    end
    @languages.each do |x|
      escaped_x = Regexp.escape(x)
      regex += "(?!#{escaped_x}\/)"
    end
  end
  start = disabled ? 'ferh' : 'href'
  %r{#{start}="?#{@baseurl}/((?:#{regex}[^,'"\s/?.]+\.?)*(?:/[^\]\[)("'\s]*)?)"}
end

...

def absolute_url_regex(url, disabled = false)
  regex = ''
  unless disabled
    @exclude.each do |x|
      escaped_x = Regexp.escape(x)
      regex += "(?!#{escaped_x})"
    end
    @languages.each do |x|
      escaped_x = Regexp.escape(x)
      regex += "(?!#{escaped_x}\/)"
    end
  end
  start = disabled ? 'ferh' : 'href'
  %r{(?<!hreflang="#{@default_lang}" )#{start}="?#{url}#{@baseurl}/((?:#{regex}[^,'"\s/?.]+\.?)*(?:/[^\]\[)("'\s]*)?)"}
end
```

修改函数后运行`bundle exec jekyll s`命令，确认构建成功。

### **修改文章文件属性**

```yaml
---
lang: en
permalink: example-url-here
---
```

对于需要翻译的文章，需在front matter中指定语言值。默认使用`ko`、`en`等I18N国家代码，我使用的是`ko-KR`和`en`。其中`permalink`指定该文章的URL路径，这是因为在Jekyll中，具有相同URL的两个文件默认被视为相同内容，因此需要人为区分原文和翻译版。

```
_posts/2010-03-01-salad-recipes-en.md
_posts/2010-03-01-salad-recipes-sv.md
_posts/2010-03-01-salad-recipes-fr.md
```

如果不想使用front matter中的`permalink`来区分文章语言，也可以按上述方式修改文件名来区分，但这样页面URL可能会包含同语反复，例如`example.github.io/en/2010-03-01-salad-recipes-en`。

## **模板修改**

以下内容仅针对Chirpy主题，如果使用其他Jekyll模板，可以跳过本节直接进入[其他工作](#其他工作)。但如果需要像一样修改Chirpy模板，以下内容可能有所帮助。

- jekyll-polyglot插件可用的变量
	- `site.default_lang`：`_config.yml`中声明的默认语言值。
	- `site.active_lang`：当前网页中激活的语言值。
	- `page.lang`：front matter中声明的文章语言值。

利用以上三个变量，可以编写如{% raw %}`{% if page.lang == site.default_lang %}`{% endraw %}的条件语句，根据上下文限制页面显示的语言。

### **加载站点语言**

```html
{% if site.active_lang %}
  {% assign lang = site.active_lang %}
{% elsif site.data.locales[page.lang] %}
  {% assign lang = page.lang %}
{% elsif site.data.locales[site.lang] %}
  {% assign lang = site.lang %}
{% else %}
  {% assign lang = 'site.default_lang'' %}
{% endif %}
```

Chirpy模板在`_includes/lang.html`这个单独的文件中设置语言。将上述文件修改后，可以在各个布局文件中通过加载`lang.html`来使用。

### **按语言显示内容**

```html
{% include lang.html %}
```

大部分情况如上所示通过加载`lang.html`处理，而对于分页等仅靠修改语言指定无法解决的问题，我单独编写了补充逻辑。大多数情况下，是修改为在特定语言页面中只显示与该语言编写的文章相关的信息。

```html
<div id="post-list" class="flex-grow-1 px-xl-1">
  {% for post in posts %}
    {% if post.lang == site.active_lang %}
      <article class="card-wrapper card">...</article>
    {% endif %}
  {% endfor %}
</div>
```

例如在`_layouts/home.html`中添加{% raw %}`{% if post.lang == site.active_lang %}`{% endraw %}条件，使首页在站点语言为英语时只显示`lang: en`的文章。其他具体修改过的文件如下：

| 用途 | 文件路径 |
|--------|--------|
| 通用框架页面 | `_layouts/default.html` |
| 首页 | `_layouts/home.html` |
| 分类页 | `_layouts/category.html` |
| 标签页 | `_layouts/tags.html` |
| 归档页 | `_layouts/archive.html` |
| 关于页 | `_layouts/about.html` |
| 最近修改的文章 | `_includes/update-list.html` |
| 标签浏览 | `_includes/trending_tags.html` |
| 相关文章 | `_includes/related-posts.html` |
| 文章导航 | `_includes/post-nav.html` |
| 分页 | `_includes/post-paginator.html` |

### **区分关于页内容**

```html
{% if site.active_lang == 'ko-KR' %}
## 한국어 자기소개
...
{% elsif site.active_lang == 'en' %}
## English Self-Introduction
...
{% endif %}
```

这是按语言在关于(about)页面显示不同内容的方法。起初以为需要创建`about-en.md`等单独文件，后来发现只需在同一文件中根据站点语言显示不同内容，这是最简便的方法。

### **自然地显示字数**

```html
<span
  class="readtime"
  data-bs-toggle="tooltip"
  data-bs-placement="bottom"
  title="{{ words }}{% if site.active_lang != 'ko-KR' %}{{ ' ' }}{% endif %}{{ site.data.locales[include.lang].post.words }}
>
```

这是一个我在意并修改的小细节。该主题在文章顶部将鼠标悬停在阅读时间上时会显示字数，但无论什么语言，字数和"字"之间都会有一个空格，显示为"1000 字"。我个人觉得不太自然，因此修改为韩语中显示为"1000자"，其他语言中显示为"1000 words"（带空格）。

## **其他工作**

### **在头部声明页面语言**

```html
{% I18n_Headers %}
```

这是[Google搜索中心文档的国际化和多语言指南](https://developers.google.com/search/docs/specialty/international/localized-versions?hl=ko)中的建议。虽然不是必须的，但如果在乎SEO，建议在头部添加上述代码以声明页面语言。该代码在构建后会转换如下：

```html
<meta http-equiv="Content-Language" content="ko-KR">
<link rel="alternate" hreflang="ko-KR" href="ttps://hyngng.github.io/posts/:title/"/>
<link rel="alternate" hreflang="en" href="https://hyngng.github.io/en/posts/:title/"/>
```

### **将插件包含在构建过程中**

```html
name: Jekyll site CI

on:
  push:
    branches: [ "site" ]
  pull_request:
    branches: [ "site" ]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Build the site in the jekyll/builder container
      run: |
        docker run \
        -v $:/srv/jekyll -v $/_site:/srv/jekyll/_site \
        jekyll/builder:latest /bin/bash -c "chmod -R 777 /srv/jekyll && jekyll build --future"

    - name: Push
      uses: s0/git-publish-subdir-action@develop
      env:
          REPO: self
          BRANCH: main
          FOLDER: _site
          GITHUB_TOKEN: $
          MESSAGE: "Build: ({sha}) {msg}"
```

jekyll-polyglot与内置插件不同，被视为外部插件，出于安全原因需要单独构建。在`.github/workflows/`路径下创建新的`.yml`文件并按上述内容编写，即可正常构建。

### **在Sitemap中包含所有页面**

```html
...
{% for lang in site.languages %}
  {% for post in site.posts %}
    {% if lang == post.lang %}
      <url>
        <loc>
          {{ site.url }}
          {% if lang == site.default_lang %}
            {{ post.url }}
          {% else %}
            {{ post.url | prepend: lang | prepend: '/' }}
          {% endif %}
        </loc>
        ...
      </url>
    {% endif %}
  {% endfor %}
{% endfor %}
```

Sitemap是多语言支持时最大的问题之一，因为它只对默认页面生成`<loc>`标签。我修改为对`site.languages`中的所有语言各检查一次，其中对于从设为`lang: en`的文件自动生成的韩语页面等无效元素则忽略。

### **添加语言切换按钮**

```html
{% for lang in site.languages %}
  <div class="lang" style="display: inline;">
    <a style="
      {% if lang == site.active_lang %}
        font-weight: bold;
      {% endif %}"
      href="
      {% if lang == site.default_lang %}
        {{site.baseurl}}{{page.url}}
      {% else %}
        {{site.baseurl}}/{{ lang }}{{page.url}}
      {% endif %}">
      {{ lang }}
    </a>
    {% if forloop.last == false %}
      <span class="lang-border"> </span>
    {% endif %}
  </div>
{% endfor %}
```

如有需要，可以用上述代码在任意位置添加语言切换按钮。不过个人认为我的博客并没有语言专属的独家内容，访问者也没有必要特意查看其他语言版本，因此没有添加。

### **按语言区分Feed内容**

```
{% assign filtered_posts = site.posts | where: "lang", site.active_lang %}

{% for post in filtered_posts limit: 5 %}
  <entry> ... </entry>
{% endfor %}
```

Feed也修改为根据语言设置，仅将匹配`site.active_lang`的文章动态生成到`filtered_posts`中。在站长工具中注册时，分别注册了`feed.xml`和`/en/feed.xml`。

## **效果截图**

![result-light](/2024-06-07-blog-polyglot-support/result-light.webp){: .light .border }
![result-dark](/2024-06-07-blog-polyglot-support/result-dark.webp){: .dark }

## **结语**

不容易。jekyll-polyglot给人的感觉与其说是灵活方便，不如说是累赘。应用过程绝不能说轻松方便，也曾考虑过不如单独开设一个英文页面分成两个来管理，但页面内容联动和搜索曝光设置等方面的缺点似乎更多，所以还是使用了jekyll-polyglot。不过只要能实现，在想要创建自带的多语言支持功能时，jekyll-polyglot带来的优势是毋庸置疑的。
