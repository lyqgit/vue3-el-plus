import {defineConfig, globalIgnores} from 'eslint/config';
import js from '@eslint/js';
import typescriptConfig from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import pluginPrettier from 'eslint-plugin-prettier';
import skipFormatting from 'eslint-config-prettier/flat';

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,js,mjs,jsx,ts,tsx}']
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      parserOptions: {
        parser: typescriptConfig.parser
      },
      globals: {
        // Vue 3 Composition API 自动导入
        ref: 'readonly',
        reactive: 'readonly',
        computed: 'readonly',
        watch: 'readonly',
        onMounted: 'readonly',
        onUnmounted: 'readonly',
        getCurrentInstance: 'readonly',
        toRefs: 'readonly',
        toRaw: 'readonly',
        provide: 'readonly',
        inject: 'readonly',
        nextTick: 'readonly',
        useSlots: 'readonly',
        // Vue 3 宏
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        defineOptions: 'readonly',
        withDefaults: 'readonly',
        // vue-router
        useRouter: 'readonly',
        useRoute: 'readonly',
        // map
        qq: 'readonly',
        // dom
        document: 'readonly'
      }
    }
  },

  js.configs.recommended,
  ...typescriptConfig.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    plugins: {
      prettier: pluginPrettier
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'warn',
      'vue/multi-word-component-names': 'off',
      semi: ['error', 'always'],
      'object-curly-spacing': ['error', 'never'],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: {
            max: 1
          },
          multiline: {
            max: 1
          }
        }
      ],
      'vue/first-attribute-linebreak': [
        'error',
        {
          singleline: 'ignore',
          multiline: 'below'
        }
      ],
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-indent': [
        'error',
        2,
        {
          attribute: 1,
          baseIndent: 1,
          closeBracket: 0,
          alignAttributesVertically: true,
          ignores: []
        }
      ],
      'guard-for-in': 'error'
    }
  },

  skipFormatting
]);
