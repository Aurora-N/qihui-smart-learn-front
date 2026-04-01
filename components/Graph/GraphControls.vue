<template>
  <div class="controls">
    <div class="controls-container">
      <button
        class="control-btn"
        title="重置知识图谱视图"
        @click="$emit('reset')"
      >
        重置
      </button>

      <div class="checkbox-control">
        <input
          id="showLabels"
          type="checkbox"
          :checked="showLinkLabels"
          @change="$emit('update:showLinkLabels', $event.target.checked)"
        />
        <label for="showLabels">关系</label>
      </div>

      <div class="search-control">
        <input
          type="text"
          :value="filterTerm"
          placeholder="搜索节点"
          class="search-input"
          @input="handleSearchInput"
        />
      </div>

      <div
        class="mobile-legend-btn"
        title="图例"
        @click="$emit('toggle-legend')"
      >
        <IconsArrowUp :class="{ 'rotate-icon': showLegend }" />
      </div>
    </div>

    <!-- 筛选状态显示 -->
    <div v-if="isFiltered" class="filter-status">
      <span class="filter-info">
        正在显示 "{{ currentFilterNode }}" 的 {{ filteredNodeCount }} 个相关节点
      </span>
      <button class="clear-filter-btn" @click="$emit('reset')">清除筛选</button>
    </div>

    <!-- 搜索状态显示 -->
    <div v-if="isSearching" class="search-status">
      <span>搜索中...</span>
    </div>

    <!-- 图例部分 -->
    <div class="legend-container">
      <div class="legend-header" @click="$emit('toggle-legend')">
        <span>图例</span>
        <IconsArrowUp :class="{ 'rotate-icon': showLegend }" />
      </div>

      <transition name="legend-slide">
        <div v-show="showLegend" class="legend">
          <div
            v-for="item in legendItems"
            :key="item.label"
            class="legend-item"
          >
            <span
              class="legend-color"
              :style="{ backgroundColor: item.color }"
            />
            <span>{{ item.label }}</span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { GRAPH_LEGEND_ITEMS } from '~/constants/graph'

defineProps({
  showLinkLabels: {
    type: Boolean,
    default: false,
  },
  showLegend: {
    type: Boolean,
    default: true,
  },
  filterTerm: {
    type: String,
    default: '',
  },
  isFiltered: {
    type: Boolean,
    default: false,
  },
  currentFilterNode: {
    type: String,
    default: '',
  },
  filteredNodeCount: {
    type: Number,
    default: 0,
  },
  isSearching: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'reset',
  'update:showLinkLabels',
  'update:filterTerm',
  'search',
  'toggle-legend',
])

// 图例数据
const legendItems = GRAPH_LEGEND_ITEMS

const handleSearchInput = event => {
  const value = event.target.value
  emit('update:filterTerm', value)
  emit('search', value)
}
</script>

<style lang="scss" scoped>
@import url(~/assets/style/knowledge_graph.scss);

/* 补充一些knowledge_graph.scss中没有的样式 */
.search-loading {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-top: none;
  padding: 0.5rem;
  font-size: 0.8rem;
  color: #666;

  .dark & {
    background: #333;
    border-color: #555;
    color: #ccc;
  }
}

.search-result {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #e8f5e8;
  border: 1px solid #28a745;
  border-top: none;
  padding: 0.5rem;
  font-size: 0.8rem;
  color: #155724;

  .dark & {
    background: #1e3a1e;
    border-color: #28a745;
    color: #d4edda;
  }

  .filter-node {
    font-weight: bold;
  }
}

.filter-status {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: var(--color-info-light);
  border: 1px solid var(--color-info);
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.filter-info {
  font-size: 0.875rem;
  color: var(--color-info-dark);
}

.clear-filter-btn {
  padding: 0.25rem 0.5rem;
  background-color: var(--color-warning);
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.75rem;
  transition: background-color 0.2s;
}

.clear-filter-btn:hover {
  background-color: var(--color-warning-dark);
}

.search-status {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: var(--color-primary-light);
  border: 1px solid var(--color-primary);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: var(--color-primary-dark);
  text-align: center;
}

@media (max-width: 768px) {
  .filter-status {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
}

/* 图例过渡动画样式 */
.legend-slide-enter-active,
.legend-slide-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  opacity: 1;
}

.legend-slide-enter-from,
.legend-slide-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
