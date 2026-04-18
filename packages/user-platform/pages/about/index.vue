<template>
  <main class="container">
    <article class="about">
      <div class="header">
        <img src="/logo_light.png" width="100px" />
        <h1 class="title">关于我们</h1>
      </div>

      <div class="section">
        <p class="text">
          启慧智学是基于多模态知识图谱的Web开发学习平台，平台集成动态知识图谱与RAG技术，提供个性化学习路径推荐。平台融合图文和视频等多模态资源，支持AI智能问答与社区互动，帮助学习者高效构建系统化知识体系。
        </p>
      </div>

      <div class="section">
        <h2>技术栈</h2>

        <div
          v-for="(category, catIndex) in techCategories"
          :key="catIndex"
          class="tech-category"
        >
          <h3 class="category-title">
            {{ category.name }}
          </h3>
          <div class="tech-stack">
            <div
              v-for="(tech, index) in category.techs"
              :key="index"
              class="tech-card"
            >
              <div class="tech-icon">
                <img :src="tech.icon" :alt="tech.name" />
              </div>
              <div class="tech-info">
                <h3>{{ tech.name }}</h3>
                <p>{{ tech.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>团队成员</h2>
        <div class="team-members">
          <div
            v-for="(member, index) in teamMembers"
            :key="index"
            class="member-card"
          >
            <div class="member-avatar">
              <img :src="member.avatar" :alt="member.name" />
            </div>
            <h3>{{ member.name }}</h3>
            <p class="member-role">
              {{ member.role }}
            </p>
            <p class="member-bio">
              {{ member.bio }}
            </p>
          </div>
        </div>
      </div>
    </article>
  </main>
  <Footer />
</template>

<script setup lang="ts">
const techCategories = [
  {
    name: '前端技术',
    techs: [
      {
        name: 'Nuxt.js & Vue.js',
        description:
          '基于Vue.js的SSR框架，提供高性能的用户界面和良好的SEO支持。',
        icon: '/icons/nuxt.svg',
      },
      {
        name: 'TypeScript',
        description:
          'JavaScript 的超集，为静态类型检查与更健壮的代码智能提示提供支持。',
        icon: '/icons/ts.png',
      },
      {
        name: 'D3.js',
        description: '强大的数据可视化库，用于构建交互式图表和知识图谱展示。',
        icon: '/icons/d3.svg',
      },
      {
        name: 'Pinia',
        description:
          '新一代Vue状态管理库，提供简洁直观的API和出色的TypeScript支持。',
        icon: '/icons/pinia.svg',
      },
      {
        name: 'Element Plus',
        description: '基于Vue 3的组件库，帮助我们快速构建一致的用户界面。',
        icon: '/icons/element.png',
      },
      {
        name: 'Axios',
        description: '基于Promise的HTTP客户端，用于浏览器和Node.js环境。',
        icon: '/icons/axios.png',
      },
    ],
  },
  {
    name: '后端技术',
    techs: [
      {
        name: 'Spring Cloud & Java',
        description:
          '主后端微服务生态，集成了Eureka和Gateway等，负责核心业务逻辑调度与微服务自治。',
        icon: '/icons/spring.png',
      },
      {
        name: 'Flask & Python',
        description:
          '辅助后端框架，主要负责大模型的文档分段向量化处理与查询检索重排。',
        icon: '/icons/flask.png',
      },
      {
        name: 'MySQL',
        description: '主要数据存储，负责结构化数据和应用核心状态的持久化。',
        icon: '/icons/mysql.svg',
      },
      {
        name: 'Redis',
        description:
          '高性能内存缓存，用于缓存验证码鉴权并提升后端主服务高并发情况下的响应速度。',
        icon: '/icons/redis.png',
      },
      {
        name: 'Neo4j',
        description:
          '图数据库，专为存储和查询复杂的知识图谱（节点与关系）设计。',
        icon: '/icons/neo4j.png',
      },
      {
        name: 'Chroma',
        description:
          '高性能向量数据库，用于存储分段向量化后的文档数据，为大模型RAG提供支持。',
        icon: '/icons/chroma.png',
      },
      {
        name: 'RabbitMQ',
        description:
          '消息中间件，在主系统与辅助知识库系统间提供高可用和异步解耦的数据传输。',
        icon: '/icons/rabbitmq.svg',
      },
      {
        name: '安全与鉴权机制',
        description:
          '包含 JWT(Token验证)、RSA非对称加密前端敏感数据传输，及 BCrypt 后端密码保护。',
        icon: '/icons/jwt.svg',
      },
      {
        name: 'Docker',
        description:
          '采用容器化部署方案，隔离微服务与异构系统，保障多环境统一运行与敏捷部署。',
        icon: '/icons/docker.png',
      },
    ],
  },
  {
    name: 'AI技术',
    techs: [
      {
        name: 'RAG技术',
        description:
          '检索增强生成技术，提供基于知识库的精准检索和内容生成能力。',
        icon: '/icons/rag.svg',
      },
      {
        name: '千问3模型 (Qwen3)',
        description:
          '本地部署千问3-Embedding-0.6B向量化与Reranker-0.6B重排模型，负责私有知识库精准搜索。',
        icon: '/icons/qwen.png',
      },
      {
        name: 'DeepSeek 3.2',
        description:
          '利用前沿的DeepSeek模型提供卓越的自然语言能力，为自适应学习路线及问答实现智能推理。',
        icon: '/icons/deepseek.png',
      },
    ],
  },
]

const teamMembers = [
  {
    name: 'Sinkhorn',
    avatar: '/team/sinkhorn.png',
  },
  {
    name: 'Ho.GiGi',
    avatar: '/team/hgg.jpg',
  },
  {
    name: 'ST',
    avatar: '/team/st.png',
  },
  {
    name: 'R-y-o',
    avatar: '/team/ryo.png',
  },
  {
    name: 'Aurorallz',
    avatar: '/team/aurorallz.png',
  },
]

useHead({
  title: '关于我们',
})
</script>

<style lang="scss" scoped>
@import url(~/assets/style/post.scss);

.container {
  display: flex;
  justify-content: center;
  padding-bottom: 40px;
  padding-top: 85px;
}

.about {
  max-width: 1000px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.title {
  width: 100%;
}

.section {
  margin-bottom: 1rem;
}

.text {
  width: 100%;
  font-size: large;
  line-height: 1.6;
}

/* 技术栈部分样式 */
.tech-category {
  margin-bottom: 2rem;
}

.category-title {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border-quote);
  color: var(--color-text);
}

.tech-stack {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 1rem;
}

.tech-card {
  display: flex;
  background-color: var(--color-background-quote);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid var(--color-border-quote);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.tech-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.tech-icon {
  margin-right: 15px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tech-icon img {
  width: 100%;
  height: auto;
}

.tech-info h3 {
  margin: 0 0 10px 0;
}

.tech-info p {
  margin: 0;
  font-size: 0.9rem;
}

/* 团队成员部分样式 */
.team-members {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 30px;
  margin-top: 1.5rem;
}

.member-card {
  background-color: var(--color-background-quote);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  border: 1px solid var(--color-border-quote);
  transition: transform 0.2s;
}

.member-card:hover {
  transform: translateY(-5px);
}

.member-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 15px;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-card h3 {
  margin: 0 0 5px 0;
}

.member-role {
  color: var(--color-text-light);
  font-weight: 500;
  margin: 0 0 10px 0;
}

.member-bio {
  font-size: 0.9rem;
  line-height: 1.4;
}

/* 视频展示部分样式 */
.video-showcase {
  margin-top: 1.5rem;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9宽高比 */
  height: 0;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 20px;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.video-description {
  background-color: var(--color-background-quote);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid var(--color-border-quote);
}

.video-description h3 {
  margin-top: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
    padding-bottom: 40px;
    padding-top: 85px;
  }

  .tech-stack,
  .team-members {
    grid-template-columns: 1fr;
  }

  .tech-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .tech-icon {
    margin-right: 0;
    margin-bottom: 15px;
  }
}
</style>
