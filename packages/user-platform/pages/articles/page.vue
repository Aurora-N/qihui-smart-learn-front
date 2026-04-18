<script setup lang="ts">
import '~/assets/style/post.scss'
import { useArticleApi } from '~/api/article'
import { useMarkdownText } from '~/composables/useMarkdownText'
import GraphIndex from '~/components/Graph/index.vue'
import GraphSidebar from '~/components/Graph/Sidebar.vue'

const route = useRoute()
const router = useRouter()

const slug = Array.isArray(route.query.path)
  ? (route.query.path.join('/') as string)
  : (route.query.path as string) || ''

const isLoading = ref(true)
const page = ref<any>(null)
const renderedHtml = ref('')

const { getArticleDetail } = useArticleApi()
const { renderMarkdown } = useMarkdownText()

const graphSidebarRef = ref<InstanceType<typeof GraphSidebar> | null>(null)
const keywordNodeMap = new Map<string, any>()
const currentGraphNodes = ref<any[]>([])

const handleGraphReady = ({ nodes }: { nodes: any[] }) => {
  currentGraphNodes.value = nodes

  if (nodes && nodes.length > 0) {
    keywordNodeMap.clear()
    const keywords = new Set<string>()
    nodes.forEach(node => {
      // 记录真实节点属性
      keywordNodeMap.set(node.name || node.id, node)
      keywords.add(node.name || node.id)
    })

    // 如果已经有页面内容了，立刻再次渲染 markdown
    if (page.value?.articleContent) {
      renderMarkdown(page.value.articleContent, Array.from(keywords)).then(
        html => {
          renderedHtml.value = html
        }
      )
    }
  }
}

// 监听 Markdown 内容的点击，调用通过高亮生成的 keyword 项
const onMarkdownClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target && target.classList.contains('markdown-keyword-trigger')) {
    const keyword = target.dataset.keyword
    if (keyword) {
      // 提取出对应的节点信息
      const nodeData = keywordNodeMap.get(keyword) || {}

      const openNodeObj = {
        id: keyword,
        uniqueId: keyword,
        name: keyword,
        content: nodeData.info || '',
        level: nodeData.level || '',
        ...nodeData,
      }

      // 打开侧边栏组件
      graphSidebarRef.value?.openSidebar(openNodeObj as any)
    }
  }
}

onMounted(async () => {
  try {
    // slug format example: "前端/微前端/1.介绍"
    // The API expects ArticleLink which expects articleName and articlePath.
    // We derive articlePath from slug and articleName from the last segment.
    const parts = slug.split('/').map(decodeURIComponent)
    const articleName = parts[parts.length - 1] + '.md' // Assuming articleName is the last segment with .md extension
    const articlePath = parts.join('/') // Assuming slug is the exact path without .md

    const res = await getArticleDetail({ articleName, articlePath })
    if (res) {
      page.value = res

      const keywords = new Set<string>()

      // 提取图谱节点的简单 keywords 用以第一轮初步高亮
      if (
        res.articleKnowledgeGraph &&
        Array.isArray(res.articleKnowledgeGraph)
      ) {
        res.articleKnowledgeGraph.forEach((record: any) => {
          if (record.startNode?.name) {
            keywords.add(record.startNode.name)
            keywordNodeMap.set(record.startNode.name, record.startNode)
          }
          if (record.endNode?.name) {
            keywords.add(record.endNode.name)
            keywordNodeMap.set(record.endNode.name, record.endNode)
          }
        })
      }

      // 如果 currentGraphNodes 已经载入，或者此时只用初步 keywords 渲染
      const finalKeywords =
        currentGraphNodes.value.length > 0
          ? Array.from(
              new Set(currentGraphNodes.value.map(n => n.name || n.id))
            )
          : Array.from(keywords)

      renderedHtml.value = await renderMarkdown(
        res.articleContent || '',
        finalKeywords
      )
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
  <ContentSkeleton v-if="isLoading" />

  <div v-else class="main-container">
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
          :parents="slug.split('/').filter(Boolean).slice(0, -1)"
        />

        <!-- 文章对应的知识图谱 -->
        <GraphIndex
          v-if="
            page.articleKnowledgeGraph && page.articleKnowledgeGraph.length > 0
          "
          :title="`${page.articleName}`"
          :initial-data="page.articleKnowledgeGraph"
          class="article-graph"
          @graph-ready="handleGraphReady"
        />

        <div
          class="article-html-content"
          @click="onMarkdownClick"
          v-html="renderedHtml"
        ></div>
      </article>
      <div v-else-if="!isLoading">page not found</div>
      <Recommend
        title="推荐阅读"
        :lists="recommendPostsList"
        style="margin-top: 1rem"
      />
    </div>
  </div>

  <!-- 图谱节点侧边栏 -->
  <GraphSidebar ref="graphSidebarRef" :nodes="currentGraphNodes" :links="[]" />

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

.article-graph {
  margin: 1.5rem 0;
  width: 100%;
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

  .article-graph {
    margin: 1rem 0;
    width: 100%;
    min-height: 300px;
    border-radius: 8px;
    overflow: hidden;
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
