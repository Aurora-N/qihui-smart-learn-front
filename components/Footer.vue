<template>
  <footer class="footer">
    <div class="container">
      <h1 class="footer-title">知识图谱改变世界</h1>
      <div class="footer-bottom">
        <!-- <div class="social-links">
          <NuxtLink v-for="social in socialLinks" :key="social.label" :to="social.href" class="social-link" :aria-label="social.label">
            <component :is="social.icon" />
          </NuxtLink>
        </div> -->
        <p class="copyright">
          &copy; {{ new Date().getFullYear() }} 启慧智学项目组
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background-color: var(--color-background);
  border-top: 1px solid var(--color-border);
  padding: 2rem 0 3rem 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-title {
  font-size: 2rem;
  font-weight: bold;
}

.footer-heading {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-link {
  display: block;
  font-size: 1rem;
  color: var(--text-muted);
  text-decoration: none;
  padding: 0.5rem 0;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--text-color);
}

.footer-bottom {
  margin-top: 1rem;
  padding-top: 0.5rem;
  /* border-top: 1px solid var(--border-color); */
}

.social-links {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.social-link {
  color: var(--text-muted);
  transition: color 0.2s;
}

.social-link:hover {
  color: var(--text-color);
}

.copyright {
  font-size: 0.875rem;
  color: var(--text-muted);
}

@media (min-width: 768px) {
  .footer-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .social-links {
    margin-bottom: 0;
    order: 2;
  }
  
  .copyright {
    order: 1;
  }
}

@media (min-width: 1024px) {
  .footer-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>

