<template>
  <div class="knowledge-graph-container">
    <!-- 小窗口模式 -->
    <div class="knowledge-graph-card" @click="toggleFullscreen" v-if="!isFullscreen && !isEmbedded">
      <div class="card-content">
        <h3>{{ props.title }}</h3>
        <div class="mini-graph" ref="miniGraphContainer"></div>
        <div class="expand-hint">
          <span>点击展开</span>
        </div>
      </div>
    </div>

    <!-- 内嵌小窗口模式 -->
    <div class="knowledge-graph-card-embeded" @click="toggleFullscreen" v-else-if="!isFullscreen && isEmbedded">
      <div class="embeded-graph-container">
        <div ref="graphContainer" class="graph-container">
          <img src="/vue3_graphs_mock.png" width="220px" class="mock-graph">
        </div>
      </div>
    </div>

    <!-- 全屏模式 -->
    <div v-else class="fullscreen-viewer">
      <div class="fullscreen-header">
        <h2>{{ props.title }}知识图谱</h2>
        <button class="close-btn" @click="toggleFullscreen">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="fullscreen-content">
      <!-- 筛选控制面板 -->
      <!-- <div class="filter-panel">
      <div class="filter-input-container">
        <input 
          type="text" 
          v-model="filterTerm" 
          placeholder="输入节点名称进行筛选" 
          class="filter-input"
          @keyup.enter="applyFilter"
        />
        <button @click="applyFilter" class="filter-btn">筛选</button>
        <button @click="resetFilter" class="reset-btn" :disabled="!isFiltered">重置</button>
      </div>
      <div v-if="isFiltered" class="filter-info">
        <span>当前筛选: <strong>{{ currentFilterNode }}</strong></span>
        <span class="filter-count">显示 {{ filteredNodeCount }} 个节点</span>
      </div>
    </div> -->

        <div class="controls">
          <button @click="resetZoom" class="control-btn">重置视图</button>
          <div class="checkbox-control">
            <input type="checkbox" id="showLabels" v-model="showLinkLabels">
            <label for="showLabels">显示关系标签</label>
          </div>
          <div class="search-control">
            <input type="text" v-model="searchTerm" @input="handleSearchInput" placeholder="搜索节点" class="search-input">
          </div>

          <div class="legend-container">
            <div class="legend-header" @click="toggleLegend">
              <span>图例</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                :class="{ 'rotate-icon': !showLegend }">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </div>
            <div class="legend" v-show="showLegend">
              <div class="legend-item">
                <span class="legend-color" style="background-color: #ff7675;"></span>
                <span>根节点</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background-color: #74b9ff;"></span>
                <span>分类</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background-color: #55efc4;"></span>
                <span>入门难度</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background-color: #ffeaa7;"></span>
                <span>基础难度</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background-color: #fd79a8;"></span>
                <span>进阶难度</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background-color: #a29bfe;"></span>
                <span>深入难度</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background-color: #e17055;"></span>
                <span>高级难度</span>
              </div>
            </div>
          </div>
        </div>

        <div ref="graphContainer" class="graph-container"></div>

        <!-- 右侧滑入侧边栏 -->
        <transition name="slide">
          <div v-if="selectedNode" class="sidebar-details">
            <div class="sidebar-header">
              <h3>{{ selectedNode.id }}</h3>
              <button @click="selectedNode = null" class="close-sidebar-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div class="sidebar-content">
              <!-- 基本信息 -->
              <div class="sidebar-section">
                <div class="sidebar-section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <h4>基本信息</h4>
                </div>
                <div class="sidebar-section-content">
                  <div v-if="selectedNode.level" class="info-item">
                    <span class="info-label">难度:</span>
                    <span class="info-badge" :class="'level-' + getLevelClass(selectedNode.level)">
                      {{ selectedNode.level }}
                    </span>
                  </div>
                  <div v-if="selectedNode.content" class="info-item">
                    <p>{{ selectedNode.content }}</p>
                  </div>
                </div>
              </div>

              <!-- 相关资源 -->
              <div class="sidebar-section">
                <div class="sidebar-section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  <h4>相关资源</h4>
                </div>
                <div class="sidebar-section-content">
                  <!-- 这里可以根据节点数据动态生成资源链接 -->
                  <div class="resource-links">
                    <a v-if="getNodeResources(selectedNode).articles.length > 0"
                      v-for="article in getNodeResources(selectedNode).articles" :key="article.title"
                      :href="article.url" target="_blank" class="resource-link">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      <span>{{ article.title }}</span>
                    </a>
                  </div>
                </div>
              </div>

              <!-- 视频教程 -->
              <div class="sidebar-section" v-if="getNodeResources(selectedNode).videos.length > 0">
                <div class="sidebar-section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  </svg>
                  <h4>视频教程</h4>
                </div>
                <div class="sidebar-section-content">
                  <div class="video-container" v-for="video in getNodeResources(selectedNode).videos"
                    :key="video.title">
                    <h5>{{ video.title }}</h5>
                    <div class="video-embed">
                      <iframe :src="video.embedUrl" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen></iframe>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 相关节点 -->
              <div class="sidebar-section">
                <div class="sidebar-section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <h4>相关节点</h4>
                </div>
                <div class="sidebar-section-content">
                  <div class="related-nodes">
                    <div v-for="node in getRelatedNodes(selectedNode)" :key="node.id" class="related-node"
                      @click="selectNode(node)">
                      <div class="node-indicator" :style="{ backgroundColor: getNodeColor(node) }"></div>
                      <span>{{ node.id }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 相关知识图谱 -->
              <div class="sidebar-section">
                <div class="sidebar-section-header">
                  <IconsGraph style="width:20px; height: 20px;" />
                  <h4>相关知识图谱</h4>
                </div>
                <div class="sidebar-section-content">
                  <Graph isEmbedded="true" :graph-id="selectedNode.id" :title="selectedNode.id" />
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import * as d3 from 'd3';
import { transformData } from '~/utils/transformData'
import { useWindowSize } from '@vueuse/core';

// Props
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
import { IconsGraph } from '#components';

const graphData = computed(() => {
  if (props.title === '前端') return frontData;
  else if (props.title === '后端') return backData;
  else if (props.title === 'Vue3') return vueData;
  else return fullData;
})

// 状态变量
const isFullscreen = ref(false);
const showLegend = ref(true);
const showLinkLabels = ref(false);
const searchTerm = ref('');
const selectedNode = ref(null);
const matchedNodes = ref([]);
const searchTimeout = ref(null);
const isSearching = ref(false);

const filterTerm = ref('');
const isFiltered = ref(false);
const currentFilterNode = ref('');
const filteredNodeCount = ref(0);

// 监听窗口大小
const { width: windowWidth, height: windowHeight } = useWindowSize();

// 根据窗口变化重设svg大小
watch([windowWidth, windowHeight], ([windowWidth, windowHeight]) => {
  d3.select("svg").attr("width", windowWidth).attr("height", windowHeight + 100);
})

// DOM引用
const miniGraphContainer = ref(null);
const graphContainer = ref(null);

// D3相关变量
let simulation = null;
let svg = null;
let g = null;
let zoom = null;
let linkLabels = null;
let nodes = [];
let links = [];

let allNodes = []; // 存储所有节点的原始副本
let allLinks = []; // 存储所有链接的原始副本

// 切换全屏/小窗口模式
const toggleFullscreen = async () => {
  isFullscreen.value = !isFullscreen.value;

  // 等待DOM更新后初始化图表
  await nextTick();
  if (isFullscreen.value) {
    initGraph();
  } else {
    initMiniGraph();
  }
};

// 切换图例显示/隐藏
const toggleLegend = () => {
  showLegend.value = !showLegend.value;
};

// 初始化小图, 大图的等比例缩小版本
const initMiniGraph = () => {
  if (!miniGraphContainer.value) return;

  const data = transformData(graphData.value, props.maxDepth);
  nodes = data.nodes;
  links = data.links;

  const width = miniGraphContainer.value.clientWidth;
  const height = miniGraphContainer.value.clientHeight;

  // 清除之前的图表
  d3.select(miniGraphContainer.value).selectAll('*').remove();

  // 创建SVG
  const miniSvg = d3.select(miniGraphContainer.value)
    .append('svg')
    .attr("width", width)
    .attr("height", height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto;');

  const miniG = miniSvg.append('g');

  // 创建链接
  miniG.append('g')
    .selectAll('path')
    .data(links)
    .enter().append('path')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', d => Math.sqrt(d.value) * 0.5)  // 缩小线宽
    .attr('fill', 'none');

  // 创建节点
  miniG.append('g')
    .selectAll('circle')
    .data(nodes)
    .enter().append('circle')
    .attr('r', d => getNodeRadius(d) * 0.5) // 缩小节点半径
    .attr('fill', d => getNodeColor(d))
    .attr('stroke', '#fff')
    .attr('stroke-width', 1);

  // 创建力导向模拟
  const miniSimulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.uniqueId).distance(50 / 8))
    .force('charge', d3.forceManyBody().strength(-150 / 8))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(d => getNodeRadius(d) * 0.5 + 2));

  // 更新函数
  miniSimulation.on('tick', () => {
    miniG.selectAll('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    miniG.selectAll('path').attr('d', d => {
      const dx = d.target.x - d.source.x;
      const dy = d.target.y - d.source.y;
      const dr = Math.sqrt(dx * dx + dy * dy) * 1; // 控制弧度的系数，可以调整
      return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
    });
  });

  // 运行模拟一段时间后停止
  setTimeout(() => miniSimulation.stop(), 2000);
};



