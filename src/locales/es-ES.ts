import type { Locale } from './index';

const locale: Locale = {
  description: 'Saludos 🔥',
  frame: {
    lang: 'ES',
    langAria: 'Cambiar idioma',
    themeAria: 'Cambiar tema',
    rssAria: 'RSS',
  },
  authors: {
    persona: 'Personas',
    otherPersona: 'Otras personae',
    otherCount: (n: number) => `y ${n} autor${n !== 1 ? 'es' : ''} más`,
    personaCount: (n: number) => `Ver ${n} personas`,
    otherPersonaCount: (n: number) => `Ver ${n} otras personas`,
    closeAria: 'Cerrar',
  },
  posts: {
    title: 'Publicaciones',
    empty: 'No hay publicaciones.',
    postNumber: (n: number) => `Publicación n.º ${n}`,
    notUpdated: 'No actualizado',
    loadMoreCount: (n: number) => `+ ${n} publicaciones más`,
    loadMoreSub: (total: number, remaining: number) => `${remaining} de ${total} publicaciones restantes`,
    loadMoreHover: (title: string, n: number) => n > 1 ? `${title} y ${n} más` : title,
    chunkPrev: '← Anterior',
    chunkHome: 'Inicio',
  },
  relativeTime: {
    today: 'Publicado hoy',
    yesterday: 'Publicado ayer',
    daysAgo: (n: number) => `Hace ${n} días`,
    monthAgo: 'Hace 1 mes',
    monthsAgo: (n: number) => `Hace ${n} meses`,
    yearAgo: 'Hace 1 año',
    yearsAgo: (n: number) => `Hace ${n} años`,
  },
  toc: {
    title: 'Tabla de contenido',
    aria: 'Tabla de contenido',
  },
  morePosts: {
    title: 'Más publicaciones',
    aria: 'Más publicaciones',
  },
  footnote: {
    label: 'Notas al pie',
  },
  footer: {
    rights: 'Todos los derechos reservados',
    poweredBy: (theme: string) => `Impulsado por Astro con el tema ${theme}`,
  },
  postFooter: {
    license: 'El contenido de esta página está bajo la licencia <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.',
    publishDate: 'Fecha de publicación',
    lastUpdate: 'Última actualización',
    characterCount: 'Cantidad de caracteres',
    characterUnit: 'car.',
    dateLocale: 'es-ES',
  },
  search: {
    title: 'Buscar',
    placeholder: 'Buscar publicaciones',
    empty: 'Sin resultados.',
    aria: 'Buscar publicaciones',
  },
  notFound: {
    title: '404: Página no encontrada',
    description: 'La URL solicitada no existe.',
  },
  redirect: {
    fallbackLink: 'Haga clic aquí si no es redirigido automáticamente.',
  },
};

export default locale;
