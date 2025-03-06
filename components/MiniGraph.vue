<!-- 知识图谱组件 -->
<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import * as d3 from 'd3';
import { useGraphApi } from '~/api/graph';

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Knowledge Graph'
  },
  graphId: {
    type: String,
    default: ''
  }
})

// State
const isFullscreen = ref(false);
const miniGraphRef = ref(null);
const fullGraphRef = ref(null);
const miniSimulation = ref(null);

// Sample data for the knowledge graph
const graphData = {
  nodes: [
    { id: 1, name: "Artificial Intelligence", group: 1 },
    { id: 2, name: "Machine Learning", group: 1 },
    { id: 3, name: "Deep Learning", group: 1 },
    { id: 4, name: "Neural Networks", group: 1 },
    { id: 5, name: "Computer Vision", group: 2 },
    { id: 6, name: "Natural Language Processing", group: 2 },
    { id: 7, name: "Reinforcement Learning", group: 3 },
    { id: 8, name: "Supervised Learning", group: 3 },
    { id: 9, name: "Unsupervised Learning", group: 3 },
    { id: 10, name: "Data Science", group: 4 }
  ],
  links: [
    { source: 1, target: 2, value: 1 },
    { source: 2, target: 3, value: 1 },
    { source: 2, target: 8, value: 1 },
    { source: 2, target: 9, value: 1 },
    { source: 3, target: 4, value: 1 },
    { source: 1, target: 5, value: 1 },
    { source: 1, target: 6, value: 1 },
    { source: 2, target: 7, value: 1 },
    { source: 1, target: 10, value: 1 },
    { source: 6, target: 10, value: 1 }
  ]
};

// Methods
const expandGraph = () => {
  isFullscreen.value = true;
  // Stop the mini simulation when going fullscreen to save resources
  if (miniSimulation.value) {
    miniSimulation.value.stop();
  }
};

const closeFullscreen = () => {
  isFullscreen.value = false;
  // After closing fullscreen, ensure mini graph is displayed correctly
  nextTick(() => {
    // Check if mini graph needs to be recreated
    if (!d3.select(miniGraphRef.value).select("svg").size()) {
      createMiniGraph();
    } else {
      // If SVG exists, restart the simulation
      if (miniSimulation.value) {
        miniSimulation.value.restart();
      }
    }
  });
};

// D3 visualization functions
const createMiniGraph = () => {
  if (!miniGraphRef.value) return;

  // Clear any existing content
  d3.select(miniGraphRef.value).selectAll("*").remove();

  const width = miniGraphRef.value.clientWidth;
  const height = miniGraphRef.value.clientHeight;

  const svg = d3.select(miniGraphRef.value)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

  // Create a deep copy of the data to avoid reference issues
  const nodesCopy = graphData.nodes.map(node => ({ ...node }));
  const linksCopy = graphData.links.map(link => ({ ...link }));

  // Create a simplified version of the graph for the mini view
  miniSimulation.value = d3.forceSimulation(nodesCopy)
    .force("link", d3.forceLink(linksCopy).id(d => d.id).distance(30))
    .force("charge", d3.forceManyBody().strength(-50))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = svg.append("g")
    .selectAll("line")
    .data(linksCopy)
    .join("line")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .attr("stroke-width", d => Math.sqrt(d.value));

  const node = svg.append("g")
    .selectAll("circle")
    .data(nodesCopy)
    .join("circle")
    .attr("r", 5)
    .attr("fill", d => d3.schemeCategory10[d.group % 10]);

  miniSimulation.value.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  });
};

