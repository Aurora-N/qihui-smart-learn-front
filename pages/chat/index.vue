<script setup>
onMounted(() => {
  const script = document.createElement('script');
  script.src = 'http://localhost:8080/api/application/embed?protocol=http&host=localhost:8080&token=5bfb22ba0d4da3ed';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
});
</script>

<template>
  <div class="container">
    <iframe src="http://localhost:8080/ui/chat/5bfb22ba0d4da3ed" style="width: 100%; height: 100%;" frameborder="0"
      allow="microphone">
    </iframe>
  </div>
</template>

<style scoped>
.container {
  margin-top: 55px;
}
</style>