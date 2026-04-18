<template>
  <div class="legend-container">
    <div class="legend-header" @click="$emit('toggle')">
      <span>图例</span>
      <IconsArrowUp :class="{ 'rotate-icon': show }" />
    </div>

    <transition name="legend-slide">
      <div v-show="show" class="legend">
        <div v-for="item in legendItems" :key="item.label" class="legend-item">
          <span class="legend-color" :style="{ backgroundColor: item.color }" />
          <span>{{ item.label }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { GRAPH_LEGEND_ITEMS } from '~/constants/graph'
// Props
defineProps({
  show: {
    type: Boolean,
    default: true,
  },
})

// Emits
defineEmits(['toggle'])

// 图例数据
const legendItems = GRAPH_LEGEND_ITEMS
</script>

<style lang="scss" scoped>
@import url(~/assets/style/knowledge_graph.scss);

/* 补充knowledge_graph.scss中没有定义的过渡动画 */
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
