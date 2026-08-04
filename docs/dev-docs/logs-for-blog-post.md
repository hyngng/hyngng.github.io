# 의존성

- Node.js

## Astro

- [@astrojs/ sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [@astrojs/tailwind](https://docs.astro.build/en/guides/integrations-guide/tailwind/)
    - tailwind가 vite를 지원하기 시작하면서, `npx astro add tailwind` 명령어만으로 할 수 있게 되었음.
    - tailwind typography는 유용하긴 하지만, 디자인을 하나하나 다 손 보고 싶어서 안 쓰기로 함. 다만 [여기](https://gist.githubusercontent.com/adamwathan/41dcab602afd07ac8ba243eb186c324a/raw/e5780c1d25ee898d1076127fca9442de0b2f32f5/prose.css)서 css 전문을 가져와 베이스로 커스텀하기로 함.
    - tailwind 자체를 안 쓰게 됨. (07.10) - 안 쓰게 되더라고.
- [@astrojs/mdx]()
    - mdx 써볼려고.
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) + 커스텀 `astro-pwa` 통합
    - PWA (구 `@vite-pwa/astro`는 Astro 7 미지원으로 대체 — `docs/ai-docs/features/pwa.md` 참조)
- [remark/rehype]()
    - 프롬프트 블록, 비디오 임베딩 등.
- [bootstrap](https://getbootstrap.com/)

# 달라진 점

- 임시 빌드, 로컬호스트 서버 여는 과정이 `bundle exec jekyll s`가 `npm run dev`로 바뀜
- 주석이 `<!--
 {% endcomment%}`에서 `{/* */}`로 바뀜
- 폰트 설정을 `font.css`로 분리함. 이전 Jekyll Chirpy에서는 어떻게 수정해야 하는지 찾기 힘들어 불편했던 부분.

```md
- 제목
부가설명
```

이 문법 더이상 지원 안됨. 사용하기 간단해서 좋았는데, Kramdown의 Definition List임. Kramdown은 Ruby 기반이고, Astro는 Ruby를 사용하지 않아 바꿔야 함.

sub > a => 각주.

# 특징과 메모

- Astro는 코드 블럭을 [Shiki](https://shiki.style/)로 스타일링함. 이 문제를 피하고 싶어서
- Big Pickle이 개사기네. OpenCode를 직접 다 쓰는 느낌. Gemini API로는 못 느꼈던 것. 에이전트 오케스트레이션도 잘 작동함. to-do 리스트 생성이라던가. 체감적으로는 항상 Plan 몯에서 작업계획서를 작성할 것을 먼저 요구하고, 읽어본 다음 하나하나 물어보고 뜯어고치는 형태로 작업을 진행했기 때문에, 작업계획서를 기본적으로 제시하는 Antigravity(무료 플랜)과 비슷했음.

# Special Thanks

- VSCode
	- Auto Rename Tag: 얇게 펴바르듯이 도와줌. 좋음.