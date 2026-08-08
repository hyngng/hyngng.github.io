---
title: "Personnaliser le template de son blog GitHub"
authors: ["blog", "dev"]

categories: [블로그]
tags: [블로그, 커스텀, 커스터마이징, Chirpy, Liquid, SCSS]
start_with_ads: true

toc: true

date: 2023-11-25 23:24:00 +0900
last_modified_at: 2025-10-15 09:22:00 +0900
---

:::info
Cet article a été rédigé sous le framework Jekyll. Il a depuis migré vers Astro !
:::

## **Introduction**

![new-files-dark](/2023-11-25-first-blog-customization/new-files-dark.webp){: .dark .w-50 .right .shadow }
![new-files-light](/2023-11-25-first-blog-customization/new-files-light.webp){: .light .w-50 .right .border }

Le template que j'utilise actuellement semble avoir été régulièrement [amélioré](https://github.com/cotes2020/jekyll-theme-chirpy). La version est passée à `6.3.1` sans que je m'en rende compte. En examinant le thème rénové, j'ai remarqué une nouvelle fonctionnalité d'affichage d'image de prévisualisation pour les articles sur la page d'accueil, ainsi qu'un raffinement général des couleurs.

Je cherchais donc un moyen de mettre à jour, quand j'ai découvert que lors de la création initiale du blog, j'avais utilisé la méthode Chirpy starter. Cette méthode simplifie la création mais limite assez la personnalisation.

Si j'ai choisi GitHub Blog plutôt que Tistory ou Naver Blog, c'est précisément pour la large personnalisation possible — mais cette approche en atténuait l'intérêt. Je suis donc rapidement passé à la méthode GitHub Fork recommandée sur la page officielle.

En suivant cette méthode pas à pas, le nombre de fichiers du blog a nettement augmenté. En examinant les nouveaux dossiers `_includes`, `_javascript`, `_layouts`, `_sass`, j'ai constaté qu'ils permettaient de modifier les fichiers JavaScript et CSS pour éditer directement les composants de la page web, et j'en ai profité pour retoucher quelques éléments.

## **Modifications du template**

### **Taille de police et espacement des paragraphes**

Une chose qui me gênait depuis un moment était que la taille de la police était un peu trop grande. Je ne savais pas comment modifier la taille de la police, et ce n'était pas non plus gênant fonctionnellement, alors j'avais laissé faire jusqu'à présent, mais à l'occasion de cette refonte du blog, j'ai décidé de la corriger.

Avec SCSS, on peut modifier ou créer du code dans `assets/css/jekyll-theme-chirpy.scss`. La mise en forme du contenu des articles est gérée par le sélecteur `.content` dans `_scss/addon/commons.scss`. J'ai donc défini la propriété `font-size` à environ 0.98 pour tous les `.content`, et ajusté l'espacement entre les lignes de 1.25rem à environ 1.5rem, en m'inspirant des formats de Tistory ou Naver Blog.

```css
.content {
  font-size: 0.98rem;
}

p:not(blockquote p) {
  margin-top: 1.5rem;
}
```

### **Suppression du pied de page**

Le thème Chirpy standard génère un pied de page avec à gauche « ⓒ {année} {nom} Tous droits réservés » et à droite « Propulsé par Jekyll avec le thème Chirpy ». Ce dernier ne contenant pas d'information essentielle, j'ai cherché le code correspondant et l'ai commenté pour un rendu plus épuré.

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
**Mis à jour le 26/05/2024 !**

En gérant le blog, j'ai découvert que le template Chirpy est sous [licence MIT](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/LICENSE) et que la suppression du pied de page n'est donc pas autorisée en principe. J'ai rétabli le commentaire pour respecter la licence.
:::

### **Titre des articles en gras**

