<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  height: {
    type: String,
    default: '20rem',
  },
  stickyTop: {
    type: String,
    default: '5rem',
  },
})
</script>

<template>
  <div class="sidebar" :style="`top: ${props.stickyTop};`">
    <div class="lists">
      <h3 v-if="title.length !== 0" style="margin-top: 0">
        {{ props.title }}
      </h3>
      <el-scrollbar :height="auto">
        <slot />
      </el-scrollbar>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  /* min-width: 4rem; */
  position: sticky;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
}

.lists {
  padding: 1rem;
}

@media (max-width: 480px) {
  .sidebar {
    width: 100%;
    margin: 0;
    max-height: 10rem;
    overflow: auto;
  }
}
</style>
