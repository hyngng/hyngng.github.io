---
title: "Utiliser la programmation orientée objet avec Arduino"
authors: ["dev"]

categories: [프로그래밍, 튜토리얼]
tags: [프로그래밍, 튜토리얼, 아두이노, 객체지향]
start_with_ads: true

toc: false
 
date: 2022-11-04 13:48:00 +0900
last_modified_at: 2023-04-12 20:38:00 +0900
---

Personnellement, je n'aime pas beaucoup Arduino car mon expérience en programmation n'est pas très nette. Mais récemment, j'ai eu une nouvelle occasion d'utiliser Arduino.

Ce n'était pas de gaieté de cœur, mais plutôt que de simplement passer le temps, je me suis dit que tant qu'à faire, j'allais apprendre quelque chose de nouveau, et j'ai relevé le défi de la conception orientée objet. Arduino fonctionne avec le C++, qui a des aspects différents de Python ou C#, ce qui m'a paru un peu déroutant, mais au final, j'étais fier de voir que tout fonctionnait correctement. J'espère que cela pourra me servir de référence si j'ai un jour l'occasion d'utiliser le C++.

## **Code d'exemple**

```cpp
#include "Arduino.h"

class MainFunctions
{
  public:
    AddFiveHundreadWon(int Money);
    AddOneHundreadWon(int Money);
    AddFiftyWon(int Money);
};
```

```cpp
#include "Arduino.h"
#include "MainFunctions.h"

int MainFunctions::AddFiftyWon(int Money)
{
  Money += 50;
  return Money;
}

int MainFunctions::AddOneHundreadWon(int Money)
{
  Money += 100;
  return Money;
}

int MainFunctions::AddFiveHundreadWon(int Money)
{
  Money += 500;
  return Money;
}
```

```cpp
void setup()
{
    /* ... */
}

void loop()
{
    /* ... */
    Money = MainFunctions.AddFiveHundreadWon(Money);
    Money = MainFunctions.AddOneHundreadWon(Money);
    Money = MainFunctions.AddFiftyWon(Money);
    /* ... */
}
```

Voici un exemple d'implémentation divisant en fichiers individuels un code simple d'ajout de montant. Dans le fichier de déclaration de la classe `MainFunctions.h`, les méthodes sont déclarées ; dans `MainFunctions.cpp`, les méthodes déclarées sont définies ; et dans `Arduino_OOP.ino`, les méthodes définies sont appelées.

Le résultat fonctionne bien. Chaque fonction, lorsqu'elle est appelée, ajoute 500 won pour `AddFiveHundreadWon()`, 100 won pour `AddOneHundreadWon()`, et 50 won pour `AddFiftyWon()`.
