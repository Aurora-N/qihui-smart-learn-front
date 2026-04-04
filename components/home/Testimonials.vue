<template>
  <div id="testimonials" class="testimonials-section">
    <div class="container">
      <!-- Popular Articles Section -->
      <div v-if="userStore.isLoggedIn" class="section-container">
        <div class="testimonials-header">
          <h2 class="testimonials-title">推荐文章</h2>
          <p class="testimonials-description">为你精心挑选的学习文章</p>
        </div>

        <div v-if="isLoadingArticles" class="loading-indicator">加载中...</div>
        <div v-else-if="articlesError" class="error-message">
          {{ articlesError }}
        </div>
        <div v-else class="testimonials-grid">
          <NuxtLink
            v-for="article in displayedArticles"
            :key="article.name"
            class="testimonial-card"
            :to="formatArticleLink(article.articlePath)"
            target="_blank"
          >
            <div class="testimonial-header">
              <IconsLearn
                :alt="article.name"
                class="testimonial-image"
                style="border-radius: 0"
              />
              <div class="testimonial-meta">
                <div class="testimonial-name">
                  {{ article.articleName }}
                </div>
                <div class="testimonial-role">学习资料</div>
              </div>
            </div>
            <p class="testimonial-quote">
              {{ article.articlePath.split('/').slice(1, -1).join(' - ') }}
            </p>
          </NuxtLink>
        </div>
      </div>

      <!-- Popular Posts Section -->
      <div class="section-container">
        <div class="testimonials-header">
          <h2 class="testimonials-title">热门帖子</h2>
          <p class="testimonials-description">来看看大家都在讨论什么</p>
        </div>

        <div v-if="isLoadingPosts" class="loading-indicator">加载中...</div>
        <div v-else-if="postsError" class="error-message">
          {{ postsError }}
        </div>
        <div v-else class="testimonials-grid">
          <NuxtLink
            v-for="post in displayedPosts"
            :key="post.postId"
            class="testimonial-card"
            :to="`/forum/post?id=${post.postId}`"
            target="_blank"
          >
            <div class="testimonial-header">
              <img
                :src="formatAvatarUrl(post.author.attributes.avatarUrl)"
                :alt="post.author.attributes.userName"
                class="testimonial-image"
              />
              <div class="testimonial-meta">
                <div class="testimonial-name">
                  {{ post.title }}
                </div>
                <div class="testimonial-role">
                  {{ post.author.attributes.userName }}
                </div>
              </div>
            </div>
            <p class="testimonial-quote">
              {{ post.title }}
            </p>
            <div class="post-meta">
              <span class="post-comments">{{ post.commentsCount }} 评论</span>
              <span class="post-date">{{ formatDate(post.createdAt) }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="testimonials-background">
      <div class="bg-circle bg-circle-1" />
      <div class="bg-circle bg-circle-2" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useHomeApi } from '~/api/home'

// API
const homeApi = useHomeApi()
const userStore = useUserStore()

// State management
const popularArticles = ref([])
const popularPosts = ref([])
const isLoadingArticles = ref(true)
const isLoadingPosts = ref(true)
const articlesError = ref(null)
const postsError = ref(null)

// Rotation state
const articleStartIndex = ref(0)
const postStartIndex = ref(0)
const itemsToShow = 3
let rotationTimer = null

// Computed properties for the currently displayed items
const displayedArticles = computed(() => {
  if (popularArticles.value.length <= itemsToShow) {
    return popularArticles.value
  }

  const result = []
  for (let i = 0; i < itemsToShow; i++) {
    const index = (articleStartIndex.value + i) % popularArticles.value.length
    result.push(popularArticles.value[index])
  }
  return result
})

const displayedPosts = computed(() => {
  if (popularPosts.value.length <= itemsToShow) {
    return popularPosts.value
  }

  const result = []
  for (let i = 0; i < itemsToShow; i++) {
    const index = (postStartIndex.value + i) % popularPosts.value.length
    result.push(popularPosts.value[index])
  }
  return result
})

