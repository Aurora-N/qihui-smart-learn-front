<script setup>
import { useUserApi } from '~/api/user'
import { useForumApi } from '~/api/forum'

const route = useRoute()
const router = useRouter()
const userId = route.params.id
const userApi = useUserApi()
const forumApi = useForumApi()
const userInfo = ref({
  userId: userId,
  userName: "",
  email: "",
  avatar: "",
  selfDescription: "",
  registerDate: "",
  counts: {
    reply: 0,
    topics: 0,
    follower: 0,
    following: 0
  }
})

const getUserProfile = async (userId) => {
  const res = await userApi.getUserInfo(userId)
  userInfo.value = res.data

  // 动态更新标题
  useHead(() => ({
    title: userInfo.value.userName + '的主页',
  }));
}

import {
  Timer,
  ChatDotRound,
  Menu,
  Star,
  User,
  Back,
  MoreFilled,
  DataAnalysis,
  Plus
} from '@element-plus/icons-vue';

const posts = ref([]);
const isLoading = ref(false);

onMounted(async () => {
  await getUserProfile(userId);
  await fetchUserPosts();
})

// 高亮导航索引
const selectedNav = ref('posts');

// 监听导航变化，加载相应的内容
watch(selectedNav, async (newValue) => {
  isLoading.value = true;
  posts.value = [];
  
  if (newValue === 'posts') {
    await fetchUserPosts();
  } else if (newValue === 'likes') {
    await fetchUserFavorites();
  }
  
  isLoading.value = false;
});

// 获取用户发布的帖子
const fetchUserPosts = async () => {
  try {
    isLoading.value = true;
    const res = await forumApi.getUserPostedList(userId);
    posts.value = res.data.posts || [];
  } catch (error) {
    ElMessage({
      type: 'warning',
      message: '你还没有发表过任何帖子',
      plain: true
    });
  } finally {
    isLoading.value = false;
  }
};

// 获取用户收藏的帖子
const fetchUserFavorites = async () => {
  try {
    isLoading.value = true;
    const res = await forumApi.getFavoritePostsList(userId);
    posts.value = res.favorites || [];
  } catch (error) {
    console.error('获取用户收藏失败:', error);
    ElMessage({
      type: 'error',
      message: '获取收藏失败',
      plain: true
    });
  } finally {
    isLoading.value = false;
  }
};

// 跳转到帖子详情页
const goToPost = (postId) => {
  navigateTo(`/forum/${postId}`);
};
</script>

