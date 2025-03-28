<script setup>
const props = defineProps({
  title: String,
  subTitle: String,
  hue: {
    type: Number,
    default: 250,
  },
  contentWidth: {
    type: String,
    default: '800px',
  }
})
</script>

<template>
  <div class="banner" :style="{ '--hue': props.hue }">
    <!-- Background layers -->
    <div class="bg-layer bg-layer-1"></div>
    <div class="bg-layer bg-layer-2"></div>

    <!-- Large decorative elements -->
    <div class="large-element large-book-left"></div>
    <div class="large-element large-page-right"></div>

    <!-- Medium decorative elements -->
    <div class="decoration decoration-left">
      <div class="book"></div>
      <div class="page"></div>
    </div>

    <!-- Content -->
    <div class="banner-content" :style="{ 'max-width': props.contentWidth }">
      <h1 class="banner-title">{{ props.title }}</h1>
      <p class="banner-subtitle">{{ props.subTitle }}</p>
      <slot />
    </div>

    <!-- Medium decorative elements -->
    <div class="decoration decoration-right">
      <div class="paragraph-lines"></div>
      <div class="bookmark"></div>
    </div>
  </div>
</template>

<style scoped>
.light-mode .banner {
  --banner-color: oklch(.97 .01 var(--hue));
  --title: #374151;
  --sub-title: #6b7280;
  --decoration-color: oklch(.85 .03 var(--hue));
  --decoration-accent: oklch(.75 .05 var(--hue));
  --layer-color-1: oklch(.92 .02 var(--hue));
  --layer-color-2: oklch(.94 .015 var(--hue));
  --floating-color: oklch(.88 .025 var(--hue));
}

.dark-mode .banner {
  --banner-color: oklch(.20 .014 var(--hue));
  --title: rgb(248, 250, 252);
  --sub-title: rgb(231, 236, 243);
  --decoration-color: oklch(.25 .03 var(--hue));
  --decoration-accent: oklch(.30 .05 var(--hue));
  --layer-color-1: oklch(.18 .02 var(--hue));
  --layer-color-2: oklch(.22 .015 var(--hue));
  --floating-color: oklch(.28 .025 var(--hue));
}

.banner {
  background-color: var(--banner-color);
  padding: 5rem 1rem;
  text-align: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  min-height: 250px;
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
  z-index: 0;
}

.bg-layer-2 {
  width: 80%;
  height: 80%;
  background-color: var(--layer-color-2);
  bottom: -20%;
  right: -20%;
  z-index: 0;
}

/* Large decorative elements */
.large-element {
  position: absolute;
  z-index: 1;
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
  box-shadow: 0 30px 0 var(--decoration-accent), 0 60px 0 var(--decoration-accent),
    0 90px 0 var(--decoration-accent), 0 120px 0 var(--decoration-accent),
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
  box-shadow: 0 15px 0 var(--decoration-accent), 0 30px 0 var(--decoration-accent),
    0 45px 0 var(--decoration-accent), 0 60px 0 var(--decoration-accent),
    0 75px 0 var(--decoration-accent), 0 90px 0 var(--decoration-accent),
    0 105px 0 var(--decoration-accent), 0 120px 0 var(--decoration-accent),
    0 135px 0 var(--decoration-accent), 0 150px 0 var(--decoration-accent);
}

/* Floating elements for additional depth */
.floating-element {
  position: absolute;
  z-index: 1;
  opacity: 0.7;
}

.floating-quote-left {
  font-size: 120px;
  font-family: serif;
  color: var(--floating-color);
  left: 15%;
  top: 15%;
  transform: rotate(-10deg);
}

.floating-quote-right {
  font-size: 120px;
  font-family: serif;
  color: var(--floating-color);
  right: 15%;
  bottom: 15%;
  transform: rotate(10deg);
}

.floating-line-1,
.floating-line-2,
.floating-line-3 {
  height: 4px;
  background-color: var(--floating-color);
  border-radius: 2px;
}

