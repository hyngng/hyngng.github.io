---
title: "GitHubブログで特定タグの内容を除去する"
authors: ["blog", "dev"]

categories: [블로그]
tags: [블로그, 커스터마이징, Chirpy, Liquid]
start_with_ads: true

toc: true

date: 2024-03-21 19:32:00 +0900
last_modified_at: 2025-10-20 22:29:00 +0900
---

:::info
Jekyllフレームワークを使用していた時に書かれた記事です。現在はAstroに移行しました！
:::

## **はじめに**

Chirpyテーマはすっきりと整っているが、素の状態ではこれは改善が必要だと思う部分が時々見られる。[ちょこちょこと修正](https://hyngng.github.io/posts/first-blog-customization/)はしているが、個人的に惜しい点がまだいくつか残っていた。

![before-light](/2024-03-21-blog-content-remove/before-light.webp){: .light .w-75 .border }
![before-dark](/2024-03-21-blog-content-remove/before-dark.webp){: .dark .w-75 }
*修正前のブログホームに表示されるポスト要約*

その一つは、ブログホームの記事要約が画像キャプションやヘッダーなどを含んだ生のまま表示されることだ。上のように画像キャプションや「はじめに」のような不要な部分が一緒に表示され、可読性が悪くなっている。こういうものは当然デフォルトで処理されていてしかるべきではないかと思うが、今回は方法を見つけて修正した。

## **原因の把握**

```html
<div class="card-text content mt-0 mb-3">
  <p>
    {% include no-linenos.html content=post.content %}
    {{ content | markdownify | strip_html | truncate: 200 | escape }}
  </p>
</div>
```

GitHubブログのホームに関する内容は `_layouts/home.html` に記述されている。素のコードは私の場合上記のように記述されており、`<div class="card-text content mt-0 mb-3">` 段落でポスト要約を生成している。

コードを見ると、コンテンツは単に `markdownify` と `strip_html` だけを経てテキストで表示されている。ここに別のフィルターを追加して特定タグを除去できれば良いと考え、以下のようなプロセスを踏んだ。

## **コードの作成**

```ruby
require 'nokogiri'

module Jekyll
  module RemoveTagFilter
    def remove_tag(input, *tags)
      doc = Nokogiri::HTML(input)
      doc.remove_namespaces!
      tags.each do |tag|
        doc.search(tag).each do |node|
          node.content = ''
        end
      end
      doc.to_html.gsub(/\A<!DOCTYPE .*?>\n?/, '').gsub(/\n\z/, '')
    end
  end
end

Liquid::Template.register_filter(Jekyll::RemoveTagFilter)
```

```html
{%- if post.description -%}
  {{- post.description -}}
{%- else -%}
  ...
  {{- content | markdownify | remove_tag: 'h2', 'h3', 'em', 'blockquote', 'pre' | strip_html | newline_to_br | replace: '<br />', ' ' | strip_newlines -}}
  ...
{%- endif -%}
```

:::tip
検索結果のテキストを担当する `assets/js/data/search.json` ファイルにも同様の処理を施すことができる。
:::

RubyやLiquidについては背景知識がなく、方法を探し出すのに少し苦労した。`split` や `join` などLiquidだけで解決しようとしたが、望む結果を作るのが難しくてGPTの助けを借り、`_plugins/remove-tags.rb` パスにRubyファイルを作成して使う形で解決した。Rubyファイルにはタグタイプをパラメータとして受け取り、内部テキストを正規表現で除去する関数を作成した。`Nokogiri` というパースライブラリを使用し、Liquidファイルでは `remove_tag: 'h2', 'h3', 'em', 'blockquote'` のように使う。

:::info
2025-10-20 更新！
:::

Chirpyのバージョンが `v7.4.0` にアップデートされ、`post-description.html` が `post-summary.html` に置き換えられた。ただ構造はほとんど同じなので、以下のように記述できる。

```html
  ...
  {%- assign content = content
    | markdownify
    | remove_tag: 'h2', 'h3', 'em', 'blockquote', 'pre'
    | strip_html
    | newline_to_br
    | replace: '<br />', ' '
    | strip_newlines
    | strip
  -%}
  ...
```

## **改善の確認**

![after-light](/2024-03-21-blog-content-remove/after-light.webp){: .light .w-75 .border}
![after-dark](/2024-03-21-blog-content-remove/after-dark.webp){: .dark .w-75 }
*コード適用後に改善されたポスト要約*

コードを作成したらうまく動作した。修正前と比較すると、不要な文章が除去されて記事要約の可読性が大幅に改善された。修正前のわかりにくい感じがなくなり、はるかに自然になった。追加で除去したいタグは `remove_tag:` の後に追加すれば良いので、使用も簡単だ。今後うまく活用していこう。
