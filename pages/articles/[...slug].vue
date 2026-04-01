<script setup lang="ts">
import '~/assets/style/post.scss'
import { useArticleApi } from '~/api/article'
import { useMarkdownText } from '~/composables/useMarkdownText'

const route = useRoute()
const router = useRouter()

const slug = Array.isArray(route.params.slug)
  ? route.params.slug.join('/')
  : route.params.slug || ''

const isLoading = ref(true)
const page = ref(null)
const renderedHtml = ref('')

const { getArticleDetail } = useArticleApi()
const { renderMarkdown } = useMarkdownText()

onMounted(async () => {
  try {
    // slug format example: "前端/微前端/1.介绍"
    // The API expects ArticleLink which expects articleName and articlePath.
    // We derive articlePath from slug and articleName from the last segment.
    const parts = slug.split('/')
    const articleName = parts[parts.length - 1] + '.md' // Assuming articleName is the last segment with .md extension
    const articlePath = slug // Assuming slug is the exact path without .md

    const res = await getArticleDetail({ articleName, articlePath })
    if (res.data) {
      page.value = res.data
      renderedHtml.value = await renderMarkdown(res.data.articleContent || '')
    }
  } catch (error) {
    console.error('Failed to fetch article details', error)
  } finally {
    isLoading.value = false
  }
})

// Since no TOC is returned by getArticleDetail, hide menu for now.
const showMenu = ref(false)

useSeoMeta({
  title: () => page.value?.articleName || '',
  description: () => page.value?.articleName || '',
})

definePageMeta({
  layout: 'default',
})

const selectedItem = computed(() => '')

const selectTocItem = (id: string) => {
  router.push(route.path + `#${id}`)
}

const showArrow = reactive<{ [key: string]: boolean }>({})

const recommendPostsList = ref([
  { id: '1', title: '测试', link: '', type: '理论' },
  { id: '2', title: '动手做一做', link: '', type: '实践' },
])
</script>

<template>
  <!-- <ContentSkeleton v-if="isLoading" /> -->

  <div class="main-container">
    <div v-if="showMenu" class="side">
      <Sidebar title="目录" height="20rem">
        <el-menu
          :default-active="selectedItem"
          class="posts-category-menu"
          @select="selectTocItem"
        >
          <el-menu-item
            v-for="item of []"
            :key="item.id"
            :index="item.id"
            class="posts-category-item"
            @mouseenter="showArrow[item.id] = true"
            @mouseleave="showArrow[item.id] = false"
          >
            <div v-show="showArrow[item.id]" class="arrow">
              <el-icon>
                <ArrowRight />
              </el-icon>
            </div>
            <span>{{ item.text }}</span>
          </el-menu-item>
        </el-menu>
      </Sidebar>
    </div>

    <div class="content">
      <article v-if="page">
        <Breadcrumb
          class="breadcrumb"
          :current-title="page?.articleName"
          :parents="route.params.slug.slice(0, -1)"
        />
        <div class="article-html-content" v-html="renderedHtml"></div>
      </article>
      <div v-else-if="!isLoading">page not found</div>
      <Recommend
        title="推荐阅读"
        :lists="recommendPostsList"
        style="margin-top: 1rem"
      />
    </div>
  </div>

  <Footer />
</template>

<style lang="scss" scoped>
.main-container {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  padding-top: 60px;
}

.content {
  max-width: 60rem;
  width: 100%;
}

.side {
  margin-top: 0.5rem;
  margin-right: 3rem;
  width: 15rem;
  min-width: 8rem;
}

.posts-category-menu {
  border: 0;
  overflow: hidden;
}

.side .posts-category-item {
  --el-menu-active-color: #2563eb;
  --el-menu-base-level-padding: 0;
  transition: all 0.3s ease-out;
  margin: 0;
  height: 2rem;
}

.posts-category-item:hover {
  color: #2563eb;
  background-color: var(--color-background-nav-hover);
  --el-menu-base-level-padding: 10px;
  border-radius: 6px;
}

.arrow {
  margin: 0 -5px 2px -5px;
}

@media (max-width: 1200px) {
  .main-container {
    margin: 1.5rem;
  }

  .content {
    display: block;
    width: 80%;
  }

  .side {
    width: 20%;
    margin-right: 1rem;
  }
}

@media (max-width: 480px) {
  .main-container {
    display: block;
    margin: 0 1.5rem 1.5rem 1.5rem;
  }

  .breadcrumb {
    width: 100%;
    margin-bottom: 1rem;
    overflow: hidden;
  }

  .breadcrumb :deep(.el-breadcrumb__item) {
    margin-bottom: 0.5rem;
  }

  .content {
    max-width: 100%;
    width: 100%;
  }

  .side {
    width: 100%;
  }
}
</style>
