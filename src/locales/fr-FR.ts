import type { Locale } from './index';

const locale: Locale = {
  meta: {
    bcp47: 'fr-FR',
    ogLocale: 'fr_FR',
  },
  frame: {
    lang: 'FR',
    langAria: 'Changer de langue',
    themeAria: 'Changer de thème',
    rssAria: 'RSS',
  },
  authors: {
    title: 'Auteurs',
    otherCount: (n: number) => `et ${n} autre${n !== 1 ? 's' : ''} auteur${n !== 1 ? 's' : ''}`,
    postCount: (n: number) => `${n} article${n !== 1 ? 's' : ''}`,
  },
  posts: {
    title: 'Articles',
    count: (n: number) => `${n} articles`,
    empty: 'Aucun article.',
    postNumber: (n: number) => `Article n°${n}`,
    notUpdated: 'Non mis à jour',
    loadMoreCount: (n: number) => `+ ${n} articles de plus`,
    loadMoreSub: (total: number, remaining: number) => `${remaining} sur ${total} articles restants`,
    loadMoreHover: (title: string, n: number) => n > 1 ? `${title} et ${n} de plus` : title,
    chunkPrev: '← Précédent',
    chunkHome: 'Accueil',
  },
  relativeTime: {
    today: "Publié aujourd'hui",
    yesterday: 'Publié hier',
    daysAgo: (n: number) => `Il y a ${n} jours`,
    monthAgo: 'Il y a 1 mois',
    monthsAgo: (n: number) => `Il y a ${n} mois`,
    yearAgo: 'Il y a 1 an',
    yearsAgo: (n: number) => `Il y a ${n} ans`,
  },
  toc: {
    title: 'Sommaire',
    aria: 'Sommaire',
  },
  footer: {
    rights: 'Tous droits réservés',
    poweredBy: (theme: string) => `Propulsé par Astro avec le thème ${theme}`,
  },
  postFooter: {
    license: 'Les contenus de cette page sont sous licence <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.',
    publishDate: 'Date de publication',
    lastUpdate: 'Dernière mise à jour',
    characterCount: 'Nombre de caractères',
    characterUnit: 'car.',
    dateLocale: 'fr-FR',
  },
  search: {
    title: 'Recherche',
    placeholder: 'Rechercher des articles',
    empty: 'Aucun résultat.',
    aria: 'Rechercher des articles',
  },
  notFound: {
    title: '404: Page non trouvée',
    description: "L'URL demandée n'existe pas.",
  },
  redirect: {
    fallbackLink: "Cliquez ici si vous n'êtes pas redirigé automatiquement.",
  },
};

export default locale;
