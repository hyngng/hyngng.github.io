---
title: "깃허브 블로그에서 특정 태그 내용 제거하기"
description: "Chirpy 테마의 깃허브 블로그에서 특정 태그의 내용을 코드로 제거하는 방법을 정리합니다."

categories: [블로그]
tags: [깃허브, 블로그, HTML, 커스텀, 커스터마이징, Chirpy]
start_with_ads: true

toc: true
toc_sticky: true

date: 2024-03-21
last_modified_at: 2024-03-25
---

## **들어가며**

Chirpy 테마는 깔끔하고 단정하지만 순정으로 사용하다보면 개선 여지가 간혹 보입니다. **[몇 가지 사항](https://hynrng.github.io/posts/first-blog-customization/)**은 전에 수정해주었지만 거슬리는 점이 여전히 남아있었죠.

![before-light](/2024-03-21-blog-content-remove/before-light.png){: .light .border }
![before-dark](/2024-03-21-blog-content-remove/before-dark.png){: .dark }
_수정 전 블로그 홈에 표시되는 포스트 요약본_

그 중 하나는 블로그 홈의 글 요약본이 이미지 캡션이나 헤더 등을 포함한 날것의 상태 그대로 보인다는 겁니다. 위처럼 이미지 캡션이나 "들어가며" 같은 필요없는 글이 섞인 채로 표시되고 있죠. 이런건 당연히 처리가 되어있어야 하는게 아닌가 싶은데, 이번에 방법을 찾아서 수정해주었습니다.

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

깃허브 블로그 홈에 대한 내역은 `_layouts/home.html`{: .filepath }에 작성되어 있습니다. 이 파일을 열어보면 `<div class="card-text content mt-0 mb-3">` 단락에서 포스트 요약본에 작성될 글을 생성하는 것을 볼 수 있는데, 순정 코드는 Chirpy 테마 버전에 따라 다를 수 있으나 저의 경우 위와 같이 작성되어 있었습니다.

코드를 보니 `markdownify`와 `strip_html` 정도만 주어졌을 뿐 별다른 처리가 되어있지 않습니다. Ruby나 Liquid에 대해서는 배경지식이 없어 방법을 찾느라 조금 고생했는데, 결과적으로는 아래의 코드를 추가해주었습니다.

## **코드 작성**

{% raw %}
```liquid
{% assign cleaned_content = content %}

{% if content contains '<h1' %}
    {% assign cleaned_content = cleaned_content | remove_h1_tag %}
{% endif %}

{% if cleaned_content contains '<em' %}
    {% assign cleaned_content = cleaned_content | remove_em_tag %}
{% endif %}

{% assign cleaned_content = cleaned_content | replace: '들어가며', '' %}
{% assign cleaned_content = cleaned_content | replace: '스포일러가 있습니다!', '' %}

{{ cleaned_content | markdownify | strip_html | truncate: 200 | escape }}
```
{: file="_layouts/home.html" }
{% endraw %}

```ruby
# remove-tags.rb
module Jekyll
    module RemoveEmTagFilter
        def remove_h1_tag(input)
            input.gsub(/<h1>.*?<\/h1>/m, '')
        end
        
        def remove_em_tag(input)
            input.gsub(/<em>.*?<\/em>/m, '')
        end
    end
end

Liquid::Template.register_filter(Jekyll::RemoveEmTagFilter)
```
{: file="_plugins/remove-tags.rb" }

Ruby나 Liquid에 대해서는 배경지식이 없어 방법을 알아내느라 조금 고생했는데, 처음에는 split과 join으로 문제를 해결하려고 해도 제가 원하는 결과물이 도통 나오질 않더라구요. 좋은 방법이 아닌 것 같기도 하고요.

그래서 결과적으로는 위와 같은 코드를 작성했습니다. h1태그와 em태그를 찾아 태그 내부 텍스트를 제거하고, 블로그 글마다 반복되는 "들어가며", "스포일러가 있습니다!" 등의 일부 텍스트는 수동으로 직접 제거하도록 했어요.

코드에 사용되는 `remove_h1_tag`, `remove_em_tag` 등의 함수는 `_plugins`{: .filepath }라는 폴더에 `remove-tags.rb`{: .filepath } 파일을 만들어 커스텀 루비 함수를 작성했습니다. 정규 표현식을 이용해 `<h1>`와 `<em>` 태그로 묶인 텍스트를 빈 문자열로 치환하도록 했습니다.

## **개선 확인**

![after-light](/2024-03-21-blog-content-remove/after-light.png){: .light .border}
![after-dark](/2024-03-21-blog-content-remove/after-dark.png){: .dark }
_코드 적용 후 개선된 포스트 요약본_

코드를 작성하니 잘 동작합니다. 수정 전과 비교하면 불필요한 글이 제거되면서 글 요약본의 가독성이 대폭 개선되었어요. 수정 전의 난해한 느낌이 사라지고 훨씬 자연스러워졌습니다.

그나저나 깃허브 블로그 테마 커스터마이징 하나만을 위해 거들떠도 안 보던 Ruby나 Liquid를 조금 배우게 되었는데, 보다보니 어렵지 않게 금방 배울 수 있는 언어라는 생각이 들었습니다. 조금 더 익숙해져서 여러가지 커스터마이징을 할 수 있으면 좋겠네요.