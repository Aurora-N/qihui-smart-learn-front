<script setup>
import articleLinkListsFrontend from '~/assets/article_links_front.json'
import articleLinkListsBackend from '~/assets/article_links_back.json'
const FrontendIcon = resolveComponent('IconsFrontend');
const BackendIcon = resolveComponent('IconsBackend');

const articlesList = ref([
  {
    id: '前端',
    name: '前端',
    icon: FrontendIcon,
    articles: articleLinkListsFrontend
  },
  {
    id: '后端',
    name: '后端',
    icon: BackendIcon,
    articles: articleLinkListsBackend
  },
])

const currentCateIndex = ref(0)

/* 选中分类相应模块 */
const selectCategory = (id) => {
  console.log('id:', id)
  currentCateIndex.value = articlesList.value.findIndex(item => item.id === id);
  console.log(currentCateIndex.value)
}

useSeoMeta({
  title: () => `学习区文章——${articlesList.value[currentCateIndex.value].id}系列教程`
})
</script>

<template>
  <div class="articles">
    <!-- Welcome Banner -->
    <ForumBanner title="学习区文章" sub-title="浏览学习资源文章">
    </ForumBanner>

    <!-- 内容区域 -->
    <div class="article-content">
      <div class="container">
        <!-- Sidebar -->
        <div class="sidebar">
          <div class="articles-category">
            <h3 style="margin-top: 0; margin-bottom: 1rem;">文章分类</h3>
            <el-menu default-active="0" class="articles-category-menu" @select="selectCategory">
              <el-menu-item v-for="item of articlesList" :index="item.id" :key="item.id" class="articles-category-item">
                <el-icon>
                  <component v-if="item.icon" :is="item.icon" />
                  <document v-else />
                </el-icon>
                <span>{{ item.name }}</span>
              </el-menu-item>
            </el-menu>
          </div>
        </div>

        <!-- Content Section -->
        <main class="main-content">
          <div class="content-header">
            <h1 class="content-title">{{ articlesList[currentCateIndex].id }}系列教程</h1>
          </div>

          <!-- articles -->
          <div class="articles-list">
            <NuxtLink :to="`/articles${article.link}`" class="article-card" v-for="article in articlesList[currentCateIndex].articles"
              :key="article.link">
              <h3 class="article-title">{{ article.title }}</h3>
              <div class="article-meta">
                <!-- <IconsLike />
                <span>{{ article.likesCount }}</span> -->
              </div>
            </NuxtLink>
          </div>
        </main>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style>
.el-menu {
  background-color: var(--color-background);
}

.el-menu-item {
  color: var(--color-text);
}

.el-menu-item::hover {
  color: #2563eb;
  background-color: var(--color-background-nav-hover);
}
</style>

<style scoped>
.articles {
  background-color: var(--color-background-layer);
  padding-top: 55px;
  width: 100%;
}

.banner-links {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.banner-links a {
  color: var(--main-color-hover-lighter);
  text-decoration: none;
}

.article-content {
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

.articles-category {
  background-color: var(--color-background);
  margin-top: 0.5rem;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid var(--color-devider);
}

.articles-category-menu {
  border: 0;
}

.articles-category-item {
  --el-menu-active-color: #2563eb;
  --el-menu-base-level-padding: 0;
  transition: all 0.3s ease-out;
  margin: 0;
}

.articles-category-item:hover {
  color: #2563eb;
  background-color: var(--color-background-nav-hover);
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
  color: var(--color-text);
  margin: 0 0 0.5rem 0.5rem;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.article-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 6px;
  text-decoration: none;
  color: var(--color-text);
}

.article-card:hover {
  background-color: var(--color-background-hover);
}

.article-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
}

.article-info {
  display: flex;
  flex-direction: column;
}

.article-title {
  font-weight: 500;
  margin: 0;
}

.article-meta {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.article-right {
  display: flex;
  align-items: center;
}

.tag {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
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