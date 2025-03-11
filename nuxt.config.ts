// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  alias:{
    assets: "/<rootDir>/assets",
  },
  css: ["~/assets/css/main.css"],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    "@element-plus/nuxt",
    'nuxt-shiki',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/color-mode'
  ],
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
        }
      },
    },
  },
  build: {
    transpile: ['jsencrypt'],
  }
})