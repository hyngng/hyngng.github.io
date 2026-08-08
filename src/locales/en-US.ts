import type { Locale } from './index';

const locale: Locale = {
  meta: {
    bcp47: 'en-US',
    ogLocale: 'en_US',
  },
  frame: {
    lang: 'EN',
    langAria: 'Select language',
    themeAria: 'Toggle theme',
    rssAria: 'RSS',
  },
  authors: {
    title: 'Authors',
    otherCount: (n: number) => `and ${n} more author${n !== 1 ? 's' : ''}`,
    postCount: (n: number) => `${n} post${n !== 1 ? 's' : ''}`,
  },
  posts: {
    title: 'Posts',
    count: (n: number) => `${n} post${n !== 1 ? 's' : ''} total`,
    empty: 'No posts available.',
    postNumber: (n: number) => `Post #${n}`,
    notUpdated: 'Not updated',
    loadMoreCount: (n: number) => `+ ${n} more posts`,
    loadMoreSub: (total: number, remaining: number) => `${remaining} of ${total} posts remaining`,
    loadMoreHover: (title: string, n: number) => n > 1 ? `${title} and ${n} more` : title,
    chunkPrev: '← Previous',
    chunkHome: 'Home',
  },
  relativeTime: {
    today: 'Today',
    yesterday: 'Yesterday',
    daysAgo: (n: number) => `${n} days ago`,
    monthAgo: '1 month ago',
    monthsAgo: (n: number) => `${n} months ago`,
    yearAgo: '1 year ago',
    yearsAgo: (n: number) => `${n} years ago`,
  },
  toc: {
    title: 'Contents',
    aria: 'Contents',
  },
  footer: {
    rights: 'Some rights reserved',
    poweredBy: (theme: string) => `Powered by Astro with ${theme} theme`,
  },
  postFooter: {
    license: 'The works on this page follow the <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> license of the copyright holder.',
    publishDate: 'Published',
    lastUpdate: 'Last Updated',
    characterCount: 'Character count',
    characterUnit: ' chars',
    dateLocale: 'en-US',
  },
  search: {
    title: 'Search',
    placeholder: 'Search posts',
    empty: 'No results found.',
    aria: 'Search posts',
  },
  notFound: {
    title: '404: Page Not Found',
    description: 'The requested URL does not exist.',
  },
  redirect: {
    fallbackLink: 'Click here if you are not redirected automatically.',
  },
};

export default locale;


