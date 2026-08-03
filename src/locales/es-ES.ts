import type { Locale } from './index';

const locale: Locale = {
  meta: {
    bcp47: 'es-ES',
    ogLocale: 'es_ES',
  },
  frame: {
    lang: 'ES',
    langAria: 'Cambiar idioma',
    themeAria: 'Cambiar tema',
    rssAria: 'RSS',
  },
  authors: {
    title: 'Autores',
    otherCount: (n: number) => `y ${n} autor${n !== 1 ? 'es' : ''} más`,
    toggleAria: 'Mostrar/ocultar lista de autores',
    postCount: (n: number) => `${n} publicación${n !== 1 ? 'es' : ''}`,
  },
  posts: {
    title: 'Publicaciones',
    count: (n: number) => `${n} publicaciones`,
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
  footer: {
    rights: 'Todos los derechos reservados',
    poweredBy: 'Impulsado por Astro con el tema NAME',
  },
  postFooter: {
    license: 'El contenido de esta página está bajo la licencia <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.',
    publishDate: 'Fecha de publicación',
    lastUpdate: 'Última actualización',
    characterCount: 'Cantidad de caracteres',
    characterUnit: 'car.',
    copied: 'URL copiada',
    copyFail: 'Error al copiar',
    qrAria: 'Código QR — clic para copiar la URL',
    qrTitle: 'Clic para copiar la URL',
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
};

export default locale;
