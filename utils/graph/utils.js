import * as d3 from 'd3';

// 创建SVG
export const createSvg = (graphContainer, width, height, isFull = false) => {
  const svg = d3.select(graphContainer.value)
    .append('svg')
    .attr("width", isFull ? '100%' : width)
    .attr("height", isFull ? '100%' : height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto;');
  return svg;
}

// 创建力导向模拟
export const createSimulation = (nodes, links, linkDistance, strength, center = { x: 0, y: 0 }, forceCollideRadius) => {
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.uniqueId).distance(linkDistance))
    .force('charge', d3.forceManyBody().strength(strength))
    .force('center', d3.forceCenter(center.x, center.y))
    .force('collision', d3.forceCollide().radius(forceCollideRadius));
    
  return simulation;
}

// 创建连接
export const createLink = (g, links, strokeWidth, withMarker = false) => {
  const linkSelection = g.append('g')
    .selectAll('path')
    .data(links)
    .enter().append('path')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', strokeWidth)
    .attr('fill', 'none');

  if (withMarker)
    g.attr('marker-end', 'url(#arrow)');

  return linkSelection;
}

// 创建结点
export const createNode = (g, nodes, radius, strokeWidth) => {
  const nodeSelection = g.append('g')
    .selectAll('circle')
    .data(nodes)
    .enter().append('circle')
    .attr('r', radius) // 缩小节点半径
    .attr('fill', d => useGraphAttribute().getNodeColor(d))
    .attr('stroke', '#fff')
    .attr('stroke-width', strokeWidth);

  return nodeSelection;
}

// 创建结点标签
export const createLabel = (g, nodes, color) => {
  const label = g.append('g')
    .selectAll('text')
    .data(nodes)
    .enter().append('text')
    .attr('font-size', '10px')
    .attr('pointer-events', 'none')
    .text(d => d.id)
    .attr('fill', color)
    .attr('class', 'node-label');

  return label;
}

// 创建连接标签
export const createLinkLabel = (g, links, isShow=true) => {
  const linkLabels = g.append('g')
  .selectAll('text')
  .data(links)
  .enter().append('text')
  .attr('font-size', '8px')
  .attr('text-anchor', 'middle')
  .text(d => d.relationship)
  .attr('fill', '#666')
  .attr('dy', -5)
  .attr('opacity', isShow ? 1 : 0);
  return linkLabels;
}

// 添加箭头标记
export const creatArrow = (svg) => {
  svg.append('defs').selectAll('marker')
    .data(['arrow'])
    .enter().append('marker')
    .attr('id', d => d)
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 25)
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('fill', '#999')
    .attr('d', 'M0,-5L10,0L0,5');
}

// 获取图相关信息
export const useGraphAttribute = () => {
  // 根据节点类型获取半径
  const getNodeRadius = (node) => {
    switch (node.type) {
      case 'all': return 20;
      case 'category': return 15;
      case 'part': return 12;
      case 'depart': return 10;
      default: return 8; // course1 和 course2
    }
  };

  // 根据难度级别获取颜色
  const getNodeColor = (node) => {
    // 对于没有难度级别的节点（如根节点和分类节点），保持原有颜色
    if (!node.level) {
      switch (node.type) {
        case 'all': return '#ff7675'; // 红色
        case 'category': return '#74b9ff'; // 蓝色
        default: return '#a8a8a8'; // 灰色（默认）
      }
    }

    // 根据难度级别设置颜色
    switch (node.level) {
      case '入门': return '#55efc4'; // 绿色
      case '基础': return '#ffeaa7'; // 黄色
      case '进阶': return '#fd79a8'; // 粉色
      case '深入': return '#a29bfe'; // 紫色
      case '高级': return '#e17055'; // 橙色
      default: return '#a8a8a8'; // 灰色（默认）
    }
  };

  // 获取难度级别的CSS类名
  const getLevelClass = (level) => {
    switch (level) {
      case '入门': return 'beginner';
      case '基础': return 'basic';
      case '进阶': return 'intermediate';
      case '深入': return 'advanced';
      case '高级': return 'expert';
      default: return 'default';
    }
  };

  // 获取节点相关资源
  const getNodeResources = (node) => {
    // 这里可以根据节点ID或其他属性获取相关资源
    // 这里使用模拟数据
    const resources = {
      articles: [],
      videos: []
    };

    // 根据节点类型和难度添加不同的资源
    if (node.type === 'all') {
      resources.articles.push(
        { title: '知识图谱概述', url: '#' },
        { title: '学习路径指南', url: '#' }
      );
    } else if (node.level === '入门') {
      resources.articles.push(
        { title: '入门教程：' + node.id, url: '#' },
        { title: '快速上手指南', url: '#' }
      );
      resources.videos.push(
        { title: '入门视频教程', embedUrl: '' }
      );
    } else if (node.level === '基础') {
      resources.articles.push(
        { title: '基础知识：' + node.id + '简介', url: '/articles/前端/前端主流框架/Vue3/1.简介' },
        { title: '官方文档：' + 'Vue.js - 渐进式 JavaScript 框架', url: 'https://cn.vuejs.org/' }
      );
    } else if (node.level === '进阶') {
      resources.articles.push(
        { title: '进阶技巧：' + node.id, url: '#' },
        { title: '深度解析文章', url: '#' }
      );
      resources.videos.push(
        { title: '进阶视频教程', embedUrl: '' }
      );
    } else if (node.level === '深入' || node.level === '高级') {
      resources.articles.push(
        { title: '高级指南：' + node.id, url: '#' },
        { title: '专家经验分享', url: '#' },
        { title: '前沿研究动态', url: '#' }
      );
      resources.videos.push(
        { title: '专家讲解视频', embedUrl: '' }
      );
    }

    if (node.id === 'Vue3') {
      resources.articles.push(
        { title: '实践：' + 'Vue SFC Playground', url: 'https://play.vuejs.org/' },
      );
      resources.videos.push(
        { title: 'Vue3基础入门到实战项目教程——黑马程序员', embedUrl: '//player.bilibili.com/player.html?aid=870472773&bvid=BV1HV4y1a7n4&cid=1596651004&page=1&danmaku=0&autoplay=0' }
      );
    }

    return resources;
  };

  return { getNodeRadius, getNodeColor, getLevelClass, getNodeResources }
}