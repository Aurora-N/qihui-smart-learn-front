<template>
  <!-- 学习方向板块 -->
  <div class="learn">
    <ForumBanner title="学习方向" sub-title="选择你感兴趣的知识进行学习吧！" content-width="1100px">
      <div class="graph">
        <Graph title="总览" :max-depth="3" />
        <Graph title="前端" graph-id="前端" />
        <Graph title="后端" graph-id="后端" />
      </div>
    </ForumBanner>
  </div>
</template>

<style scoped>
.learn {
  margin-top: 55px;
}

.learn .graph {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding-top: 1rem;
}
</style>