---
title: "更新GitHub博客主题"
authors: ["blog"]

categories: [블로그]
tags: [깃허브, 업데이트, Chirpy]
start_with_ads: true

toc: true
toc_sticky: true

date: 2024-05-12 11:32:00 +0900
last_modified_at: 2025-10-20 13:55:00 +0900
---

:::info
本文撰写于使用Jekyll框架时期。现已迁移至Astro！
:::

## **引言**

我正在使用的Chirpy主题持续维护并定期更新。我无聊时会偶尔查看[更新日志](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/docs/CHANGELOG.md)，这次发现正好昨天版本升到了`7.0.0`，新增了一些改进和新功能。

此版本开始支持插入本地视频和音频文件，并在front matter中正式支持编写`description`。还新增了通过[GoatCounter](https://www.goatcounter.com/)统计文章浏览量的功能。

## **更新**

:::warning
建议先备份文件！
:::

GitHub博客相比其他博客平台，与服务提供商的耦合度较低，因此更新过程可以简单理解为将新文件和代码合并到现有文件夹中。因为只需将通过更新后的代码合并(Merge)到我的仓库中。所以，对于经历过Git合并流程的人来说并不困难。

我的情况是，在[对主题进行定制](https://hyngng.github.io/posts/first-blog-customization/)时，自行改进了`_data/locales/ko-KR.yml`的韩语翻译内容、更改了侧边栏图标的类型和大小、单独对文章预览标题做了加粗处理等多项调整。这些修改自然不会在官方更新中反映，因此每次更新时都需要像外科手术一样逐一确认并保留被修改的代码。[官方升级指南](https://github.com/cotes2020/jekyll-theme-chirpy/wiki/Upgrade-Guide)也提醒要"Please be patient and careful to resolve these conflicts"。

### **自动合并**

```bash
git remote add upstream https://github.com/cotes2020/jekyll-theme-chirpy.git
```
{: .nolineno }

我为以防万一，先额外注册了一个Git仓库。这不是必需步骤。

```bash
git fetch upstream
git merge remotes/upstream/master
```
{: .nolineno }

然后合并Chirpy的`master`分支。合并的文件版本可通过[此链接](https://github.com/cotes2020/jekyll-theme-chirpy/tags)注册的最新标签确认，在撰写本文时当然为`v7.0.0`。如果中间没有冲突，Git会尽可能自动合并，然后需要手动处理剩余的合并项。

### **手动合并**

![merge](/2024-05-12-blog-update/merge.webp)
*关于页面编辑界面。保留上下其中之一以解决冲突。*

接下来我用VS Code进行了手动合并。如果初次接触这种方式，想要保留自己的代码请选择`Accept Current Change`，想要替换为新代码则选择`Accept Incoming Change`。一旦选择，时间久了很难撤销，因此建议慢慢检查。

我此前使用的版本是`6.3.1`，期间变更点很多，我自己修改的部分也不少，所以逐一慢慢确认。幸运的是，我在需要注意的地方添加了`/* region 수정됨 */`等注释，因此大约只花了30分钟，不算太久。

```bash
npm run build
```
{: .nolineno }

合并完成后，编译CSS和JavaScript文件。即使麻烦也需手动完成。

```bash
git add assets/js/dist _sass/vendors -f
```
{: .nolineno }

然后将生成的文件添加到Git仓库并推送即可。

至此完成后，最后用`bundle exec jekyll s`命令启动本地服务器，确认服务器能否正常启动、页面有无问题。因为可能存在遗漏的合并项，或者合并有误导致页面某处出现问题。如果存在此类问题，即使花些时间也要慢慢解决。

### **应用确认**

::video{src="/2024-05-12-blog-update/video/240410-232136.mp4"}
*视频示例。当前正在开发的游戏录制画面。*

{%
  include embed/audio.html
  src='/2024-05-12-blog-update/audio/eating-chips.mp3'
  title='音频示例。吃酥脆零食的声音。'
%}

## **结语**

更新完成！`7.0.0`新增的视频和音频功能都正常显示。不过实际看到效果后，觉得视频或许用YouTube嵌入更整洁，至于用在何处还需慢慢考虑。

总之，平时积累的待修改项确实不少，一直想找机会更新一下主题版本，首次尝试能有这样的收尾还是很满意的。试过一次后发现并不算太难，以后会偶尔进行维护。