// 初始化全屏图表
const initGraph = (isFiltering = false) => {
  if (!graphContainer.value) return;

  if (!isFiltering) {
    const data = transformData(graphData.value, props.maxDepth);
    nodes = data.nodes;
    links = data.links;
      // 保存原始数据的副本
    allNodes = [...nodes];
    allLinks = [...links];
  }

  const width = graphContainer.value.clientWidth;
  const height = graphContainer.value.clientHeight;

  // 清除之前的图表
  d3.select(graphContainer.value).selectAll('*').remove();

  // 创建SVG
  svg = d3.select(graphContainer.value)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto;');

  // 添加发光滤镜
  const defs = svg.append('defs');

  // 创建发光滤镜
  const glowFilter = defs.append('filter')
    .attr('id', 'glow')
    .attr('x', '-50%')
    .attr('y', '-50%')
    .attr('width', '200%')
    .attr('height', '200%');

  glowFilter.append('feGaussianBlur')
    .attr('stdDeviation', '5')
    .attr('result', 'blur');

  glowFilter.append('feComposite')
    .attr('in', 'SourceGraphic')
    .attr('in2', 'blur')
    .attr('operator', 'over');

  // 添加缩放功能
  zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

  svg.call(zoom);

  // 创建一个包含所有元素的组
  g = svg.append('g');

  // 添加箭头标记
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

  // 创建弯曲的链接
  const link = g.append('g')
    .selectAll('path')
    .data(links)
    .enter().append('path')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', d => Math.sqrt(d.value))
    .attr('fill', 'none')
    .attr('marker-end', 'url(#arrow)');

  // 创建链接标签
  linkLabels = g.append('g')
    .selectAll('text')
    .data(links)
    .enter().append('text')
    .attr('font-size', '8px')
    .attr('text-anchor', 'middle')
    .text(d => d.relationship)
    .attr('fill', '#666')
    .attr('dy', -5)
    .attr('opacity', 0); // 标签一开始不展示

  // 计算图的中心点
  const centerX = width / 2;
  const centerY = height / 2;

  // 创建节点
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
      selectedNode.value = d;
      event.stopPropagation();
    })
    .on('mouseover', (event, d) => {
      // 鼠标悬停时突出显示节点及其标签
      highlightNode(d);
    })
    .on('mouseout', () => {
      // 鼠标移出时恢复正常显示
      resetHighlight();
    })
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  // 添加节点标签，根据节点位置调整标签位置
  const label = g.append('g')
    .selectAll('text')
    .data(nodes)
    .enter().append('text')
    .attr('font-size', '10px')
    .attr('pointer-events', 'none')
    .text(d => d.id)
    .attr('fill', useColorMode().value === 'light' ? '#333' : '#fff')
    .attr('class', 'node-label');

  // 创建力导向模拟
  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.uniqueId).distance(150))
    .force('charge', d3.forceManyBody().strength(-600))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(d => getNodeRadius(d) + 10));

  // 更新函数
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

    // 更新标签位置，使用平滑过渡
    label.each(function (d) {
      const labelElement = d3.select(this);
      const nodeRadius = getNodeRadius(d);

      // 计算节点相对于中心的位置
      const dx = d.x - centerX;
      const dy = d.y - centerY;

      // 使用平滑的角度计算，避免突变
      const angle = Math.atan2(dy, dx);

      // 根据角度确定标签位置
      let textAnchor, xOffset, yOffset;

      // 使用平滑的象限划分，避免边界处的突变
      if (angle > -Math.PI / 4 && angle < Math.PI / 4) {
        // 右侧
        textAnchor = 'start';
        xOffset = nodeRadius + 5;
        yOffset = 4;
      } else if (angle >= Math.PI / 4 && angle < 3 * Math.PI / 4) {
        // 下侧
        textAnchor = 'middle';
        xOffset = 0;
        yOffset = nodeRadius + 15;
      } else if (angle >= -3 * Math.PI / 4 && angle <= -Math.PI / 4) {
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

      // 应用计算的位置，使用D3的过渡效果
      labelElement
        .transition()
        .duration(50) // 短暂的过渡时间，避免延迟感
        .attr('x', d.x + xOffset)
        .attr('y', d.y + yOffset)
        .attr('text-anchor', textAnchor);
    });

    linkLabels
      .attr('x', d => (d.source.x + d.target.x) / 2)
      .attr('y', d => (d.source.y + d.target.y) / 2);
  });

  // 点击空白处关闭详情面板
  svg.on('click', () => {
    selectedNode.value = null;
  });

  // 拖拽函数
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

  // 如果是筛选后的视图，自动调整缩放以适应所有可见节点
  if (isFiltering && nodes.length > 0) {
    setTimeout(() => {
      zoomToFit();
    }, 500);
  }
};


