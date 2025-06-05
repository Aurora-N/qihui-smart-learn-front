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
// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
})

// Emits
const emit = defineEmits(['toggle'])

// 图例数据
const legendItems = [
  { color: '#ff7675', label: '根节点' },
  { color: '#74b9ff', label: '分类' },
  { color: '#55efc4', label: '入门难度' },
  { color: '#ffeaa7', label: '基础难度' },
  { color: '#fd79a8', label: '进阶难度' },
  { color: '#a29bfe', label: '深入难度' },
  { color: '#e17055', label: '高级难度' },
]
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