const createFullGraph = () => {
  if (!fullGraphRef.value) return;

  // Clear previous graph if any
  d3.select(fullGraphRef.value).selectAll("*").remove();

  const width = fullGraphRef.value.clientWidth;
  const height = fullGraphRef.value.clientHeight;

  const svg = d3.select(fullGraphRef.value)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

  // Add zoom functionality
  const g = svg.append("g");

  svg.call(d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([0.1, 8])
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    }));

  // Create a deep copy of the data to avoid reference issues
  const nodesCopy = graphData.nodes.map(node => ({ ...node }));
  const linksCopy = graphData.links.map(link => ({ ...link }));

  // Create a more detailed version of the graph for the full view
  const simulation = d3.forceSimulation(nodesCopy)
    .force("link", d3.forceLink(linksCopy).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2));

  const link = g.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(linksCopy)
    .join("line")
    .attr("stroke-width", d => Math.sqrt(d.value));

  const node = g.append("g")
    .selectAll(".node")
    .data(nodesCopy)
    .join("g")
    .attr("class", "node")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  node.append("circle")
    .attr("r", 10)
    .attr("fill", d => d3.schemeCategory10[d.group % 10]);

  node.append("text")
    .attr("dx", 15)
    .attr("dy", ".35em")
    .text(d => d.name)
    .attr("font-size", "12px")
    .attr("fill", "#333");

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("transform", d => `translate(${d.x},${d.y})`);
  });

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
};

// Handle window resize
const handleResize = () => {
  if (isFullscreen.value) {
    createFullGraph();
  } else {
    createMiniGraph();
  }
};

// Lifecycle hooks
onMounted(() => {
  createMiniGraph();
  window.addEventListener('resize', handleResize);
});

// Cleanup
const onBeforeUnmount = () => {
  window.removeEventListener('resize', handleResize);
  if (miniSimulation.value) {
    miniSimulation.value.stop();
  }
};

// Watch for changes to isFullscreen
watch(isFullscreen, (newValue) => {
  if (newValue) {
    // Wait for the DOM to update before creating the full graph
    nextTick(() => {
      createFullGraph();
    });
  }
});

//网络请求
const graphApi = useGraphApi()

const getAllGraphs = async () => {
  try {
    const response = await graphApi.getAllGraphs();
    console.log(response)
  } catch (error) {
    console.error('获取失败:', error);
  }
}

const getGraph = async (type, id) => {
  try {
    const response = await graphApi.getGraph({ type, id });
    console.log(response)
  } catch (error) {
    console.error('获取失败:', error);
  }
}

onMounted(() => {
  getAllGraphs()
  getGraph('Category', '后端')
})
</script>

<template>
  <div class="knowledge-graph-container" :class="{ 'fullscreen': isFullscreen }">
    <div class="knowledge-graph-card" @click="expandGraph" v-if="!isFullscreen">
      <div class="card-content">
        <h3>{{ props.title }}</h3>
        <div class="mini-graph" ref="miniGraphRef"></div>
        <div class="expand-hint">
          <span>点击展开</span>
        </div>
      </div>
    </div>

    <div class="fullscreen-view" v-if="isFullscreen">
      <div class="header">
        <h2>{{ props.title }}知识图谱</h2>
        <button class="close-button" @click="closeFullscreen">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="graph-container" ref="fullGraphRef"></div>
    </div>
  </div>
</template>

<style scoped>
.knowledge-graph-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  --primary-color: #2563eb;
  --background-color: #f9fafb;
  --card-background: #ffffff;
  --text-color: #1f2937;
  --border-color: #e5e7eb;
  --shadow-color: rgba(0, 0, 0, 0.1);
}

.knowledge-graph-card {
  background-color: var(--card-background);
  border-radius: 12px;
  box-shadow: 0 4px 20px var(--shadow-color);
  min-width: 320px;
  height: 240px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.knowledge-graph-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-content {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-content h3 {
  margin: 0 0 12px 0;
  color: var(--text-color);
  font-size: 18px;
  font-weight: 600;
}

.mini-graph {
  flex: 1;
  background-color: var(--background-color);
  border-radius: 8px;
  overflow: hidden;
}

.expand-hint {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0 0 0;
  font-size: 14px;
  color: var(--primary-color);
}

.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  background-color: var(--background-color);
}

.fullscreen-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-color);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.graph-container {
  flex: 1;
  overflow: hidden;
  border-radius: 8px;
  margin-top: 16px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .knowledge-graph-card {
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
  }

  .header h2 {
    font-size: 20px;
  }
}
</style>