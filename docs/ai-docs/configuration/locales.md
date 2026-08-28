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

> 포스트 콘텐츠 언어 지원은 포스트 `lang` 프론트매터만으로 동작하며 중앙 목록이 불필요합니다. 정확한 BCP-47/`og:locale` 구조 필드는 `Intl.Locale().maximize()` 기반의 `deriveLocaleMeta()`(`src/settings/site.settings.ts`)로 파생됩니다.

## 현재 지원 언어 (콘텐츠 파생)

지원 언어는 하드코딩된 목록이 **아니며**, `posts/` 디렉토리의 포스트 프론트매터 `lang` 값에서 **빌드 시점에 파생**됩니다. `lang` 값을 가진 포스트가 하나라도 있으면 해당 언어는 자동으로 지원됩니다(라우팅, 언어 스위처, hreflang, sitemap, RSS). 기본 언어 `ko`는 항상 포함됩니다.

현재 저장소에 있는 언어 예시: ko, en, ru, fr, es, ja, zh.

## 코드 ↔ BCP-47 매핑

라우팅 URL 세그먼트에는 짧은 언어 코드(`/en/`)를, 메타데이터/매니페스트에는 full BCP-47(`en-US`)을 사용합니다. 두 형식 간 변환은 중앙 레지스트리 없이 처리됩니다.

- `src/utils/locale-segments.ts`의 `buildSegmentMap(supportedLocales, defaultLocale)` + `segmentMap` + `localePath(code)`: **URL 세그먼트 매핑의 단일 진실 출처**. 코드 하나를 받는 순수 함수(`localePath(code)`)로는 전역 유일성(injectivity)을 보장할 수 없으므로, `supportedLocales` 전체 집합을 보고 세그먼트를 **한 번에** 계산한다. 규칙: language 서브태그가 유일하면 짧은 코드(`en`, `zh`), 같은 language를 공유하는 로케일이 둘 이상이면(`zh-CN`+`zh-TW`) 해당 로케일만 full lowercased code(`zh-cn`, `zh-tw`)로 자동 승격(ditambiguate). 기본 로케일은 `''`(루트). 충돌이 남으면 빌드 타임에 명시적으로 throw(fail loud). `localePath`는 이 맵을 조회하며, `posts.ts` URL 조립·`astro.config.mjs` `i18n.locales`·`validate-routes.ts` 중복 키·`Frame.astro` 스위처가 모두 이 맵을 공유한다.
- `src/settings/site.settings.ts`의 `deriveLocaleMeta(code)`: `Intl.Locale(code).maximize()`로 `bcp47`/`language`/`region`/`ogLocale` 구조 필드 파생(CLDR likely-subtags 기반). 임의의 언어도 동일하게 커버.

아래 매핑은 파생 결과의 **예시**일 뿐, 하드코딩된 목록이 아닙니다(새 언어는 자동 지원).

- `ko` ↔ `ko-KR` (기본, 세그먼트 `''`)
- `en` ↔ `en-US` (세그먼트 `/en`)
- `ru` ↔ `ru-RU` (세그먼트 `/ru`)
- `fr` ↔ `fr-FR` (세그먼트 `/fr`)
- `es` ↔ `es-ES` (세그먼트 `/es`)
- `ja` ↔ `ja-JP` (세그먼트 `/ja`)
- `zh` ↔ `zh-CN` (단독 시 세그먼트 `/zh`; `zh-TW` 등이 함께 지원되면 자동으로 `/zh-cn`/`/zh-tw`로 승격)

## 언어 소유권 (Content-driven)

포스트의 언어는 **프론트매터 `lang` 필드**가 단일 진실 출처이며, 값은 **full BCP-47 코드**(`ko-KR`, `zh-CN` 등)입니다(`src/content.config.ts`에서 BCP-47 형식으로 검증). 폴더 경로는 언어를 결정하지 않으며 순수 조직용입니다. `src/utils/posts.ts`의 `getPostLang(post)`는 `post.data.lang`(BCP-47)을 반환합니다.

지원 언어 집합은 `src/settings/site.settings.ts`의 `supportedLocales`로 노출되며, 빌드 시 `./posts`를 스캔해 수집합니다(`defaultLocale` ∪ 모든 `lang`). 스캔은 `getFrontmatterLang()`(gray-matter YAML 파서) 결과를 `normalizeLang(lang)`로 **정규화**(`deriveLocaleMeta().bcp47` 기반)하여 프론트매터 표기(`en-US`)와 일치시킵니다. 이 값이 `astro.config.mjs`의 `i18n.locales`와 `locales/index.ts`의 `availableLocales`(언어 스위처)에 흘러갑니다. URL 세그먼트는 별도의 `locale-segments.ts` `segmentMap`에서 파생됩니다.

타입 안전 계층:

- `locales/index.ts`의 `locales`는 BCP-47 키(`'ko-KR'`, `'en-US'`, …)를 가진 `Record<string, Locale>`로 선언됩니다. `lang`에 대응하는 UI 번역 파일이 없으면 `getLocale(lang)`은 기본 로케일(`ko-KR`)로 fallback하여 크롬(네비/푸터/버튼)을 기본 언어로 렌더합니다(본문은 포스트 언어 그대로). 이는 의도된 동작입니다.
- `LocaleCode`는 열린 `string` 타입입니다(폐쇄형 union 아님).

주요 export:

