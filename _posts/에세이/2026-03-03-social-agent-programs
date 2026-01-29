---
title: "사회복무 보조 프로그램들"

categories: [에세이]
tags: [에세이]
start_with_ads: true

toc: true
toc_sticky: true

date: 2026-01-29 00:00:00 +0900
last_modified_at: 2026-01-29 00:00:00 +0900
---

최근 1년간 이렇다 할 프로그램 개발기가 블로그에 올라온 적이 없습니다. 

혹시나 문제가 될까봐 걱정되어서이기도 했고, 한 번에 모아서 정리하는 것이 더 깔끔할 것 같기도 하기 때문이었습니다.

## **음주측정 매크로 프로그램**

### **만들게 된 배경**

> [이곳의 글](https://hyngng.github.io/social-agent-logs)을 읽어보고 오시면 더 좋습니다!
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

## **근무평정서와 각종 명세서 발송**

### **만들게 된 배경**

{% comment %}
경제학과 아니고 경영학과임 ㅋ
{% endcomment %}

> `sabok-auto-message`

자리에서 사무실 번호로 문자를 보낼 때는 [KT 스마트메시지 Plus](https://smartmessage.plus.kt.com/)라는 서비스를 이용했습니다.

제가 맡게 된 업무 중에는 매달 300명의 운전원에게 각자에 대한 명세서를 발송하는 작업이 있었습니다. 얼핏 보면 쉬울 것 같지만, 부서가 놓인 환경을 고려하면 몇 가지의 어려움이 있습니다.

제 이전의 한 사회복무요원이 파이썬으로 만든 매크로 프로그램이 이미 있었지만, `selenium` 특성상 여러가지 문제가 있었고 제 성에 차지 않았습니다.

다음의 문제가 있었습니다.

이걸 제게 인수인계한 사회복무요원은 경제학과를 전공하고 있었고, 컴퓨터를 잘 다룰줄 모르는 사람이었습니다. 자리에는 VsCode가 깔려 있었고 프로그램도 제 위치에 잘 있긴 했지만 




1. 전달받은 PDF 파일을 엣지 브라우저로 열기
2. 열린 창을 `Win + →` 단축키로 화면 오른쪽 절반을 차지하도록 설정
3. 빈 메모장을 열고 `Win + ←` 단축키로 화면 왼쪽 절반을 차지하도록 설정
4. 파이썬 프로그램 실행
    1. 마우스 커서가 지정된 좌표로 움직이며 사번 텍스트를 긁고, 클립보드에 복사함 
    2. 메모장에 포커스가 옮겨지고, 복사된 사번 텍스트를 메모장에 붙여넣음
    3. 끝 장에 도달할 때까지 위 과정을 반복
5. 
5. 파이썬 프로그램 실행
    1. KT 스마트메시지 Plus가 열리고, 아이디와 비밀번호 입력 후 터미널에 엔터 입력
    2. 

작업 과정이 깔끔하진 않습니다. 어느 정도는 그려려니 해도, 프로그램이 마우스를 직접 제어하기 때문에 어떤 조건이 잘못되어 프로그램을 종료하고 싶더라도 그럴 수 없다는 점, 프로그램이 정상적으로 동작중일 때 마우스를 조작해서는 안 된다는 점 등이 불편했습니다.

강하게 리팩토링을 하기로 했습니다.





조금 어처구니 없지만 명세서를 보낼 때마다 전화선(UTP 케이블)도 뽑으라고 인수인계했습니다. 기존에 있던 프로그램 동작은 이렇습니다.

먼저 제가 받게 되는 것은 약 300페이지에 달하는 PDF 파일입니다. 이 파일에는 모든 운전원에 대한 정보가 담겨있고,










- `NoSuchElementException`
- `ElementNotInteractableException`
- `StaleElementReferenceException`

`selenium`을 다루어본 분이라면 눈에 익은 메시지일 것 같습니다. `Wait`을 써도 되지만, 






KT 스마트메시지 Plus는 포토메시지 발송 기능이 있지만 제한이 많습니다.

1. 이미지 파일은 300KB를 넘어서는 안 됩니다.
2. 한 번에 한 장의 이미지만 보낼 수 있습니다.

KT에서 혹시나 API를 따로 지원하는지 찾아봤는데, 없었습니다.

## **고객 지역 자동 채움**

### **만들게 된 배경**

일회성 프로그램이었습니다. 인천시청 택시운수과에서 요청했고, 부서 팀장님께서 받아들이면서 제게 전달된 업무입니다. 여러가지 복잡한 맥락에서, 협력업체의 시스템으로 관리되는 고객 데이터중에는 주소는 있으나 지역이 누락되어 있는 고객이 상당수 있었는데 시청이 이를 참조할 수 있도록 채워넣어달라고 요청했습니다.

다음과 같은 순서로 처리하라고 안내받았습니다.
1. 고객 주소를 네이버지도 또는 카카오지도에서 검색
2. 도로명주소 등으로 나오는 결과를 마우스로 긁어서 복사
3. 엑셀의 해당 행에 붙여넣기

그런데 처리가 필요한 건 수가 무려 7169건에 달했습니다. 업루량이 많으니 다른 사회복무요원과 나눠서 하라고는 했지만 그래도 인당 이천 개가 넘어가서, 이걸 손으로 모두 채우는 것은 정말 말도 안 되는 시간낭비라고 생각했고 제 방식대로 처리하기로 했습니다.

### **네이버 클라우드 플랫폼 API 이용**

![Group107-light](/2026-03-03-sabok-auto-filling/Group107-light.png){: .light .border }
![Group107-dark](/2026-03-03-sabok-auto-filling/Group107-dark.png){: .dark }
_지오코딩과 역지오코딩에 대한 네이버 클라우드 플랫폼 API 문서 스크린샷_

> 입력한 주소와 연관된 주소 정보를 검색합니다.

> 입력한 좌표 값을 주소 정보(법정동, 행정동, 지번 주소, 도로명 주소)로 변환합니다.

- [지오코딩](https://api.ncloud-docs.com/docs/ai-naver-mapsgeocoding-geocode)
- [역지오코딩](https://api.ncloud-docs.com/docs/ai-naver-mapsreversegeocoding-gc)

다만 해당 문서의 브레드크럼을 확인해보면 `홈 > AI·NAVER API > Maps (deprecated) > Maps 사용`으로 되어 있는 것을 볼 수 있습니다. 2025년 7월부로 네이버 API가 개편되어 현재는 해당 API가 사용이 불가능한 상태입니다. 이와 관련한 에피소드가 있는데, 후술하겠습니다.

각각 를 입력값으로 받아

입력값
: - `query`
- `coordinate`
- `filter`
- `language`
- `page`
- `count`

문서에서 안내되고 있듯, 터미널에 다음과 같이 작성해보면

```bash
curl --location --request GET "https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=테스트 메시지" ^
    --header "x-ncp-apigw-api-key-id: xxxxxxxxxx" ^
    --header "x-ncp-apigw-api-key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" ^
    --header "Accept: application/json"
```

결과가 전송됩니다.

먼저 데이터 정제가 필요합니다. 주소 정보가 좀 더럽기 때문인데, 예시를 들자면 다음과 같습니다.

|전동휠체어)XX구 XX동000 XXXA XX동 XXX호(XXX-XXXX)|
|X구 XX로XX번길 XX-X(XX동)|
|XX동)XX로XXX번길 X-X|
|휠체어) XX동 XXX-X XXX XXX동 XXX호|
|XX대로XXX번길 XX, X동 XXXX호 (XX동, XX아파트)|
|X/X XX읍 XX리 XXX-X|
|XX주공@XXX/XXX호 (거주지= XXX동 XXXX-X번지 XXX병원)|

### **Cursor와 바이브 코딩 트렌드 시도**

이것 외에도 다양한 형태가 있습니다. 예를 들어 단순 아파트명 이름도 "XXX아파트" 또는 "XXX@" 또는 "XXXA" 등 정해진 양식이 없어서 처리가 어려웠습니다. 이때는 한참 AI 에이전트, MCP와 같은 개념이 우후죽순으로 나오고 있었고 그 등에 기반한 Cursor 등 다양한 서비스가 출시되고 있던 때라 호기심에 온전히 바이브 코딩으로 만들어보기로 했습니다. 이 때 완성된 코드는 여러가지 문제로 사용되는 않았지만 파일은 남아 있습니다. Gemini Pro 2.5를 사용했고, 다음과 같은 느낌으로 작성되었습니다.

```python
def search_address(self, address):
    max_retries = 3  # 최대 재시도 횟수
    retry_count = 0
    retry_delay = 2  # 초기 재시도 대기 시간 (초)
    
    while retry_count <= max_retries:
        try:
            # 주소 정제
            cleaned_address = self.clean_address(address)
            
            # URL 인코딩
            encoded_address = quote(cleaned_address)
            url = f"{self.base_url}?query={encoded_address}"
            
            # API 요청 (제한 없음) - 타임아웃 설정 추가
            response = requests.get(url, headers=self.headers, timeout=(5, 10))  # 연결 5초, 읽기 10초 타임아웃
            
            # 디버깅용 응답 정보 (경합 방지를 위해 락 사용)
            with self.print_lock:
                print(f"주소: {cleaned_address} - API 응답 코드: {response.status_code}")
            
            # 응답 상태 코드 확인
            if response.status_code == 429:  # Rate limit 초과
                # 잠시 대기 후 재시도
                time.sleep(retry_delay)
                retry_count += 1
                retry_delay *= 2  # 지수 백오프 방식으로 대기 시간 증가
                continue
            elif response.status_code != 200:
                with self.print_lock:
                    print(f"API 오류 발생 (상태 코드: {response.status_code}): {response.text}")
                return "API 오류"
            
            # 응답 처리
            result = response.json()
            
            # 문서에 맞게 응답 검증 및 처리
            if result.get("status") == "OK" and result.get("addresses") and len(result["addresses"]) > 0:
                # 첫 번째 결과 사용
                address_info = result["addresses"][0]
                
                # addressElements에서 시/도, 시군구, 동/면 추출
                sido = None
                sigugun = None
                dongmyun = None
                
                for element in address_info.get("addressElements", []):
                    if "SIDO" in element.get("types", []):
                        sido = element.get("longName", "")
                    elif "SIGUGUN" in element.get("types", []):
                        sigugun = element.get("longName", "")
                    elif "DONGMYUN" in element.get("types", []):
                        dongmyun = element.get("longName", "")
                
                # addressElements에서 행정동(ADMNM) 추출
                hdong = None
                for element in address_info.get("addressElements", []):
                    if "ADMNM" in element.get("types", []):
                        hdong = element.get("longName", "")
                        break  # 첫 번째 행정동만 사용

                # 결과 생성 (행정동 우선 반환)
                if hdong:
                    return hdong
                # 기존 방식 유지 (시도, 시군구, 동/면)
                if sido and sigugun and dongmyun:
                    return f"{sido} {sigugun} {dongmyun}"
                elif sido and sigugun:
                    return f"{sido} {sigugun}"
                elif sido:
                    return sido
            
            # API에서 결과를 찾지 못함
            with self.print_lock:
                print(f"API에서 '{cleaned_address}'에 대한 결과를 찾지 못했습니다")
            return "매칭 실패"
            
        except requests.ConnectionError as e:
            with self.print_lock:
                print(f"연결 오류 발생: {str(e)}")
            retry_count += 1
            if retry_count <= max_retries:
                with self.print_lock:
                    print(f"재시도 중... ({retry_count}/{max_retries}) - {retry_delay}초 후 재시도")
                time.sleep(retry_delay)
                retry_delay *= 2  # 지수 백오프 방식으로 대기 시간 증가
            else:
                return "API 오류 (연결 실패)"
        except requests.Timeout as e:
            with self.print_lock:
                print(f"타임아웃 오류 발생: {str(e)}")
            retry_count += 1
            if retry_count <= max_retries:
                with self.print_lock:
                    print(f"재시도 중... ({retry_count}/{max_retries}) - {retry_delay}초 후 재시도")
                time.sleep(retry_delay)
                retry_delay *= 2  # 지수 백오프 방식으로 대기 시간 증가
            else:
                return "API 오류 (타임아웃)"
        except Exception as e:
            with self.print_lock:
                print(f"API 오류 발생: {str(e)}")
            return "API 오류"
```
{: file="main.py" }

엄청 나쁘진 않은데, 개인적으로는 전체적으로 불안정하다는 느낌을 받았습니다. 설명을 위한 주석의 남발은 물론이고, 무엇보다 제가 이 코드를 소유하고 있다는 느낌이 잘 들지 않았습니다. 다만 전체적인 흐름은 잘 참고해서, 다시 다음과 같이 작성했습니다.

### **법정동이 아닌 행정동으로**

> "보내주신 리스트를 기준으로 업데이트 하였으나 지역을 행정동이 아닌 법정동으로 주신 고객은 업데이트 되지 않았습니다"

사전에 안내받지 않았는데 고객 주소는 법정동이 아닌 행정동 형식으로만 등록 가능하다고 회신받았습니다.

결과값 검수용으로 [행정안전부 > 업무안내 > 자치혁신실 > 주민등록,인감 > 가장 최근 공고문](https://www.mois.go.kr/frt/bbs/type001/commonSelectBoardList.do;jsessionid=Sts__z7tpvlYn3TZmotdQirIgfYhYb4aRcMViuf6.node40?bbsId=BBSMSTR_000000000052)에서 `jscode.zip` 파일을 다운로드 받았습니다. 해당 압축 파일에는 `KIKcd_B_yyyymmdd.xlsx`, `KIKcd_H_yyyymmdd.xlsx`, `KIKmix_yyyymmdd.xlsx` 세 개 파일이 들어 있으며 B가 법정동, H가 행정동입니다. 예를 들어 두 자료가 혼합된 `KIKmix` 파일을 열어보면 2025년 11월 3일자 자료를 기준으로 다음과 같이 작성되어 있습니다.

|행정동코드|시도명|시군구명|읍면동명|법정동코드|동리명|생성일자|말소일자|
|---|---|---|---|---|---|---|---|
|1100000000|서울특별시|||1100000000|서울특별시|19880423||
|1111000000|서울특별시|종로구||1111000000|종로구|19880423||
|1111051500|서울특별시|종로구|청운효자동|1111010100|청운동|20081101||
|1111051500|서울특별시|종로구|청운효자동|1111010200|신교동|20081101||
|1111051500|서울특별시|종로구|청운효자동|1111010300|궁정동|20081101||
|1111051500|서울특별시|종로구|청운효자동|1111010400|효자동|20081101||
|1111051500|서울특별시|종로구|청운효자동|1111010500|창성동|20081101||

법정동은 법률로 지정된 행정구역의 공식 명칭이고 행정동은 행정상의 편의를 위해 나눈 이름입니다. 서울 강남의 동을 예시로 들자면 "논현1동", "일원본동" 등이 행정동이고, "논현동", "일원동"이 법정동입니다. 법정동명과 행정동명은 일치하는 경우도 있고, 행정동명이 법정동명에서 "1동"과 "2동", 또는 "제1동"과 "제2동"으로 나뉘는 경우도 있으며, 행정동명과 법정동명이 완전히 다른 경우도 있습니다.

### **다시 제대로 만들기**

```python
def get_region_from_address(address: str):
    url = f"{geocode_baseurl}?query={address}"
    headers = {
        "x-ncp-apigw-api-key-id": client_id,
        "x-ncp-apigw-api-key": client_secret,
        "Accept": "application/json"
    }

    try:
        geocoding_response = requests.get(url, headers=headers, timeout=(5, 10))
    except requests.exceptions.ConnectionError as e:
        print(f"Geocode 연결 오류: {e}")
        return None

    if geocoding_response.status_code != 200:
        return None

    if geocoding_response:
        data = geocoding_response.json()
        if data and 'addresses' in data and data['addresses']:
            first_address = data['addresses'][0]
            coord_x = first_address.get('x')
            coord_y = first_address.get('y')
        else:
            return None

    if not coord_x or not coord_y:
        return None

    reverse_params = {
        "coords": f"{coord_x},{coord_y}",
        "output": "json",
        "orders": "admcode"
    }
    try:
        reverse_geocoding_response = requests.get(reversegeocode_baseurl, headers=headers, params=reverse_params, timeout=(5, 10))
    except requests.exceptions.ConnectionError as e:
        print(f"Reverse geocode 연결 오류: {e}")
        return None

    if reverse_geocoding_response.status_code != 200:
        return None

    if reverse_geocoding_response:
        reverse_data = reverse_geocoding_response.json()
        if reverse_data and 'results' in reverse_data and reverse_data['results']:
            for result in reverse_data['results']:
                if result.get('name') == 'admcode':
                    region = result.get('region')
                    if region:
                        area1 = region.get('area1', {}).get('name', '')
                        area2 = region.get('area2', {}).get('name', '')
                        area3 = region.get('area3', {}).get('name', '')
                        area4 = region.get('area4', {}).get('name', '') # area4는 보통 리/가/구 등 세부 동 정보
                        full_name = f"{area1} {area2} {area3}"
                        if area4:
                            full_name += f" {area4}"
                        return full_name.strip()
    return None
```
{: file="main.py" }

`.xlsx`로 형식의 엑셀 파일 데이터를 `pandas` 데이터프레임 형태로 변환한 뒤

### **실수**

50만원 에반데

### **개발 과정에 대한 복기**

다른 사회복무요원의 의견의 영향을 받아 일부로 클래스를 사용하지 않았고, 코드 정돈에도 큰 신경을 쓰지 않았습니다. 빠른 처리도 중요했고







{% comment %}
2025-07-17

## **사회복무요원**

- 인천교통공사의 교통복지팀에 사회복무요원으로 있다보면 주로 반복적인 업무를 해결해드리지만 가끔은 이벤트성으로 특이한 업무도 발생합니다.
- 교통복지팀 업무 설명 (EKSYS)
- 시 > 팀장 > 팀원 > 사회복무요원 인계과정 (시: 내가 이걸 참조하겠다)
- 업무 사이즈: 만 단위(25600)에 달하는 업무과정, 그중에 데이터 추리고 6700건만 남김
- 상담원이 채운 주소 정보의 더러움 (Ex. 휠X와 같은 것들)
- AI NAVER API와 MAPS API, 지오코딩과 역지오코딩
- 처음 바이브 코딩을 통한 업무 보조와, 나중의 법정동&행정동 문제 설명
- 어쩔 수 없는 부분은 손으로 해결, 인계, 해결완료

25년 3월, 처음에는 AI NAVER API의 지오코딩으로 채워넣을 수 있는 것은 채워넣고 프로그램으로 해결이 어려운 내용은 카카오지도와 네이버지도를 이용해 수기로 해결함. 그러나 전달도 잘 안 됐고 담당 직원이 관심을 놓으면서 흐지부지됨.

25년 7월, 같은 업무가 재점화되었고 이전과 같은 방식으로 지역을 채웠으나 EKSYS에서 "법정동이 아닌 행정동만 추가 가능합니다"라고 답변을 주면서, 일이 복잡해짐. 네이버 API를 이용할 때 행정동 정보는 역지오코딩으로만 얻을 수 있었으므로, 지오코딩 => 역지오코딩 순의 과정을 통해 행정동 정보를 얻음.

안녕하세요. eKsys 사길수입니다.

업데이트 완료되었습니다.

감사합니다.

From: jcall@ictr.or.kr <jcall@ictr.or.kr>
Sent: Thursday, August 7, 2025 5:45 PM
To: nobinea@eksys.co.kr
Cc: "이정익" <it202324@ictr.or.kr>
Subject: RE: RE: Re: RE: 안녕하세요, 이동약자지원센터 사무실입니다. [고객정보 업데이트 관련 문의]
 
안녕하세요, 인천이동약자지원센터입니다.
 
죄송합니다, 지역을 수기로 작성, 확인하는 과정에서 실수가 있었습니다. 행정표준코드를 참고하여 일괄 수정했사오니, 확인해주시면 감사하겠습니다.
사무실에서는 고객정보를 하나하나 수정하기가 어려워 지역과 타지역을 새로 업데이트해주시면 감사하겠습니다.
 
행정표준코드에 따르면 강원도가 아닌 강원특별자치도로 등록되어 있으나, 편의를 위해 강원도로 작성된 시트 하나와 강원특별자치도로 작성된 시트 하나로 유형을 나누어 보내드렸습니다.

감사합니다.
────── 원본 메일 ──────
보낸사람 : <nobinea@eksys.co.kr>
받는사람 : <jcall@ictr.or.kr>
참조 : <eseok.hwang@eksys.co.kr>, <ldw@eksys.co.kr>
받은날짜 : 2025-08-04 (월) 09:11:38
제목 : RE: Re: RE: 안녕하세요, 이동약자지원센터 사무실입니다. [고객정보 업데이트 관련 문의]
 
안녕하세요. eKsys 사길수입니다.
 
명칭을 행정동 코드표와 통일해 주시기 바랍니다.
 
강원특별자치도 = 강원도
서울특별자시치 = 서울특별시
인천 = 인천광역시
노우너구 = 노원구
 
본사에서 업데이트 시 지역 이름을 기준으로 형정동 코드를 업데이트를 진행합니다.
 
오자, 탈자를 일일히 검수하여 업데이트 해 드릴 수 없습니다.
 
감사합니다.
 
From: jcall@ictr.or.kr <jcall@ictr.or.kr>
Sent: Friday, August 1, 2025 1:27 PM
To: "사길수" <nobinea@eksys.co.kr>
Subject: RE: Re: RE: 안녕하세요, 이동약자지원센터 사무실입니다. [고객정보 업데이트 관련 문의]
 
안녕하세요, 인천이동약자지원센터입니다.
 
다름이 아니라, 업데이트된 고객정보를 확인해봤는데 여전히 누락된 고객정보가 다수 있어, 
사무실에서는 고객정보를 하나하나 수정하기가 어려워 지역과 타지역을 새로 업데이트해주시면 감사하겠습니다.
 
감사합니다.
 
────── 원본 메일 ──────
보낸사람 : "사길수" <nobinea@eksys.co.kr>
받는사람 : "교통복지팀 문학파트" <jcall@ictr.or.kr>
참조 : "이정익" <it202324@ictr.or.kr>, "황은석" <eseok.hwang@eksys.co.kr>, "이대우" <ldw@eksys.co.kr>
받은날짜 : 2025-07-31 (목) 13:32:29
제목 : Re: RE: 안녕하세요, 이동약자지원센터 사무실입니다. [고객정보 업데이트 관련 문의]
 
안녕하세요. eKsys 사길수입니다.
 
고객정보 업데이트 완료되었습니다.
 
감사합니다.

2025년 7월 28일 (월) 오후 2:56, "교통복지팀 문학파트" < jcall@ictr.or.kr>님이 작성:
법정동이 아닌 행정동을 기준으로 다시 수집하여 업데이트했습니다.
저번과 마찬가지로, 사무실에서는 고객정보를 하나하나 수정하기가 어려워 지역과 타지역을 새로 업데이트해주시면 감사하겠습니다.
감사합니다.

────── 원본 메일 ──────

보낸사람 : <nobinea@eksys.co.kr>
받는사람 : <jcall@ictr.or.kr>
참조 : "이정익" <it202324@ictr.or.kr>, <eseok.hwang@eksys.co.kr>, <ldw@eksys.co.kr>
받은날짜 : 2025-07-11 (금) 17:17:29
제목 : RE: 안녕하세요, 이동약자지원센터 사무실입니다. [고객정보 업데이트 관련 문의]

안녕하세요. eKsys 사길수입니다.
등록 고객 중 ADMIN_CODE가 누락되어 있는 총 회원 수는 7,169명이나 보내 주신 리스트는 6,106명입니다.
보내주신 리스트를 기준으로 업데이트 하였으나 지역을 행정동이 아닌 법정동으로 주신 고객은 업데이트 되지 않았습니다.
현재 DB에 입력된 고객 중 상태 값이 등록이며 ADMIN_CODE가 없는 고객 리스트를 첨부해 드리도록 하겠습니다.
감사합니다. 

From: jcall@ictr.or.kr <jcall@ictr.or.kr>
Sent: Friday, July 11, 2025 3:54 PM
To: "사길수" <nobinea@eksys.co.kr>
Cc: "이정익" <it202324@ictr.or.kr>
Subject: 안녕하세요, 이동약자지원센터 사무실입니다. [고객정보 업데이트 관련 문의]

안녕하세요, 이동약자지원센터 사무실입니다.
시의 요청이 있어 고객정보 중 지역정보가 누락되어 있는 6106개 가량의 건에 대해 지역을 새로 채우게 되었고, 고객 목록 통계 파일을 바탕으로 고객정보 중 누락이 되어 있는 건에 대해 사무실에서 지역을 작성했습니다.
사무실에서는 고객정보를 하나하나 수정하기가 어려워, 지역과 타지역을 새로 업데이트해주시면 감사하겠습니다. 파일은 첨부해드렸습니다.
감사합니다.
{% endcomment %}