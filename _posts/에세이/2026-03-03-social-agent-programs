---
title: "사회복무 보조 프로그램들"

categories: [에세이]
tags: [에세이]
start_with_ads: true

toc: true
toc_sticky: true

date: 2026-02-02 00:00:00 +0900
last_modified_at: 2026-02-02 00:00:00 +0900
---

최근 1년간 이렇다 할 프로그램 개발기가 블로그에 올라온 적이 없습니다. 

혹시나 문제가 될까봐 걱정되어서이기도 했고, 한 번에 모아서 정리하는 것이 더 깔끔할 것 같기도 하기 때문이었습니다.

## **음주측정 매크로 프로그램**

### **만들게 된 배경**

> [이곳의 글](https://hyngng.github.io/social-agent-logs)을 먼저 읽어보시면 맥락을 더 잘 이해할 수 있습니다!
{: .prompt-info }

2024년 7월 사회복무가 시작되고, 넘겨받은 음주측정부터 매크로 프로그램을 만들었습니다.

인수인계받은 업무 순서
: 1. 인천교통공사 웹메일에 접속하고, 음주측정 메일함으로 이동한다.
2. 수신된 메일을 하나하나 열어보며, `홍길동 (honggildong@email.com)` 형식의 텍스트 또는 함께 첨부된 이미지로부터 성함을 찾아 메모장에 기록한다.
4. 모두 기록했으면 지정된 엑셀 파일에 기록하고, 본인의 근무일에 음주측정 메일 발송을 하지 않은 분들에 대해 문자를 발송한다.

### **만든 프로그램**

파이썬과 `selenium` 라이브러리를 이용해 자동화 프로그램 `sabok-auto-umzu`를 만들었습니다. 회사 내 보안사항이 있어 코드를 공개하지는 못하지만, 필요한 부분만 간략히 설명하자면

```python
import frontend
import backend

def main():
    manager   = backend.Manager()
    extractor = backend.Extractor()
    interpter = backend.Interpter()
    writer    = backend.Writer()

    manager.initialize()
    writer.get_todays_notepad()
    extractor.load_page()

    try:
        while True:
            able_to_go = extractor.check_date_validity()

            if not able_to_go:
                number = backend.len_of_people
                print(f"프로그램이 정상적으로 종료되었습니다. {number}명 이름을 수집했습니다.")
                break
            else:
                extractor.get_name_from_page()
                writer.write_names_to_notepad()
                extractor.go_to_next_page()
    finally:
        backend.driver.quit()

if __name__ == "__main__":
    main()
```
{: file="main.py" }

이 때 당시의 목표는 '문장처럼 읽으면 읽어지는 코드'였습니다. 그래서 `manager.initialize()`, `writer.get_todays_notepad()`, `extractor.load_page()` 와 같이 작성했습니다.

- `frontend.py`는 PyQt로의 변환을 염두해두고 만든 모듈이었지만, 한 달이 채 지나기도 전에 새 사회복무요원이 들어오게 되었고 유지보수의 필요가 없어졌다고 생각함에 따라 방치되었습니다.
- `backend.py`는 모든 로직을 담당합니다.

이 때의 설계는 제어권을 갖는 `main.py`가 있고, 이곳에서 필요에 따라 여러 모듈을 불러오면서 사용한다는 아키텍처를 목표로 하고 있었습니다.

당연히 프론트엔드와 백엔드 역할을 나눌 필요는 없었습니다. 다만 제가 당시 두 개념에 익숙해져 있었고, 파이썬에서 코드 분리를 실험해보고 싶었기 때문입니다.

### **개발 과정에 대한 복기**

```text
sabok-auto-umzu/
├── assets/
│   └── img/
│       └── logo.png
├── docs/
│   └── CHANGELOG.md
├── main
│   ├── backend.py
│   ├── frontend.py
│   └── main.py
├── LICENSE
└── README.md
```

사실 이 정도로 파일 분리가 필요하지는 않았으므로 좋은 구조는 아니지만, 직전까지 객체지향과 SOLID 원칙, 그리고 제 블로그 테마 [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy)의 파일 구조에 빠져 있던 덕에 파일 분리를 먼저 강행했습니다. 직전까지 `C#`만을 다뤄오고 있었기 때문에, 당시에 파이썬은 [주식 자동매매 프로그램](https://hyngng.github.io/posts/making-astp/) 이후로 정말 오랜만에 접하는 언어였습니다.

신기하게도, 프로그램 유지보수가 무거워졌습니다. 원활한 유지보수를 위해 유지보수가 쉬운 구조로 힘들게 만들었더니, 유지보수가 어려워졌습니다. 그런데 원인이 객체지향이나 SOLID 원칙이 잘 구현되지 못해서가 아닙니다.

프로그램이 수행하는 작업향에 비해 너무 복잡한 구조를 갖고 있기 때문입니다. 좋은 유지보수를 위한 아키텍처는 프로그램 규모가 클 때 빛을 발하지, 단순한 계산기 프로그램 등에서 효과를 볼 수 있는 것이 아닙니다. 그리고, `sabok-auto-umzu`는 요구받은 작업이 크지 않습니다. 이전까지는 유지보수성을 1순위로 고려하는 것이 더 수준높고 의미있는 프로그램을 작성할 수 있는 길인줄 알았고, 이 경험으로 그게 아니라는 점을 알게 되었습니다.

## **근무표 관련은 가능**

## **피그마 디자인도 가능**

## **통행료 경우의 수 구하기**

## **확정운행실적 관련? 이건 되나?**








