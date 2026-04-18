<template>
  <div class="container">
    <div class="banner">
      <div class="banner-content">
        <div class="banner-title" />
        <div class="banner-subtitle" />
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="post-content">
      <!-- 帖子内容 -->
      <article class="main-content">
        <div class="comment-container">
          <div class="comment-left">
            <div class="avatar" />
          </div>
          <div class="comment-right">
            <div class="comment-info">
              <div class="author-name" />
              <div class="comment-date" />
            </div>
            <div v-for="i in 6" :key="i">
              <div class="comment-content" style="width: 100%" />
            </div>
            <div class="comment-content" style="width: 80%" />
          </div>
        </div>

        <div v-for="i in 4" :key="i">
          <div class="comment-container">
            <div class="comment-left">
              <div class="avatar" />
            </div>
            <div class="comment-right">
              <div class="comment-info">
                <div class="author-name" />
                <div class="comment-date" />
              </div>
              <div class="comment-content" style="width: 100%" />
              <div class="comment-content" style="width: 80%" />
            </div>
          </div>
        </div>
      </article>

      <!-- 功能侧边栏 -->
      <div>
        <aside class="sidebar">
          <!-- position: sticky的外面还需包裹一层div才能生效 -->
          <div class="btn" />
          <div class="btn" />
        </aside>
      </div>
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

.container {
  padding-top: 55px;
}

.light-mode .container {
  --banner-color: oklch(0.97 0.01 250);
  --title: #3741517a;
  --sub-title: #6b728070;
  --background-color-sidebar: #f8f8f8;
  --item-color: #e0e0e0;
}

.dark-mode .container {
  --banner-color: oklch(0.2 0.014 250);
  --title: rgb(248, 250, 252);
  --sub-title: rgb(231, 236, 243);
  --background-color-sidebar: #454545;
  --item-color: #666666;
}

.banner {
  background-color: var(--banner-color);
  padding: 5rem 1rem;
  text-align: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  min-height: 250px;
}

.banner-content {
  max-width: 800px;
  width: 100%;
  position: relative;
  padding: 2rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.banner-title {
  height: 2.5rem;
  background-color: var(--title);
  margin-bottom: 2rem;
  width: 60%;
  border-radius: 4px;
  animation: pulse 2s infinite;
}

.banner-subtitle {
  background-color: var(--sub-title);
  margin-bottom: 2rem;
  width: 20%;
  height: 1.2rem;
  border-radius: 4px;
  animation: pulse 2s infinite;
}

.post-content {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 1rem 0 2rem 0;
}

.main-content {
  width: 100%;
  max-width: 64rem;
}

.main-content .editor {
  padding-bottom: 1rem;
}

.sidebar {
  width: 10rem;
  margin-left: 2rem;
  position: sticky;
  top: 80px;
}

.sidebar .btn {
  width: 10rem;
  margin-top: 1.1rem;
  height: 3rem;
  font-size: 1rem;
  background-color: var(--item-color);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  animation: pulse 2s infinite;
}

.comment-container {
  display: flex;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: var(--background-color-sidebar);
  margin: 1rem 0;
  animation: pulse 2s infinite;
}

.comment-left {
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin-right: 2rem;
  width: 4rem;
  animation: pulse 2s infinite;
}

.avatar {
  min-width: 4rem;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: var(--item-color);
  animation: pulse 2s infinite;
}

.comment-info {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 0.5rem;
  width: 100%;
  height: 2rem;
}

.author-name {
  font-weight: bold;
  background-color: var(--title);
  height: 1rem;
  width: 3rem;
  border-radius: 2px;
  animation: pulse 2s infinite;
}

.comment-date {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  margin-left: 1rem;
  background-color: var(--item-color);
  height: 1rem;
  width: 9rem;
  border-radius: 2px;
  animation: pulse 2s infinite;
}

.comment-content {
  margin-bottom: 1rem;
  background-color: var(--item-color);
  height: 1.2rem;
  border-radius: 2px;
  animation: pulse 2s infinite;
}

.comment-right {
  gap: 0.5rem;
  width: 100%;
}

@media (max-width: 768px) {
  .post-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 1rem;
  }

  .side {
    margin: 0;
    width: 100%;
  }

  .sidebar {
    position: static;
    top: 0;
    order: 0;
    width: 100%;
    margin: 0;
  }

  .sidebar .btn {
    width: 100%;
  }

  .main-content {
    order: 1;
  }
}
</style>
