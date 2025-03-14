<script setup>
import { ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  currentTitle: {
    type: String,
    default: ''
  },
  parents: { //除了根目录外的父级目录
    type: Array,
    default: () => []
  },
  root: {
    type: Object,
    default: () => ({
      title: '文章',
      link: '/articles'
    })
  }
})

onMounted
  (() => console.log(props.parents))
</script>

<template>
  <div class="breadcrumb">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: props.root.link }">{{ props.root.title }}</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(parent, index) in props.parents"
        :to="`/articles/${props.parents.slice(0, index + 1).join('/')}`">{{ parent
        }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ props.currentTitle }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style scoped>
.breadcrumb {
  margin-top: 1rem;
  margin-bottom: 2rem;
  --el-text-color-primary: var(--color-text-2);
  --el-text-color-regular: var(--color-text)
}

:deep(.el-breadcrumb__item .el-breadcrumb__inner, .is-link) {
  font-weight: normal;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  font-weight: bold;
}

.breadcrumb:hover {
  --el-color-primary: #2563eb;
}
</style>