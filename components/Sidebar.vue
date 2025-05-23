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
      <el-scrollbar :height="props.height">
        <slot />
      </el-scrollbar>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  /* min-width: 4rem; */
  margin-right: 3rem;
  position: sticky;
}

.lists {
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
}
</style>
