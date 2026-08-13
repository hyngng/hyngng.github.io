import type { Locale } from './index';

const locale: Locale = {
  meta: {
    bcp47: 'zh-CN',
    ogLocale: 'zh_CN',
  },
  frame: {
    lang: 'ZH',
    langAria: '选择语言',
    themeAria: '切换主题',
    rssAria: 'RSS',
  },
  authors: {
    title: '作者',
    otherCount: (n: number) => `及另外 ${n} 位作者`,
    postCount: (n: number) => `${n} 篇`,
  },
  posts: {
    title: '文章',
    empty: '暂无文章。',
    postNumber: (n: number) => `第 ${n} 篇`,
    notUpdated: '未更新',
    loadMoreCount: (n: number) => `+ 加载更多 ${n} 篇文章`,
    loadMoreSub: (total: number, remaining: number) => `共 ${total} 篇，还剩 ${remaining} 篇`,
    loadMoreHover: (title: string, n: number) => n > 1 ? `${title} 等 ${n} 项` : title,
    chunkPrev: '← 上一页',
    chunkHome: '首页',
  },
  relativeTime: {
    today: '今天发布',
    yesterday: '昨天发布',
    daysAgo: (n: number) => `${n} 天前发布`,
    monthAgo: '1 个月前发布',
    monthsAgo: (n: number) => `${n} 个月前发布`,
    yearAgo: '1 年前发布',
    yearsAgo: (n: number) => `${n} 年前发布`,
  },
  toc: {
    title: '目录',
    aria: '目录',
  },
  footnote: {
    label: '脚注',
  },
  footer: {
    rights: '保留部分权利',
    poweredBy: (theme: string) => `Powered by Astro with ${theme} theme`,
  },
  postFooter: {
    license: '本页内容采用 <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> 许可协议。',
    publishDate: '发布日期',
    lastUpdate: '最后更新',
    characterCount: '字数',
    characterUnit: '字',
    dateLocale: 'zh-CN',
  },
  search: {
    title: '搜索',
    placeholder: '搜索文章',
    empty: '未找到相关结果。',
    aria: '搜索文章',
  },
  notFound: {
    title: '404: 页面未找到',
    description: '请求的 URL 不存在。',
  },
  redirect: {
    fallbackLink: '如果未自动跳转，请点击此处。',
  },
};

export default locale;
