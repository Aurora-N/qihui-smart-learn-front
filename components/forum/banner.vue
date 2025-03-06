<script setup>
const props = defineProps({
  title: String,
  subTitle: String,
  hue: {
    type: Number,
    default: 250,
  }
})
</script>

<template>
  <div class="banner" :style="{ '--hue': props.hue }">
    <h1 class="banner-title">{{ props.title }}</h1>
    <p class="banner-subtitle">{{ props.subTitle }}</p>
    <slot />
  </div>
</template>

<style scoped>
.banner {
  background-color: oklch(.97 .01 var(--hue));
  /* #f3f4f6 */
  padding: 3rem 1rem;
  text-align: center;
}

.banner-title {
  font-size: 1.875rem;
  font-weight: bold;
  color: #374151;
  margin-bottom: 0.5rem;
}

.banner-subtitle {
  color: #6b7280;
  margin-bottom: 1rem;
}
</style>