<script setup lang="ts">
// No props or complex logic needed for the skeleton
</script>

<template>
  <div class="main-container">
    <div class="side">
      <div class="skeleton-sidebar">
        <div class="skeleton-sidebar-title"></div>
        <div class="skeleton-menu-items">
          <div class="skeleton-menu-item" v-for="i in 5" :key="i"></div>
        </div>
      </div>
    </div>

    <div class="content">
      <article>
        <div class="skeleton-breadcrumb"></div>
        <div class="skeleton-title"></div>

        <div class="skeleton-content">
          <div class="skeleton-paragraph" v-for="i in 3" :key="i"></div>
          <div class="skeleton-heading"></div>
          <div class="skeleton-paragraph" v-for="i in 2" :key="i"></div>
          <div class="skeleton-heading"></div>
          <div class="skeleton-paragraph" v-for="i in 2" :key="i"></div>
        </div>

        <div class="skeleton-recommend">
          <div class="skeleton-recommend-title"></div>
          <div class="skeleton-recommend-items">
            <div class="skeleton-recommend-item" v-for="i in 3" :key="i"></div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 0.8;
  }

  100% {
    opacity: 0.6;
  }
}

.main-container {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  margin-top: 55px;
  padding-top: 25px;
  height: 100vh;
}

.light-mode .main-container {
  --background-color-sidebar: #f8f8f8;
  --item-color: #e0e0e0;
}

.dark-mode .main-container {
  --background-color-sidebar: #454545;
  --item-color: #666666;
}

.content {
  max-width: 60rem;
  width: 100%;
  margin-top: 1rem;
}

.side {
  margin-top: 0.5rem;
  width: 15rem;
}

/* Skeleton styles */
.skeleton-sidebar {
  background-color: var(--background-color-sidebar);
  border-radius: 8px;
  padding: 1rem;
  height: 20rem;
  width: 12rem;
  margin-right: 1rem;
}

.skeleton-sidebar-title {
  height: 1.5rem;
  width: 50%;
  background-color: var(--item-color);
  border-radius: 4px;
  margin-bottom: 1rem;
  animation: pulse 1.5s infinite;
}

.skeleton-menu-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-menu-item {
  height: 2rem;
  background-color: var(--item-color);
  border-radius: 6px;
  animation: pulse 1.5s infinite;
}

.skeleton-breadcrumb {
  height: 1.25rem;
  width: 40%;
  background-color: var(--item-color);
  border-radius: 4px;
  margin-bottom: 1rem;
  animation: pulse 1.5s infinite;
}

.skeleton-title {
  height: 2rem;
  width: 70%;
  background-color: var(--item-color);
  border-radius: 4px;
  margin-bottom: 2rem;
  animation: pulse 1.5s infinite;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.skeleton-paragraph {
  height: 1rem;
  background-color: var(--item-color);
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

.skeleton-paragraph:nth-child(odd) {
  width: 100%;
}

.skeleton-paragraph:nth-child(even) {
  width: 85%;
}

.skeleton-heading {
  height: 1.5rem;
  width: 50%;
  background-color: var(--item-color);
  border-radius: 4px;
  margin-top: 0.5rem;
  animation: pulse 1.5s infinite;
}

.skeleton-recommend {
  margin-top: 2rem;
}

.skeleton-recommend-title {
  height: 1.5rem;
  width: 30%;
  background-color: var(--item-color);
  border-radius: 4px;
  margin-bottom: 1rem;
  animation: pulse 1.5s infinite;
}

.skeleton-recommend-items {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.skeleton-recommend-item {
  height: 2.5rem;
  width: 10rem;
  background-color: var(--item-color);
  border-radius: 6px;
  animation: pulse 1.5s infinite;
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }

  .side {
    width: 100%;
    margin-bottom: 1.5rem;
  }

  .skeleton-sidebar {
    height: 12rem;
  }
}
</style>
