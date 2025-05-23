<script setup>
const props = defineProps({
  title: String,
  subTitle: String,
  hue: {
    type: Number,
    default: 250,
  },
})
</script>

<template>
  <div class="banner" :style="{ '--hue': props.hue }">
    <div class="bg-layer bg-layer-1" />
    <div class="bg-layer bg-layer-2" />

    <div class="large-element large-book-left" />
    <div class="large-element large-page-right" />

    <div class="quiz-element pencil-left" />
    <div class="quiz-element checkmark-right" />
    <div class="quiz-element quiz-paper-bottom" />

    <div class="banner-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.light-mode .banner {
  --banner-color: oklch(0.97 0.01 var(--hue));
  --title: #374151;
  --sub-title: #6b7280;
  --decoration-color: oklch(0.85 0.03 var(--hue));
  --decoration-accent: oklch(0.75 0.05 var(--hue));
  --layer-color-1: oklch(0.92 0.02 var(--hue));
  --layer-color-2: oklch(0.94 0.015 var(--hue));
  --floating-color: oklch(0.88 0.025 var(--hue));
  --quiz-element-color: oklch(0.8 0.04 var(--hue));
  --quiz-element-accent: oklch(0.7 0.06 var(--hue));
  --floating-text-color: #4b5563;
}

.dark-mode .banner {
  --banner-color: oklch(0.2 0.014 var(--hue));
  --title: rgb(248, 250, 252);
  --sub-title: rgb(231, 236, 243);
  --decoration-color: oklch(0.25 0.03 var(--hue));
  --decoration-accent: oklch(0.3 0.05 var(--hue));
  --layer-color-1: oklch(0.18 0.02 var(--hue));
  --layer-color-2: oklch(0.22 0.015 var(--hue));
  --floating-color: oklch(0.28 0.025 var(--hue));
  --quiz-element-color: oklch(0.35 0.04 var(--hue));
  --quiz-element-accent: oklch(0.4 0.06 var(--hue));
  --floating-text-color: #e5e7eb;
}

.banner {
  background-color: var(--banner-color);
  padding: 5rem 1rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  min-height: calc(100vh - 55px);
}

/* Background layers for depth */
.bg-layer {
  position: absolute;
  border-radius: 50%;
}

.bg-layer-1 {
  width: 120%;
  height: 120%;
  background-color: var(--layer-color-1);
  top: -30%;
  left: -10%;
}

.bg-layer-2 {
  width: 80%;
  height: 80%;
  background-color: var(--layer-color-2);
  bottom: -20%;
  right: -20%;
}

/* Large decorative elements */
.large-element {
  position: absolute;
}

.large-book-left {
  width: 200px;
  height: 250px;
  background-color: var(--decoration-color);
  border-radius: 10px 30px 30px 10px;
  left: -60px;
  top: 50%;
  transform: translateY(-50%) rotate(-15deg);
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.1);
  position: absolute;
}

.large-book-left::after {
  content: '';
  position: absolute;
  left: 30px;
  top: 30px;
  width: 140px;
  height: 8px;
  background-color: var(--decoration-accent);
  box-shadow:
    0 30px 0 var(--decoration-accent),
    0 60px 0 var(--decoration-accent),
    0 90px 0 var(--decoration-accent),
    0 120px 0 var(--decoration-accent),
    0 150px 0 var(--decoration-accent);
}

.large-page-right {
  width: 180px;
  height: 230px;
  background-color: var(--decoration-color);
  border-radius: 5px;
  right: -50px;
  top: 50%;
  transform: translateY(-50%) rotate(15deg);
  position: absolute;
}

.large-page-right::after {
  content: '';
  position: absolute;
  left: 20px;
  top: 20px;
  width: 140px;
  height: 6px;
  background-color: var(--decoration-accent);
  box-shadow:
    0 15px 0 var(--decoration-accent),
    0 30px 0 var(--decoration-accent),
    0 45px 0 var(--decoration-accent),
    0 60px 0 var(--decoration-accent),
    0 75px 0 var(--decoration-accent),
    0 90px 0 var(--decoration-accent),
    0 105px 0 var(--decoration-accent),
    0 120px 0 var(--decoration-accent),
    0 135px 0 var(--decoration-accent),
    0 150px 0 var(--decoration-accent);
}

/* Quiz-related decorative elements */
.quiz-element {
  position: absolute;
  background-color: var(--quiz-element-color);
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
}

/* Pencil element */
.pencil-left {
  width: 15px;
  height: 120px;
  left: 15%;
  top: 20%;
  transform: rotate(-35deg);
  border-radius: 2px;
  background: linear-gradient(
    to bottom,
    var(--quiz-element-accent) 0%,
    var(--quiz-element-accent) 10%,
    var(--quiz-element-color) 10%,
    var(--quiz-element-color) 90%,
    #f59e0b 90%,
    #f59e0b 100%
  );
}

.pencil-left::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 0;
  height: 0;
  border-left: 7.5px solid transparent;
  border-right: 7.5px solid transparent;
  border-top: 15px solid #f59e0b;
}

/* Checkmark */
.checkmark-right {
  width: 50px;
  height: 50px;
  right: 15%;
  top: 30%;
  background-color: transparent;
  box-shadow: none;
}

.checkmark-right::before {
  content: '✓';
  position: absolute;
  font-size: 60px;
  font-weight: bold;
  color: var(--quiz-element-accent);
  top: -20px;
  left: 0;
}

/* Quiz paper */
.quiz-paper-bottom {
  width: 100px;
  height: 130px;
  background-color: var(--color-background);
  border-radius: 5px;
  bottom: 10%;
  left: 10%;
  transform: rotate(-10deg);
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15);
}

.quiz-paper-bottom::after {
  content: '';
  position: absolute;
  left: 15px;
  top: 20px;
  width: 70px;
  height: 4px;
  background-color: var(--quiz-element-accent);
  box-shadow:
    0 15px 0 var(--quiz-element-accent),
    0 30px 0 var(--quiz-element-accent),
    0 45px 0 var(--quiz-element-accent),
    0 60px 0 var(--quiz-element-accent);
}

/* Banner content */
.banner-content {
  max-width: 1000px;
  min-height: 100%;
  width: 100%;
  position: relative;
}

.banner-title {
  font-size: 2.25rem;
  font-weight: bold;
  color: var(--title);
  margin-bottom: 0.75rem;
}

.banner-subtitle {
  color: var(--sub-title);
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.decoration-left {
  left: 10%;
}

/* Left side decorations */
.book {
  width: 60px;
  height: 80px;
  background-color: var(--decoration-color);
  border-radius: 3px 8px 8px 3px;
  position: relative;
  transform: rotate(-15deg);
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

.book::after {
  content: '';
  position: absolute;
  left: 10px;
  top: 10px;
  width: 40px;
  height: 5px;
  background-color: var(--decoration-accent);
  box-shadow:
    0 15px 0 var(--decoration-accent),
    0 30px 0 var(--decoration-accent),
    0 45px 0 var(--decoration-accent);
}
</style>
