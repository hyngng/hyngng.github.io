---
title: "Mettre à jour le thème de son blog GitHub"
authors: ["blog"]

categories: [블로그]
tags: [깃허브, 업데이트, Chirpy]
start_with_ads: true

toc: true

date: 2024-05-12 11:32:00 +0900
last_modified_at: 2025-10-20 13:55:00 +0900
---

:::info
Cet article a été rédigé sous le framework Jekyll. Il a depuis migré vers Astro !
:::

## **Introduction**

Le thème Chirpy que j'utilise est régulièrement maintenu et mis à jour périodiquement. Je jette un œil à l'[historique des mises à jour](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/docs/CHANGELOG.md) quand je m'ennuie, et cette fois j'ai constaté qu'il était passé en version `7.0.0` depuis hier, avec plusieurs améliorations et nouvelles fonctionnalités.

Cette version permet désormais l'insertion de fichiers vidéo et audio locaux, et le front matter supporte officiellement la rédaction du champ `description`. J'ai aussi remarqué qu'il était possible de mesurer le nombre de vues des articles via [GoatCounter](https://www.goatcounter.com/).

## **Mise à jour**

:::warning
Il est recommandé de sauvegarder vos fichiers au préalable !
:::

Comme GitHub Blog est moins lié au fournisseur de services que les autres plateformes, le processus de mise à jour consiste simplement à importer les nouveaux fichiers et codes dans le dossier existant. Il s'agit uniquement de fusionner (merge) le code mis à jour dans mon dépôt. Pour ceux qui ont déjà expérimenté le processus de fusion via Git, ce ne devrait pas être trop difficile.

Dans mon cas, j'avais [personnalisé le thème](https://hyngng.github.io/fr/blog/first-blog-customization/) en améliorant la traduction coréenne dans `_data/locales/ko-KR.yml`, en modifiant le type et la taille des icônes de la barre latérale, et en mettant les titres de prévisualisation en gras. Ces modifications n'étant pas officiellement prises en charge, je dois, à chaque mise à jour, vérifier et préserver le code modifié comme un chirurgien. Le [guide de mise à jour officiel](https://github.com/cotes2020/jekyll-theme-chirpy/wiki/Upgrade-Guide) recommande également de « Please be patient and careful to resolve these conflicts ».

### **Fusion automatique**

```bash
git remote add upstream https://github.com/cotes2020/jekyll-theme-chirpy.git
```

Pour plus de sécurité, j'ai commencé par enregistrer le dépôt Git une fois de plus. Ce n'est pas obligatoire.

```bash
git fetch upstream
git merge remotes/upstream/master
```

Ensuite, j'ai fusionné avec la branche `master` de Chirpy. La version des fichiers fusionnés peut être vérifiée via les [tags](https://github.com/cotes2020/jekyll-theme-chirpy/tags) ; au moment de la rédaction, il s'agit de `v7.0.0`. Si tout s'est bien passé, Git effectue automatiquement les fusions possibles, et il faut ensuite procéder manuellement aux fusions restantes.

### **Fusion manuelle**

![merge](/2024-05-12-blog-update/merge.webp)
*Écran de rédaction de la page d'information. On résout le conflit en conservant l'une des deux versions.*

J'ai poursuivi avec une fusion manuelle dans VS Code. Pour ceux qui découvrent cette méthode : si vous voulez conserver votre code, choisissez `Accept Current Change` ; si vous voulez le remplacer par le nouveau code, choisissez `Accept Incoming Change`. Une fois choisi, il est difficile de revenir en arrière, donc il vaut mieux examiner attentivement.

La version que j'utilisais avant était `6.3.1`. Entre-temps, les changements s'étaient accumulés et mes propres modifications n'étaient pas négligeables, j'ai donc tout vérifié lentement, un par un. Heureusement, j'avais marqué les parties sensibles avec des commentaires du type `/* région modifiée */`, ce qui n'a pas pris énormément de temps — environ 30 minutes.

```bash
npm run build
```

Une fois la fusion terminée, il faut compiler les fichiers CSS et JavaScript. Même si c'est fastidieux, il faut le faire manuellement.

```bash
git add assets/js/dist _sass/vendors -f
```

Ensuite, on ajoute les fichiers générés au dépôt Git, on push, et c'est fini.

Une fois tout cela terminé, il faut ouvrir le serveur local avec la commande `bundle exec jekyll s` pour vérifier que le serveur démarre correctement et que la page ne présente pas de problème. Il pourrait y avoir des fusions oubliées ou mal effectuées qui auraient endommagé certains éléments de la page. Si c'est le cas, prenez le temps de résoudre ces problèmes.

### **Vérification de l'application**

::video{src="/2024-05-12-blog-update/video/240410-232136.mp4"}
*Échantillon vidéo. Capture d'écran du jeu en développement.*

{%
  include embed/audio.html
  src='/2024-05-12-blog-update/audio/eating-chips.mp3'
  title='Échantillon audio. Bruit de chips croquantes.'
%}

## **Conclusion**

La mise à jour est terminée ! Les fonctionnalités ajoutées en `7.0.0`, la vidéo et l'audio, fonctionnent toutes bien. Cependant, en voyant le résultat, je me demande si l'intégration YouTube ne serait pas plus propre pour la vidéo. Je réfléchirai lentement à l'endroit où l'utiliser.

En tout cas, il y avait clairement beaucoup de modifications en attente, et je voulais mettre à jour la version du thème depuis un moment. Je suis satisfait que cela se soit bien terminé pour une première fois. Maintenant que j'ai essayé, ce n'est pas si difficile que ça, et je compte bien le gérer de temps en temps à l'avenir.
