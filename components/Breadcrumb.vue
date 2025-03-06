<script setup>
import { ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  currentTitle: {
    type: String,
    default: ''
  },
  parent: {
    type: Object,
    default: () => ({
      title: '',
      link: ''
    })
  },
  root: {
    type: Object,
    default: () => ({
      title: '文章',
      link: '/posts'
    })
  }
})
</script>

<template>
  <div class="breadcrumb">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: props.root.link }">{{ props.root.title }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: props.parent.link }">{{ props.parent.title }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ props.currentTitle }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style scoped>
.breadcrumb {
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.breadcrumb:hover {
  --el-color-primary: #2563eb;
}
</style>