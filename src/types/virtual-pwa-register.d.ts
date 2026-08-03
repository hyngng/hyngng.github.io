/**
 * `virtual:pwa-register` 모듈에 대한 TypeScript 선언.
 * vite-plugin-pwa가 빌드 타임에 제공하는 가상 모듈이다.
 */
declare module 'virtual:pwa-register' {
  import type { RegisterSWOptions } from 'vite-plugin-pwa';

  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => void;
}
