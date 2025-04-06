<template>
  <main class="container">
    <article class="about">
      <div class="header"> <img src="/logo_light.png" width="100px" />
        <h1 class="title">关于我们</h1>
      </div>

      <div class="text">
        启慧智学是基于多模态知识图谱的Web开发学习平台，平台集成动态知识图谱与RAG技术，提供个性化学习路径推荐。平台融合图文和视频等多模态资源，支持AI智能问答与社区互动，帮助学习者高效构建系统化知识体系。
      </div>
    </article>
  </main>
</template>

<style scoped>
@import url(~/assets/css/post.css);

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

.text {
  width: 100%;
  font-size: large;
}
</style>