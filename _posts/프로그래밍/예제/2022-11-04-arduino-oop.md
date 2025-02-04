---
title: "아두이노에서 객체지향 활용하기"

categories: [프로그래밍, 예제]
tags: [프로그래밍, 예제, 아두이노, 객체지향]
start_with_ads: true

toc: false
toc_sticky: true
 
date: 2022-11-04 13:48:00 +0900
last_modified_at: 2023-04-12 20:38:00 +0900
---

개인적으로 프로그래밍 경험이 깔끔한 편은 아니기 때문에 아두이노를 별로 좋아하지는 않습니다. 그런데 최근에 아두이노를 사용할 기회가 한 번 더 있었습니다.

달갑진 않았지만, 적당히 시간 때우고 가기보다는 이왕 하는거 새로 뭐라도 배워가자는 생각이 들어 객체지향 설계를 적용해봤습니다. 아두이노는 C++을 기반으로 동작하는데, 파이썬이나 C#과는 다른 모습이 있어 조금 생소했네요. 어려움은 있었지만 그래도 잘 동작하는 모습까지 확인하고 나니 뿌듯합니다. 혹시라도 나중에 C++을 사용할 일이 있다면 참고할 수 있으면 좋겠습니다.

## **예시 코드**

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
{: file="MainFunctions.cpp" }

```cpp

#include "Arduino.h"
#include "MainFunctions.h"

int MainFunctions::AddFiftyWon(int Money)
{
  Money += 500;
  return Money;
}

int MainFunctions::AddOneHundreadWon(int Money)
{
  Money += 1000;
  return Money;
}

int MainFunctions::AddFiveHundreadWon(int Money)
{
  Money += 2000;
  return Money;
}
```
{: file="MainFunctions.h" }

```cpp
void setup()
{
    ...
}

void loop()
{
    Money = MainFunctions.AddFiveHundreadWon(Money);
    Money = MainFunctions.AddOneHundreadWon(Money);
    Money = MainFunctions.AddFiftyWon(Money);
}
```
{: file="Arduino_OOP.ino" }

간단한 금액을 추가하는 기능의 코드를 낱개로 분할한 구현한 예시입니다. 클래스의 선언부인 `MainFunctions.h`에서 메서드를 선언하고, `MainFunctions.h`에서는 선언된 메서드를 정의하는 역할을, `Arduino_OOP.ino`에서는 정의된 메서드를 호출하는 역할을 맡도록 작성했습니다.

결과적으로 잘 작동합니다. 각각의 함수는 호출될 때마다 `AddFiveHundreadWon()`에서는 500원, `AddFiveHundreadWon()`에서는 100원, `AddFiftyWon()`에서는 50원이 더해집니다.