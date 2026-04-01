<script setup lang="ts">
import '~/assets/style/home.scss'

useHead({
  title: '启慧智学——基于多模态知识图谱的Web开发学习平台',
})
</script>

<template>
  <div>
    <!-- <HomeHeader /> -->
    <main>
      <HomeHero />
      <HomeTestimonials />
      <HomeCTA />
    </main>
    <Footer />
  </div>
</template>

<style lang="scss" scoped></style>
