---
title: "깃허브 블로그 테마 업데이트하기"

categories: [블로그]
tags: [깃허브, 업데이트, Chirpy]
start_with_ads: true

toc: true
toc_sticky: true

date: 2024-05-12 11:32:00 +0900
last_modified_at: 2025-10-20 13:55:00 +0900
---

## **들어가며**

제가 사용중인 Chirpy 테마는 꾸준히 관리되며 주기적으로 업데이트되고 있습니다. 저는 심심할 때 가끔 [업데이트 내역](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/docs/CHANGELOG.md)을 찾아보고는 하는데, 이번에 확인해보니 마침 어제자로 버전이 `7.0.0`로 올라가며 몇 가지 개선점과 신기능이 생겼습니다.

이번 버전으로 오면서 로컬 비디오 및 오디오 파일 삽입이 가능해졌고 프론트매터에서 `description` 작성을 정식 지원하게 되었습니다. [GoatCounter](https://www.goatcounter.com/)를 이용해 포스트 조회수를 측정할 수 있도록 바뀌었다는 점도 눈에 띕니다.

{% comment %}
마침 요즘 블로그의 여러 기능을 하나하나 써보는 재미에 맛들렸는데 때마침 이런 신기능을 넣어주면 궁금해서 참을 수가 없습니다. 이전까지는 큰 변화점이 없어서 업데이트를 미루고 있었는데, 이번 기회에 바로 업데이트해주었습니다.
{% endcomment %}

## **업데이트**

> 먼저 파일을 백업해두시는 것을 권장합니다!
{: .prompt-warning }

깃허브 블로그가 타 블로그 플랫폼 대비 서비스 제공자와의 결합도가 낮은 만큼 업데이트 과정은 단순히 기존 폴더에 새 파일과 코드를 가져오는 것이라고 생각하면 편합니다. 그간 업데이트된 코드를 내 저장소로 병합(Merge)하는 것이 전부이기 때문입니다. 그래서, 먼저 깃을 통한 병합 과정을 겪어보신 분들께는 어렵지 않을 수 있습니다.

제 경우 [테마를 꾸미면서](https://hyngng.github.io/posts/first-blog-customization/) `_data/locales/ko-KR.yml`{: .filepath }의 한국어 번역 내역을 자체적으로 개선하고, 사이드바 아이콘의 유형과 크기를 변경하고, 글 미리보기 제목을 따로 볼드체로 처리하는 등 여러 자잘한 작업을 해두었는데 이런 변경사항은 당연히 공식적으로 반영되지 않기 때문에 업데이트가 있을 때마다 수정된 코드를 외과수술 하듯이 하나하나 확인하며 보존해야 합니다. [공식 업그레이드 가이드](https://github.com/cotes2020/jekyll-theme-chirpy/wiki/Upgrade-Guide)에서도 "Please be patient and careful to resolve these conflicts"라며 인내심을 가지고 작업할 것을 안내하고 있습니다.

### **자동 병합**

```bash
git remote add upstream https://github.com/cotes2020/jekyll-theme-chirpy.git
```
{: .nolineno }

저는 만약의 경우를 위해 깃 저장소를 한 번 더 등록하는 것으로 시작했습니다. 필수사항은 아닙니다.

```bash
git fetch upstream
git merge remotes/upstream/master
```
{: .nolineno }

다음엔 Chirpy의 `master` 브랜치와 병합해주었습니다. 병합되는 파일 버전은 [이곳](https://github.com/cotes2020/jekyll-theme-chirpy/tags)에 등록된 최신 태그로 확인이 가능하며, 글을 쓰는 이 시점에서 당연 `v7.0.0`으로 확인됩니다. 중간에 문제가 없었다면 깃이 가능한 것 위주로 자동병합이 이루어지고 깃이 할 수 없는 나머지 병합사항을 수동으로 이어 진행해주어야 합니다.

### **수동 병합**

![merge-light](/2024-05-12-blog-update/merge-light.webp){: .light .border }
![merge-dark](/2024-05-12-blog-update/merge-dark.webp){: .dark }
_정보 페이지 작성화면. 위아래 둘 중 하나를 남겨 충돌을 해결함._

저의 경우 이어서 VsCode로 수동 병합을 진행했습니다. 혹시나 이 방식으로의 병합이 처음이신 분들을 위해, 내 코드를 보존하고 싶다면 `Accept Current Change`를, 새 코드로 대체하고 싶다면 `Accept Incoming Change`를 선택하면 됩니다. 한 번 선택하면 시간이 지나고 되돌리기 어렵기 때문에 천천히 살펴보는게 좋습니다.

제가 전까지 사용하던 버전은 `6.3.1`이었는데 그사이 변경점도 수두룩하고 제가 따로 수정한 부분도 적지 않아서 하나하나 천천히 확인했습니다. 다행히도 `/* region 수정됨 */`과 같은 식으로 주의가 필요한 부분을 주석으로 표시해두었기 때문에 약 30분 정도로 엄청 오래 걸리진 않았습니다.

```bash
npm run build
```
{: .nolineno }

병합이 끝나면 CSS와 자바스크립트 파일을 컴파일해줍니다. 번거롭더라도 수동으로 해주어야 합니다.

```bash
git add assets/js/dist _sass/vendors -f
```
{: .nolineno }

그리고 생성된 파일을 깃 저장소로 추가해준 뒤 푸시하면 끝입니다.

여기까지 완료되었다면 마지막으로 `bundle exec jekyll s` 명령어로 로컬 서버를 열어서 서버가 제대로 열리는지, 페이지에 문제는 없는지 확인해주어야 합니다. 빠트린 병합 사항이 있을 수도 있고 병합이 잘못 이루어져서 페이지의 어딘가가 망가졌을 수도 있기 때문입니다. 만약 그런 부분이 있다면 시간이 좀 걸리더라도 천천히 해결해줍시다.

### **적용 확인**

{%
  include embed/video.html
  src='/2024-05-12-blog-update/video/240410-232136.mp4'
  title='비디오 샘플. 현재 개발중인 게임 플레이샷입니다.'
%}

{%
  include embed/audio.html
  src='/2024-05-12-blog-update/audio/eating-chips.mp3'
  title='오디오 샘플. 바삭바삭한 과자 먹는 소리입니다.'
%}

## **마치며**

업데이트가 끝났습니다! `7.0.0`에서 추가된 기능인 비디오, 오디오 모두 잘 나옵니다. 다만 막상 적용된 모습을 보니 비디오의 경우 유튜브 임베딩을 이용하는 것이 더 깔끔하지 않을까 싶은데, 이걸 어디에 사용할지는 천천히 고민해봐야겠습니다.

하여튼, 평소에 밀린 수정사항이 확실히 많이 쌓여 있었기도 하고, 언제 한 번 테마 버전을 업데이트해두고 싶었는데 이번에 처음치고 잘 마무리되어 만족스럽습니다. 한 번 해보니 크게 어려운 것 같지 않기도 하고, 앞으로는 간간히 관리해줘야겠습니다 😊