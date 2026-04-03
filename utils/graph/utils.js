import * as d3 from 'd3'
import { useGraphDataStore } from '~/stores/graphDataStore'
import { getLevelColor } from '~/constants/graph'

// 创建SVG
export const createSvg = (graphContainer, width, height, isFull = false) => {
  const svg = d3
    .select(graphContainer.value)
    .append('svg')
    .attr('width', isFull ? '100%' : width)
    .attr('height', isFull ? '100%' : height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto;')
  return svg
}

// 创建力导向模拟
export const createSimulation = (
  nodes,
  links,
  linkDistance,
  strength,
  center = { x: 0, y: 0 },
  isFull = false,
  forceCollideRadius
) => {
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      'link',
      d3
        .forceLink(links)
        .id(d => d.uniqueId)
        .distance(linkDistance)
    )
    .force('charge', d3.forceManyBody().strength(strength))
    .force('center', d3.forceCenter(center.x, center.y))

  if (isFull) {
    simulation.force('collision', d3.forceCollide().radius(forceCollideRadius))
  }

  return simulation
}

// 创建连接
export const createLink = (g, links, strokeWidth, withMarker = false) => {
  const linkSelection = g
    .append('g')
    .selectAll('path')
    .data(links)
    .enter()
    .append('path')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', strokeWidth)
    .attr('fill', 'none')

  if (withMarker) g.attr('marker-end', 'url(#arrow)')

  return linkSelection
}

// 创建结点
export const createNode = (g, nodes, radius, strokeWidth) => {
  const nodeSelection = g
    .append('g')
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('r', radius) // 缩小节点半径
    .attr('fill', d => useGraphAttribute().getNodeColor(d))
    .attr('stroke', '#fff')
    .attr('stroke-width', strokeWidth)

  return nodeSelection
}

// 创建结点标签
export const createLabel = (g, nodes, color) => {
  const label = g
    .append('g')
    .selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr('font-size', '10px')
    .attr('pointer-events', 'none')
    .text(d => d.id)
    .attr('fill', color)
    .attr('class', 'node-label')

  return label
}

// 创建连接标签
export const createLinkLabel = (g, links, isShow = true) => {
  const linkPaths = new Set(links.map(l => `${l.source}-${l.target}`))

  links.forEach(link => {
    if (linkPaths.has(`${link.target}-${link.source}`)) {
      link.isMutual = true
    }
  })

  const linkLabels = g
    .append('g')
    .selectAll('text')
    .data(links)
    .enter()
    .append('text')
    .attr('font-size', '8px')
    .attr('text-anchor', 'middle')
    .text(d => d.relationship)
    .attr('fill', '#666')
    .attr('dy', -5)
    .attr('opacity', isShow ? 1 : 0)
  return linkLabels
}

// 添加箭头标记
export const creatArrow = svg => {
  svg
    .append('defs')
    .selectAll('marker')
    .data(['arrow'])
    .enter()
    .append('marker')
    .attr('id', d => d)
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 25)
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('fill', '#999')
    .attr('d', 'M0,-5L10,0L0,5')
}

// 获取图相关信息
export const useGraphAttribute = () => {
  // 根据节点类型获取半径
  const getNodeRadius = node => {
    // 根据一级目录和二级目录的区分设置大小
    // 如果只有 type1 没有 type2，则是一级节点，大一些
    if (node.type1 && !node.type2) {
      return 20
    }
    // 如果有 type2，则是二级（或更小级别）节点，小一些
    if (node.type2) {
      return 12
    }
    // 默认兜底大小
    return 15
  }

  // 根据难度级别获取颜色
  const getNodeColor = node => {
    // 直接使用 transformData 中已经绑定到节点上的 color
    if (node.color) {
      return node.color
    }

    // 如果未绑定，回退逻辑 (统一收敛到常量控制)
    return getLevelColor(node.level)
  }

  // 获取难度级别的CSS类名
  const getLevelClass = level => {
    const levelNum = Number(level)
    switch (levelNum) {
      case 1:
        return 'beginner' // 入门
      case 2:
        return 'basic' // 初级
      case 3:
        return 'intermediate' // 进阶
      case 4:
        return 'advanced' // 深入
      // case 5:
      //   return 'expert' // 高级
      default:
        return 'default'
    }
  }

  // 获取节点相关资源
  const getNodeResources = async node => {
    const resources = reactive({
      articles: [],
      videos: [],
    })

    const graphDataStore = useGraphDataStore()

    try {
      const response = await graphDataStore.getResources(node.id)

      // 处理返回的 article 数据
      const mappedArticles = response.articles.map(article => {
        const url = article.articlePath
          .split('/')
          .slice(2)
          .map(encodeURIComponent)
          .join('/')
        return {
          ...article,
          name: article.articleName,
          url: url,
        }
      })
      // 按名称排序 article
      mappedArticles.sort((a, b) => a.name.localeCompare(b.name))

      // 处理 video 数据
      const mappedVideos = response.videos.map(video => {
        const mappedVideo = { ...video }
        // 处理bilibili视频成为内嵌格式
        if (mappedVideo.url.includes('www.bilibili.com')) {
          const embedUrl = `//player.bilibili.com/player.html?bvid=${mappedVideo.url.split('/').at(-2)}&page=1&danmaku=0&autoplay=0`
          mappedVideo.url = embedUrl
        }
        return mappedVideo
      })

      // 将处理后的数据加入资源列表
      resources.articles.push(...mappedArticles)
      resources.videos.push(...mappedVideos)
    } catch {
      resources.articles = []
      resources.videos = []
      throw new Error('请求资源失败！')
    }

    return resources
  }

  return { getNodeRadius, getNodeColor, getLevelClass, getNodeResources }
}
