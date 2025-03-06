<template>
  <div class="knowledge-graph">
    <div class="controls">
      <input v-model="searchTerm" placeholder="Search nodes..." @input="filterNodes" />
      <button @click="toggleUploadModal">Upload Data</button>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <svg v-else ref="svg" :width="width" :height="height"></svg>
    <div v-if="selectedNode" class="node-details">
      <h3>{{ selectedNode.id }}</h3>
      <p>Group: {{ selectedNode.group }}</p>
      <p>Connections: {{ selectedNode.connections }}</p>
      <p>Relationship: {{ selectedNode.relationship }}</p>
      <p>简介: {{ selectedNode.简介 }}</p>
    </div>
    <button @click="toggleLegend" class="legend-toggle">
      {{ showLegend ? 'Hide' : 'Show' }} Legend
    </button>
    <div v-if="showLegend" class="legend">
      <h3>Legend</h3>
      <div v-for="(group, index) in uniqueGroups" :key="index" class="legend-item">
        <span class="legend-color" :style="{ backgroundColor: color(group) }"></span>
        <span>{{ group }}</span>
      </div>
    </div>
    <modal v-if="showUploadModal" @close="toggleUploadModal">
      <template #header>
        <h3>Upload Data</h3>
      </template>
      <template #body>
        <textarea v-model="jsonInput" placeholder="Paste your JSON data here..."></textarea>
        <button @click="loadData">Load Data</button>
      </template>
    </modal>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-if="missingNodesWarning" class="missing-nodes-warning">
      {{ missingNodesWarning }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import * as d3 from 'd3';
import initialData from '~/assets/knowledge_graph_data.json';

// SVG 元素引用
const svg = ref(null);
// 搜索词
const searchTerm = ref('');
// 选中的节点
const selectedNode = ref(null);
// 是否显示上传模态框
const showUploadModal = ref(false);
// JSON 输入
const jsonInput = ref('');
// 是否显示图例
const showLegend = ref(false);
// 错误信息
const error = ref(null);
// 缺失节点警告
const missingNodesWarning = ref('');

// 力导向图模拟
let simulation;
// 节点数组
let nodes = [];
// 连接数组
let links = [];

// 图形数据
const data = ref(initialData);

// 图形宽度
const width = 800;
// 图形高度
const height = 600;
// 节点半径
const nodeRadius = 10;

// 计算唯一的组
const uniqueGroups = computed(() => {
  return [...new Set(data.value.map(node => node.课程大纲))];
});

// 颜色比例尺
const color = d3.scaleOrdinal(d3.schemeCategory10);

// 处理数据
function processData(rawData) {
  const nodes = [];
  const links = [];
  const nodeMap = new Map();
  const missingNodes = new Set();

  // First pass: create nodes
  rawData.forEach((item, index) => {
    const node = {
      id: item.课程分类,
      group: item.课程大纲,
      简介: item.简介,
      isMissing: false
    };
    nodes.push(node);
    nodeMap.set(node.id, index);
  });

  // Second pass: create links and identify missing nodes
  rawData.forEach((item) => {
    for (let i = 1; i <= 9; i++) {
      const relationKey = `关系${i}`;
      const targetKey = `关系${i}后继`;
      if (item[relationKey] && item[targetKey]) {
        if (!nodeMap.has(item[targetKey])) {
          missingNodes.add(item[targetKey]);
        }
        links.push({
          source: item.课程分类,
          target: item[targetKey],
          relationship: item[relationKey]
        });
      }
    }
  });

  // Add missing nodes as placeholders
  missingNodes.forEach((missingNodeId) => {
    const node = {
      id: missingNodeId,
      group: 'Missing',
      简介: 'This node is referenced but not defined in the data',
      isMissing: true
    };
    nodes.push(node);
    nodeMap.set(missingNodeId, nodes.length - 1);
  });

  return { nodes, links, missingNodes: Array.from(missingNodes) };
}

// 组件挂载时初始化图形
onMounted(() => {
  console.log('Component mounted');
  try {
    initGraph();
  } catch (e) {
    console.error('Error initializing graph:', e);
    error.value = e.message;
  }
});

// 监听数据变化，重新初始化图形
watch(data, () => {
  initGraph();
}, { deep: true });

// 初始化图形
function initGraph() {
  console.log('Initializing graph');
  if (!svg.value) {
    console.error('SVG element not found');
    error.value = 'SVG element not found';
    return;
  }

  const { nodes: graphNodes, links: graphLinks, missingNodes } = processData(data.value);

  d3.select(svg.value).selectAll("*").remove();

  simulation = d3.forceSimulation(graphNodes)
    .force("link", d3.forceLink(graphLinks).id(d => d.id).distance(150))
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX(width / 2).strength(0.1))
    .force("y", d3.forceY(height / 2).strength(0.1));

  const svgElement = d3.select(svg.value)
    .attr("viewBox", [0, 0, width, height])
    .call(d3.zoom().on("zoom", zoomed));

  const g = svgElement.append("g");

  // Define arrow markers for each group
  const defs = svgElement.append("defs");
  uniqueGroups.value.forEach(group => {
    defs.append("marker")
      .attr("id", `arrowhead-${group.replace(/\s+/g, '-')}`)
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 8)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 4)
      .attr("markerHeight", 4)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", color(group))
      .style("stroke", "none");
  });

  // Add a special marker for missing nodes
  defs.append("marker")
    .attr("id", "arrowhead-missing")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", 8)
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("xoverflow", "visible")
    .append("svg:path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5")
    .attr("fill", "#ccc")
    .style("stroke", "none");

  const linkGroup = g.append("g")
    .attr("class", "links")
    .selectAll("g")
    .data(graphLinks)
    .join("g");

  linkGroup.append("line")
    .attr("stroke", d => d.source.isMissing || d.target.isMissing ? "#ccc" : color(d.source.group))
    .attr("stroke-opacity", 0.6)
    .attr("stroke-width", 2)
    .attr("marker-end", d => {
      if (d.source.isMissing || d.target.isMissing) {
        return "url(#arrowhead-missing)";
      }
      return `url(#arrowhead-${d.source.group.replace(/\s+/g, '-')})`;
    });

  // 关系标签文本
  linkGroup.append("text")
    .attr("dy", 0)
    .attr("text-anchor", "middle")
    .text(d => d.relationship)
    .attr("fill", "#666")
    .attr("font-size", "10px")
    .attr("pointer-events", "none");

  // 关系标签背后的矩形框
  linkGroup.insert("rect", "text")
    .attr("fill", "rgba(255, 255, 255, 0)")
    .attr("width", function () {
      return this.parentNode.querySelector('text').getBBox().width + 4;
    })
    .attr("height", function () {
      return this.parentNode.querySelector('text').getBBox().height + 2;
    })
    .attr("x", function () {
      return this.parentNode.querySelector('text').getBBox().x - 2;
    })
    .attr("y", function () {
      return this.parentNode.querySelector('text').getBBox().y - 1;
    });

  // 结点
  const node = g.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graphNodes)
    .join("circle")
    .attr("r", d => d.isMissing ? nodeRadius * 0.8 : nodeRadius)
    .attr("fill", d => d.isMissing ? "#ccc" : color(d.group))
    .attr("stroke", d => d.isMissing ? "#999" : null)
    .attr("stroke-width", d => d.isMissing ? 2 : 0)
    .attr("stroke-dasharray", d => d.isMissing ? "3,3" : null)
    .call(drag(simulation))
    .on("click", (event, d) => {
      selectedNode.value = { ...d, connections: getConnections(d) };
    })
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  // 结点标签
  const label = g.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(graphNodes)
    .join("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .text(d => d.id)
    .attr('fill', '#333')
    .style('font-size', '12px')
    .style('pointer-events', 'none');

  simulation.on("tick", () => {
    linkGroup.select("line")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => calculateEdgePoint(d.source, d.target, 'x'))
      .attr("y2", d => calculateEdgePoint(d.source, d.target, 'y'));

    linkGroup.select("text")
      .attr("x", d => (d.source.x + d.target.x) / 2)
      .attr("y", d => (d.source.y + d.target.y) / 2 - 10);

    linkGroup.select("rect")
      .attr("x", function () {
        const textElement = this.parentNode.querySelector('text');
        const bbox = textElement.getBBox();
        return parseFloat(textElement.getAttribute('x')) - bbox.width / 2 - 2;
      })
      .attr("y", function () {
        const textElement = this.parentNode.querySelector('text');
        return parseFloat(textElement.getAttribute('y')) - 11;
      });

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    label
      .attr("x", d => d.x)
      .attr("y", d => d.y + 15);
  });

  function zoomed(event) {
    g.attr("transform", event.transform);
  }

  nodes = node;
  links = linkGroup;

  // Add warning for missing nodes
  if (missingNodes.length > 0) {
    missingNodesWarning.value = `Warning: The following nodes are referenced but not defined: ${missingNodes.join(", ")}`;
  } else {
    missingNodesWarning.value = '';
  }
}

