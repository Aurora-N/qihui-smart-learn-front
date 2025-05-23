import { ref, computed } from 'vue'
import { transformData, transformRelationData } from '~/utils/transformData'
import { useGraphApi } from '~/api/graph'

// 引入数据 mock
import fullData from '~/assets/data.json'
import frontData from '~/assets/data_front_end.json'
import backData from '~/assets/data_back_end.json'

/**
 * 图表数据管理 Composable
 * 处理数据获取、转换和管理
 */
export const useGraphData = () => {
  // 数据状态
  const nodes = ref([])
  const links = ref([])
  const allNodes = ref([]) // 存储所有节点的原始副本
  const allLinks = ref([]) // 存储所有链接的原始副本
  const embededGraphData = ref({})

  /**
   * 根据标题获取数据源
   */
  const getGraphDataSource = title => {
    if (title === '前端') return frontData
    else if (title === '后端') return backData
    else return fullData
  }

  /**
   * 初始化图表数据
   */
  const initializeGraphData = async props => {
    let graphData

    if (!props.isRelationship) {
      const dataSource = getGraphDataSource(props.title)
      graphData = transformData(dataSource, props.maxDepth)
    } else {
      const res = await useGraphApi().getNodeRelationship(props.graphId)
      graphData = transformRelationData(res)
    }

    // 设置数据
    nodes.value = graphData.nodes
    links.value = graphData.links
    allNodes.value = [...graphData.nodes]
    allLinks.value = [...graphData.links]

    return graphData
  }

  /**
   * 初始化嵌入式图表数据
   */
  const initializeEmbeddedData = async graphId => {
    const res = await useGraphApi().getNodeRelationship(graphId)
    embededGraphData.value = transformRelationData(res)
    return embededGraphData.value
  }

  /**
   * 重置数据到原始状态
   */
  const resetToOriginalData = () => {
    nodes.value = [...allNodes.value]
    links.value = [...allLinks.value]
  }

  /**
   * 应用筛选数据
   */
  const applyFilteredData = (filteredNodes, filteredLinks) => {
    nodes.value = filteredNodes
    links.value = filteredLinks
  }

  /**
   * 获取当前数据统计
   */
  const getDataStats = computed(() => ({
    totalNodes: allNodes.value.length,
    totalLinks: allLinks.value.length,
    visibleNodes: nodes.value.length,
    visibleLinks: links.value.length,
  }))

  /**
   * 检查数据是否已加载
   */
  const isDataLoaded = computed(
    () => nodes.value.length > 0 && links.value.length > 0
  )

  /**
   * 根据ID查找节点
   */
  const findNodeById = nodeId => {
    return allNodes.value.find(
      node => node.id === nodeId || node.uniqueId === nodeId
    )
  }

  /**
   * 根据节点获取相关链接
   */
  const getNodeLinks = nodeId => {
    return allLinks.value.filter(
      link =>
        link.source.uniqueId === nodeId ||
        link.target.uniqueId === nodeId ||
        link.source === nodeId ||
        link.target === nodeId
    )
  }

  /**
   * 获取节点的子节点
   */
  const getChildNodes = nodeId => {
    const childNodeIds = new Set()
    const nodesToShow = new Set([nodeId])

    const findChildNodes = currentNodeId => {
      allLinks.value.forEach(link => {
        const sourceId = link.source.uniqueId || link.source
        const targetId = link.target.uniqueId || link.target

        if (sourceId === currentNodeId) {
          if (!childNodeIds.has(targetId)) {
            childNodeIds.add(targetId)
            nodesToShow.add(targetId)
            findChildNodes(targetId)
          }
        }
      })
    }

    findChildNodes(nodeId)
    return Array.from(nodesToShow)
  }

  return {
    // 数据状态
    nodes,
    links,
    allNodes,
    allLinks,
    embededGraphData,

    // 计算属性
    getDataStats,
    isDataLoaded,

    // 方法
    getGraphDataSource,
    initializeGraphData,
    initializeEmbeddedData,
    resetToOriginalData,
    applyFilteredData,
    findNodeById,
    getNodeLinks,
    getChildNodes,
  }
}