- `defaultLocale` = `'ko-KR'` — BCP-47 기본 언어. 포스트 로직/UI 폴백의 단일 진실 출처. `locales/index.ts`가 재수출.
- `defaultLocaleBcp47` = `deriveLocaleMeta(defaultLocale).bcp47` (`'ko-KR'`) — PWA 매니페스트 `lang`, 작가 로케일 폴백에 사용.
- `supportedLocales` — BCP-47로 정규화된 `defaultLocale` ∪ 포스트에서 파생된 모든 `lang`. `astro.config.mjs`의 `i18n.locales`가 참조.
- `getLocaleEntry(lang)` — code 또는 bcp47로 구조 필드(`bcp47`/`ogLocale`/…) 조회, 미등록 언어는 `deriveLocaleMeta()` 제네릭 폴백. `hreflang`/`og:locale`에 사용.

### 새 언어 추가 체크리스트

콘텐츠 지원(라우팅/스위처/hreflang)에 중앙 목록 편집은 **필요 없음**:

1. 포스트 프론트매터에 `lang: xx` 설정 — 끝. 빌드 시 자동 지원됨.

선택적 보강(원할 때만):

2. 사이트 크롬(UI)도 번역하려면 `src/locales/xx-XX.ts` 생성 + `Locale` 인터페이스 구현 + `locales/index.ts`의 `locales` Record에 `'xx': xxYY` 등록. 미등록 시 크롬은 기본 언어로 폴백.
3. 정확한 SEO 메타(`bcp47`/`og:locale`)는 `deriveLocaleMeta()`가 `Intl.Locale`로 자동 파생하므로 별도 등록이 불필요합니다. (UI `description`은 `src/locales/xx-XX.ts`의 `Locale.description`에 있음.)

`src/locales/index.ts`의 `availableLocales`(코드 + 번역 라벨)는 `supportedLocales`에서 파생되며, UI 번역이 없으면 코드 자체를 라벨로 표시합니다.

## i18n 라우팅 정책

- Astro native i18n 설정을 통해 구현함.
- `astro.config.mjs`의 `i18n.defaultLocale`은 라우팅용으로 **짧은 코드(`'ko'`)**를 사용하고, `site.settings.ts`의 `defaultLocale`(로직용)은 **BCP-47(`'ko-KR'`)**입니다. 두 값은 의도적으로 분리되어 있습니다(`[lang]` 라우트의 `getStaticPaths`는 `site.settings`의 BCP-47 기준으로 기본 로케일을 필터링).
- 기본 언어(`ko-KR`)는 프리픽스 없이 `/` 루트 경로 사용(prefixDefaultLocale: false).
- 그 외 언어는 `segmentMap`에서 파생된 세그먼트를 URL 프리픽스로 사용. language가 유일하면 짧은 코드(`/en/`, `/ru/`), 같은 language를 공유하는 로케일이 공존하면 자동 disambiguate(`/zh-cn/`, `/zh-tw/`). `localePath()`는 이 맵을 조회.
- 언어 변경 시 `localStorage`가 아닌 URL 기반의 정적 이동을 수행하여 렌더링 플래시 현상 방지.

## 역할 분담 (Single Source of Truth)

- **`src/settings/site.settings.ts`**: 언어 파생 로직(`deriveLocaleMeta`, `supportedLocales` 스캔)과 유저 커스텀 메타데이터(블로그 타이틀, 설명 등)의 단일 진실 출처(SSOT). `getSiteMeta(lang)`(현재는 `src/locales/index.ts`에 위치)을 통해 언어별 설정 관리 및 `defaultLocale` 자동 Fallback 지원.
- **`src/locales/`**: 유저가 수정할 필요 없는 시스템 고정 UI용 문자열(검색, 다음 글, 테마 변경 등) 엔진 영역.
- **`posts/`**: 포스트 글 본문 콘텐츠. 언어는 프론트매터 `lang` 필드가 결정하며, 폴더 경로는 조직용입니다.

## 규칙

컴포넌트에 표시되는 고정 문구는 직접 하드코딩하지 않고 `src/locales/`에 추가함.
페이지나 콘텐츠에 따라 달라지는 값은 prop 또는 content collection에서 주입함.

## 알려진 구조적 부채 (낮은 심각도)

- **프론트매터 파서 이중 경로 — 해결됨**: config-time 스캔(`getFrontmatterLang`)과 Astro 콘텐츠 로더가 이제 **동일한 YAML 파서(gray-matter)**를 사용한다. 두 경로 모두 `normalizeLang`으로 같은 canonical form을 만들므로, 주석/앵커/별칭 등 예외 표현에서의 발산 가능성이 제거되었다. fs 스캔 자체는 config가 콘텐츠 컬렉션보다 먼저 도는 구조적 제약(Astro는 `astro.config.mjs`에서 `astro:content` 가상 모듈을 import할 수 없음) 때문에 여전히 불가피하다.
- **`posts/` 순회 로직 중복**: `scanPostLangValues`(`site.settings.ts`)와 `getLangSlugPairs`(`validate-routes.ts`)가 각각 재귀 순회. 향후 `listPostFiles()` 유틸로 통합 권장.
- **`LANG_PARSE` 정규식 제거 — 해결됨**: 사전 검증 정규식(`/^[a-z]{2}(-[a-z]{4})?(-[a-z]{2})?$/i`)을 삭제했다. BCP 47 유효성은 이제 전적으로 `Intl.Locale` 생성자(ECMA-402)에 위임되며, `normalizeLang`이 `RangeError`를 잡아 `null`로 만든다. 덕분에 3자리 언어코드(`fil`, `yue`)와 숫자 region(`es-419`)도 정상 통과하며, 별도 유지보수 대상(정규식)이 사라졌다.
- **타입 codegen 보류**: `LocaleCode`는 열린 `string`. 런타임 검증(`normalizeLang` + schema)이 빌드 타임에 invalid를 잡으므로 타입 레벨 강제는 우선순위 낮음.