// 缩放以适应所有可见节点
const zoomToFit = () => {
  if (!svg || !g || nodes.length === 0) return;
  
  // 计算所有节点的边界
  const bounds = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity
  };
  
  nodes.forEach(node => {
    bounds.minX = Math.min(bounds.minX, node.x || 0);
    bounds.minY = Math.min(bounds.minY, node.y || 0);
    bounds.maxX = Math.max(bounds.maxX, node.x || 0);
    bounds.maxY = Math.max(bounds.maxY, node.y || 0);
  });
  
  // 添加边距
  const padding = 50;
  bounds.minX -= padding;
  bounds.minY -= padding;
  bounds.maxX += padding;
  bounds.maxY += padding;
  
  // 计算缩放比例
  const width = graphContainer.value.clientWidth;
  const height = graphContainer.value.clientHeight;
  const boundWidth = bounds.maxX - bounds.minX;
  const boundHeight = bounds.maxY - bounds.minY;
  
  if (boundWidth === 0 || boundHeight === 0) return;
  
  const scale = Math.min(
    width / boundWidth,
    height / boundHeight,
    2 // 最大缩放限制
  ) * 0.9; // 稍微缩小一点，留出边距
  
  // 计算中心点
  const centerX = bounds.minX + boundWidth / 2;
  const centerY = bounds.minY + boundHeight / 2;
  
  // 应用缩放和平移
  svg.transition()
    .duration(750)
    .call(
      zoom.transform,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(scale)
        .translate(-centerX, -centerY)
    );
};


