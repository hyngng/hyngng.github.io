---
title: "Pythonオブジェクト動作制御のためのマジックメソッド"
authors: ["dev"]

categories: [프로그래밍, 문법]
tags: [프로그래밍, 문법, 파이썬, 매직 메서드]
start_with_ads: true

toc: true

date: 2025-02-17 16:42:00 +0900
last_modified_at: 2026-01-16 13:16:00 +0900
---

## **マジックメソッドとは**

マジックメソッド、またはスペシャルメソッドは、Pythonクラス内で特殊動作を定義する組み込み関数で、演算子オーバーロードやオブジェクト出力方法の変更、コンテナのように動作するなど、オブジェクトをより多彩に定義できるようにする文法です。主に以下の特徴があります。

- 四則演算など基本動作に関する内容を定義可能
- 二つのアンダーバー(_)で囲まれて定義される
- 一般的な関数と異なり明示的に実行されない

```python
class Example():
    def __init__(self, value):
        self.value = value
```

マジックメソッドの代表的な例である`__init__()`は、オブジェクトが生成された時に初期化のために呼び出されます。他の言語でオブジェクト指向を先に扱った場合、内部変数を`__init__()`で定義するPythonのこうした構造が不便に感じられることもありますが、Pythonでマジックメソッドが使用される文脈を理解すれば「Pythonは組み込みメソッドでこの問題を解決しようとしているんだな」とよりすっきり受け入れられます。

マジックメソッドは私たちが思うより包括的に使用されています。例えば基本四則演算のうち足し算の場合、表面的には`+`演算子で表現されますが、実際にはオブジェクト内部の`__add__()`関数が呼び出される仕組みです。

```python
class Example():
    def __init__(self, value):
        self.value = value
  
    def __add__(self, x):
        return self.value + x.value

ex1 = Example(10)
ex2 = Example(20)

print(ex1 + ex2) # 30 を返す
```

したがって、必要なら以下のように`+`演算子を使っても、実際には足し算を実行しない処理も実装できます。

```python
def __add__(self, x):
    return "足し算を実行しようとしましたか？"
```

四則演算を含め、以下のような様々なマジックメソッドを定義でき、提示された例以外にも多様な機能を新たに定義できます。

| マジックメソッド | 演算子/機能 |
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
| `__new__` | オブジェクト生成 |
| `__del__` | オブジェクト削除 |

## **二つの特記事項**

### **内部ドキュメントの生成**

マジックメソッドではありませんが、一緒に知っておくと良い内容として`__doc__`があります。`__doc__`はクラスやメソッドを定義した部分の直下の長文コメントを通じて、オブジェクトと組み込みメソッドに関する内部ドキュメント(ドクストリング)を生成します。

```python
class Example():
    '''This is a doc'''
    # ...
```

このクラスやメソッドがどのような用途で開発されたか、どう使用すべきかなど、モジュールに関する簡略な事項を記録しておけます。`print(Example.__doc__)`のような形式または`help()`メソッドでアクセス可能であり、作成規範などのより詳細な事項は[Python改善提案書](https://peps.python.org/pep-0257/)を参照できます。

### **マジックメソッドの把握**

必要な場合、特定オブジェクトで定義されたすべてのマジックメソッドは`dir()`で確認できます。例えば`dir(10)`のように整数に対するマジックメソッドを確認してみると、次の結果を確認できます。

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

こうした特性のため、外部ライブラリなどの外部オブジェクトに対して`dir()`でオブジェクトがサポートするマジックメソッドの種類を把握したり、`if '__add__' in dir(obj)`のようにオブジェクトが特定演算をサポートするかどうかによって動作を変えるように活用できます。

## **マジックメソッド活用例**

簡易デリゲートを作る時に使用できます。Pythonでデリゲートチェーン自体はリストに関数を追加する方がより簡潔で推奨されますが、個人的には何か分からない不便さがずっと感じられて見つけた方法があります。

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

上記のようなクラスを書いておくことで、`+=`演算子で関数を追加でき、C#と同様に`raise_event += function`の馴染みある形で使用できるようになります。プロジェクト規模が大きくなる場合、上記のようにカスタムクラスを事前に書いておくことが長期的には可読性で利点があるようです。
