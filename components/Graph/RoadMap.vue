<template>
  <div class="learning-path-container">
    <div class="graph-container" ref="graphContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';

const graphContainer = ref(null);

const props = defineProps({
  roadmapData: Object,
//   default: [
//     {
//         "startId": "TypeScript",
//         "endId": "React",
//         "relationType": "学习路线",
//         "stepOrder": 1
//     },
//     {
//         "startId": "TypeScript",
//         "endId": "React",
//         "relationType": "学习路线",
//         "stepOrder": 1
//     },
//     {
//         "startId": "TypeScript",
//         "endId": "React",
//         "relationType": "学习路线",
//         "stepOrder": 1
//     },
//     {
//         "startId": "TypeScript",
//         "endId": "React",
//         "relationType": "学习路线",
//         "stepOrder": 1
//     },
//     {
//         "startId": "TypeScript",
//         "endId": "Vue3",
//         "relationType": "学习路线",
//         "stepOrder": 1
//     },
//     {
//         "startId": "TypeScript",
//         "endId": "Vue3",
//         "relationType": "学习路线",
//         "stepOrder": 1
//     },
//     {
//         "startId": "TypeScript",
//         "endId": "Vue3",
//         "relationType": "学习路线",
//         "stepOrder": 1
//     },
//     {
//         "startId": "TypeScript",
//         "endId": "Vue3",
//         "relationType": "学习路线",
//         "stepOrder": 1
//     },
//     {
//         "startId": "TypeScript",
//         "endId": "Angular",
//         "relationType": "学习路线",
//         "stepOrder": 1
//     },
//     {
//         "startId": "React",
//         "endId": "Next.js",
//         "relationType": "学习路线",
//         "stepOrder": 2
//     },
//     {
//         "startId": "React",
//         "endId": "Astro",
//         "relationType": "学习路线",
//         "stepOrder": 2
//     },
//     {
//         "startId": "React",
//         "endId": "Zustand",
//         "relationType": "学习路线",
//         "stepOrder": 2
//     },
//     {
//         "startId": "Vue3",
//         "endId": "Nuxt.js",
//         "relationType": "学习路线",
//         "stepOrder": 2
//     },
//     {
//         "startId": "Vue3",
//         "endId": "Pinia",
//         "relationType": "学习路线",
//         "stepOrder": 2
//     },
//     {
//         "startId": "Vue3",
//         "endId": "Element Plus",
//         "relationType": "学习路线",
//         "stepOrder": 2
//     }
// ]
})

// Learning path data
const pathData = ref([]);

// Process data to create nodes and links
const processData = () => {
  const nodesMap = new Map();
  const links = [];
  
  // Extract unique nodes
  pathData.value.forEach(path => {
    if (!nodesMap.has(path.startId)) {
      const level = 0; // TypeScript is level 0
      nodesMap.set(path.startId, { 
        id: path.startId, 
        level,
        color: '#74b9ff' // 蓝色 for TypeScript (level 0)
      });
    }
    
    if (!nodesMap.has(path.endId)) {
      const level = path.stepOrder;
      let color;
      if (level === 1) {
        color = '#55efc4'; // 绿色 for level 1
      } else if (level === 2) {
        color = '#ffeaa7'; // 黄色 for level 2
      }
      nodesMap.set(path.endId, { id: path.endId, level, color });
    }
    
    links.push({
      source: path.startId,
      target: path.endId,
      type: path.relationType,
      order: path.stepOrder
    });
  });
  
  return {
    nodes: Array.from(nodesMap.values()),
    links
  };
};