// 高亮单个节点及其标签
const highlightNode = (node) => {
  if (!svg) return;

  // 增加当前节点的边框宽度并添加发光效果
  svg.selectAll('.node')
    .filter(d => d.uniqueId === node.uniqueId)
    .transition()
    .duration(10)
    .attr('stroke-width', 3)
    .attr('filter', 'url(#glow)');

  // 加粗当前节点的标签
  svg.selectAll('.node-label')
    .filter(d => d.uniqueId === node.uniqueId)
    .transition()
    .duration(10)
    .attr('font-weight', '1000')
    .attr('font-size', '12px');
};

// 重置高亮效果
const resetHighlight = () => {
  if (!svg) return;

  // 如果正在搜索，不重置高亮
  if (searchTerm.value) return;

  // 恢复所有节点的边框宽度和移除滤镜
  svg.selectAll('.node')
    .transition()
    .duration(200)
    .attr('stroke-width', 1.5)
    .attr('filter', null);

  // 恢复所有标签的样式
  svg.selectAll('.node-label')
    .transition()
    .duration(200)
    .attr('font-weight', 'normal')
    .attr('font-size', '10px');
};

// 处理搜索输入
const handleSearchInput = () => {
  // 标记正在搜索
  isSearching.value = true;

  // 清除之前的定时器
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  // 执行搜索
  handleSearch();

  // 设置新的定时器，在用户停止输入500ms后执行定位
  searchTimeout.value = setTimeout(() => {
    isSearching.value = false;
    if (matchedNodes.value.length > 0) {
      focusOnSearchResults();
    }
  }, 500);
};

