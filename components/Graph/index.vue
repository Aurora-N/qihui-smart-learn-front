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
        <div ref="embededGraphContainer" class="graph-container">
        </div>
      </div>
    </div>

    <!-- 全屏模式 -->
    <div v-else class="fullscreen-viewer">
      <div class="fullscreen-header">
        <h2>{{ props.title }}知识图谱</h2>
        <button class="close-btn" @click="toggleFullscreen">
          <IconsClose />
        </button>
      </div>

      <div class="fullscreen-content">
        <div class="controls">
          <div class="controls-container">
            <button @click="resetFilter" class="control-btn" title="重置知识图谱视图">重置</button>
            <div class="checkbox-control">
              <input type="checkbox" id="showLabels" v-model="showLinkLabels">
              <label for="showLabels">关系</label>
            </div>
            <div class="search-control">
              <input type="text" v-model="filterTerm" @input="handleSearchInput" placeholder="搜索节点" class="search-input">
            </div>
            <div class="mobile-legend-btn" title="图例" @click="showLegend = !showLegend">
              <IconsArrowUp :class="{ 'rotate-icon': showLegend }" />
            </div>
          </div>

          <div class="legend-container">
            <div class="legend-header" @click="toggleLegend">
              <span>图例</span>
              <IconsArrowUp :class="{ 'rotate-icon': showLegend }" />
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
          <GraphSidebar ref="sidebarRef" :nodes="nodes" :links="links"/>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import * as d3 from 'd3';
import { transformData, transformRelationData } from '~/utils/transformData'
import { useWindowSize } from '@vueuse/core';
import { createSvg, createSimulation, createLink, createNode, createLabel, createLinkLabel, creatArrow, useGraphAttribute } from '~/utils/graph/utils';
import { useIntersectionObserver } from '@vueuse/core'

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
  },
  isRelationship: {
    type: Boolean,
    default: false, // 是否为关系图谱
  }
})

// 引入数据 mock
import fullData from '~/assets/data.json';
import frontData from '~/assets/data_front_end.json'
import backData from '~/assets/data_back_end.json'
import { useGraphApi } from '~/api/graph';

const graphDataSource = computed(() => {
  if (props.title === '前端') return frontData;
  else if (props.title === '后端') return backData;
  else return fullData;
})

const isFullscreen = ref(false);
const showLegend = ref(true);
const showLinkLabels = ref(false);
const selectedNode = ref(null);
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
const embededGraphContainer = ref(null);

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
  embededGraphInitialized.value = false;
  // 等待DOM更新后初始化图表
  await nextTick();
  if (isFullscreen.value) {
    initGraph();
  } else {
    simulation.value.stop();
    initMiniGraph();
  }
};

// 切换图例显示/隐藏
const toggleLegend = () => {
  showLegend.value = !showLegend.value;
};

// 图谱数据
const graphData = await (async () => {
  if (!props.isRelationship) {
    return transformData(graphDataSource.value, props.maxDepth);
  } else {
    const res = await useGraphApi().getNodeRelationship(props.graphId);
    return transformRelationData(res); // 获取数据
  }
})();

// 初始化小图, 大图的等比例缩小版本
const initMiniGraph = () => {
  if (!miniGraphContainer.value) return;
  const {nodes, links} = graphData;

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
  const miniSimulation = createSimulation(nodes, links, 25, -150 / 8, {x: width / 2, y: height / 2 }, false);

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
  setTimeout(() => miniSimulation.stop(), 1500);
};

const embededGraphData = ref({});

// 初始化被选中结点的子图
const initEmbeddedGrpah = () => {
  if (!embededGraphContainer.value) return;
  const {nodes, links} = embededGraphData.value;

  const width = embededGraphContainer.value.clientWidth;
  const height = embededGraphContainer.value.clientHeight;

  // 清除之前的图表
  d3.select(embededGraphContainer.value).selectAll('*').remove();

  // 创建SVG
  const miniSvg = createSvg(embededGraphContainer, width, height);

  // 添加缩放功能
  const zoom = d3.zoom()
    .scaleExtent([0.5, 2])
    .on('zoom', (event) => {
      miniG.attr('transform', event.transform);
    });

  miniSvg.call(zoom);

  // 创建一个包含所有元素的组
  const miniG = miniSvg.append('g');

  // 添加箭头标记
  creatArrow(miniSvg);

  // 创建链接
  createLink(miniG, links, d => Math.sqrt(d.value), true);

  // 创建节点
  createNode(miniG, nodes, d => getNodeRadius(d), 1);

  // 创建结点标签
  const label = createLabel(miniG, nodes, useColorMode().value === 'light' ? '#333' : '#fff');

  // 创建力导向模拟
  const miniSimulation = createSimulation(nodes, links, 100, -600, {x: width / 2, y: height / 2}, d => getNodeRadius(d));

  // 更新函数
  miniSimulation.on('tick', () => {
    miniG.selectAll('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    miniG.selectAll('path').attr('d', d => {
      const dx = d.target.x - d.source.x;
      const dy = d.target.y - d.source.y;
      const dr = Math.sqrt(dx * dx + dy * dy) * 2; // 控制弧度的系数
      return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
    });

    label
      .attr('x', d => d.x - 10)
      .attr('y', d => d.y - 20);
  });
}

const embededGraphInitialized = ref(false)

useIntersectionObserver(
  embededGraphContainer, // 需要观察的目标元素
  async ([{ isIntersecting: intersect }]) => {
    if (intersect && embededGraphInitialized.value === false) {
      const res = await useGraphApi().getNodeRelationship(props.graphId);
      embededGraphData.value = transformRelationData(res); // 获取数据
      initEmbeddedGrpah();
      embededGraphInitialized.value = true;
    }
  },
  { threshold: 0.5 }
)

const sidebarRef = ref(null);

// 初始化全屏图表
const initGraph = (isFiltering = false) => {
  if (!graphContainer.value) return;

  if (!isFiltering) {
    const data = graphData;
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
    .scaleExtent([0.5, 2])
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
        sidebarRef.value.openSidebar(selectedNode.value);
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
    sidebarRef.value.closeSidebar();
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

  // 设置新的定时器，在用户停止输入500ms后执行筛选
  searchTimeout.value = setTimeout(() => {
    isSearching.value = false;
    applyFilter();
  }, 500);
};

// 获取图相关信息
const getNodeRadius = useGraphAttribute().getNodeRadius;

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
    ElMessage({type: 'warning', message: '未找到匹配的节点', plain: true});
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

// 监听 showLinkLabels 的变化
watch(showLinkLabels, (newValue) => {
  if (linkLabels) {
    linkLabels.attr('opacity', newValue ? 1 : 0);
  }
});

// 组件挂载后初始化小窗口图表
onMounted(() => {
  if(!props.isEmbedded) initMiniGraph();
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