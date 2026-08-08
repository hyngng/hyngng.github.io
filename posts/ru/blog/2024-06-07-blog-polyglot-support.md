---
title: "Добавление многоязычной поддержки в GitHub-блог"
authors: ["blog", "dev"]

categories: [블로그]
tags: [블로그, 다국어, jekyll-polyglot]
start_with_ads: true

toc: true

date: 2024-06-07 22:00:00 +0900
last_modified_at: 2025-10-16 13:07:00 +0900
---

:::info
**Обновлено 2026-07-28!**

Эта статья была написана при использовании фреймворка Jekyll. Сейчас я перешёл на Astro!
:::

:::info
**Обновлено 2024-09-15!**

Поддержка многоязычности — это хорошо, но обслуживание стало слишком сложным и запутанным, поэтому я вернул всё к состоянию до применения плагина. Для полноценной поддержки многоязычности требуется переделать гораздо больше, чем кажется, и приходится мириться с неудобством очень сложного процесса слияния с оригинальной темой.
:::

## **Знакомство с плагином**

В среде GitHub-блога есть два основных плагина Jekyll для реализации многоязычности: jekyll-polyglot и `jekyll-multiple-languages-plugin`. Я использовал первый, jekyll-polyglot. Этот плагин вставляет код языка I18N после корневого URL в зависимости от значения `lang`, определённого во фронтматере каждого поста, создавая таким образом переведённые версии страниц. Говорят, что этот плагин создан по образцу второго — `jekyll-multiple-languages-plugin`. Официальное руководство, от установки до мер предосторожности, подробно описано в [репозитории Polyglot на GitHub](https://github.com/untra/polyglot?tab=readme-ov-file#how-to-use-it).

## **Подготовительная работа**

### **Установка и настройка плагина**

```ruby
group :jekyll_plugins do
  gem "jekyll-polyglot"
end
```

Добавляем плагин в `Gemfile`, как указано выше, и устанавливаем командой `gem install jekyll-polyglot`.

```yaml
plugins:
  - jekyll-polyglot

languages: ["ko", "en"]
default_lang: "ko"
exclude_from_localization: ['javascript', 'images', 'css', 'sitemap.xml']
parallel_localizaion: true
```

После установки плагина нужно добавить указанные выше строки в `_config.yml`. В `languages` указываются языки, которые будет поддерживать страница, в `default_lang` — язык по умолчанию. Обратите внимание: в среде Windows опция `parallel_localization` работает некорректно, поэтому её нужно обязательно установить в `false`.

### **Исправление бага с регулярным выражением**

При попытке сборки после установки плагина возникает ошибка: `'relative_url_regex': target of repeat operator is not specified:`. Она возникает из-за того, что некоторые регулярные выражения в файле `site.rb` плагина не обрабатывают подстановочные знаки (*), такие как `exlude: *.gem *.gemspec *.config.js` в `_config.yml` темы Chirpy. Я обратился с этим вопросом к создателю плагина, но получил ответ, что [согласно этому документу](https://jekyllrb.com/docs/configuration/options/#global-configuration) тема Chirpy неправильно использует глобальные шаблоны в `_config.yml`.

Однако, учитывая, что другие темы Jekyll, такие как Minimal-Mistakes, тоже [используют глобальные шаблоны](https://github.com/mmistakes/minimal-mistakes/blob/master/_config.yml#L168-L169), похоже, нужно изменить сам код плагина. В этом случае придётся использовать модифицированную версию плагина, поэтому я [форкнул проект в свой репозиторий](https://github.com/hyngng/jekyll-polyglot) и подключил его в `Gemfile` следующим образом:

```ruby
gem 'jekyll-polyglot', git: 'https://github.com/hyngng/jekyll-polyglot', branch: 'master'
```

Затем я изменил две функции — `relative_url_regex()` и `absolute_url_regex()`, которые находятся в файле `site.rb` по пути `jekyll-polyglot-1.8.0/lib/jekyll/polyglot/patches/jekyll`:

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

После изменения функций сборка командой `bundle exec jekyll s` прошла без проблем.

### **Изменение свойств файлов постов**

```yaml
---
lang: en
permalink: example-url-here
---
```

Для постов, которые должны быть переведены, нужно указать значение языка во фронтматере. По умолчанию указывается код страны I18N, например `ko`, `en`. В моём случае я указал `ko-KR` и `en`. `permalink` задаёт URL-путь поста. Поскольку Jekyll считает два файла с одинаковым URL одинаковыми по умолчанию, это нужно, чтобы искусственно различать оригинал и перевод.

```
_posts/2010-03-01-salad-recipes-en.md
_posts/2010-03-01-salad-recipes-sv.md
_posts/2010-03-01-salad-recipes-fr.md
```

Если не нравится различать языки постов через `permalink` во фронтматере, можно вместо этого изменить имена файлов, как показано выше. Однако в этом случае URL страницы может содержать тавтологию, например `example.github.io/en/2010-03-01-salad-recipes-en`.

## **Редактирование шаблона**

Эта часть относится только к теме Chirpy. Если вы используете другой шаблон Jekyll, можете пропустить этот раздел и перейти к [следующему абзацу](#другие-задачи). Но если вам, как и мне, нужно адаптировать шаблон Chirpy, следующая информация может быть полезна.

- Переменные, доступные в плагине jekyll-polyglot:
  - `site.default_lang`: значение языка по умолчанию, объявленное в `_config.yml`.
  - `site.active_lang`: значение языка, активного на текущей веб-странице.
  - `page.lang`: значение языка поста, объявленное во фронтматере.

Используя эти три переменные, можно писать условные конструкции, например {% raw %}`{% if page.lang == site.default_lang %}`{% endraw %}, и ограничивать отображаемый на странице язык в зависимости от ситуации.

### **Загрузка языка сайта**

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

Шаблон Chirpy настраивает язык в отдельном файле `_includes/lang.html`. Можно изменить этот файл, как показано выше, а затем подключать `lang.html` в файлах макетов.

### **Отображение содержимого в зависимости от языка**

```html
{% include lang.html %}
```

В большинстве случаев я подключал `lang.html` как указано выше. В таких случаях, как пагинация, простого изменения указания языка было недостаточно, поэтому я написал отдельные конструкции. В основном я изменил логику так, чтобы на страницах определённого языка отображалась только информация, относящаяся к постам, написанным на этом языке.

```html
<div id="post-list" class="flex-grow-1 px-xl-1">
  {% for post in posts %}
    {% if post.lang == site.active_lang %}
      <article class="card-wrapper card">...</article>
    {% endif %}
  {% endfor %}
</div>
```

Например, в `_layouts/home.html` я добавил условие {% raw %}`{% if post.lang == site.active_lang %}`{% endraw %}, чтобы на главной странице при английском языке сайта отображались только посты с `lang: en`. Вот список других файлов, в которые были внесены изменения:

| Назначение | Путь к файлу |
|--------|--------|
| Общий макет | `_layouts/default.html` |
| Главная страница | `_layouts/home.html` |
| Категории | `_layouts/category.html` |
| Теги | `_layouts/tags.html` |
| Архив | `_layouts/archive.html` |
| Информация | `_layouts/about.html` |
| Недавно изменённые посты | `_includes/update-list.html` |
| Обзор тегов | `_includes/trending_tags.html` |
| Похожие посты | `_includes/related-posts.html` |
| Навигация по постам | `_includes/post-nav.html` |
| Пагинация | `_includes/post-paginator.html` |

### **Разделение содержимого страницы «О себе»**

```html
{% if site.active_lang == 'ko-KR' %}
## 한국어 자기소개
...
{% elsif site.active_lang == 'en' %}
## English Self-Introduction
...
{% endif %}
```

Способ отображения разного содержимого на странице «О себе» в зависимости от языка. Сначала я думал, что нужно будет создавать отдельные файлы вроде `about-en.md`, но оказалось, что проще всего показывать разное содержимое в одном файле в зависимости от языка сайта.

### **Естественное отображение количества слов**

```html
<span
  class="readtime"
  data-bs-toggle="tooltip"
  data-bs-placement="bottom"
  title="{{ words }}{% if site.active_lang != 'ko-KR' %}{{ ' ' }}{% endif %}{{ site.data.locales[include.lang].post.words }}
>
```

Маленькая деталь, которую я изменил, потому что она меня беспокоила. В этой теме при наведении курсора мыши на время чтения в верхней части поста отображается количество слов. Независимо от языка, между числом и единицей измерения был пробел — отображалось как «1000 자». Мне это казалось неестественным, поэтому я изменил так, чтобы в корейском отображалось «1000자», а в других языках — «1000 words» с пробелом.

## **Другие задачи**

### **Указание языка страницы в заголовке**

```html
{% I18n_Headers %}
```

Это то, что рекомендуется в [документации Google Search Center по международным и многоязычным версиям](https://developers.google.com/search/docs/specialty/international/localized-versions?hl=ko). Это необязательно, но если вы заботитесь об SEO, рекомендуется добавить указанный выше код в заголовок, чтобы указать язык страницы. После сборки код преобразуется в следующее:

```html
<meta http-equiv="Content-Language" content="ko-KR">
<link rel="alternate" hreflang="ko-KR" href="ttps://hyngng.github.io/posts/:title/"/>
<link rel="alternate" hreflang="en" href="https://hyngng.github.io/en/posts/:title/"/>
```

### **Включение плагина в процесс сборки**

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

В отличие от встроенных плагинов, jekyll-polyglot считается внешним плагином и должен собираться отдельно по соображениям безопасности. Если создать новый `.yml` файл в папке `.github/workflows/` и написать в нём указанный выше код, сборка пройдёт без проблем.

### **Включение всех страниц в карту сайта**

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

Карта сайта — одна из самых больших проблем при поддержке многоязычности. По умолчанию теги `<loc>` создаются только для базовых страниц. Вместо этого я изменил логику так, чтобы проверять все языки из `site.languages`, игнорируя при этом недействительные элементы, такие как автоматически сгенерированные корейские страницы из файлов с `lang: en`.

### **Добавление кнопки переключения языка на страницу**

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

При необходимости таким кодом можно добавить кнопку переключения языка в нужное место. Однако лично я не стал её добавлять, потому что в моём блоге нет эксклюзивного контента для каждого языка, и, думаю, посетителям моего сайта нет особой необходимости просматривать страницы на другом языке.

### **Разделение содержимого фида по языкам**

```
{% assign filtered_posts = site.posts | where: "lang", site.active_lang %}

{% for post in filtered_posts limit: 5 %}
  <entry> ... </entry>
{% endfor %}
```

Фид тоже был настроен так, чтобы динамически генерировать `filtered_posts`, включающие только посты, соответствующие `site.active_lang`. При регистрации в инструментах для веб-мастеров я отдельно регистрировал `feed.xml` и `/en/feed.xml`.

## **Результат**

![result-light](/2024-06-07-blog-polyglot-support/result-light.webp){: .light .border }
![result-dark](/2024-06-07-blog-polyglot-support/result-dark.webp){: .dark }

## **Заключение**

Это было трудно. jekyll-polyglot оставляет скорее ощущение громоздкости, чем гибкости и удобства. Процесс внедрения никак нельзя назвать лёгким и простым, даже с натяжкой. Я думал, не лучше ли создать отдельный сайт только на английском и управлять двумя сайтами, но недостатков вроде сложности синхронизации контента и настройки индексации оказалось бы больше, поэтому я остановился на jekyll-polyglot. Тем не менее, если реализовать эту систему, преимущества jekyll-polyglot для создания собственной многоязычной поддержки очевидны.
