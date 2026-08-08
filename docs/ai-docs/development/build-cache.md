# Astro Content Layer 빌드/개발 캐시 (`data-store.json`)

## 개요

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