En voyant sur [Medium](https://medium.com/) que les titres en gras attiraient l'œil du lecteur, j'ai ajouté le code suivant dans `assets/css/jekyll-theme-chirpy.scss` pour que les titres de mes articles soient également mis en gras.

```css
.btn-outline-primary {
  font-weight: bold;
}
```

### **Suppression de la navigation entre articles**

![post-nav-light](/2023-11-25-first-blog-customization/post-nav-light.webp){: .light .border }
![post-nav-dark](/2023-11-25-first-blog-customization/post-nav-dark.webp){: .dark }
*Navigation entre articles. Elle guide l'utilisateur vers l'article précédent ou suivant par rapport à l'article actuel.*

La navigation entre articles, située tout en bas de l'article, permet de passer à l'article précédent ou suivant. Personnellement, je me demande à quoi elle sert : elle n'affiche pas les articles de la même catégorie, et exposer des articles simplement parce qu'ils sont proches dans la chronologie n'a pas de sens quand leurs sujets n'ont aucun rapport.

Je trouvais que cette navigation encombrait le bas de la page, et je voulais ne conserver que la section « Articles similaires ». J'ai donc cherché et supprimé le code `- post-nav` qui importe la navigation dans `_layouts/post.html`{: .filepath}.

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
**Mis à jour le 16/04/2024 !**

En continuant à gérer le blog, je me suis rendu compte que j'écrivais sur des sujets plus variés que je ne le pensais. Maintenir la navigation pourrait permettre de relier ces différents sujets, alors j'ai rétabli la partie `- post-nav` 😭
:::

### **Modification de la couleur de fond de la barre latérale**

Si j'utilisais directement la propriété `background-color` pour modifier la couleur de fond de la barre latérale, celle-ci resterait fixe indépendamment du mode sombre. Je voulais conserver la couleur du mode clair et ne modifier que celle du mode sombre. Heureusement, le thème Chirpy sépare les fichiers `typography-dark.scss` pour le mode sombre dans le dossier `_sass/colors`, ce qui m'a permis d'y changer la couleur de fond de la barre latérale en **#1D1D1E**.

```scss
--sidebar-bg: #1D1D1E;
```

### **Modification du mode de génération du TOC**

Le thème Chirpy génère par défaut une table des matières (TOC) sur la droite de la page d'article. Bien que pratique pour repérer sa position ou naviguer rapidement, le comportement a changé de façon gênante après la mise à jour du thème.

Je ne sais pas exactement à partir de quelle version, mais là où le TOC incluait auparavant les titres h1, il ne les inclut désormais qu'à partir de h2. Il y a sans doute une raison, mais personnellement je n'aime pas ce changement, je l'ai donc rétabli comme avant. Le code étant long, je ne montre que la partie modifiée.

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
**Mis à jour le 16/04/2024 !**
:::

En enregistrant le blog sur le web, j'ai reçu un avertissement de Naver Search Advisor et Bing Webmaster concernant « plusieurs balises h1 détectées ». En cherchant pourquoi ce type d'avertissement existe, j'ai découvert les [Règles d'accessibilité des contenus web (WCAG)](https://www.w3.org/TR/WCAG21/). Il semble que la modification pour générer le TOC à partir de h2 visait à encourager l'utilisation d'une seule balise h1 conformément à ces règles. En vérifiant avec les outils de développement sur des pages comme [Wikipédia](https://fr.wikipedia.org/), j'ai constaté que le titre de l'article était en h1 et que la table des matières commençait en h2.

Je ne suis pas certain que ce soit vraiment à cause des WCAG, mais j'estime qu'il faut respecter les recommandations. J'ai donc abaissé d'un niveau tous les en-têtes de mes articles de blog. Cependant, je voulais que la taille de police du TOC reste inchangée, j'ai donc défini la propriété `font-size` séparément dans `jekyll-theme-chirpy.scss` comme ci-dessous.

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

### **Changement de police pour certains éléments**

```scss
$font-family-base: 'IBM Plex Sans KR', 'Source Sans Pro', 'Microsoft Yahei', sans-serif;
$font-family-heading: 'IBM Plex Sans KR', Lato, 'Microsoft Yahei', sans-serif;
```

La police par défaut ayant un espacement large, j'ai cherché une police plus resserrée sur [Google Fonts](https://fonts.google.com) et l'ai changée. Plutôt que de modifier directement le code définissant la police, j'ai utilisé le fichier `variables-hook.scss` du template pour y écrire le code séparément. L'affichage avec la nouvelle police est bien meilleur.

## **Conclusion**

![post-push-light](/2023-11-25-first-blog-customization/post-push-light.webp){: .light .border }
![post-push-dark](/2023-11-25-first-blog-customization/post-push-dark.webp){: .dark }
*Le temps du workflow est réduit à environ 2 minutes !*

Je ne sais pas pourquoi, mais après la mise à jour du thème, le temps entre le push et la publication effective de l'article sur le blog a considérablement diminué ! Avant, cela pouvait prendre près de 10 minutes ; maintenant, environ 2 minutes suffisent.

J'ai aussi essayé d'autres choses — supprimer l'icône Twitter, appliquer une césure par mot dans les phrases coréennes — mais l'icône n'était pas centrée correctement ou les paragraphes devenaient inesthétiques, donc je ne les ai pas appliquées. Je réessaierai quand l'idée me reviendra.
