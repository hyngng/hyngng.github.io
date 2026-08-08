---
title: "Ajouter le support multilingue à son blog GitHub"
authors: ["blog", "dev"]

categories: [블로그]
tags: [블로그, 다국어, jekyll-polyglot]
start_with_ads: true

toc: true

date: 2024-06-07 22:00:00 +0900
last_modified_at: 2025-10-16 13:07:00 +0900
---

:::info
**Mis à jour le 28/07/2026 !**

Cet article a été rédigé sous le framework Jekyll. Il a depuis migré vers Astro !
:::

:::info
**Mis à jour le 15/09/2024 !**

C'était bien d'offrir un support multilingue, mais la maintenance est devenue trop difficile et complexe, j'ai donc annulé l'application du plugin et suis revenu à l'état antérieur. Pour un vrai support multilingue, il faut retoucher bien plus d'éléments qu'on ne le pense, ce qui rend le processus de fusion avec le thème d'origine très complexe — un inconvénient à accepter.
:::

## **Présentation du plugin**

Il existe principalement deux plugins Jekyll pour implémenter le multilingue dans l'environnement GitHub Blog : jekyll-polyglot et `jekyll-multiple-languages-plugin`. J'ai utilisé le premier, jekyll-polyglot. Ce plugin génère des pages de traduction multilingue en insérant le code de langue I18N après l'URL racine, selon la valeur `lang` définie dans le front matter de chaque article. Ce plugin aurait été créé sur le modèle du second, `jekyll-multiple-languages-plugin`. Le guide officiel, de l'installation aux précautions d'utilisation, est détaillé sur le [dépôt GitHub Polyglot](https://github.com/untra/polyglot?tab=readme-ov-file#how-to-use-it).

## **Travail préparatoire**

### **Installation et configuration du plugin**

```ruby
group :jekyll_plugins do
  gem "jekyll-polyglot"
end
```

Ajoutez le plugin comme ci-dessus dans `Gemfile`, puis installez-le avec la commande `gem install jekyll-polyglot`.

```yaml
plugins:
  - jekyll-polyglot

languages: ["ko", "en"]
default_lang: "ko"
exclude_from_localization: ['javascript', 'images', 'css', 'sitemap.xml']
parallel_localizaion: true
```

Une fois le plugin installé, ajoutez ces éléments à `_config.yml`. Dans `languages`, indiquez les langues que la page supportera, et dans `default_lang`, la langue par défaut de la page. Attention : sous Windows, l'option `parallel_localization` ne fonctionne pas correctement, il faut donc impérativement la définir sur `false`.

### **Correction d'un bug d'expression régulière**