// 搜索和高亮函数
const handleSearch = () => {
  if (!svg) return;

  const term = searchTerm.value.toLowerCase();

  // 重置所有节点、链接和标签的透明度
  svg.selectAll('circle, line, text, #arrow')
    .attr('opacity', 1);
  svg.selectAll('path').attr('stroke-opacity', 0.6);
  svg.selectAll('#arrow').attr('fill', '#999');

  if (term) {
    // 找到匹配的节点
    matchedNodes.value = nodes.filter(node => node.id.toLowerCase().includes(term));

    // 如果有匹配的节点，降低其他元素的透明度
    if (matchedNodes.value.length > 0) {
      // 降低所有元素的透明度
      svg.selectAll('line, text')
        .attr('opacity', 0);
      svg.selectAll('#arrow').attr('opacity', 0);
      svg.selectAll('path').attr('stroke-opacity', 0);
      svg.selectAll('circle').attr('opacity', 0.1);

      // 高亮匹配的节点及其相关节点
      matchedNodes.value.forEach(node => {
        highlightNodeAndRelated(node);
      });
    } else {
      matchedNodes.value = [];
    }
  } else {
    matchedNodes.value = [];
  }
};

// 缩放到搜索结果
const focusOnSearchResults = () => {
  if (!svg || !zoom || matchedNodes.value.length === 0) return;

  // 计算匹配节点的边界框
  const bounds = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity
  };

  matchedNodes.value.forEach(node => {
    bounds.minX = Math.min(bounds.minX, node.x);
    bounds.minY = Math.min(bounds.minY, node.y);
    bounds.maxX = Math.max(bounds.maxX, node.x);
    bounds.maxY = Math.max(bounds.maxY, node.y);
  });

  // 添加一些边距
  const padding = 50;
  bounds.minX -= padding;
  bounds.minY -= padding;
  bounds.maxX += padding;
  bounds.maxY += padding;

  // 计算边界框的中心和尺寸
  const width = graphContainer.value.clientWidth;
  const height = graphContainer.value.clientHeight;
  const boundWidth = bounds.maxX - bounds.minX;
  const boundHeight = bounds.maxY - bounds.minY;
  const centerX = bounds.minX + boundWidth / 2;
  const centerY = bounds.minY + boundHeight / 2;

  // 计算适当的缩放比例
  const scale = Math.min(
    width / boundWidth,
    height / boundHeight,
    3 // 最大缩放限制
  ) * 0.9; // 稍微缩小一点，留出边距

  // 应用缩放和平移
  svg.transition()
    .duration(750)
    .call(
      zoom.transform,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(scale)
        .translate(-centerX, -centerY)
    );
};