.floating-line-1 {
  width: 150px;
  left: 10%;
  bottom: 30%;
  transform: rotate(-25deg);
}

.floating-line-2 {
  width: 100px;
  right: 20%;
  top: 25%;
  transform: rotate(15deg);
}

.floating-line-3 {
  width: 180px;
  left: 25%;
  bottom: 20%;
  transform: rotate(5deg);
}

.banner-content {
  z-index: 3;
  max-width: 800px;
  width: 100%;
  position: relative;
  background-color: var(--banner-color);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.05);
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

/* Medium decorative elements */
.decoration {
  position: absolute;
  top: 0;
  height: 100%;
  width: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  opacity: 0.6;
  pointer-events: none;
  z-index: 2;
}

.decoration-left {
  left: 10%;
}

.decoration-right {
  right: 10%;
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
  box-shadow: 0 15px 0 var(--decoration-accent), 0 30px 0 var(--decoration-accent), 0 45px 0 var(--decoration-accent);
}

.page {
  width: 50px;
  height: 70px;
  background-color: var(--decoration-color);
  border-radius: 2px;
  position: relative;
  transform: rotate(20deg);
  margin-top: 20px;
}

.page::after {
  content: '';
  position: absolute;
  left: 8px;
  top: 8px;
  width: 35px;
  height: 3px;
  background-color: var(--decoration-accent);
  box-shadow: 0 8px 0 var(--decoration-accent), 0 16px 0 var(--decoration-accent),
    0 24px 0 var(--decoration-accent), 0 32px 0 var(--decoration-accent),
    0 40px 0 var(--decoration-accent), 0 48px 0 var(--decoration-accent);
}

/* Right side decorations */
.paragraph-lines {
  width: 70px;
  height: 90px;
  position: relative;
  transform: rotate(15deg);
}

.paragraph-lines::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 4px;
  background-color: var(--decoration-color);
  box-shadow: 0 12px 0 var(--decoration-color), 0 24px 0 var(--decoration-color),
    0 36px 0 var(--decoration-color), 0 48px 0 var(--decoration-color),
    0 60px 0 var(--decoration-color), 0 72px 0 var(--decoration-color);
}

.bookmark {
  width: 30px;
  height: 60px;
  background-color: var(--decoration-accent);
  border-radius: 3px 3px 15px 15px;
  transform: rotate(-10deg);
  margin-top: 20px;
}

/* Responsive adjustments */
@media (max-width: 992px) {

  .large-book-left,
  .large-page-right {
    transform: scale(0.8) translateY(-50%) rotate(var(--rotation, 0deg));
  }

  .large-book-left {
    --rotation: -15deg;
    left: -80px;
  }

  .large-page-right {
    --rotation: 15deg;
    right: -70px;
  }

  .floating-quote-left,
  .floating-quote-right {
    font-size: 100px;
  }
}

@media (max-width: 768px) {
  .decoration {
    width: 80px;
    opacity: 0.4;
  }

  .book,
  .page,
  .paragraph-lines,
  .bookmark {
    transform: scale(0.7) rotate(var(--rotation, 0deg));
  }

  .large-book-left,
  .large-page-right {
    transform: scale(0.6) translateY(-50%) rotate(var(--rotation, 0deg));
  }

  .floating-element {
    opacity: 0.4;
  }

  .floating-quote-left,
  .floating-quote-right {
    font-size: 80px;
  }

  .banner-content {
    padding: 1.5rem;
  }
}

@media (max-width: 576px) {
  .decoration {
    opacity: 0.2;
  }

  .large-book-left,
  .large-page-right {
    transform: scale(0.5) translateY(-50%) rotate(var(--rotation, 0deg));
  }

  .floating-element {
    opacity: 0.3;
  }

  .banner-content {
    padding: 1rem;
  }

  .banner-title {
    font-size: 1.75rem;
  }
}
</style>