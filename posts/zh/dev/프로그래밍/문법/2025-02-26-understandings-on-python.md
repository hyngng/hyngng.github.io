---
title: "使用Python时了解到的几点"
authors: ["dev"]

categories: [프로그래밍, 문법]
tags: [프로그래밍, 문법]
start_with_ads: true

toc: true
toc_sticky: true

date: 2025-03-17 15:25:00 +0900
last_modified_at: 2025-12-29 09:40:00 +0900
---

## **需要区分类内外变量**

在Python中声明类变量时，通常使用 `self` 对象的方法，但准确来说这是在实例中使用内部变量的方法。由于访问该类变量需要创建实例，如果需要在所有对象中保证相同值，或者想要达到类似C#或Java等其他语言中 `static` 关键字的效果，则应在 `__init__()` 函数外部声明。

```python
class Person:
    ''' 可以如下声明。
    '''
    type = "person"
    
    def __init__(self):
        self.name = name
        self.age  = age
        # ...
```

该变量在所有实例中提供相同的值。此时需要注意，对该变量的访问，即使在对象内部也需要通过 `类名.变量名` 的形式进行。例如，在 `Person` 类内部需要将 `type` 变量值修改为 `another_person_type` 时，可以通过 `Person.type = another_person_type` 访问。

## **Python也可以使用getter、setter**

虽然不叫C#、Java等语言中的 `getter` 和 `setter`，但将类内部变量与公开属性相连接的概念是相同的。虽然对隐藏类内部变量也有用，但更主要的是可以将某个变量值变更时的逻辑连接起来，因此值得了解。

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

与其他语言中只声明 `getter` 时表现为只读一样，如果只声明 `@property`，尝试修改该属性变量时会报错，需要注意。

## **模块名可以反映类数量**

基本来说，函数是代码的分类单元，类是函数和变量的分类单元，模块是类的分类单元。在概念上更好地实现这一视角的方法之一是，当一个模块中有多个类时，将模块名简单写成复数形式。

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

此时，`models.py` 中可以使用例如 `UserModel()` 或 `ProductModel()` 等名称+类型格式的类名（虽然不是实际项目示例，不够具体）。这种结构相对于一个模块一个类，类的分类更明确，使用模块时还能像 `from models import UserModel as UM` 这样使用自然的表达。

## **直观的名称优于比喻**

使用比喻时，其直观性大多只算半吊子。那半吊子确实能让初次接触时代码的运行过程更简洁、读起来更有趣，但剩下的那一半会导致编写代码的意图变得模糊，因此我认为应尽量避免。

```python
def main():
    ''' 以宝石工匠为主题的话，大致这样
    '''
    self.mining()  
    self.cutting() 
    self.crafting()
    self.selling()

def main()
    ''' 以高级料理主厨为主题的话，大致这样
    '''
    self.washing()
    self.cutting()
    self.cooking()
    self.plating()
```

虽然曾尝试用各种比喻手法来结构化代码——比如以上述方式，以宝石销售为主题，将过程比喻为采矿-切割-加工-售卖；或者模仿厨师做菜的过程，采用清洗-切配-烹饪-摆盘的结构——但经过比喻的函数名未能清晰反映代码的作用。

因此，理解含义的过程中多了一个步骤，导致他人或未来的自己阅读代码时，在直观理解意义上产生了不必要的困难，有时甚至出现主客颠倒，有意识地考虑类与函数所拥有的主题来编写代码的情况。

相反，虽然少了些趣味，但按照标准方式编写类的职责会更简洁。

```python
def main():
    ''' 就是一般情况
    '''
    download_data()
    basic_process()
    save_results()
```

如果借用成语或著名典故等比喻，辅助观念的直观性很强时，或许还不错；但除此之外的大部分情况下，像上述那样简洁描述代码本身的操作更为实用。
