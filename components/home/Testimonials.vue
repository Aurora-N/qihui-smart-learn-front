<template>
  <div id="testimonials" class="testimonials-section">
    <div class="container">
      <div class="testimonials-header">
        <h2 class="testimonials-title">热门文章</h2>
        <p class="testimonials-description">
          来看看大家都在看哪些文章
        </p>
      </div>

      <div class="testimonials-grid">
        <div v-for="(testimonial, index) in testimonials" :key="testimonial.name" class="testimonial-card" @click="$router.push(`${testimonial.link}`)">
          <div class="testimonial-header">
            <img :src="testimonial.image" :alt="testimonial.name" class="testimonial-image" />
            <div class="testimonial-meta">
              <div class="testimonial-name">{{ testimonial.name }}</div>
              <div class="testimonial-role">{{ testimonial.role }}</div>
            </div>
          </div>
          <p class="testimonial-quote">"{{ testimonial.quote }}"</p>
        </div>
      </div>
    </div>

    <!-- Background elements -->
    <div class="testimonials-background">
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>
    </div>
  </div>
</template>

<script setup>
const testimonials = [
  {
    name: "Vue 简介",
    role: "渐进式 JavaScript 框架",
    image: "https://tse4-mm.cn.bing.net/th/id/OIP-C.vve0ijhF8bqB4_qxOs21fAAAAA?rs=1&pid=ImgDetMain",
    quote:
      "Vue是一款用于构建用户界面的 JavaScript 框架。它基于标准 HTML、CSS 和 JavaScript 构建，并提供了一套声明式的、组件化的编程模型，帮助你高效地开发用户界面。无论是简单还是复杂的界面，Vue 都可以胜任。本文为Vue简介。",
    link: "/articles/%E5%89%8D%E7%AB%AF/%E5%89%8D%E7%AB%AF%E4%B8%BB%E6%B5%81%E6%A1%86%E6%9E%B6/Vue3/1.%E7%AE%80%E4%BB%8B"
  },
  {
    name: "如何成为全栈高手",
    role: "Uika",
    image: "https://avatars.githubusercontent.com/u/35548919",
    quote:
      "在2023年StackOverflow开发者调查中，全栈工程师以55.2%的占比蝉联最受欢迎开发角色。这种既能画界面又能写API的全能选手，正在成为数字化转型浪潮中的核心人才。本文将揭示成为全栈高手的进阶密码。",
    link: "/forum/1"
  },
  {
    name: "RestFul API 简明教程",
    role: "RESTful API",
    image: "https://img-blog.csdnimg.cn/5351e2a6a42948fda8158611d42b4584.png",
    quote:
      "一篇文章简单聊聊后端程序员必备的 RESTful API 相关的知识。",
    link: "articles/后端/API开发与通信/RESTful API/2.RestFul API 简明教程"
  },
];
</script>

<style scoped>
.testimonials-section {
  position: relative;
  padding: 4rem 0;
  background-color: var(--secondary-color);
  overflow: hidden;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 10;
}

.testimonials-header {
  text-align: center;
  margin-bottom: 4rem;
}

.testimonials-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.testimonials-description {
  font-size: 1.25rem;
  color: var(--text-muted);
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.testimonial-card {
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-0.25rem);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.testimonial-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.testimonial-image {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  object-fit: cover;
}

.testimonial-meta {
  margin-left: 1rem;
}

.testimonial-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
}

.testimonial-role {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.testimonial-quote {
  font-style: italic;
  color: var(--text-muted);
}

.testimonials-background {
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
  top: 25%;
  right: -4rem;
  width: 8rem;
  height: 8rem;
  background-color: rgba(var(--primary-rgb), 0.1);
  animation: float 5s ease-in-out infinite;
}

.bg-circle-2 {
  bottom: 25%;
  left: -4rem;
  width: 6rem;
  height: 6rem;
  background-color: rgba(var(--secondary-rgb), 0.1);
  animation: float-alt 7s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(1.25rem, -1.25rem);
  }
}

@keyframes float-alt {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-1.875rem, 1.875rem);
  }
}

@media (min-width: 768px) {
  .testimonials-section {
    padding: 6rem 0;
  }
  
  .testimonials-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .testimonials-title {
    font-size: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .testimonials-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>

