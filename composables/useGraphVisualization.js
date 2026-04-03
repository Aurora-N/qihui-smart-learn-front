import { ref, nextTick } from 'vue'
import * as d3 from 'd3'
import { useWindowSize } from '@vueuse/core'
import {
  createSvg,
  createSimulation,
  createLink,
  createNode,
  createLabel,
  createLinkLabel,
  creatArrow,
  useGraphAttribute,
} from '~/utils/graph/utils'

/**
 * 图表可视化 Composable
 * 处理D3.js图表渲染、缩放、动画等功能
 */
export const useGraphVisualization = () => {
  // DOM引用
  const miniGraphContainer = ref(null)
  const graphContainer = ref(null)
  const embededGraphContainer = ref(null)

  // D3相关变量
  const simulation = ref(null)
  let svg = null
  let g = null
  let zoom = null
  let linkLabels = null

  // 监听窗口大小
  const { width: windowWidth, height: windowHeight } = useWindowSize()

  // 获取图相关信息
  const { getNodeRadius } = useGraphAttribute()

  /**
   * 初始化小图
   */
  const initMiniGraph = graphData => {
    if (!miniGraphContainer.value) return

    const { nodes, links } = graphData
    const width = miniGraphContainer.value.clientWidth
    const height = miniGraphContainer.value.clientHeight

    // 清除之前的图表
    d3.select(miniGraphContainer.value).selectAll('*').remove()

    // 处理多条重合关系线，打上标记
    const linkCount = {}
    links.forEach(d => {
      const getSourceId = n => (typeof n === 'object' ? n.uniqueId || n.id : n)
      const source = getSourceId(d.source)
      const target = getSourceId(d.target)
      const id1 = source < target ? source : target
      const id2 = source < target ? target : source
      const linkId = `${id1}-${id2}`
      linkCount[linkId] = (linkCount[linkId] || 0) + 1
      d.linkGroupIdx = linkCount[linkId]
      d.linkId = linkId
    })
    links.forEach(d => {
      d.totalLinks = linkCount[d.linkId]
    })

    // 创建SVG
    const miniG = createSvg(miniGraphContainer, width, height).append('g')

    // 创建链接
    createLink(miniG, links, d => Math.sqrt(d.value) * 0.4)

    // 创建节点
    createNode(miniG, nodes, d => getNodeRadius(d) * 0.5, 1)

    // 创建力导向模拟
    const miniSimulation = createSimulation(
      nodes,
      links,
      25,
      -150 / 8,
      { x: width / 2, y: height / 2 },
      false
    )

    // 更新函数
    miniSimulation.on('tick', () => {
      miniG
        .selectAll('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)

      miniG.selectAll('path').attr('d', d => {
        const dx = d.target.x - d.source.x
        const dy = d.target.y - d.source.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (d.totalLinks === 1) {
          const dr = dist * 1
          return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`
        }

        const drFactor = 1.0 + (d.linkGroupIdx - 1) * 0.5
        const dr = dist * drFactor

        const getSourceId = n =>
          typeof n === 'object' ? n.uniqueId || n.id : n
        const sourceId = getSourceId(d.source)
        const targetId = getSourceId(d.target)
        const sweep = (
          sourceId < targetId
            ? d.linkGroupIdx % 2 === 0
            : d.linkGroupIdx % 2 !== 0
        )
          ? 1
          : 0

        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,${sweep} ${d.target.x},${d.target.y}`
      })
    })

    // 运行模拟一段时间后停止
    setTimeout(() => miniSimulation.stop(), 1500)
  }

  /**
   * 初始化嵌入式图表
   */
  const initEmbeddedGraph = graphData => {
    if (!embededGraphContainer.value) return

    const { nodes, links } = graphData
    const width = embededGraphContainer.value.clientWidth
    const height = embededGraphContainer.value.clientHeight

    // 清除之前的图表
    d3.select(embededGraphContainer.value).selectAll('*').remove()

    // 创建SVG
    const miniSvg = createSvg(embededGraphContainer, width, height)

    // 添加缩放功能
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', event => {
        miniG.attr('transform', event.transform)
      })

    miniSvg.call(zoom)

    // 创建一个包含所有元素的组
    const miniG = miniSvg.append('g')

    // 添加箭头标记
    creatArrow(miniSvg)

    // 处理多条重合关系线，打上标记
    const linkCount = {}
    links.forEach(d => {
      const getSourceId = n => (typeof n === 'object' ? n.uniqueId || n.id : n)
      const source = getSourceId(d.source)
      const target = getSourceId(d.target)
      const id1 = source < target ? source : target
      const id2 = source < target ? target : source
      const linkId = `${id1}-${id2}`
      linkCount[linkId] = (linkCount[linkId] || 0) + 1
      d.linkGroupIdx = linkCount[linkId]
      d.linkId = linkId
    })
    links.forEach(d => {
      d.totalLinks = linkCount[d.linkId]
    })

    // 创建链接
    createLink(miniG, links, d => Math.sqrt(d.value), true)

    // 创建节点
    createNode(miniG, nodes, d => getNodeRadius(d), 1)

    // 创建结点标签
    const label = createLabel(
      miniG,
      nodes,
      useColorMode().value === 'light' ? '#333' : '#fff'
    )

    // 创建力导向模拟
    const miniSimulation = createSimulation(
      nodes,
      links,
      100,
      -600,
      { x: width / 2, y: height / 2 },
      d => getNodeRadius(d)
    )

    // 更新函数
    miniSimulation.on('tick', () => {
      miniG
        .selectAll('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)

      miniG.selectAll('path').attr('d', d => {
        const dx = d.target.x - d.source.x
        const dy = d.target.y - d.source.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (d.totalLinks === 1) {
          const dr = dist * 2
          return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`
        }

        const drFactor = 1.0 + (d.linkGroupIdx - 1) * 0.5
        const dr = dist * drFactor

        const getSourceId = n =>
          typeof n === 'object' ? n.uniqueId || n.id : n
        const sourceId = getSourceId(d.source)
        const targetId = getSourceId(d.target)
        const sweep = (
          sourceId < targetId
            ? d.linkGroupIdx % 2 === 0
            : d.linkGroupIdx % 2 !== 0
        )
          ? 1
          : 0

        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,${sweep} ${d.target.x},${d.target.y}`
      })

      label.attr('x', d => d.x - 10).attr('y', d => d.y - 20)
    })
  }

  /**
   * 初始化全屏图表
   */
  const initFullGraph = (graphData, callbacks = {}) => {
    if (!graphContainer.value) return

    const { nodes, links } = graphData
    const width = graphContainer.value.clientWidth
    const height = graphContainer.value.clientHeight

    // 清除之前的图表
    d3.select(graphContainer.value).selectAll('*').remove()

    // 创建SVG
    svg = createSvg(graphContainer, width, height, true)

    // 添加发光滤镜
    const defs = svg.append('defs')
    const glowFilter = defs
      .append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%')

    glowFilter
      .append('feGaussianBlur')
      .attr('stdDeviation', '5')
      .attr('result', 'blur')

    glowFilter
      .append('feComposite')
      .attr('in', 'SourceGraphic')
      .attr('in2', 'blur')
      .attr('operator', 'over')

    // 添加缩放功能
    zoom = d3
      .zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', event => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // 创建一个包含所有元素的组
    g = svg.append('g')

    // 添加箭头标记
    creatArrow(svg)

    // 处理多条重合关系线，打上标记
    const linkCount = {}
    links.forEach(d => {
      const getSourceId = n => (typeof n === 'object' ? n.uniqueId || n.id : n)
      const source = getSourceId(d.source)
      const target = getSourceId(d.target)
      const id1 = source < target ? source : target
      const id2 = source < target ? target : source
      const linkId = `${id1}-${id2}`
      linkCount[linkId] = (linkCount[linkId] || 0) + 1
      d.linkGroupIdx = linkCount[linkId]
      d.linkId = linkId
    })
    links.forEach(d => {
      d.totalLinks = linkCount[d.linkId]
    })

    // 创建曲线连接
    const link = createLink(g, links, d => Math.sqrt(d.value), true)

    // 创建链接标签
    linkLabels = createLinkLabel(g, links, false)

    // 计算图的中心点
    const centerX = width / 2
    const centerY = height / 2

    // 创建节点
    const node = createNode(g, nodes, d => getNodeRadius(d), 1.5)

    // 添加节点交互
    node
      .attr('class', 'node')
      .on('click', (event, d) => {
        if (callbacks.onNodeClick) {
          callbacks.onNodeClick(event, d)
        }
        event.stopPropagation()
      })
      .on('mouseover', (event, d) => {
        highlightNode(d)
        if (callbacks.onNodeHover) {
          callbacks.onNodeHover(event, d)
        }
      })
      .on('mouseout', () => {
        resetHighlight()
        if (callbacks.onNodeMouseOut) {
          callbacks.onNodeMouseOut()
        }
      })
      .call(
        d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      )

    // 添加节点标签
    const label = createLabel(
      g,
      nodes,
      useColorMode().value === 'light' ? '#333' : '#fff'
    )

    simulation.value = createSimulation(
      nodes,
      links,
      150,
      -600,
      { x: width / 2, y: height / 2 },
      d => getNodeRadius(d) + 10
    )

    // 更新函数
    simulation.value.on('tick', () => {
      link.attr('d', d => {
        const dx = d.target.x - d.source.x
        const dy = d.target.y - d.source.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (d.totalLinks === 1) {
          // 只有一条连线时使用直线
          const dr = dist * 1.5
          return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`
        }

        // 多条连线时，根据索引分配不同的弧度
        const drFactor = 1.0 + (d.linkGroupIdx - 1) * 0.5
        const dr = dist * drFactor

        // 保证相反方向或者同方向但多条关系能交替弯曲
        const getSourceId = n =>
          typeof n === 'object' ? n.uniqueId || n.id : n
        const sourceId = getSourceId(d.source)
        const targetId = getSourceId(d.target)

        // 交替曲线方向
        const sweep = (
          sourceId < targetId
            ? d.linkGroupIdx % 2 === 0
            : d.linkGroupIdx % 2 !== 0
        )
          ? 1
          : 0

        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,${sweep} ${d.target.x},${d.target.y}`
      })

      node.attr('cx', d => d.x).attr('cy', d => d.y)

      // 更新标签位置
      label.each(function (d) {
        const labelElement = d3.select(this)
        const nodeRadius = getNodeRadius(d)

        const dx = d.x - centerX
        const dy = d.y - centerY
        const angle = Math.atan2(dy, dx)

        let textAnchor, xOffset, yOffset

        if (angle > -Math.PI / 4 && angle < Math.PI / 4) {
          textAnchor = 'start'
          xOffset = nodeRadius + 5
          yOffset = 4
        } else if (angle >= Math.PI / 4 && angle < (3 * Math.PI) / 4) {
          textAnchor = 'middle'
          xOffset = 0
          yOffset = nodeRadius + 15
        } else if (angle >= (-3 * Math.PI) / 4 && angle <= -Math.PI / 4) {
          textAnchor = 'middle'
          xOffset = 0
          yOffset = -nodeRadius - 8
        } else {
          textAnchor = 'end'
          xOffset = -nodeRadius - 5
          yOffset = 4
        }

        labelElement
          .transition()
          .duration(50)
          .attr('x', d.x + xOffset)
          .attr('y', d.y + yOffset)
          .attr('text-anchor', textAnchor)
      })

      linkLabels.each(function (d) {
        const label = d3.select(this)
        const dx = d.target.x - d.source.x
        const dy = d.target.y - d.source.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist === 0) {
          label.attr('x', d.source.x).attr('y', d.source.y)
          return
        }

        const midX = (d.source.x + d.target.x) / 2
        const midY = (d.source.y + d.target.y) / 2

        let dr
        let sweep
        const getSourceId = n =>
          typeof n === 'object' ? n.uniqueId || n.id : n
        const sourceId = getSourceId(d.source)
        const targetId = getSourceId(d.target)

        if (d.totalLinks === 1) {
          dr = dist * 1.5
          sweep = 1
        } else {
          const drFactor = 1.0 + (d.linkGroupIdx - 1) * 0.5
          dr = dist * drFactor
          sweep = (
            sourceId < targetId
              ? d.linkGroupIdx % 2 === 0
              : d.linkGroupIdx % 2 !== 0
          )
            ? 1
            : 0
        }

        // 计算弦中点到弧线中点的距离 h = R - sqrt(R^2 - (d/2)^2)
        const h = dr - Math.sqrt(Math.max(0, dr * dr - (dist * dist) / 4))

        // sweep === 1 表示弧线弯向右侧（从 source 到 target 的右侧）
        const sign = sweep === 1 ? 1 : -1
        // 注意在 SVG 坐标系下，向下为正，法向量计算如下
        const offsetX = sign * (-dy / dist) * h
        const offsetY = sign * (dx / dist) * h

        const posX = midX + offsetX
        const posY = midY + offsetY

        label.attr('x', posX).attr('y', posY).attr('transform', null)
      })
    })

    // 点击空白处的回调
    svg.on('click', () => {
      if (callbacks.onBackgroundClick) {
        callbacks.onBackgroundClick()
      }
    })

    // 拖拽函数
    function dragstarted(event) {
      if (!event.active) simulation.value.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    }

    function dragged(event) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    function dragended(event) {
      if (!event.active) simulation.value.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    }

    return { svg, g, zoom, simulation: simulation.value }
  }

  /**
   * 高亮单个节点及其标签
   */
  const highlightNode = node => {
    if (!svg) return

    svg
      .selectAll('.node')
      .filter(d => d.uniqueId === node.uniqueId)
      .transition()
      .duration(10)
      .attr('stroke-width', 3)
      .attr('filter', 'url(#glow)')

    svg
      .selectAll('.node-label')
      .filter(d => d.uniqueId === node.uniqueId)
      .transition()
      .duration(10)
      .attr('font-weight', '1000')
      .attr('font-size', '12px')
  }

  /**
   * 重置高亮效果
   */
  const resetHighlight = () => {
    if (!svg) return

    svg
      .selectAll('.node')
      .transition()
      .duration(200)
      .attr('stroke-width', 1.5)
      .attr('filter', null)

    svg
      .selectAll('.node-label')
      .transition()
      .duration(200)
      .attr('font-weight', 'normal')
      .attr('font-size', '10px')
  }

  /**
   * 缩放以适应所有可见节点
   */
  const zoomToFit = nodes => {
    if (!svg || !g || !nodes || nodes.length === 0) return

    const bounds = {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity,
    }

    nodes.forEach(node => {
      bounds.minX = Math.min(bounds.minX, node.x || 0)
      bounds.minY = Math.min(bounds.minY, node.y || 0)
      bounds.maxX = Math.max(bounds.maxX, node.x || 0)
      bounds.maxY = Math.max(bounds.maxY, node.y || 0)
    })

    const padding = 50
    bounds.minX -= padding
    bounds.minY -= padding
    bounds.maxX += padding
    bounds.maxY += padding

    const width = graphContainer.value.clientWidth
    const height = graphContainer.value.clientHeight
    const boundWidth = bounds.maxX - bounds.minX
    const boundHeight = bounds.maxY - bounds.minY

    if (boundWidth === 0 || boundHeight === 0) return

    const scale = Math.min(width / boundWidth, height / boundHeight, 2) * 0.9

    const centerX = bounds.minX + boundWidth / 2
    const centerY = bounds.minY + boundHeight / 2

    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(scale)
          .translate(-centerX, -centerY)
      )
  }

  /**
   * 更新链接标签显示状态
   */
  const updateLinkLabelsVisibility = show => {
    if (linkLabels) {
      linkLabels.attr('opacity', show ? 1 : 0)
    }
  }

  /**
   * 更新SVG尺寸
   */
  const updateSvgSize = () => {
    if (svg) {
      svg
        .attr('width', windowWidth.value)
        .attr('height', windowHeight.value + 100)
    }
  }

  /**
   * 停止模拟
   */
  const stopSimulation = () => {
    if (simulation.value) {
      simulation.value.stop()
    }
  }

  return {
    // DOM引用
    miniGraphContainer,
    graphContainer,
    embededGraphContainer,

    // D3对象
    simulation,

    // 方法
    initMiniGraph,
    initEmbeddedGraph,
    initFullGraph,
    highlightNode,
    resetHighlight,
    zoomToFit,
    updateLinkLabelsVisibility,
    updateSvgSize,
    stopSimulation,
  }
}
