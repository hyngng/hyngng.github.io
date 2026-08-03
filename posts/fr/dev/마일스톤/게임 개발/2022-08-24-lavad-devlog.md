---
image:
    path: /2022-08-24-lavad-devlog/lavad-working.webp
    lqip: data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADwAQCdASoQAAgAAgA0JYgCdAEO+BZG1HAA/tzAa4xcrJ5qbUA7/Dd9Xb9cYHKGznTwKrBlf85fCc9Us5QdbaLIxPYj/pyvwcdu60isAAA=
    alt: Gameplay d'exemple
    
title: "Créer un jeu de tir de véhicule blindé simple avec Unity"
authors: ["dev"]

categories: [마일스톤, 게임 개발]
tags: [마일스톤, 게임 개발, 유니티, C#, 개발, 개발일지]
start_with_ads: true

toc: true
toc_sticky: true
 
date: 2022-08-24 16:14:00 +0900
last_modified_at: 2023-11-22 19:36:00 +0900
lang: fr
---

## **Introduction**

Je me souviens avoir été impressionné par la suspension de char, le viseur PIP (Picture-In-Picture) et les effets de grenade flash qu'avait implémentés [un YouTuber (Tooner)](https://www.youtube.com/@tooner/videos) quand j'étais enfant. Les vidéos étaient brutes et peu polies, et elles avaient généralement peu de vues, mais leur contenu était vraiment fascinant.

Avec le temps, alors que j'avais du temps libre, ce YouTuber m'est revenu à l'esprit. Je voulais créer quelque chose sur ordinateur, et en revoyant ses vidéos une par une, j'ai eu envie de faire des choses similaires. En prenant son parcours comme modèle, j'ai passé deux semaines à utiliser Blender et Unity pour créer [mon premier jalon](https://hyngng.github.io/categories/%EB%A7%88%EC%9D%BC%EC%8A%A4%ED%86%A4/) à ma manière.

## **Blender**

![lavad-modeling](/2022-08-24-lavad-devlog/lavad-modeling.webp){: .w-50 .left }

En réfléchissant à quoi faire, j'ai choisi le véhicule blindé LAV-AD comme sujet. Non seulement ce véhicule avait l'air cool, mais sa carrosserie géométrique me semblait facile à modéliser.

Bien sûr, j'ai d'abord pensé à télécharger un modèle gratuit en ligne, mais la plupart étaient payants et j'avais envie de goûter à Blender, j'ai donc décidé de le faire moi-même.

J'ai trouvé un article bien organisé sur les raccourcis de base, et pour comprendre l'approche de Blender, j'ai regardé plusieurs vidéos de speed modeling sur des chaînes YouTube étrangères.

J'ai remarqué que beaucoup utilisaient des images en projection orthographique sur les trois axes X, Y, Z comme référence. J'ai donc commencé à rassembler des documents via Google et à créer mon premier modèle. Il y a eu des difficultés, mais le processus étant assez structuré, je m'y suis rapidement adapté et j'ai pu obtenir une forme qui me semblait correcte.

## **Unity**

![lavad-coding](/2022-08-24-lavad-devlog/lavad-coding.webp){: .w-50 .right }

Vint ensuite le codage, pour lequel j'ai utilisé Unity, que je voulais aussi apprendre. Avec le recul, je pense avoir créé le tout en tâtant le terrain, ne sachant ni quoi utiliser ni comment.

Sans aucune connaissance de base en conception orientée objet ou basée sur les composants, je me suis appuyé sur des articles de blogs coréens, des cours de YouTubers indiens et de vieilles questions Stack Overflow.

En particulier, en implémentant les roues, j'ai utilisé un composant Unity appelé Wheel Collider, pour lequel les ressources en coréen étaient très rares. J'ai essayé de consulter la documentation officielle d'Unity, mais ma compréhension insuffisante du composant lui-même a pris du temps avant que je puisse l'utiliser correctement.

Malgré tout, voir les roues tourner correctement après une application réussie était très gratifiant, et c'est à partir de ce moment que j'ai commencé à m'intéresser à Unity.

## **Corrections de bugs et finalisation**

<div class="row">
    <div class="col-md-6">
        <img src="/2022-08-24-lavad-devlog/lavad-bug1.webp" alt="lavad-bug1">
    </div>
    <div class="col-md-6">
        <img src="/2022-08-24-lavad-devlog/lavad-bug2.webp" alt="lavad-bug2">
    </div>
</div>
<div class="row">
    <div class="col-md-6">
        <img src="/2022-08-24-lavad-devlog/lavad-bug3.webp" alt="lavad-bug3">
    </div>
    <div class="col-md-6">
        <img src="/2022-08-24-lavad-devlog/lavad-bug4.webp" alt="lavad-bug4">
    </div>
</div>

Il y avait aussi beaucoup de bugs amusants. Par exemple, avant de connaître l'existence du Wheel Collider, j'avais essayé d'implémenter le mouvement du véhicule avec des fonctions trigonométriques, ce qui donnait un résultat complètement erroné ; après avoir appliqué le Wheel Collider, l'axe des roues était décalé, les faisant tourner dans la mauvaise direction ; l'application de la nouvelle carrosserie modélisée causait des problèmes de masse ; et en implémentant l'effet d'éjection des douilles, j'en produisais trop.

À côté de cela, de nombreux bugs et erreurs syntaxiques basiques comme des points-virgules ou des parenthèses manquants se produisaient fréquemment, ce qui m'a surpris par la quantité de difficultés inattendues. Surtout à partir de l'application du Wheel Collider, c'était vraiment dur.

![lavad-main](/2022-08-24-lavad-devlog/lavad-main.webp)

![lavad-main2](/2022-08-24-lavad-devlog/lavad-main2.webp)

Malgré tout, après un total de 9 builds, j'ai atteint un niveau satisfaisant pour moi-même. J'y ai inclus diverses préférences et souhaits personnels : application du post-processing de la caméra pour un effet de profondeur de champ, de la poussière projetée par les roues arrière selon la direction en marche avant ou arrière, et un feu arrière qui s'allume fortement en marche arrière — des détails amusants à implémenter.

## **Conclusion**

![lavad-working2](/2022-08-24-lavad-devlog/lavad-working2.webp)

:::tip
Vous pouvez explorer plus en détail sur [GitHub](https://github.com/hyngng/unity-lavad) !
:::

Commençant le 8 juillet et achevant le dernier build le 25 juillet, c'est un projet court réalisé en 17 jours. Personnellement, en faisant le dernier build, j'ai pensé à entreprendre un projet plus vaste la prochaine fois. Je regrette notamment d'avoir abusé de codes précipités pour atteindre l'objectif sans une bonne compréhension de C#.

Malgré tout, j'ai été content de pouvoir modéliser moi-même et d'utiliser l'orienté objet. Ce qui me plaît le plus, c'est d'avoir désormais l'expérience d'avoir créé un programme auquel je tiens.
