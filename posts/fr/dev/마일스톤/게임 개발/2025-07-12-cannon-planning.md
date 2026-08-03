---
image:
    path: /2025-07-12-canon-planning/preview-image.webp
    lqip: data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAACwAQCdASoQAAgAAUAmJaQAAtrhz8SAAP7+iKQXo5XPAFYHsGXQIf86Ki+SWy2NwKTSw4qdpXZuAAAA
    alt: "Ça faisait longtemps !"

title: "Plan concept d'un tower defense mobile centré sur la préparation"
authors: ["dev"]

categories: [마일스톤, 게임 개발]
tags: [마일스톤, 게임 개발, 유니티, C#, 기획, 개발일지]
start_with_ads: true

toc: true
toc_sticky: true

date: 2025-07-28 21:56:00 +0900
last_modified_at: 2026-01-23 09:05:00 +0900
lang: fr
---

## **Introduction**

:::warning
**Cet article est un concept design !**
:::

L'une des leçons tirées de [l'expérience du projet précédent](https://hyngng.github.io/posts/armonia-devlog-cancelled/) est que développer quelque chose sur une longue période implique de s'engager dans un certain contexte plus vaste. Le processus de développement pourrait facilement devenir une expérience fatigante et douloureuse, il est donc nécessaire de bien choisir son sujet avec réflexion et prudence.

Ce concept design est une petite expérience dans ce contexte. Pendant environ 1 à 2 mois, je vais concrétiser des idées pour raccourcir le processus de développement via la création de brouillons, la rédaction de documents, la conception de classes, etc., puis, en pesant les coûts d'opportunité, soit développer réellement le jeu, soit organiser mes réflexions intermédiaires par écrit.

## **Pourquoi le tower defense**

![gameplay-scene](/2025-07-12-canon-planning/gameplay-scene.webp){: .w-75 }
*Exemple de gameplay et de contrôles*

Première raison : le tower defense ne m'est pas étranger car j'ai toujours aimé y jouer. Deuxième raison : par le même principe, je pourrais m'y attacher personnellement et continuer le développement de manière soutenue. Il existe déjà de nombreux jeux de tower defense publiés, offrant une multitude de cas de référence.

Cependant, la concurrence est féroce, le genre donne une impression un peu démodée et statique, et il est difficile de présenter une condition de fin de jeu marquante avec une structure de tower defense traditionnelle — ce sont des inconvénients. De même, il semble difficile de diriger le jeu de manière créative.

Comment compenser ces problèmes est la préoccupation la plus importante dans la concrétisation de cette idée. Considérer une partie jusqu'à un certain round comme une manche dont la récompense maximale est déterminée, et offrir au joueur la possibilité de terminer la partie en cours pour en commencer une nouvelle — ce genre de solutions pourraient être des remèdes.

## **Grammaire de design minimaliste**

La grammaire de design de ce jeu concept repose sur deux principes : minimalisme et pragmatisme. Le minimalisme a été priorisé pour l'uniformité du code de design et la réduction des coûts de développement, sans pour autant ignorer le pragmatisme. Cependant, réduire les fonctionnalités entre les deux rend généralement le jeu non pragmatique, et inversement, afficher trop d'informations en même temps crée souvent un conflit visuel désordonné — la plupart des efforts ont porté sur la recherche de compromis.

![info-panel-design-process](/2025-07-12-canon-planning/info-panel-design-process.webp)
*Le panneau d'information des tours qui a demandé le plus de réflexion. Chacun a ses petits problèmes.*

Dans la fenêtre affichant les spécifications d'une tour, détailler les chiffres donne une densité d'information excessive comme un reçu, tandis qu'une présentation sommaire réduit considérablement l'intuitivité. La cause fondamentale est que les données de tour à afficher sont nombreuses et complexes — un problème similaire s'est posé pour la conception de nombreuses autres UI. Impossible de réduire le système de jeu pour une information épurée, j'ai donc adopté les principes suivants comme solution de compromis :

1. La densité d'information visuelle et temporelle doit rester constante. Dans les deux perspectives, l'information ne doit être ni trop abondante ni trop rare.
2. Le choix du joueur doit être intuitivement perceptible. Même pour une petite action, l'UI doit réagir dynamiquement avec plusieurs couches d'animation et d'effets.
3. L'engagement doit être maintenu tout en évitant l'ennui. Tout ne peut pas être dynamique, mais pour éviter au maximum les situations statiques ennuyeuses, la carte ou le système de jeu doivent fonctionner de manière flexible dans les limites permises.

![notification-system](/2025-07-12-canon-planning/notification-system.webp){: .w-75 }
*4 types de notifications appelées pendant le jeu*

![design-examples](/2025-07-12-canon-planning/design-examples.webp){: .w-75 }
*Menu principal et écran des paramètres. Les icônes proviennent de Fontawesome.*

La plupart des fonctions UI et de leur disposition à l'écran ont été déterminées selon ce principe pragmatique. L'ambiance du jeu en elle-même étant monochrome, en noir et blanc, et la plupart des designs UI étant statiques, des améliorations par des effets visuels comme l'animation sont nécessaires.

## **Aspects techniques nécessaires au développement**

![notion-dark](/2025-07-12-canon-planning/notion-dark.webp){: .dark }
![notion-light](/2025-07-12-canon-planning/notion-light.webp){: .light .border }
*Page Notion que j'envisage de rendre publique une fois assez organisée*

Les objectifs techniques de ce projet ne sont pas ambitieux. Les stratégies de gestion de projet comme les conventions de nommage ou les principes SOLID, les patterns de conception comme le singleton ou la programmation événementielle, les [critères de qualité de base des applications Android](https://developer.android.com/docs/quality-guidelines/core-app-quality?hl=ko) — des concepts qui ne me sont pas étrangers — seront affinés et implémentés, et quand j'aurai du temps, je pourrai essayer l'un des suivants :

- [GPGS](https://developer.android.com/games/pgs/unity/overview?hl=ko)
- Object pooling
- Multithreading
- Unity Analytics
- Toast de notification Android
- [Caractéristiques qualité ISO/IEC 25010](https://www.iso.org/standard/78176.html)

En rédigeant des documents, j'ai découvert par hasard [Awesome Lists](https://github.com/sindresorhus/awesome), parmi lesquels j'ai trouvé des entrées liées à Unity, ainsi qu'un projet open source particulièrement détaillé : [Nodulus](https://github.com/Hyperparticle/nodulus/). Manquant de sensibilité sur la gestion réelle d'un projet, j'avais des difficultés, mais je pourrai m'y référer pour la structure des scripts, la gestion des assets, etc.
