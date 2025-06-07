<template>
  <button
    class="theme-toggle"
    :title="buttonTitle"
    aria-label="Toggle theme"
    @click="toggleColorMode"
  >
    <SunIcon v-show="colorMode.value === 'dark'" class="icon" />
    <MoonIcon v-show="colorMode.value === 'light'" class="icon" />
  </button>
</template>

<script setup>
import { SunIcon, MoonIcon } from 'lucide-vue-next'

const colorMode = useColorMode()

// Initially set to system preference
if (colorMode.preference === 'system') {
  colorMode.preference = colorMode.value
}

const buttonTitle = computed(() => {
  return colorMode.value === 'dark' ? '切换到亮色模式' : '切换到暗色模式'
})

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  padding: 0;
}

.theme-toggle .icon {
  width: 20px;
  height: 20px;
  color: var(--color-text);
}
</style>