// 高亮节点及其相关节点
const highlightNodeAndRelated = (node) => {
  // 用于存储已处理的节点ID，避免重复处理
  const processedNodes = new Set();

  // 递归高亮节点及其子节点
  const highlightRecursive = (currentNode, depth = 0, maxDepth = 3) => {
    if (depth > maxDepth || processedNodes.has(currentNode.uniqueId)) return;
    processedNodes.add(currentNode.uniqueId);

    // 高亮当前节点
    svg.selectAll('circle')
      .filter(d => d.uniqueId === currentNode.uniqueId)
      .attr('opacity', 1);

    // 高亮节点标签
    svg.selectAll('text.node-label')
      .filter(d => d.uniqueId === currentNode.uniqueId)
      .attr('opacity', 1);

    // 高亮子节点和连接
    links.forEach(link => {
      if (link.source.uniqueId === currentNode.uniqueId) {
        // 高亮连接
        svg.selectAll('path')
          .filter(d => d.source.uniqueId === currentNode.uniqueId && d.target.uniqueId === link.target.uniqueId)
          .attr('opacity', 1);

        // 高亮连接标签
        svg.selectAll('text')
          .filter(d => d === link)
          .attr('opacity', 1);

        // 递归处理子节点
        const childNode = nodes.find(n => n.uniqueId === link.target.uniqueId);
        if (childNode) {
          highlightRecursive(childNode, depth + 1, maxDepth);
        }
      }
    });
  };

  // 高亮当前节点
  svg.selectAll('circle')
    .filter(d => d.uniqueId === node.uniqueId)
    .attr('opacity', 1);

  // 高亮节点标签
  svg.selectAll('text.node-label')
    .filter(d => d.uniqueId === node.uniqueId)
    .attr('opacity', 1);

  // 高亮子节点和连接（递归）
  highlightRecursive(node);

  // 高亮直接指向当前节点的父节点和连接（非递归）
  links.forEach(link => {
    if (link.target.uniqueId === node.uniqueId) {
      // 高亮连接
      svg.selectAll('path')
        .filter(function(d) {
          return d.target && d.target.uniqueId === node.uniqueId && d.source.uniqueId === link.source.uniqueId;
        })
        .attr('stroke-opacity', 0.6);

      // 不可直接写，需要套一个回调函数
      // svg.selectAll('path')
      //   .filter(d => d.target.uniqueId === node.uniqueId && d.source.uniqueId === link.source.uniqueId)
      //   .attr('stroke-opacity', 0.6);

      // 高亮连接标签
      svg.selectAll('text')
        .filter(d => d === link)
        .attr('opacity', 1);

      // 高亮父节点
      svg.selectAll('circle')
        .filter(d => d.uniqueId === link.source.uniqueId)
        .attr('opacity', 1);

      // 高亮父节点标签
      svg.selectAll('text.node-label')
        .filter(d => d.uniqueId === link.source.uniqueId)
        .attr('opacity', 1);
    }
  });
};

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

