---
title: "在Arduino中运用面向对象编程"
authors: ["dev"]

categories: [프로그래밍, 튜토리얼]
tags: [프로그래밍, 튜토리얼, 아두이노, 객체지향]
start_with_ads: true

toc: false
toc_sticky: true
 
date: 2022-11-04 13:48:00 +0900
last_modified_at: 2023-04-12 20:38:00 +0900
---

个人而言，由于编程经验不够简洁，我不太喜欢Arduino。但最近又有机会使用Arduino了。

虽然不太情愿，但与其随便应付时间，不如趁此机会学点新东西，于是决定挑战面向对象设计。Arduino基于C++运行，与Python或C#有所不同，有些陌生，但看到它正常运行还是很欣慰的。希望以后有机会用到C++时可以作为参考。

## **示例代码**

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

这是一个将简单金额累加功能的代码拆分为独立文件的示例。类的声明文件 `MainFunctions.h` 中声明方法，`MainFunctions.cpp` 中定义已声明的方法，`Arduino_OOP.ino` 中调用已定义的方法。

结果运行良好。每个函数被调用时，`AddFiveHundreadWon()` 增加500韩元，`AddOneHundreadWon()` 增加100韩元，`AddFiftyWon()` 增加50韩元。
