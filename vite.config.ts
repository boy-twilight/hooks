import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { join } from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
import { visualizer } from 'rollup-plugin-visualizer';
import AutoPrefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ArcoResolver()],
    }),
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: true,
        }),
      ],
    }),
    visualizer({
      open: true,
    }),
  ],
  base: './',
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
    },
  },
  server: {
    open: true,
    port: 4000,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    minify: 'terser',
    assetsDir: 'static',
    assetsInlineLimit: 1024 * 5,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.indexOf('node_modules') != -1) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString();
          }
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/')
            : [];
          const fileName =
            facadeModuleId[facadeModuleId.length - 2] || '[name]';
          return `js/${fileName}/[name].[hash].js`;
        },
      },
    },
  },
  css: {
    devSourcemap: false,
    postcss: {
      plugins: [
        AutoPrefixer({
          // 自动添加前缀
          overrideBrowserslist: [
            'Android 4.1',
            'iOS 7.1',
            'Chrome > 31',
            'ff > 31',
            'ie >= 8',
            'last 2 versions',
          ],
          grid: true,
        }),
      ],
    },
  },
});
