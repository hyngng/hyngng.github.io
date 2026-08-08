---
title: "Magic Methods for Controlling Python Object Behavior"
authors: ["dev"]

categories: [프로그래밍, 문법]
tags: [프로그래밍, 문법, 파이썬, 매직 메서드]
start_with_ads: true

toc: true

date: 2025-02-17 16:42:00 +0900
last_modified_at: 2026-01-16 13:16:00 +0900
---

## **What Are Magic Methods**

Magic methods, also known as special methods, are built-in functions within Python classes that define special behavior. They enable features like operator overloading, customizing object output formatting, and behaving like containers, making objects more versatile. They typically have the following characteristics:

- Can define behavior for basic operations like arithmetic
- Are defined wrapped by two underscores (_)
- Unlike regular functions, they are not explicitly invoked

```python
class Example():
    def __init__(self, value):
        self.value = value
```

A representative example of a magic method is `__init__()`, which is called for initialization when an object is created. For those who have encountered object-oriented programming in other languages first, this structure — defining internal variables within `__init__()` — can feel awkward. But once you understand the context in which magic methods are used in Python, you can more cleanly accept it as "Python tries to solve this problem through built-in methods."

Magic methods are used more comprehensively than we might think. For instance, addition, one of the basic arithmetic operations, is expressed outwardly as the `+` operator, but internally it calls the object's `__add__()` function.

```python
class Example():
    def __init__(self, value):
        self.value = value
  
    def __add__(self, x):
        return self.value + x.value

ex1 = Example(10)
ex2 = Example(20)

print(ex1 + ex2) # Returns 30
```

Therefore, if needed, you can also implement operations that use the `+` operator but don't actually perform addition, like this:

```python
def __add__(self, x):
    return "Were you trying to perform addition?"
```

Various magic methods beyond arithmetic can be defined, including those shown below, and new functionality can be defined for many more purposes than the examples listed.

| Magic Method | Operator/Function |
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
| `__new__` | Object creation |
| `__del__` | Object deletion |

## **Two Special Notes**

### **Creating Internal Documentation**

Although not a magic method, `__doc__` is worth knowing alongside them. `__doc__` generates internal documentation (docstrings) for an object and its built-in methods through a multi-line comment placed directly below the class or method definition.

```python
class Example():
    '''This is a doc'''
    # ...
```

You can record brief details about a module, such as what purpose this class or method was developed for and how it should be used. It can be accessed via `print(Example.__doc__)` or the `help()` method. For more details like writing conventions, refer to the [Python Enhancement Proposal](https://peps.python.org/pep-0257/).

### **Inspecting Magic Methods**

If needed, you can check all magic methods defined on a specific object using `dir()`. For example, checking the magic methods for an integer like `dir(10)` produces the following output:

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

Thanks to this feature, you can use `dir()` on external objects such as third-party libraries to check what magic methods they support, or use expressions like `if '__add__' in dir(obj)` to branch behavior based on whether an object supports a particular operation.

## **Magic Method Usage Example**

Magic methods can be used to create a simple delegate. While appending functions to a list is simpler and more recommended for delegate chains in Python, I personally kept feeling a vague discomfort, so I found an alternative approach.

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

By writing a class like the one above, you can add functions using the `+=` operator, similar to C#, allowing a familiar `raise_event += function` syntax. For larger projects, writing a custom class like this in advance seems to offer readability benefits in the long run.
