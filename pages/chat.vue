<script setup>
onMounted(() => {
  // const script = document.createElement('script');
  // script.src = 'http://hekabi.a1.luyouxia.net:25333/api/application/embed?protocol=http&host=hekabi.a1.luyouxia.net:25333&token=5bfb22ba0d4da3ed';
  // script.async = true;
  // script.defer = true;
  // document.body.appendChild(script);
});

useSeoMeta({
  title: '计算机在线学习平台问答助手'
})

definePageMeta({
  layout: false,
})
</script>

<template>
  <Navbar :transparent="false" />
  <div class="container">
    <iframe src="http://43.139.42.54/ui/chat/6785f396033ae794" style="width: 100%; height: 100%;" frameborder="0"
      allow="microphone">
    </iframe>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  overflow: hidden;
}
</style>