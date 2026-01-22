import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 7777;

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
      '@api': path.resolve(__dirname, './src/api'),
      '@controllers': path.resolve(__dirname, './src/controllers'),
      '@common': path.resolve(__dirname, './src/common'),
      '@utils': path.resolve(__dirname, './src/common/utils'),
      '@constants': path.resolve(__dirname, './src/common/constants'),
      '@enums': path.resolve(__dirname, './src/common/enums'),
      '@app-types': path.resolve(__dirname, './src/common/types'),
    },
  },
  server: {
    port: PORT,
  },
});
