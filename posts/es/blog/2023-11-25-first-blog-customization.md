---
title: "Personalizando la plantilla de un blog de GitHub"
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
Este artículo fue escrito cuando usaba el framework Jekyll. ¡Ahora he migrado a Astro!
:::

## **Introducción**

![new-files-dark](/2023-11-25-first-blog-customization/new-files-dark.webp){: .dark .w-50 .right .shadow }
![new-files-light](/2023-11-25-first-blog-customization/new-files-light.webp){: .light .w-50 .right .border }

Parece que la plantilla del blog que estoy usando ha ido [mejorando](https://github.com/cotes2020/jekyll-theme-chirpy) constantemente. La versión ya ha subido a `6.3.1`. Al examinar el tema renovado, noto que se ha añadido la función de mostrar imágenes de vista previa en los posts de la página principal y que, en general, la paleta de colores se ha refinado de manera más ordenada.

Estaba buscando el método de actualización y, en el proceso, descubrí que cuando abrí el blog por primera vez usé el método Chirpy starter. Este método tiene la ventaja de que el proceso de creación es sencillo, pero la desventaja de que el margen de personalización es algo limitado.

La razón por la que abrí un blog de GitHub en lugar de Tistory o Naver Blog fue precisamente la ventaja de una amplia personalización, así que sentí que el propósito se diluía. Rápidamente cambié al método GitHub Fork que indica la página oficial.

Siguiendo este método paso a paso, la cantidad de archivos del blog aumentó notablemente. Al revisar las nuevas carpetas `_includes`, `_javascript`, `_layouts` y `_sass`, vi que estaban diseñadas para que se pudieran modificar los archivos JavaScript y CSS para editar directamente los componentes de la página web, así que ajusté algunas cosas.

## **Modificaciones de la plantilla**

### **Ajuste del tamaño de fuente y el espaciado entre párrafos**

Una de las cosas que me había estado molestando era que el tamaño de la fuente era un poco grande. No sabía bien cómo modificar el tamaño de la letra y tampoco era incómodo funcionalmente, así que hasta ahora lo había dejado pasar, pero ya que iba a renovar el blog, decidí corregirlo.

SCSS se puede modificar o escribir nuevo código en `assets/css/jekyll-theme-chirpy.scss`, así que puedo escribir código en este archivo. Las propiedades del texto de los posts están gestionadas por el selector `.content` en `_scss/addon/commons.scss`, así que establecí el valor de `font-size` en aproximadamente 0.98 para todos los `.content`, y también ajusté el espaciado entre párrafos de 1.25rem a aproximadamente 1.5rem, tomando como referencia los formatos de Tistory o Naver Blog.

```css
.content {
  font-size: 0.98rem;
}

p:not(blockquote p) {
  margin-top: 1.5rem;
}
```

### **Eliminación del pie de página inferior del sitio**

El tema Chirpy original genera un pie de página en la parte inferior del blog con «ⓒ {año} {nombre} Algunos derechos reservados» a la izquierda y «Powered by Jekyll with Chirpy theme» a la derecha. Como el segundo no es una información especialmente importante, busqué el código relacionado con la generación del pie de página y lo comenté para que se viera más limpio.

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
**¡Actualizado el 26 de mayo de 2024!**

Mientras administraba el blog, descubrí que la plantilla Chirpy está bajo la [licencia MIT](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/LICENSE) y que, en principio, no está permitido eliminar el pie de página. Decidí restaurar el código comentado para cumplir con la licencia.
:::

### **Títulos de los artículos en negrita**

Al ver que en otra plataforma de escritura, [Medium](https://medium.com/), los títulos de los artículos se muestran en negrita para captar la atención del usuario, escribí el siguiente código en `assets/css/jekyll-theme-chirpy.scss` para que los títulos de los artículos de mi blog también se muestren resaltados en negrita.

```css
.btn-outline-primary {
  font-weight: bold;
}
```

### **Eliminación de la navegación entre posts**

![post-nav-light](/2023-11-25-first-blog-customization/post-nav-light.webp){: .light .border }
![post-nav-dark](/2023-11-25-first-blog-customization/post-nav-dark.webp){: .dark }
*Navegación entre posts. Guía al usuario al artículo anterior o siguiente respecto al actual.*

La navegación entre posts es una función que, en la parte inferior del artículo, enlaza con el post inmediatamente anterior y el siguiente al actual. Personalmente me pregunto para qué sirve. No muestra artículos de la misma categoría, sino que los expone como los más relacionados simplemente en la línea temporal, cuando los temas de los artículos no tienen nada que ver entre sí.

Me parecía que la navegación entre posts más bien desordenaba la parte inferior de la página, así que quería quedarme solo con la sección de «Artículos relacionados». Busqué y eliminé el código `- post-nav` que carga la navegación entre posts en `_layouts/post.html`{: .filepath}.

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
**¡Actualizado el 16 de abril de 2024!**

Al seguir gestionando el blog, descubrí que escribo sobre temas más variados de lo que pensaba. Mantener la navegación podría conectar con los diversos temas sobre los que escribo, así que restauré también la parte de `- post-nav` 😭
:::

### **Modificación del color de fondo de la barra lateral**

Quería modificar el color de fondo de la barra lateral, pero si usaba directamente la propiedad `background-color`, el color se fijaba independientemente del modo oscuro. Lo que quería era dejar el color del modo claro tal cual y cambiar solo el color del modo oscuro. Afortunadamente, el tema Chirpy separa el `typography-dark.scss` para el modo oscuro del de modo claro en la ruta `_sass/colors`, así que en ese archivo cambié el color de fondo de la barra lateral en modo oscuro a aproximadamente **#1D1D1E**.

```scss
--sidebar-bg: #1D1D1E;
```

### **Cambio en la forma de generar el TOC**

El tema Chirpy genera por defecto un TOC (índice de contenidos) en la parte derecha de la página del post. Aunque ofrece funciones útiles como ver en qué punto del artículo se está o saltar directamente a una sección deseada, el problema es que al actualizar el tema, su funcionamiento cambió y se volvió incómodo.

No sé exactamente a partir de qué versión cambió, pero antes generaba el índice desde h1, mientras que ahora solo lo genera si hay etiquetas h2 o inferiores. Supongo que tendrá sus razones, pero personalmente no me gustó, así que lo devolví a como estaba. Como el código es extenso, solo escribí la parte que modifiqué.

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
**¡Actualizado el 16 de abril de 2024!**
:::

Mientras registraba el blog en la web, recibí una advertencia de Naver Search Advisor y Bing Webmaster Tools que decía «se han encontrado varias etiquetas h1». Al investigar por qué existe este tipo de advertencia, descubrí las [Pautas de Accesibilidad al Contenido Web (WCAG)](https://www.w3.org/TR/WCAG21/). Parece que la razón por la que se cambió para que el TOC se genere a partir de etiquetas h2 en adelante es para fomentar el uso de una sola etiqueta h1 según esta directriz. Al comprobar con las herramientas de desarrollo documentos como la [Wikipedia](https://es.wikipedia.org/wiki/Wikipedia), vi que el título del artículo se trata con una etiqueta h1 y el índice a partir de h2.

No estoy seguro de si realmente es por las WCAG, pero creo que las recomendaciones deben cumplirse, así que modifiqué todos los encabezados usados en los posts del blog reduciéndolos un nivel. Sin embargo, quería que el tamaño de fuente del índice se mantuviera, así que establecí la propiedad `font-size` por separado en `jekyll-theme-chirpy.scss` como se muestra a continuación.

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

### **Cambio de fuente de etiquetas específicas**

```scss
$font-family-base: 'IBM Plex Sans KR', 'Source Sans Pro', 'Microsoft Yahei', sans-serif;
$font-family-heading: 'IBM Plex Sans KR', Lato, 'Microsoft Yahei', sans-serif;
```

La fuente por defecto me daba la sensación de tener un espaciado entre caracteres amplio, así que busqué una fuente de espaciado más estrecho en [Google Fonts](https://fonts.google.com) y la cambié. En lugar de modificar directamente el código que define la fuente, la plantilla tiene un `variables-hook.scss` donde escribí el código por separado. Al ver la pantalla con la nueva fuente aplicada, queda mucho mejor.

## **Conclusión**

![post-push-light](/2023-11-25-first-blog-customization/post-push-light.webp){: .light .border }
![post-push-dark](/2023-11-25-first-blog-customization/post-push-dark.webp){: .dark }
*¡El tiempo del workflow se ha reducido a unos 2 minutos!*

No sé por qué, pero al actualizar el tema del blog, el tiempo que tarda en reflejarse realmente el artículo tras el push se ha reducido considerablemente. Antes llegaba a tardar casi 10 minutos, pero ahora se refleja en unos 2 minutos.

Además de esto, probé muchas cosas como eliminar el icono de Twitter o aplicar saltos de línea basados en palabras en frases en coreano, pero no las apliqué porque el icono no se centraba y se quedaba desviado a la izquierda, o los párrafos quedaban antiestéticos. Cuando vuelva a tener ganas, lo intentaré de nuevo.
