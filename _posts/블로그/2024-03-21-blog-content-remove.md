---
title: "깃허브 블로그에서 특정 태그 내용 제거하기"

categories: [블로그]
tags: [블로그, 커스터마이징, Chirpy, Liquid]
start_with_ads: true

toc: true
toc_sticky: true

date: 2024-03-21 19:32:00 +0900
last_modified_at: 2024-04-24 17:24:00 +0900
---

## **들어가며**

Chirpy 테마는 깔끔하고 단정하지만 순정 상태에서는 이건 개선이 필요하겠다 생각이 드는 부분이 간혹 보입니다. [간간히 수정](https://hyngng.github.io/posts/first-blog-customization/)해주고는 있지만 개인적으로 아쉬운 점이 여전히 몇 가지 남아있었죠.

![before-light](/2024-03-21-blog-content-remove/before-light.webp){: .light .w-75 .border }
![before-dark](/2024-03-21-blog-content-remove/before-dark.webp){: .dark .w-75 }
_수정 전 블로그 홈에 표시되는 포스트 요약본_

그 중 하나는 블로그 홈의 글 요약본이 이미지 캡션이나 헤더 등을 포함한 날것 그대로 보인다는 겁니다. 위처럼 이미지 캡션이나 "들어가며" 같은 불필요한 부분이 같이 표시되어 가독성이 나빠지고 있죠. 이런건 당연히 기본 처리가 되어있어야 하는게 아닌가 싶은데, 이번에 방법을 찾아서 수정해주었습니다.

## **원인 파악**

{% raw %}
```liquid
<div class="card-text content mt-0 mb-3">
  <p>
    {% include no-linenos.html content=post.content %}
    {{ content | markdownify | strip_html | truncate: 200 | escape }}
  </p>
</div>
```
{: file="_layouts/home.html" }
{% endraw %}

깃허브 블로그 홈에 대한 내역은 `_layouts/home.html`{: .filepath }에 작성되어 있습니다. 순정 코드는 저의 경우 위와 같이 작성되어 있었으며, `<div class="card-text content mt-0 mb-3">` 단락에서 포스트 요약본을 생성하고 있습니다.

코드를 살펴보니 콘텐츠는 단순히 `markdownify`와 `strip_html`만을 거쳐 텍스트로 표시되고 있습니다. 여기에 별도의 필터를 추가해 특정 태그를 제거하면 좋겠다는 생각이 들었고, 다음과 같은 과정을 거쳤습니다.

## **코드 작성**

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
{: file="_plugins/remove-tags.rb" }

{% raw %}
```liquid
<div class="card-text content mt-0 mb-3">
  <p>
    {% include no-linenos.html content=post.content %}
    {{ cleaned_content | markdownify | remove_tag: 'h2', 'em', 'blockquote'
                                     | strip_html | truncate: 200 | escape }}
  </p>
</div>
```
{: file="_layouts/home.html, _includes/related-posts.html" }
{% endraw %}

Ruby나 Liquid에 대해서는 배경지식이 없어 방법을 알아내느라 조금 고생했습니다. 처음에는 Liquid만으로 `split`과 `join`을 이용해 해결하려고 했는데 제가 원하는 결과물을 만들기 힘들었습니다. 좋은 방법이 아닌 것 같기도 하고요.

그래서 결과적으로 GPT의 도움을 받아 `_plugins/remove-tags.rb`{: .filepath } 경로로 Ruby 파일을 만들어 이용하는 것으로 해결했습니다. Ruby 파일에는 태그 유형을 매개변수로 받아 내부 텍스트를 정규 표현식으로 제거하는 함수를 만들었습니다. `Nokogiri`라는 파싱 라이브러리를 이용했고, Liquid 파일에서 `remove_tag: 'h2', 'em', 'blockquote'`와 같이 사용됩니다.

> **2024/04/24 수정!**  
`_includes/related-posts.html`{: .filepath } 및 `assets/js/data/search.json`{: .filepath } 파일도 같이 수정하는 것을 권장합니다. 각각은 같은 카테고리의 다른 글과 검색결과에서의 포스트 요약본을 생성합니다.
{: .prompt-info }

## **개선 확인**

![after-light](/2024-03-21-blog-content-remove/after-light.webp){: .light .w-75 .border}
![after-dark](/2024-03-21-blog-content-remove/after-dark.webp){: .dark .w-75 }
_코드 적용 후 개선된 포스트 요약본_

코드를 작성하니 잘 동작합니다. 수정 전과 비교하면 불필요한 글이 제거되면서 글 요약본의 가독성이 대폭 개선되었습니다. 수정 전의 난해한 느낌이 사라지고 훨씬 자연스러워졌고, 추가적으로 제거를 원하는 태그는 `remove_tag:` 뒤에 추가해주면 되기 때문에 사용도 간단합니다. 앞으로 적절히 잘 사용해야겠어요.