// 获取节点相关资源（模拟数据，实际应用中可以从API获取）
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
      { title: '进阶视频教程', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    );
  } else if (node.level === '深入' || node.level === '高级') {
    resources.articles.push(
      { title: '高级指南：' + node.id, url: '#' },
      { title: '专家经验分享', url: '#' },
      { title: '前沿研究动态', url: '#' }
    );
    resources.videos.push(
      { title: '专家讲解视频', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
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


// 获取相关节点
const getRelatedNodes = (node) => {
  const relatedNodes = [];

  // 查找直接相连的节点
  links.forEach(link => {
    if (link.source.uniqueId === node.uniqueId) {
      const targetNode = nodes.find(n => n.uniqueId === link.target.uniqueId);
      if (targetNode && !relatedNodes.some(n => n.uniqueId === targetNode.uniqueId)) {
        relatedNodes.push(targetNode);
      }
    } else if (link.target.uniqueId === node.uniqueId) {
      const sourceNode = nodes.find(n => n.uniqueId === link.source.uniqueId);
      if (sourceNode && !relatedNodes.some(n => n.uniqueId === sourceNode.uniqueId)) {
        relatedNodes.push(sourceNode);
      }
    }
  });

  // 暂时mock数据
  if (node.id === 'Vue3') {
    const targetNodes = [nodes.find(n => n.id === '前端基础核心'), nodes.find(n => n.id === 'Pinia'), nodes.find(n => n.id === 'Nuxt.js'), nodes.find(n => n.id === 'Element Plus'), nodes.find(n => n.id === 'Vite前端')];
    relatedNodes.push(...targetNodes);
  }

  // 限制返回的相关节点数量
  return relatedNodes.slice(0, 5);
};

// 选择节点
const selectNode = (node) => {
  selectedNode.value = node;
};


// 应用筛选
const applyFilter = () => {
  if (!filterTerm.value.trim()) {
    resetFilter();
    return;
  }
  
  const term = filterTerm.value.trim().toLowerCase();
  
  // 查找匹配的节点
  const matchedNode = allNodes.find(node => 
    node.id.toLowerCase() === term || 
    node.id.toLowerCase().includes(term)
  );
  
  if (!matchedNode) {
    alert('未找到匹配的节点');
    return;
  }
  
  // 找到匹配节点的所有子节点
  const childNodeIds = new Set();
  const nodesToShow = new Set();
  
  // 添加匹配的节点
  nodesToShow.add(matchedNode.uniqueId);
  currentFilterNode.value = matchedNode.id;
  
  // 递归查找所有子节点
  const findChildNodes = (nodeId) => {
    allLinks.forEach(link => {
      if (link.source.uniqueId === nodeId || link.source === nodeId) {
        const targetId = link.target.uniqueId || link.target;
        if (!childNodeIds.has(targetId)) {
          childNodeIds.add(targetId);
          nodesToShow.add(targetId);
          findChildNodes(targetId);
        }
      }
    });
  };
  
  findChildNodes(matchedNode.uniqueId);
  
  // 筛选节点和链接
  nodes = allNodes.filter(node => nodesToShow.has(node.uniqueId));
  links = allLinks.filter(link => 
    nodesToShow.has(link.source.uniqueId || link.source) && 
    nodesToShow.has(link.target.uniqueId || link.target)
  );
  
  filteredNodeCount.value = nodes.length;
  isFiltered.value = true;
  
  // 重新初始化图表
  simulation.stop();
  initGraph(true);
};

// 重置筛选
const resetFilter = () => {
  if (!isFiltered.value) return;
  
  nodes = [...allNodes];
  links = [...allLinks];
  isFiltered.value = false;
  currentFilterNode.value = '';
  filterTerm.value = '';
  
  // 重新初始化图表
  simulation.stop();
  initGraph();
};


// 重置缩放
const resetZoom = () => {
  svg.transition().duration(750).call(
    zoom.transform,
    d3.zoomIdentity,
    d3.zoomTransform(svg.node()).invert([
      graphContainer.value.clientWidth / 2,
      graphContainer.value.clientHeight / 2
    ])
  );
};

// 监听 showLinkLabels 的变化
watch(showLinkLabels, (newValue) => {
  if (linkLabels) {
    linkLabels.attr('opacity', newValue ? 1 : 0);
  }
});

// 监听搜索词变化
watch(searchTerm, () => {
  handleSearchInput();
});

// 组件挂载后初始化小窗口图表
onMounted(() => {
  initMiniGraph();
});

// 组件卸载前清除定时器
onBeforeUnmount(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
});
</script>

<style scoped>
.knowledge-graph-viewer {
  font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;
}

/* 小窗口样式 */
.mini-viewer {
  position: relative;
  width: 300px;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.mini-viewer:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.mini-graph-container {
  width: 100%;
  height: 100%;
  background-color: var(--background-color);
}

.mini-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
  display: flex;
  flex-direction: column;
}

.mini-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.mini-description {
  font-size: 12px;
  opacity: 0.8;
}

.mini-icon {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 旧的样式 */
.knowledge-graph-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.light-mode .knowledge-graph-container {
  --primary-color: #2563eb;
  --primary-color-hover: #1d4ed8;
  --background-color: #f8f9fa;
  --card-background: #ffffff;
  --text-color: #1f2937;
  --border-color: var(--color-border);
  --shadow-color: rgba(0, 0, 0, 0.1);
  --sidebar-header: #f9fafb;
  --sidebar-header-title: #333;
  --sidebar-hover: #edf2fd;
  --close-btn-color: #666;
}

.dark-mode .knowledge-graph-container {
  --primary-color: #2563eb;
  --primary-color-hover: #1d4ed8;
  --background-color: #2d2d2d;
  --card-background: #1b1b1b;
  --text-color: #ffffff;
  --border-color: var(--color-border);
  --shadow-color: rgba(0, 0, 0, 0.517);
  --sidebar-header: rgb(69, 69, 69);
  --sidebar-header-title: #fbfbfb;
  --sidebar-hover: #314361;
  --close-btn-color: #eee;
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

.knowledge-graph-card-embeded {
  height: 100%;
  display: flex;
  width: 100%;
  height: 200px;
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



/* 全屏模式样式 */
.fullscreen-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--background-color);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.fullscreen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: var(--card-background);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.fullscreen-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: var(--sidebar-header-title);
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--close-btn-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background-color: #f0f0f0;
  color: #333;
}

.fullscreen-content {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 12px;
  max-width: 250px;
  backdrop-filter: blur(64px);
  -webkit-backdrop-filter: blur(64px);
  border: 1px solid var(--border-color);
}

.control-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 15px;
  width: 100%;
  transition: background-color 0.2s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.control-btn:hover {
  background-color: var(--primary-color-hover);
}

.checkbox-control {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.checkbox-control input[type="checkbox"] {
  margin-right: 10px;
}

.search-control {
  margin-bottom: 15px;
  display: flex;
  gap: 8px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  outline: none;
  border-color: #4a6cf7;
}

.legend-container {
  border-top: 1px solid var(--border-color);
  padding-top: 10px;
  transition: all 1s ease-in-out;
}

.legend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 5px 0;
  font-weight: 500;
}

.rotate-icon {
  transform: rotate(180deg);
}

.legend {
  margin-top: 10px;
  transition: max-height 0.3s ease;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  margin-bottom: 8px;
}

.legend-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.graph-container {
  width: 100%;
  height: 100%;
  overflow: hidden;

}

.embeded-graph-container {
  background-color: #f8f9fa;
  width: 100%;
  border-radius: 8px;
}

.mock-graph {
  background-color: #f8f9fa;
  height: 100%;
}

/* 侧边栏动画 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 新的侧边栏样式 */
.sidebar-details {
  position: fixed;
  top: 0;
  right: 0;
  width: 500px;
  height: 100%;
  background-color: var(--background-color);
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);
  z-index: 20;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-left: 1px solid var(--border-color);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--sidebar-header);
}

.sidebar-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--sidebar-header-title);
}

