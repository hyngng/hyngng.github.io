---
title: "用于控制Python对象行为的魔法方法"
authors: ["dev"]

categories: [프로그래밍, 문법]
tags: [프로그래밍, 문법, 파이썬, 매직 메서드]
start_with_ads: true

toc: true
toc_sticky: true

date: 2025-02-17 16:42:00 +0900
last_modified_at: 2026-01-16 13:16:00 +0900
---

## **什么是魔法方法**

魔法方法，或称特殊方法，是Python类中用于定义特殊行为的内置函数，包括运算符重载、对象输出方式改变、像容器一样运作等，帮助更丰富地定义对象。主要有以下特点：

- 可定义四则运算等基本行为
- 由两个下划线(_)包围定义
- 与普通函数不同，不显式执行

```python
class Example():
    def __init__(self, value):
        self.value = value
```

魔法方法的典型例子 `__init__()` 在对象创建时被调用进行初始化。如果先用其他语言接触面向对象，可能会觉得Python这种在 `__init__()` 中定义内部变量的结构不太方便，但理解了Python中使用魔法方法的语境后，就能更清爽地接受"Python是想用内置方法解决这个问题"。

魔法方法的适用范围比我们想象的更广泛。例如，基础四则运算中的加法，表面上用 `+` 运算符表示，但实际上调用的是对象内部的 `__add__()` 函数。

```python
class Example():
    def __init__(self, value):
        self.value = value
  
    def __add__(self, x):
        return self.value + x.value

ex1 = Example(10)
ex2 = Example(20)

print(ex1 + ex2) # 返回 30
```

因此，如果需要，也可以实现如下——使用 `+` 运算符但实际不执行加法运算的操作。

```python
def __add__(self, x):
    return "您是想进行加法运算吗？"
```

包括四则运算在内，可以定义如下多种魔法方法，此外还可以定义各种其他功能。

| 魔法方法 | 运算符/功能 |
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
| `__new__` | 对象创建 |
| `__del__` | 对象删除 |

## **两个特别事项**

### **创建内部文档**

虽然不是魔法方法，但值得一并了解的是 `__doc__`。`__doc__` 通过类或方法定义部分下方的长注释（文档字符串）为对象和内置方法创建内部文档。

```python
class Example():
    '''This is a doc'''
    # ...
```

可以记录该类或方法的开发用途、使用方法等模块的简要信息。可以通过 `print(Example.__doc__)` 或 `help()` 方法访问，更详细的编写规范可参考[Python增强提案](https://peps.python.org/pep-0257/)。

### **查看魔法方法**

必要时，可以通过 `dir()` 查看特定对象中定义的所有魔法方法。例如，用 `dir(10)` 查看整数的魔法方法时，可以看到以下结果。

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

利用这一特性，可以通过 `dir()` 掌握外部库等外部对象支持的魔法方法种类，或者像 `if '__add__' in dir(obj)` 这样，根据对象是否支持特定运算来区分行为。

## **魔法方法应用示例**

可以用于实现简易委托。在Python中，委托链本身通过列表添加函数更为简洁和推荐，但个人一直感到某种说不出的不便，于是找到了以下方法。

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

编写上述类后，可以通过 `+=` 运算符添加函数，像C#一样以 `raise_event += function` 熟悉的形式使用。当项目规模较大时，预先编写这种自定义类，从长远来看似乎更有可读性优势。
