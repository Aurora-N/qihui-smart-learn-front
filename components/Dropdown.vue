<template>
  <div class="dropdown" @click="toggle" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <div class="trigger">
      <slot name="trigger"></slot>
    </div>
    <div class="dropdown-wrapper" v-if="isOpen">
      <div class="dropdown-content">
        <slot></slot>
      </div>
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

.dropdown-wrapper {
  position: absolute;
  top: 100;
  padding-top: 6px;
}

.dropdown-content {
  left: 0;
  color: var(--color-text);
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  padding: 0.375rem;
  min-width: 8rem;
  z-index: 10;
  white-space: nowrap;
}
</style>

<style>
/* Dropdown内部的a标签样式 */
.dropdown-content a {
  display: block;
  padding: 0.5rem 1rem;
  color: var(--color-text);
  text-decoration: none;
}

.dropdown-content a:hover {
  background-color: var(--color-background-hover);
  border-radius: 0.375rem;
  text-decoration: none;
}
</style>