import type { RouterConfig } from '@nuxt/schema'

export default {
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        top: 80, // 保持 20px 的间距
        behavior: 'smooth',
      }
    }
    return { top: 0 }
  },
} satisfies RouterConfig
