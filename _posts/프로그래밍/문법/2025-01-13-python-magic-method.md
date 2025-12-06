---
title: "파이썬 객체 동작 제어를 위한 매직 메서드"

categories: [프로그래밍, 문법]
tags: [프로그래밍, 문법, 파이썬, 매직 메서드]
start_with_ads: true

toc: true
toc_sticky: true

date: 2025-02-17 16:42:00 +0900
last_modified_at: 2025-12-06 10:53:00 +0900
---

## **매직 메서드란**

매직 메서드, 또는 스페셜 메서드는 파이썬 클래스 내에서 특수 동작을 정의하는 내장 함수로 연산자 오버로딩이나 객체 출력 방식 변경, 컨테이너처럼 동작 등 객체를 더 다채롭게 정의할 수 있도록 도움을 주는 문법입니다. 주로 다음과 같은 특징이 있습니다.

- 사칙연산 등 기본 동작에 대한 내용 정의 가능
- 두 개의 언더바(_)에 둘러쌓여 정의됨
- 일반적인 함수와 달리 명시적으로 실행되지 않음

```python
class Example():
    def __init__(self, value):
        self.value = value
```

매직 메서드의 대표적인 예시인 `__init__()`는 오브젝트가 생성되었을 때 초기화를 위해 호출되는데, 다른 언어로 객체지향을 먼저 다뤄본 경우 내부 변수를 `__init__()`에서 정의하는 파이썬의 이런 구조가 불편하게 다가오다가도 파이썬에서 매직 메서드가 사용되는 맥락을 이해하면 "파이썬은 내장 메서드로 이 문제를 해결하려 하는구나"하고 보다 깔끔하게 받아들일 수 있습니다.

매직 메서드는 우리 생각보다 포괄적으로 사용되고 있습니다. 예를 들어 기초 사칙연산중 더하기의 경우 겉으로는 `+` 연산자로 표현되지만 실제로는 객체 내부의 `__add__()` 함수가 호출되는 식입니다.

```python
class Example():
    def __init__(self, value):
        self.value = value
  
    def __add__(self, x):
        return self.value + x.value

ex1 = Example(10)
ex2 = Example(20)

print(ex1 + ex2) # 30 반환
```

따라서 필요하다면, 다음과 같이 `+` 연산자를 사용하지만 실제로는 더하기 연산을 수행하지 않는 작업도 구현할 수 있습니다.

```python
def __add__(self, x):
    return "더하기 연산을 수행하려 하셨나요?"
```

사칙연산을 포함하여 다음과 같은 다양한 매직 메서드를 정의할 수 있으며, 제시된 예시 이외에도 다양한 기능을 새롭게 정의할 수 있습니다.

| 매직 메서드 | 연산자/기능 |
| --- | --- |
| `__add__` | + |
| `__sub__` | - |
| `__mul__` | * |
| `__truediv__` | / |
| `__gt__` | > |
| `__lt__` | < |
| `__le__` | <= |
| `__ge__` | >= |
| `__eq__` | == |
| `__new__` | 객체 생성 |
| `__del__` | 객체 삭제 |

## **두 가지 특이사항**

### **내부 문서 생성하기**

매직 메서드는 아니지만 같이 알아두면 좋은 내용으로 `__doc__`이 있습니다. `__doc__`은 클래스나 메서드를 정의한 부분 바로 밑줄의 장문 주석을 통해 객체와 내장된 메서드에 대한 내부 문서(독스트링)를 생성합니다.


```python
class Example():
    '''This is a doc'''
    # ...
```

이 클래스나 메소드는 어떤 용도로 개발했으며, 어떻게 사용해야 하는지 등 모듈에 대한 간략한 사항을 기록해둘 수 있습니다. `print(Example.__doc__)`와 같은 형태 또는 `help()` 메서드로 접근 가능하며, 작성 규범과 같은 더 자세한 사항은 [파이썬 개선 제안서](https://peps.python.org/pep-0257/)를 참조할 수 있습니다.

### **매직 메서드 파악하기**

필요한 경우 특정 객체에서 정의된 모든 매직 메서드는 `dir()`로 확인할 수 있습니다. 예를 들어 `dir(10)`와 같이 정수에 대한 매직 메서드를 확인해볼 경우 다음과 같은 결과를 확인할 수 있습니다.

```bash
['__abs__', '__add__', '__and__', '__bool__', '__ceil__', '__class__', '__delattr__', '__dir__', '__divmod__', '__doc__', 
'__eq__', '__float__', '__floor__', '__floordiv__', '__format__', '__ge__', '__getattribute__', '__getnewargs__', '__getstate__', '__gt__', 
'__hash__', '__index__', '__init__', '__init_subclass__', '__int__', '__invert__', '__le__', '__lshift__', '__lt__', '__mod__', 
'__mul__', '__ne__', '__neg__', '__new__', '__or__', '__pos__', '__pow__', '__radd__', '__rand__', '__rdivmod__', '__reduce__', 
'__reduce_ex__', '__repr__', '__rfloordiv__', '__rlshift__', '__rmod__', '__rmul__', '__ror__', '__round__', '__rpow__', '__rrshift__', 
'__rshift__', '__rsub__', '__rtruediv__', '__rxor__', '__setattr__', '__sizeof__', '__str__', '__sub__', '__subclasshook__', '__truediv__', 
'__trunc__', '__xor__', 'as_integer_ratio', 'bit_count', 'bit_length', 'conjugate', 'denominator', 'from_bytes', 'imag', 
'is_integer', 'numerator', 'real', 'to_bytes']
```

이러한 특성 덕에 외부 라이브러리 등 외부 객체에 대해 `dir()`를 통해 객체가 지원하는 매직 메서드 종류를 파악하거나, `if '__add__' in dir(obj)`와 같은 식으로 객체가 특정 연산을 지원하는지에 따라 동작을 다르게 구분하는 식으로 활용할 수 있습니다.

## **매직 메서드 활용 예시**

간이 델리게이트를 만들 때 사용할 수 있습니다. 파이썬에서 델리게이트 체인 자체는 리스트에 함수를 추가하는 것이 더 간소하고 권장되기는 하지만, 개인적으로는 뭔지 모를 불편함이 계속 느껴져서 찾아낸 방법이 있습니다.

```python
class RaiseEvent():
    def __init__(self):
        self._handlers = []

    def __iadd__(self, function):
        self._handlers.append(function)
        return self

    def __call__(self, *args, **kwargs):
        for function in self._handlers:
            function(*args, **kwargs)
```

위와 같은 클래스를 작성해두는 것으로 `+=` 연산자로 함수를 추가할 수 있고, C#과 비슷하게 `raise_event += function`의 익숙한 형태로 사용할 수 있게 됩니다. 프로젝트 규모가 커질 경우 위와 같이 커스텀 클래스를 사전에 작성해두는 것이 장기적으로는 가독성에서 이점이 있는 것 같습니다.