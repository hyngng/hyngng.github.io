---
image:
    path: /2025-07-12-canon-planning/preview-image.webp
    lqip: data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAACwAQCdASoQAAgAAUAmJaQAAtrhz8SAAP7+iKQXo5XPAFYHsGXQIf86Ki+SWy2NwKTSw4qdpXZuAAAA
    alt: "真是好久不见！"

title: "以准备经验为主的移动端塔防概念策划"
authors: ["dev"]

categories: [마일스톤, 게임 개발]
tags: [마일스톤, 게임 개발, 유니티, C#, 기획, 개발일지]
start_with_ads: true

toc: true

date: 2025-07-28 21:56:00 +0900
last_modified_at: 2026-01-23 09:05:00 +0900
---

## **前言**

:::warning
**本文是概念策划案！**
:::

从[上一个项目的经验](https://hyngng.github.io/zh/dev/armonia-devlog-cancelled/)中学到的一点是，长时间投入开发某件事，从某种意义上说，也意味着我涉入了一个巨大的脉络。稍有不慎，开发过程可能会留下疲惫而痛苦的经历，因此需要深思熟虑，谨慎选题。

这次的概念设计在某种意义上是一个实验。首先，我计划用 1~2 个月的时间，通过制作设计草案、编写文档、设计类等方式来具体化缩短开发过程的想法，并权衡各种机会成本，要么实际开发游戏，要么将中途的想法整理成文章记录下来。

## **为什么选择塔防类型**

![gameplay-scene](/2025-07-12-canon-planning/gameplay-scene.webp){: .w-75 }
*游戏玩法与操作示例*

选择塔防主题的第一个原因是因为我很喜欢这个类型，所以不会感到陌生；基于同样的道理，第二个原因是觉得自己能够带着个人的热忱持续开发下去。由于已经发布的塔防游戏很多，可参考的案例也很丰富。

不过，这也意味着竞争激烈，而且近年来该类型给人一种较为陈旧、静态的印象；此外，传统的塔防结构难以令人印象深刻地呈现游戏结束条件。同样，要创造性地推进游戏似乎也比较困难。

如何弥补这些问题，是这个想法具体化过程中最重要的关注点。将直到特定轮次之前视为一局游戏（报酬最大值固定），并向玩家提供结束当前游戏、进入新游戏的选择权等，可能成为弥补手段。

## **极简主义设计语言**

这个概念游戏的设计语言有两条原则：极简主义和实用主义。出于设计代码的统一性和降低开发成本的考虑，我优先考虑了极简主义，但并没有打算忽视实用主义。然而，在这两者之间，削减功能通常意味着不实用，反过来，同时显示多种信息又会导致视觉杂乱，两者频繁冲突，大部分情况下都需要努力协调替代方案。

![info-panel-design-process](/2025-07-12-canon-planning/info-panel-design-process.webp)
*最让人费心思的塔信息面板设计。各有各的问题*

在显示炮塔参数的窗口中，详细显示数值会使信息密度像收据一样过高；反之，简洁呈现则会大大降低直观性。这个问题的根本原因在于需要显示的炮塔数据本身就多且复杂，在设计其他许多 UI 时也遇到了类似的问题。由于不能为了整洁的信息显示而削减游戏系统，于是遵循以下自定原则，采取了次优方案。

1. 视觉信息密度和时间信息密度都必须保持恒定。从两个角度来看，信息都不应过多或过少。
2. 玩家的选择必须能够直观地感受到。即使是很小的操作，也应通过多层动画和效果等让 UI 做出动态反应。
3. 在激发兴趣的同时，必须防止枯燥。虽然无法将所有内容都动态化，但为了尽可能避免引发枯燥的静态情况，地图或游戏系统应在允许范围内灵活运作。

![notification-system](/2025-07-12-canon-planning/notification-system.webp){: .w-75 }
*游戏过程中触发的 4 种类型的通知*

![design-examples](/2025-07-12-canon-planning/design-examples.webp){: .w-75 }
*主菜单和设置窗口。图标来自 Fontawesome*

大部分 UI 功能和屏幕布局都按照上述实用主义原则来确定。游戏氛围本身属于黑白系的单色调，且大部分 UI 设计是静态布局，这是缺点，需要通过动画等视觉效果来改善。

## **开发中所需的技术事项**

![notion-dark](/2025-07-12-canon-planning/notion-dark.webp){: .dark }
![notion-light](/2025-07-12-canon-planning/notion-light.webp){: .light .border }
*整理到一定程度后，正在考虑是否干脆公开的 Notion 页面*

通过这个项目可以实现的技术目标并不宏大。对于不陌生的概念，如命名规范、SOLID 原则等顺畅项目管理的策略，单例或事件驱动编程等设计模式，[Android 应用核心质量标准](https://developer.android.com/docs/quality-guidelines/core-app-quality?hl=ko)等，将加以精炼实现；在有余力的时候，可能尝试以下新的内容：

- [GPGS](https://developer.android.com/games/pgs/unity/overview?hl=ko)
- 对象池
- 多线程
- Unity Analytics
- Android Toast 通知
- [ISO/IEC 25010 质量特性](https://www.iso.org/standard/78176.html)

在编写文档的过程中偶然了解到了 [Awesome Lists](https://github.com/sindresorhus/awesome)，其中发现了与 Unity 相关的条目，以及特别值得详细参考的开源项目 [Nodulus](https://github.com/Hyperparticle/nodulus/)。由于缺乏对项目实际管理方式的感性认识，一直有一些困难，但预计在脚本结构或资源管理等方面可以大大参考。
