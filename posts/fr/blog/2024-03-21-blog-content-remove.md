---
title: "Supprimer le contenu de certaines balises sur son blog GitHub"
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
Cet article a été rédigé sous le framework Jekyll. Il a depuis migré vers Astro !
:::

## **Introduction**

Le thème Chirpy est épuré et soigné, mais dans son état d'origine, certains points méritent selon moi des améliorations. J'ai déjà [apporté quelques modifications](https://hyngng.github.io/posts/first-blog-customization/) de temps à autre, mais il restait quelques points frustrants.

![before-light](/2024-03-21-blog-content-remove/before-light.webp){: .light .w-75 .border }
![before-dark](/2024-03-21-blog-content-remove/before-dark.webp){: .dark .w-75 }
*Aperçu des résumés d'articles sur la page d'accueil avant modification*

L'un d'eux était que le résumé des articles sur la page d'accueil affichait le contenu brut, incluant les légendes d'images ou les en-têtes. Comme ci-dessus, des éléments superflus tels que les légendes ou les « Introduction » s'affichaient, nuisant à la lisibilité. Je me disais qu'un tel traitement devrait être pris en charge par défaut, et j'ai enfin trouvé une solution.

## **Analyse de la cause**

```html
<div class="card-text content mt-0 mb-3">
  <p>
    {% include no-linenos.html content=post.content %}
    {{ content | markdownify | strip_html | truncate: 200 | escape }}
  </p>
</div>
```

Le contenu de la page d'accueil du blog GitHub est défini dans `_layouts/home.html`. Dans mon cas, le code standard était comme ci-dessus, et le paragraphe `<div class="card-text content mt-0 mb-3">` génère le résumé de l'article.

En examinant le code, le contenu était simplement traité par `markdownify` et `strip_html` avant d'être affiché sous forme de texte. L'idée d'ajouter un filtre supplémentaire pour supprimer certaines balises a germé, et j'ai suivi le processus suivant.

## **Écriture du code**

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
Un traitement similaire peut être appliqué au fichier `assets/js/data/search.json` qui gère les résultats de recherche.
:::

N'ayant aucune connaissance préalable de Ruby ou Liquid, j'ai eu du mal à trouver la solution. J'ai d'abord essayé de me contenter de Liquid avec `split` ou `join`, mais je n'obtenais pas le résultat souhaité. J'ai donc sollicité l'aide de GPT et résolu le problème en créant un fichier Ruby dans le dossier `_plugins/remove-tags.rb`. Ce fichier Ruby contient une fonction qui prend en paramètre les types de balises et supprime leur contenu textuel à l'aide d'expressions régulières. J'ai utilisé la bibliothèque d'analyse `Nokogiri`, et dans le fichier Liquid, on l'utilise comme `remove_tag: 'h2', 'h3', 'em', 'blockquote'`.

:::info
Mis à jour le 20/10/2025 !
:::

Avec la mise à jour de Chirpy vers la version `v7.4.0`, `post-description.html` a été remplacé par `post-summary.html`. La structure étant très similaire, on peut l'écrire comme suit :

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

## **Vérification de l'amélioration**

![after-light](/2024-03-21-blog-content-remove/after-light.webp){: .light .w-75 .border}
![after-dark](/2024-03-21-blog-content-remove/after-dark.webp){: .dark .w-75 }
*Résumé d'article amélioré après application du code*

Le code fonctionne correctement. Comparé à avant, les textes superflus ont été supprimés, améliorant considérablement la lisibilité du résumé. L'aspect confus d'avant a disparu, le résultat est bien plus naturel, et il suffit d'ajouter les balises souhaitées après `remove_tag:` pour en supprimer d'autres à l'avenir — l'utilisation est simple. Je compte bien m'en servir comme il se doit.
