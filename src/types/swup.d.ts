// @swup/astro stores its instance on `window` when `globalInstance: true`
// (see astro.config.mjs). Only the navigate method is used client-side.
declare global {
  interface Window {
    swup?: {
      navigate: (url: string) => void;
    };
  }
}

export {};
