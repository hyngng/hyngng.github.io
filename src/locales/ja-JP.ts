import type { Locale } from './index';

const locale: Locale = {
  meta: {
    bcp47: 'ja-JP',
    ogLocale: 'ja_JP',
  },
  frame: {
    lang: 'JA',
    langAria: '言語を選択',
    themeAria: 'テーマを切り替える',
    rssAria: 'RSS',
  },
  authors: {
    title: '著者',
    otherCount: (n: number) => `他${n}名の著者`,
    postCount: (n: number) => `${n}件`,
  },
  posts: {
    title: '記事一覧',
    empty: '記事がありません。',
    postNumber: (n: number) => `第${n}話`,
    notUpdated: '更新なし',
    loadMoreCount: (n: number) => `+ さらに${n}件の記事を表示`,
    loadMoreSub: (total: number, remaining: number) => `全${total}件中 ${remaining}件 残り`,
    loadMoreHover: (title: string, n: number) => n > 1 ? `${title} 他${n}件` : title,
    chunkPrev: '← 前へ',
    chunkHome: 'ホーム',
  },
  relativeTime: {
    today: '本日投稿',
    yesterday: '昨日投稿',
    daysAgo: (n: number) => `${n}日前に投稿`,
    monthAgo: '1ヶ月前に投稿',
    monthsAgo: (n: number) => `${n}ヶ月前に投稿`,
    yearAgo: '1年前に投稿',
    yearsAgo: (n: number) => `${n}年前に投稿`,
  },
  toc: {
    title: '目次',
    aria: '目次',
  },
  footer: {
    rights: '一部の権利を保留',
    poweredBy: (theme: string) => `Powered by Astro with ${theme} theme`,
  },
  postFooter: {
    license: 'このページのコンテンツは<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>ライセンスの下で提供されています。',
    publishDate: '公開日',
    lastUpdate: '最終更新日',
    characterCount: '文字数',
    characterUnit: '文字',
    dateLocale: 'ja-JP',
  },
  search: {
    title: '検索',
    placeholder: '記事を検索',
    empty: '検索結果が見つかりません。',
    aria: '記事を検索',
  },
  notFound: {
    title: '404: ページが見つかりません',
    description: 'お探しのURLは存在しません。',
  },
  redirect: {
    fallbackLink: '自動的にリダイレクトされない場合は、こちらをクリックしてください。',
  },
};

export default locale;
