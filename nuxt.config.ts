// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  alias:{
    assets: "/<rootDir>/assets",
  },
  css: ["~/assets/css/main.css"],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: true,
  modules: [
    '@nuxt/content',
    "@element-plus/nuxt",
    'nuxt-shiki',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/test-utils',
    '@nuxt/test-utils/module'
  ],

  piniaPluginPersistedstate: {
    storage: 'localStorage',
    debug: true,
  },

  // shiki: {
  //   theme: 'material-theme-lighter',
  // },
  
  plugins: [
    '~/plugins/element-plus-icons.js',
  ],
  typescript: { includeWorkspace: true  },
  content: {
    build: {
      markdown: {
        highlight: {
          // Theme used in all color schemes.
          theme: 'material-theme-lighter',
          langs: [
            'c',
            'cpp',
            'java'
          ]
        },
        toc: {
          depth: 2, // include h3 headings
          searchDepth: 2
        },
      },
    },
  },
  build: {
    transpile: ['jsencrypt'],
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false, 
    },
  },
  router: {
    options: {
      // scrollBehaviorType: 'smooth'
    }
  },
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://120.76.138.103:5050/', // 目标服务器地址
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  },
})