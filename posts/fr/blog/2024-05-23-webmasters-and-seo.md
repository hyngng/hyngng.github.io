---
title: "Inscrire son blog GitHub aux outils pour webmasters et optimiser son SEO"
authors: ["blog"]

categories: [블로그]
tags: [블로그, 웹마스터도구, SEO]
start_with_ads: true

toc: true

date: 2024-05-23 11:53:00 +0900
last_modified_at: 2026-01-27 15:09:00 +0900

mermaid: true
---

## **Introduction**

Après avoir géré mon blog pendant plus d'un an presque dans le deep web, je l'ai inscrit aux moteurs de recherche au début de cette année. Ce qui m'a surpris, c'est que pour Tistory ou Naver Blog, les grandes plateformes génèrent automatiquement un index et exposent le contenu dans les résultats de recherche sans demande spécifique, alors que pour un site personnel comme GitHub Blog, il faut faire ce premier pas manuellement.

![search-console](/2024-05-23-webmasters-and-seo/search-console.webp){: .w-75 }
*L'outil pour webmasters le plus représentatif : Google Search Console*

J'ai inscrit mon blog sur quatre plateformes, dans l'ordre de part de marché des portails coréens : [Google Search Console](https://search.google.com/search-console/), [Naver Search Advisor](https://searchadvisor.naver.com/), [Daum Webmaster Tool](https://webmaster.daum.net/) et [Bing Webmaster Tools](https://www.bing.com/webmasters?lang=ko). Un point intéressant est que le délai entre l'enregistrement du domaine et l'apparition réelle dans les résultats de recherche variait considérablement selon la plateforme. Après avoir demandé l'enregistrement du domaine vers le 20 mars, Daum a commencé à m'afficher au bout d'environ un jour, Google après environ deux semaines, et Naver et Bing après environ trois semaines.

:::info
**Mis à jour le 25/05/2024 !**

Je me suis également inscrit au [Pinterest Business Hub](https://www.pinterest.co.kr/business/hub/). Une fois la propriété du site vérifiée, Pinterest collecte les images via RSS et crée des épingles.
:::

Actuellement, sur toutes les plateformes, la requête `site:hyngng.github.io` confirme l'affichage du blog. Si quelqu'un, comme moi, souhaite inscrire son site personnel aux outils pour webmasters, voici quelques informations qui pourraient vous aider.

### **Google Search Console**

- Pour l'authentification de la propriété du site via une balise HTML sur GitHub Blog, on peut l'ajouter dans `_includes/head.html`, mais le plugin `jekyll-seo-tags` supportant cette fonctionnalité, il peut être plus simple de modifier la valeur `webmaster_verifications` dans `_config.yml`.

### **Naver Search Advisor**

- Naver Search Advisor n'acceptant pas les flux de type Atom, il faut créer un flux RSS séparé pour l'inscription. Un exemple de fichier est disponible sur [mon GitHub](https://github.com/hyngng/hyngng.github.io/blob/main/assets/rss.xml), et vous pouvez voir un exemple de fonctionnement sur mon blog [ici](https://hyngng.github.io/rss.xml).
- Naver supportant [IndexNow](https://www.indexnow.org/ko_kr/index), il est possible d'automatiser les demandes de crawling.

### **Daum Webmaster Tool**

- Le [site d'inscription aux moteurs de recherche](https://register.search.daum.net/index.daum) et l'[outil pour webmasters](https://webmaster.daum.net/) sont distincts. L'inscription initiale du site se fait sur le site d'inscription à la recherche ; une fois le site enregistré, le sitemap et le flux doivent être soumis séparément via l'outil pour webmasters.
- Même après l'inscription du site dans les résultats de recherche, la favicon peut ne pas s'afficher pour les sites récents. J'ai contacté le [service client](https://cs.daum.net/), mais on m'a répondu que « les critères de collecte des favicons ne peuvent pas être divulgués en détail pour des raisons de politique interne ». C'est frustrant, mais il semble qu'il n'y ait rien à faire au niveau individuel.

### **Bing Webmaster Tools**

- Si votre site est correctement inscrit dans Google Search Console, vous pouvez le connecter à Bing pour l'utiliser directement. Le sitemap et les flux soumis sont automatiquement synchronisés, sans avoir à vérifier la propriété du site.
- Bing Webmaster Tools a également un problème d'affichage de la favicon, mais le [support](https://www.bing.com/webmasters/support) peut le résoudre rapidement. Dans mon cas, la favicon s'est correctement affichée deux jours après ma demande.
- Comme Naver, Bing supporte [IndexNow](https://www.indexnow.org/ko_kr/index).

## **Optimisation SEO**

C'est un concept que j'ai découvert en inscrivant le blog aux moteurs de recherche. Le SEO (Search Engine Optimization) est le processus d'amélioration de la qualité d'un site web ou d'une page web pour un meilleur classement dans les résultats de recherche. C'est un concept suffisamment important pour que [Naver](https://searchadvisor.naver.com/guide/seo-basic-intro) et [Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ko) publient des guides officiels. Cependant, plutôt que de travailler activement à un meilleur classement, mon processus a surtout consisté à résoudre les avertissements SEO reçus de plusieurs outils pour webmasters après l'inscription du blog. Voici un résumé des problèmes rencontrés et de leurs solutions.

### **Optimisation des images avec webp**

Pour évaluer les performances du site, j'ai mesuré la vitesse des pages avec [PageSpeed Insights](https://pagespeed.web.dev/?utm_source=psi&utm_medium=redirect) de Google. Le résultat était assez lent dans la catégorie mobile. Le rapport fourni mentionnait, parmi de nombreuses recommandations, la réduction du poids des images, ce que j'ai corrigé.

Je publie régulièrement des articles contenant [des dessins](https://hyngng.github.io/posts/fourth-drawing/) ou [des photos](https://hyngng.github.io/posts/photos-of-gyemyo/). Ces images avaient une résolution moyenne de 4000x3000 pixels avec des extensions `.png` ou `.jpg`, et un poids d'environ 200 Ko à 1 Mo pour les dessins, 1 à 3 Mo pour les photos. Les images utilisées dans d'autres articles suivaient également ces dimensions, donc leur poids n'était pas négligeable. En constatant que d'autres sites web traitaient leurs images avec un poids inférieur à 100 Ko, j'ai effectué les traitements suivants pour atteindre un niveau d'optimisation similaire :

1. Réduction de la taille des images au quart. Pour une dimension de 4000x3000, je les ai redimensionnées à 2000x1500.
2. Conversion des fichiers `.gif`, `.jpg` et `.png` au format `.webp` via une compression avec perte.

![before-after](/2024-05-23-webmasters-and-seo/before-after.webp)
*Images avant et après le processus de réduction de poids.*

À gauche l'original, à droite le fichier réduit puis converti en `webp`. La différence de qualité visuelle n'est pas flagrante, mais le poids passe respectivement de 1,79 Mo à 83,7 Ko, soit un rapport d'environ 20 fois. Bien que tous les fichiers ne présentent pas une différence aussi spectaculaire, la plupart ont montré une réduction significative du poids, et j'ai appliqué un traitement similaire aux images des autres articles.

Cependant, utiliser des images de qualité réduite reste un peu regrettable. Pour les dessins et les photos, j'ai donc ajouté une mention à la fin de l'article du type « Vous pouvez consulter les images originales sur mon GitHub ! », permettant à ceux qui le souhaitent d'accéder aux versions originales.

### **Résolution du problème de balises H1 multiples**

C'est un point qui m'a été signalé par Naver et Bing Webmaster Tools. Selon les Règles d'accessibilité des contenus web (WCAG), une page web ne doit contenir qu'une seule balise h1. Or, sur mon blog, le titre du site dans la barre latérale gauche et le titre de l'article étaient tous deux traités en `<h1>`.

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

Voici le code modifié. J'ai jugé préférable d'abaisser le niveau de la balise du titre du site plutôt que celui du titre de l'article. J'ai donc modifié le code d'affichage de `site.title` : il s'affiche en h1 sur l'URL racine et en h2 sur les autres URL.

En vérifiant avec les outils de développement de Chrome, le titre s'affiche en h1 sur la page d'accueil du blog et en h2 sur la page actuelle. Après application, j'ai soumis à nouveau l'URL modifiée, et deux jours plus tard, j'ai pu confirmer la correction de l'erreur via les pages de diagnostic de Naver et Bing Webmaster Tools.

### **Génération automatique de la meta description**

:::info
**Mis à jour le 28/05/2024 !**

Je n'utilise plus cette méthode actuellement. La solution pratique a été remplacée par le contenu ci-dessous, mis à jour le 25 septembre.
:::

C'est un point signalé par Bing Webmaster Tools. L'introduction « Introduction » utilisée dans de nombreux articles de mon blog était dupliquée comme description pour plusieurs pages, ce qui posait problème. J'ai donc rédigé des descriptions individuelles dans le front matter, mais comme elles faisaient environ 20 caractères, j'ai reçu un message d'erreur indiquant « Meta description trop longue ou trop courte ».

La longueur appropriée pour une description est recommandée entre 25 et 160 caractères. Comme il est trop fastidieux de rédiger une description d'au moins 25 caractères pour chaque page tout en respectant le nombre de caractères, j'ai créé un script pour générer automatiquement la description.

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

La mise en œuvre a été un peu délicate. Les balises meta, y compris la description, étant d'abord générées en masse par le plugin `jekyll-seo-tag`, j'ai implémenté une surcharge de la description parmi les `seo_tag` générés. Au cours du développement, j'ai rencontré un problème où les fichiers du dossier `_includes`, y compris `head.html`, ne pouvaient pas accéder au contenu de la page. J'ai contourné le problème en utilisant `content` provenant de `_layouts/default.html`.

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

Le `content` passe par un plugin Ruby personnalisé appelé `content_filter`, afin de supprimer dans une certaine mesure les informations inutiles pour la description, comme le titre, la date de publication, l'auteur et l'introduction « Introduction ». J'ai utilisé le fait que tout le corps de l'article soit transmis dans la balise `<div class="content"></div>`. J'avais déjà [implémenté un code similaire](https://hyngng.github.io/fr/blog/blog-content-remove/) auparavant, mais n'étant pas encore familier avec Ruby, j'ai dû demander conseil à GPT pour cette partie.

:::info
**Mis à jour le 25/09/2024 !**
:::

En réalité, ce qui précède n'est qu'une solution superficielle. Comme la description nouvellement générée était en double avec la description de {% raw %}`{{ seo_tags }}`{% endraw %}, la page contenait deux balises `<meta name="description" ... >`. Je voulais une solution plus fondamentale, et j'ai donc modifié directement la partie du plugin [jekyll-seo-tag](https://github.com/jekyll/jekyll-seo-tag/tree/master) qui génère la meta description, comme suit :

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

Le code modifié charge la description écrite dans `_config.yml` en fonction de la disposition de la page, ou génère une meta description à partir du contenu de l'article. J'ai forké [ce projet GitHub](https://github.com/hyngng/jekyll-seo-tag) dans [mon dépôt personnel](https://github.com/hyngng/jekyll-seo-tag), l'ai modifié séparément, et le charge dans `Gemfile` comme ci-dessous. C'est la solution la plus propre que j'aie pu trouver.

## **Conclusion**

De l'inscription aux moteurs de recherche à l'optimisation SEO, j'ai travaillé rapidement, mais je ne sais pas vraiment quel effet cela aura. Cependant, mon blog ayant un caractère plus personnel qu'un espace de promotion ou de production d'informations utiles pour autrui, je gère l'exposition dans les moteurs de recherche par curiosité technique, sans trop m'en soucier.
