---
title: "Uso de la orientación a objetos en Arduino"
authors: ["dev"]

categories: [프로그래밍, 튜토리얼]
tags: [프로그래밍, 튜토리얼, 아두이노, 객체지향]
start_with_ads: true

toc: false
toc_sticky: true
 
date: 2022-11-04 13:48:00 +0900
last_modified_at: 2023-04-12 20:38:00 +0900
---

Personalmente, no me gusta mucho Arduino porque mi experiencia con la programación no ha sido del todo limpia. Sin embargo, hace poco tuve otra oportunidad de usar Arduino.

No era algo que esperara con agrado, pero pensé que, ya que estaba, más que perder el tiempo, podría aprender algo nuevo, así que me animé a probar el diseño orientado a objetos. Arduino funciona con C++, que tiene diferencias con Python o C#, por lo que me resultó un poco extraño, pero una vez que vi que funcionaba correctamente, me sentió orgulloso. Espero que me sirva de referencia si algún día tengo que usar C++.

## **Código de ejemplo**

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

Es un ejemplo que implementa una funcionalidad simple de añadir una cantidad de dinero dividiéndola en componentes individuales. En `MainFunctions.h`, la declaración de la clase, se declaran los métodos; en `MainFunctions.cpp` se definen los métodos declarados; y en `Arduino_OOP.ino` se invocan los métodos definidos.

El resultado funciona correctamente. Cada vez que se llama a una función, `AddFiveHundreadWon()` suma 500 wones, `AddOneHundreadWon()` suma 100 wones y `AddFiftyWon()` suma 50 wones.
