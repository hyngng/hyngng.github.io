---
title: "파이썬 객체지향 사용기"

categories: [프로그래밍, 아키텍처]
tags: [프로그래밍, 아키텍처, 객체지향]
start_with_ads: true

toc: true
toc_sticky: true

date: 2025-01-24 00:00:00 +0900
last_modified_at: 2025-01-24 00:00:00 +0900
---

## **C# 또는 Java와 다른 점**

파이썬에서 객체지향을 구현하는 방법은 C#나 Java와는 사뭇 다릅니다. 우선 변수는 접근 제한자를 명시하지 않으며 기본적으로는 `private`로 제공된다고 생각하면 편합니다.

잘 사용하기 위해서는 매직 메소드 개념을 이해할 필요가 있습니다. 예를 들어 클래스의 내부 변수는 `__init__()`에서 정의되는데, 객체지향을 다른 언어로 먼저 접했을 경우 당황스러울 수 있습니다.

```python
class Animal():
    def __init__(self):
        self.value = value
    
    def bark():
        print("")
```

```cs
class Animal
{
    public Animal(string value)
    {
        this.Value = value;
    }

    public string Value { get; set; }

    public void Bark()
    {
        Console.WriteLine("Bark!");
    }
}
```

객체가 생성될 때 호출되는 함수인 `__init__()`은 파이썬에서 객체지향을 구현하기 위한 방법으로 이해하기 쉽지만, 그 이전에 `__str__()`, `__len__()`, `__add__()`등과 같은 방식으로 제공되는 매직 메소드의 일종입니다. 파이썬에서 메인함수를 작성할 때 주로 쓰이는 `__name__`또는 `__main()__"`과도 연관지어 생각할 수 있습니다.

다만 변수를 사용할 때 앞에 `self` 통해 접근해야 한다는 점 때문에, 다른 언어였으면 간결했겠지만 파이썬에서는 길어지는 경우가 있었습니다.

```python
class Animal():
    def __init__(self):
        self.value = value
    
    def bark():
        print("")
```

모듈화의 일종인 함수를 작성할 때 외부 변수를 내부에서 사용할 때는 `global` 키워드를 사용합니다.

## **파이썬의 장점은 간결함**

다른 언어 같았으면 함수에 매개변수를 정의하거나 전달할 때 변수 형태를 명시해야 하지만 파이썬에서는 그렇지 않습니다. 이 점이 매우 크게 다가왔습니다.

```python
class Calculator:
    def add(self, a, b):
        result = a + b
        return result

def main():
    calculator = Calculator()
    print(calculator.add(1, 3))

if __name__ == "__main__":
    main() # 4 출력
```