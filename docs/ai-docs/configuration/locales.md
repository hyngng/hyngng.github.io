# Locales

## 구조

`src/locales/`에서 다국어 문자열을 관리함.

파일:
- `index.ts` - Locale 인터페이스 정의, 사용 가능한 언어 목록 및 `useLocale()` 함수 제공
- `ko-KR.ts` - 한국어 (기본)
- `en-US.ts` - 영어
- `ru-RU.ts` - 러시아어
- `fr-FR.ts` - 프랑스어
- `es-ES.ts` - 스페인어
- `ja-JP.ts` - 일본어
- `zh-CN.ts` - 중국어

## 사용 방법

```typescript
// 컴포넌트에서 사용
import { useLocale } from '../locales';
const locale = useLocale(Astro);

// 문자열 사용
locale.posts.title        // "포스트"
locale.posts.count(5)     // "총 5개 글"
locale.relativeTime.today // "오늘 작성"
```

## 인터페이스

모든 언어 파일은 `Locale` 인터페이스를 구현해야 함. UI 크롬 번역을 추가할 때:

1. `src/locales/xx-XX.ts` 생성
2. `Locale` 인터페이스 구현
3. `index.ts`의 `locales` 객체에 등록

> 포스트 콘텐츠 언어 지원은 위와 무관하게 포스트 `lang` 프론트매터만으로 동작합니다(중앙 목록 불필요). `LOCALE_REGISTRY` 등록은 정확한 SEO 메타가 필요할 때만 선택적으로 합니다.

## 현재 지원 언어 (콘텐츠 파생)

지원 언어는 하드코딩된 목록이 **아니며**, `posts/` 디렉토리의 포스트 프론트매터 `lang` 값에서 **빌드 시점에 파생**됩니다. `lang` 값을 가진 포스트가 하나라도 있으면 해당 언어는 자동으로 지원됩니다(라우팅, 언어 스위처, hreflang, sitemap, RSS). 기본 언어 `ko`는 항상 포함됩니다.

현재 저장소에 있는 언어 예시: ko, en, ru, fr, es, ja, zh.

## 코드 ↔ BCP-47 매핑

라우팅에는 2자리 `code`(`/en/`)를, 메타데이터/매니페스트에는 `bcp47`(`ko-KR`)를 사용합니다. 아래 매핑은 **알려진 언어에 한정**된 SEO 보강값이며, `LOCALE_REGISTRY`에 등록되어 있지 않은 언어는 제네릭 폴백(`bcp47 = code`, `og:locale = code_CODE`)을 사용합니다.

- `ko` ↔ `ko-KR` (기본)
- `en` ↔ `en-US`
- `ru` ↔ `ru-RU`
- `fr` ↔ `fr-FR`
- `es` ↔ `es-ES`
- `ja` ↔ `ja-JP`
- `zh` ↔ `zh-CN`

## 언어 소유권 (Content-driven)

포스트의 언어는 **프론트매터 `lang` 필드**가 단일 진실 출처입니다(`src/content.config.ts`에서 필수 2자리 코드로 검증). 폴더 경로는 언어를 결정하지 않으며 순수 조직용입니다. `src/utils/posts.ts`의 `getPostLang(post)`는 `post.data.lang`을 반환합니다.

지원 언어 집합은 `src/settings/site.settings.ts`의 `supportedLocales`로 노출되며, 빌드 시 `./posts`를 스캔해 수집합니다(`defaultLocale` ∪ 모든 `lang`). 이 값이 `astro.config.mjs`의 `i18n.locales`와 `locales/index.ts`의 `availableLocales`(언어 스위처)에 흘러갑니다.

`LOCALE_REGISTRY`는 **게이트키퍼가 아닌 보강 맵**입니다. 알려진 언어의 정확한 `bcp47`/`ogLocale`/`description`을 담고, 미등록 언어는 `getLocaleEntry(lang)`가 제네릭 값으로 폴백합니다.

타입 안전 계층:

- `locales/index.ts`의 `locales`는 `Record<string, Locale>`로 선언됩니다. `lang`에 대응하는 UI 번역 파일이 없으면 `getLocale(lang)`은 기본 로케일(`ko`)로 fallback하여 크롬(네비/푸터/버튼)을 기본 언어로 렌더합니다(본문은 포스트 언어 그대로). 이는 의도된 동작입니다.
- `LocaleCode`는 열린 `string` 타입입니다(폐쇄형 union 아님).

주요 export:

- `defaultLocale` = `'ko'` — 프리픽스 없는 기본 언어. i18n 라우팅 및 `locales/index.ts`가 재수출.
- `defaultLocaleBcp47` = `LOCALE_REGISTRY[0].bcp47` (`'ko-KR'`) — PWA 매니페스트 `lang`, 작가 로케일 폴백에 사용.
- `supportedLocales` — `defaultLocale` ∪ 포스트에서 파생된 모든 `lang`. `astro.config.mjs`의 `i18n.locales`가 참조.
- `getLocaleEntry(lang)` — code 또는 bcp47로 레지스트리 항목 조회, 미등록 시 제네릭 폴백. `getSiteMeta()`/`hreflang`/`og:locale`에 사용.

### 새 언어 추가 체크리스트

콘텐츠 지원(라우팅/스위처/hreflang)에 중앙 목록 편집은 **필요 없음**:

1. 포스트 프론트매터에 `lang: xx` 설정 — 끝. 빌드 시 자동 지원됨.

선택적 보강(원할 때만):

2. 사이트 크롬(UI)도 번역하려면 `src/locales/xx-XX.ts` 생성 + `Locale` 인터페이스 구현 + `locales/index.ts`의 `locales` Record에 `'xx': xxYY` 등록. 미등록 시 크롬은 기본 언어로 폴백.
3. 정확한 SEO 메타(`bcp47`/`og:locale`)가 필요하면 `LOCALE_REGISTRY_RAW`에 `{ bcp47: 'xx-YY', description: '...' }` 추가. 미등록 시 제네릭 폴백 사용.

`src/locales/index.ts`의 `availableLocales`(코드 + 번역 라벨)는 `supportedLocales`에서 파생되며, UI 번역이 없으면 코드 자체를 라벨로 표시합니다.

## i18n 라우팅 정책

- Astro native i18n 설정을 통해 구현함.
- `defaultLocale`('ko')은 프리픽스 없이 `/` 루트 경로 사용.
- 그 외 언어는 `/en/`, `/ru/` 등 짧은 언어 코드를 URL 프리픽스로 사용.
- 언어 변경 시 `localStorage`가 아닌 URL 기반의 정적 이동을 수행하여 렌더링 플래시 현상 방지.

## 역할 분담 (Single Source of Truth)

- **`src/settings/site.settings.ts`**: 언어 목록(`LOCALE_REGISTRY`)과 유저 커스텀 메타데이터(블로그 타이틀, 설명 등)의 단일 진실 출처(SSOT). `getSiteMeta(lang)`을 통해 언어별 설정 관리 및 `defaultLocale` 자동 Fallback 지원.
- **`src/locales/`**: 유저가 수정할 필요 없는 시스템 고정 UI용 문자열(검색, 다음 글, 테마 변경 등) 엔진 영역.
- **`posts/`**: 포스트 글 본문 콘텐츠. 언어는 프론트매터 `lang` 필드가 결정하며, 폴더 경로는 조직용입니다.

## 규칙

컴포넌트에 표시되는 고정 문구는 직접 하드코딩하지 않고 `src/locales/`에 추가함.
페이지나 콘텐츠에 따라 달라지는 값은 prop 또는 content collection에서 주입함.

