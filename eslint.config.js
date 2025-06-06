import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    // Rules for module authors
    tooling: true,
    // Rules for formatting
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: false,
    },
  },
  dirs: {
    src: ['./playground'],
  },
}).append(
  // Your custom configs here
  {
    files: ['**/*.vue', '**/*.ts', '**/*.js'],
    languageOptions: {
      globals: {
        // Nuxt globals
        useNuxtApp: 'readonly',
        useCookie: 'readonly',
        useRouter: 'readonly',
        useRoute: 'readonly',
        useColorMode: 'readonly',
        defineNuxtPlugin: 'readonly',
        defineNuxtConfig: 'readonly',
        definePageMeta: 'readonly',
        useSeoMeta: 'readonly',
        useHead: 'readonly',
        useAsyncData: 'readonly',
        queryCollection: 'readonly',
        queryCollectionSearchSections: 'readonly',
        navigateTo: 'readonly',
        nextTick: 'readonly',
        defineAsyncComponent: 'readonly',
        resolveComponent: 'readonly',
        inject: 'readonly',
        provide: 'readonly',
        onBeforeMount: 'readonly',
        onMounted: 'readonly',
        onBeforeUnmount: 'readonly',
        defineNuxtRouteMiddleware: 'readonly',
        // Element Plus globals
        ElMessage: 'readonly',
        // Pinia globals
        piniaPluginPersistedstate: 'readonly',
        useUserStore: 'readonly',
      },
    },
    rules: {
      // 自定义规则
      'no-console': 'warn',
      'no-debugger': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',
      'vue/no-v-html': 'warn',
      'vue/require-v-for-key': 'error',
      'vue/no-unused-vars': 'warn',
      'no-undef': 'error',
      'no-unused-vars': 'warn',
      // 放宽一些格式规则
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      '@stylistic/arrow-parens': 'off',
      '@stylistic/comma-dangle': 'off',
      '@stylistic/brace-style': 'off',
      '@stylistic/operator-linebreak': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-indent': 'off',
      '@stylistic/quotes': 'off',
      '@stylistic/indent-binary-ops': 'off',
      'vue/operator-linebreak': 'off',
      'vue/comma-dangle': 'off',
      'regexp/no-super-linear-backtracking': 'warn',
    },
  }
)
