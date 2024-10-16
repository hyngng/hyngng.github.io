---
title: 깃허브 블로그 웹마스터도구 등록부터 SEO 최적화까지

categories: [블로그]
tags: [블로그, 웹마스터도구, SEO 최적화]
start_with_ads: true

toc: true
toc_sticky: true

date: '2024-05-23 11:53:00 +0900'
last_modified_at: '2024-10-12 09:40:00 +0900'

mermaid: true
---

## **들어가며**

1년 넘게 블로그를 개인 기록용으로 딥 웹에 가깝게 운영하다가 올해 초에 검색엔진에 등록해주었습니다. 놀랐던 점은 티스토리나 네이버 블로그의 경우 별도로 신청을 하지 않더라도 메이저 플랫폼에서 색인을 생성해 검색결과에 노출해주지만, 깃허브 블로그와 같은 개인 사이트의 경우 그런 과정의 첫 발돋움은 수동으로 해주어야 한다는 겁니다.

![search-console](/2024-05-23-webmasters-and-seo/search-console.webp){: .w-75 }
_대표적인 웹마스터도구, 구글 서치 콘솔_

한국 포털사이트 점유율 순으로 [구글 서치 콘솔](https://search.google.com/search-console/)과 [네이버 서치어드바이저](https://searchadvisor.naver.com/), [다음 웹마스터도구](https://webmaster.daum.net/), [빙 웹마스터도구](https://www.bing.com/webmasters?lang=ko) 총 4가지 플랫폼에 등록해주었습니다. 특이한 점이 있다면 사이트별로 도메인 등록 후 실제 검색결과에 노출되기까지의 시간이 천차만별이었다는 건데, 3월 20일 즈음에 도메인을 신청하고나서부터 다음은 약 하루, 구글은 약 2주, 네이버와 빙은 약 3주 정도의 시간이 지나고 나서야 노출이 되기 시작했습니다.

> **2024/05/25 수정!**  
추가적으로 [핀터레스트 비즈니스 허브](https://www.pinterest.co.kr/business/hub/)에도 등록해주었습니다. 사이트 소유권이 확인되면 RSS 기반으로 이미지를 수집하여 핀을 생성해줍니다.
{: .prompt-info }

결과적으로 현재 모든 플랫폼에서 `site:hyngng.github.io` 검색어 입력 시 블로그 노출이 확인되는 상태입니다. 만약 저처럼 웹마스터도구에 개인 사이트를 등록하고싶으신 분이 계시다면 다음을 참고하시면 도움이 될 것 같습니다.

### **구글 서치 콘솔**

- 깃허브 블로그에서 HTML 태그를 통한 사이트 소유권 인증은 `_includes/head.html`{: .filepath }에 작성해도 문제는 없지만, `jekyll-seo-tags` 플러그인에서 관련 기능을 지원하고 있기 때문에 `_config.yml`{: .filepath }의 `webmaster_verifications` 값을 수정하는 것이 편할 수 있습니다.

### **네이버 서치어드바이저**

- 네이버 서치어드바이저의 경우 아톰(Atom) 유형의 피드를 제출할 수 없기 때문에 RSS 피드를 따로 만들어 등록해주어야 합니다. 작성된 파일 예시는 [제 깃허브](https://github.com/hyngng/hyngng.github.io/blob/main/assets/rss.xml)에서, 제 블로그에서의 예시 동작은 [이곳](https://hyngng.github.io/rss.xml)에서 확인해볼 수 있습니다.

### **다음 웹마스터도구**

- [검색등록 신청 사이트](https://register.search.daum.net/index.daum)와 [웹마스터도구](https://webmaster.daum.net/)가 나뉘어져 있습니다. 처음 사이트 등록은 검색등록 신청 사이트에서, 사이트 등록 이후 사이트맵과 피드는 웹마스터도구에서 따로 제출해야 합니다.
- 검색결과에 사이트 등록이 완료되더라도 신생 웹사이트의 경우 파비콘이 노출되지 않습니다. [고객센터](https://cs.daum.net/)에 문의해봤으나 _"파비콘 수집 기준은 정책상 자세히 공개할 수 없다"_ 라는 답변을 받았습니다. 찜찜하지만 개인 차원에서 할 수 있는 일은 없는 듯 합니다.

### **빙 웹마스터도구**

- 구글 서치 콘솔에 사이트가 정상적으로 등록되어있다면 구글과 연결해서 그대로 사용할 수 있습니다. 제출한 사이트맵, 피드 등이 연동되며 사이트 소유권 인증도 건너뛸 수 있습니다.
- 빙 웹마스터도구도 파비콘이 노출되지 않는 문제가 있으나 [지원 팀에 문의](https://www.bing.com/webmasters/support)하면 친절히 해결해줍니다. 제 경우 문의를 보낸 후 이틀만에 파비콘이 정상적으로 노출되었습니다.

## **SEO 최적화**

블로그 검색등록을 신청하면서 처음 알게 된 개념입니다. SEO(검색 엔진 최적화)란 웹사이트나 웹페이지의 품질을 향상시켜 검색 엔진에서 더 잘 노출되고 상위에 노출되도록 하는 과정으로, [네이버](https://searchadvisor.naver.com/guide/seo-basic-intro)나 [구글](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ko)에서 발간한 공식 가이드가 있을 정도로 관심도가 높은 개념입니다.  
다만 저는 실제로 상위노출을 위한 작업보다는 블로그 검색노출을 신청하고 난 후 몇 개 웹마스터도구에서 SEO 경고를 받으면서 이를 해결하기 위한 과정이 주가 되었습니다. 구체적으로 어떤 경고를 어떻게 해결했는지 간단히 정리하겠습니다.

{% comment %}
### **robots.txt**
{% endcomment %}

### **webp을 이용한 이미지 최적화**

사이트 성능을 가늠해보기 위해 구글에서 제공하는 [PageSpeed Insights](https://pagespeed.web.dev/?utm_source=psi&utm_medium=redirect)로 페이지 성능을 측정해봤는데 휴대전화 카테고리에서 성능이 꽤 느린 편으로 결과가 나왔습니다. 함께 제공되는 결과 보고서를 읽어보니 수많은 권고사항 중 이미지 용량을 절감하라는 내용이 있어 이 부분을 개선해주었습니다.

저는 평소 [간간히 그린 그림](https://hyngng.github.io/posts/fifth-drawing/)이나 [사진 찍은 것들](https://hyngng.github.io/posts/photos-of-gyemyo/)을 블로그 포스트로 작성해 두는데, 이 이미지들은 평균 규격이 4000x3000에 확장자도 `.png` 또는 `.jpg`이기 때문에 용량이 그림의 경우 200KB~1MB, 사진의 경우 1~3MB 정도 가까이 되었습니다. 다른 글에서 사용하는 이미지도 이 규격을 기준을 따랐기 때문에 용량이 작지 않았는데, 다른 웹사이트를 참고해보니 100KB 이하의 저용량으로 처리한 경우가 많아 제 블로그도 비슷한 최적화 수준에 도달하기 위해 다음의 처리를 거쳤습니다.

1. 이미지 크기를 1/4로 줄였습니다. 4000x3000 규격의 경우 2000x1500 규격으로 조정했습니다.
2. `.gif` 및 `.jpg`, `.png` 확장자 파일을 손실압축을 거쳐 `.webp` 확장자로 인코딩했습니다.

![before-after](/2024-05-23-webmasters-and-seo/before-after.webp)
_용량 축소 과정을 거치기 이전과 이후의 이미지._

왼쪽이 원본, 오른쪽이 다운스케일 후 `webp`로 인코딩을 거친 파일인데 사진 품질에 치명적인 차이가 없으면서도 용량이 각각 1.79MB와 83.7KB로 약 20배에 달하는 엄청난 차이가 있습니다. 모든 파일에 이렇게 드라마틱한 차이가 있는 것은 아니지만, 대부분은 확실한 용량 절감 효과를 보여주었습니다. 효과가 좋아 다른 포스트의 이미지 파일에도 비슷한 처리를 해주었어요.

다만 품질이 떨어지는 이미지를 사용하는 것이 어찌됐건 아쉽기는 해서, 그림이나 사진의 경우 _"이미지 원본은 제 깃허브에서 확인할 수 있습니다!"_ 와 같은 문구를 포스트 끝부분에 추가하여 원하는 경우 원본 이미지로 연결될 수 있도록 만들었습니다.

### **2개 이상의 H1 태그 중복 해결**

네이버와 빙 웹마스터도구에서 지적받은 사항입니다. 웹 콘텐츠 접근성 지침(WCAG)에 따르면 웹 페이지는 최대 한 개의 h1 태그를 포함해야 하는데 제 블로그의 경우 왼쪽 사이드바에서 사이트 제목과 글 제목이 모두 `<h1>`로 처리되고 있었습니다.

{% raw %}
```liquid
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
{: file="_includes/sidebar.html" }
{% endraw %}

수정된 코드입니다. 글 제목보다는 사이트 제목의 헤더 태그를 낮추는 것이 좋을 것 같아 `site.title` 제목이 표시되는 코드를 수정했습니다. 루트 URL에서는 h1로, 이외의 URL에서는 h2로 표시되는 식으로 변경했습니다.

크롬 개발자 도구로 확인해보면 블로그 홈에서는 h1로, 현재 페이지에서는 h2로 표시됩니다. 적용 후 수정이 이루어진 URL을 다시 제출했고, 이틀 후 네이버와 빙 웹마스터도구의 사이트 진단 페이지를 통해 오류가 수정되었음을 확인할 수 있었습니다.

### **meta description 자동 생성**

> **24/05/28 추가됨!**  
실질적인 해결 방법만 보고 싶다면 9월 25일자로 수정된 하단의 내용으로 이동해주세요!
{: .prompt-info }

빙 웹마스터도구에서 지적한 사항입니다. 제 블로그의 많은 글에서 사용하는 "들어가며" 도입부가 여러 페이지의 description으로 중복 등록된 것이 문제가 되어 프론트매터에 개별 description을 작성해주었지만, 20자 정도 분량으로 작성하니 _"너무 길거나 짧은 Meta Description"_ 라는 오류 안내문이 발생하고 있었습니다.

description의 적절한 길이는 25~160자로 안내되고 있습니다. 매 페이지마다 글자수를 맞춰가며 25자 이상의 분량을 작성하는 것은 너무 번거롭기 때문에 description을 자동으로 생성하는 코드를 작성했습니다.

{% raw %}
```cs
<html lang="{{ page.lang | default: site.alt_lang | default: site.lang }}" {{ prefer_mode }}>
  {% include head.html post_content = content %}
  ...
```
{: file="_layouts/default.html" }
{% endraw %}

{% raw %}
```liquid
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
{: file="_includes/head.html" }
{% endraw %}

구현 과정이 조금 골치아팠습니다. description을 포함한 메타 태그는 `jekyll-seo-tag` 플러그인을 통해 먼저 일괄 생성되므로, 생성된 `seo_tag` 중 description을 오버라이딩 하는 식으로 구현했습니다. 구현 도중 `head.html`{: .filepath }을 포함한 `_includes`{: .filepath } 폴더의 파일은 페이지 콘텐츠에 접근할 수 없는 문제가 있었으나 `_layouts/default.html`{: .filepath }에서 `content`를 조달해 사용하는 식으로 보완했어요.

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
{: file="_plugins/content_filter.rb" }

`content`는 `content_filer`라는 커스텀 루비 플러그인을 거치는데, 제목, 게시일, 글쓴이 및 "들어가며" 도입부 등 description으로서 필요 없는 정보를 어느정도 제거하기 위함입니다. 글 본문이 모두 `<div class="content"></div>` 태그에 하달되는 점을 이용했으며, [예전에 비슷한 코드를](https://hyngng.github.io/posts/blog-content-remove/) 구현해본 적이 있었지만 아직 익숙하지 않아서 이 부분은 GPT의 조언을 구했습니다.

> **24/09/25 수정!**
{: .prompt-info }

사실 위의 내용은 겉핥기식 해결책으로 새로 생성된 description이 {% raw %}`{{ seo_tags }}`{% endraw %}의 description과 중복되는 문제가 있습니다. 저는 보다 근본적인 해결책을 원했고, [jekyll-seo-tag](https://github.com/jekyll/jekyll-seo-tag/tree/master) 플러그인에서 meta description을 생성하는 부분 자체를 찾아 아래와 같이 수정했습니다.

{% raw %}
```liquid
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
{: file="jekyll-seo-tag/lib/template.html" }
{% endraw %}

```ruby
gem 'jekyll-seo-tag', git: 'https://github.com/hyngng/jekyll-seo-tag.git', branch: 'master'
```
{: file="Gemfile" }

변경된 코드는 페이지 레이아웃에 따라 `_config.yml`에 작성된 description을 불러오거나 또는 포스트 콘텐츠로부터 meta description을 생성합니다. 저는 이 깃허브 프로젝트를 [개인 레포지토리](https://github.com/hyngng/jekyll-seo-tag)로 fork한 뒤 별도로 수정해서 `Gemfile`에 아래와 같이 불러와 사용하고 있으며, 이 방법이 제가 찾을 수 있는 가장 깔끔한 해결책입니다.

{% comment %}
### **이미지 CDN 변경**

- CDN는 Statically 이용. jsdelivr는 이미지 CDN용이 아니기도 하고, 속도가 조금 느렸음.
    - GitHub 레포지토리 연결이 되고, 공식적으로 이미지 CDN으로 사용할 수 있고, 무료임.
    - SEO를 위해
    - 이거 안 쓰기로 함. mp3 및 mp4 지원 안됨.
{% endcomment %}

## **마치며**

검색노출 신청부터 SEO 최적화까지 부랴부랴 작업해주었지만 얼마나 효과가 있을지는 잘 모르겠습니다. 다만 제 블로그는 홍보나 남에게 필요한 정보를 생산하는 공간보다는 개인기록용 성격이 더 강하기도 해서, 검색노출 관리는 해주되 크게 신경쓰지는 않으려고 합니다. 다만 웹마스터도구도 그렇고, 블로그가 좀 안정되면 호기심 차원에서 다음에는 구조화된 데이터 마크업을 적용해보고 싶습니다.