---
title: Registrando un blog de GitHub en herramientas para webmasters y optimizando el SEO
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

## **Introducción**

Durante más de un año estuve gestionando el blog casi en la web profunda, hasta que a principios de este año lo registré en los motores de búsqueda. Lo que me sorprendió fue que, en el caso de Tistory o Naver Blog, las plataformas principales generan índices y los muestran en los resultados de búsqueda aunque no se solicite explícitamente, pero en los sitios personales como GitHub Pages, ese primer paso debe hacerse manualmente.

![search-console](/2024-05-23-webmasters-and-seo/search-console.webp){: .w-75 }
*Herramienta para webmasters representativa: Google Search Console.*

Lo registré en un total de cuatro plataformas, en orden de cuota de los portales coreanos: [Google Search Console](https://search.google.com/search-console/), [Naver Search Advisor](https://searchadvisor.naver.com/), [Daum Webmaster Tools](https://webmaster.daum.net/) y [Bing Webmaster Tools](https://www.bing.com/webmasters?lang=ko). Algo curioso fue que el tiempo que tardó cada sitio en aparecer realmente en los resultados de búsqueda tras registrar el dominio fue muy variable. Desde que solicité el dominio alrededor del 20 de marzo, Daum tardó aproximadamente un día, Google unas dos semanas, y Naver y Bing unas tres semanas en empezar a mostrar resultados.

:::info
**¡Actualizado el 25 de mayo de 2024!**

Adicionalmente, también lo registré en [Pinterest Business Hub](https://www.pinterest.es/business/hub/). Una vez verificada la propiedad del sitio, recopila imágenes basadas en RSS y genera pines.
:::

Como resultado, actualmente en todas las plataformas se confirma la exposición del blog al introducir la consulta `site:hyngng.github.io`. Si alguien, como yo, quiere registrar su sitio personal en las herramientas para webmasters, lo siguiente puede ser de ayuda.

### **Google Search Console**

- En GitHub Pages, se puede verificar la propiedad del sitio mediante una etiqueta HTML escribiéndola en `_includes/head.html` sin problema, pero como el plugin `jekyll-seo-tags` ofrece soporte para esta función, puede ser más cómodo modificar el valor de `webmaster_verifications` en `_config.yml`.

### **Naver Search Advisor**

- En el caso de Naver Search Advisor, no se puede enviar un feed de tipo Atom, por lo que hay que crear un feed RSS aparte y registrarlo. Se puede ver un ejemplo del archivo en [mi GitHub](https://github.com/hyngng/hyngng.github.io/blob/main/assets/rss.xml), y un ejemplo de su funcionamiento en mi blog [aquí](https://hyngng.github.io/rss.xml).
- Es compatible con [IndexNow](https://www.indexnow.org/), por lo que se puede automatizar la solicitud de rastreo.

### **Daum Webmaster Tools**

- El [sitio de solicitud de registro en búsqueda](https://register.search.daum.net/index.daum) y la [herramienta para webmasters](https://webmaster.daum.net/) están separados. El registro inicial del sitio se hace en el sitio de solicitud, y después del registro, el mapa del sitio y el feed deben enviarse por separado en la herramienta para webmasters.
- Aunque el registro del sitio en los resultados de búsqueda esté completo, en el caso de los sitios web nuevos, el favicon no se muestra. Consulté al [centro de atención al cliente](https://cs.daum.net/), pero recibí la respuesta de que «los criterios de recopilación de favicons no pueden revelarse en detalle por política». Es preocupante, pero parece que no hay nada que se pueda hacer a nivel individual.

### **Bing Webmaster Tools**

- Si el sitio está correctamente registrado en Google Search Console, se puede conectar con Google y usarlo directamente. El mapa del sitio y los feeds enviados se sincronizan automáticamente, omitiendo la verificación de la propiedad del sitio.
- Bing Webmaster Tools también tiene el problema de que el favicon no se muestra, pero si se [contacta con el equipo de soporte](https://www.bing.com/webmasters/support), lo resuelven amablemente. En mi caso, dos días después de enviar la consulta, el favicon ya se mostraba correctamente.
- Al igual que Naver, es compatible con [IndexNow](https://www.indexnow.org/).

## **Optimización SEO**

Es un concepto que descubrí al solicitar el registro del blog en los motores de búsqueda. SEO (optimización para motores de búsqueda) es el proceso de mejorar la calidad de un sitio o página web para que se muestre mejor y en posiciones más altas en los motores de búsqueda. Es un concepto de gran interés, hasta el punto de que [Naver](https://searchadvisor.naver.com/guide/seo-basic-intro) y [Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ko) publican guías oficiales al respecto.
Sin embargo, en mi caso, más que trabajar para posicionarme en los primeros puestos, el proceso principal consistió en resolver las advertencias SEO que recibí de varias herramientas para webmasters después de solicitar la exposición en los motores de búsqueda. He resumido brevemente qué problemas concretos tuve y cómo los resolví.

### **Optimización de imágenes usando webp**

Para evaluar el rendimiento del sitio, medí el rendimiento de la página con [PageSpeed Insights](https://pagespeed.web.dev/?utm_source=psi&utm_medium=redirect) de Google, y el resultado en la categoría de teléfono móvil fue bastante lento. Al leer el informe de resultados que se proporciona junto con la medición, entre las numerosas recomendaciones había una sobre reducir el peso de las imágenes, así que mejoré ese aspecto.

Normalmente publico como posts del blog [dibujos que hago de vez en cuando](https://hyngng.github.io/posts/fourth-drawing/) o [fotos que tomo](https://hyngng.github.io/posts/photos-of-gyemyo/). Estas imágenes tienen un tamaño medio de 4000x3000 y extensión `.png` o `.jpg`, por lo que su peso rondaba entre 200 KB y 1 MB para los dibujos, y entre 1 y 3 MB para las fotos. Las imágenes utilizadas en otros artículos también seguían este estándar, por lo que no eran ligeras. Al consultar otros sitios web, vi que muchos casos procesaban las imágenes con un peso bajo de 100 KB o menos, así que, para que mi blog alcanzara un nivel de optimización similar, realicé el siguiente proceso.

1. Reduje el tamaño de las imágenes a 1/4. En el caso del formato 4000x3000, lo ajusté a 2000x1500.
2. Codifiqué los archivos con extensión `.gif`, `.jpg` y `.png` a formato `.webp` mediante compresión con pérdida.

![before-after](/2024-05-23-webmasters-and-seo/before-after.webp)
*Imagen antes y después del proceso de reducción de peso.*

La izquierda es el original, y la derecha es el archivo convertido a `webp` tras reducir la escala. No hay una diferencia fatal en la calidad de la imagen, pero el peso es de 1.79 MB y 83.7 KB respectivamente, una diferencia enorme de aproximadamente 20 veces. No todos los archivos mostraban una diferencia tan drástica, pero la mayoría presentaban un claro efecto de reducción de peso, y como el resultado era bueno, apliqué un tratamiento similar a los archivos de imagen de otros posts.

Sin embargo, me seguía sabiendo mal usar imágenes de calidad reducida, así que para los dibujos y las fotos añadí un texto al final del post como «¡Puedes ver las imágenes originales en mi GitHub!» para que quien quisiera pudiera acceder a las originales.

### **Resolución de la duplicación de dos o más etiquetas H1**

Fue una cuestión señalada por Naver y Bing Webmaster Tools. Según las Pautas de Accesibilidad al Contenido Web (WCAG), una página web debe incluir como máximo una etiqueta h1, pero en mi blog, tanto el título del sitio en la barra lateral izquierda como el título del artículo se estaban procesando como `<h1>`.

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

Código modificado. Me pareció mejor reducir la etiqueta de encabezado del título del sitio antes que la del título del artículo, así que modifiqué el código donde se muestra el título `site.title`. Se cambió para que se muestre como h1 en la URL raíz y como h2 en el resto de URLs.

Al comprobarlo con las herramientas de desarrollo de Chrome, se muestra como h1 en la página de inicio del blog y como h2 en la página actual. Tras la aplicación, volví a enviar la URL modificada, y dos días después pude confirmar a través de la página de diagnóstico del sitio de Naver y Bing Webmaster Tools que el error se había corregido.

### **Generación automática de meta description**

:::info
**¡Actualizado el 28 de mayo de 2024!**

Actualmente no estoy usando este método. Por favor, dirígete al contenido de abajo, modificado el 25 de septiembre, para la solución real.
:::

Fue una cuestión señalada por Bing Webmaster Tools. El problema era que la introducción «Introducción», usada en muchos de los artículos de mi blog, se registraba duplicada como description de varias páginas. Así que escribí una description individual en el front matter, pero al redactarla con unas 20 palabras, aparecía un mensaje de error que decía «Meta Description demasiado larga o demasiado corta».

Se indica que la longitud adecuada de la description es de 25 a 160 caracteres. Escribir 25 caracteres o más ajustando el número de caracteres en cada página es demasiado tedioso, así que escribí un código que genera la description automáticamente.

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

El proceso de implementación fue un poco complicado. Las metaetiquetas, incluida la description, se generan primero de forma masiva a través del plugin `jekyll-seo-tag`, así que lo implementé sobrescribiendo la description entre los `seo_tag` generados. Durante la implementación, había un problema de que los archivos de la carpeta `_includes`, incluido `head.html`, no podían acceder al contenido de la página, pero lo solucioné obteniendo el `content` desde `_layouts/default.html` para usarlo.

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

El `content` pasa por un plugin Ruby personalizado llamado `content_filter`, cuyo propósito es eliminar en cierta medida la información innecesaria para la description, como títulos, fechas de publicación, autor y la introducción «들어가며». Aproveché que todo el cuerpo del artículo se transmite dentro de la etiqueta `<div class="content"></div>`, y aunque ya había [implementado un código similar antes](https://hyngng.github.io/posts/blog-content-remove/), como aún no estaba familiarizado, recurrí a GPT para esta parte.

:::info
**¡Actualizado el 25 de septiembre de 2024!**
:::

La verdad es que lo anterior es una solución superficial. Como la description recién generada se duplicaba con la description de {% raw %}`{{ seo_tags }}`{% endraw %}, había un problema de que existían dos etiquetas `<meta name="description" ... >` en la página. Quería una solución más fundamental, así que busqué la propia parte donde se genera la meta description en el plugin [jekyll-seo-tag](https://github.com/jekyll/jekyll-seo-tag/tree/master) y la modifiqué como se muestra a continuación.

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

El código modificado carga la description escrita en `_config.yml` según el diseño de la página, o genera la meta description a partir del contenido del post. Hice un fork de este proyecto de GitHub a un [repositorio personal](https://github.com/hyngng/jekyll-seo-tag), lo modifiqué por separado y lo uso cargándolo en `Gemfile` como se muestra a continuación. Este método es la solución más limpia que pude encontrar.

## **Conclusión**

He estado trabajando apresuradamente desde la solicitud de exposición en los motores de búsqueda hasta la optimización SEO, pero no sé muy bien qué efecto tendrá. Sin embargo, mi blog tiene un carácter más fuerte de registro personal que de espacio para promocionarse o producir información necesaria para otros, así que, aunque gestiono la exposición en los motores de búsqueda por curiosidad técnica, intento no obsesionarme demasiado con ello.
