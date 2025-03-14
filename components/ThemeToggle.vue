<template>
  <div class="theme-toggle-container" @click="toggleColorMode" :title="buttonTitle" aria-label="Toggle theme">
    <button class="theme-toggle" ref="toggleButton">
      <SunIcon v-if="colorMode.value === 'dark'" class="icon" />
      <MoonIcon v-else class="icon" />
    </button>
    <!-- Animation overlay -->
    <Teleport to="root">
      <div class="theme-transition-overlay" :class="{
        'light-expanding': isAnimating && targetMode === 'light',
        'dark-contracting': isAnimating && targetMode === 'dark'
      }" :style="overlayStyle" ref="overlay"></div>
    </Teleport>
  </div>
</template>

<script setup>
import { SunIcon, MoonIcon } from 'lucide-vue-next'

const colorMode = useColorMode()
const toggleButton = ref(null)
const overlay = ref(null)
const isAnimating = ref(false)
const targetMode = ref(colorMode.value)

const overlayStyle = reactive({
  '--button-x': '50%',
  '--button-y': '50%',
  '--max-distance': '100vmax'
})

// Initially set to system preference
if (colorMode.preference === 'system') {
  colorMode.preference = colorMode.value
}

const buttonTitle = computed(() => {
  return colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
})

function calculateMaxDistance(x, y) {
  const corners = [
    { x: 0, y: 0 },
    { x: window.innerWidth, y: 0 },
    { x: 0, y: window.innerHeight },
    { x: window.innerWidth, y: window.innerHeight }
  ]
  return Math.max(...corners.map(corner =>
    Math.hypot(corner.x - x, corner.y - y)
  ))
}

async function toggleColorMode() {
  console.log('before: ', colorMode)

  targetMode.value = colorMode.value === 'dark' ? 'light' : 'dark'

  if (toggleButton.value) {
    const rect = toggleButton.value.getBoundingClientRect()
    const buttonCenterX = rect.left + rect.width / 2
    const buttonCenterY = rect.top + rect.height / 2

    overlayStyle['--button-x'] = `${buttonCenterX}px`
    overlayStyle['--button-y'] = `${buttonCenterY}px`
    overlayStyle['--max-distance'] = `${calculateMaxDistance(buttonCenterX, buttonCenterY)}px`
  }

  isAnimating.value = true

  setTimeout(() => {
    colorMode.preference = targetMode.value
    setTimeout(() => {
      isAnimating.value = false
    }, 100)
  }, 300)

  console.log('after: ', colorMode)
}
</script>

<style scoped>
.theme-toggle-container {
  position: relative;
  display: inline-block;
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 102;
  padding: 0;
  width: 20px;
  height: 20px;
}

.theme-toggle .icon {
  color: var(--color-text);
}

/* Theme transition overlay */
.theme-transition-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1002;
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* Light mode expanding animation */
.light-expanding {
  background-color: #ffffff;
  clip-path: circle(0% at var(--button-x) var(--button-y));
  animation: expand-light 0.6s ease-out forwards;
}

/* Dark mode contracting animation */
.dark-contracting {
  background-color: #222222;
  clip-path: circle(150% at var(--button-x) var(--button-y));
  animation: contract-dark 0.6s ease-out forwards;
}

@keyframes expand-light {
  0% {
    clip-path: circle(0% at var(--button-x) var(--button-y));
    opacity: 1;
  }

  100% {
    clip-path: circle(150% at var(--button-x) var(--button-y));
    opacity: 1;
  }
}

@keyframes contract-dark {
  0% {
    clip-path: circle(150% at var(--button-x) var(--button-y));
    opacity: 1;
  }

  100% {
    clip-path: circle(0% at var(--button-x) var(--button-y));
    opacity: 1;
  }
}

/* Define light mode colors */
.light-mode {
  --color-background: #ffffff;
  --color-background-secondary: #f0f0f0;
  --color-text: #333333;
}

/* Define dark mode colors */
.dark-mode {
  --color-background: #222222;
  --color-background-secondary: #333333;
  --color-text: #ffffff;
}

/* Apply colors based on selected theme */
html {
  background-color: var(--color-background);
  color: var(--color-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>