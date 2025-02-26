import { resolve } from 'path'; // Use `path` module instead
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // Use `path.resolve` to get the directory path
    },
  },
  optimizeDeps: {
    exclude: ['zlib-sync'],
  },
  build: {
    commonjsOptions: {
      include: [/zlib-sync/],
    },
  },
});
