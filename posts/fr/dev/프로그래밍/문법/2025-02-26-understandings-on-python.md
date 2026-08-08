---
title: "Quelques choses apprises en manipulant Python"
authors: ["dev"]

categories: [프로그래밍, 문법]
tags: [프로그래밍, 문법]
start_with_ads: true

toc: true

date: 2025-03-17 15:25:00 +0900
last_modified_at: 2025-12-29 09:40:00 +0900
---

## **Il faut distinguer les variables internes et externes à la classe**

En Python, la déclaration d'une variable de classe se fait généralement via l'objet `self`, mais il s'agit en réalité des variables internes utilisées par l'instance. Comme l'accès à une variable de classe nécessite la création d'une instance, si l'on veut garantir une valeur identique pour tous les objets, ou obtenir un effet similaire au mot-clé `static` d'autres langages comme C# ou Java, il faut déclarer la variable en dehors de `__init__()`.

```python
class Person:
    ''' On peut le déclarer comme suit.
    '''
    type = "person"
    
    def __init__(self):
        self.name = name
        self.age  = age
        # ...
```

Cette variable est fournie avec la même valeur pour toutes les instances. Attention : l'accès à cette variable, même depuis l'intérieur de l'objet, se fait via `NomClasse.nomVariable`. Par exemple, si l'on doit modifier la valeur de `type` dans la classe `Person` ci-dessus en `another_people_type`, on y accède par `Person.type = another_people_type`.

## **Python peut aussi utiliser des getter et setter**

Ce ne sont pas appelés `getter` et `setter` comme en C# ou Java, mais le concept de lier une variable interne de classe à une propriété publique est le même. C'est utile pour l'encapsulation, mais plus intéressant encore pour associer une logique au changement de valeur d'une variable.

```python
class Example:
    def __init__(self):
        self._variable = None
    
    @property
    def variable(self):
        return self._variable

    @variable.setter(self, value):
        self._variable = value
```

Attention : si seul `@property` est déclaré, la propriété est en lecture seule, comme dans d'autres langages, et toute tentative de modification générera une erreur.

## **Le nom du module peut refléter le nombre de classes**

Fondamentalement, la fonction est une unité de classification du code, la classe est une unité de classification des fonctions et variables, et le module est une unité de classification des classes. Une façon de mieux implémenter ce concept est d'utiliser simplement le pluriel pour le nom du module lorsqu'il contient plusieurs classes.

```bash
myproject/
│
├── app/
│   ├── users/
│   │   ├── models.py
│   │   ├── views.py
│   │   └── controllers.py
│   ├── products/
│   └── orders/
│
└── main.py
```

Dans `models.py`, on peut utiliser des noms de classe du type `UserModel()` ou `ProductModel`, combinant nom + type. Cette structure clarifie la classification des classes par rapport à un module par classe, et permet d'utiliser des expressions naturelles comme `from models import UserModel as UM`.

## **Un nom intuitif vaut mieux qu'une métaphore**

L'intuitivité d'une métaphore est souvent incomplète. D'un côté, elle peut rendre le code plus vivant et agréable à lire au premier abord, mais de l'autre, elle rend l'intention du code ambiguë. Je pense qu'il vaut mieux l'éviter autant que possible.

```python
def main():
    ''' Thème du bijoutier
    '''
    self.mining()  
    self.cutting() 
    self.crafting()
    self.selling()

def main()
    ''' Thème du chef étoilé
    '''
    self.washing()
    self.cutting()
    self.cooking()
    self.plating()
```

J'ai structuré du code avec diverses métaphores : une chaîne extraction-taille-façonnage-vente de bijoux, ou un processus lavage-découpe-cuisson-dressage de cuisine. Mais les noms de fonctions issus de métaphores ne reflétaient pas clairement leur rôle.

Cela ajoutait une étape supplémentaire à la compréhension du sens, rendant la lecture du code inutilement difficile pour les autres ou pour moi-même à l'avenir. Parfois, l'écriture devenait même tributaire du thème des classes et fonctions, au point de perdre de vue l'essentiel.

En revanche, même si c'est moins amusant, nommer les classes selon leur rôle standard est plus propre.

```python
def main():
    ''' Cas général
    '''
    download_data()
    basic_process()
    save_results()
```

Les métaphores dont le pouvoir d'évocation est écrasant, comme les citations d'idiomes ou d'anecdotes célèbres, peuvent être acceptables. Mais dans la plupart des autres cas, décrire succinctement le comportement du code comme ci-dessus s'est avéré plus pratique.
