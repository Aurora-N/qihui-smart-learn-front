<template>
  <!-- 学习方向板块 -->
  <Navbar/>
  <div class="learn">
    <ForumBanner title="学习方向" sub-title="选择你感兴趣的知识进行学习吧！" content-width="1100px">
      <div class="graph">
        <Graph title="总览" :max-depth="3" />
        <Graph title="前端" graph-id="前端" />
        <Graph title="后端" graph-id="后端" />
      </div>
      <!-- 学习路线 -->
      <div class="my-path">
        <div class="get-my-path">
          <el-button class="get-my-path-btn" type="primary" size="large" @click="$router.push('/quiz')">获取我的学习路线</el-button>
        </div>
      </div>
    </ForumBanner>
  </div>
  <Footer/>
</template>

<script setup>
definePageMeta({
  layout:false
})
</script>

<style scoped>
.learn {
  padding-top: 55px;
}

.learn .graph {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  padding-top: 1rem;
}

.get-my-path-btn {
  background-color: var(--main-color);
  border-color: var(--main-color);
  margin-top: 2rem;
  border-radius: 8px;
}

.get-my-path-btn:hover {
  background-color: var(--main-color-hover-darker);
  border-color: var(--main-color-hover-darker);
  margin-top: 2rem;
  border-radius: 8px;
}
</style>