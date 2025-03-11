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
.light-mode .banner {
  --banner-color: oklch(.97 .01 var(--hue));
  --title: #374151;
  --sub-title: #6b7280;
}

.dark-mode .banner {
  --banner-color: oklch(.20 .014 var(--hue));
  --title: rgb(248, 250, 252);
  --sub-title: rgb(231, 236, 243);
}

.banner {
  background-color: var(--banner-color);
  /* #f3f4f6 */
  padding: 3rem 1rem;
  text-align: center;
}

.banner-title {
  font-size: 1.875rem;
  font-weight: bold;
  color: var(--title);
  margin-bottom: 0.5rem;
}

.banner-subtitle {
  color: var(--sub-title);
  margin-bottom: 1rem;
}
</style>