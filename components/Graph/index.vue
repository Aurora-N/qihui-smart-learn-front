<template>
  <div class="knowledge-graph-container">
    <!-- 小窗口模式 -->
    <div
      v-if="!isFullscreen && !isEmbedded"
      class="knowledge-graph-card"
      @click="toggleFullscreen"
    >
      <div class="card-content">
        <h3>{{ props.title }}</h3>
        <div ref="miniGraphContainer" class="mini-graph" />
        <div class="expand-hint">
          <span>点击展开</span>
        </div>
      </div>
    </div>

    <!-- 内嵌小窗口模式 -->
    <div
      v-else-if="!isFullscreen && isEmbedded"
      class="knowledge-graph-card-embeded"
      @click="toggleFullscreen"
    >
      <div class="embeded-graph-container">
        <div ref="embededGraphContainer" class="graph-container">
          点击查看大图
        </div>
      </div>
    </div>

    <!-- 全屏模式 -->
    <div v-else class="fullscreen-viewer">
      <div class="fullscreen-header">
        <h2>{{ props.title }}知识图谱</h2>
        <button class="close-btn" @click="toggleFullscreen">
          <IconsClose />
        </button>
      </div>

      <div class="fullscreen-content">
        <!-- 控制面板 -->
        <GraphControls
          v-model:show-link-labels="showLinkLabels"
          v-model:filter-term="filterTerm"
          :show-legend="showLegend"
          :is-filtered="isFiltered"
          :current-filter-node="currentFilterNode"
          :filtered-node-count="filteredNodeCount"
          :is-searching="isSearching"
          @reset="resetFilter"
          @search="handleSearchInput"
          @toggle-legend="toggleLegend"
        />

        <!-- 图表容器 -->
        <div ref="graphContainer" class="graph-container" />

        <!-- 右侧滑入侧边栏 -->
        <transition name="slide">
          <Sidebar ref="sidebarRef" :nodes="nodes" :links="links" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import GraphControls from './GraphControls.vue'
import Sidebar from './Sidebar.vue'
import { useGraph } from '~/composables/useGraph'

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Knowledge Graph',
  },
  isEmbedded: {
    type: Boolean,
    default: false,
  },
  graphId: {
    type: String,
    default: '',
  },
  maxDepth: {
    type: Number,
    default: 5,
  },
  isRelationship: {
    type: Boolean,
    default: false, // 是否为关系图谱
  },
})

// 侧边栏引用
const sidebarRef = ref(null)

// 使用主要的图表 composable，传入侧边栏引用
const {
  // 状态
  isFullscreen,
  showLegend,
  showLinkLabels,
  selectedNode,
  filterTerm,
  isFiltered,
  currentFilterNode,
  filteredNodeCount,
  isSearching,

  // 数据
  nodes,
  links,

  // DOM引用
  miniGraphContainer,
  graphContainer,
  embededGraphContainer,

  // 方法
  toggleFullscreen,
  toggleLegend,
  clearSelection,
  resetFilter,
  handleSearchInput,
  onMounted: graphOnMounted,
  onBeforeUnmount: graphOnBeforeUnmount,
} = useGraph(props, sidebarRef)

// 组件生命周期
onMounted(async () => {
  await graphOnMounted()
})

onBeforeUnmount(() => {
  graphOnBeforeUnmount()
})
</script>

<style lang="scss" scoped>
@import url(~/assets/css/knowledge_graph.scss);
</style>