const renderGraph = (nodes, links) => {
  const container = graphContainer.value;
  const width = container.clientWidth;
  const height = 600;
  
  // Clear any existing SVG
  d3.select(container).selectAll("*").remove();
  
  // Create SVG
  const svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("class", "graph-svg");
  
  // 为每个链接创建一个唯一的箭头标记
  const defs = svg.append("defs");
  
  // 创建一个组用于图形
  const graph = svg.append("g")
    .attr("class", "graph");
  
  // 创建模拟
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(150))
    .force("charge", d3.forceManyBody().strength(-800))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX(d => {
      // 基于级别定位节点
      if (d.level === 0) return width * 0.2;
      if (d.level === 1) return width * 0.5;
      return width * 0.8;
    }).strength(0.5))
    .force("y", d3.forceY(height / 2).strength(0.1))
    .force("collision", d3.forceCollide().radius(60));
  
  // 创建节点
  const node = graph.append("g")
    .attr("class", "nodes")
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));
  
  // 添加带白色边框的圆形节点
  node.append("circle")
    .attr("r", 35)
    .attr("class", "node-circle")
    .style("fill", d => d.color)
    .style("stroke", "white")
    .style("stroke-width", "3px"); // 白边宽度
  
  // 添加节点标签
  node.append("text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(d => d.id)
    .attr("class", "node-label")
    .style("fill", "#333") // 深色文本
    .style("font-weight", "600");
  
  // 添加工具提示标题
  node.append("title")
    .text(d => d.id);
  
  // 创建带曲线的链接
  const link = graph.append("g")
    .attr("class", "links")
    .selectAll("path")
    .data(links)
    .enter()
    .append("g");
  
  // 为每个链接添加路径
  link.append("path")
    .attr("class", "link-path")
    .style("stroke", "#d1d8e0") // 浅灰色边
    .style("stroke-width", "2px")
    .style("fill", "none");
  
  // 为每个链接添加箭头
  link.append("polygon")
    .attr("class", "arrow")
    .attr("points", "0,-4 8,0 0,4")
    .style("fill", "#aaa");
  
  // 添加带节点颜色的悬停效果
  node.on("mouseover", function(event, d) {
    // 使用节点自己的颜色创建辉光效果
    const nodeColor = d.color;
    d3.select(this).select("circle")
      .transition()
      .duration(200)
      .style("stroke-width", "5px") // 鼠标悬停时增加白边宽度
      .style("filter", `drop-shadow(0 0 8px ${nodeColor})`); // 使用节点颜色的辉光
  })
  .on("mouseout", function() {
    d3.select(this).select("circle")
      .transition()
      .duration(200)
      .style("stroke-width", "3px") // 恢复原来的白边宽度
      .style("filter", "none"); // 移除辉光效果
  });
  
  // 在模拟tick上更新位置
  simulation.on("tick", () => {
    // 更新带曲线的链接路径
    link.each(function(d) {
      const linkGroup = d3.select(this);
      const path = linkGroup.select("path");
      const arrow = linkGroup.select("polygon");
      
      const sourceNode = d.source;
      const targetNode = d.target;
      
      const dx = targetNode.x - sourceNode.x;
      const dy = targetNode.y - sourceNode.y;
      const dr = Math.sqrt(dx * dx + dy * dy);
      
      // 节点半径
      const nodeRadius = 35;
      
      // 计算起点（源节点边缘）
      const sourceAngle = Math.atan2(dy, dx);
      const sourceX = sourceNode.x + (nodeRadius * Math.cos(sourceAngle));
      const sourceY = sourceNode.y + (nodeRadius * Math.sin(sourceAngle));
      
      // 计算终点（目标节点边缘）
      const targetAngle = Math.atan2(dy, dx);
      const targetX = targetNode.x - (nodeRadius * Math.cos(targetAngle));
      const targetY = targetNode.y - (nodeRadius * Math.sin(targetAngle));
      
      // 计算曲线的控制点
      const midX = (sourceX + targetX) / 2;
      const midY = (sourceY + targetY) / 2;
      const offsetX = -dy * 0.2; // 垂直于直线方向的偏移
      const offsetY = dx * 0.2;  // 垂直于直线方向的偏移
      
      // 创建二次贝塞尔曲线路径
      const pathData = `M${sourceX},${sourceY} Q${midX + offsetX},${midY + offsetY} ${targetX},${targetY}`;
      path.attr("d", pathData);
      
      // 计算箭头位置和旋转
      // 获取路径末端的切线方向
      const pathNode = path.node();
      const pathLength = pathNode.getTotalLength();
      const endPoint = pathNode.getPointAtLength(pathLength);
      const pointBefore = pathNode.getPointAtLength(pathLength - 2);
      
      // 计算箭头旋转角度
      const arrowAngle = Math.atan2(endPoint.y - pointBefore.y, endPoint.x - pointBefore.x) * 180 / Math.PI;
      
      // 定位和旋转箭头
      arrow.attr("transform", `translate(${endPoint.x}, ${endPoint.y}) rotate(${arrowAngle})`);
    });
    
    // 更新节点位置
    node.attr("transform", d => `translate(${d.x},${d.y})`);
  });
  
  // 拖拽函数
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  // 添加缩放功能
  const zoom = d3.zoom()
    .scaleExtent([0.5, 3])
    .on("zoom", (event) => {
      graph.attr("transform", event.transform);
    });
  
  svg.call(zoom);
};

// onMounted(() => {
//   const { nodes, links } = processData();
//   renderGraph(nodes, links);
// });

const initializedGrpah = ref(false);

const initGraph = () => {
  pathData.value = props.roadmapData;
  if (!initializedGrpah.value && pathData.value) {
    const { nodes, links } = processData();
    renderGraph(nodes, links);
    console.log('init!!!');
    initializedGrpah.value = true;
  } else {
    
  }
}

defineExpose({
  initGraph
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
  --level-0-color: #74b9ff; /* 蓝色 */
  --level-1-color: #55efc4; /* 绿色 */
  --level-2-color: #ffeaa7; /* 黄色 */
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