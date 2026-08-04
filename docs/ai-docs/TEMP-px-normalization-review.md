# px 값 정규화 검토 (임시 문서)

> 이 문서는 0.8배 스케일 다운 후 남은 소수 px를 정규화할 때의 비교표다. 리뷰 완료 후 삭제한다. 커밋하지 않는다.

## 정책

- **10px 이하**: 가장 가까운 자연수 (예: `0.8px→1px`, `3.2px→3px`)
- **10px 초과**: 8의 배수·웹 관례값으로 스냅 (12/14/16/18/20/22/24/28/32/36/40/44/48/56/64/.../800/8000)
- **rem**: 스케일 후 이미 0.1 단위로 깔끔하므로 변경하지 않음
- ⚠ 표시된 행은 "적용값"과 "가장 가까운 짝수"가 달라 **느낌 차이가 큰 후보**다. 검토 후 필요하면 해당 행만 가장 가까운 짝수로 교체한다.

## 비교표

| # | 수정 전 값 | 8의 배수·관례값 (적용) | 가장 가까운 짝수값 (비교) | 적용 위치 (예) |
|---|---|---|---|---|
| 1 | `0.8px` | `1px` ⚠ | `0px` | `--border-width`, 테이블/인라인 코드 테두리, outline-offset, text-decoration-thickness |
| 2 | `1.6px` | `2px` | `2px` | focus outline, `border-width: 1.6px` |
| 3 | `2.4px` | `2px` | `2px` | `border-width: 2.4px` |
| 4 | `3.2px` | `3px` ⚠ | `4px` | `--inline-code-radius`, translateY(3.2px), `--space-author-name-info` |
| 5 | `4.8px` | `5px` ⚠ | `4px` | 테이블 border-radius, 각주 배지 margin |
| 6 | `6.4px` | `6px` | `6px` | `--space-hero-title-description`, `--space-author-avatar-text`, `.search-input` padding |
| 7 | `9.6px` | `10px` | `10px` | `--toc-item-gap`, `--code-block-radius` |
| 8 | `10.4px` | `10px` | `10px` | `--space-avatar-description` |
| 9 | `12.8px` | `12px` | `12px` | `--font-size-base`, `--frame-thickness`, `--layout-padding-mobile`, 툴팁/코드 font-size |
| 10 | `14.4px` | `14px` | `14px` | `--author-name-size`, `.toc-link` font-size |
| 11 | `17.6px` | `18px` | `18px` | `--font-size-hero-description` |
| 12 | `19.2px` | `20px` | `20px` | `--post-card-radius`, 검색 아이콘 19.2×19.2 |
| 13 | `21.6px` | `22px` | `22px` | `--line-height-hero-description` |
| 14 | `22.4px` | `22px` | `22px` | `--font-size-action`, `--section-title-size` |
| 15 | `25.6px` | `24px` ⚠ | `26px` | `--layout-padding`, `--space-section-title-content`, `--space-post-title-meta` |
| 16 | `27.2px` | `28px` | `28px` | `--section-title-line-height` |
| 17 | `30.4px` | `32px` ⚠ | `30px` | `--space-authors-list` |
| 18 | `32.8px` | `32px` | `32px` | `--space-post-meta-list` |
| 19 | `33.6px` | `32px` ⚠ | `34px` | `--hero-margin-top`, `--post-margin-top` |
| 20 | `36.8px` | `36px` | `36px` | `--line-height-hero-title-mobile`, `--line-height-post-title-mobile` |
| 21 | `37.6px` | `36px` ⚠ | `38px` | `--hero-avatar-margin-top` |
| 22 | `38.4px` | `40px` ⚠ | `38px` | `--font-size-hero-title`, `--avatar-size`, `--font-size-post-title`, 모바일 마진 2종 |
| 23 | `46.4px` | `48px` ⚠ | `46px` | `--line-height-hero-title`, `--line-height-post-title` |
| 24 | `57.6px` | `56px` ⚠ | `58px` | `--button-size` (헤더 버튼) |
| 25 | `102.4px` | `104px` ⚠ | `102px` | `--authors-margin-top` |
| 26 | `108.8px` | `112px` ⚠ | `108px` | `--post-card-height-no-image` |
| 27 | `799.2px` | `800px` | `800px` | TOC `max-height` |
| 28 | `7999.2px` | `8000px` | `8000px` | PostFooter pill `border-radius` |