<template>
  <div class="user-profile">
    <!-- 头部区域 -->
    <div class="profile-header">
      <div class="container">
        <div class="user-info">
          <div class="avatar-container">
            <el-avatar :size="100" :src="userInfo.avatar"></el-avatar>
          </div>
          <div class="user-details">
            <div class="username-container">
              <h1 class="username">{{ userInfo.userName }}</h1>
            </div>
            <div class="user-meta">
              <span class="meta-item">
                <el-icon>
                  <Timer />
                </el-icon>
                注册于 {{ userInfo.registerDate }}
              </span>
            </div>
            <div class="user-description">
              {{ userInfo.selfDescription }}
            </div>
          </div>
        </div>
        <div class="actions" title="修改用户资料" @click="router.push('/user/settings/profile')">
          <el-button type="primary" size="large" class="subscribe-btn">
            <el-icon style="margin-right: 0.5rem;">
              <Setting />
            </el-icon>
            修改资料
          </el-button>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="profile-content">
      <div class="container">
        <!-- 左侧导航 -->
        <Sidebar class="sidebar" height="auto">
          <!-- <div class="nav-item" :class="{ active: selectedNav === 'reply' }" @click="selectedNav = 'reply'">
            <el-icon>
              <ChatDotRound />
            </el-icon>
            <span>我的回复</span>
            <span class="count">{{ userInfo.counts.reply }}</span>
          </div> -->
          <div class="nav-item" :class="{ active: selectedNav === 'posts' }" @click="selectedNav = 'posts'">
            <el-icon>
              <Menu />
            </el-icon>
            <span>我发布的帖子</span>
            <!-- <span class="count">{{ userInfo.counts.topics }}</span> -->
          </div>
          <div class="nav-item" :class="{ active: selectedNav === 'likes' }" @click="selectedNav = 'likes'">
            <el-icon>
              <Star />
            </el-icon>
            <span>我收藏的帖子</span>
          </div>
          <!-- <div class="nav-item" :class="{ active: selectedNav === 'roadmap' }" @click="selectedNav = 'roadmap'">
            <el-icon>
              <DataAnalysis />
            </el-icon>
            <span>我的学习路线</span>
          </div> -->
        </Sidebar>

        <!-- 右侧内容 -->
        <div class="main-content">
          <el-skeleton :rows="5" animated v-if="isLoading" />
          
          <div class="empty-post" v-else-if="posts.length === 0">
            这里空空如也
          </div>
          
          <div class="post-list" v-else>
            <div 
              class="post-item" 
              v-for="post in posts" 
              :key="post.postId"
              @click="goToPost(post.postId)">
              <div class="post-title">{{ post.title }}</div>
              <div class="post-info">
                <div class="post-meta">
                  <span class="post-author">{{ post.author?.attributes?.userName || '未知用户' }}</span>
                  <span class="post-time">{{ post.createdAt }}</span>
                </div>
                <div class="post-stats">
                  <span class="stat-item">
                    <el-icon><ChatDotRound /></el-icon>
                    {{ post.commentsCount || 0 }}
                  </span>
                  <!-- <span class="stat-item">
                    <el-icon><Star /></el-icon>
                    {{ post.likesCount || 0 }}
                  </span> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  padding-top: 55px;
}

/* 头部区域样式 */
.profile-header {
  background-color: var(--color-background-soft);
  padding: 30px 0;
}

.profile-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar-container {
  margin-right: 20px;
}

.username-container {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.username {
  font-size: 24px;
  margin-right: 10px;
  font-weight: bold;
  color: var(--color-heading);
}

.user-meta {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  margin-right: 15px;
  color: var(--color-meta-text);
}

.user-description {
  font-size: 14px;
  color: var(--color-text-2);
}

.subscribe-btn {
  width: 100%;
  height: 40px;
  font-size: 1rem;
  background-color: var(--main-color);
  border-color: var(--main-color);
}

.subscribe-btn:hover {
  background-color: var(--main-color-hover-lighter);
  border-color: var(--main-color-hover-lighter);
  box-shadow: 0 0 5px var(--main-color-hover-shadow);
}

/* 内容区域样式 */
.profile-content {
  margin: 2rem 0;
}

.profile-content .container {
  display: flex;
  gap: 20px;
}

/* 侧边栏样式 */
.sidebar {
  width: 15rem;
  flex-shrink: 0;
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

.active {
  color: var(--main-color);
}

.nav-item .el-icon {
  margin-right: 10px;
}

.nav-item .count {
  margin-left: auto;
  color: var(--color-meta-text);
}

/* 主内容区样式 */
.main-content {
  flex: 1;
}

/* 帖子列表样式 */
.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  background-color: var(--color-background-layer);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.2s ease;
}

.post-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-color: var(--color-border-hover);
  background-color: var(--color-background-hover);
}

.post-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--link-color);
  margin-bottom: 0.75rem;
}

.post-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.post-author {
  font-size: 0.9rem;
  color: var(--color-text-2);
}

.post-time {
  font-size: 0.8rem;
  color: var(--color-meta-text);
}

.post-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: var(--color-meta-text);
}

.empty-post {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  background-color: var(--color-background-layer);
  border-radius: 8px;
  color: var(--color-meta-text);
  font-size: 1rem;
  border: 1px dashed var(--color-border);
}
</style>