<template>
  <div class="learning-path-container">
    <div ref="graphContainer" class="graph-container" />

    <!-- 右侧滑入侧边栏 -->
    <transition name="slide">
      <GraphSidebar ref="sidebarRef" :nodes="nodes" :links="links" />
    </transition>
  </div>
</template>

<script setup>
import * as d3 from 'd3'

const graphContainer = ref(null)

const props = defineProps({
  roadmapData: Array,
})

const pathData = ref([])

const selectedNode = ref({})

const sidebarRef = ref(null)

let nodes = []
let links = []

const processData = () => {
  const nodesMap = new Map()
  const links = []

  pathData.value.forEach(path => {
    if (!nodesMap.has(path.startId)) {
      const order = 0
      nodesMap.set(path.startId, {
        id: path.startId,
        order,
        level: path.startLV,
        content: path.startContent,
        color: '#55efc4', // 绿色
      })
    }

    if (!nodesMap.has(path.endId)) {
      const order = path.stepOrder
      let color
      if (order === 1) {
        color = '#74b9ff' // 蓝色
      } else if (order === 2) {
        color = '#ffeaa7' // 黄色
      }
      nodesMap.set(path.endId, {
        id: path.endId,
        order,
        level: path.endLV,
        content: path.endContent,
        color,
      })
    }

    links.push({
      source: path.startId,
      target: path.endId,
      type: path.relationType,
      order: path.stepOrder,
    })
  })

  return {
    nodes: Array.from(nodesMap.values()),
    links,
  }
}

const renderGraph = (nodes, links) => {
  const container = graphContainer.value
  const width = container.clientWidth
  const height = 600

  d3.select(container).selectAll('*').remove()

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('class', 'graph-svg')

  const defs = svg.append('defs')

  const graph = svg.append('g').attr('class', 'graph')

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      'link',
      d3
        .forceLink(links)
        .id(d => d.id)
        .distance(150)
    )
    .force('charge', d3.forceManyBody().strength(-800))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force(
      'x',
      d3
        .forceX(d => {
          if (d.order === 0) return width * 0.2
          if (d.order === 1) return width * 0.5
          return width * 0.8
        })
        .strength(0.5)
    )
    .force('y', d3.forceY(height / 2).strength(0.1))
    .force('collision', d3.forceCollide().radius(60))

  const node = graph
    .append('g')
    .attr('class', 'nodes')
    .selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .call(
      d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    )

  node
    .append('circle')
    .attr('r', 35)
    .attr('class', 'node-circle')
    .style('fill', d => d.color)
    .style('stroke', 'white')
    .style('stroke-width', '3px') // 白边宽度

  node
    .append('text')
    .attr('dy', '.35em')
    .attr('text-anchor', 'middle')
    .text(d => d.id)
    .attr('class', 'node-label')
    .style('fill', '#333') // 深色文本
    .style('font-weight', '600')

  node.append('title').text(d => d.id)

  const link = graph
    .append('g')
    .attr('class', 'links')
    .selectAll('path')
    .data(links)
    .enter()
    .append('g')

  link
    .append('path')
    .attr('class', 'link-path')
    .style('stroke', '#d1d8e0') // 浅灰色边
    .style('stroke-width', '2px')
    .style('fill', 'none')

  link
    .append('polygon')
    .attr('class', 'arrow')
    .attr('points', '0,-4 8,0 0,4')
    .style('fill', '#aaa')

  node
    .on('click', (event, d) => {
      selectedNode.value = d
      sidebarRef.value.openSidebar(selectedNode.value)
      event.stopPropagation()
    })
    .on('mouseover', function (event, d) {
      const nodeColor = d.color
      d3.select(this)
        .select('circle')
        .transition()
        .duration(200)
        .style('stroke-width', '5px')
        .style('filter', `drop-shadow(0 0 8px ${nodeColor})`)
    })
    .on('mouseout', function () {
      d3.select(this)
        .select('circle')
        .transition()
        .duration(200)
        .style('stroke-width', '3px')
        .style('filter', 'none')
    })

  simulation.on('tick', () => {
    link.each(function (d) {
      const linkGroup = d3.select(this)
      const path = linkGroup.select('path')
      const arrow = linkGroup.select('polygon')

      const sourceNode = d.source
      const targetNode = d.target

      const dx = targetNode.x - sourceNode.x
      const dy = targetNode.y - sourceNode.y
      const dr = Math.sqrt(dx * dx + dy * dy)

      const nodeRadius = 35

      const sourceAngle = Math.atan2(dy, dx)
      const sourceX = sourceNode.x + nodeRadius * Math.cos(sourceAngle)
      const sourceY = sourceNode.y + nodeRadius * Math.sin(sourceAngle)

      const targetAngle = Math.atan2(dy, dx)
      const targetX = targetNode.x - nodeRadius * Math.cos(targetAngle)
      const targetY = targetNode.y - nodeRadius * Math.sin(targetAngle)

      const midX = (sourceX + targetX) / 2
      const midY = (sourceY + targetY) / 2
      const offsetX = -dy * 0.2 // 垂直于直线方向的偏移
      const offsetY = dx * 0.2 // 垂直于直线方向的偏移

      const pathData = `M${sourceX},${sourceY} Q${midX + offsetX},${midY + offsetY} ${targetX},${targetY}`
      path.attr('d', pathData)

      const pathNode = path.node()
      const pathLength = pathNode.getTotalLength()
      const endPoint = pathNode.getPointAtLength(pathLength)
      const pointBefore = pathNode.getPointAtLength(pathLength - 2)

      const arrowAngle =
        (Math.atan2(endPoint.y - pointBefore.y, endPoint.x - pointBefore.x) *
          180) /
        Math.PI

      arrow.attr(
        'transform',
        `translate(${endPoint.x}, ${endPoint.y}) rotate(${arrowAngle})`
      )
    })

    node.attr('transform', d => `translate(${d.x},${d.y})`)
  })

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  function dragged(event, d) {
    d.fx = event.x
    d.fy = event.y
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  const zoom = d3
    .zoom()
    .scaleExtent([0.5, 3])
    .on('zoom', event => {
      graph.attr('transform', event.transform)
    })

  svg.call(zoom)
}

const initializedGrpah = ref(false)

const initGraph = () => {
  pathData.value = props.roadmapData
  if (!initializedGrpah.value && pathData.value) {
    const data = processData()
    nodes = data.nodes
    links = data.links
    renderGraph(nodes, links)
    initializedGrpah.value = true
  }
}

defineExpose({
  initGraph,
})
</script>

<style scoped>
.learning-path-container {
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  max-width: 1000px;
  height: 600px;
  margin: 0 auto;
  background-color: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.graph-container {
  width: 100%;
  height: 100%;
  background-color: #f8f9fa; /* 浅灰色背景 */
  border-radius: 8px;
  overflow: hidden;
  border-radius: 12px;
}

:root {
  --order-0-color: #55efc4; /* 绿色 */
  --order-1-color: #74b9ff; /* 蓝色 */
  --order-2-color: #ffeaa7; /* 黄色 */
}

.graph-svg {
  width: 100%;
  height: 100%;
}

.link-path {
  fill: none;
  transition: stroke 0.3s;
}

.node-circle {
  transition: all 0.3s ease;
}

.node-label {
  font-size: 12px;
  pointer-events: none;
}
</style>
