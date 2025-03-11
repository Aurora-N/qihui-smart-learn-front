import * as ElIcons from '@element-plus/icons-vue'

export default defineNuxtPlugin((nuxtApp) => {
  // 注册所有 Element Plus 图标
  Object.entries(ElIcons).forEach(([name, component]) => {
    nuxtApp.vueApp.component(name, component)
  })
})
