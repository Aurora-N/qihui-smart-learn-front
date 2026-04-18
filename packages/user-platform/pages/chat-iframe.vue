<script setup lang="ts">
// onMounted(() => {
//   // const script = document.createElement('script');
//   // script.src = 'http://hekabi.a1.luyouxia.net:25333/api/application/embed?protocol=http&host=hekabi.a1.luyouxia.net:25333&token=5bfb22ba0d4da3ed';
//   // script.async = true;
//   // script.defer = true;
//   // document.body.appendChild(script);
// })

const isLoading = ref(true)

const onIframeLoad = () => {
  isLoading.value = false
}

definePageMeta({
  layout: false,
})

useHead({
  title: '计算机在线学习平台问答助手',
})
</script>

<template>
  <Navbar :transparent="false" />
  <div class="container">
    <div v-if="isLoading" class="loading-content">
      <!-- <p style="margin: 100px">正在加载中，请稍候...</p> -->
      <ChatSkeleton />
    </div>
    <iframe
      v-show="!isLoading"
      src="http://jp.frp.one:34683/ui/chat/5bfb22ba0d4da3ed"
      style="width: 100%; height: 100%"
      frameborder="0"
      allow="microphone"
      @load="onIframeLoad"
    >
    </iframe>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  overflow: hidden;
}

.loading-content {
  padding-top: 55px;
}
</style>
