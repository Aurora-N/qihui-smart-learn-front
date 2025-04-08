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
import { createSvg, createSimulation, createLink, createNode, createLabel, createLinkLabel, creatArrow, useGraphAttribute } from '~/utils/graph/utils';

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
const simulation = ref(null);
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
  const miniG = createSvg(miniGraphContainer, width, height).append('g');

  // 创建链接
  createLink(miniG, links, d => Math.sqrt(d.value) * 0.4);

  // 创建节点
  createNode(miniG, nodes, d => getNodeRadius(d) * 0.5, 1)

  // 创建力导向模拟
  const miniSimulation = createSimulation(nodes, links, 50 / 8, -150 / 8, {x: width / 2, y: height / 2 }, d => getNodeRadius(d) * 0.5 + 2);

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
  svg = createSvg(graphContainer, width, height, true);

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
  creatArrow(svg);

  // 创建曲线连接
  const link = createLink(g, links, d => Math.sqrt(d.value), true);

  // 创建链接标签
  linkLabels = createLinkLabel(g, links, false);

  // 计算图的中心点
  const centerX = width / 2;
  const centerY = height / 2;

  // 创建节点
  const node = createNode(g, nodes, d => getNodeRadius(d), 1.5);
  // 添加悬停效果
  node.attr('class', 'node')
      .on('click', (event, d) => {
        selectedNode.value = d;
        event.stopPropagation();
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

  // 添加节点标签
  const label = createLabel(g, nodes, useColorMode().value === 'light' ? '#333' : '#fff');

  simulation.value = createSimulation(nodes, links, 150, -600, {x: width / 2, y: height / 2}, d => getNodeRadius(d) + 10)
  
  // 更新函数
  simulation.value.on('tick', () => {
    link.attr('d', d => {
      const dx = d.target.x - d.source.x;
      const dy = d.target.y - d.source.y;
      const dr = Math.sqrt(dx * dx + dy * dy) * 1.5; // 控制弧度的系数
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

      const angle = Math.atan2(dy, dx);

      // 根据角度确定标签位置
      let textAnchor, xOffset, yOffset;

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

      labelElement
        .transition()
        .duration(50)
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
    if (!event.active) simulation.value.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event){
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.value.alphaTarget(0);
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

// 获取图相关信息
const getNodeRadius = useGraphAttribute().getNodeRadius;
const getNodeColor = useGraphAttribute().getNodeColor;
const getLevelClass = useGraphAttribute().getLevelClass;
const getNodeResources = useGraphAttribute().getNodeResources;
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
  simulation.value.stop();
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
  simulation.value.stop();
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
@import url(~/assets/css/knowledge_graph.css);
</style>