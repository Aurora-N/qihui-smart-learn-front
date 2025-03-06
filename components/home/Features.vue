<template>
  <div id="features" class="features-section">
    <div class="container">
      <div class="features-header">
        <h2 class="features-subtitle">Features</h2>
        <p class="features-title">Everything you need to streamline your workflow</p>
        <p class="features-description">
          StreamLine offers a comprehensive set of features designed to boost your productivity and simplify your
          business processes.
        </p>
      </div>

      <div class="features-grid">
        <div v-for="(feature, index) in features" :key="feature.name" class="feature-item">
          <div class="feature-icon">
            <component :is="feature.icon" />
          </div>
          <div class="feature-content">
            <h3 class="feature-name">{{ feature.name }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Background elements -->
    <div class="features-background">
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue';

// Define icon components
const ZapIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('polygon', { points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' })
]);

const LayersIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('polygon', { points: '12 2 2 7 12 12 22 7 12 2' }),
  h('polyline', { points: '2 17 12 22 22 17' }),
  h('polyline', { points: '2 12 12 17 22 12' })
]);

const UsersIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }),
  h('circle', { cx: '9', cy: '7', r: '4' }),
  h('path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }),
  h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })
]);

const TrendingUpIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
}, [
  h('polyline', { points: '23 6 13.5 15.5 8.5 10.5 1 18' }),
  h('polyline', { points: '17 6 23 6 23 12' })
]);

const features = [
  {
    name: "Lightning Fast",
    description: "Our platform is optimized for speed, ensuring quick load times and responsive interactions.",
    icon: ZapIcon,
  },
  {
    name: "Intuitive Interface",
    description: "A user-friendly interface that's easy to navigate, making your work more efficient.",
    icon: LayersIcon,
  },
  {
    name: "Team Collaboration",
    description: "Seamlessly work together with your team members in real-time.",
    icon: UsersIcon,
  },
  {
    name: "Advanced Analytics",
    description: "Gain valuable insights with our powerful analytics and reporting tools.",
    icon: TrendingUpIcon,
  },
];
</script>

<style scoped>
.features-section {
  position: relative;
  padding: 6rem 0;
  background-color: var(--background-color);
  overflow: hidden;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 10;
}

.features-header {
  text-align: center;
  max-width: 48rem;
  margin: 0 auto;
}

.features-subtitle {
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.features-title {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.features-description {
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}

.feature-item {
  position: relative;
}

.feature-icon {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.375rem;
  background-color: var(--primary-color);
  color: var(--primary-foreground);
}

.feature-content {
  margin-left: 4rem;
}

.feature-name {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.feature-description {
  font-size: 1rem;
  color: var(--text-muted);
}

.features-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
}

.bg-circle-1 {
  top: -25%;
  right: -25%;
  width: 50%;
  height: 50%;
  background-color: rgba(var(--primary-rgb), 0.1);
  animation: rotate 15s linear infinite, scale 15s ease-in-out infinite;
}

.bg-circle-2 {
  bottom: -25%;
  left: -25%;
  width: 50%;
  height: 50%;
  background-color: rgba(var(--secondary-rgb), 0.1);
  animation: rotate-reverse 20s linear infinite, scale 20s ease-in-out infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes rotate-reverse {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

@keyframes scale {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .features-title {
    font-size: 2.5rem;
  }
}
</style>

