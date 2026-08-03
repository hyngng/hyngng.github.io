---
title: "Using Object-Oriented Programming in Arduino"
authors: ["dev"]

categories: [프로그래밍, 튜토리얼]
tags: [프로그래밍, 튜토리얼, 아두이노, 객체지향]
start_with_ads: true

toc: false
toc_sticky: true
 
date: 2022-11-04 13:48:00 +0900
last_modified_at: 2023-04-12 20:38:00 +0900
---

Personally, I'm not very fond of Arduino because my programming experience with it hasn't been particularly clean. But recently, I had another opportunity to use Arduino.

I wasn't thrilled, but rather than just killing time, I figured I might as well learn something new, so I challenged myself to use object-oriented design. Arduino operates on C++, which looked somewhat different from Python or C#, making it a bit unfamiliar, but seeing it work properly was still satisfying. I hope this can serve as a reference if I ever need to use C++ later.

## **Example Code**

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

This is an example of splitting simple money-adding functionality into individual files. The class declaration file `MainFunctions.h` declares methods, `MainFunctions.cpp` defines the declared methods, and `Arduino_OOP.ino` calls the defined methods.

It works well. Each time the functions are called, `AddFiveHundreadWon()` adds 500 won, `AddOneHundreadWon()` adds 100 won, and `AddFiftyWon()` adds 50 won.
