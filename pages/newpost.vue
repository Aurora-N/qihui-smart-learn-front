<script setup>
const content = ref('<h1></h1>')

definePageMeta({
  layout: false,
})
</script>

<template>
  <div class="container">
    <ClientOnly>
      <!-- <Editor v-model="content" /> -->
      <MarkdownEditor />
    </ClientOnly>
  </div>
</template>

<style scoped>
.container {
  padding: 1rem 0;
}
</style>