Après avoir installé le plugin et effectué une compilation, on rencontre l'erreur : `'relative_url_regex': target of repeat operator is not specified:`. Cette erreur se produit parce que certaines expressions régulières du fichier `site.rb` du plugin ne gèrent pas les caractères génériques (*) comme `exlude: *.gem *.gemspec *.config.js` dans le `_config.yml` du thème Chirpy. J'ai contacté l'auteur du plugin à ce sujet, mais on m'a répondu, en se référant à [cette documentation](https://jekyllrb.com/docs/configuration/options/#global-configuration), que le thème Chirpy utilisait incorrectement les motifs globaux dans `_config.yml`.

Cependant, d'autres thèmes Jekyll comme Minimal-Mistakes [utilisent également des motifs globaux](https://github.com/mmistakes/minimal-mistakes/blob/master/_config.yml#L168-L169), ce qui suggère qu'il faut modifier le code du plugin lui-même. J'ai donc forké le projet dans [mon dépôt GitHub](https://github.com/hyngng/jekyll-polyglot) et l'ai chargé dans `Gemfile` comme suit :

```ruby
gem 'jekyll-polyglot', git: 'https://github.com/hyngng/jekyll-polyglot', branch: 'master'
```

Ensuite, j'ai modifié les deux fonctions `relative_url_regex()` et `absolute_url_regex()` dans le fichier `site.rb` situé dans `jekyll-polyglot-1.8.0/lib/jekyll/polyglot/patches/jekyll`, comme ci-dessous :

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

Après avoir modifié les fonctions, j'ai entré la commande `bundle exec jekyll s` et confirmé que la compilation s'effectuait sans problème.

### **Modification des attributs des fichiers d'articles**

```yaml
---
lang: en
permalink: example-url-here
---
```

Il faut spécifier la valeur de la langue dans le front matter des articles à traduire. Utilisez les codes de pays I18N comme `ko`, `en`. Dans mon cas, j'ai utilisé `ko-KR` et `en`. Le champ `permalink` détermine le chemin URL de l'article, car dans Jekyll, deux fichiers ayant la même URL sont considérés comme identiques par défaut, il faut donc distinguer artificiellement l'original de la traduction.

```
_posts/2010-03-01-salad-recipes-en.md
_posts/2010-03-01-salad-recipes-sv.md
_posts/2010-03-01-salad-recipes-fr.md
```

Si vous n'aimez pas distinguer la langue de l'article via `permalink` dans le front matter, vous pouvez également modifier le nom du fichier comme ci-dessus. Cependant, dans ce cas, l'URL de la page pourrait contenir une répétition, comme `example.github.io/en/2010-03-01-salad-recipes-en`.

## **Modification du template**

Ces informations étant spécifiques au thème Chirpy, si vous utilisez un autre template Jekyll, vous pouvez passer cette section et passer directement à la [section suivante](#autres-travaux). Cependant, si vous devez modifier le template Chirpy comme moi, les informations suivantes peuvent vous être utiles.

- Variables utilisables dans le plugin jekyll-polyglot :
  - `site.default_lang` : la langue par défaut déclarée dans `_config.yml`.
  - `site.active_lang` : la langue activée sur la page web actuelle.
  - `page.lang` : la langue de l'article déclarée dans le front matter.

En utilisant ces trois variables, on peut par exemple écrire des conditions comme {% raw %}`{% if page.lang == site.default_lang %}`{% endraw %}, et limiter l'affichage de la langue sur la page en fonction du contexte.

### **Chargement de la langue du site**

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

Le template Chirpy définit la langue dans un fichier séparé, `_includes/lang.html`. Après avoir modifié ce fichier comme ci-dessus, on peut l'utiliser en important `lang.html` dans les fichiers de mise en page détaillés.

### **Affichage du contenu par langue**

```html
{% include lang.html %}
```

La plupart du temps, j'ai traité les choses en important `lang.html` comme ci-dessus. Pour la pagination et d'autres cas, simplement changer la langue désignée ne suffisait pas, j'ai donc créé des formules supplémentaires. La plupart du temps, j'ai modifié les pages pour qu'elles n'affichent que les informations liées aux articles rédigés dans la langue spécifique.

```html
<div id="post-list" class="flex-grow-1 px-xl-1">
  {% for post in posts %}
    {% if post.lang == site.active_lang %}
      <article class="card-wrapper card">...</article>
    {% endif %}
  {% endfor %}
</div>
```

Par exemple, j'ai ajouté la condition {% raw %}`{% if post.lang == site.active_lang %}`{% endraw %} dans `_layouts/home.html` pour que la page d'accueil n'affiche que les articles rédigés dans la langue active du site. Voici les autres fichiers que j'ai modifiés en détail :

| Usage | Chemin du fichier |
|--------|--------|
| Modèle de cadre commun | `_layouts/default.html` |
| Page d'accueil | `_layouts/home.html` |
| Catégories | `_layouts/category.html` |
| Page de tags | `_layouts/tags.html` |
| Page d'archives | `_layouts/archive.html` |
| Page À propos | `_layouts/about.html` |
| Articles récemment modifiés | `_includes/update-list.html` |
| Exploration de tags | `_includes/trending_tags.html` |
| Articles connexes | `_includes/related-posts.html` |
| Navigation entre articles | `_includes/post-nav.html` |
| Pagination | `_includes/post-paginator.html` |

### **Distinction du contenu de la page À propos**

```html
{% if site.active_lang == 'ko-KR' %}
## 자기소개 (coréen)
...
{% elsif site.active_lang == 'en' %}
## English Self-Introduction
...
{% endif %}
```

Voici comment afficher un contenu différent dans la page À propos (about) selon la langue. Au début, je pensais devoir créer des fichiers séparés comme `about-en.md`, mais il s'est avéré que la méthode la plus simple était d'afficher un contenu différent dans un seul fichier en fonction de la langue du site.

### **Affichage naturel du nombre de caractères**

```html
<span
  class="readtime"
  data-bs-toggle="tooltip"
  data-bs-placement="bottom"
  title="{{ words }}{% if site.active_lang != 'ko-KR' %}{{ ' ' }}{% endif %}{{ site.data.locales[include.lang].post.words }}
>
```

Un petit détail qui me gênait. Dans ce thème, lorsqu'on survole le temps de lecture en haut de l'article, le nombre de caractères s'affiche, mais indépendamment de la langue, il y a un espace entre le nombre et l'unité, ce qui donne « 1000 자 ». Je trouvais cela peu naturel, j'ai donc modifié l'affichage : en coréen, cela s'affiche comme « 1000자 », et dans les autres langues, avec un espace, comme « 1000 words ».

## **Autres travaux**

### **Indication de la langue de la page dans l'en-tête**

```html
{% I18n_Headers %}
```

C'est une recommandation du [Guide international et multilingue du Centre de recherche Google](https://developers.google.com/search/docs/specialty/international/localized-versions?hl=ko). Ce n'est pas obligatoire, mais si vous êtes soucieux du SEO, il est bon d'ajouter le code ci-dessus dans l'en-tête pour indiquer la langue de la page. Le code se transforme comme suit après compilation :

```html
<meta http-equiv="Content-Language" content="ko-KR">
<link rel="alternate" hreflang="ko-KR" href="ttps://hyngng.github.io/posts/:title/"/>
<link rel="alternate" hreflang="en" href="https://hyngng.github.io/en/posts/:title/"/>
```

### **Inclusion du plugin dans le processus de compilation**

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

Contrairement aux plugins intégrés par défaut, jekyll-polyglot est considéré comme un plugin externe et doit être compilé séparément pour des raisons de sécurité. Créez un nouveau fichier `.yml` dans le dossier `.github/workflows/` et écrivez-le comme ci-dessus pour une compilation sans problème.

### **Inclusion de toutes les pages dans le sitemap**

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

Le sitemap est l'un des plus grands problèmes du support multilingue, car il ne génère les balises `<loc>` que pour les pages par défaut. Au lieu de cela, j'ai modifié le code pour qu'il vérifie chaque langue dans `site.languages`, tout en ignorant les éléments non valides, comme les pages coréennes automatiquement générées à partir d'un fichier défini avec `lang: en`.

### **Ajout d'un bouton de changement de langue sur la page**

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

Si nécessaire, on peut ajouter un bouton de changement de langue à l'endroit souhaité avec le code ci-dessus. Personnellement, comme mon blog ne contient pas vraiment de contenu exclusif par langue, et que les visiteurs n'ont pas nécessairement besoin de voir la page dans une autre langue, je ne l'ai pas ajouté.

### **Distinction du contenu du flux par langue**

```
{% assign filtered_posts = site.posts | where: "lang", site.active_lang %}

{% for post in filtered_posts limit: 5 %}
  <entry> ... </entry>
{% endfor %}
```

J'ai également fait en sorte que le flux ne contienne que les articles correspondant à `site.active_lang` dans `filtered_posts`, généré dynamiquement selon la configuration linguistique. Lors de l'inscription aux outils pour webmasters, j'ai enregistré `feed.xml` et `/en/feed.xml` séparément.

## **Capture d'écran de l'application**

![result-light](/2024-06-07-blog-polyglot-support/result-light.webp){: .light .border }
![result-dark](/2024-06-07-blog-polyglot-support/result-dark.webp){: .dark }

## **Conclusion**

C'était éprouvant. jekyll-polyglot donne plus l'impression d'être encombrant que flexible et pratique. Le processus d'application n'est vraiment pas facile ni agréable — c'est le moins qu'on puisse dire. J'ai même envisagé de créer une page séparée en anglais et de gérer les deux versions indépendamment, mais comme cela présentait plus d'inconvénients (synchronisation du contenu, configuration de l'exposition dans les moteurs de recherche, etc.), j'ai choisi d'utiliser jekyll-polyglot. Cependant, une fois l'implémentation réussie, les avantages qu'apporte jekyll-polyglot pour créer un système multilingue maison sont indéniables.
