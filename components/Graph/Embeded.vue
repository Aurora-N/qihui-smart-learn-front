<template>
  <div class="test-graph-container">
    <!-- Main graph container -->
    <div class="graph-area" ref="graphContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import * as d3 from 'd3';
import { useWindowSize } from '@vueuse/core';

const props = defineProps({
  title: {
    type: String,
    default: 'Knowledge Graph'
  },
  isEmbedded: {
    type: Boolean,
    default: false,
  },
  graphId: {
    type: String,
    default: ''
  },
  maxDepth: {
    type: Number,
    default: 5,
  }
})

// 引入数据 mock
import fullData from '~/assets/data.json';
import frontData from '~/assets/data_front_end.json'
import backData from '~/assets/data_back_end.json'
import vueData from '~/assets/data_vue.json'

const graphData = computed(() => {
  if (props.title === '前端') return frontData;
  else if (props.title === '后端') return backData;
  else if (props.title === 'Vue3') return vueData;
  else return fullData;
})


const graphContainer = ref(null);
const selectedNode = ref(null);
const { width: windowWidth, height: windowHeight } = useWindowSize();

let simulation = null;
let svg = null;
let g = null;
let zoom = null;
let nodes = [];
let links = [];

const relatedNodes = computed(() => {
  if (!selectedNode.value) return [];
  
  const related = [];

  links.forEach(link => {
    if (link.target.uniqueId === selectedNode.value.uniqueId) {
      const parentNode = { 
        ...link.source,
        relationType: '父节点' 
      };
      related.push(parentNode);
    }
  });

  links.forEach(link => {
    if (link.source.uniqueId === selectedNode.value.uniqueId) {
      const childNode = { 
        ...link.target,
        relationType: link.relationship || '子节点'
      };
      related.push(childNode);
    }
  });
  
  return related;
});

// 转换数据为D3.js格式
const transformData = (data) => {
  const nodes = [];
  const links = [];
  const nodeMap = new Map();

  const addNode = (node, type, parentId = null) => {
    if (!node) return null;

    const uniqueId = `${type}_${node.id}_${node.level || 'no_level'}`;
    
    if (!nodeMap.has(uniqueId)) {
      const resources = type === 'course1' || type === 'course2' ? generateMockResources(node.id) : [];
      
      const newNode = { 
        ...node, 
        uniqueId,
        type,
        resources,
        group: type === 'all' ? 1 : 
               type === 'category' ? 2 : 
               type === 'part' ? 3 : 
               type === 'depart' ? 4 : 5
      };
      nodes.push(newNode);
      nodeMap.set(uniqueId, newNode);
    }

    if (parentId) {
      links.push({
        source: parentId,
        target: uniqueId,
        relationship: getRelationship(type),
        value: getLinkValue(type)
      });
    }

    return uniqueId;
  };

  const getRelationship = (type) => {
    switch (type) {
      case 'category': return '总路线';
      case 'part': return '板块分类';
      case 'depart': return '板块细分';
      case 'course1':
      case 'course2': return '知识分类';
      default: return '';
    }
  };

  const getLinkValue = (type) => {
    switch (type) {
      case 'category': return 3;
      case 'part':
      case 'depart': return 2;
      case 'course1':
      case 'course2': return 1;
      default: return 1;
    }
  };

  data.forEach(record => {
    const allId = addNode(record.all, 'all');
    const categoryId = addNode(record.category, 'category', allId);
    const partId = addNode(record.part, 'part', categoryId);
    
    if (record.depart) {
      const departId = addNode(record.depart, 'depart', partId);
      if (record.course2) {
        addNode(record.course2, 'course2', departId);
      }
    }
    
    if (record.course1) {
      addNode(record.course1, 'course1', partId);
    }
  });

  return { nodes, links };
};

