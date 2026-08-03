---
title: "Añadiendo soporte multilingüe a un blog de GitHub"
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
**¡Actualizado el 28 de julio de 2026!**

Este artículo fue escrito cuando usaba el framework Jekyll. ¡Ahora he migrado a Astro!
:::

:::info
**¡Actualizado el 15 de septiembre de 2024!**

Estaba bien tener soporte multilingüe, pero el mantenimiento se volvió demasiado difícil y complejo, así que volví al estado anterior a la aplicación del plugin. Para ofrecer un soporte multilingüe adecuado, hay que modificar muchas más partes de las que parece, y por tanto hay que asumir la incomodidad de que el proceso de fusión con el tema original se vuelve muy complicado.
:::

## **Introducción al plugin**

Los plugins de Jekyll que permiten implementar la función multilingüe en el entorno de GitHub Pages son principalmente dos: jekyll-polyglot y `jekyll-multiple-languages-plugin`. El que yo usé es el primero, jekyll-polyglot. Este plugin genera páginas traducidas insertando el código de idioma I18N después de la URL raíz según el valor de `lang` definido en el front matter de cada post. Este plugin se creó tomando como modelo el segundo, `jekyll-multiple-languages-plugin`, y la guía oficial explica detalladamente desde el método de instalación hasta las precauciones de uso en el [repositorio de Polyglot en GitHub](https://github.com/untra/polyglot?tab=readme-ov-file#how-to-use-it).

## **Trabajo preliminar**

### **Instalación y configuración del plugin**

```ruby
group :jekyll_plugins do
  gem "jekyll-polyglot"
end
```

Registra el plugin en `Gemfile` como se muestra arriba e instálalo con el comando `gem install jekyll-polyglot`.

```yaml
plugins:
  - jekyll-polyglot

languages: ["ko", "en"]
default_lang: "ko"
exclude_from_localization: ['javascript', 'images', 'css', 'sitemap.xml']
parallel_localizaion: true
```

Una vez instalado el plugin, hay que añadir los elementos anteriores a `_config.yml`. En `languages` se introducen los idiomas que admitirá la página, y en `default_lang` el idioma predeterminado. Una precaución al introducirlos es que, en el entorno Windows, la opción `parallel_localization` no funciona correctamente, por lo que hay que establecer ese valor en `false`.

### **Corrección de un bug de expresión regular**

Al instalar el plugin e intentar construir, te encuentras con el error: «'relative_url_regex': target of repeat operator is not specified:». Este error se produce porque algunas expresiones regulares en el archivo `site.rb` del plugin no pueden manejar los comodines (`*`) como `exlude: *.gem *.gemspec *.config.js` en `_config.yml` del tema Chirpy. Consulté al creador del plugin sobre este problema, pero recibí la respuesta de que, basándose en [este documento](https://jekyllrb.com/docs/configuration/options/#global-configuration), el tema Chirpy está usando mal los patrones globales en `_config.yml`.

Sin embargo, viendo que otros temas de Jekyll como Minimal-Mistakes también [usan patrones globales](https://github.com/mmistakes/minimal-mistakes/blob/master/_config.yml#L168-L169), parece necesario modificar el propio código del plugin. En este caso, hay que modificar y usar el plugin por cuenta propia, así que hice un fork del proyecto a [mi repositorio de GitHub](https://github.com/hyngng/jekyll-polyglot) y lo cargué en `Gemfile` de la siguiente manera.

```ruby
gem 'jekyll-polyglot', git: 'https://github.com/hyngng/jekyll-polyglot', branch: 'master'
```

Después, modifiqué las dos funciones `relative_url_regex()` y `absolute_url_regex()` escritas en `site.rb` en la ruta `jekyll-polyglot-1.8.0/lib/jekyll/polyglot/patches/jekyll` del plugin como se muestra a continuación.

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

Después de modificar las funciones, al introducir el comando `bundle exec jekyll s`, pude confirmar que la construcción se realizaba sin problemas.

### **Modificación de las propiedades del archivo del post**

```yaml
---
lang: en
permalink: example-url-here
---
```

Hay que especificar el valor del idioma en el front matter de los posts que se desea traducir. Básicamente, se especifica con un código de país I18N como `ko`, `en`. En mi caso, los escribí como `ko-KR` y `en`. De estos, `permalink` especifica la ruta URL del post, y es para distinguir artificialmente el original de la traducción, ya que en Jekyll dos archivos con la misma URL se tratan por defecto como el mismo.

```
_posts/2010-03-01-salad-recipes-en.md
_posts/2010-03-01-salad-recipes-sv.md
_posts/2010-03-01-salad-recipes-fr.md
```

Si no te gusta distinguir el idioma del post mediante `permalink` en el front matter, también se puede distinguir cambiando el nombre del archivo como se muestra arriba. Sin embargo, en ese caso, la URL de la página puede contener una redundancia, como `example.github.io/en/2010-03-01-salad-recipes-en`.

## **Modificación de la plantilla**

Este contenido es específico del tema Chirpy, por lo que si se usa otra plantilla de Jekyll, se puede omitir esto y pasar al [siguiente párrafo](#otros-trabajos). No obstante, si alguien necesita modificar la plantilla Chirpy de manera similar a la mía, el siguiente contenido puede ser de ayuda.

- Variables utilizables en el plugin jekyll-polyglot
	- `site.default_lang`: el valor del idioma predeterminado declarado en `_config.yml`.
	- `site.active_lang`: el valor del idioma activo en la página web actual.
	- `page.lang`: el valor del idioma del post declarado en el front matter.

Utilizando estas tres variables, se pueden escribir condicionales como {% raw %}`{% if page.lang == site.default_lang %}`{% endraw %} y limitar el idioma mostrado en la página según la situación.

### **Carga del idioma del sitio**

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

La plantilla Chirpy establece el idioma en un archivo separado llamado `_includes/lang.html`. Se puede utilizar modificando ese archivo como se muestra arriba y cargando `lang.html` desde los archivos de diseño detallados.

### **Mostrar contenido por idioma**

```html
{% include lang.html %}
```

En la mayoría de los casos, lo procesé cargando `lang.html` como se muestra arriba. En casos como la paginación, simplemente cambiar la especificación del idioma no era suficiente, así que escribí fórmulas adicionales. En su mayoría, cambié las páginas para que mostraran solo la información relacionada con los posts escritos en el idioma de la página específica.

```html
<div id="post-list" class="flex-grow-1 px-xl-1">
  {% for post in posts %}
    {% if post.lang == site.active_lang %}
      <article class="card-wrapper card">...</article>
    {% endif %}
  {% endfor %}
</div>
```

Por ejemplo, en `_layouts/home.html` añadí la condición {% raw %}`{% if post.lang == site.active_lang %}`{% endraw %} para que, en la página de inicio, si el idioma del sitio es inglés, solo se muestren los posts escritos con `lang: en`. Estos son los archivos que modifiqué en detalle.

| Uso | Ruta del archivo |
|--------|--------|
| Página de plantilla común | `_layouts/default.html` |
| Página de inicio | `_layouts/home.html` |
| Categoría | `_layouts/category.html` |
| Página de etiquetas | `_layouts/tags.html` |
| Página de archivo | `_layouts/archive.html` |
| Página de información | `_layouts/about.html` |
| Posts modificados recientemente | `_includes/update-list.html` |
| Exploración de etiquetas | `_includes/trending_tags.html` |
| Posts relacionados | `_includes/related-posts.html` |
| Navegación entre posts | `_includes/post-nav.html` |
| Paginación | `_includes/post-paginator.html` |

### **Distinción del contenido de la página de información**

```html
{% if site.active_lang == 'ko-KR' %}
## 한국어 자기소개
...
{% elsif site.active_lang == 'en' %}
## English Self-Introduction
...
{% endif %}
```

Es el método para mostrar contenido diferente según el idioma en la página de información (about). Al principio pensé que tendría que usar archivos separados como `about-en.md`, pero el método más sencillo resulta ser mostrar contenido diferente en un mismo archivo según el idioma del sitio.

### **Cambio natural en la visualización del número de caracteres**

```html
<span
  class="readtime"
  data-bs-toggle="tooltip"
  data-bs-placement="bottom"
  title="{{ words }}{% if site.active_lang != 'ko-KR' %}{{ ' ' }}{% endif %}{{ site.data.locales[include.lang].post.words }}
>
```

Un pequeño detalle que corregí porque me molestaba. En este tema, al pasar el cursor del ratón sobre el tiempo de lectura en la parte superior del post, se muestra el número de caracteres. Independientemente del idioma, hay un espacio entre el número y la unidad, por lo que se muestra como «1000 자». Personalmente me parecía poco natural, así que lo cambié para que en coreano se muestre como «1000자» y en otros idiomas como «1000 words», con espacio.

## **Otros trabajos**

### **Especificar el idioma de la página en el encabezado**

```html
{% I18n_Headers %}
```

Es una cuestión indicada en la [guía internacional y multilingüe del Centro de Búsqueda de Google](https://developers.google.com/search/docs/specialty/international/localized-versions?hl=ko). No es obligatorio, pero si te preocupa la optimización para motores de búsqueda (SEO), es recomendable añadir el código anterior en el encabezado para especificar el idioma de la página. El código se transforma en lo siguiente tras la construcción.

```html
<meta http-equiv="Content-Language" content="ko-KR">
<link rel="alternate" hreflang="ko-KR" href="ttps://hyngng.github.io/posts/:title/"/>
<link rel="alternate" hreflang="en" href="https://hyngng.github.io/en/posts/:title/"/>
```

### **Incluir el plugin en el proceso de construcción**

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

jekyll-polyglot se trata como un plugin externo, a diferencia de los plugins incorporados por defecto, por lo que debe construirse por separado por razones de seguridad. Se crea un nuevo archivo `.yml` en la ruta `.github/workflows/` y se escribe como se muestra arriba para que la construcción se realice sin problemas.

### **Incluir todas las páginas en el mapa del sitio**

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

El mapa del sitio es uno de los mayores problemas al admitir múltiples idiomas, porque solo genera la etiqueta `<loc>` para la página predeterminada. En su lugar, lo modifiqué para que compruebe una vez cada idioma en `site.languages`, y entre ellos, hice que se ignoraran los elementos no válidos, como las páginas en coreano generadas automáticamente a partir de un archivo configurado con `lang: en`.

### **Añadir un botón de cambio de idioma en la página**

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

Si es necesario, se puede añadir un botón de cambio de idioma en el lugar deseado con un código como el anterior. Sin embargo, personalmente no lo añadí porque mi blog no tiene contenido exclusivo por idioma y creo que quienes visitan mi página no tienen necesidad de verla en otro idioma.

### **Distinción del contenido del feed por idioma**

```
{% assign filtered_posts = site.posts | where: "lang", site.active_lang %}

{% for post in filtered_posts limit: 5 %}
  <entry> ... </entry>
{% endfor %}
```

También hice que el feed generara dinámicamente solo los posts que coinciden con `site.active_lang` en `filtered_posts`, según la configuración de idioma. Al registrarlo en las herramientas para webmasters, registré `feed.xml` y `/en/feed.xml` por separado.

## **Pantalla de aplicación**

![result-light](/2024-06-07-blog-polyglot-support/result-light.webp){: .light .border }
![result-dark](/2024-06-07-blog-polyglot-support/result-dark.webp){: .dark }

## **Conclusión**

Es agotador. jekyll-polyglot tiene más bien una sensación de ser una molestia que de ser flexible y cómodo. No se puede decir, ni siendo generoso, que el proceso de aplicación sea fácil y cómodo, así que llegué a pensar si no sería mejor abrir una página separada solo en inglés y gestionar dos sitios. Pero como tener que sincronizar el contenido de las páginas y configurar la exposición en los motores de búsqueda parecía tener más desventajas, opté por usar jekyll-polyglot. Aun así, si se puede implementar, parece que las ventajas que aporta jekyll-polyglot a la hora de crear una función de soporte multilingüe propio son claras.
