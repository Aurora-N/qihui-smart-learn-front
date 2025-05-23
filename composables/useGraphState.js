import { ref, computed } from 'vue'

/**
 * 图表状态管理 Composable
 * 管理图表的各种显示状态
 */
export const useGraphState = () => {
  // 基础状态
  const isFullscreen = ref(false)
  const showLegend = ref(true)
  const showLinkLabels = ref(false)
  const selectedNode = ref(null)
  const embededGraphInitialized = ref(false)

  // 搜索相关状态
  const filterTerm = ref('')
  const isFiltered = ref(false)
  const currentFilterNode = ref('')
  const filteredNodeCount = ref(0)
  const isSearching = ref(false)
  const searchTimeout = ref(null)

  // 计算属性
  const hasFilter = computed(() => filterTerm.value.trim().length > 0)
  const isFilterActive = computed(
    () => isFiltered.value && currentFilterNode.value
  )

  // 状态切换方法
  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
    embededGraphInitialized.value = false
  }

  const toggleLegend = () => {
    showLegend.value = !showLegend.value
  }

  const toggleLinkLabels = () => {
    showLinkLabels.value = !showLinkLabels.value
  }

  // 选择节点
  const selectNode = node => {
    selectedNode.value = node
  }

  const clearSelection = () => {
    selectedNode.value = null
  }

  // 重置所有状态
  const resetState = () => {
    selectedNode.value = null
    filterTerm.value = ''
    isFiltered.value = false
    currentFilterNode.value = ''
    filteredNodeCount.value = 0
    isSearching.value = false
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
      searchTimeout.value = null
    }
  }

  // 清理函数
  const cleanup = () => {
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
      searchTimeout.value = null
    }
  }

  return {
    // 状态
    isFullscreen,
    showLegend,
    showLinkLabels,
    selectedNode,
    embededGraphInitialized,
    filterTerm,
    isFiltered,
    currentFilterNode,
    filteredNodeCount,
    isSearching,
    searchTimeout,

    // 计算属性
    hasFilter,
    isFilterActive,

    // 方法
    toggleFullscreen,
    toggleLegend,
    toggleLinkLabels,
    selectNode,
    clearSelection,
    resetState,
    cleanup,
  }
}
