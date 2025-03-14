<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  lists: {
    type: Array,
    default: [{ id: '', title: '', link: '', type: '理论' }]
  },
})
</script>

<template>
  <div class="container">
    <h3 class="header"><el-icon>
        <Reading />
      </el-icon> {{ props.title }}</h3>
    <ul class="lists">
      <li v-for="item of props.lists">
        <NuxtLink :to="item.link">{{ item.title }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  padding: 1rem;
  border-radius: 6px;
  border: 2px dashed var(--color-border-quote);
  background-color: var(--color-background-quote);
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0;
  margin-left: 0.5rem;
}
</style>