// Rotate displayed items
const rotateItems = () => {
  if (popularArticles.value.length > itemsToShow) {
    articleStartIndex.value =
      (articleStartIndex.value + 1) % popularArticles.value.length
  }

  if (popularPosts.value.length > itemsToShow) {
    postStartIndex.value =
      (postStartIndex.value + 1) % popularPosts.value.length
  }
}

// Start auto rotation
const startRotation = () => {
  stopRotation()
  rotationTimer = setInterval(rotateItems, 10000) // Rotate every 10 seconds
}

// Stop rotation
const stopRotation = () => {
  if (rotationTimer) {
    clearInterval(rotationTimer)
    rotationTimer = null
  }
}

// Format article link
const formatArticleLink = articlePath => {
  // Replace backslashes with forward slashes, remove first two path segments, add /articles prefix
  const formatted = '/articles/page?path=' + articlePath
  return formatted
}

// Format date
const formatDate = dateString => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// Fetch data from API
onMounted(async () => {
  // Fetch popular articles
  if (userStore.isLoggedIn) {
    try {
      isLoadingArticles.value = true
      const userId = userStore.userInfo?.id || 1
      const response = await homeApi.getRecommendedArticles(userId)
      if (response.data) {
        popularArticles.value = response.data
      }
    } catch (error) {
      articlesError.value = '获取推荐文章失败'
      console.error('Error fetching recommended articles:', error)
    } finally {
      isLoadingArticles.value = false
    }
  } else {
    isLoadingArticles.value = false
  }

  // Fetch popular posts
  try {
    isLoadingPosts.value = true
    const response = await homeApi.getPopularPosts()
    if (response.data && response.data.posts) {
      popularPosts.value = response.data.posts
    }
  } catch (error) {
    postsError.value = '获取热门帖子失败'
    console.error('Error fetching popular posts:', error)
  } finally {
    isLoadingPosts.value = false
  }

  // Start auto rotation if we have more than 3 items
  if (
    popularArticles.value.length > itemsToShow ||
    popularPosts.value.length > itemsToShow
  ) {
    startRotation()
  }
})

// Clean up on component unmount
onUnmounted(() => {
  stopRotation()
})
</script>

<style scoped>
.testimonials-section {
  position: relative;
  padding-bottom: 4rem;
  background-color: var(--secondary-color);
  overflow: hidden;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 10;
}

.section-container {
  margin-bottom: 4rem;
}

.testimonials-header {
  text-align: center;
  margin-bottom: 2rem;
}

.testimonials-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.testimonials-description {
  font-size: 1.25rem;
  color: var(--text-muted);
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.testimonial-card {
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-decoration: none;
}

.testimonial-card:hover {
  transform: translateY(-0.25rem);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.testimonial-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.testimonial-image {
  color: var(--color-text);
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  object-fit: cover;
}

.testimonial-meta {
  margin-left: 1rem;
}

.testimonial-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
}

.testimonial-role {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.testimonial-quote {
  font-style: italic;
  color: var(--text-muted);
  margin-bottom: 1rem;
  flex-grow: 1;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: auto;
}

.testimonials-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
}

.bg-circle-1 {
  top: 25%;
  right: -4rem;
  width: 8rem;
  height: 8rem;
  background-color: rgba(var(--primary-rgb), 0.1);
  animation: float 5s ease-in-out infinite;
}

.bg-circle-2 {
  bottom: 25%;
  left: -4rem;
  width: 6rem;
  height: 6rem;
  background-color: rgba(var(--secondary-rgb), 0.1);
  animation: float-alt 7s ease-in-out infinite;
}

.loading-indicator {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
}

.error-message {
  text-align: center;
  padding: 2rem;
  color: #e53e3e;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(1.25rem, -1.25rem);
  }
}

@keyframes float-alt {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-1.875rem, 1.875rem);
  }
}

@media (min-width: 768px) {
  .testimonials-section {
    padding-bottom: 4rem;
  }

  .testimonials-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 767px) {
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}
</style>