// 计算边缘点
function calculateEdgePoint(source, target, coord) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const ratio = (distance - nodeRadius - 5) / distance; // Subtract 5 to leave space for the arrowhead
  return coord === 'x' ? source.x + dx * ratio : source.y + dy * ratio;
}

// 拖拽行为
function drag(simulation) {
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

  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

// 鼠标悬停处理
function handleMouseOver(event, d) {
  const node = d3.select(this);
  if (!d.isMissing) {
    node.attr("stroke", "#fff").attr("stroke-width", 2);
  } else {
    node.attr("stroke", "#666").attr("stroke-width", 3);
  }

  links.filter(l => l.source.id === d.id || l.target.id === d.id)
    .select("line")
    .attr("stroke-width", 4);

  d3.selectAll("text")
    .filter(t => t.id === d.id)
    .style("font-weight", "bold");
}

// 鼠标离开处理
function handleMouseOut(event, d) {
  const node = d3.select(this);
  if (!d.isMissing) {
    node.attr("stroke", null).attr("stroke-width", null);
  } else {
    node.attr("stroke", "#999").attr("stroke-width", 2);
  }

  links.select("line")
    .attr("stroke-width", 2);

  d3.selectAll("text")
    .style("font-weight", null);
}

// 获取节点连接数
function getConnections(node) {
  return data.value.filter(item =>
    item.课程分类 === node.id ||
    Object.keys(item).some(key => key.startsWith('关系') && key.endsWith('后继') && item[key] === node.id)
  ).length;
}

// 过滤节点
function filterNodes() {
  const term = searchTerm.value.toLowerCase();
  const { nodes: graphNodes, links: graphLinks } = processData(data.value);

  nodes.attr("opacity", d => d.id.toLowerCase().includes(term) ? 1 : 0.1);
  links.attr("opacity", d =>
    d.source.id.toLowerCase().includes(term) ||
      d.target.id.toLowerCase().includes(term) ? 1 : 0.1
  );
  d3.selectAll("text")
    .attr("opacity", d => {
      if (d.id) {
        return d.id.toLowerCase().includes(term) ? 1 : 0.1;
      }
      return d.source.id.toLowerCase().includes(term) ||
        d.target.id.toLowerCase().includes(term) ? 1 : 0.1;
    });
}

// 切换上传模态框显示状态
function toggleUploadModal() {
  showUploadModal.value = !showUploadModal.value;
}

// 切换图例显示状态
function toggleLegend() {
  showLegend.value = !showLegend.value;
}

// 加载数据
function loadData() {
  try {
    const newData = JSON.parse(jsonInput.value);
    data.value = newData;
    showUploadModal.value = false;
    jsonInput.value = '';
    initGraph();
  } catch (error) {
    console.error('Error parsing JSON:', error);
    alert('Invalid JSON data. Please check your input.');
  }
}

// 组件卸载时停止模拟
onUnmounted(() => {
  if (simulation) {
    simulation.stop();
  }
});
</script>

<style scoped>
.knowledge-graph {
  width: 100%;
  height: 100vh;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

svg {
  width: 100%;
  height: 100vh;
  border: 1px solid #ccc;
}

.controls {
  margin-top: 50px;
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
}

.node-details {
  margin-top: 50px;
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.legend-toggle {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 10;
}

.legend {
  position: absolute;
  bottom: 50px;
  left: 10px;
  background-color: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.legend-color {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 50%;
}

input,
button {
  margin: 5px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #42b883;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #3ca576;
}

.error-message {
  position: absolute;
  bottom: 20px;
  left: 10px;
  color: red;
  font-weight: bold;
}

.error {
  color: red;
  font-weight: bold;
  padding: 20px;
}

.missing-nodes-warning {
  margin-top: 50px;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff3cd;
  color: #856404;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 80%;
  text-align: center;
}
</style>