---
title: "Les méthodes magiques pour contrôler le comportement des objets en Python"
authors: ["dev"]

categories: [프로그래밍, 문법]
tags: [프로그래밍, 문법, 파이썬, 매직 메서드]
start_with_ads: true

toc: true
toc_sticky: true

date: 2025-02-17 16:42:00 +0900
last_modified_at: 2026-01-16 13:16:00 +0900
---

## **Que sont les méthodes magiques**

Les méthodes magiques, ou méthodes spéciales, sont des fonctions intégrées qui définissent des comportements spéciaux dans une classe Python. Elles permettent de surcharger les opérateurs, de modifier l'affichage des objets, de se comporter comme un conteneur, et d'enrichir la définition des objets. Voici leurs principales caractéristiques :

- Définir le comportement des opérations de base comme l'arithmétique
- Entourées de deux tirets bas (`__`)
- Contrairement aux fonctions classiques, elles ne sont pas appelées explicitement

```python
class Example():
    def __init__(self, value):
        self.value = value
```

L'exemple le plus connu de méthode magique est `__init__()`, appelée lors de la création d'un objet pour l'initialiser. Si vous venez d'un autre langage orienté objet, cette structure où les variables internes sont définies dans `__init__()` peut sembler inhabituelle. Mais une fois qu'on comprend le contexte d'utilisation des méthodes magiques en Python, on réalise que "Python essaie de résoudre ce problème avec ses méthodes intégrées", et cela devient plus naturel.

Les méthodes magiques sont utilisées de manière plus étendue qu'on ne le pense. Par exemple, l'addition semble utiliser l'opérateur `+`, mais en réalité, c'est la fonction `__add__()` de l'objet qui est appelée.

```python
class Example():
    def __init__(self, value):
        self.value = value
  
    def __add__(self, x):
        return self.value + x.value

ex1 = Example(10)
ex2 = Example(20)

print(ex1 + ex2) # retourne 30
```

Ainsi, si nécessaire, on peut implémenter une opération qui utilise l'opérateur `+` mais n'effectue pas réellement d'addition.

```python
def __add__(self, x):
    return "Vous vouliez effectuer une addition ?"
```

On peut définir diverses méthodes magiques, y compris pour les opérations arithmétiques, et bien d'autres fonctionnalités peuvent être redéfinies.

| Méthode magique | Opérateur/Fonction |
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
| `__new__` | Création d'objet |
| `__del__` | Suppression d'objet |

## **Deux particularités**

### **Générer une documentation interne**

Ce n'est pas une méthode magique, mais il est utile de connaître `__doc__`. `__doc__` crée une documentation interne (docstring) via le commentaire long situé juste en dessous de la définition d'une classe ou d'une méthode.

```python
class Example():
    '''This is a doc'''
    # ...
```

On peut y indiquer brièvement pourquoi cette classe ou méthode a été développée et comment l'utiliser. On y accède via `print(Example.__doc__)` ou la méthode `help()`. Pour plus de détails sur les conventions d'écriture, consultez la [PEP 257](https://peps.python.org/pep-0257/).

### **Inspecter les méthodes magiques**

Si nécessaire, on peut lister toutes les méthodes magiques d'un objet avec `dir()`. Par exemple, en inspectant les méthodes magiques d'un entier avec `dir(10)`, on obtient le résultat suivant :

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

Grâce à cela, on peut utiliser `dir()` pour connaître les méthodes magiques supportées par un objet externe (bibliothèque, etc.), ou différencier le comportement selon qu'un objet supporte ou non une opération particulière avec `if '__add__' in dir(obj)`.

## **Exemple d'utilisation des méthodes magiques**

On peut les utiliser pour créer un délégué simplifié. Bien qu'en Python, il soit plus simple et recommandé d'ajouter des fonctions à une liste pour implémenter une chaîne de délégués, j'ai personnellement trouvé une méthode qui répondait à un certain inconfort persistant.

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

Avec cette classe, on peut ajouter des fonctions via l'opérateur `+=` et les utiliser de façon familière comme en C# : `raise_event += function`. Pour les projets de grande envergure, préparer une telle classe personnalisée à l'avance semble offrir un avantage en termes de lisibilité à long terme.
