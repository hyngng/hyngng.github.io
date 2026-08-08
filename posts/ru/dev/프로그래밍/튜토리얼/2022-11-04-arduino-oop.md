---
title: "Использование объектно-ориентированного программирования в Arduino"
authors: ["dev"]

categories: [프로그래밍, 튜토리얼]
tags: [프로그래밍, 튜토리얼, 아두이노, 객체지향]
start_with_ads: true

toc: false
 
date: 2022-11-04 13:48:00 +0900
last_modified_at: 2023-04-12 20:38:00 +0900
---

Лично я не очень люблю Arduino, потому что мой опыт программирования с ним был не самым удачным. Однако недавно мне снова представилась возможность поработать с Arduino.

Мне это было не слишком интересно, но, решив, что лучше не просто убивать время, а вынести из этого что-то новое, я попробовал применить объектно-ориентированное проектирование. Arduino работает на C++, который отличается от Python или C#, поэтому всё было немного непривычно, но, увидев, что программа работает, я испытал гордость. Надеюсь, это пригодится, если когда-нибудь придётся работать с C++.

## **Пример кода**

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

Это пример кода, реализующего простую функцию добавления определённой суммы, разбитую на отдельные части. В файле объявления класса `MainFunctions.h` объявляются методы, в `MainFunctions.cpp` эти методы определяются, а в `Arduino_OOP.ino` они вызываются.

В итоге всё работает. При каждом вызове соответствующей функции `AddFiveHundreadWon()` добавляет 500 вон, `AddOneHundreadWon()` — 100 вон, `AddFiftyWon()` — 50 вон.
