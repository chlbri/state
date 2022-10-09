// vite.config.ts
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      '@-constants': path.resolve(__dirname, './src/constants'),
      '@-helpers': path.resolve(__dirname, './src/helpers'),
      '@-types': path.resolve(__dirname, './src/types'),
      '@-functions': path.resolve(__dirname, './src/functions'),
    },
  },
});
