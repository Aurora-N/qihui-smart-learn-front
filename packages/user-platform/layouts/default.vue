<script setup lang="ts">
import Navbar from '~/components/Navbar.vue'
import Footer from '~/components/Footer.vue'
</script>

<template>
  <div class="default-container">
    <Navbar />
    <slot />
  </div>
</template>

<style scoped>
.default-container {
  width: 100%;
}

:deep(.el-card) {
  border-radius: 20px;
}
</style>
