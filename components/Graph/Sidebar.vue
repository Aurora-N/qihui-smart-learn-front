<script setup lang="ts">
import { useGraphAttribute } from '~/utils/graph/utils';
import { defineProps } from 'vue';

interface Node {
  id: string,
  level: string,
  content: string,
  uniqueId: string,
  fx?: null,
  fy?: null,
  group: number,
  index: number,
  type: string,
  vx: number,
  vy: number,
  x: number,
  y: number,
};

interface Link {
  index: number,
  relationship: string,
  source: Node,
  target: Node,
  value: number,
};

interface Article {
  url: string,
  name: string,
};

interface Video {
  url: string,
  name: string,
};

interface NodeResources {
  articles: Array<Article>,
  videos: Array<Video>,
};

const props = defineProps({
  nodes: {
    type: Array<Node>,
    default: [],
  },
  links: {
    type: Array<Link>,
    default: [],
  }
});

// 获取资源失败状态
const inResourcesError = ref(false);

// 选中结点的资源
const selectedNodeResources = ref<NodeResources | null>(null);

const fetchSelectedNodeData = async () => {
  try {
    inResourcesError.value = false;
    selectedNodeResources.value = null; // 先清空之前的旧的数据
    selectedNodeResources.value = await getNodeResources(selectedNode.value);
  } catch(error) {
    inResourcesError.value = true;
  }
}

const getLevelClass = useGraphAttribute().getLevelClass;
const getNodeResources = useGraphAttribute().getNodeResources;
const getNodeColor = useGraphAttribute().getNodeColor;

const getRelatedNodes = (node: Node) => {
  const relatedNodes: Node[] = [];

  // 查找直接相连的节点
  props.links.forEach(link => {
    if (link.source.uniqueId === node.uniqueId) {
      const targetNode = props.nodes.find(n => n.uniqueId === link.target.uniqueId);
      if (targetNode && !relatedNodes.some(n => n.uniqueId === targetNode.uniqueId)) {
        relatedNodes.push(targetNode);
      }
    } else if (link.target.uniqueId === node.uniqueId) {
      const sourceNode = props.nodes.find(n => n.uniqueId === link.source.uniqueId);
      if (sourceNode && !relatedNodes.some(n => n.uniqueId === sourceNode.uniqueId)) {
        relatedNodes.push(sourceNode);
      }
    }
  });
  // 限制返回的相关节点数量
  return relatedNodes.slice(0, 5);
};

const selectedNode = ref<Node | null>(null);

const selectNode = (node: Node) => {
  selectedNode.value = node;
};

// 控制侧边栏是否展开
const showSidebar = ref(false);

const openSidebar = async (node: Node | null) => {
  if (node) {
    selectedNode.value = node;
    showSidebar.value = true;
    await fetchSelectedNodeData();
  }
}

const closeSidebar = () => {
  showSidebar.value = false;
}

defineExpose({
  openSidebar, closeSidebar
});
</script>

<template>
  <div class="sidebar-details" v-if="showSidebar && selectedNode">
    <div class="sidebar-header">
      <h3>{{ selectedNode.id }}</h3>
      <button @click="closeSidebar" class="close-sidebar-btn">
        <IconsClose />
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

      <!-- 资源加载完毕后才显示 -->
      <div v-if="selectNode && selectedNodeResources">
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
              <a v-if="selectedNodeResources.articles.length > 0" v-for="article in selectedNodeResources.articles"
                :key="article.name" :href="`articles/${article.url}`" target="_blank" class="resource-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                <span>{{ article.name }}</span>
              </a>
            </div>
          </div>
        </div>

        <!-- 视频教程 -->
        <div class="sidebar-section" v-if="selectedNodeResources.videos.length > 0">
          <div class="sidebar-section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
            <h4>视频教程</h4>
          </div>
          <div class="sidebar-section-content">
            <div class="video-container" v-for="video in selectedNodeResources.videos" :key="video.name">
              <h4>{{ video.name }}</h4>
              <div class="video-embed">
                <iframe :src="video.url" frameborder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" loading="lazy"
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
          <div class="sidebar-section-content" title="点击查看全图">
            <Graph :isEmbedded="true" :graph-id="selectedNode.id" :title="selectedNode.id" />
          </div>
        </div>
      </div>
      <!-- 获取资源失败提示窗口 -->
      <div v-else-if="inResourcesError">

        <div class="sidebar-section-error">
          <IconsDataError class="error-icons" />
          <div class="error-tips">请求资源失败，请重试！</div>
          <button @click="fetchSelectedNodeData()" class="control-btn">
            <IconsRefresh />重新获取数据
          </button>
        </div>
      </div>
      <div v-else>
        <div class="sidebar-section">
          <div class="sidebar-section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <h4>相关资源加载中</h4>
          </div>
          <div class="sidebar-section-content">
            <div class="resource-links">
              <div class="skeleton-link" v-for="i in 3" :key="i">
                <div class="skeleton-icon-small"></div>
                <div class="skeleton-text"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.light-mode .sidebar-details {
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

.dark-mode .sidebar-details {
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

/* 侧边栏样式 */
.sidebar-details {
  position: fixed;
  top: 0;
  right: 0;
  width: 500px;
  height: 100%;
  background-color: var(--background-color);
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);
  z-index: 100;
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

.video-container h4 {
  margin: 0 0 10px 0;
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


/* 资源加载骨架 */
.skeleton-icon-small,
.skeleton-text {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-icon-small {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.skeleton-text {
  width: 160px;
  height: 16px;
  margin-left: 8px;
}

.skeleton-link {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  background-color: var(--color-background-hover);
}

/* Animation */
@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 错误提示 */
.error-icons {
  color: var(--color-text-2);
}

.error-tips {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.sidebar-section-error {
  margin-bottom: 24px;
  background-color: var(--card-background);
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  padding: 1.5rem;
}

.control-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s ease;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .sidebar-details {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
  }
}
</style>