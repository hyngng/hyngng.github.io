---
title: "Удаление содержимого определённых тегов в GitHub-блоге"
authors: ["blog"]

categories: [블로그]
tags: [블로그, 커스터마йзинг, Chirpy, Liquid]
start_with_ads: true

toc: true
toc_sticky: true

date: 2024-03-21 19:32:00 +0900
last_modified_at: 2025-10-20 22:29:00 +0900
---

## **Введение**

Тема Chirpy выглядит чисто и аккуратно, но в стоковом состоянии иногда встречаются моменты, которые хочется доработать. Я [вношу правки время от времени](https://hyngng.github.io/posts/first-blog-customization/), но всё равно оставалось несколько личных недочётов.

![before-light](/2024-03-21-blog-content-remove/before-light.webp){: .light .w-75 .border }
![before-dark](/2024-03-21-blog-content-remove/before-dark.webp){: .dark .w-75 }
*Превью поста на главной странице блога до изменений*

Один из них — анонсы статей на главной странице отображаются «как есть», включая подписи к изображениям, заголовки и т.п. Как на картинке выше — видны лишние элементы вроде подписей и вступительных заголовков, что ухудшает читаемость. Казалось бы, это должно обрабатываться по умолчанию, но в этот раз я нашёл способ и исправил.

## **Выяснение причины**

```html
<div class="card-text content mt-0 mb-3">
  <p>
    {% include no-linenos.html content=post.content %}
    {{ content | markdownify | strip_html | truncate: 200 | escape }}
  </p>
</div>
```

Содержимое главной страницы блога описано в `_layouts/home.html`. В моём случае оригинальный код выглядел как выше, а блок `<div class="card-text content mt-0 mb-3">` формирует превью поста.

Анализ кода показал, что содержимое просто проходит через `markdownify` и `strip_html` и отображается как текст. Я подумал, что хорошо бы добавить дополнительный фильтр для удаления определённых тегов. Процесс был следующим.

## **Написание кода**

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
Аналогичную обработку можно применить к файлу `assets/js/data/search.json`, который отвечает за текст результатов поиска.
:::

Поскольку у меня не было опыта работы с Ruby или Liquid, пришлось повозиться. Пытался решить средствами самого Liquid (`split`, `join` и т.д.), но получить желаемый результат было трудно, поэтому я обратился за помощью к GPT. Решение заключалось в создании Ruby-файла по пути `_plugins/remove-tags.rb`. В Ruby-файле я создал функцию, которая принимает типы тегов и удаляет их содержимое с помощью регулярных выражений. Использовал парсинговую библиотеку `Nokogiri`, а в Liquid-файле применяю так: `remove_tag: 'h2', 'h3', 'em', 'blockquote'`.

:::info
Обновлено 2025-10-20!
:::

С обновлением Chirpy до версии `v7.4.0` файл `post-description.html` был заменён на `post-summary.html`. Структура почти та же, поэтому можно написать следующим образом:

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

## **Проверка улучшения**

![after-light](/2024-03-21-blog-content-remove/after-light.webp){: .light .w-75 .border}
![after-dark](/2024-03-21-blog-content-remove/after-dark.webp){: .dark .w-75 }
*Улучшенное превью поста после применения кода*

Код работает. По сравнению с состоянием до изменений, ненужные элементы удалены, читаемость превью значительно улучшилась. Исчезла запутанность, текст стал гораздо естественнее. К тому же, если потребуется удалить другие теги, достаточно добавить их после `remove_tag:`, что очень просто. Буду использовать это по мере необходимости.
