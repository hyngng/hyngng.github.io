---
title: "깃허브 블로그에 다국어 지원 추가하기"

categories: [블로그]
tags: [블로그, 다국어, jekyll-polyglot]
start_with_ads: true

toc: true
toc_sticky: true

date: 2024-06-07 22:00:00 +0900
last_modified_at: 2024-09-15 22:57:00 +0900
---

> **2024/09/15 수정!**  
다국어 기능을 지원하는 것까지는 좋은데 유지보수가 너무 어렵고 복잡해지는 문제가 있어 플러그인 적용 이전으로 원상복귀해주었습니다. 다국어 기능을 제대로 지원하려면 생각보다 많은 부분을 뜯어고쳐야 하고 따라서 순정 테마와의 병합 과정이 매우 복잡해지는 불편함을 감수해야 합니다.
{: .prompt-info }

## **플러그인 소개**

깃허브 블로그 환경에서 다국어 기능을 구현할 수 있는 지킬 플러그인은 크게 `jekyll-polyglot`과 `jekyll-multiple-languages-plugin` 두 가지가 있습니다. 이중에 제가 사용한 것은 전자의 플러그인 `jekyll-polyglot`으로, 이 플러그인은 각 포스트의 프론트매터에서 정의하는 `lang` 값에 따라 I18N 언어 코드를 루트 URL 뒤에 삽입하는 식으로 다국어 번역본 페이지를 생성합니다. 이 플러그인은 후자의 플러그인 `jekyll-multiple-languages-plugin`을 모델로 만들어졌다고 하며, 공식 가이드는 설치 방법부터 사용시 주의사항까지 [깃허브 Polyglot 레포지토리](https://github.com/untra/polyglot?tab=readme-ov-file#how-to-use-it)에서 자세히 안내되고 있습니다.

## **사전작업**

### **플러그인 설치 및 세팅하기**

```ruby
group :jekyll_plugins do
  gem "jekyll-polyglot"
end
```
{: file="Gemfile" }

`Gemfile`에 위와 같이 플러그인을 등록하고 `gem install jekyll-polyglot` 명령어로 플러그인을 설치합니다.

```yaml
plugins:
  - jekyll-polyglot

languages: ["ko", "en"]
default_lang: "ko"
exclude_from_localization: ['javascript', 'images', 'css', 'sitemap.xml']
parallel_localizaion: true
```
{: file="_config.yml" }

플러그인이 설치되면 `_config.yml`{: .filepath }에 위 항목을 추가해야 합니다. `languages`에는 페이지가 지원할 언어, `default_lang`에는 페이지의 기본 언어를 입력해주시면 됩니다. 입력할 때 주의할 점은 윈도우 환경에서는 `parallel_localization` 옵션이 제대로 동작하지 않기 때문에, 해당 값을 `false`로 꼭 설정해주셔야 합니다.

### **정규 표현식 버그 수정하기**

플러그인을 설치하고 빌드를 해보면 "'relative_url_regex': target of repeat operator is not specified:"라는 에러를 만나게 됩니다. 이 에러는 플러그인의 `site.rb`{: .filepath } 파일에서 일부 정규 표현식이 Chirpy 테마의 `_config.yml`{: .filepath }에서 `exlude: *.gem *.gemspec *.config.js` 등의 와일드카드(*)를 처리하지 못하기 때문에 발생하는데, 이 문제를 플러그인 제작자에게 문의해봤으나 [이 문서를 근거로](https://jekyllrb.com/docs/configuration/options/#global-configuration) Chirpy 테마가 `_config.yml`{: .filepath }에서 글로벌 패턴을 잘못 사용한 것이라는 답변을 받았습니다.

다만 Minimal-Mistakes 등의 다른 지킬 테마도 [글로벌 패턴을 사용중인 것](https://github.com/mmistakes/minimal-mistakes/blob/master/_config.yml#L168-L169)을 보면 플러그인 코드 자체를 수정할 필요가 있어 보입니다. 이 경우 저는 플러그인을 자체 수정해서 사용해야 하므로 제 경우 프로젝트를 [개인 리포지토리로 fork한 뒤](https://github.com/kurtsson/jekyll-multiple-languages-plugin/fork) `Gemfile`에 다음과 같이 불러와 사용했습니다.

```ruby
gem 'jekyll-polyglot', git: 'https://github.com/hyngng/jekyll-polyglot', branch: 'master'
```
{: file="Gemfile" }

이후 플러그인의 `jekyll-polyglot-1.8.0/lib/jekyll/polyglot/patches/jekyll`{: .filepath } 경로의 `site.rb`{: .filepath }에 작성되어있는 `relative_url_regex()`와 `absolute_url_regex()` 두 함수를 아래와 같이 수정해주었습니다.

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
{: file="site.rb" }

함수를 수정한 뒤 `bundle exec jekyll s` 명령어를 입력해보면 문제없이 빌드가 이루어지는 것을 확인할 수 있었습니다.

### **포스트 파일 속성 수정하기**

```yaml
---
lang: en
permalink: example-url-here
---
```
{: file="example-page.md"}

번역되길 원하는 포스트의 프론트매터에 언어값을 지정해줘야 합니다. 기본적으로 `ko`, `en`과 같이 I18N 국가코드로 지정해주시면 되며, 저의 경우 `ko-KR`와 `en`으로 작성해주었습니다. 이중에 `permalink`는 해당 포스트의 URL 경로를 지정하며, 이는 지킬에서 동일한 URL을 가진 두 파일은 기본적으로 같은 것으로 취급되기 때문에 원본과 번역본을 인위적으로 구분해주기 위함입니다. 

```
_posts/2010-03-01-salad-recipes-en.md
_posts/2010-03-01-salad-recipes-sv.md
_posts/2010-03-01-salad-recipes-fr.md
```
{: file="_posts" .nolineno }

프론트매터의 `permalink`로 포스트 언어를 구분하는 것이 마음에 들지 않는다면 대신 파일명을 위와 같이 변경하는 식으로도 구분할 수 있으나, 이 경우 포스트 URL이 `example.github.io/en/2010-03-01-salad-recipes-en`와 같이 언어 구분이 불필요하게 중복될 수 있습니다.

## **템플릿 수정**

Chirpy 테마에 한정된 내용이므로 다른 지킬 템플릿을 사용하는 분들께서는 생략하고 [다음 문단](#기타-작업)으로 넘어가셔도 좋을 것 같습니다. 다만 저와 비슷하게 템플릿을 수정할 필요가 있을 경우 다음의 내용이 도움이 될 수 있습니다.

jekyll-polyglot 플러그인에서 사용할 수 있는 변수들
: - `site.default_lang`: `_config.yml`{: .filepath }에 선언된 기본 언어값입니다.
- `site.active_lang`: 현재 웹페이지에서 활성화되어 있는 언어값입니다.
- `page.lang`: 프론트매터에서 선언된 포스트 언어값입니다.

위 세 개 변수를 활용하면 예를 들어 {% raw %}`{% if page.lang == site.default_lang %}`{% endraw %}와 같은 조건문을 작성하는 식으로 활용할 수 있으며 페이지에서 표시되는 언어를 상황에 맞게 제한할 수 있습니다.

### **사이트 언어 불러오기**

{% raw %}
```liquid
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
{: file="_includes/lang.html" }
{% endraw %}

Chirpy 템플릿은 `_includes/lang.html`{: .filepath }라는 별도의 파일에서 언어를 설정합니다. 해당 파일을 위와 같이 수정한 뒤 세부 레이아웃 파일에서 `lang.html`{: .filepath }을 불러오는 식으로 활용할 수 있습니다.

### **언어별로 콘텐츠 표시하기**

{% raw %}
```liquid
{% include lang.html %}
```
{: file="others.html" }
{% endraw %}

대부분은 위와 같이 `lang.html`{: .filepath }을 불러와 처리했고, 페이지네이션과 같은 경우 단순히 언어 지정을 변경해주는 것만으로는 한계가 있어 별도 수식을 작성해주었습니다. 대부분은 특정 언어별 페이지에서 해당 언어로 작성된 포스트와 관련된 정보만을 표시하도록 바꿔주었어요.

{% raw %}
```liquid
<div id="post-list" class="flex-grow-1 px-xl-1">
  {% for post in posts %}
    {% if post.lang == site.active_lang %}
      <article class="card-wrapper card">...</article>
    {% endif %}
  {% endfor %}
</div>
```
{: file="_layouts/home.html" }
{% endraw %}

예를 들어 `_layouts/home.html`{: .filepath }에는 {% raw %}`{% if post.lang == site.active_lang %}`{% endraw %} 조건을 추가해서 홈페이지에서는 사이트 언어가 영어인 경우 `lang: en`으로 작성된 페이지만 표시되도록 만들었습니다. 이외에 세부적으로 수정해준 파일들은 이렇습니다.

| 용도 | 파일 경로 |
|--------|--------|
| 공용 틀 페이지 | `_layouts/default.html`{: .filepath } |
| 홈페이지 | `_layouts/home.html`{: .filepath } |
| 카테고리 | `_layouts/category.html`{: .filepath } |
| 태그 페이지 | `_layouts/tags.html`{: .filepath } |
| 아카이브 페이지 | `_layouts/archive.html`{: .filepath } |
| 정보 페이지 | `_layouts/about.html`{: .filepath } |
| 최근 수정한 글 | `_includes/update-list.html`{: .filepath } |
| 태그 둘러보기 | `_includes/trending_tags.html`{: .filepath } |
| 관련 포스트 | `_includes/related-posts.html`{: .filepath } |
| 포스트 네비게이션 | `_includes/post-nav.html`{: .filepath } |
| 페이지네이션 | `_includes/post-paginator.html`{: .filepath } |

### **정보 페이지 내용 구분하기**

{% raw %}
```liquid
{% if site.active_lang == 'ko-KR' %}
## 한국어 자기소개
...
{% elsif site.active_lang == 'en' %}
## English Self-Introduction
...
{% endif %}
```
{: file="_tabs/about.md" }
{% endraw %}

정보(about) 페이지에 언어별로 다른 내용을 보여주는 방법입니다. 처음에는 `about-en.md`{: .filepath }같은 별개의 파일을 만들어서 사용해야 하나 싶었는데, 그냥 하나의 파일에서 사이트 언어에 따라 다른 내용을 보여주는 방법이 제일 간편한 것 같습니다.

### **글자수 표시 자연스럽게 바꾸기**

{% raw %}
```liquid
<span
  class="readtime"
  data-bs-toggle="tooltip"
  data-bs-placement="bottom"
  title="{% if site.active_lang == 'ko-KR' %}
           {{ words }}{{ site.data.locales[include.lang].post.words }}
         {% else %}
           {{ words }} {{ site.data.locales[include.lang].post.words }}
         {% endif %}"
>
```
{: file="_includes/read-time.html" }
{% endraw %}

신경쓰여서 수정한 작은 디테일입니다. 이 테마에서는 포스트 상단에서 읽는 시간에 마우스 커서를 올려두면 글자수가 표시되는데, 언어에 상관없이 글자수와 글자 단위 사이에 한 칸 공백이 있어 "1000 자"와 같이 표시됩니다. 개인적으로 부자연스럽다고 생각해서 한국어에서는 _1000자_ 로, 다른 언어에서는 _1000 words_ 로 공백과 함께 표시되도록 변경해주었습니다.

## **기타 작업**

### **헤더에 페이지 언어 명시하기**

{% raw %}
```liquid
{% I18n_Headers %}
```
{: file="_includes/head.html" }
{% endraw %}

[구글 검색 센터 문서의 국제 및 다국어 가이드](https://developers.google.com/search/docs/specialty/international/localized-versions?hl=ko)에서 안내하고 있는 사항입니다. 필수사항은 아니지만 검색엔진 최적화(SEO)를 신경쓰고 있다면 헤더에 위의 코드를 추가하여 페이지의 언어를 명시해주는 것이 좋습니다. 코드는 빌드를 거쳐 이렇게 변환됩니다.

```liquid
<meta http-equiv="Content-Language" content="ko-KR">
<link rel="alternate" hreflang="ko-KR" href="ttps://hyngng.github.io/posts/:title/"/>
<link rel="alternate" hreflang="en" href="https://hyngng.github.io/en/posts/:title/"/>
```
{: file="header" .nolineno }

### **빌드 과정에 플러그인 포함하기**

{% raw %}
```liquid
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
{: file=".github/workflows/polyglot-deploy.yml" }
{% endraw %}

`jekyll-polyglot`은 기본 내장된 플러그인과 다르게 외부 플러그인으로 취급되어 보안상 별개로 빌드해야 합니다. `.github/workflows/`{: .filepath } 경로에 새 `.yml` 파일을 만들고 위와 같이 작성하면 문제없이 빌드됩니다.

### **사이트맵에 모든 페이지 포함하기**

{% raw %}
```liquid
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
{: file="sitemap.xml" }
{% endraw %}

사이트맵은 다국어 지원시 가장 큰 문제점중 하나입니다. 기본 페이지에 대해서만 `<loc>` 태그를 생성하기 때문이죠. 저는 그 대신 `site.languages`의 모든 언어에 대해 한 번씩 검사하도록 수정해주었고, 그중에서도 예를 들어 `lang: en`으로 설정된 파일로부터 자동으로 생성된 한국어 페이지와 같이 유효하지 않은 요소는 무시하도록 만들었습니다.

### **페이지에 언어 전환 버튼 추가하기**

{% raw %}
```liquid
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
{: file="_includes/lang_mode.html"}
{% endraw %}

필요하다면 위와 같은 코드로 원하는 곳에 언어 전환 버튼을 추가할 수 있습니다. 다만 개인적으로 제 블로그는 언어별 독점 콘텐츠랄 것도 없고, 제 페이지를 방문해주시는 분들이 굳이 다른 언어로 볼 필요가 없다고 생각해서 추가하지 않았습니다.

### **피드 내용 언어별로 구분하기**

{% raw %}
```
{% assign filtered_posts = site.posts | where: "lang", site.active_lang %}

{% for post in filtered_posts limit: 5 %}
  <entry> ... </entry>
{% endfor %}
```
{: file="feed.xml" }
{% endraw %}

피드도 언어별로 구별해주었습니다. `site.active_lang`와 일치하는 포스트만을 `filtered_posts`에 필터링하여 나타도록 변경해주었습니다. [한국어 피드](https://hyngng.github.io/feed.xml)와 [영어 피드](https://hyngng.github.io/en/feed.xml)를 비교해보면 서로 다르게 나타나는 것을 확인할 수 있습니다.

## **적용 화면**

![result-light](/2024-06-07-blog-polyglot-support/result-light.webp){: .light .border }
![result-dark](/2024-06-07-blog-polyglot-support/result-dark.webp){: .dark }

## **마치며**

다만 `jekyll-polyglot`은 기본적으로 유연하고 편리하다는 느낌보단 거추장스러운 느낌이 강합니다. 적용 과정이 빈말로도 쉽다고 할수는 없기 때문에 이럴거면 영어 전용 페이지를 별도로 개설해 관리하는게 낫지 않을까 싶기도 했네요. 그래도 페이지 구성 파일들을 공유 가능하고, 동일 웹 주소로 웹마스터도구, 애드센스, 애널리틱스 등을 별도로 관리해야 하므로 자체 다국어 지원 기능을 만들만한 것 같기는 합니다.