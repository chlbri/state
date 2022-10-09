// vite.config.ts
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      '@-constants': resolve(__dirname, './src/constants'),
      '@-helpers': resolve(__dirname, './src/helpers'),
      '@-types': resolve(__dirname, './src/types'),
      '@-functions': resolve(__dirname, './src/functions'),
    },
  },
});
