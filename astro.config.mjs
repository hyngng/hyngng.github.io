// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkCdnImages } from './src/plugins/remark-cdn-images.ts';
import remarkDirective from 'remark-directive';
import { remarkDirectives } from './src/plugins/remark-directives.mjs';
import { remarkYoutube } from './src/plugins/remark-youtube.mjs';
import { remarkVideo } from './src/plugins/remark-video.mjs';
import { rehypeImageWrapper } from './src/plugins/rehype-image-wrapper.mjs';
import { rehypeTableWrapper } from './src/plugins/rehype-table-wrapper.mjs';
import { rehypeStripComments } from './src/plugins/rehype-strip-comments.mjs';
import { rehypeFootnoteTooltip } from './src/plugins/rehype-footnote-tooltip.mjs';
import { SITE, defaultLocale, defaultLocaleBcp47, supportedLocales } from './src/settings/site.settings';
import { validateRoutes } from './src/integrations/validate-routes';
import astroPwa from './src/integrations/astro-pwa';

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkDeflist from 'remark-deflist';
import { remarkImageAttributes } from './src/plugins/remark-image-attributes.mjs';



import { unified } from '@astrojs/markdown-remark';

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
          background_color: '#F7F7F7',
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
          // Static MPA: precache only immutable hashed assets, never HTML.
          // HTML precache would serve stale pages Cache-First until the SW
          // updates, so navigation is handled by a NetworkFirst runtime route.
          globPatterns: ['**/*.{js,css,svg,png,ico,woff,woff2}'],
          navigateFallback: null,
          runtimeCaching: [
            {
              // Serve HTML network-first so content is always fresh without a
              // hard reload; offline falls back to the last visited copy.
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'pages',
                networkTimeoutSeconds: 3,
                expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
          ],
        }
      })
    ] : []),
  ],

  i18n: {
    defaultLocale,
    locales: supportedLocales,
    routing: {
      prefixDefaultLocale: false,
    }
  },

  markdown: {
    shikiConfig: {
      theme: 'css-variables',
    },
    processor: unified({
      remarkPlugins: [
        remarkImageAttributes,
        remarkDirective,
        remarkDirectives,
        remarkYoutube,
        remarkVideo,
        remarkCdnImages,
        remarkMath,
        /** @type {any} */ (remarkDeflist)
      ],
      rehypePlugins: [
        rehypeKatex,
        rehypeFootnoteTooltip,
        rehypeImageWrapper,
        rehypeTableWrapper,
        rehypeStripComments
      ]
    })
  },

  fonts: [
    {
      provider: fontProviders.local(),
      name: "Pretendard",
      cssVariable: "--font-pretendard",
      options: {
        variants: [
          { weight: 300, style: "normal", src: ["./src/assets/fonts/Pretendard-1.3.9/web/static/woff2-subset/Pretendard-Light.subset.woff2"] },
          { weight: 400, style: "normal", src: ["./src/assets/fonts/Pretendard-1.3.9/web/static/woff2-subset/Pretendard-Regular.subset.woff2"] },
          { weight: 500, style: "normal", src: ["./src/assets/fonts/Pretendard-1.3.9/web/static/woff2-subset/Pretendard-Medium.subset.woff2"] },
          { weight: 600, style: "normal", src: ["./src/assets/fonts/Pretendard-1.3.9/web/static/woff2-subset/Pretendard-SemiBold.subset.woff2"] },
          { weight: 700, style: "normal", src: ["./src/assets/fonts/Pretendard-1.3.9/web/static/woff2-subset/Pretendard-Bold.subset.woff2"] },
        ],
      },
    },
  ],
});
