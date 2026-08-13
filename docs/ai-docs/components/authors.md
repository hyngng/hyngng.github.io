# Authors 컴포넌트

## 현재 상태

루트 페이지의 글쓴이 영역은 `src/components/Authors.astro`와 `src/components/Author.astro`로 분리함.

- 모바일(≤960px)에서는 `.authors` 섹션 자체가 `global.css`에서 `display: none` 처리되어 표시되지 않는다.
- 과거에 있던 모바일 전용 '접기/펼치기 토글'(`.authors-toggle` 버튼 + `initAuthorsToggle` 스크립트)은 모바일에서 글쓴이 섹션이 제거되면서 완전히 삭제됨. 관련 `toggleAria` 로케일 필드도 정리됨.

구조:

- 루트 페이지가 `Authors`를 포함함.
- `Authors`가 여러 `Author`를 포함함.
- `Author`는 다음 props를 받음:
    - `avatar`: (선택) 아바타 이미지 URL
    - `name`: 작가 이름 (prefix 없이 원본 name만 전달)
    - `info`: 부가 정보
    - `id`: 작가 식별자 (링크 생성용)
    - `clickable`: (선택, 기본값 `true`) 작가 영역 클릭 시 상세 페이지 이동 여부
- `AUTHOR_PREFIX = '@'` 전역 상수가 `Author.astro` 내부에서 name 앞에 붙여서 렌더링됨.


`avatar`가 없거나 빈 문자열이면 `#EEEEEE` 배경의 원형 placeholder를 표시함.

섹션 제목은 `src/locales/ko-KR.ts`, `src/locales/en-US.ts`의 `authors.title`에서 가져옴. `Authors` 컴포넌트의 `title` prop으로 필요 시 override 가능함.

## 데이터 역할

`avatar`와 `name`은 `src/settings/authors.settings.ts`에서 제공하는 값을 사용함. 루트 페이지는 `ALL_AUTHORS`를 기준으로 전체 author를 렌더링해야 하며, 컴포넌트 호출부에서 author 이름을 직접 하드코딩하거나 일부 id 목록을 별도로 유지하지 않음.

## 라우팅

두 페이지 컴포넌트는 레이아웃과 스타일 중복을 방지하기 위해 `src/components/AuthorPageContent.astro` 컴포넌트를 사용함. 이를 통해 코드 중복 없이 일관된 스타일과 구조를 유지하며, 유지 보수가 용이해짐.

`info`는 화면 맥락에 따라 달라져야 함.

- 메인 페이지: 해당 계정으로 작성된 글 수.
- 포스트 카드: 포스트 작성 날짜의 상대값.
- 포스트 페이지: 해당 글이 해당 작가의 몇 번째 글인지.

## Figma 기준

`메인 페이지 - 라이트` 기준:

- section title `글쓴이`: `x=480`, `y=377`, `w=78`, `h=34`
- 첫 author avatar: `x=480`, `y=443`, `48 x 48`
- 첫 author name: `x=544`, `y=443`, font `18px`, weight `700`
- 첫 author info: `x=544`, `y=472`, font `16px`, weight `400`
- avatar와 text 사이 간격: `16px`
- title과 list 사이 간격: `32px`
