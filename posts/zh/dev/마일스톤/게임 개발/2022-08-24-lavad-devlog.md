---
image:
    path: /2022-08-24-lavad-devlog/lavad-working.webp
    lqip: data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADwAQCdASoQAAgAAgA0JYgCdAEO+BZG1HAA/tzAa4xcrJ5qbUA7/Dd9Xb9cYHKGznTwKrBlf85fCc9Us5QdbaLIxPYj/pyvwcdu60isAAA=
    alt: 示例游戏画面
    
title: "用 Unity 制作简单的装甲车射击游戏"
authors: ["dev"]

categories: [마일스톤, 게임 개발]
tags: [마일스톤, 게임 개발, 유니티, C#, 개발, 개발일지]
start_with_ads: true

toc: true
toc_sticky: true
 
date: 2022-08-24 16:14:00 +0900
last_modified_at: 2023-11-22 19:36:00 +0900
---

## **前言**

小时候，我记得看过一位[叫做 Tooner 的 YouTuber](https://www.youtube.com/@tooner/videos) 实现的坦克悬挂系统、PIP（画中画）瞄准镜、闪光弹效果等，当时觉得很新颖。视频本身很原始粗糙，也许因此播放量普遍不多，但内容真的非常有趣。

后来时间多出来的时候，我想起了这个 YouTuber。正想用电脑做点什么成果出来的时候，我重新一个接一个地看他的视频，觉得自己也想做那样的东西。于是以这位 YouTuber 的事迹为榜样，花了 2 周时间使用 Blender 和 Unity 制作了我自己的[第一个里程碑](https://hyngng.github.io/categories/%EB%A7%88%EC%9D%BC%EC%8A%A4%ED%86%A4/)。

## **Blender**

![lavad-modeling](/2022-08-24-lavad-devlog/lavad-modeling.webp){: .w-50 .left }

一开始想做什么呢，最后定下了 LAV-AD 这款装甲车。不仅因为这款车看起来很酷，而且车身呈几何形状，即使直接建模也不会太难。

当然，一开始也想过从网上下载免费模型，但大部分模型都在收费出售，而且平时也想尝尝 Blender 的滋味，于是决定自己制作使用。

基础快捷键参考了网上整理得很好的文章，关于 Blender 这个工具应该以什么样的感觉来掌握，则是在 YouTube 海外频道上找了许多速度建模视频跟着学。

看着看着，发现很多案例是参考三个轴（X、Y、Z）的正交投影图像制作的，我也开始通过 Google 收集相关资料，开始制作我的第一个模型。虽然有困难，但过程相当系统化，很快就适应了，并做出了一个我感觉还不错的造型。

## **Unity**

![lavad-coding](/2022-08-24-lavad-devlog/lavad-coding.webp){: .w-50 .right }

接下来是编码，同样使用了平时想学习的 Unity。现在回想起来，当时因为不知道具体该怎么用，完全是摸着石头过河，勉强做出来的。

由于对面向对象或基于组件的设计等基础知识一无所知，参考了国内博客文章、印度 YouTuber 的教程以及老旧的 Stack Overflow 问答帖等来制作。

特别是在实现车轮时使用了 Wheel Collider 这个 Unity 组件，但找了半天，国内的资料实在太少了。第一次尝试参考 Unity 官方文档，但由于对组件本身缺乏理解，花了一些时间才正确使用。

不过最终成功应用，看到车轮顺利转动的样子，感慨万分，大概从这时开始对 Unity 产生了兴趣。

## **Bug 修复与完成**

<div class="row">
    <div class="col-md-6">
        <img src="/2022-08-24-lavad-devlog/lavad-bug1.webp" alt="lavad-bug1">
    </div>
    <div class="col-md-6">
        <img src="/2022-08-24-lavad-devlog/lavad-bug2.webp" alt="lavad-bug2">
    </div>
</div>
<div class="row">
    <div class="col-md-6">
        <img src="/2022-08-24-lavad-devlog/lavad-bug3.webp" alt="lavad-bug3">
    </div>
    <div class="col-md-6">
        <img src="/2022-08-24-lavad-devlog/lavad-bug4.webp" alt="lavad-bug4">
    </div>
</div>

这种搞笑的 bug 也很多。比如不知道 Wheel Collider 的存在，试图用三角函数实现车身运动，结果完全乱套；应用 Wheel Collider 后车轮的轴也偏了，往不该转的方向转；应用新建模的车身后惯性质量出了问题；实现弹壳排出效果时弹壳喷得太多等等。

除此之外，伴随着许多 bug，分号或括号缺失等基本语法错误也频繁发生，比预想中多的小麻烦让我有些措手不及。特别是应用 Wheel Collider 时，太吃力了。

![lavad-main](/2022-08-24-lavad-devlog/lavad-main.webp)

![lavad-main2](/2022-08-24-lavad-devlog/lavad-main2.webp)

不过，经过总共 9 次构建，最终达到了自我满意的水平。还加入了一些个人的偏好和期望，应用了相机后期处理来表现景深效果，前进或后退时后轮会根据方向扬起灰土，特别是倒车时尾灯会强烈点亮等，加入了细节，愉快地收了尾。

## **结语**

![lavad-working2](/2022-08-24-lavad-devlog/lavad-working2.webp)

:::tip
您可以在 [GitHub](https://github.com/hyngng/unity-lavad) 上查看更多详情！
:::

从 7 月 8 日开始到 7 月 25 日完成最后一次构建，是在 17 天内完成的短期项目。个人而言，在制作最后一个构建时，我产生了在下一次推进更大规模项目的想法。特别是在对 C# 理解不足的情况下，似乎滥用了只求达成目标的代码，这一点令人遗憾。

不过，能够亲自尝试建模和使用面向对象，还是很好的。最重要的是，我现在有了一次带着热情制作程序的经历，这让我非常满意。