const generateMockResources = (nodeId) => {
  const resourceTypes = ['教程', '文档', '视频', '示例代码', '练习'];
  const resourceCount = Math.floor(Math.random() * 3) + 1; // 1-3个资源
  const resources = [];
  
  for (let i = 0; i < resourceCount; i++) {
    const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
    resources.push({
      title: `${nodeId}相关${resourceType}`,
      url: '#'
    });
  }
  
  return resources;
};

const initGraph = () => {
  if (!graphContainer.value) return;

  const data = transformData(graphData.value);
  nodes = data.nodes;
  links = data.links;

  const width = graphContainer.value.clientWidth;
  const height = graphContainer.value.clientHeight;

  d3.select(graphContainer.value).selectAll('*').remove();

  svg = d3.select(graphContainer.value)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto;');

  const defs = svg.append('defs');

  const glowFilter = defs.append('filter')
    .attr('id', 'glow')
    .attr('x', '-50%')
    .attr('y', '-50%')
    .attr('width', '200%')
    .attr('height', '200%');
    
  glowFilter.append('feGaussianBlur')
    .attr('stdDeviation', '3')
    .attr('result', 'blur');
    
  glowFilter.append('feComposite')
    .attr('in', 'SourceGraphic')
    .attr('in2', 'blur')
    .attr('operator', 'over');

  zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

  svg.call(zoom);

  g = svg.append('g');

  svg.append('defs').selectAll('marker')
    .data(['arrow'])
    .enter().append('marker')
    .attr('id', d => d)
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 15) // 调整为更小的值
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('fill', '#999')
    .attr('d', 'M0,-5L10,0L0,5');

  const link = g.append('g')
    .selectAll('path')
    .data(links)
    .enter().append('path')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', d => Math.sqrt(d.value))
    .attr('fill', 'none')
    .attr('marker-end', 'url(#arrow)');

  g.append('g')
    .selectAll('text')
    .data(links)
    .enter().append('text')
    .attr('font-size', '8px')
    .attr('text-anchor', 'middle')
    .text(d => d.relationship)
    .attr('fill', '#666')
    .attr('dy', -5);

  const centerX = width / 2;
  const centerY = height / 2;

  const node = g.append('g')
    .selectAll('circle')
    .data(nodes)
    .enter().append('circle')
    .attr('r', d => getNodeRadius(d))
    .attr('fill', d => getNodeColor(d))
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .attr('class', 'node')
    .on('click', (event, d) => {
      event.stopPropagation();
      selectNode(d);
    })
    .on('mouseover', (event, d) => {
      highlightNode(d);
    })
    .on('mouseout', () => {
      resetHighlight();
    })
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  const label = g.append('g')
    .selectAll('text')
    .data(nodes)
    .enter().append('text')
    .attr('font-size', '10px')
    .attr('pointer-events', 'none')
    .text(d => d.id)
    .attr('class', 'node-label');

  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.uniqueId).distance(150))
    .force('charge', d3.forceManyBody().strength(-600))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(d => getNodeRadius(d) + 10));

  simulation.on('tick', () => {
    link.attr('d', d => {
      const dx = d.target.x - d.source.x;
      const dy = d.target.y - d.source.y;
      const dr = Math.sqrt(dx * dx + dy * dy) * 1.5; // 控制弧度的系数，可以调整
      return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
    });
    
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    label.each(function(d) {
      const labelElement = d3.select(this);
      const nodeRadius = getNodeRadius(d);

      const dx = d.x - centerX;
      const dy = d.y - centerY;

      const angle = Math.atan2(dy, dx);

      let textAnchor, xOffset, yOffset;

      if (angle > -Math.PI/4 && angle < Math.PI/4) {
        // 右侧
        textAnchor = 'start';
        xOffset = nodeRadius + 5;
        yOffset = 4;
      } else if (angle >= Math.PI/4 && angle < 3*Math.PI/4) {
        // 下侧
        textAnchor = 'middle';
        xOffset = 0;
        yOffset = nodeRadius + 15;
      } else if (angle >= -3*Math.PI/4 && angle <= -Math.PI/4) {
        // 上侧
        textAnchor = 'middle';
        xOffset = 0;
        yOffset = -nodeRadius - 8;
      } else {
        // 左侧
        textAnchor = 'end';
        xOffset = -nodeRadius - 5;
        yOffset = 4;
      }

      labelElement
        .attr('x', d.x + xOffset)
        .attr('y', d.y + yOffset)
        .attr('text-anchor', textAnchor);
    });
    
    g.selectAll('text')
      .filter(d => typeof d === 'object' && d.relationship)
      .attr('x', d => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        return (d.source.x + d.target.x) / 2 + (dy > 0 ? -10 : 10);
      })
      .attr('y', d => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        return (d.source.y + d.target.y) / 2 + (dx > 0 ? 10 : -10);
      });
  });

  svg.on('click', () => {
    clearSelectedNode();
  });
};

