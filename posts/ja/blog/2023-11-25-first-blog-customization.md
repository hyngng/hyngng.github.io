---
title: "GitHubブログテンプレートをカスタマイズする"
authors: ["blog", "dev"]

categories: [블로그]
tags: [블로그, 커스텀, 커스터마이징, Chirpy, Liquid, SCSS]
start_with_ads: true

toc: true

date: 2023-11-25 23:24:00 +0900
last_modified_at: 2025-10-15 09:22:00 +0900
---

:::info
Jekyllフレームワークを使用していた時に書かれた記事です。現在はAstroに移行しました！
:::

## **はじめに**

![new-files-dark](/2023-11-25-first-blog-customization/new-files-dark.webp){: .dark .w-50 .right .shadow }
![new-files-light](/2023-11-25-first-blog-customization/new-files-light.webp){: .light .w-50 .right .border }

今使っているブログテンプレートがこの間着実に[改善](https://github.com/cotes2020/jekyll-theme-chirpy)されていたようだ。いつの間にかバージョンが `6.3.1` に上がっていた。改装されたテーマを見ると、メインページのポストにプレビュー画像を表示する機能が追加され、全体的に色味が整然と整えられた点が目を引く。

そこでアップデート方法を探していたところ、調べていくうちに一つわかったのは、私がブログを初めて開設した時にChirpyスターター方式を使っていたということだった。この方式は開設プロセスは簡単だが、カスタマイズの幅がやや制限されるという欠点がある。

一般的なTistoryやNaverブログの代わりにGitHubブログを開設した理由が幅広いカスタマイズが可能という利点だったからだが、意味が薄れた感じがする。すぐに公式ページで案内しているGitHub Fork方式に変更した。

この方式を順を追って実行すると、ブログのファイル数が明らかに増えた。新しくできた `_includes`、`_javascript`、`_layouts`、`_sass` フォルダを確認してみると、JavaScriptやCSSファイルを修正してウェブページの構成要素を直接編集できるようになっていたので、いくつかを弄ってみた。

## **テンプレートの修正**

### **フォントサイズと段落間隔の修正**

これまで気になっていたことの一つは、フォントサイズが少し大きいことだった。フォントサイズの修正方法がよくわからなかったし、機能的に不便でもなかったので今まではそのままにしていたが、今回ブログの改装を機に修正することにした。

SCSSは `assets/css/jekyll-theme-chirpy.scss` で修正または新規作成できるので、このファイルにコードを書くことができる。ポスト本文の属性は `_scss/addon/commons.scss` の `.content` セレクタが担当しており、全ての `.content` に対して `font-size` の値を0.98程度に設定し、段落間隔もTistoryやNaverブログのスタイルを参考にして1.25remから1.5rem程度に調整した。

```css
.content {
  font-size: 0.98rem;
}

p:not(blockquote p) {
  margin-top: 1.5rem;
}
```

### **サイト下部のFooter除去**

純正のChirpyテーマはブログ下部に左側の「ⓒ {年} {名前} 一部の権利を保有」と右側の「Powered by Jekyll with Chirpy theme」というFooterを生成する。そのうち後者はそれほど重要な情報ではないので、よりすっきり見えるようFooter生成に関するコードを見つけてコメントアウトした。

```html
<!--
<p>
    {%- capture _platform -%}
        <a href="https://jekyllrb.com" target="_blank" rel="noopener">Jekyll</a>
    {%- endcapture -%}

    {%- capture _theme -%}
        <a href="https://github.com/cotes2020/jekyll-theme-chirpy" target="_blank" rel="noopener">Chirpy</a>
    {%- endcapture -%}

    {{ site.data.locales[include.lang].meta | replace: ':PLATFORM', _platform | replace: ':THEME', _theme }}
</p>
-->
```

:::info
**2024-05-26 更新！**

ブログを管理していくうちに、Chirpyテンプレートが[MITライセンス](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/LICENSE)を表示しており、Footerの除去が原則として許可されていないことを知った。私はコメントアウトを元に戻してライセンスを遵守することにした。
:::

### **記事タイトルのボールド体処理**

他の文章作成プラットフォームである[Medium](https://medium.com/)で記事タイトルがボールド体で処理されてユーザーの目を引くのを見て、自分のブログでも記事タイトルがボールド体で強調表示されるよう `assets/css/jekyll-theme-chirpy.scss` に以下のコードを記述した。

```css
.btn-outline-primary {
  font-weight: bold;
}
```

### **ポストナビゲーションの除去**

![post-nav-light](/2023-11-25-first-blog-customization/post-nav-light.webp){: .light .border }
![post-nav-dark](/2023-11-25-first-blog-customization/post-nav-dark.webp){: .dark }
*ポストナビゲーション。現在のポストを基準に前の記事または次の記事へユーザーを案内する。*

ポストナビゲーションは記事の最下部で、現在の記事の直前の記事と直後の記事にリンクする機能だが、個人的にはなぜ存在するのか疑問である。同じカテゴリの記事を表示するわけでもなく、単に時間軸上で最も関連性があると表示するには記事の主題が全く関係ないからだ。

私はポストナビゲーションがかえってページ下部を雑然とさせているように感じ、「関連記事」セクションだけ残したかったので、`_layouts/post.html`{: .filepath} でポストナビゲーション部分を読み込む `- post-nav` コードを探して削除した。

```html
---
layout: default
refactor: true
panel_includes:
  - toc
tail_includes:
  - comments
  - related-posts
---
```

:::info
**2024-04-16 更新！**

ブログを続けていくうちに、自分が思ったより多様な主題で記事を書いていることに気づいた。ナビゲーションを維持すれば自分が書く様々な主題にリンクできるかもしれないと思い、`- post-nav` の部分も元に戻した 😭
:::

### **サイドバーの背景色修正**

サイドバーの背景色を修正したいが、`background-color` 属性を直接使うと色がダークモードかどうかに関わらず固定されてしまう。私が望んだのはライトモード専用の色はそのままにして、ダークモードの色だけ変更することだった。幸いChirpyテーマは `_sass/colors` パスにダークモード用の `typography-dark.scss` をライトモード用と区別しており、このファイルでダークモード時のサイドバー背景色を **#1D1D1E** 程度に変更した。

```scss
--sidebar-bg: #1D1D1E;
```

### **TOCの生成方法変更**

Chirpyテーマはデフォルトでポストページの右側にTOC（Table Of Contents）を生成する。記事の現在の読んでいる位置を確認したり、任意の位置にジャンプしたりできる便利な機能だが、問題はテーマをアップデートしたら動作方法が不便に変わったことだ。

正確にどのバージョンから変わったのかはわからないが、以前はh1から目次を生成していたのが、今はh2以下のタグがないと目次を生成しない。おそらく何か理由があるのだろうが、個人的にはあまり良くないと思い、元に戻した。コードが長いので変更した部分のみ記述する。

```js
document.querySelector("main h1")&&tocbot.init({tocSelector:"#toc",contentSelector:".content",ignoreSelector:"[data-toc-skip]",headingSelector:"h1, h2, h3",orderedList:!1,scrollSmooth:!1})
```

```js
export function toc() {
  if (document.querySelector('main h2')) {
    // see: https://github.com/tscanlin/tocbot#usage
    tocbot.init({
      tocSelector: '#toc',
      contentSelector: '.content',
      ignoreSelector: '[data-toc-skip]',
      headingSelector: 'h1, h2, h3',
      orderedList: false,
      scrollSmooth: false
    });
  }
}
```

```html
{% if page.content contains '<h1' or page.content contains '<h2' or page.content contains '<h3' and site.toc and page.toc %}
  {% assign urls = urls | append: ',' | append: site.data.origin[type].toc.js %}
{% endif %}
```

:::info
**2024-04-16 更新！**
:::

ブログをウェブに登録する過程で、NaverサーチアドバイザーとBingウェブマスターツールから「h1タグが複数見つかりました」という警告を受け、なぜこの種の警告があるのか調べたところ、[ウェブコンテンツアクセシビリティガイドライン（WCAG）](https://www.w3.org/TR/WCAG21/)というものを知った。h2以下のタグからTOCを生成するよう変更されたのは、このガイドラインに従ってh1タグを一つだけ使うように促すためだろう。実際[Wikipedia](https://ko.wikipedia.org/wiki/%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD)のような文書を開発者ツールで確認してみると、記事タイトルをh1タグで、記事の目次からはh2で区別して処理していた。

本当にWCAGのためなのかは確かではないが、推奨は守るべきだと考え、ブログの投稿で使用した全てのヘッダーの単位を一段階下げる方向で修正した。ただし目次のフォントサイズはそのまま維持してほしかったので、`jekyll-theme-chirpy.scss` で以下のように `font-size` 属性のみ別途設定した。

```css
h2 {
  font-size: 1.9rem;
}

h3 {
  font-size: 1.6rem;
}

h4 {
  font-size: 1.3rem;
}
```

### **特定タグのフォント変更**

```scss
$font-family-base: 'IBM Plex Sans KR', 'Source Sans Pro', 'Microsoft Yahei', sans-serif;
$font-family-heading: 'IBM Plex Sans KR', Lato, 'Microsoft Yahei', sans-serif;
```

デフォルトのフォントは字間が広い感じがしたので、[Google Fonts](https://fonts.google.com) で狭い字間のフォントを探して変更した。フォントを定義するコードを直接修正するより、テンプレートに `variables-hook.scss` があったので、ここにコードを別途記述した。新しいフォントが適用された画面を見ると、はるかに良くなった。

## **おわりに**

![post-push-light](/2023-11-25-first-blog-customization/post-push-light.webp){: .light .border }
![post-push-dark](/2023-11-25-first-blog-customization/post-push-dark.webp){: .dark }
*ワークフローにかかる時間が2分前後に短縮された！*

理由はわからないが、ブログテーマをアップデートしたらプッシュ後に記事がブログに実際に反映されるまでの時間がかなり短くなった！長い時は10分近くかかっていたが、今は2分ほど待てば反映される。

この他にもTwitterアイコンを除去したり、韓国語の文章で単語基準の改行を適用したりと試したことは多いが、アイコンが中央揃えにならず左に寄ったり、文章の段落が見苦しくなる副作用があって適用はしなかった。次にまた思いついたら再挑戦してみよう。
