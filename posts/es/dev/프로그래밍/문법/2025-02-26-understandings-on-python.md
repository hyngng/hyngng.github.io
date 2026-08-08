---
title: "Varias cosas que he aprendido al trabajar con Python"
authors: ["dev"]

categories: [프로그래밍, 문법]
tags: [프로그래밍, 문법]
start_with_ads: true

toc: true

date: 2025-03-17 15:25:00 +0900
last_modified_at: 2025-12-29 09:40:00 +0900
---

## **Es necesario distinguir entre variables internas y externas de la clase**

En Python, la forma habitual de declarar una variable de clase es mediante el objeto `self`, pero este método es, en realidad, la forma de usar variables internas en una instancia. Dado que se requiere crear una instancia para acceder a esa variable de clase, si se necesita garantizar el mismo valor en todos los objetos o se busca un efecto similar a la palabra clave `static` de otros lenguajes como C# o Java, se debe declarar fuera de la función `__init__()`.

```python
class Person:
    ''' Se puede declarar de la siguiente manera.
    '''
    type = "person"
    
    def __init__(self):
        self.name = name
        self.age  = age
        # ...
```

Esta variable se proporciona con el mismo valor en todas las instancias. Hay que tener en cuenta que el acceso a esta variable, incluso desde dentro del propio objeto, se realiza mediante `NombreClase.nombreVariable`. Por ejemplo, si dentro de la clase `People` se necesita modificar el valor de la variable `type` a `another_people_type`, se puede acceder mediante `People.type = another_people_type`.

## **Python también puede usar getters y setters**

Aunque no se llamen `getter` y `setter` como en lenguajes como C# o Java, el concepto de conectar una variable interna de la clase con una propiedad pública es el mismo. Es útil para encapsular variables internas, pero aún más práctico porque permite enlazar lógica cuando cambia el valor de una variable.

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

Al igual que en otros lenguajes, si solo se declara el `getter`, la propiedad es de solo lectura, por lo que hay que tener cuidado: si solo se declara `@property`, se producirá un error al intentar modificar la variable a través de esa propiedad.

## **Se puede reflejar la cantidad de clases en el nombre del módulo**

Básicamente, una función es una unidad de clasificación de código, una clase es una unidad de clasificación de funciones y variables, y un módulo es una unidad de clasificación de clases. Una forma de implementar mejor esta perspectiva a nivel conceptual es, cuando un módulo contiene varias clases, usar simplemente el plural en el nombre del módulo.

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

En este caso, en `models.py` se podrían usar nombres de clase con el formato «nombre + tipo», como `UserModel()` o `ProductModel`, aunque no sea un ejemplo de un proyecto real. Esta estructura, en comparación con tener una sola clase por módulo, hace que la clasificación de las clases sea más clara y ofrece la ventaja de poder usar expresiones naturales al importar el módulo, como `from models import UserModel as UM`.

## **Un nombre intuitivo es mejor que una metáfora**

Cuando se usan metáforas, la intuición suele ser solo parcial. Esa mitad hace que el código sea más ágil al abordarlo por primera vez y más entretenido de leer, pero la otra mitad hace que la intención del código sea ambigua, por lo que creo que es mejor evitarlas en la medida de lo posible.

```python
def main():
    ''' Si se usa el tema del joyero, sería así
    '''
    self.mining()  
    self.cutting() 
    self.crafting()
    self.selling()

def main()
    ''' Si se usa el tema del chef de alta cocina, sería así
    '''
    self.washing()
    self.cutting()
    self.cooking()
    self.plating()
```

He intentado estructurar el código usando varias metáforas, como expresar el flujo general del código equiparándolo al proceso de venta de gemas (extracción, corte, engaste, venta) o imitando el proceso de cocina de un chef (lavado, corte, cocción, emplatado), además de los ejemplos anteriores. Sin embargo, el problema era que los nombres de funciones basados en metáforas no reflejaban claramente el rol del código.

Esto añadía un paso adicional en el proceso de comprensión del significado, causando una dificultad innecesaria para que otras personas o mi yo futuro entendieran intuitivamente el código al leerlo. Además, en ocasiones, la clase y las funciones se escribían con la temática en mente, invirtiendo el orden de prioridades.

En cambio, aunque resultara menos divertido, escribir el rol de la clase de forma convencional resultaba más limpio.

```python
def main():
    ''' Simplemente el caso normal
    '''
    download_data()
    basic_process()
    save_results()
```

Si la intuición que aporta la metáfora es abrumadora, como al citar un proverbio chino de cuatro caracteres o una anécdota famosa, puede estar bien. Pero en la mayoría de los demás casos, escribir describiendo de forma concisa la operación del código en sí, como en el ejemplo anterior, resultó más práctico.
