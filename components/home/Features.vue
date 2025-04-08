<template>
  <div id="features" class="features-section">
    <div class="container">
      <div class="features">
        <div v-for="(feature, index) in features" :key="feature.name" class="feature-container"
          @click="$router.replace(`${feature.path}`)">
          <div class="feature-item">
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
    </div>
  </div>
</template>

<script setup>
// Define icon components
const LearnIcon = resolveComponent('IconsLearn');
const ArticleIcon = resolveComponent('IconsArticle');
const ChatIcon = resolveComponent('IconsChat');
const ForumIcon = resolveComponent('IconsForum');

const features = [
  {
    name: "学习方向",
    description: "选择感兴趣的学习方向",
    icon: LearnIcon,
    path: '/learn'
  },
  {
    name: "文章",
    description: "浏览学习资源文章",
    icon: ArticleIcon,
    path: '/articles'
  },
  {
    name: "在线答疑",
    description: "AI助手边问边学",
    icon: ChatIcon,
    path: '/chat'
  },
  {
    name: "论坛",
    description: "和志同道合的人一起讨论",
    icon: ForumIcon,
    path: '/forum'
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
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-content: center;
}

.features {
  width: 80vw;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  border: 1px solid var(--color-border);
  padding: 1.5rem;
  border-radius: 10px;
}

.feature-container {
  flex: 1 1 22%;
  /* 每个容器占宽度的22%，四等分 */
  padding: 1rem;
  border-radius: 8px;
}

.feature-container:hover {
  padding: 1rem;
  background-color: var(--color-background-hover);
}

.feature-item {
  position: relative;
}

/* .feature-item:hover {
  background-color: var(--color-background-hover);
  border-radius: 6px;
  outline: 10px solid var(--color-background-hover);
} */

.feature-icon {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.375rem;
  font-size: 1.5rem;
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
  margin: 0;
  padding: 0;
}

.feature-description {
  font-size: 1rem;
  color: var(--text-muted);
  margin: 0;
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

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

@media (max-width: 1024px) {
  .feature-container {
    flex: 1 1 48%;
    /* 每个容器占宽度的48%，二等分 */
  }
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .features-title {
    font-size: 2.5rem;
  }

  .feature-container {
    flex: 1 1 98%;
    /* 每个容器占宽度的98%，一等分 */
  }
}

@media (max-width: 640px) {
  .features {
    width: 90vw;
  }
}
</style>
