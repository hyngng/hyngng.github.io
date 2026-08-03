---
title: "Eliminando el contenido de etiquetas específicas en un blog de GitHub"
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
Este artículo fue escrito cuando usaba el framework Jekyll. ¡Ahora he migrado a Astro!
:::

## **Introducción**

El tema Chirpy es limpio y ordenado, pero en su estado original hay ocasionales aspectos que creo que necesitan mejorar. Aunque he ido [haciendo ajustes de vez en cuando](https://hyngng.github.io/posts/first-blog-customization/), todavía me quedaban algunas carencias personales.

![before-light](/2024-03-21-blog-content-remove/before-light.webp){: .light .w-75 .border }
![before-dark](/2024-03-21-blog-content-remove/before-dark.webp){: .dark .w-75 }
*Resumen del post mostrado en la página de inicio del blog antes de la modificación.*

Una de ellas era que el resumen del artículo en la página de inicio del blog se mostraba en bruto, incluyendo los pies de foto de las imágenes o los encabezados. Como se ve arriba, partes innecesarias como los pies de foto o el «Introducción» se mostraban junto al contenido, perjudicando la legibilidad. Pensaba que esto debería estar procesado por defecto, pero esta vez encontré la forma y lo corregí.

## **Identificación de la causa**

```html
<div class="card-text content mt-0 mb-3">
  <p>
    {% include no-linenos.html content=post.content %}
    {{ content | markdownify | strip_html | truncate: 200 | escape }}
  </p>
</div>
```

La configuración de la página de inicio del blog de GitHub está escrita en `_layouts/home.html`. En mi caso, el código original estaba escrito como se muestra arriba, y el resumen del post se genera en el bloque `<div class="card-text content mt-0 mb-3">`.

Al examinar el código, el contenido simplemente se muestra como texto tras pasar por `markdownify` y `strip_html`. Pensé que sería buena idea añadir un filtro adicional para eliminar etiquetas específicas, y seguí el proceso que se describe a continuación.

## **Escritura del código**

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
El archivo `assets/js/data/search.json`, que se encarga del texto de los resultados de búsqueda, también puede recibir un tratamiento similar.
:::

No tenía conocimientos previos sobre Ruby o Liquid, así que me costó un poco encontrar la forma. Intenté resolverlo solo con Liquid mediante `split` o `join`, pero me resultó difícil obtener el resultado deseado, así que recurrí a GPT. Lo resolví creando un archivo Ruby en la ruta `_plugins/remove-tags.rb` y utilizándolo. En el archivo Ruby creé una función que recibe el tipo de etiqueta como parámetro y elimina el texto interno mediante una expresión regular. Usé la biblioteca de análisis `Nokogiri`, y en el archivo Liquid se usa como `remove_tag: 'h2', 'h3', 'em', 'blockquote'`.

:::info
¡Actualizado el 20 de octubre de 2025!
:::

Con la actualización de Chirpy a la versión `v7.4.0`, `post-description.html` ha sido reemplazado por `post-summary.html`. Sin embargo, la estructura es muy similar, por lo que se puede escribir de la siguiente manera.

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

## **Verificación de la mejora**

![after-light](/2024-03-21-blog-content-remove/after-light.webp){: .light .w-75 .border}
![after-dark](/2024-03-21-blog-content-remove/after-dark.webp){: .dark .w-75 }
*Resumen del post mejorado tras aplicar el código.*

Al escribir el código, funciona correctamente. Comparado con antes de la modificación, se ha eliminado el texto innecesario y la legibilidad del resumen del artículo ha mejorado significativamente. Ha desaparecido la sensación de confusión que había antes y resulta mucho más natural. Además, si se desea eliminar alguna etiqueta adicional, basta con añadirla después de `remove_tag:`, por lo que su uso también es sencillo. Espero usarlo adecuadamente en el futuro.
