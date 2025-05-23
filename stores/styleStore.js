import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStyleStore = defineStore(
  'style',
  () => {
    // 白天/夜间模式数据
    const isDark = ref(false)
    // 切换白天/夜间模式
    const switchLightMode = () => {
      isDark.value = !isDark.value
    }
    return { isDark, switchLightMode }
  },
  {
    persist: true,
  }
)
