<template>
  <div class="hero-section">
    <div class="container">
      <div class="hero-container">
        <!-- Hero内容 -->
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="hero-title-primary">启慧智学</span>
            <span class="hero-title-secondary"
              >基于多模态知识图谱的Web开发学习平台</span
            >
          </h1>
          <p class="hero-description">改变你的学习方式，与知识图谱合作</p>
          <div class="hero-buttons">
            <NuxtLink to="/learn" class="btn btn-primary">开始学习</NuxtLink>
            <NuxtLink to="#features" class="btn btn-outline">了解更多</NuxtLink>
          </div>
        </div>

        <!-- Logo -->
        <div class="hero-logo">
          <div class="logo-container">
            <!-- Replace with your actual logo -->
            <img
              :src="`/logo_${useColorMode().preference === 'system' ? 'light' : useColorMode().preference}.png`"
              alt="ourlogo"
              class="logo-image"
            />
          </div>
        </div>
      </div>
    </div>

    <HomeFeatures />

    <div class="hero-background">
      <div class="bg-circle bg-circle-1" />
      <div class="bg-circle bg-circle-2" />
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  position: relative;
  padding: 8rem 0 0 0;
  overflow: hidden;
  background-color: var(--background-color);
  margin-top: 50px;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 10;
}

.hero-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  animation: fadeInUp 0.8s ease-out;
}

.hero-content {
  text-align: center;
  max-width: 100%;
  margin: 0 auto;
  order: 2;
}

.hero-logo {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  order: 1;
}

.logo-container {
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-image {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.hero-title-primary {
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.light-mode .hero-title-primary {
  background: linear-gradient(-30deg, #0851bf, #3cfb92);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dark-mode .hero-title-primary {
  background: linear-gradient(-30deg, #3160e6, #3cf992);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-title-secondary {
  margin-top: 1rem;
  font-size: 2.5rem;
  display: block;
  color: var(--text-color);
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.hero-description {
  margin-top: 1.5rem;
  font-size: 1.25rem;
  color: var(--text-muted);
  max-width: 36rem;
  margin-left: 0;
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
  animation:
    rotate 20s linear infinite,
    scale 20s ease-in-out infinite;
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

@keyframes scale {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

/* Tablet and desktop styles */
@media (min-width: 768px) {
  .hero-container {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }

  .hero-content {
    text-align: left;
    flex: 1;
    max-width: 60%;
    order: 1;
  }

  .hero-logo {
    flex: 1;
    justify-content: flex-end;
    margin-bottom: 0;
    order: 2;
  }

  .logo-container {
    width: 240px;
    height: 240px;
  }

  .hero-title {
    font-size: 3rem;
  }

  .hero-title-secondary {
    font-size: 3rem;
  }

  .hero-buttons {
    flex-direction: row;
    justify-content: flex-start;
  }

  .hero-section {
    padding: 8rem 0 0 0;
  }
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 3.75rem;
  }

  .hero-title-secondary {
    font-size: 3rem;
  }

  .logo-container {
    width: 300px;
    height: 300px;
  }
}
</style>
