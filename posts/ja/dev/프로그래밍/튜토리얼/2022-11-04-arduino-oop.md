---
title: "Arduinoでオブジェクト指向を活用する"
authors: ["dev"]

categories: [프로그래밍, 튜토리얼]
tags: [프로그래밍, 튜토리얼, 아두이노, 객체지향]
start_with_ads: true

toc: false
 
date: 2022-11-04 13:48:00 +0900
last_modified_at: 2023-04-12 20:38:00 +0900
---

個人的にプログラミング経験がすっきりせず、Arduinoはあまり好きではありません。しかし最近Arduinoを使う機会がもう一度ありました。

気乗りはしませんでしたが、適当に時間をつぶして終わるよりは、せっかくやるなら何か新しいことを学んでいこうと思い、オブジェクト指向設計に挑戦しました。ArduinoはC++をベースに動作しますが、PythonやC#とは異なる面があり少し馴染みがなかったですが、それでもちゃんと動作する様子まで確認できて充実感があります。もし後日C++を使うことがあれば参考になれば良いです。

## **サンプルコード**

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

簡単な金額を追加する機能のコードを個別に分割して実装した例です。クラスの宣言部である`MainFunctions.h`でメソッドを宣言し、`MainFunctions.cpp`では宣言されたメソッドを定義する役割を、`Arduino_OOP.ino`では定義されたメソッドを呼び出す役割を担うように作成しました。

結果的に正常に動作します。それぞれの関数は呼び出されるたびに`AddFiveHundreadWon()`では500ウォン、`AddOneHundreadWon()`では100ウォン、`AddFiftyWon()`では50ウォンが加算されます。
