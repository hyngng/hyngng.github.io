import type { Locale } from './index';

const locale: Locale = {
  meta: {
    bcp47: 'ko-KR',
    ogLocale: 'ko_KR',
  },
  frame: {
    lang: 'KO',
    langAria: '언어 선택',
    themeAria: '테마 전환',
    rssAria: 'RSS',
  },
  authors: {
    title: '글쓴이',
    otherCount: (n: number) => `및 ${n}명의 작가`,
    toggleAria: '글쓴이 목록 토글',
    postCount: (n: number) => `${n}개 글`,
  },
  posts: {
    title: '포스트',
    count: (n: number) => `총 ${n}개 글`,
    empty: '포스트가 없습니다.',
    postNumber: (n: number) => `${n}번째 글`,
    notUpdated: '업데이트되지 않음',
    loadMoreCount: (n: number) => `+ ${n}개 포스트 더 보기`,
    loadMoreSub: (total: number, remaining: number) => `전체 ${total}편 중 ${remaining}편 남음`,
    loadMoreHover: (title: string, n: number) => n > 1 ? `${title} 외 ${n}건` : title,
    chunkPrev: '← 이전',
    chunkHome: '홈으로',
  },
  relativeTime: {
    today: '오늘 작성',
    yesterday: '어제 작성',
    daysAgo: (n: number) => `${n}일 전 작성`,
    monthAgo: '1개월 전 작성',
    monthsAgo: (n: number) => `${n}개월 전 작성`,
    yearAgo: '1년 전 작성',
    yearsAgo: (n: number) => `${n}년 전 작성`,
  },
  toc: {
    title: '목차',
    aria: '목차',
  },
  footer: {
    rights: '일부 권리 보유',
    poweredBy: 'Powered by Astro with NAME theme',
  },
  postFooter: {
    license: '이 페이지의 저작물은 저작권자의 <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> 라이선스를 따릅니다.',
    publishDate: '게시 날짜',
    lastUpdate: '최종 업데이트',
    characterCount: '글자 수',
    characterUnit: '자',
    copied: 'URL이 복사되었습니다',
    copyFail: '복사에 실패했습니다',
    qrAria: 'QR 코드 — 클릭하여 URL 복사',
    qrTitle: '클릭하여 URL 복사',
    dateLocale: 'ko-KR',
  },
  search: {
    title: '검색',
    placeholder: '포스트 검색',
    empty: '검색 결과가 없습니다.',
    aria: '포스트 검색',
  },
  notFound: {
    title: '404: 페이지를 찾을 수 없음',
    description: '해당 URL은 존재하지 않습니다.',
  },
};

export default locale;


