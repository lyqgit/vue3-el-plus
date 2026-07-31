import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {fileURLToPath, URL} from 'node:url';
import UnoCSS from 'unocss/vite';

export default defineConfig({
  plugins: [vue(), UnoCSS()],
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
