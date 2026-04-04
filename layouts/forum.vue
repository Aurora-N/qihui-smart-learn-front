<script setup lang="ts">
import { useForumApi } from '~/api/forum'
import type { TagWithConfig } from '~/api/type/forum'

const router = useRouter()
const route = useRoute()

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const selectedNav = computed(() => {
  const nav = route.path.split('/').pop()
  return nav !== 'forum' ? nav : 'all'
})

const switchToNav = (item: string) => {
  if (item !== 'all') router.push(`/forum/${item}`)
  else router.push(`/forum`)
  closeMobileMenu()
}

const bannerConfig = ref({
  title: '启慧论坛',
  subTitle: '来一场思想上的碰撞',
  hueColor: '250',
})

const tags = ref<TagWithConfig[]>([])

const getAllTags = async () => {
  const res = await useForumApi().getAllTags()
  tags.value = res.data
}

onMounted(() => getAllTags())

provide('bannerConfig', bannerConfig)

useHead({
  title: '启慧论坛——来一场思想上的碰撞',
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="container">
      <!-- Welcome Banner -->
      <ForumBanner
        :title="bannerConfig.title"
        :sub-title="bannerConfig.subTitle"
        :hue="Number(bannerConfig.hueColor)"
      />

      <!-- 内容区域 -->
      <div class="forum-content">
        <div class="main-forum-container">
          <!-- Mobile Menu Toggle Button -->
          <div class="mobile-menu-toggle">
            <button
              class="toggle-menu-button"
              :style="{ '--hue': bannerConfig?.hueColor }"
              @click="toggleMobileMenu"
            >
              <el-icon>
                <Menu />
              </el-icon>
              <span>{{ isMobileMenuOpen ? '收起菜单' : '展开菜单' }}</span>
            </button>
          </div>

          <!-- Mobile Menu (between banner and content) -->
          <Transition name="slide-down">
            <div v-show="isMobileMenuOpen" class="mobile-menu">
              <button
                class="publish-button mobile-publish"
                :style="{ '--hue': bannerConfig?.hueColor }"
                @click="$router.push('/newpost')"
              >
                发布主题
              </button>

              <div class="mobile-nav-items">
                <div
                  class="nav-item"
                  :class="{ active: selectedNav === 'all' }"
                  @click="switchToNav('all')"
                >
                  <el-icon>
                    <ChatDotRound />
                  </el-icon>
                  <span>全部主题</span>
                </div>
                <div
                  class="nav-item"
                  :class="{ active: selectedNav === 'favorite' }"
                  @click="switchToNav('favorite')"
                >
                  <el-icon>
                    <Star />
                  </el-icon>
                  <span>我的收藏</span>
                </div>
                <div
                  class="nav-item"
                  :class="{ active: selectedNav === 'tags' }"
                  @click="switchToNav('tags')"
                >
                  <el-icon>
                    <Menu />
                  </el-icon>
                  <span>标签</span>
                </div>

                <!-- 标签（如前端/后端/C++等） -->
                <div class="mobile-tags-container">
                  <div
                    v-for="tag of tags"
                    :key="tag.tagId"
                    class="nav-item-tag"
                    :class="{ 'active-tag': selectedNav === String(tag.tagId) }"
                    :style="{ '--hue': tag.hueColor }"
                    @click="switchToNav(`tags/tagpost?id=${tag.tagId}`)"
                  >
                    <el-icon>
                      <CollectionTag />
                    </el-icon>
                    <span>{{ tag.tagName }}</span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Desktop Sidebar -->
          <div class="sidebar desktop-sidebar">
            <button
              class="publish-button"
              :style="{ '--hue': bannerConfig?.hueColor }"
              @click="$router.push('/newpost')"
            >
              发布主题
            </button>
            <Sidebar class="sidebar" height="auto">
              <div
                class="nav-item"
                :class="{ active: selectedNav === 'all' }"
                @click="switchToNav('all')"
              >
                <el-icon>
                  <ChatDotRound />
                </el-icon>
                <span>全部主题</span>
              </div>
              <div
                class="nav-item"
                :class="{ active: selectedNav === 'favorite' }"
                @click="switchToNav('favorite')"
              >
                <el-icon>
                  <Star />
                </el-icon>
                <span>我的收藏</span>
              </div>
              <div
                class="nav-item"
                :class="{ active: selectedNav === 'tags' }"
                @click="switchToNav('tags')"
              >
                <el-icon>
                  <Menu />
                </el-icon>
                <span>标签</span>
              </div>
              <hr />
              <!-- 标签（如前端/后端/C++等） -->
              <div
                v-for="tag of tags"
                :key="tag.tagId"
                class="nav-item-tag"
                :class="{ 'active-tag': selectedNav === String(tag.tagId) }"
                :style="{ '--hue': tag.hueColor }"
                @click="switchToNav(`tags/tagpost?id=${tag.tagId}`)"
              >
                <el-icon>
                  <CollectionTag />
                </el-icon>
                <span>{{ tag.tagName }}</span>
              </div>
            </Sidebar>
          </div>

          <!-- Content Section -->
          <NuxtPage id="content" class="main-content" />
        </div>
      </div>
    </div>
  </NuxtLayout>
  <Footer />
</template>

<style lang="scss" scoped>
@import url(~/assets/style/tag_color.scss);

.container {
  min-height: 100vh;
  background-color: while;
  padding-top: 55px;
}

.banner-links {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.banner-links a {
  color: var(--main-color);
  text-decoration: none;
}

.forum-content {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 2rem 0;
}

.main-forum-container {
  display: flex;
  justify-content: space-between;
  margin: 0;
  width: 100%;
  max-width: 1200px;
}

/* 侧边栏样式 */
.sidebar {
  width: 15rem;
  flex-shrink: 0;
  margin-right: 2rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  color: var(--color-text-2);
  cursor: pointer;
  transition: all 0.3s ease-out;
  padding-right: 1px;
}

.nav-item:hover {
  color: var(--main-color);
  background-color: var(--color-background-nav-hover);
  border-radius: 6px;
  padding-left: 10px;
}

.nav-item-tag {
  display: flex;
  align-items: center;
  padding: 12px 0;
  color: var(--color-text-2);
  cursor: pointer;
  transition: all 0.3s ease-out;
  padding-right: 1px;
}

.nav-item-tag:hover {
  color: var(--btn-content);
  background-color: var(--btn-regular-bg);
  border-radius: 6px;
  padding-left: 10px;
}

.active {
  color: var(--main-color);
}

.active-tag {
  color: var(--btn-content);
}

.nav-item .el-icon,
.nav-item-tag .el-icon {
  margin-right: 10px;
}

.nav-item .count,
.nav-item-tag .count {
  margin-left: auto;
  color: var(--color-text-2);
}

.publish-button {
  padding: 0.5rem 1rem;
  background-color: oklch(0.55 0.22 var(--hue));
  /* #2563eb */
  width: 100%;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  margin-bottom: 2rem;
}

.publish-button:hover {
  background-color: oklch(0.6 0.22 var(--hue));
  /* #1576ff */
  box-shadow: 0 0 5px oklch(0.52 0.21 var(--hue) / 0.5);
  /* rgba(0, 96, 223, 0.5) */
}

/* 移动端菜单样式 */
.mobile-menu-toggle {
  display: none;
  width: 100%;
  margin-bottom: 1rem;
}

.toggle-menu-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: oklch(0.98 0.02 var(--hue));
  color: oklch(0.55 0.22 var(--hue));
  border: 1px solid oklch(0.85 0.05 var(--hue));
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.95rem;
  width: 100%;
  justify-content: center;
}

.toggle-menu-button:hover {
  background-color: oklch(0.95 0.03 var(--hue));
}

.mobile-menu {
  width: 100%;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #eee;
}

.mobile-publish {
  margin-bottom: 1rem;
}

.mobile-nav-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-tags-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

/* 滑动动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  opacity: 1;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

@media (max-width: 768px) {
  .forum-content {
    flex-direction: column;
  }

  .main-forum-container {
    flex-direction: column;
    padding: 0 1rem;
  }

  .desktop-sidebar {
    display: none;
  }

  .mobile-menu-toggle {
    display: block;
  }

  .main-content {
    width: 100%;
  }
}
</style>
