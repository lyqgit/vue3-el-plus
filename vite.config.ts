import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {fileURLToPath, URL} from 'node:url';
import UnoCSS from 'unocss/vite';
import {viteMockServe} from 'vite-plugin-mock';

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    viteMockServe({
      mockPath: 'mock',
      enable: process.env.NODE_ENV === 'development',
      watchFiles: true
    })
  ],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/lib.ts', import.meta.url)),
      name: 'vue3-el-plus',
      fileName: 'vue3-el-plus'
    },
    rollupOptions: {
      external: ['vue', 'element-plus', '@vueuse/core', '@element-plus/icons-vue'],
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          '@vueuse/core': 'VueUse',
          '@element-plus/icons-vue': 'ElementPlusIconsVue'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.js', '.vue', '.json', '.ts']
  }
});
