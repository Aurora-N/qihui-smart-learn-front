import { ElMessage } from 'element-plus'

/**
 * 图表筛选功能 Composable
 * 处理搜索和筛选逻辑
 */
export const useGraphFilter = (graphState, graphData) => {
  /**
   * 处理搜索输入
   */
  const handleSearchInput = () => {
    // 标记正在搜索
    graphState.isSearching.value = true

    // 清除之前的定时器
    if (graphState.searchTimeout.value) {
      clearTimeout(graphState.searchTimeout.value)
    }

    // 设置新的定时器，在用户停止输入500ms后执行筛选
    graphState.searchTimeout.value = setTimeout(() => {
      graphState.isSearching.value = false
      applyFilter()
    }, 500)
  }

  /**
   * 应用筛选
   */
  const applyFilter = () => {
    if (!graphState.filterTerm.value.trim()) {
      resetFilter()
      return
    }

    const term = graphState.filterTerm.value.trim().toLowerCase()

    // 查找匹配的节点
    const matchedNode = graphData.allNodes.value.find(
      node =>
        node.id.toLowerCase() === term || node.id.toLowerCase().includes(term)
    )

    if (!matchedNode) {
      ElMessage({
        type: 'warning',
        message: '未找到匹配的节点',
        plain: true,
      })
      return
    }

    // 获取匹配节点及其所有子节点
    const nodesToShow = new Set()
    nodesToShow.add(matchedNode.uniqueId)
    graphState.currentFilterNode.value = matchedNode.id

    // 递归查找所有子节点
    const childNodeIds = graphData.getChildNodes(matchedNode.uniqueId)
    childNodeIds.forEach(nodeId => nodesToShow.add(nodeId))

    // 筛选节点和链接
    const filteredNodes = graphData.allNodes.value.filter(node =>
      nodesToShow.has(node.uniqueId)
    )
    const filteredLinks = graphData.allLinks.value.filter(
      link =>
        nodesToShow.has(link.source.uniqueId || link.source) &&
        nodesToShow.has(link.target.uniqueId || link.target)
    )

    // 应用筛选后的数据
    graphData.applyFilteredData(filteredNodes, filteredLinks)

    graphState.filteredNodeCount.value = filteredNodes.length
    graphState.isFiltered.value = true

    return { nodes: filteredNodes, links: filteredLinks }
  }

  /**
   * 重置筛选
   */
  const resetFilter = () => {
    if (!graphState.isFiltered.value) return

    // 重置数据
    graphData.resetToOriginalData()

    // 重置状态
    graphState.isFiltered.value = false
    graphState.currentFilterNode.value = ''
    graphState.filterTerm.value = ''
    graphState.filteredNodeCount.value = 0

    return {
      nodes: graphData.nodes.value,
      links: graphData.links.value,
    }
  }

  /**
   * 根据节点类型筛选
   */
  const filterByNodeType = nodeType => {
    const filteredNodes = graphData.allNodes.value.filter(
      node => node.type === nodeType
    )

    const nodeIds = new Set(filteredNodes.map(node => node.uniqueId))
    const filteredLinks = graphData.allLinks.value.filter(
      link =>
        nodeIds.has(link.source.uniqueId || link.source) &&
        nodeIds.has(link.target.uniqueId || link.target)
    )

    graphData.applyFilteredData(filteredNodes, filteredLinks)
    graphState.isFiltered.value = true
    graphState.filteredNodeCount.value = filteredNodes.length

    return { nodes: filteredNodes, links: filteredLinks }
  }

  /**
   * 根据难度级别筛选
   */
  const filterByDifficulty = difficulty => {
    const filteredNodes = graphData.allNodes.value.filter(
      node => node.difficulty === difficulty
    )

    const nodeIds = new Set(filteredNodes.map(node => node.uniqueId))
    const filteredLinks = graphData.allLinks.value.filter(
      link =>
        nodeIds.has(link.source.uniqueId || link.source) &&
        nodeIds.has(link.target.uniqueId || link.target)
    )

    graphData.applyFilteredData(filteredNodes, filteredLinks)
    graphState.isFiltered.value = true
    graphState.filteredNodeCount.value = filteredNodes.length

    return { nodes: filteredNodes, links: filteredLinks }
  }

  /**
   * 高级筛选：组合多个条件
   */
  const advancedFilter = conditions => {
    let filteredNodes = [...graphData.allNodes.value]

    // 应用各种筛选条件
    if (conditions.nodeType) {
      filteredNodes = filteredNodes.filter(
        node => node.type === conditions.nodeType
      )
    }

    if (conditions.difficulty) {
      filteredNodes = filteredNodes.filter(
        node => node.difficulty === conditions.difficulty
      )
    }

    if (conditions.searchTerm) {
      const term = conditions.searchTerm.toLowerCase()
      filteredNodes = filteredNodes.filter(
        node =>
          node.id.toLowerCase().includes(term) ||
          (node.description && node.description.toLowerCase().includes(term))
      )
    }

    const nodeIds = new Set(filteredNodes.map(node => node.uniqueId))
    const filteredLinks = graphData.allLinks.value.filter(
      link =>
        nodeIds.has(link.source.uniqueId || link.source) &&
        nodeIds.has(link.target.uniqueId || link.target)
    )

    graphData.applyFilteredData(filteredNodes, filteredLinks)
    graphState.isFiltered.value = true
    graphState.filteredNodeCount.value = filteredNodes.length

    return { nodes: filteredNodes, links: filteredLinks }
  }

  return {
    handleSearchInput,
    applyFilter,
    resetFilter,
    filterByNodeType,
    filterByDifficulty,
    advancedFilter,
  }
}
