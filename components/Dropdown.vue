<template>
  <div class="dropdown" @click="toggle" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <div class="trigger">
      <slot name="trigger"></slot>
    </div>
    <div class="dropdown-content" v-if="isOpen">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  openOn: {
    type: String,
    default: 'click',
    validator: (value: string) => ['click', 'hover'].includes(value)
  }
})

const isOpen = ref(false)

const toggle = () => {
  if (props.openOn === 'click') {
    isOpen.value = !isOpen.value
  }
}

const onMouseEnter = () => {
  if (props.openOn === 'hover') {
    isOpen.value = true
  }
}

const onMouseLeave = () => {
  if (props.openOn === 'hover') {
    isOpen.value = false
  }
}
</script>

<style scoped>
.dropdown {
  position: relative;
}

.dropdown-content {
  position: absolute;
  top: 100;
  left: 0;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.375rem;
  min-width: 8rem;
  z-index: 10;
  white-space: nowrap;
}
</style>