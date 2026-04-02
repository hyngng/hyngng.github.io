---
image:
    path: /2026-04-02-winui/preview-image.webp
    lqip: data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADQAQCdASoQAAgAAUAmJZwCdAEPCsH0AAD+/crO2PZZpBlehM1Ayx+W1neqMAAA
    alt: "임시로 사용한 프로그램명은 'Pascal'"

title: "WinUI 기반 PDF 편집 프로그램 개발기"

categories: [마일스톤, 기타 개발]
tags: [마일스톤, 기타 개발, WinUI 3, MVVM, XAML, C#]
start_with_ads: true

toc: true
toc_sticky: true

date: 2026-04-02 11:14:00 +0900
last_modified_at: 2026-04-02 11:14:00 +0900

mermaid: true
---

## **개발 동기**

> "고마운데, 우리 공공기관이라 외부 프로그램 함부로 쓰면 안돼"

사회복무 도중 사무실에서 문제가 있었습니다. [사회복무요원 근무 후기 글](https://hyngng.github.io/posts/sabok-logs/)에 더 자세히 정리되어 있지만, 간단히 요약하면 공공기관은 라이선스 허가받지 않은 외부 프로그램을 함부로 사용할 수 없다는 점을 지적받은 적 있었고, 그 경험이 프로그램 개발 동기로 이어졌습니다. 다만 단순히 '직접 만들어 쓰자'는 생각만으로 시작한 것은 아닙니다. 유니티로 먼저 접한 C#을 다른 맥락에서도 써보고 싶었고, 제대로 된 윈도우 프로그램도 한 번 다루어보고 싶었던 덕분에 새 프로젝트를 과감히 열 수 있었습니다.

프로그램 이름이 Pascal인 이유는 최초로 PDF 압축 기능을 목표로 개발을 시작했기 때문입니다. 압축 기능은 기능구현의 수지타산이 맞지 않아 구현되지 않았지만 PDF 파일 조작이라는 맥락은 살아남아 병합과 분할 두 가지 기능 구현으로 이어졌습니다.

## **프로그램 소개**

![pages-light](/2026-04-02-winui/pages-light.webp){: .light }
![pages-dark](/2026-04-02-winui/pages-dark.webp){: .dark }
*4개 페이지에 대한 스크린샷*

Pascal은 PDF 병합, 분할 작업을 수행해주는 프로그램입니다. 대체병역으로서의 사회복무 도중 2달가량에 걸쳐 개발되었으며, 정말 운좋게도 [개발자를 지망하는 동료 사회복무요원](https://github.com/din-c)이 있어 근무 중 남는 시간에 전용 노션 페이지를 열고 작은 협업을 진행했습니다. 원래는 PDF 텍스트 추출, JPG 변환, 압축 등 여러 개 사무 관련 기능을 이 프로그램에 통합하여 사용할 계획이었으나, 진로상의 이유와 얼마 남지 않은 복무 기간을 고려해 기초적인 기능 몇 가지만 구현하고 마무리했습니다.

기관을 특정할 수 있는 정보를 공개하는 것은 병무청이 권장하지 않는 행동이고, 그 입장을 존중해 정확히 어떻게 활용되었는지 묘사하기는 어렵지만 간략히만 기술할 수 있을 것 같습니다. 먼저 이 프로그램을 내가 소유하고 있다는 감각이 심리적으로 큰 도움이 되었고, 다음으로 이전 파이썬 스크립트를 돌리기 전 `config.yaml` 설정값을 매번 수정하는 등 날것 그대로의 업무 형태가 보다 간소화되는 이점이 있었습니다.

동작하는 기능
: - PDF 여러 개 파일 병합하기
    - 병합 순서 변경 가능
    - 병합 페이지 지정 가능
- PDF 여러 개 파일 동시 분할하기
    - 분할 단위 지정 가능
    - 분할 범위 지정 가능
- 윈도우 업데이트 화면 띄우기(실험실)

## **개발의 난해함과 적응 노력**

### **IDE, .NET, 라이브러리**

VSCode의 미니멀리즘한 디자인을 좋아하는 덕에 먼 친척 Visual Studio는 사용할 줄은 알지만 코드 실행 방법만 아는 정도였습니다. 더구나 WinUI 3라는 생소한 프레임워크로 시도해본 적은 없었습니다. 솔루션, NuGet, 디자이너 같은 용어나 메뉴 바에서 제공되는 기능에 익숙해지는 것 자체가 첫 번째 진입 장벽으로 기능했고, 기능 구현 이전에 개발 환경의 구조를 이해하는 데 생각보다 많은 시간을 써야 했습니다.

특히 [WinUI-Gallery](https://github.com/microsoft/WinUI-Gallery), [DevWinUI.Gallery](https://github.com/ghost1372/DevWinUI/tree/main/dev/DevWinUI.Gallery), [Files](https://github.com/files-community/files) 등 다른 오픈소스 프로젝트를 살펴보면 `Services`, `Helpers`, `Modules`와 같은 일종의 방언을 따르는 것을 볼 수 있습니다. 유니티나 파이썬, 프론트엔드 프로젝트에서는 잘 보지 못했던 방식이라 처음에는 다소 낯설었습니다. 기능을 배우는 것과 별개로 프로젝트를 읽는 방식 자체를 탐색해야 했고, 기존의 감각을 이 프로젝트에 번역, 적용해야 했습니다.

그럼에도 불구하고 WinUI 3 환경에 잘 정착할 수 있었던 것은 [Windows Community Toolkit](https://github.com/CommunityToolkit/WindowsCommunityToolkit)과 [DevWinUI](https://github.com/ghost1372/DevWinUI)라는 훌륭한 컨트롤 라이브러리 덕분입니다. UI를 다루는 .NET 개발환경에서는 UI 요소를 컨트롤이라고 부르는데, 두 라이브러리가 정말 다양한 컨트롤을 제공하고 있기 때문에 `DatatTable` 정도를 제외하면 대부분 어렵지 않게 구현할 수 있었습니다. 초기 진입 비용을 덜 수 있었던 부분입니다.

### **WinUI 3 프레임워크**

윈도우 프로그램을 개발할 때의 사전 조건, 지식, 경험이 거의 없는 상태였고 프레임워크를 선택하는 단계에서부터 방향을 쉽게 잡지 못했습니다. 처음에는 프론트엔드 개발 경험을 재사용해보고자 [Electron.NET](https://github.com/ElectronNET/Electron.NET)을 처음 찾아봤다가, 당사자들부터가 "Wait - you host a .NET Core app inside Electron? Why?"라고 묻고 있어 정석적인 방향과 많이 동떨어져있다는 인상을 받았습니다. 그리고 때마침 [Fluent 2](https://fluent2.microsoft.design/)라는 마이크로소프트 디자인 문법을 알게 되면서 [ModernWPF](https://github.com/Kinnara/ModernWpf) 라이브러리를 사용하는 WPF 프로젝트로 전환했고, 개발 도중 레거시 환경이 2025년 기준으로는 낙후되어있다고 느껴져 최신 프레임워크 WinUI 3로 개발환경을 옮겼습니다.

|프론트엔드 웹개발|WinUI|
|---|---|
|HTML|XAML|
|CSS|XAML Style|
|JavaScript|C#|

인상깊었던 것은 WPF와 WinUI 3의 개발 경험이 프론트엔드 웹 개발과 매우 닮아 있다는 점입니다. 좀 놀랐습니다. XAML로 UI 구성 요소와 속성을 정의하고 C#으로 세부 로직을 작성하는 과정이 HTML과 자바스크립트가 동작하는 방식과 같고, 스타일 정의 또한 CSS, SCSS를 다뤄본 적 있다면 어렵지 않아 UI 프레임워크는 금방 적응할 수 있었습니다.

그러나 WinUI 3 생태계는 마이크로소프트의 지속적인 지원에도 불구하고 여전히 빈약한 편입니다. 예컨대 [WinUI-3-Apps-List 프로젝트](https://github.com/DesignLipsx/WinUI-3-Apps-List?tab=readme-ov-file)를 둘러보면 양 자체는 어느 정도 있지만 질은 높지 않습니다. 그중에서도 오픈소스로 코드가 공개된 경우는 더더욱 드물기 때문에 이 프레임워크를 다른 사람들이 실제로 어떻게 다루고 있는지 탐색하는 데 어려움이 있었습니다.

그래서 WinUI 3 프로젝트를 어떻게 이끌어야 하는지에 대한 고민은 [마이크로소프트에서 제공하는 공식 문서](https://learn.microsoft.com/ko-kr/windows/apps/winui/WinUI 3/)를 참고해 연역적으로 풀어야 합니다. 다만 한국어 페이지는 완성도가 굉장히 낮아 참고하기가 쉽지 않았고, 같은 이유로 LLM 인공지능의 정확한 도움도 받기 어려웠습니다. 초기 학습 비용이 컸던 부분입니다.

### **꽤 낯선 MVVM 패턴**

가장 생소했던 부분입니다. XAML이나 C# 문법을 알고 있는 것 이외에 MVVM에 대한 감각이 필요했습니다. MVVM 그 자체는 WinUI 개발의 충분조건이지만, 프레임워크 자체가 MVVM을 상정하고 설계되었기 때문에 준수하지 않는다면 코드 유지보수 난이도가 급격히 높아집니다. 유니티와의 개발 경험을 매우 판이하게 만든 부분입니다.

코드간 의존도를 낮춘다는 개념 자체는 익숙했지만 MVVM이 실제로 그것을 어떻게 달성하는지, 모델과 뷰, 뷰모델 세 가지 영역이 어디까지 할 수 있고, 어디부터 해서는 안 되는지, 둘의 차이를 어떻게 구분하는지에 대해서는 공부가 필요했습니다. 그리고 사실 글을 쓰고 있는 지금도 이해가 조금 모호하긴 합니다. 예를 들어 복잡한 페이지는 전용 ViewModel을 두고 단순한 페이지는 생략하는 것, 바인딩만으로 처리하기 까다로운 파일 드래그&드롭과 컨텍스트 메뉴 같은 경우엔 코드비하인드를 징검다리로 쓰는 것 등이 MVVM을 잘 준수하기 위한 최선이라 생각합니다. 하지만 이게 정말 최선인지도, 최선이라 하더라도 그 이점을 잘 체감하지 못하겠습니다.

이와 별개로 [MVVM Toolkit](https://learn.microsoft.com/en-us/dotnet/communitytoolkit/mvvm/) 패키지는 WinUI 3 개발에 있어 사실상 필수적으로 숙지할 필요가 있습니다. 이 패키지는 뷰가 UI 마크업 파일이 코드비하인드를 거치지 않고 뷰모델과 통신할 수 있게 도와주는 역할을 하고, 그 덕에 보다 직관적인 프로그램 설계 구조로 개선할 수 있습니다.

## **협업과 일 능률에 대한 소회**

### **협업**

저는 평소 습관적으로 노션, 피그마, 깃허브를 애용해왔고 이 프로젝트에서도 사용하려 했습니다. 동료 사회복무요원께서 이 도구들을 사용해본 적 없다고 하셔서 간략히 사용법, 사용 이유를 설명드리고, 이번에는 PARA 방법론까지 새로 시도해 보며 나름대로 체계적인 협업을 의도하려 했습니다.

하지만 막상 깃허브 외에는 기대한 만큼의 호응이 없었고 조금 머쓱했습니다. 동료가 게을러서는 아니고, WinUI 3라는 새 환경도 벅찬데 노션, 피그마라는 도구가 왜 필요한지 설득력이 부족했던 것 같습니다. 저는 자원 관리 체계가 개발을 더 멀리 지속시킬 수 있으므로 언제나 필요하다고 생각했는데, 동료분께서는 개발과 크게 상관없는 비용이라면 필요에 따라 내칠 수 있다고 보는 것 같았습니다. 그리고, 여기서는 그 관점이 맞다는 생각이 들었습니다. 객체지향의 효용성을 고민하는 것과 마찬가지로, 좋은 도구와 좋은 패턴에도 그것이 정당화되는 규모가 있음을 느꼈습니다. 무조건 좋은 도구라며 관성적으로 맹신했던 것 같습니다.

도구 정착은 반쯤 실패했지만, 협업 자체는 만족스럽게 잘 굴러갔습니다. 저는 뷰와 뷰모델, 동료 사회복무요원 분께서는 뷰모델과 모델을 맡도록 작업 영역을 나누되, 수정사항은 서로 공유, 리뷰하고 상호 2차 수정을 거치는 식으로 개발을 이어나갔습니다. 코드에 대한 시각을 공유할 수 있다는 것 자체만으로도 좋았습니다.

### **능률**

몇 년 전, 어느 해외 작가가 작품에 온전히 집중하기 위해 직장을 그만두려 한다는 글을 올린 것을 봤습니다. 그리고 한 독자가 "네가 하고 싶은 일 때문이라고 해도 어떤 이유로든 직장을 그만두는 건 좋지 않다고 생각한다"라고 조언하자, 이 작가는 "마음에 들지도 않는 직장 사무실에서 내 상상력이 죽게 내버려둔 것을 이미 후회하고 있다"라는 취지로 강력한 한 마디를 달았고 논쟁은 그 지점에서 끝났습니다.

이 상황이 프로그램을 개발하면서 종종 생각났습니다. 예술작품을 만들 때 들기 마련의, 정신적 감응, 자아실현의 절박함, 이런 것들을 프로그램 개발이 불러일으키지는 않으므로 엄밀히 저와 상황이 다릅니다. 하지만 사람을 지치게 만드는 소모적인 업무가 매일 발생하는 곳에서 남몰래 시선을 미래에 두고 시간을 투자하려는 것 자체는 저도 공감할 부분이 있었습니다.

실제로 이 프로젝트는 진척이 꽤 힘들었습니다. 어떤 UI 컨트롤을 어떻게 사용할 수 있을지 상상하고 있을 때 업무 관련해서 불려나가고, 20분 후 자리에 돌아와서 맥락을 다시 짚다보면 자리 전화벨이 울렸습니다. 창의력이 필요한 순간 뿐만 아니라 M-V-VM간 의존성 흐름을 검토하는 등의 단순 디버깅 작업도 잦은 방해를 받았습니다. 부당했다며 투덜거리고 싶은건 아닙니다. 다만 환경이 따라주지 못할 때 일 능률이 어디까지 떨어질 수 있는지를 보았습니다.

## **아카이브**

### **각종 스크린샷**

![pdf2jpg](/2026-04-02-winui/pdf2jpg.webp){: .w-75 }
*2025년 초, 동료 사회복무요원이 직접 파이썬으로 빌드해서 준 프로그램. 이걸 고급지게 대체하려는 목적도 있었음*

![old-design](/2026-04-02-winui/old-design.webp){: .light .border }
![old-design](/2026-04-02-winui/old-design.webp){: .dark }
*2024년 말, 거의 같은 기능을 수행하는 프로그램에 대한 원시 디자인 안*

![use-example](/2026-04-02-winui/use-example.webp)
*한참 이것저것 시도해보던 때. 기능이 구현된 시점에서 개발과 실사용을 병행했음*

### **사용된 라이브러리**

UI 및 프레임워크 확장
: - `Windows Community Toolkit`<sup>[MIT 라이선스](https://github.com/CommunityToolkit/Windows/blob/main/License.md)</sup>
- `DevWinUI`<sup>[MIT 라이선스](https://github.com/ghost1372/DevWinUI/blob/main/LICENSE)</sup>

PDF 문서 처리
: - `PDFsharp`<sup>[MIT 라이선스](https://github.com/empira/PDFsharp/blob/master/LICENSE)</sup>
- `PdfPig`<sup>[Apache-2.0 라이선스](https://github.com/BobLd/PdfPig.Rendering.Skia/blob/master/LICENSE.txt)</sup>

### **개발에 도움이 된 문서**

{% comment %}
: - [Symbol 열거형](https://learn.microsoft.com/ko-kr/uwp/api/windows.ui.xaml.controls.symbol?view=winrt-26100): 무채색 아이콘을 사용할 때 이곳을 기준으로 참조했습니다.
- [fluentui-system-icons](https://github.com/microsoft/fluentui-system-icons): Fluent 2 스타일 유채색 아이콘을 사용할 때 [이곳](https://github.com/microsoft/fluentui-system-icons/blob/main/icons_color.md)을 참조했습니다.
- [Segoe MDL2 Assets icons](https://learn.microsoft.com/en-us/windows/apps/design/style/segoe-ui-symbol-font)
- [FluentIcons.Wpf](https://www.nuget.org/packages/FluentIcons.WPF/)

WinUI3
: - [빠른 시작: 환경 설정 및 WinUI 3 project 만들기](https://learn.microsoft.com/ko-kr/windows/apps/winui/winui3/create-your-first-winui3-app?source=recommendations#unpackaged-create-a-new-project-for-an-unpackaged-c-or-c-winui-3-desktop-app): 다만 DevWinUI를 통해 프로젝트를 생성하는 쪽이 낫습니다.
- [네임스페이스 Windows App SDK](https://learn.microsoft.com/ko-kr/windows/windows-app-sdk/api/winrt/?view=windows-app-sdk-1.7)
- [Teamplate Studio for WinUI](https://marketplace.visualstudio.com/items?itemName=TemplateStudio.TemplateStudioForWinUICs)

MVVM
: - [MVVM 도구 키트 소개](https://learn.microsoft.com/ko-kr/dotnet/communitytoolkit/mvvm/): WinUI 3 또는 WPF 프로젝트 진행 전, 이 페이지와 하위 페이지를 사실상 정독할 필요가 있습니다.

.NET 9
: - [고급 .NET 프로그래밍 설명서](https://learn.microsoft.com/ko-kr/dotnet/navigate/advanced-programming/): .NET 프레임워크에 대한 간략한 이해에 도움이 되는 문서입니다.
- [.NET 9용 WPF의 새로운 기능](https://learn.microsoft.com/ko-kr/dotnet/desktop/wpf/whats-new/net90)
{% endcomment %}

아이콘 관련
: - [Symbol 열거형](https://learn.microsoft.com/ko-kr/uwp/api/windows.ui.xaml.controls.symbol?view=winrt-26100)
- [fluentui-system-icons](https://github.com/microsoft/fluentui-system-icons)
- [Segoe MDL2 Assets icons](https://learn.microsoft.com/en-us/windows/apps/design/style/segoe-ui-symbol-font)
- [FluentIcons.Wpf](https://www.nuget.org/packages/FluentIcons.WPF/)

WinUI3
: - [빠른 시작: 환경 설정 및 WinUI 3 project 만들기](https://learn.microsoft.com/ko-kr/windows/apps/winui/winui3/create-your-first-winui3-app?source=recommendations#unpackaged-create-a-new-project-for-an-unpackaged-c-or-c-winui-3-desktop-app)
- [네임스페이스 Windows App SDK](https://learn.microsoft.com/ko-kr/windows/windows-app-sdk/api/winrt/?view=windows-app-sdk-1.7)
- [Teamplate Studio for WinUI](https://marketplace.visualstudio.com/items?itemName=TemplateStudio.TemplateStudioForWinUICs)

MVVM
: - [MVVM 도구 키트 소개](https://learn.microsoft.com/ko-kr/dotnet/communitytoolkit/mvvm/)

.NET 9
: - [고급 .NET 프로그래밍 설명서](https://learn.microsoft.com/ko-kr/dotnet/navigate/advanced-programming/)
- [.NET 9용 WPF의 새로운 기능](https://learn.microsoft.com/ko-kr/dotnet/desktop/wpf/whats-new/net90)

## **여담**

쓰인 라이브러리 중 DevWinUI는 ghost1372라는 이름으로 활동하는 이란 개발자 Mahdi Hosseini에게 전적으로 관리됩니다. 공개된 정보로 이분은 이란 Qeydar 시에서 교사로 일하며 거주하고 있는 것으로 보입니다. 그리고 정말 말도 안 되는 이야기인데, 2025년 12월 28일 이란 전역에서 대규모 시위가 발생함에 따라 이란 당국이 이를 강경 진압하기 시작했습니다.

위키피디아에 따르면 이 분이 거주하시는 Qeydar에서도 시위가 보고되었습니다. 그리고 며칠 뒤 이란 정부가 인터넷을 전국적으로 차단함에 따라 ghost1372의 커밋 기록 역시 그 시점에서 끊겨 앞으로의 행보 또한 불투명해졌습니다. DevWinUI가 WinUI 3 생태계에 기여하는 바가 적잖기 때문에 농담으로는 마이크로소프트가 헬기라도 보내서 이 분을 구해가야 한다는 말을 하기도 했지만, 당시에는 실제로 생사를 확인할 방법이 없어 걱정했던 기억이 있습니다. 다행히 지금은 다시 커밋이 올라오고 있어 무사한 것으로 보입니다.

그 외
: - 이 프로젝트를 다루는 도중 비주얼 스튜디오 2026이 출시<sup>2025년 11월 11일</sup>되었습니다.
- DevWinUI는 버전이 `9.4.0`에서 `9.8.0`으로 올라갔습니다.








{% comment %}
## **바이브 코딩의 활용처를 찾아**

> 아직 `AGENTS.md`, `copilot-instructions.md` 등 에이전트 정의 문서 기능을 사용해보지 않았을 때의 소회입니다!
{: .prompt-tip }

이번 프로젝트는 개인적으로 AI 에이전트를 적극 활용해본 프로젝트이기도 합니다. 그리고 솔직히, 조금씩 긴장되고 있습니다. Visual Studio에도 통합된 코파일럿의 유혹은 강력했습니다. 굉장히 유능하고 굉장히 편합니다. 앞으로도 인공지능이 질적 우상향 행보를 밟을 것은 확실한 상황에서, 1~2년 전만 하더라도 우스개소리로 여겨졌던 바이브 코딩이 이제 기우가 아니라는 것을 이 경험으로 체감했습니다.

써야 하는 것
- 협업 후기
- 기술적 세부사항
    - 파일 드래그&드롭을 구현할 때 WinUI 3에서 어떤 API를 사용했는지
    - DataTable 구현이 어려웠다고 했는데, 구체적으로 어떤 점이 어려웠고 어떻게 우회했는지
    - PDF 파일을 여러 개 동시 분할할 때 비동기 처리를 어떻게 했는지
    - MVVM에서 "코드비하인드를 징검다리로 쓰는 것"이 구체적으로 어떤 코드 구조를 의미하는지
ADR 형식
    - 컨텍스트: ModernWPF 라이브러리로 Fluent 2 디자인을 적용한 WPF 프로젝트를 진행 중이었음
    - 문제: (구체적으로 어떤 레거시 요소가 불편했는지)
    - 결정: WinUI 3로 마이그레이션
    - 결과: (마이그레이션 비용은 어느 정도였는지, XAML 코드의 재사용률은 어땠는지)
    - 상태: 채택됨
{% endcomment %}

{% comment %}
![ghost1372-commit-log-light](/2026-04-02-winui/ghost1372-commit-log-light.png){: .light }
![pdf2jpg](/2026-04-02-winui/ghost1372-commit-log.png){: .dark }
*글을 퇴고하는 지금, 3월 29일 ghost1372의 커밋 기록*

### **링크**

- 깃허브 페이지
{% endcomment %}

{% comment %}
2025-08-31 사회복무요원 졸업작품.

"다 좋은데, 막 쓰면 안돼. 걸리면 ㅈ된다? 우리 공사야 공사. 무료 프로그램이면 라이선스같은거 잘 찾아봐야 해."

- 노션 페이지에서 PARA 정리법을 처음 사용해봤습니다.

XAML에 `x:Name="TagName"` 선언해두면 코드비하인드에서 따로 `private variable tagName = GetTag("TagName")`의 형태로 접근하지 않아도 되는게 인상깊었음.

뷰는 뷰모델의 프로퍼티와 컬렉션을 바인딩으로 참조하고, 뷰모델은 `INotifyPropertyChanged`, `INotifyCollectionChanged` 알림 등을 통해 상태 변경을 푸시합니다. 뷰에서 명령을 실행해 뷰모델에 동작이 요청되고, 뷰모델이 상태를 변경하면 자동으로 UI를 갱신합니다.

### **만들게 된 이유**

> "고마운데, 우리 공사라 외부 프로그램 함부로 쓰면 안돼"

2025년 겨울의 사회복무요원 시절, 직원분께서 PDF 용량을 줄여달라는 부탁을 주셨고, 인터넷 서비스를 통해 해결하게 될 경우 파일이 외부로 새어나갈 위험이 있어 로컬 환경에서 해결하기 위해 `` 프로그램을 사용해서 해결해드렸습니다.

파일을 받아보시고는 직원분께서 어떻게 해결했냐고 여쭤보셨고, 프로그램을 깔아서 해결했다고 하자 외부 프로그램 함부로 쓰면 안 된다는 말씀을 주셨습니다.

사실 라이선스 등을 찾아보니 상업적으로도 무료라는 점을 고지하고 있어 큰 문제는 없습니다. 다만 "외부 프로그램을 쉽게 받아서 해결하려 한다"라는 신뢰의 문제라는 생각이 들었고 "그럼 직접 만들어서 쓰면 문제가 없겠네"라는 생각으로 동일 작업을 수행하는 프로그램을 파이썬으로 만들어서 사용했습니다.

### **다사다난한 개발 요소 선택과정.**

1. ASP.NET & Electron
2. Electron.NET
3. WPF + WPFUI
4. WPF + ModernWPF
5. WinUI 3
6. WinUI 3 + DevWinUI

개발 요소를 바꿀 때마다 백지상태에서 시작했습니다.

- WinUI 3은 다 좋은데 WPF에 비하면 페이지 뷰가 없다는게 별로임.

- 그리고, 참조할만한 앱도 정말 별로 없음. DevToys, WinToys, Powertoys, Files 정도. 그나마도 작업을 위한 앱은 아닌 것 같음.

![]()
_설정, 작업 관리자 등등_

- 윈도우 프로그램을 개발할 때의 사전 조건, 지식, 경험이 거의 없는 상태였고, 프레임워크를 선택하는 단계에서부터 어려움이 있었습니다. 처음에는 프론트엔드 개발 경험을 재사용해보고자 [Electron.NET](https://github.com/ElectronNET/Electron.NET)을 찾아봤고, 적합한 프레임워크가 아니라는 인상을 받았습니다. 그리고 때마침 우연히 [Fluent 2](https://fluent2.microsoft.design/)라는 마이크로소프트 디자인 문법을 접하면서 [ModernWPF](https://github.com/Kinnara/ModernWpf) 라이브러리를 사용하는 WPF 프로젝트로 전환했고, 개발 도중 레거시 환경이 불편하게 느껴져 최신 프레임워크 WinUI 3로 개발환경을 옮겼습니다.

WinUI 3 환경에 잘 정착할 수 있었던 것은 [Windows Community Toolkit](https://github.com/CommunityToolkit/WindowsCommunityToolkit)과 [DevWinUI](https://github.com/ghost1372/DevWinUI)라는 훌륭한 컨트롤 라이브러리 덕입니다. UI를 다루는 .NET 개발환경에서는 UI 요소를 컨트롤이라고 부르는데, 순수 WinUI의 컨트롤에 더해 두 라이브러리의 컨트롤을 혼합한다면 웬만한 상황을 거의 해결할 수 있습니다.

### **DevWinUI 프로젝트 생성과정**

[참조](https://github.com/ghost1372/DevWinUI)

`비주얼 스튜디오` > `확장` > `확장 관리` 경로에서 DevWinUI Templates for WinUI를 설치한 뒤 `비주얼 스튜디오` > `새 프로젝트 만들기` 경로에서

### **배울 것이 많다**

특히 단순히 XAML이나 C# 문법만 안다고 되는 일이 아니었습니다.

프레임워크를 이용하는 경우 대부분이지만 배워야 하는 것이 많습니다.

유니티의 경우 컴포넌트 시스템만 이해하면 코드 작성은 쉽기 때문에 문제가 없지만, .NET 환경 때문인지 WinUI라서인지 좀 힘들었습니다.
{% endcomment %}