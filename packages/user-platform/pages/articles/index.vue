<script setup lang="ts">
import { ref, resolveComponent, computed, onMounted } from 'vue'
import { useArticleApi } from '~/api/article'
import { useArticleSearch } from '~/composables/useArticleSearch'

const FrontendIcon = resolveComponent('IconsFrontend')
const BackendIcon = resolveComponent('IconsBackend')
const SearchIcon = resolveComponent('Search')

const { getArticleList } = useArticleApi()

const articlesList = ref([
  {
    id: '前端',
    name: '前端',
    icon: FrontendIcon,
    articles: [],
  },
  {
    id: '后端',
    name: '后端',
    icon: BackendIcon,
    articles: [],
  },
])

const currentCateIndex = ref(0)
const activeArticles = computed(
  () => articlesList.value[currentCateIndex.value].articles
)
const { searchQuery, filteredArticles } = useArticleSearch(activeArticles)

const selectCategory = (id: string) => {
  currentCateIndex.value = articlesList.value.findIndex(
    (item: any) => item.id === id
  )
  searchQuery.value = ''
}

onMounted(async () => {
  try {
    const response = await getArticleList()
    const rawData = response || []
    console.log('Raw Article List:', rawData)

    const buildTree = links => {
      const tree = { 前端: [], 后端: [] }

      links.forEach(({ articleName, articlePath }) => {
        let cleanPath = articlePath
          .replace(/\\/g, '/')
          .replace(/^\/+/, '')
          .replace(/\.md$/, '')

        if (cleanPath.startsWith('节点文章/')) {
          cleanPath = cleanPath.slice('节点文章/'.length)
        }

        const parts = cleanPath.split('/')

        const topCat = parts[0]
        if (topCat !== '前端' && topCat !== '后端') return

        let currentLevel = tree[topCat]

        for (let i = 1; i < parts.length - 1; i++) {
          const categoryName = parts[i]
          let existingCat = currentLevel.find(c => c.category === categoryName)
          if (!existingCat) {
            existingCat = { category: categoryName, links: [] }
            currentLevel.push(existingCat)
          }
          currentLevel = existingCat.links
        }

        currentLevel.push({
          title: articleName || parts[parts.length - 1],
          link: '节点文章/' + cleanPath,
        })
      })

      return tree
    }

    const builtTree = buildTree(rawData)
    console.log('Built Article Tree:', builtTree)
    articlesList.value[0].articles = builtTree['前端'] || []
    articlesList.value[1].articles = builtTree['后端'] || []
  } catch (error) {
    console.error('Failed to load articles:', error)
  }
})

useSeoMeta({
  title: () =>
    `学习区文章——${articlesList.value[currentCateIndex.value].id}系列教程`,
})
</script>

<template>
  <div class="articles">
    <!-- Welcome Banner -->
    <ForumBanner
      :title="`${articlesList[currentCateIndex].id}系列教程`"
      sub-title="浏览学习资源文章"
    />

    <!-- 内容区域 -->
    <div class="article-content">
      <div class="container">
        <!-- Sidebar -->
        <div class="sidebar">
          <div class="articles-search">
            <el-input
              v-model="searchQuery"
              placeholder="搜索当前类目文章..."
              clearable
              :prefix-icon="SearchIcon"
            />
          </div>

          <div class="articles-category">
            <h3 style="margin-top: 0; margin-bottom: 1rem">文章分类</h3>
            <el-menu
              default-active="前端"
              class="articles-category-menu"
              @select="selectCategory"
            >
              <el-menu-item
                v-for="item of articlesList"
                :key="item.id"
                :index="item.id"
                class="articles-category-item"
              >
                <el-icon>
                  <component :is="item.icon" v-if="item.icon" />
                  <document v-else />
                </el-icon>
                <span>{{ item.name }}</span>
              </el-menu-item>
            </el-menu>
          </div>
        </div>

        <!-- Content Section -->
        <main class="main-content">
          <!-- articles -->
          <ArticleCardList :article-list="filteredArticles" />
          <el-empty
            v-if="filteredArticles.length === 0"
            description="未找到匹配的文章"
          />
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
  margin-right: 3rem;
}

@media (max-width: 480px) {
  .container {
    display: block;
    margin: 2rem 2rem;
  }

  .sidebar {
    width: 100%;
    margin-bottom: 2rem;
  }
}

.articles-search {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
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
}
</style>
