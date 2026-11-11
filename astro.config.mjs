// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkCdnImages } from './src/plugins/remark-cdn-images.ts';
import { markdownRemarkPlugins } from './src/utils/markdown-syntax.ts';
import { remarkDirectives } from './src/plugins/remark-directives.mjs';
import { remarkYoutube } from './src/plugins/remark-youtube.mjs';
import { remarkVideo, remarkAudio } from './src/plugins/remark-media.mjs';
import { remarkMediaCaption } from './src/plugins/remark-media-caption.mjs';
import { rehypeImageWrapper } from './src/plugins/rehype-image-wrapper.mjs';
import rehypeRaw from 'rehype-raw';
import { rehypeTableWrapper } from './src/plugins/rehype-table-wrapper.mjs';
import { rehypeStripComments } from './src/plugins/rehype-strip-comments.mjs';
import { rehypeFootnoteTooltip } from './src/plugins/rehype-footnote-tooltip.mjs';
import { SITE, defaultLocale, defaultLocaleBcp47, supportedLocales } from './src/settings/site.settings';
import { segmentMap } from './src/utils/locale-segments';
import { pwaCachePrefix } from './src/utils/pwa-cache';
import { validateRoutes } from './src/integrations/validate-routes';
import astroPwa from './src/integrations/astro-pwa';

import rehypeKatex from 'rehype-katex';
import remarkDeflist from 'remark-deflist';
import remarkGfm from 'remark-gfm';
import { remarkImageAttributes } from './src/plugins/remark-image-attributes.mjs';
import { unified } from '@astrojs/markdown-remark';
import { visit } from 'unist-util-visit';
import { pagefind } from 'vite-plugin-pagefind';

function conditionalMath() {
  /** @param {import('unist').Parent} tree @param {import('vfile').VFile} file */
  return (tree, file) => {
    if (file?.data?.astro?.frontmatter?.math) return;
    visit(tree, 'inlineMath', /** @param {any} node */ (node) => {
      node.type = 'text';
      node.value = '$' + node.value + '$';
      delete node.data;
    });
    visit(tree, 'math', /** @param {any} node @param {number | undefined} index @param {any} parent */ (node, index, parent) => {
      if (parent && index != null) {
        parent.children[index] = {
          type: 'paragraph',
          children: [{ type: 'text', value: '$$\n' + node.value + '\n$$' }],
        };
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  site: SITE.url,

  server: {
    host: true,
    port: 4321
  },

  integrations: [
    mdx(),
    validateRoutes(),
    ...(SITE.pwa.enabled ? [
      astroPwa({
        registerType: 'autoUpdate',
        injectRegister: null,
        includeAssets: [
          'assets/img/favicons/favicon.svg',
          'assets/img/favicons/favicon-32x32.png',
          'assets/img/favicons/favicon-16x16.png',
          'assets/img/favicons/apple-touch-icon.png',
        ],
        manifest: {
          name: SITE.title,
          short_name: SITE.title,
          description: SITE.description,
          start_url: '/',
          display: 'standalone',
          lang: defaultLocaleBcp47,
          background_color: '#FFFFFE',
          theme_color: '#0a0a0a',
          icons: [
            {
              src: '/assets/img/favicons/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/assets/img/favicons/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          // Chirpy-style Cache-First model (see docs/ai-docs/features/pwa.md).
          // Precache immutable hashed assets, chunk HTML fragments (offline
          // post loading) and the home pages (the offline entry points for
          // every locale). General HTML pages and CDN images are cached at
          // runtime; the build-stamped cache names below make stale content
          // impossible — a new deployment gets a fresh cache namespace, and
          // astro-pwa.ts wipes the previous build's caches on activation.
          globPatterns: [
            '**/*.{js,css,svg,png,ico,woff,woff2}',
            '**/chunk/**/index.html',
            'index.html',
            ...supportedLocales
              .filter((code) => code !== defaultLocale)
              .map((code) => `${segmentMap.get(code) ?? new Intl.Locale(code).language}/index.html`),
          ],
          // generateSW serializes `cacheId` as workbox-core's cache name
          // prefix, so the precache cache becomes `<stamp>-precache-v2-*`.
          cacheId: pwaCachePrefix,
          navigateFallback: null,
          runtimeCaching: [
            {
              // Chirpy-mirror: HTML is Cache-First so revisits load instantly
              // and work offline. Freshness comes from the build-stamped
              // cache name, not from network revalidation.
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'CacheFirst',
              options: {
                cacheName: `${pwaCachePrefix}-pages`,
                expiration: { maxEntries: 100 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              // CDN images are opaque responses; cache them so they render
              // from disk instead of re-downloading on every reload.
              urlPattern: ({ request }) => request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: `${pwaCachePrefix}-images`,
                expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        }
      })
    ] : []),
  ],

  i18n: {
    defaultLocale: new Intl.Locale(defaultLocale).language,
    locales: supportedLocales.map((code) => ({
      codes: [code],
      // Segment comes from the single shared map so it stays consistent with
      // the URLs posts.ts / validate-routes build. Default keeps its label.
      path: code === defaultLocale
        ? new Intl.Locale(defaultLocale).language
        : (segmentMap.get(code) ?? new Intl.Locale(code).language),
    })),
    routing: {
      prefixDefaultLocale: false,
    }
  },

  markdown: {
    shikiConfig: {
      theme: 'css-variables',
    },
    processor: unified({
      // GFM is registered explicitly so `singleTilde` can be disabled:
      // literal ranges like `1~2` must not be parsed as strikethrough.
      // `~~text~~` remains the only strikethrough syntax.
      gfm: false,
      remarkRehype: {
        footnoteLabelTagName: 'span',
      },
      remarkPlugins: [
        [remarkGfm, { singleTilde: false }],
        remarkImageAttributes,
        markdownRemarkPlugins.directive,
        remarkDirectives,
        remarkYoutube,
        remarkVideo,
        remarkAudio,
        remarkMediaCaption,
        remarkCdnImages,
        markdownRemarkPlugins.math,
        conditionalMath,
        /** @type {any} */ (remarkDeflist)
      ],
      rehypePlugins: [
        rehypeRaw,
        rehypeKatex,
        rehypeFootnoteTooltip,
        rehypeImageWrapper,
        rehypeTableWrapper,
        rehypeStripComments
      ]
    })
  },

  vite: {
    plugins: [
      pagefind({
        outputDirectory: 'dist',
        bundleDirectory: 'pagefind',
        developStrategy: 'lazy',
      }),
    ],
    optimizeDeps: {
      // Prevent dev-toolbar MIME error (empty Content-Type): mermaid is only
      // dynamically imported at runtime in mermaidThemeSync.ts, so it misses
      // the initial scan and triggers dep re-optimization during dev.
      // Pre-bundling it avoids that race. See docs/ai-docs/development/build-cache.md
      include: ['mermaid'],
    },
  },

});
