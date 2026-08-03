---
title: "Métodos mágicos para controlar el comportamiento de objetos en Python"
authors: ["dev"]

categories: [프로그래밍, 문법]
tags: [프로그래밍, 문법, 파이썬, 매직 메서드]
start_with_ads: true

toc: true
toc_sticky: true

date: 2025-02-17 16:42:00 +0900
last_modified_at: 2026-01-16 13:16:00 +0900
---

## **Qué son los métodos mágicos**

Los métodos mágicos, o métodos especiales, son funciones integradas que definen comportamientos especiales dentro de una clase de Python. Permiten definir objetos de forma más versátil, como la sobrecarga de operadores, la modificación de la forma de mostrar objetos o hacer que se comporten como contenedores. Principalmente tienen las siguientes características:

- Permiten definir el comportamiento de operaciones básicas como la aritmética.
- Se definen encerrados entre dos guiones bajos (_).
- A diferencia de las funciones normales, no se ejecutan explícitamente.

```python
class Example():
    def __init__(self, value):
        self.value = value
```

El ejemplo más representativo de método mágico, `__init__()`, se invoca para la inicialización cuando se crea un objeto. Si alguien ha abordado antes la orientación a objetos en otros lenguajes, esta estructura de Python, en la que las variables internas se definen en `__init__()`, puede resultar incómoda al principio. Sin embargo, al entender el contexto en el que se usan los métodos mágicos en Python, se puede aceptar de forma más natural: «Python intenta resolver este problema mediante métodos integrados».

Los métodos mágicos se usan de forma más amplia de lo que pensamos. Por ejemplo, en la suma aritmética básica, aunque externamente se expresa con el operador `+`, internamente se invoca la función `__add__()` del objeto.

```python
class Example():
    def __init__(self, value):
        self.value = value
  
    def __add__(self, x):
        return self.value + x.value

ex1 = Example(10)
ex2 = Example(20)

print(ex1 + ex2) # Devuelve 30
```

Por lo tanto, si es necesario, también se puede implementar una operación que use el operador `+` pero que en realidad no realice una suma:

```python
def __add__(self, x):
    return "¿Acaso querías realizar una suma?"
```

Incluyendo la aritmética, se pueden definir diversos métodos mágicos como los siguientes, y además de los ejemplos mostrados, se pueden definir muchas otras funcionalidades:

| Método mágico | Operador/Función |
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
| `__new__` | Creación de objeto |
| `__del__` | Eliminación de objeto |

## **Dos particularidades**

### **Crear documentación interna**

Aunque no es un método mágico, resulta útil conocer `__doc__`. `__doc__` genera documentación interna (docstrings) sobre la clase y sus métodos incorporados a través de un comentario extenso justo debajo de la definición de la clase o método.

```python
class Example():
    '''This is a doc'''
    # ...
```

Se puede registrar información breve sobre el módulo, como para qué se desarrolló esta clase o método y cómo debe usarse. Se puede acceder mediante `print(Example.__doc__)` o con el método `help()`. Para más detalles, como las convenciones de escritura, se puede consultar la [Propuesta de Mejora de Python](https://peps.python.org/pep-0257/).

### **Inspeccionar métodos mágicos**

Si es necesario, se pueden ver todos los métodos mágicos definidos en un objeto concreto mediante `dir()`. Por ejemplo, si se inspeccionan los métodos mágicos de un entero con `dir(10)`, se obtiene el siguiente resultado:

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

Gracias a esta característica, se puede usar `dir()` para identificar los tipos de métodos mágicos que admite un objeto externo (como los de una biblioteca externa), o para distinguir el comportamiento según si un objeto admite una operación concreta, mediante algo como `if '__add__' in dir(obj)`.

## **Ejemplo de uso de métodos mágicos**

Se pueden usar para crear un delegado simplificado. En Python, añadir funciones a una lista para formar una cadena de delegados es más simple y recomendable, pero personalmente sentía una incomodidad persistente, así que encontré este método.

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

Escribiendo una clase como la anterior, se pueden añadir funciones con el operador `+=` y usarlas con la familiar sintaxis `raise_event += function`, similar a C#. Cuando un proyecto crece en escala, tener una clase personalizada predefinida como esta parece ofrecer ventajas en términos de legibilidad a largo plazo.
