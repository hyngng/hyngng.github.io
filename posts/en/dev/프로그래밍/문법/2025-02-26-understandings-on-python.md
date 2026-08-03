---
title: "A Few Things I Learned While Working with Python"
authors: ["dev"]

categories: [프로그래밍, 문법]
tags: [프로그래밍, 문법]
start_with_ads: true

toc: true
toc_sticky: true

date: 2025-03-17 15:25:00 +0900
last_modified_at: 2025-12-29 09:40:00 +0900
---

## **Class and Instance Variables Need to Be Distinguished**

In Python, declaring class variables using the `self` object is common, but this actually creates instance variables used within instances. Since accessing these class variables requires instance creation, if you need to guarantee the same value across all objects or want something similar to the `static` keyword in languages like C# or Java, you should declare them outside the `__init__()` function.

```python
class Person:
    ''' Can be declared as shown below.
    '''
    type = "person"
    
    def __init__(self):
        self.name = name
        self.age  = age
        # ...
```

This variable is provided with the same value across all instances. Note that accessing this variable — even from within the class itself — requires the form `ClassName.VariableName`. For example, if you need to change the `type` variable to `another_people_type` within the `Person` class above, you can access it as `Person.type = another_people_type`.

## **Python Can Also Use Getters and Setters**

While they aren't called getters and setters like in C# or Java, the concept of connecting internal class variables to public properties is the same. Although useful for encapsulating internal variables, they're even more convenient because you can attach logic to run when a variable's value changes, so it's worth knowing.

```python
class Example:
    def __init__(self):
        self._variable = None
    
    @property
    def variable(self):
        return self._variable

    @variable.setter
    def variable(self, value):
        self._variable = value
```

Just as declaring only a getter makes a variable read-only in other languages, declaring only `@property` will cause an error if you try to modify the property's value.

## **Module Names Can Reflect Class Count**

By default, functions are units of code classification, classes are units of function and variable classification, and modules are units of class classification. One way to better implement this conceptual view is to use plural module names when a single module contains multiple classes.

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

In this case, `models.py` could use class names following a name + type format, such as `UserModel()` or `ProductModel()`, though this is just a generic example rather than from an actual project. This structure makes class categorization clearer compared to having one class per module, and offers the advantage of allowing natural expressions like `from models import UserModel as UM` when using the module.

## **Intuitive Names Are Better Than Metaphors**

The intuitiveness of metaphors is usually only half-effective. While that half can make the code's flow simpler and more engaging when first encountered, the other half introduces ambiguity about the intent behind the code, which I think should be avoided when possible.

```python
def main():
    ''' Using a gemstone craftsman theme like this
    '''
    self.mining()  
    self.cutting() 
    self.crafting()
    self.selling()

def main()
    ''' Using a fine dining chef theme like this
    '''
    self.washing()
    self.cutting()
    self.cooking()
    self.plating()
```

I've tried structuring code using several metaphor approaches beyond the examples above — likening overall program flow to gemstone sales (mining-cutting-crafting-selling) or imitating a chef cooking (washing-prepping-cooking-plating) — but the problem was that metaphorical function names didn't clearly reflect the code's actual role.

This added an extra step to understanding the meaning, creating unnecessary difficulty for others or my future self when reading the code. Occasionally, the metaphor would even become the tail wagging the dog, with classes and functions written to be conscious of their theme instead of their purpose.

Instead, even if it's less fun, writing class roles in a conventional manner was cleaner.

```python
def main():
    ''' Just the normal case
    '''
    download_data()
    basic_process()
    save_results()
```

If the auxiliary concept in a metaphor has overwhelming intuitiveness — like when using a well-known idiom or historical reference — then it might be fine. But in most other cases, writing code as above, concisely describing what the code does, was more practical.
