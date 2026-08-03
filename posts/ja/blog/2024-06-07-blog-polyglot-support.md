---
title: "GitHubブログに多言語サポートを追加する"
authors: ["blog", "dev"]

categories: [블로그]
tags: [블로그, 다국어, jekyll-polyglot]
start_with_ads: true

toc: true
toc_sticky: true

date: 2024-06-07 22:00:00 +0900
last_modified_at: 2025-10-16 13:07:00 +0900
---

:::info
**2026-07-28 更新！**

Jekyllフレームワークを使用していた時に書かれた記事です。現在はAstroに移行しました！
:::

:::info
**2024-09-15 更新！**

多言語機能をサポートするまでは良かったものの、メンテナンスが非常に難しく複雑になる問題があり、プラグイン適用前の状態に戻しました。多言語機能をきちんとサポートするには、思った以上に多くの部分を修正する必要があり、したがって純正テーマとのマージが非常に複雑になる不便さを甘受しなければなりません。
:::

## **プラグインの紹介**

GitHubブログ環境で多言語機能を実現できるJekyllプラグインは、大きくjekyll-polyglotと`jekyll-multiple-languages-plugin`の二つがある。このうち私が使ったのは前者のプラグインjekyll-polyglotであり、このプラグインは各ポストのフロントマターで定義する`lang`値に応じてI18N言語コードをルートURLの後に挿入する形で多言語翻訳ページを生成する。このプラグインは後者のプラグイン`jekyll-multiple-languages-plugin`をモデルにして作られたとされ、公式ガイドはインストール方法から使用上の注意まで[GitHubのPolyglotリポジトリ](https://github.com/untra/polyglot?tab=readme-ov-file#how-to-use-it)で詳細に案内されている。

## **事前準備**

### **プラグインのインストールと設定**

```ruby
group :jekyll_plugins do
  gem "jekyll-polyglot"
end
```

`Gemfile`に上記のようにプラグインを登録し、`gem install jekyll-polyglot`コマンドでプラグインをインストールする。

```yaml
plugins:
  - jekyll-polyglot

languages: ["ko", "en"]
default_lang: "ko"
exclude_from_localization: ['javascript', 'images', 'css', 'sitemap.xml']
parallel_localizaion: true
```

プラグインをインストールしたら、`_config.yml`に上記の項目を追加する必要がある。`languages`にはページがサポートする言語、`default_lang`にはページのデフォルト言語を入力すればよい。入力する際の注意点として、Windows環境では`parallel_localization`オプションが正しく動作しないため、必ず`false`に設定しなければならない。

### **正規表現バグの修正**

プラグインをインストールしてビルドすると、「'relative_url_regex': target of repeat operator is not specified:」というエラーに遭遇する。このエラーはプラグインの`site.rb`ファイル内の一部の正規表現が、Chirpyテーマの`_config.yml`における `exlude: *.gem *.gemspec *.config.js` などのワイルドカード（*）を処理できないために発生する。この問題をプラグインの製作者に問い合わせたが、[このドキュメントを根拠に](https://jekyllrb.com/docs/configuration/options/#global-configuration)、Chirpyテーマが`_config.yml`でグローバルパターンを誤って使用しているという回答を得た。

ただしMinimal-Mistakesなどの他のJekyllテーマも[グローバルパターンを使用している](https://github.com/mmistakes/minimal-mistakes/blob/master/_config.yml#L168-L169)ことから、プラグインのコード自体を修正する必要があるように思われる。この場合プラグインを自作で修正して使わなければならないため、私はプロジェクトを[自分のGitHubリポジトリにフォークして](https://github.com/hyngng/jekyll-polyglot)、`Gemfile`で以下のように呼び出して使用した。

```ruby
gem 'jekyll-polyglot', git: 'https://github.com/hyngng/jekyll-polyglot', branch: 'master'
```

その後、プラグインの `jekyll-polyglot-1.8.0/lib/jekyll/polyglot/patches/jekyll` パスにある `site.rb` に記述されている `relative_url_regex()` と `absolute_url_regex()` の二つの関数を以下のように修正した。

```ruby
def relative_url_regex(disabled = false)
  regex = ''
  unless disabled
    @exclude.each do |x|
      escaped_x = Regexp.escape(x)
      regex += "(?!#{escaped_x})"
    end
    @languages.each do |x|
      escaped_x = Regexp.escape(x)
      regex += "(?!#{escaped_x}\/)"
    end
  end
  start = disabled ? 'ferh' : 'href'
  %r{#{start}="?#{@baseurl}/((?:#{regex}[^,'"\s/?.]+\.?)*(?:/[^\]\[)("'\s]*)?)"}
end

...

def absolute_url_regex(url, disabled = false)
  regex = ''
  unless disabled
    @exclude.each do |x|
      escaped_x = Regexp.escape(x)
      regex += "(?!#{escaped_x})"
    end
    @languages.each do |x|
      escaped_x = Regexp.escape(x)
      regex += "(?!#{escaped_x}\/)"
    end
  end
  start = disabled ? 'ferh' : 'href'
  %r{(?<!hreflang="#{@default_lang}" )#{start}="?#{url}#{@baseurl}/((?:#{regex}[^,'"\s/?.]+\.?)*(?:/[^\]\[)("'\s]*)?)"}
end
```

関数を修正した後、`bundle exec jekyll s` コマンドを入力すると、ビルドが問題なく行われることを確認できた。

### **ポストファイルの属性修正**

```yaml
---
lang: en
permalink: example-url-here
---
```

翻訳したいポストのフロントマターに言語値を指定する必要がある。基本的に `ko`、`en` のようなI18N国コードで指定すればよく、私の場合は `ko-KR` と `en` で記述した。このうち `permalink` は該当ポストのURLパスを指定するもので、Jekyllでは同一URLを持つ二つのファイルは基本的に同じものとして扱われるため、原稿と翻訳版を人為的に区別するために必要である。

```
_posts/2010-03-01-salad-recipes-en.md
_posts/2010-03-01-salad-recipes-sv.md
_posts/2010-03-01-salad-recipes-fr.md
```

フロントマターの `permalink` でポスト言語を区別するのが気に入らない場合は、代わりにファイル名を上記のように変更する形でも区別できるが、その場合ページURLが `example.github.io/en/2010-03-01-salad-recipes-en` のように同語反復を含む可能性がある。

## **テンプレートの修正**

Chirpyテーマに限定された内容なので、他のJekyllテンプレートを使用する場合はこの内容を省略して[次の段落](#その他の作業)に進んでも構わない。ただ私と同様にChirpyテンプレートを修正する必要がある場合、以下の内容が役立つかもしれない。

- jekyll-polyglotプラグインで使用できる変数
	- `site.default_lang`: `_config.yml`で宣言されたデフォルト言語値。
	- `site.active_lang`: 現在のWebページで有効になっている言語値。
	- `page.lang`: フロントマターで宣言されたポスト言語値。

上記三つの変数を活用すれば、例えば {% raw %}`{% if page.lang == site.default_lang %}`{% endraw %} のような条件文を書く形で利用でき、ページに表示される言語を状況に応じて制限できる。

### **サイト言語の読み込み**

```html
{% if site.active_lang %}
  {% assign lang = site.active_lang %}
{% elsif site.data.locales[page.lang] %}
  {% assign lang = page.lang %}
{% elsif site.data.locales[site.lang] %}
  {% assign lang = site.lang %}
{% else %}
  {% assign lang = 'site.default_lang'' %}
{% endif %}
```

Chirpyテンプレートは `_includes/lang.html` という別ファイルで言語を設定している。このファイルを上記のように修正した後、個別のレイアウトファイルで `lang.html` を読み込む形で利用できる。

### **言語別にコンテンツを表示する**

```html
{% include lang.html %}
```

ほとんどは上記のように `lang.html` を読み込んで処理したが、ページネーションなどの場合は単に言語指定を変更するだけでは限界があるため、別途記述を追加した。ほとんどは、特定言語のページでその言語で書かれたポストに関連する情報のみを表示するよう変更した。

```html
<div id="post-list" class="flex-grow-1 px-xl-1">
  {% for post in posts %}
    {% if post.lang == site.active_lang %}
      <article class="card-wrapper card">...</article>
    {% endif %}
  {% endfor %}
</div>
```

例えば `_layouts/home.html` には {% raw %}`{% if post.lang == site.active_lang %}`{% endraw %} 条件を追加して、ホームページではサイト言語が英語の場合 `lang: en` で書かれたページのみが表示されるようにした。この他に細かく修正したファイルは以下の通り。

| 用途 | ファイルパス |
|--------|--------|
| 共通枠ページ | `_layouts/default.html` |
| ホームページ | `_layouts/home.html` |
| カテゴリ | `_layouts/category.html` |
| タグページ | `_layouts/tags.html` |
| アーカイブページ | `_layouts/archive.html` |
| 情報ページ | `_layouts/about.html` |
| 最近更新した記事 | `_includes/update-list.html` |
| タグ一覧 | `_includes/trending_tags.html` |
| 関連ポスト | `_includes/related-posts.html` |
| ポストナビゲーション | `_includes/post-nav.html` |
| ページネーション | `_includes/post-paginator.html` |

### **情報ページの内容を区別する**

```html
{% if site.active_lang == 'ko-KR' %}
## 韓国語の自己紹介
...
{% elsif site.active_lang == 'en' %}
## English Self-Introduction
...
{% endif %}
```

情報（about）ページで言語別に異なる内容を表示する方法だ。最初は `about-en.md` のような別ファイルを作って使うべきかと思ったが、一つのファイルでサイト言語に応じて異なる内容を表示する方法が最も簡単なようだ。

### **文字数表示を自然に変更する**

```html
<span
  class="readtime"
  data-bs-toggle="tooltip"
  data-bs-placement="bottom"
  title="{{ words }}{% if site.active_lang != 'ko-KR' %}{{ ' ' }}{% endif %}{{ site.data.locales[include.lang].post.words }}
>
```

気になったので修正した小さなディテールだ。このテーマではポスト上部の読了時間にマウスカーソルを置くと文字数が表示されるが、言語に関わらず文字数と「文字」単位の間に一文字の空白があり、「1000 文字」のように表示される。個人的に不自然に感じたので、韓国語では「1000文字」に、他の言語では「1000 words」に、空白も含めて表示されるよう変更した。

## **その他の作業**

### **ヘッダーにページ言語を明示する**

```html
{% I18n_Headers %}
```

[Google検索セントラルの国際および多言語ガイド](https://developers.google.com/search/docs/specialty/international/localized-versions?hl=ko)で案内されている事項である。必須ではないが、SEOを気にしているならヘッダーに上記コードを追加してページの言語を明示するのが良い。コードはビルドを経て以下のように変換される。

```html
<meta http-equiv="Content-Language" content="ko-KR">
<link rel="alternate" hreflang="ko-KR" href="ttps://hyngng.github.io/posts/:title/"/>
<link rel="alternate" hreflang="en" href="https://hyngng.github.io/en/posts/:title/"/>
```

### **ビルドプロセスにプラグインを含める**

```html
name: Jekyll site CI

on:
  push:
    branches: [ "site" ]
  pull_request:
    branches: [ "site" ]

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Build the site in the jekyll/builder container
      run: |
        docker run \
        -v $:/srv/jekyll -v $/_site:/srv/jekyll/_site \
        jekyll/builder:latest /bin/bash -c "chmod -R 777 /srv/jekyll && jekyll build --future"

    - name: Push
      uses: s0/git-publish-subdir-action@develop
      env:
          REPO: self
          BRANCH: main
          FOLDER: _site
          GITHUB_TOKEN: $
          MESSAGE: "Build: ({sha}) {msg}"
```

jekyll-polyglotはデフォルトで内蔵されたプラグインと異なり外部プラグインとして扱われるため、セキュリティ上別途ビルドする必要がある。`.github/workflows/` パスに新しい `.yml` ファイルを作成し、上記のように記述すれば問題なくビルドされる。

### **サイトマップに全ページを含める**

```html
...
{% for lang in site.languages %}
  {% for post in site.posts %}
    {% if lang == post.lang %}
      <url>
        <loc>
          {{ site.url }}
          {% if lang == site.default_lang %}
            {{ post.url }}
          {% else %}
            {{ post.url | prepend: lang | prepend: '/' }}
          {% endif %}
        </loc>
        ...
      </url>
    {% endif %}
  {% endfor %}
{% endfor %}
```

サイトマップは多言語対応時の最大の問題点の一つである。デフォルトページについてのみ `<loc>` タグを生成するからだ。私はその代わりに `site.languages` の全言語について一度ずつ検査するよう修正し、その中でも例えば `lang: en` に設定されたファイルから自動生成された韓国語ページのような無効な要素は無視するようにした。

### **ページに言語切り替えボタンを追加する**

```html
{% for lang in site.languages %}
  <div class="lang" style="display: inline;">
    <a style="
      {% if lang == site.active_lang %}
        font-weight: bold;
      {% endif %}"
      href="
      {% if lang == site.default_lang %}
        {{site.baseurl}}{{page.url}}
      {% else %}
        {{site.baseurl}}/{{ lang }}{{page.url}}
      {% endif %}">
      {{ lang }}
    </a>
    {% if forloop.last == false %}
      <span class="lang-border"> </span>
    {% endif %}
  </div>
{% endfor %}
```

必要であれば上記のようなコードで任意の場所に言語切り替えボタンを追加できる。ただ個人的には、自分のブログには言語ごとの専有コンテンツがあるわけでもなく、訪れてくれる方がわざわざ他の言語で見る必要もないと思い、追加していない。

### **フィードの内容を言語別に区別する**

```
{% assign filtered_posts = site.posts | where: "lang", site.active_lang %}

{% for post in filtered_posts limit: 5 %}
  <entry> ... </entry>
{% endfor %}
```

フィードも `site.active_lang` と一致するポストのみを `filtered_posts` に言語設定に応じて動的に生成されるようにした。ウェブマスターツールに登録する際は `feed.xml` と `/en/feed.xml` の二つをそれぞれ登録した。

## **適用画面**

![result-light](/2024-06-07-blog-polyglot-support/result-light.webp){: .light .border }
![result-dark](/2024-06-07-blog-polyglot-support/result-dark.webp){: .dark }

## **おわりに**

大変だった。jekyll-polyglotは基本的に柔軟で便利というより、煩わしい印象が強い。適用プロセスが決して簡単で便利とは言えず、英語専用ページを別途開設して二つで管理した方が良いのではないかとも思ったが、ページコンテンツの連携や検索表示設定などデメリットの方が多そうなので、jekyll-polyglotを使うことにした。それでも実装さえできれば、自前の多言語サポート機能を作ろうとする場合にjekyll-polyglotがもたらす利点は確かにあるようだ。
