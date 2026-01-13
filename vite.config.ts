import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/fiercesloth-JSFE2025Q3/async-race/',
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@data': path.resolve(__dirname, './src/data'),
      '@common': path.resolve(__dirname, './src/common'),
      '@utils': path.resolve(__dirname, './src/common/utils'),
      '@constants': path.resolve(__dirname, './src/common/constants'),
      '@enums': path.resolve(__dirname, './src/common/enums'),
      '@app-types': path.resolve(__dirname, './src/common/types'),
    },
  },
  server: {
    port: 7777,
  },
});