<script setup lang="ts">
import '~/assets/style/post.scss'

const route = useRoute()
const router = useRouter()

const slug = Array.isArray(route.params.slug)
  ? route.params.slug.join('/')
  : route.params.slug || ''

const isLoading = ref(true)

const { data: page, error } = await useAsyncData(
  `content-${slug}`,
  async () => {
    const articles = await queryCollection('content').all()
    const result = articles.find(article => article.stem === slug)
    return result
  }
)

const showMenu = computed(() => {
  const links = page.value?.body.toc?.links
  return links && links.length > 0
})

onMounted(() => {
  if (page.value) isLoading.value = false
})

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
})

definePageMeta({
  layout: 'default',
})

const selectedItem = computed(() => {
  const firstId = page.value?.body.toc?.links?.[0]?.id
  const fullPath = route.fullPath
  const index = fullPath.indexOf('#') + 1
  return decodeURI(fullPath.substring(index)) || firstId
})

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
            v-for="item of page?.body.toc?.links"
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
          :current-title="page?.title"
          :parents="page?.id.split('/').slice(1, -1)"
        />
        <ContentRenderer :value="page" />
      </article>
      <div v-else>page not found</div>
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