.close-sidebar-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--close-btn-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.close-sidebar-btn:hover {
  background-color: #f0f0f0;
  color: #333;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.sidebar-section {
  margin-bottom: 24px;
  background-color: var(--card-background);
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.sidebar-section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background-color: var(--sidebar-header);
  border-bottom: 1px solid var(--border-color);
}

.sidebar-section-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--sidebar-header-title);
}

.sidebar-section-content {
  padding: 15px;
}

.info-item {
  margin-bottom: 10px;
}

.info-label {
  font-weight: 500;
  margin-right: 8px;
}

.info-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.level-beginner {
  background-color: #55efc4;
  color: #2d3436;
}

.level-basic {
  background-color: #ffeaa7;
  color: #2d3436;
}

.level-intermediate {
  background-color: #fd79a8;
  color: white;
}

.level-advanced {
  background-color: #a29bfe;
  color: white;
}

.level-expert {
  background-color: #e17055;
  color: white;
}

.resource-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.resource-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  background-color: var(--background-color);
  color: var(--primary-color);
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.resource-link:hover {
  background-color: var(--sidebar-hover);
}

.video-container {
  margin-bottom: 15px;
}

.video-container h5 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 500;
}

.video-embed {
  position: relative;
  padding-bottom: 56.25%;
  /* 16:9 比例 */
  height: 0;
  overflow: hidden;
  border-radius: 8px;
}

.video-embed iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.related-nodes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.related-node {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  background-color: var(--background-color);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.related-node:hover {
  background-color: var(--sidebar-hover);
}

.node-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

/* 节点标签样式 */
.node-label {
  font-size: 10px;
  fill: var(--text-color);
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease, fill 0.3s ease, font-weight 0.3s ease, font-size 0.3s ease;
}

/* 节点样式 */
.node {
  transition: r 0.3s ease, opacity 0.3s ease, stroke-width 0.3s ease, filter 0.3s ease;
  cursor: pointer;
}



.filter-panel {
  background-color: white;
  padding: 15px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.filter-input-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.filter-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.filter-input:focus {
  outline: none;
  border-color: #4a6cf7;
}

.filter-btn {
  background-color: #4a6cf7;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.filter-btn:hover {
  background-color: #3a56d4;
}

.reset-btn {
  background-color: #f0f0f0;
  color: #333;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.reset-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.reset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filter-info {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.filter-count {
  background-color: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}
</style>