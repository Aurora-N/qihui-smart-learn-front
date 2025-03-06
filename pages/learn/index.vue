<template>
  <!-- 学习方向板块 -->
  <div class="learn">
    <ForumBanner title="学习方向" sub-title="选择你感兴趣的知识进行学习吧！">
      <div class="graph">
        <MiniGraph title="计算机基础" />
        <MiniGraph title="前端" />
        <MiniGraph title="后端" />
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