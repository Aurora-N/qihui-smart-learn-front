// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/content',
    '@element-plus/nuxt',
    'nuxt-shiki',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/test-utils',
    '@nuxt/test-utils/module',
  ],

  // shiki: {
  //   theme: 'material-theme-lighter',
  // },

  plugins: ['~/plugins/element-plus-icons.js'],
  ssr: true,
  devtools: { enabled: true },
  app: {
    head: {
      title: '启慧智学——基于多模态知识图谱的Web开发学习平台', // default fallback title
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/logo_light.png' }],
    },
  },
  css: ['~/assets/style/main.scss'],
  router: {
    options: {
      // scrollBehaviorType: 'smooth'
    },
  },
  content: {
    build: {
      markdown: {
        highlight: {
          // Theme used in all color schemes.
          theme: 'material-theme-lighter',
          langs: ['c', 'cpp', 'java'],
        },
        toc: {
          depth: 2, // include h3 headings
          searchDepth: 2,
        },
      },
      pathMeta: {
        slugifyOptions: {
          // 保留路径中的汉字（非ascii字符）
          remove: /[$*+~()'"!\-=#?:@]/g,
        },
      },
    },
  },

  alias: {
    assets: '/<rootDir>/assets',
  },
  build: {
    transpile: ['jsencrypt'],
  },
  compatibilityDate: '2024-11-01',
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false,
    },
  },
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://120.76.138.103:5050/', // 目标服务器地址
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
  },
  typescript: { includeWorkspace: true },

  piniaPluginPersistedstate: {
    storage: 'localStorage',
    debug: true,
  },
})
