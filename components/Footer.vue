<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-brand">
        <div class="logo">知识图谱学习网站</div>
        <p>知识图谱改变世界</p>
      </div>

      <div class="footer-columns">
        <div v-for="(column, index) in columns" :key="index" class="footer-column">
          <h3>{{ column.title }}</h3>
          <ul>
            <li v-for="(link, linkIndex) in column.links" :key="linkIndex">
              <a :href="link.url">{{ link.text }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.footer {
  background: #f9f9fb;
  padding: 48px 24px;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 48px;
}

.footer-brand {
  flex-shrink: 0;
  width: 260px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.footer-columns {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
}

.footer-column h3 {
  font-size: 1rem;
  margin-bottom: 16px;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column li {
  margin-bottom: 8px;
}

.footer-column a {
  color: #404040;
  text-decoration: none;
  font-size: 14px;
}

.footer-column a:hover {
  text-decoration: underline;
}
</style>