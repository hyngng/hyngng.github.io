---
title: Регистрация GitHub-блога в инструментах для веб-мастеров и SEO-оптимизация
authors: ["blog"]

categories: [블로그]
tags: [블로그, 웹마스터도구, SEO]
start_with_ads: true

toc: true
toc_sticky: true

date: 2024-05-23 11:53:00 +0900
last_modified_at: 2026-01-27 15:09:00 +0900

mermaid: true
---

## **Введение**

Более года я вёл блог почти в «глубокой паутине», а в начале этого года зарегистрировал его в поисковых системах. Удивило то, что Tistory или Naver Blog автоматически индексируются крупными платформами и появляются в результатах поиска без отдельной заявки, но для личного сайта вроде GitHub-блога первый шаг в этом процессе нужно делать вручную.

![search-console](/2024-05-23-webmasters-and-seo/search-console.webp){: .w-75 }
*Типичный инструмент для веб-мастеров — Google Search Console*

Я зарегистрировался в четырёх платформах в порядке доли южнокорейских порталов: [Google Search Console](https://search.google.com/search-console/), [Naver Search Advisor](https://searchadvisor.naver.com/), [Daum Webmaster Tools](https://webmaster.daum.net/) и [Bing Webmaster Tools](https://www.bing.com/webmasters?lang=ko). Примечательно, что время до фактического появления в результатах поиска после регистрации домена сильно различалось: я подал заявку примерно 20 марта — Daum начал показывать примерно через день, Google — примерно через 2 недели, Naver и Bing — примерно через 3 недели.

:::info
**Обновлено 2024-05-25!**

Дополнительно зарегистрировался в [Pinterest Business Hub](https://www.pinterest.co.kr/business/hub/). После подтверждения прав на сайт Pinterest собирает изображения на основе RSS и создаёт пины.
:::

Сейчас на всех платформах при вводе `site:hyngng.github.io` блог отображается. Если кто-то, как и я, хочет зарегистрировать личный сайт в инструментах для веб-мастеров, следующие советы могут пригодиться.

### **Google Search Console**

- Для подтверждения прав на сайт в GitHub-блоге через HTML-тег можно написать код в `_includes/head.html`, но плагин `jekyll-seo-tags` поддерживает соответствующую функцию, поэтому проще изменить значение `webmaster_verifications` в `_config.yml`.

### **Naver Search Advisor**

- Naver Search Advisor не принимает фиды в формате Atom, поэтому нужно создать отдельный RSS-фид. Пример файла можно посмотреть в [моём GitHub](https://github.com/hyngng/hyngng.github.io/blob/main/assets/rss.xml), а пример работы — [здесь](https://hyngng.github.io/rss.xml).
- Поддерживается [IndexNow](https://www.indexnow.org/ko_kr/index), что позволяет автоматизировать запросы на сканирование.

### **Daum Webmaster Tools**

- [Сайт подачи заявки на регистрацию](https://register.search.daum.net/index.daum) и [инструмент для веб-мастеров](https://webmaster.daum.net/) разделены. Первоначальная регистрация сайта — через сайт подачи заявки, а после регистрации карту сайта и фид нужно отправлять отдельно в вебмастере.
- Даже после завершения регистрации в результатах поиска у новых сайтов может не отображаться фавикон. Я обращался в [службу поддержки](https://cs.daum.net/), но получил ответ: «Критерии сбора фавиконов не могут быть подробно раскрыты по политике». Неприятно, но на личном уровне сделать ничего нельзя.

### **Bing Webmaster Tools**

- Если сайт уже нормально зарегистрирован в Google Search Console, можно подключиться через Google и использовать его напрямую. Карта сайта, фиды и т.д., отправленные после пропуска подтверждения прав, синхронизируются автоматически.
- В Bing Webmaster Tools тоже может не отображаться фавикон, но [обращение в службу поддержки](https://www.bing.com/webmasters/support) решает эту проблему. В моём случае фавикон появился через два дня после обращения.
- Как и Naver, поддерживает [IndexNow](https://www.indexnow.org/ko_kr/index).

## **SEO-оптимизация**

С этим понятием я впервые столкнулся, подавая заявку на регистрацию блога в поисковых системах. SEO (Search Engine Optimization) — это процесс улучшения качества веб-сайта или веб-страницы для лучшего отображения и более высоких позиций в поисковых системах. Это настолько важная тема, что [Naver](https://searchadvisor.naver.com/guide/seo-basic-intro) и [Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ko) выпускают официальные руководства.  
Впрочем, у меня основной задачей была не столько работа для высоких позиций, сколько решение проблем, обнаруженных после регистрации в нескольких инструментах для веб-мастеров. Я кратко опишу, какие проблемы возникли и как я их решил.

### **Оптимизация изображений с помощью webp**

Чтобы оценить производительность сайта, я измерил её с помощью [PageSpeed Insights](https://pagespeed.web.dev/?utm_source=psi&utm_medium=redirect). Результаты показали, что в категории «Мобильные устройства» производительность довольно низкая. В отчёте среди множества рекомендаций было указание уменьшить объём изображений, поэтому я занялся этим улучшением.

Я часто выкладываю в блог посты с [рисунками](https://hyngng.github.io/posts/fourth-drawing/) и [фотографиями](https://hyngng.github.io/posts/photos-of-gyemyo/). Среднее разрешение этих изображений — 4000×3000, формат — `.png` или `.jpg`, поэтому объём составлял от 200 КБ до 1 МБ для рисунков и от 1 до 3 МБ для фотографий. Изображения в других статьях тоже следовали этому стандарту и были немаленькими. Посмотрев на другие сайты, я заметил, что многие обрабатывают изображения до объёма менее 100 КБ. Чтобы достичь аналогичного уровня оптимизации, я предпринял следующее:

1. Уменьшил размер изображений в 4 раза. Для формата 4000×3000 — до 2000×1500.
2. Файлы с расширениями `.gif`, `.jpg`, `.png` перекодировал в `.webp` с потерями.

![before-after](/2024-05-23-webmasters-and-seo/before-after.webp)
*Изображения до и после процесса уменьшения объёма.*

Слева — оригинал, справа — файл после даунскейла и конвертации в `webp`. Качество изображения критически не пострадало, но объём сократился с 1,79 МБ до 83,7 КБ — почти в 20 раз. Не у всех файлов такая драматическая разница, но в большинстве случаев эффект снижения объёма очевиден. Результат настолько хорош, что я обработал аналогично и изображения в других постах.

Однако жаль, что качество изображений всё же снижается. Поэтому для рисунков и фотографий я добавил в конце поста фразу вроде «Оригинал изображения можно посмотреть в моём GitHub», чтобы при желании можно было перейти к оригиналу.

### **Устранение дублирования нескольких тегов H1**

На это указали инструменты Naver и Bing. Согласно Руководству по доступности веб-контента (WCAG), веб-страница должна содержать не более одного тега h1. В моём блоге и название сайта на левой боковой панели, и заголовок статьи оформлялись как `<h1>`.

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

Изменённый код. Я решил, что лучше понизить уровень заголовка названия сайта, а не заголовка статьи. Теперь на корневом URL отображается h1, а на других страницах — h2.

Проверив через инструменты разработчика Chrome, я убедился, что на главной странице блога отображается h1, а на текущей странице — h2. После применения изменений я повторно отправил URL, и через два дня на странице диагностики Naver и Bing подтвердилось, что ошибка исправлена.

### **Автоматическая генерация meta description**

:::info
**Обновлено 2024-05-28!**

Сейчас я не использую этот метод. За актуальным решением перейдите к содержимому ниже, изменённому 25 сентября!
:::

На это указал Bing Webmaster Tools. Во многих статьях моего блога использовалось вступление «Введение», которое дублировалось в качестве description для нескольких страниц. Я написал отдельный description в фронтматере, но объёмом около 20 символов, что вызывало ошибку «Слишком длинный или слишком короткий Meta Description».

Рекомендуемая длина description — 25–160 символов. Подгонять длину под каждую страницу и писать не менее 25 символов — слишком хлопотно, поэтому я написал код для автоматической генерации description.

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

Реализация оказалась непростой. Мета-теги, включая description, сначала генерируются плагином `jekyll-seo-tag`, поэтому я реализовал переопределение description среди сгенерированных `seo_tags`. В процессе была проблема, что файлы в папке `_includes`, включая `head.html`, не имеют доступа к содержимому страницы, но я решил её, передавая `content` через `_layouts/default.html`.

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

`content` проходит через пользовательский Ruby-плагин `content_filter`, который удаляет ненужную для description информацию: заголовки, дату публикации, автора и вступление «Введение». Использован тот факт, что весь текст статьи находится в теге `<div class="content"></div>`. Хотя у меня [был опыт написания похожего кода](https://hyngng.github.io/posts/blog-content-remove/), я всё ещё не очень熟悉, поэтому за советом обратился к GPT.

:::info
**Обновлено 2024-09-25!**
:::

На самом деле, описанное выше — поверхностное решение. Новый description дублировался с description из {% raw %}`{{ seo_tags }}`{% endraw %}, из-за чего на странице было два тега `<meta name="description" ... >`. Я хотел более фундаментального решения и нашёл в плагине [jekyll-seo-tag](https://github.com/jekyll/jekyll-seo-tag/tree/master) место, где генерируется meta description, и изменил его следующим образом:

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

Изменённый код в зависимости от макета страницы либо загружает description из `_config.yml`, либо генерирует meta description из содержимого поста. Я форкнул этот GitHub-проект в [личный репозиторий](https://github.com/hyngng/jekyll-seo-tag), изменил его отдельно и подключаю через `Gemfile` как показано ниже. Это самое чистое решение, которое я смог найти.

## **Заключение**

Я в спешке проделал работу от подачи заявки на индексацию до SEO-оптимизации, но не знаю, насколько это будет эффективно. Однако мой блог — это скорее пространство для личных записей, чем для продвижения или создания полезной для других информации. Поэтому я буду следить за индексацией из технического любопытства, но не слишком переживать по этому поводу.
