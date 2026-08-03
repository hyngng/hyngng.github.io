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

모든 언어 파일은 `Locale` 인터페이스를 구현해야 함. 새 언어 추가 시:

1. `src/locales/xx-XX.ts` 생성
2. `Locale` 인터페이스 구현
3. `index.ts`의 `locales` 객체에 등록
4. `src/settings/site.settings.ts`의 `LOCALE_REGISTRY`에 `{ code, bcp47, description }` 추가

## 현재 지원 언어

- `ko` (기본)
- `en`
- `ru`
- `fr`
- `es`
- `ja`
- `zh`

## 코드 ↔ BCP-47 매핑

라우팅에는 2자리 `code`(`/en/`)를, 메타데이터/매니페스트에는 `bcp47`(`ko-KR`)를 사용합니다. 두 값은 `src/settings/site.settings.ts`의 `LOCALE_REGISTRY`에서 쌍으로 관리됩니다.

- `ko` ↔ `ko-KR` (기본)
- `en` ↔ `en-US`
- `ru` ↔ `ru-RU`
- `fr` ↔ `fr-FR`
- `es` ↔ `es-ES`
- `ja` ↔ `ja-JP`
- `zh` ↔ `zh-CN`

## 단일 레지스트리 (Single Source of Truth)

`src/settings/site.settings.ts`의 `LOCALE_REGISTRY`가 언어 목록의 단일 진실 출처입니다.

- `defaultLocale` = `LOCALE_REGISTRY[0].code` (`'ko'`) — i18n 라우팅 및 `locales/index.ts`가 공유.
- `defaultLocaleBcp47` = `LOCALE_REGISTRY[0].bcp47` (`'ko-KR'`) — PWA 매니페스트 `lang`, 작가 로케일 폴백에 사용.
- `supportedLocales` = 코드 배열 — `astro.config.mjs`의 `i18n.locales`가 참조.
- `getLocaleEntry(lang)` — code 또는 bcp47로 레지스트리 항목 조회, 실패 시 기본 로케일 반환. `getSiteMeta()`의 설명 폴백에 사용.

`src/locales/index.ts`는 이 레지스트리를 소비합니다. `defaultLocale`과 `availableLocales`(코드 + 번역 라벨)는 레지스트리에서 파생됩니다.

## i18n 라우팅 정책

- Astro native i18n 설정을 통해 구현함.
- `defaultLocale`('ko')은 프리픽스 없이 `/` 루트 경로 사용.
- 그 외 언어는 `/en/`, `/ru/` 등 짧은 언어 코드를 URL 프리픽스로 사용.
- 언어 변경 시 `localStorage`가 아닌 URL 기반의 정적 이동을 수행하여 렌더링 플래시 현상 방지.

## 역할 분담 (Single Source of Truth)

- **`src/settings/site.settings.ts`**: 언어 목록(`LOCALE_REGISTRY`)과 유저 커스텀 메타데이터(블로그 타이틀, 설명 등)의 단일 진실 출처(SSOT). `getSiteMeta(lang)`을 통해 언어별 설정 관리 및 `defaultLocale` 자동 Fallback 지원.
- **`src/locales/`**: 유저가 수정할 필요 없는 시스템 고정 UI용 문자열(검색, 다음 글, 테마 변경 등) 엔진 영역.
- **`posts/{locale}/`**: 포스트 글 본문 콘텐츠.

## 규칙

컴포넌트에 표시되는 고정 문구는 직접 하드코딩하지 않고 `src/locales/`에 추가함.
페이지나 콘텐츠에 따라 달라지는 값은 prop 또는 content collection에서 주입함.

