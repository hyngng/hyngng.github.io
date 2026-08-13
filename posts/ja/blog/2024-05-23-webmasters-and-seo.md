---
title: GitHubブログをウェブマスターツールに登録してSEO最適化する
authors: ["blog"]

categories: [블로그]
tags: [블로그, 웹마스터도구, SEO]
start_with_ads: true

toc: true

date: 2024-05-23 11:53:00 +0900
last_modified_at: 2026-01-27 15:09:00 +0900

mermaid: true
---

## **はじめに**

1年以上ブログをディープウェブに近い状態で運用してきたが、今年の初めに検索エンジンに登録した。驚いたのは、TistoryやNaverブログの場合は特に申請しなくてもメジャープラットフォームでインデックスが生成され検索結果に表示されるが、GitHubブログのような個人サイトの場合、そうしたプロセスへの第一歩は手動で行わなければならないということだ。

![search-console](/2024-05-23-webmasters-and-seo/search-console.webp){: .w-75 }
*代表的なウェブマスターツール、Googleサーチコンソール*

韓国ポータルサイトのシェア順に、[Googleサーチコンソール](https://search.google.com/search-console/)と[Naverサーチアドバイザー](https://searchadvisor.naver.com/)、[Daumウェブマスターツール](https://webmaster.daum.net/)、[Bingウェブマスターツール](https://www.bing.com/webmasters?lang=ko)の計4つのプラットフォームに登録した。特徴的だったのは、サイトごとにドメイン登録後、実際の検索結果に表示されるまでの時間が千差万別だったことだ。3月20日頃にドメインを申請してから、Daumは約一日、Googleは約二週間、NaverとBingは約三週間ほど経ってから表示され始めた。

:::info
**2024-05-25 更新！**

追加で[Pinterestビジネスハブ](https://www.pinterest.co.kr/business/hub/)にも登録した。サイトの所有権が確認されると、RSSベースで画像を収集してピンを生成してくれる。
:::

結果的に現在は全てのプラットフォームで `site:hyngng.github.io` の検索語入力時にブログの表示が確認できる状態である。もし私のようにウェブマスターツールに個人サイトを登録したい方がいれば、以下を参考にすると良いだろう。

### **Googleサーチコンソール**

- GitHubブログでHTMLタグによるサイト所有権の確認は `_includes/head.html` に記述しても問題ないが、`jekyll-seo-tags` プラグインが関連機能をサポートしているため、`_config.yml` の `webmaster_verifications` 値を修正する方が便利かもしれない。

### **Naverサーチアドバイザー**

- NaverサーチアドバイザーはAtomタイプのフィードを提出できないため、RSSフィードを別途作成して登録する必要がある。作成したファイルの例は[私のGitHub](https://github.com/hyngng/hyngng.github.io/blob/main/assets/rss.xml)で、私のブログでの動作例は[こちら](https://hyngng.github.io/rss.xml)で確認できる。
- [IndexNow](https://www.indexnow.org/ko_kr/index)をサポートしているため、クロールリクエストを自動化できる。

### **Daumウェブマスターツール**

- [検索登録申請サイト](https://register.search.daum.net/index.daum)と[ウェブマスターツール](https://webmaster.daum.net/)が分かれている。最初のサイト登録は検索登録申請サイトで行い、サイト登録以降のサイトマップとフィードはウェブマスターツールで別途提出する必要がある。
- 検索結果にサイト登録が完了しても、新設サイトの場合はファビコンが表示されない。[カスタマーセンター](https://cs.daum.net/)に問い合わせたが、「ファビコンの収集基準はポリシー上詳細に公開できない」との回答だった。気掛かりではあるが、個人レベルでできることはないようだ。

### **Bingウェブマスターツール**

- Googleサーチコンソールにサイトが正常に登録されていれば、Googleと連携してそのまま利用できる。サイト所有権の確認をスキップし、提出したサイトマップやフィードなどが自動で連携される。
- Bingウェブマスターツールもファビコンが表示されない問題があるが、[サポートチームに問い合わせ](https://www.bing.com/webmasters/support)れば親切に解決してくれる。私の場合、問い合わせを送ってから二日でファビコンが正常に表示されるようになった。
- Naverと同様に[IndexNow](https://www.indexnow.org/ko_kr/index)をサポートしている。

## **SEO最適化**

ブログの検索登録を申請して初めて知った概念だ。SEO（検索エンジン最適化）とは、ウェブサイトやウェブページの品質を向上させて検索エンジンでよりよく表示され、上位に表示されるようにするプロセスで、[Naver](https://searchadvisor.naver.com/guide/seo-basic-intro)や[Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ko)が公式ガイドを発行するほど関心度の高い概念である。  
ただ私は実際に上位表示のための作業というより、ブログの検索表示を申請した後、いくつかのウェブマスターツールでSEO警告を受け、それを解決するためのプロセスが主となった。具体的にどのような問題状況をどう解決したかを簡単にまとめた。

### **webpによる画像最適化**

サイトのパフォーマンスを測るため、Googleが提供する[PageSpeed Insights](https://pagespeed.web.dev/?utm_source=psi&utm_medium=redirect)でページ性能を測定したところ、モバイルカテゴリでかなり遅い方の結果が出た。同時に提供される結果レポートを読むと、数多くの推奨事項の中に画像容量を削減すべきという内容があり、この部分を改善した。

私は普段[たまに描いた絵](https://hyngng.github.io/posts/fourth-drawing/)や[写真に撮ったもの](https://hyngng.github.io/posts/photos-of-gyemyo/)をブログポストにしているが、これらの画像は平均サイズが4000x3000で拡張子も `.png` または `.jpg` であるため、容量は絵の場合200KB〜1MB、写真の場合1〜3MBほどあった。他の記事で使う画像もこのサイズ基準に従っていたため容量は小さくなかったが、他のウェブサイトを参考にすると100KB以下の低容量で処理している場合が多く、自分のブログも同様の最適化水準に達するため、以下の処理を行った。

1. 画像サイズを1/4に縮小した。4000x3000サイズの場合は2000x1500サイズに調整した。
2. `.gif` および `.jpg`、`.png` 拡張子のファイルを非可逆圧縮を経て `.webp` 拡張子にエンコードした。

![before-after](/2024-05-23-webmasters-and-seo/before-after.webp)
*容量削減プロセスを経る前と後の画像。*

左が原寸、右がダウンスケール後に `webp` に変換したファイルだが、写真の品質に致命的な差がないまま容量がそれぞれ1.79MBと83.7KBと、約20倍もの大きな差がある。全てのファイルでこれほど劇的な差があるわけではないが、ほとんどは確実な容量削減効果を示し、効果が良いため他のポストの画像ファイルにも同様の処理を施した。

ただし品質が落ちた画像を使うのはやはり惜しいので、絵や写真の場合は「画像の原寸は私のGitHubでご確認いただけます！」といった文をポストの末尾に追加し、希望する場合は原寸画像にリンクできるようにした。

### **2つ以上のH1タグ重複の解消**

NaverとBingのウェブマスターツールで指摘された事項である。ウェブコンテンツアクセシビリティガイドライン（WCAG）によれば、ウェブページは最大一つのh1タグを含むべきだが、私のブログでは左サイドバーでサイトタイトルと記事タイトルが両方とも `<h1>` で処理されていた。

```html
{% if page.layout != 'home' %}
  <h2 class="site-title">
    <a href="{{ '/' | relative_url }}">{{ site.title }}</a>
  </h2>
{% else %}
  <h1 class="site-title">
    <a href="{{ '/' | relative_url }}">{{ site.title }}</a>
  </h1>
{% endif %}
```

修正したコードである。記事タイトルよりサイトタイトルのヘッダータグを下げるのが良いと思い、`site.title` のタイトルが表示されるコードを修正した。ルートURLではh1、それ以外のURLではh2で表示されるように変更した。

Chromeの開発者ツールで確認すると、ブログのホームではh1、現在のページではh2で表示される。適用後、修正が行われたURLを再提出し、二日後にNaverとBingのウェブマスターツールのサイト診断ページでエラーが修正されたことを確認できた。

### **meta descriptionの自動生成**

:::info
**2024-05-28 更新！**

現在この方法は使っていない。実質的な解決策は9月25日付で修正された以下の内容に移ってください！
:::

Bingウェブマスターツールで指摘された事項である。私のブログの多くの記事で使われる「はじめに」の導入部が複数ページのdescriptionとして重複登録されていることが問題となり、フロントマターに個別のdescriptionを記述したが、20字程度の分量にすると「長すぎる、または短すぎるMeta Description」というエラー通知が発生していた。

descriptionの適切な長さは25〜160字と案内されている。毎ページ文字数を合わせて25字以上の分量を記述するのはあまりに手間なので、descriptionを自動生成するコードを作成した。

```cs
<html lang="{{ page.lang | default: site.alt_lang | default: site.lang }}" {{ prefer_mode }}>
  {% include head.html post_content = content %}
  ...
```

```html
{% if page.layout == "post" %}
  {% assign description = include.post_content | content_filter | strip_html | truncate: 100 %}
{% else %}
  {% assign description = site.description %}
{% endif %}

<meta name="description" content="{{ description }}" />
<meta property="og:description" content="{{ description }}" />
<meta property="twitter:description" content="{{ description }}" />

{{ seo_tags }}
```

実装プロセスはやや厄介だった。descriptionを含むメタタグは `jekyll-seo-tag` プラグインによって先に一括生成されるため、生成された `seo_tag` のうちdescriptionをオーバーライドする形で実装した。実装の途中で `head.html` を含む `_includes` フォルダのファイルはページコンテンツにアクセスできない問題があったが、`_layouts/default.html` から `content` を調達して使う形で補った。

```ruby
require 'nokogiri'

module Jekyll
  module ContentFilter
    def content_filter(input)
      doc = Nokogiri::HTML(input)
      content_div = doc.css('div.content').first
      output = content_div&.text&.strip || ''
      output.gsub(/\s+/, ' ').strip.gsub(/(들어가며|starting with)\s+/i, '')
    end
  end
end

Liquid::Template.register_filter(Jekyll::ContentFilter)
```

`content` は `content_filer` というカスタムRubyプラグインを経由するが、これはタイトル、公開日、筆者および「はじめに」の導入部など、descriptionとして不要な情報をある程度除去するためである。記事本文が全て `<div class="content"></div>` タグに渡される点を利用しており、[以前に似たようなコードを](https://hyngng.github.io/ja/blog/blog-content-remove/)実装したことがあったがまだ慣れていなかったため、この部分はGPTの助言を求めた。

:::info
**2024-09-25 更新！**
:::

実は上記の内容は対症療法的な解決策である。新しく生成されたdescriptionが {% raw %}`{{ seo_tags }}`{% endraw %} のdescriptionと重複するため、ページに `<meta name="description" ... >` タグが二つ存在する問題があった。私はより根本的な解決策を望み、[jekyll-seo-tag](https://github.com/jekyll/jekyll-seo-tag/tree/master) プラグインでmeta descriptionを生成する部分自体を見つけ、以下のように修正した。

```html
{% if page.layout == 'post' %}
  {% if page.content %}
    {% assign description = page.content | strip_html | strip_newlines | truncate: 150 %}
    <meta name="description" content="{{ description }}" />
    <meta property="og:description" content="{{ description }}" />
    <meta property="twitter:description" content="{{ description }}" />
  {% endif %}
{% else %}
  {% if seo_tag.description %}
    <meta name="description" content="{{ seo_tag.description }}" />
    <meta property="og:description" content="{{ seo_tag.description }}" />
    <meta property="twitter:description" content="{{ seo_tag.description }}" />
  {% endif %}
{% endif %}
```

```ruby
GIT
  remote: https://github.com/hyngng/jekyll-seo-tag.git
  revision: 8584ad6bd6788036ad17a35659c87737b11d02c6
  branch: master
  specs:
    jekyll-seo-tag (2.8.0)
      jekyll (>= 3.8, < 5.0)
```

```ruby
gem 'jekyll-seo-tag', git: 'https://github.com/hyngng/jekyll-seo-tag.git', branch: 'master'
```

変更したコードは、ページのレイアウトに応じて `_config.yml` に記述されたdescriptionを読み込むか、またはポストコンテンツからmeta descriptionを生成する。私はこのGitHubプロジェクトを[個人リポジトリ](https://github.com/hyngng/jekyll-seo-tag)にフォークした上で別途修正し、`Gemfile` で以下のように呼び出して使用している。この方法が私が見つけられる最もすっきりした解決策である。

## **おわりに**

検索表示の申請からSEO最適化まで慌ただしく作業したが、どれだけ効果があるかはよくわからない。ただ私のブログは宣伝や他人に必要な情報を生産する空間というより、個人記録用としての性格が強い方なので、技術的好奇心の感覚で検索表示の管理はしても、あまりこだわりすぎないようにしようと思う。
