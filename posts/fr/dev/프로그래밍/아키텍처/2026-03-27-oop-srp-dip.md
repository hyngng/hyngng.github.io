---
title: "À propos de la conception orientée objet et des principes SRP et DIP"
authors: ["dev", "essay"]

categories: [프로그래밍, 아키텍처]
tags: [프로그래밍, 아키텍처]
start_with_ads: false

toc: true

date: 2026-06-01 13:54:00 +0900
last_modified_at: 2026-06-29 23:23:00 +0900

mermaid: true
---

Je ne sais pas exactement où j'en suis, mais pour utiliser une analogie avec les quatre stades de la connaissance, je dois être au stade de la compétence consciente. Je n'ai pas encore le recul nécessaire pour discerner ce qu'est une bonne conception, mais des bribes de compréhension émergent peu à peu, et certaines d'entre elles me paraissent assez intéressantes.

## **Bref commentaire sur l'orientation objet**

Le contexte dans lequel l'orientation objet a été conçue, ainsi que ses points forts, sont bien connus : dépasser les limites du paradigme procédural traditionnel, préserver la pensée abstraite, et concevoir une logique métier complexe d'une manière naturelle et compréhensible pour l'humain. Cependant, on parle moins de la raison pour laquelle cette méthodologie a rencontré un tel succès. À ce sujet, j'ai trouvé deux angles : les affaires et la philosophie.

Un. Un entrepreneur ou un ambitieux responsable de quelque chose déteste l'incertitude. L'une des raisons pour lesquelles les empires du nord frontalier ont constamment envahi les royaumes de la péninsule coréenne était de sécuriser leurs arrières avant de réaliser leur projet de conquête du continent. Rome a unifié la péninsule italienne avant d'attaquer Carthage ; l'Allemagne a signé un pacte de non-agression avec l'URSS avant d'envahir la France. Les exemples et les motivations ne diffèrent pas beaucoup. Plus l'entreprise est vaste, plus l'obsession du responsable est sérieuse, plus le blocage du cygne noir est essentiel.

Deux. Le physicien moderne qui aspire à une théorie du tout, le linguiste qui postule une grammaire universelle entre toutes les langues du monde, l'économiste qui tente d'expliquer le comportement de millions de personnes par un seul graphique d'offre et de demande — tout cela procède d'une volonté de maîtriser le chaos. Pourquoi un tel effort a-t-il historiquement accompagné la pensée ? Il y a sans doute une raison pragmatique de réduire les coûts cognitifs, mais je préfère le point de vue d'Albert Camus : « L'homme ne supporte pas l'incertitude et l'ambiguïté ; il aspire à une vision claire. »

Ce n'est qu'une supposition, mais intuitivement, il ne semble pas incongru de comprendre l'orientation objet comme relevant du tempérament humain, d'une propension à la gestion des risques. L'orientation objet divise le code procédural traditionnel, le range à sa juste place, et laisse davantage de balises dans sa structure et ses noms. En conséquence, la complexité et l'incertitude sont maîtrisées, offrant au développeur un sentiment de stabilité.

## **SRP : principe de responsabilité unique**

> Chaque objet doit avoir une seule responsabilité.

De même, en écriture, il existe le principe « une phrase, un sujet » (一文一事). L'intention du principe de responsabilité unique ne nous est donc pas étrangère, et on peut facilement la comprendre de travers. « Éliminer les préoccupations pour atteindre la clarté sémantique » est un aspect important du SRP, mais ce n'est pas le cœur. Ce que le SRP vise véritablement, c'est éliminer les ramifications sémantiques superflues pour atteindre la prévisibilité des changements.

Les principes SOLID ont été conçus pour des programmes vivants. La situation change constamment, et le programme doit constamment s'adapter. Ce qu'il faut alors, c'est l'attitude de L'Art de la guerre : un calcul minutieux pour gérer les risques et atteindre l'efficacité. Comme le dit le proverbe : « Un bon général ne convoque pas deux fois les troupes et ne transporte pas trois fois les vivres » (役不再籍, 糧不三載) — éliminer les coûts récurrents est crucial.

Pour la même raison, il existe une grande différence de coût entre reconnaître clairement l'objectif de travail en phase de développement et minimiser la charge de travail, entre ce que l'on peut exécuter hardiment sans effet secondaire et ce que l'on ne peut pas. Dans ce contexte, des relations sémantiques claires signifient des impacts d'action prévisibles, ce qui permet de calculer le risque des actions. Voilà pourquoi le SRP est considéré comme une base, un fondamental.

## **DIP : principe d'inversion des dépendances**

> Les abstractions ne doivent pas dépendre des détails ; les détails doivent dépendre des abstractions.

Lorsque j'effectuais mon service civique en alternative au service militaire, j'ai observé jusqu'où la capacité d'auto-guérison d'une entreprise pouvait s'exercer. Curieusement, cela m'a constamment rappelé le principe DIP. Voici l'idée : dans une structure d'entreprise classique avec une répartition des tâches entre services et employés, selon le DIP, l'entreprise ne devrait dépendre que des concepts socialement préétablis — la répartition des tâches — et non des compétences individuelles ou du talent de l'employé qui exécute le travail.

C'est du bon sens. La vie quotidienne de l'entreprise semble figée, et l'on a l'impression qu'hier, aujourd'hui et demain, cet employé effectuera les mêmes tâches au même poste. Mais en réalité, des mutations périodiques, des mouvements de personnel soudains, des démissions, ou même les hypothèses terrifiantes du Bus Factor peuvent entraîner le remplacement d'un employé. Si l'organisation dépendait, au-delà de la répartition des tâches, des compétences individuelles, son absence pour quelque raison que ce soit provoquerait une confusion.

De ce point de vue, la raison pour laquelle il faut empêcher qu'une mission dépassant le cadre convenu ne soit déléguée à une personne est que, avant même d'être un acte immoral exploitant la bonne volonté de quelqu'un, cela menace la pérennité de l'organisation. Une fois, cela peut passer, mais pas plusieurs fois. Si la charge de travail requise par l'organisation augmente, il ne faut pas surcharger les individus, mais réorganiser la structure de répartition des responsabilités, même en remaniant la répartition des tâches. Et cette logique, traduite techniquement, donne l'énoncé original : « Les abstractions ne doivent pas dépendre des détails ; les détails doivent dépendre des abstractions. »

## **Pétrification**

Il arrive qu'un concept proposé pour son utilité pratique, en devenant une norme, perde son sens et se dégrade en formalité. En fait, ce n'est pas juste « il arrive » — la plupart des choses que nous connaissons s'installent ainsi et deviennent culture et tradition. L'OOP aussi a commencé comme une méthodologie valorisant l'utilité pratique, mais aujourd'hui, elle tend à être considérée comme un rite de passage dans les cursus de programmation.

Alors je doute. Il existe déjà d'excellentes approches comme le DOD en termes de performances, et le paradigme fonctionnel comme alternative pour la complexité de la gestion d'état. Bien sûr, l'OOP pourrait encore survivre longtemps. Mais les tendances récentes, du vibe coding à l'ingénierie de harnais, évoluent vers une conception du code que l'humain n'inspecte plus directement, et un point d'interrogation se pose sur la nécessité d'écrire le code sous forme d'objets à l'avenir. J'espère qu'aucun paradigme ne restera une tradition rigide trop longtemps.
