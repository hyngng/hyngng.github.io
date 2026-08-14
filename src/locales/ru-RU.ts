import type { Locale } from './index';

const locale: Locale = {
  meta: {
    bcp47: 'ru-RU',
    ogLocale: 'ru_RU',
  },
  frame: {
    lang: 'RU',
    langAria: 'Выбор языка',
    themeAria: 'Смена темы',
    rssAria: 'RSS',
  },
  authors: {
    title: 'Авторы',
    otherCount: (n: number) => `и ещё ${n} автор${n !== 1 ? (n < 5 ? 'а' : 'ов') : ''}`,
    postCount: (n: number) => `${n} публикаций`,
  },
  posts: {
    title: 'Публикации',
    empty: 'Постов нет.',
    postNumber: (n: number) => `Публикация №${n}`,
    notUpdated: 'Не обновлено',
    loadMoreCount: (n: number) => `+ ${n} публикаций еще`,
    loadMoreSub: (total: number, remaining: number) => `${remaining} из ${total} публикаций осталось`,
    loadMoreHover: (title: string, n: number) => n > 1 ? `${title} и ещё ${n}` : title,
    chunkPrev: '← Назад',
    chunkHome: 'Главная',
  },
  relativeTime: {
    today: 'Сегодня',
    yesterday: 'Вчера',
    daysAgo: (n: number) => `${n} дней назад`,
    monthAgo: '1 месяц назад',
    monthsAgo: (n: number) => `${n} месяцев назад`,
    yearAgo: '1 год назад',
    yearsAgo: (n: number) => `${n} лет назад`,
  },
  toc: {
    title: 'Содержание',
    aria: 'Содержание',
  },
  morePosts: {
    title: 'Другие публикации',
    aria: 'Другие публикации',
  },
  footnote: {
    label: 'Сноски',
  },
  footer: {
    rights: 'Все права защищены',
    poweredBy: (theme: string) => `На базе Astro с темой ${theme}`,
  },
  postFooter: {
    license: 'Материалы этой страницы распространяются под лицензией <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.',
    publishDate: 'Дата публикации',
    lastUpdate: 'Последнее обновление',
    characterCount: 'Количество символов',
    characterUnit: 'симв.',
    dateLocale: 'ru-RU',
  },
  search: {
    title: 'Поиск',
    placeholder: 'Искать публикации',
    empty: 'Ничего не найдено.',
    aria: 'Поиск публикаций',
  },
  notFound: {
    title: '404: Страница не найдена',
    description: 'Запрошенный URL не существует.',
  },
  redirect: {
    fallbackLink: 'Нажмите здесь, если вас не перенаправили автоматически.',
  },
};

export default locale;
