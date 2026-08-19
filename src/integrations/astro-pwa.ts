import type { AstroConfig, AstroIntegration } from 'astro';
import type { Plugin, ResolvedConfig } from 'vite';
import type { OutputBundle } from 'rollup';
import type { VitePWAOptions, VitePluginPWAAPI } from 'vite-plugin-pwa';
import { VitePWA } from 'vite-plugin-pwa';
import type { ManifestTransform } from 'workbox-build';
import { fileURLToPath } from 'node:url';

interface PwaContext {
  api: VitePluginPWAAPI | undefined;
  previewOrSync: boolean;
  doBuild: boolean;
  scope: string;
  trailingSlash: 'ignore' | 'always' | 'never';
  useDirectoryFormat: boolean;
}

function astroPwa(options: Partial<VitePWAOptions> = {}): AstroIntegration {
  const ctx: PwaContext = {
    api: undefined,
    previewOrSync: false,
    doBuild: false,
    scope: '/',
    trailingSlash: 'ignore',
    useDirectoryFormat: true,
  };
  const astroPWAContext = (): PwaContext => ctx;

  return {
    name: 'astro-pwa',
    hooks: {
      'astro:config:setup': ({ command, config, updateConfig }) => {
        if (command === 'preview' || command === 'sync') {
          ctx.previewOrSync = true;
          return;
        }
        ctx.scope = config.base ?? config.vite?.base ?? '/';
        ctx.trailingSlash = config.trailingSlash;
        ctx.useDirectoryFormat = config.build.format === 'directory';

        let plugins = getViteConfiguration(config, options, ctx.useDirectoryFormat, astroPWAContext);
        plugins = plugins.filter((p) => 'name' in p && p.name !== 'vite-plugin-pwa:build');
        if (command === 'build') {
          plugins = plugins.filter((p) => 'name' in p && p.name !== 'vite-plugin-pwa:dev-sw');
          plugins.push({
            name: 'astro-pwa:build',
            applyToEnvironment(env: { name: string }) {
              return env.name === 'client';
            },
            configResolved(resolvedConfig: ResolvedConfig) {
              if (!resolvedConfig.build.ssr) {
                const pwaPlugin = (
                  resolvedConfig.plugins as unknown as Array<{ name?: string; api?: VitePluginPWAAPI }>
                ).find((p) => p.name === 'vite-plugin-pwa');
                ctx.api = pwaPlugin?.api;
              }
            },
            async generateBundle(_outputOptions: unknown, bundle: unknown) {
              const api = ctx.api;
              if (api) {
                api.generateBundle(
                  bundle as OutputBundle,
                  this as unknown as Parameters<typeof api.generateBundle>[1],
                );
              }
            },
            closeBundle: {
              sequential: true,
              order: 'post',
              async handler() {
                const api = ctx.api;
                const pwaAssetsGenerator = api && (await api.pwaAssetsGenerator());
                if (pwaAssetsGenerator) {
                  await pwaAssetsGenerator.generate();
                }
              },
            },
          });
        }
        updateConfig({ vite: { plugins } });
      },
      'astro:build:done': async () => {
        if (ctx.previewOrSync) return;
        ctx.doBuild = true;
        const api = ctx.api;
        if (api && !api.disabled) {
          await api.generateSW();
        }
      },
    },
  };
}

function createManifestTransform(
  astroPWAContext: () => PwaContext,
): ManifestTransform {
  return async (entries) => {
    const { doBuild, trailingSlash, scope, useDirectoryFormat } = astroPWAContext();
    if (!doBuild) return { manifest: entries, warnings: [] };
    for (const e of entries) {
      if (typeof e === 'string' || !e.url.endsWith('.html')) continue;
      const url = e.url.startsWith('/') ? e.url.slice(1) : e.url;
      if (url === 'index.html') {
        e.url = scope;
      } else {
        const parts = url.split('/');
        parts[parts.length - 1] = parts[parts.length - 1].replace(/\.html$/, '');
        e.url = useDirectoryFormat
          ? parts.length > 1
            ? parts.slice(0, parts.length - 1).join('/')
            : parts[0]
          : parts.join('/');
        if (trailingSlash === 'always') e.url += '/';
      }
    }
    return { manifest: entries, warnings: [] };
  };
}

function getViteConfiguration(
  config: AstroConfig,
  options: Partial<VitePWAOptions>,
  directoryFormat: boolean,
  astroPWAContext: () => PwaContext,
): Plugin[] {
  const existingPlugins = (config.vite?.plugins ?? []) as unknown as Array<{ name?: string }>;
  const plugin = existingPlugins.flat(Number.POSITIVE_INFINITY).find((p) => p.name === 'vite-plugin-pwa');
  if (plugin) {
    throw new Error('Remove the vite-plugin-pwa plugin from Vite Plugins entry in the Astro config file and configure it via the astro-pwa integration');
  }
  const server = config.output === 'server';
  if (server) {
    options.outDir = fileURLToPath(config.build.client);
  }
  const {
    strategies = 'generateSW',
    registerType = 'prompt',
    injectRegister,
    workbox = {},
    ...rest
  } = options;
  let assets = config.build.assets ?? '_astro/';
  if (assets[0] === '/') {
    assets = assets.slice(1);
  }
  if (assets[assets.length - 1] !== '/') {
    assets += '/';
  }
  if (strategies === 'generateSW') {
    const useWorkbox = { ...workbox };
    const newOptions: Partial<VitePWAOptions> = {
      ...rest,
      strategies,
      registerType,
      injectRegister,
    };
    if (server) {
      useWorkbox.globDirectory = options.outDir;
    }
    if (!('navigateFallback' in useWorkbox)) {
      useWorkbox.navigateFallback = config.base ?? config.vite?.base ?? '/';
    }
    if (directoryFormat) {
      useWorkbox.directoryIndex = 'index.html';
    }
    newOptions.workbox = useWorkbox;
    if (!('dontCacheBustURLsMatching' in newOptions.workbox)) {
      newOptions.workbox.dontCacheBustURLsMatching = new RegExp(assets);
    }
    if (!newOptions.workbox.manifestTransforms) {
      newOptions.workbox.manifestTransforms = newOptions.workbox.manifestTransforms ?? [];
      newOptions.workbox.manifestTransforms.push(
        createManifestTransform(astroPWAContext),
      );
    }
    return VitePWA(newOptions);
  }
  options.injectManifest = options.injectManifest ?? {};
  if (server) {
    options.injectManifest.globDirectory = options.outDir;
  }
  if (!('dontCacheBustURLsMatching' in options.injectManifest)) {
    options.injectManifest.dontCacheBustURLsMatching = new RegExp(assets);
  }
  if (!options.injectManifest.manifestTransforms) {
    options.injectManifest.manifestTransforms = options.injectManifest.manifestTransforms ?? [];
    options.injectManifest.manifestTransforms.push(
      createManifestTransform(astroPWAContext),
    );
  }
  return VitePWA(options);
}

export default astroPwa;
