---
title: "'Waybound', le développement s'arrête ici"
authors: ["dev"]

categories: [마일스톤, 게임 개발]
tags: [마일스톤, 게임 개발, 유니티, C#, 행선지, 개발, 개발일지]
start_with_ads: true

toc: true

date: 2024-10-23 21:32:00 +0900
last_modified_at: 2024-11-02 20:41:00 +0900

mermaid: true
lang: fr
---

## **Ce qui s'est passé**

![gameplay](/2024-10-23-armonia-devlog-cancelled/gameplay.webp)
*Dernière version du gameplay*

J'aurais aimé le dire plus tôt, mais c'est maintenant que j'en suis certain, alors j'écris. Waybound était un projet commencé par l'envie d'expérimenter de nouveaux patterns de programmation et une mise en scène un peu fraîche. J'y étais attaché au point d'écrire [trois rapports de développement](https://hyngng.github.io/tags/armonia/), et il y a eu quelques réalisations, mais en fin de compte, j'ai arrêté le développement.

## **Bilan honnête**

La dernière fois que j'ai développé, ce que j'ai ressenti, c'était une obligation et de l'ennui. Même si c'était moi qui avais commencé, vers la fin, taper sur le clavier me semblait un peu pénible.

En cherchant pourquoi, en fait, ce n'était pas un manque de compétences, mais plutôt que je n'avais plus envie de continuer à le créer. D'abord, parce que c'était un exercice. Après avoir atteint un certain objectif, en considérant le coût d'opportunité, je me suis demandé si terminer ce projet en beauté était vraiment la meilleure chose à faire — et je n'ai pas trouvé de réponse.

Deuxièmement, ce qui m'a retenu, c'est une mauvaise direction et l'absence de plan à long terme. Je ne m'y étais pas investi sérieusement, donc il n'y avait ni deadline ni objectif concret, et je résolvais encore souvent les problèmes de manière improvisée. Face à une situation problématique, je ne prenais pas le temps de définir le problème, de chercher la meilleure solution ou de fournir l'effort nécessaire.

Troisièmement, il n'y avait pas de routine ou de mécanisme de développement spécifique. Ce problème se posait plus souvent dans la création d'assets image et d'animation que dans la programmation. L'objectif principal était de créer des scènes naturelles comme des plans de film, mais chaque étape nécessaire au dessin demandait bien plus d'efforts que je ne l'imaginais, et honnêtement, j'en ai été déconcerté.

Finalement, ma motivation a chuté. Plutôt que de traîner sans véritable attachement, j'ai pensé qu'il valait mieux mettre de côté la nécessité d'une capacité de résolution de problèmes intelligente et la réflexion sur l'amélioration de l'inefficacité, et conclure ce court cycle de développement.

## **Ce qui a été accompli**

:::tip
**Les détails sont disponibles sur [GitHub](https://github.com/hyngng/unity-armonia) !**
:::

Voici une comparaison entre le [GDD simplifié écrit en phase de planification](https://hyngng.github.io/posts/armonia-planning/) et ce qui a réellement été développé. Les éléments non implémentés sont barrés.

- Description générale
	- [X] Nom : Waybound (행선지)
	- [X] Genre : Aventure side-scrolling
	- [X] Format : Mobile 2.5D
- Gameplay
	- [X] Le joueur devient une créature (humain, ~~chien, chat, fourmi~~) dans un cadre périurbain et effectue les interactions propres à cette créature. Par exemple, un humain sort une boisson d'un distributeur, ~~un chien renifle l'odeur d'un banc.~~
	- [x] Même sans contrôle particulier du joueur, les créatures interagissent entre elles et composent l'ambiance périurbaine, chaque créature ayant une personnalité visuelle dans une plage définie.
- Caractéristiques principales
	- [x] Interactions ~~variées~~ entre objets
	- [x] Images dessinées à la main et animation cut
	- [ ] ~~Expérience changeante selon la météo (pluie, neige)~~

Les interactions ont été implémentées pour les humains et les pigeons, mais les éléments barrés comme les chiens et les chats ne l'ont pas été. Les interactions créées ne peuvent pas être qualifiées de variées. La météo, que je voulais implémenter via le système de particules, n'a pas non plus été réalisée.

Néanmoins, le fait d'avoir tenté le 2.5D (ni 2D ni 3D) et d'être arrivé au stade de produire un résultat, d'avoir utilisé partiellement à la fois des images dessinées à la main et de l'animation cut traditionnelle — ce sont de petites récoltes.

## **Faire mieux la prochaine fois**

Quoi qu'il en soit, le processus de développement n'a pas été satisfaisant et c'est un projet raté. Les causes principales sont un processus de résolution de problèmes négligé et un abandon de l'amélioration de l'inefficacité du travail. D'abord, je devrais chercher comment d'autres ont résolu des problèmes similaires.

Au début, je voulais vraiment créer une œuvre magnifique, et finir ici me laisse un goût amer. Honnêtement, ça m'agace un peu. Il faut que je repense même aux moindres détails non écrits dans ce post pour bien me préparer et aller jusqu'au bout la prochaine fois.
