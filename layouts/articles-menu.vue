<script setup>
const bannerConfig = ref({
  title: '学习区文章',
  subTitle: '知识图谱',
  hueColor: '260'
})

const articlesList = ref([])

provide("bannerConfig", bannerConfig)
provide("articlesList", articlesList)

const currentArticleCategory = ref('')

const router = useRouter()
const route = useRoute()

/* 选中分类相应模块 */
const selectCategory = (id) => {
  console.log(id)
  currentArticleCategory.value = id;
  // router.push(`${route.fullPath}/${id}`);
}

onMounted(() => currentArticleCategory.value = articlesList.value[0])
</script>

<template>
  <NuxtLayout name="default">
    <div class="posts">
      <!-- Welcome Banner -->
      <ForumBanner :title="bannerConfig.title" :sub-title="bannerConfig.subTitle">
        <div class="banner-links">
        </div>
      </ForumBanner>

      <!-- 内容区域 -->
      <div class="post-content">
        <div class="container">
          <!-- Sidebar -->
          <div class="sidebar">
            <div class="posts-category">
              <h3 style="margin-top: 0;">文章分类</h3>
              <el-menu default-active="0" class="posts-category-menu" @select="selectCategory">
                <el-menu-item v-for="item of articlesList.data" :index="item" :key="item" class="posts-category-item">
                  <el-icon>
                    <document />
                  </el-icon>
                  <span>{{ item }}</span>
                </el-menu-item>
              </el-menu>
            </div>
          </div>

          <!-- Content Section -->
          <main class="main-content">
            <div class="content-header">
              <h1 class="content-title">{{ currentArticleCategory }}系列教程</h1>
            </div>

            <!-- Forum posts -->
            <NuxtPage />
          </main>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.posts {
  background-color: while;
  margin-top: 55px;
  width: 100%;
}

.banner-links {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.banner-links a {
  color: #2563eb;
  text-decoration: none;
}

.post-content {
  display: flex;
  justify-content: center;
  width: 100%;
}

.container {
  display: flex;
  justify-content: space-between;
  margin: 2rem 4rem;
  padding: 0;
  width: 100%;
  max-width: 1200px;
}

.sidebar {
  width: 15rem;
  margin-right: 2rem;
}

.posts-category {
  margin-top: 0.5rem;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid rgb(231, 236, 243);
}

.posts-category-menu {
  border: 0;
}

.posts-category-item {
  --el-menu-active-color: #2563eb;
  --el-menu-base-level-padding: 0;
  transition: all 0.3s ease-out;
  margin: 0;
}

.posts-category-item:hover {
  color: #2563eb;
  background-color: rgb(248, 250, 252);
  --el-menu-base-level-padding: 10px;
  border-radius: 6px;
}

.main-content {
  width: 100%;
}

.content-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.content-title {
  font-size: 1.875rem;
  font-weight: bold;
  color: #374151;
  margin: 0 0 0.5rem 0.5rem;
}

.publish-button {
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  width: 100%;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.sort-button {
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

/* 论坛主题 */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.post-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 6px;
  text-decoration: none;
  color: #374151;
}

.post-card:hover {
  background-color: #f9fafb;
}

.post-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
}

.post-info {
  display: flex;
  flex-direction: column;
}

.post-title {
  font-weight: 500;
  margin: 0;
}

.post-meta {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.post-right {
  display: flex;
  align-items: center;
}

.tag {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
}

.tag.secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.tag.success {
  background-color: #10b981;
  color: white;
}

.tag.purple {
  background-color: #8b5cf6;
  color: white;
}

.reply-count {
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  color: #6b7280;
}

.icon-small {
  width: 1rem;
  height: 1rem;
}
</style>