const highlightNode = (node) => {
  if (!svg) return;

  svg.selectAll('.node')
    .filter(d => d.uniqueId === node.uniqueId)
    .transition()
    .duration(200)
    .attr('stroke-width', 3)
    .attr('filter', 'url(#glow)');

  svg.selectAll('.node-label')
    .filter(d => d.uniqueId === node.uniqueId)
    .transition()
    .duration(200)
    .attr('font-weight', 'bold')
    .attr('font-size', '12px');
};

const resetHighlight = () => {
  if (!svg) return;

  svg.selectAll('.node')
    .transition()
    .duration(200)
    .attr('stroke-width', 1.5)
    .attr('filter', null);

  svg.selectAll('.node-label')
    .transition()
    .duration(200)
    .attr('font-weight', 'normal')
    .attr('font-size', '10px');
};

const selectNode = (node) => {
  selectedNode.value = node;

  if (svg) {
    resetHighlight();
    highlightNode(node);
  }
};

const clearSelectedNode = () => {
  selectedNode.value = null;
  resetHighlight();
};

const getNodeRadius = (node) => {
  switch (node.type) {
    case 'all': return 20;
    case 'category': return 15;
    case 'part': return 12;
    case 'depart': return 10;
    default: return 8; // course1 和 course2
  }
};

const getNodeColor = (node) => {
  // 对于没有难度级别的节点（如根节点和分类节点），保持原有颜色
  if (!node.level) {
    switch (node.type) {
      case 'all': return '#ff7675'; // 红色
      case 'category': return '#74b9ff'; // 蓝色
      default: return '#a8a8a8'; // 灰色（默认）
    }
  }

  switch (node.level) {
    case '入门': return '#55efc4'; // 绿色
    case '基础': return '#ffeaa7'; // 黄色
    case '进阶': return '#fd79a8'; // 粉色
    case '深入': return '#a29bfe'; // 紫色
    case '高级': return '#e17055'; // 橙色
    default: return '#a8a8a8'; // 灰色（默认）
  }
};

function dragstarted(event) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

function dragged(event) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

function dragended(event) {
  if (!event.active) simulation.alphaTarget(0);
  event.subject.fx = null;
  event.subject.fy = null;
}

watch([windowWidth, windowHeight], () => {
  if (simulation) {
    simulation.stop();
    initGraph();
  }
});

onMounted(() => {
  initGraph();
});

defineExpose({
  initGraph
});
</script>

<style scoped>
.test-graph-container {
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  overflow: hidden;
  font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;
  border-radius: 10px;
}

.graph-area {
  flex: 1;
  height: 100%;
  background-color: #f8f9fa;
}

/* 节点标签样式 */
.node-label {
  font-size: 10px;
  fill: #333;
  pointer-events: none;
  transition: fill 0.3s ease, font-weight 0.3s ease, font-size 0.3s ease;
}

/* 节点样式 */
.node {
  transition: stroke-width 0.3s ease, filter 0.3s ease;
  cursor: pointer;
}
</style>