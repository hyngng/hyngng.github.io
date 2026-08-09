# 빌드/개발 캐시

이 문서는 개발/빌드 중 "변경사항이 반영되지 않거나" 이상한 오류가 날 때 확인해야 할 캐시들을 다룬다. 두 종류가 있다:

1. **Astro Content Layer 캐시** (`data-store.json`) — 마크다운 렌더링 HTML
2. **Vite 의존성 사전 번들 캐시** (`node_modules/.vite`) — dev 의존성 번들. [하단 참조](#vite-의존성-사전-번들-캐시)

---

## Astro Content Layer 캐시 (`data-store.json`)

Astro 7+의 Content Layer API(glob loader)는 두 개의 캐시 위치를 사용한다:

| 모드 | 캐시 위치 | 환경 변수/설정 |
| --- | --- | --- |
| 개발(`astro dev`) | **`.astro/data-store.json`** (프로젝트 루트) | `settings.dotAstroDir` |
| 빌드(`astro build`) | **`node_modules/.astro/data-store.json`** | `config.cacheDir` (기본값) |

둘 다 `data-store.json`에 마크다운 렌더링 HTML을 저장한다.

## 동작 방식

1. `.md` 파일을 처음 읽을 때 파일 내용의 digest(해시)를 계산하고, remark/rehype 파이프라인을 통해 렌더링한 HTML과 함께 캐시에 저장한다.
2. 다음 실행(dev 또는 build)에서 digest가 같으면 파이프라인을 재실행하지 않고 캐시된 HTML을 그대로 사용한다.

## 이 프로젝트에서의 목적

포스트 수(ko 기준 55개+)와 다국어 번역본을 합치면 수백 개에 달하기 때문에, 내용이 바뀌지 않은 포스트는 캐시에서 꺼내 빌드/개발 속도를 높이기 위한 것이다.

## 주의: 캐시 키는 파일 내용 digest뿐

캐시 무효화 조건이 **`.md` 파일 내용 변경**뿐이다. remark/rehype 플러그인 코드가 바뀌어도 포스트 파일 내용은 동일하므로, Astro는 캐시 히트로 판단하고 플러그인을 아예 실행하지 않는다.

### 영향 범위

| 변경 종류 | dev 캐시 무효화 | build 캐시 무효화 |
| --- | --- | --- |
| `.md` 파일 내용 수정 | ✅ 무효화됨 | ✅ 무효화됨 |
| remark/rehype 플러그인 추가·수정 | ❌ 무효화 안 됨 | ❌ 무효화 안 됨 |
| `astro.config.mjs` 플러그인 순서 변경 | ❌ 무효화 안 됨 | ❌ 무효화 안 됨 |
| Astro 컴포넌트(`.astro`) 수정 | 해당 없음 | 해당 없음 |

## 해결 방법

remark/rehype 플러그인을 추가하거나 수정한 뒤 결과가 반영되지 않으면, **모든 캐시(`.astro`, `node_modules/.astro`, `node_modules/.vite`)를 삭제**하고 다시 실행한다.

Bash / zsh:
```bash
rm -rf .astro node_modules/.astro node_modules/.vite
npm run dev # 또는 npm run build
```

Windows (PowerShell):
```powershell
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue .astro, node_modules\.astro, node_modules\.vite
npm run dev # 또는 npm run build
```

## 배포 환경 (GitHub Actions)

`.astro`와 `node_modules/.astro`는 모두 `.gitignore`에 포함되어 있으므로, GitHub Actions 빌드는 항상 캐시 없이 시작한다. 이 캐시 무효화 이슈는 **로컬 개발/빌드 시에만** 발생한다.

---

## Vite 의존성 사전 번들 캐시

Vite는 dev 모드에서 `node_modules`의 의존성을 esbuild로 사전 번들(optimizeDeps)하여 `node_modules/.vite/deps/`에 저장한다. 시작 시점에 발견된 의존성만 번들되고, 런타임에 새 의존성이 발견되면 재최적화(re-optimization)가 발생한다.

### 증상: dev-toolbar MIME 오류 (`허용되지 않는 MIME 형식("")`)

브라우저 콘솔에서 아래 경고가 반복된다:

```
The script from "http://127.0.0.1:4321/@id/astro/runtime/client/dev-toolbar/entrypoint.js" was loaded even though its MIME type ("") is not a valid JavaScript MIME type.
```

이 경고는 Astro dev 툴바(dev 모드에서 모든 페이지 `<head>`에 자동 주입되는 `<script type="module">`) 로드 실패다.

### 왜 발생하는가 (이 프로젝트에서 확인된 원인)

1. `mermaid`는 `src/utils/mermaidThemeSync.ts`에서 `await import('mermaid')`로 **클라이언트 런타임에만** 동적 import된다. mermaid 다이어그램이 있는 포스트를 방문하기 전까지 초기 스캔에서 발견되지 않는다.
2. mermaid가 런타임에 "새 의존성"으로 발견되면 Vite가 재최적화를 실행한다. 이때 기존에 번들된 모듈(dev-toolbar entrypoint 포함)의 해시가 무효화된다.
3. 무효화된 `/@id/...` 요청은 Vite가 **`504 Outdated Optimize Dep`**로 응답하는데, 이 에러 응답에는 **Content-Type 헤더가 없다**(빈 문자열). 브라우저는 module script에 올바른 MIME 타입이 없다고 판단해 차단한다.

영향은 **dev 모드 전용**이다. 프로덕션 빌드와는 무관하며, dev 툴바가 안 뜨는 것 외에 페이지 기능은 정상이다.

### 해결: `optimizeDeps.include`로 사전 번들 고정

`astro.config.mjs`:

```js
vite: {
  optimizeDeps: {
    include: ['mermaid'], // 런타임 재최적화 유발 차단
  },
},
```

mermaid를 시작 시점에 사전 번들하면 런타임 "새 의존성 발견 → 재최적화"가 사라져 위 레이스가 원천 차단된다. **변경 후에는 반드시 `node_modules/.vite`를 삭제하고 dev 서버를 재시작해야 한다.**

추가로 `astro@7.2.0`부터 dev-toolbar entrypoint의 사전 번들링(withastro/astro PR #16480)이 강화되어 같은 계열 버그가 완화되므로, Astro는 최신 패치로 유지한다.

### 진단 방법

재최적화 발생 여부는 `node_modules/.vite/deps/_metadata.json`의 `optimized` 키에서 확인한다. 실행 도중 새 의존성이 추가되어 있다면(예: `mermaid`) 런타임 재최적화가 일어난 신호다. 사전 번들 목록에 있으면 재발하지 않는다.
