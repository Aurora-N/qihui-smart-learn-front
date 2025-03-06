<template>
  <div class="hero-section">
    <div class="container">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="hero-title-primary">改变你的学习方式</span>
          <span class="hero-title-secondary">与知识图谱合作</span>
        </h1>
        <p class="hero-description">
          Boost productivity and streamline your business processes with our powerful SaaS platform. Designed for
          teams of all sizes.
        </p>
        <div class="hero-buttons">
          <NuxtLink to="/learn" class="btn btn-primary">开始学习</NuxtLink>
          <NuxtLink to="#features" class="btn btn-outline">了解更多</NuxtLink>
        </div>
      </div>
    </div>

    <!-- Animated background elements -->
    <div class="hero-background">
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>
      <div class="bg-circle bg-circle-3"></div>
      <div class="bg-circle bg-circle-4"></div>

    </div>
  </div>
</template>

<script setup>
// No additional script needed for this component
</script>

<style scoped>
.hero-section {
  position: relative;
  padding: 8rem 0;
  overflow: hidden;
  background-color: var(--background-color);
  margin-top: 50px;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 10;
}

.hero-content {
  text-align: center;
  max-width: 48rem;
  margin: 0 auto;
  animation: fadeInUp 0.8s ease-out;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.hero-title-primary {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.hero-title-secondary {
  display: block;
  color: var(--text-color);
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.hero-description {
  margin-top: 1.5rem;
  font-size: 1.25rem;
  color: var(--text-muted);
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
  animation: fadeIn 0.8s ease-out 0.6s both;
}

.hero-buttons {
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  animation: fadeIn 0.8s ease-out 0.8s both;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--primary-color);
  color: var(--primary-foreground);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-outline {
  background-color: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-outline:hover {
  background-color: var(--accent-color);
  border-color: var(--accent-color);
}

.hero-background {
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
  top: -50%;
  left: -50%;
  width: 100%;
  height: 100%;
  background-color: rgba(var(--primary-rgb), 0.1);
  animation: rotate 20s linear infinite, scale 20s ease-in-out infinite;
}

.bg-circle-2 {
  bottom: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background-color: rgba(var(--secondary-rgb), 0.1);
  animation: rotate-reverse 25s linear infinite, scale 25s ease-in-out infinite;
}

.bg-circle-3 {
  top: 25%;
  left: 25%;
  width: 3rem;
  height: 3rem;
  background-color: rgba(var(--primary-rgb), 0.2);
  animation: float 5s ease-in-out infinite;
}

.bg-circle-4 {
  bottom: 25%;
  right: 25%;
  width: 2rem;
  height: 2rem;
  background-color: rgba(var(--secondary-rgb), 0.2);
  animation: float-alt 7s ease-in-out infinite;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(1.25rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
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

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

@keyframes float {

  0%,
  100% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(1.25rem, -1.25rem);
  }
}

@keyframes float-alt {

  0%,
  100% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(-1.875rem, 1.875rem);
  }
}

@media (min-width: 640px) {
  .hero-buttons {
    flex-direction: row;
  }
}

@media (min-width: 768px) {
  .hero-section {
    padding: 10rem 0;
  }

  .hero-title {
    font-size: 3rem;
  }
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 3.75rem;
  }
}
</style>
