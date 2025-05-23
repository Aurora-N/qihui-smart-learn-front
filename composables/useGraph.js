import { watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useGraphState } from './useGraphState'
import { useGraphData } from './useGraphData'
import { useGraphFilter } from './useGraphFilter'
import { useGraphVisualization } from './useGraphVisualization'

/**
 * 主要的图表 Composable
 * 整合所有图表相关功能
 */
export const useGraph = (props, sidebarRef = null) => {
  // 初始化各个子模块
  const graphState = useGraphState()
  const graphData = useGraphData()
  const graphVisualization = useGraphVisualization()
  const graphFilter = useGraphFilter(graphState, graphData)

  // 初始化图表数据
  const initializeData = async () => {
    try {
      const data = await graphData.initializeGraphData(props)
      return data
    } catch (error) {
      console.error('Failed to initialize graph data:', error)
      throw error
    }
  }

  // 切换全屏模式
  const toggleFullscreen = async () => {
    graphState.toggleFullscreen()

    await nextTick()

    if (graphState.isFullscreen.value) {
      const data = {
        nodes: graphData.nodes.value,
        links: graphData.links.value,
      }
      initFullGraph(data)
    } else {
      graphVisualization.stopSimulation()
      const data = {
        nodes: graphData.nodes.value,
        links: graphData.links.value,
      }
      graphVisualization.initMiniGraph(data)
    }
  }

  // 初始化全屏图表
  const initFullGraph = (data, isFiltering = false) => {
    const callbacks = {
      onNodeClick: (event, node) => {
        graphState.selectNode(node)
        // 打开侧边栏显示节点详情
        if (sidebarRef?.value) {
          sidebarRef.value.openSidebar(node)
        }
      },
      onNodeHover: (event, node) => {
        // 节点悬停处理
      },
      onNodeMouseOut: () => {
        // 节点鼠标离开处理
      },
      onBackgroundClick: () => {
        graphState.clearSelection()
        // 关闭侧边栏
        if (sidebarRef?.value) {
          sidebarRef.value.closeSidebar()
        }
      },
    }

    graphVisualization.initFullGraph(data, callbacks)

    // 如果是筛选后的视图，自动调整缩放
    if (isFiltering && data.nodes.length > 0) {
      setTimeout(() => {
        graphVisualization.zoomToFit(data.nodes)
      }, 500)
    }
  }

  // 重置筛选
  const resetFilter = () => {
    const result = graphFilter.resetFilter()
    if (result && graphState.isFullscreen.value) {
      graphVisualization.stopSimulation()
      initFullGraph(result)
    }
  }

  // 处理搜索输入
  const handleSearchInput = () => {
    graphFilter.handleSearchInput()

    // 监听筛选完成，然后重新渲染
    setTimeout(() => {
      if (graphState.isFiltered.value && graphState.isFullscreen.value) {
        const result = {
          nodes: graphData.nodes.value,
          links: graphData.links.value,
        }
        graphVisualization.stopSimulation()
        initFullGraph(result, true)
      }
    }, 600) // 稍微延迟以确保筛选完成
  }

  // 应用筛选后重新渲染图表
  const applyFilterAndRender = () => {
    const result = graphFilter.applyFilter()
    if (result && graphState.isFullscreen.value) {
      graphVisualization.stopSimulation()
      initFullGraph(result, true)
    }
  }

  // 切换图例显示
  const toggleLegend = () => {
    graphState.toggleLegend()
  }

  // 清除选择
  const clearSelection = () => {
    graphState.clearSelection()
  }

  // 初始化嵌入式图表
  const initEmbeddedGraph = async () => {
    if (graphState.embededGraphInitialized.value) return

    try {
      const data = await graphData.initializeEmbeddedData(props.graphId)
      graphVisualization.initEmbeddedGraph(data)
      graphState.embededGraphInitialized.value = true
    } catch (error) {
      console.error('Failed to initialize embedded graph:', error)
    }
  }

  // 设置嵌入式图表的交叉观察器
  const setupEmbeddedObserver = () => {
    if (!props.isEmbedded) return

    useIntersectionObserver(
      graphVisualization.embededGraphContainer,
      async ([{ isIntersecting }]) => {
        if (isIntersecting && !graphState.embededGraphInitialized.value) {
          await initEmbeddedGraph()
        }
      },
      { threshold: 0.5 }
    )
  }

  // 监听链接标签显示状态变化
  watch(
    () => graphState.showLinkLabels.value,
    newValue => {
      graphVisualization.updateLinkLabelsVisibility(newValue)
    }
  )

  // 监听窗口大小变化
  watch(
    [
      () => graphVisualization.windowWidth,
      () => graphVisualization.windowHeight,
    ],
    () => {
      graphVisualization.updateSvgSize()
    }
  )

  // 组件挂载时的初始化
  const onMounted = async () => {
    try {
      // 初始化数据
      const data = await initializeData()

      // 如果不是嵌入式模式，初始化小图
      if (!props.isEmbedded) {
        graphVisualization.initMiniGraph(data)
      }

      // 设置嵌入式观察器
      setupEmbeddedObserver()
    } catch (error) {
      console.error('Failed to mount graph:', error)
    }
  }

  // 组件卸载前的清理
  const onBeforeUnmount = () => {
    graphState.cleanup()
    graphVisualization.stopSimulation()
  }

  return {
    // 状态
    ...graphState,

    // 数据
    nodes: graphData.nodes,
    links: graphData.links,
    embededGraphData: graphData.embededGraphData,

    // DOM引用
    miniGraphContainer: graphVisualization.miniGraphContainer,
    graphContainer: graphVisualization.graphContainer,
    embededGraphContainer: graphVisualization.embededGraphContainer,

    // 方法
    toggleFullscreen,
    toggleLegend,
    clearSelection,
    resetFilter,
    handleSearchInput,
    applyFilterAndRender,
    initEmbeddedGraph,
    onMounted,
    onBeforeUnmount,

    // 可视化方法
    zoomToFit: graphVisualization.zoomToFit,
    highlightNode: graphVisualization.highlightNode,
    resetHighlight: graphVisualization.resetHighlight,

    // 筛选方法
    filterByNodeType: graphFilter.filterByNodeType,
    filterByDifficulty: graphFilter.filterByDifficulty,
    advancedFilter: graphFilter.advancedFilter,

    // 数据方法
    findNodeById: graphData.findNodeById,
    getNodeLinks: graphData.getNodeLinks,
    getDataStats: graphData.getDataStats,
    isDataLoaded: graphData.isDataLoaded,
  }
}
