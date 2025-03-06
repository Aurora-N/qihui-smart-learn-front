<!-- 用户个人页面 -->
<script setup>
const route = useRoute()
const userId = route.params.id
const userInfo = ref({})

const getUserProfile = async (userId) => {
  const res = await {
    data: {
      userId: '114514',
      userName: '野兽先辈',
      avatar: 'https://th.bing.com/th/id/R.302d3d33b7517b5ba691f0121f3cb70c?rik=DtmCYVM%2bGKcuCg&riu=http%3a%2f%2fe3f49eaa46b57.cdn.sohucs.com%2f2022%2f1%2f29%2f18%2f8%2fMTAwMTM1XzE2NDM0NTA5MzQ2ODc%3d.png&ehk=89geiY%2fK8bTH59efI2qV8vLTX5do6lx%2f4pkBusvICd8%3d&risl=&pid=ImgRaw&r=0',
      selfDescription: '逸一时，误一世',
      registerDate: '2019年8月10日',
      counts: {
        reply: 2151,
        posts: 346,
        likes: 5,
        mentioned: 14
      }
    }
  }
  userInfo.value = res.data

  // 动态更新标题
  useHead(() => ({
    title: userInfo.value.userName + '的主页',
  }));
}

import {
  Timer,
  Link,
  Document,
  ChatDotRound,
  Menu,
  Star,
  User,
  Warning,
  Back,
  MoreFilled
} from '@element-plus/icons-vue';

const posts = ref([
  {
    topic: '大三未来选择求建议',
    time: '5 天前',
    content: '这事儿没有标准答案，看你心中有没有什么倾向，先别预设难度，手上的事折腾起来，做啥都有个过程。'
  },
  {
    topic: '我的 2024 - 稳中求进、热爱生活',
    time: '11 天前',
    content: '蹭来的话在接触之前感觉要高冷一些，比如说一开始我也不知道他们开不开只撩拨电，充电桩 建得是最多的，真正了解下来其实都挺友好的，他们各方面都比较平衡，从买车到用车到维保方面都比较省心和舒适，符合我的预期。',
    reference: {
      author: 'zwrong',
      content: '主要还是品牌营销层面的问题，特斯拉作为开拓者知名度摆在那，然后在核心部件也是比较过硬，加上带量拉满所以大众对其品牌的信任度会很高。'
    }
  }
]);

onMounted(() => getUserProfile(userId))

// 高亮导航索引
const selectedNav = ref('reply');
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
        <div class="actions">
          <el-button type="primary" size="large" class="subscribe-btn">
            <el-icon style="margin-right: 0.5rem;">
              <Plus />
            </el-icon>
            关注
          </el-button>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="profile-content">
      <div class="container">
        <!-- 左侧导航 -->
        <Sidebar class="sidebar" height="auto">
          <div class="nav-item" :class="{ active: selectedNav === 'reply' }" @click="selectedNav = 'reply'">
            <el-icon>
              <ChatDotRound />
            </el-icon>
            <span>回复</span>
            <span class="count">2151</span>
          </div>
          <div class="nav-item" :class="{ active: selectedNav === 'posts' }" @click="selectedNav = 'posts'">
            <el-icon>
              <Menu />
            </el-icon>
            <span>主题</span>
            <span class="count">346</span>
          </div>
          <div class="nav-item" :class="{ active: selectedNav === 'likes' }" @click="selectedNav = 'likes'">
            <el-icon>
              <Star />
            </el-icon>
            <span>赞</span>
          </div>
          <div class="nav-item" :class="{ active: selectedNav === 'mentioned' }" @click="selectedNav = 'mentioned'">
            <el-icon>
              <User />
            </el-icon>
            <span>被提及</span>
          </div>
        </Sidebar>

        <!-- 右侧内容 -->
        <div class="main-content">
          <div class="post-item" v-for="(post, index) in posts" :key="index">
            <div class="post-header">回复
              <span class="post-title">{{ post.topic }}</span>
            </div>
            <div class="post-body">
              <div class="post-avatar">
                <el-avatar :size="50" :src="userInfo.avatar"></el-avatar>
              </div>
              <div class="post-info">
                <div class="post-author">
                  <span class="author-name">{{ userInfo.userName }}</span>
                  <span class="post-time">{{ post.time }}</span>
                </div>
                <div class="post-content">
                  <p>{{ post.content }}</p>
                  <div v-if="post.reference" class="post-reference">
                    <div class="reference-header">
                      <el-icon>
                        <Back />
                      </el-icon>
                      <span>{{ post.reference.author }}</span>
                    </div>
                    <div class="reference-content">
                      {{ post.reference.content }}
                    </div>
                  </div>
                </div>
                <div class="post-actions">
                  <el-button text size="small">赞</el-button>
                  <el-dropdown>
                    <el-button text size="small">
                      <el-icon>
                        <MoreFilled />
                      </el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>回复</el-dropdown-item>
                        <el-dropdown-item>引用</el-dropdown-item>
                        <el-dropdown-item>举报</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

/* 头部区域样式 */
.profile-header {
  background-color: #f3f4f6;
  padding: 30px 0;
  margin-top: 55px;
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
}

.user-description {
  font-size: 14px;
}

.subscribe-btn {
  width: 100%;
  height: 40px;
  font-size: 1rem;
  background-color: #0060DF;
  border-color: #0060DF;
}

.subscribe-btn:hover {
  background-color: #0250BB;
  border-color: #0250BB;
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
  color: #606266;
  cursor: pointer;
  transition: all 0.3s ease-out;
  padding-right: 1px;
}

.nav-item:hover {
  color: #2563eb;
  background-color: rgb(248, 250, 252);
  border-radius: 6px;
  padding-left: 10px;
}

.active {
  color: #2563eb;
}

.nav-item .el-icon {
  margin-right: 10px;
}

.nav-item .count {
  margin-left: auto;
  color: #909399;
}

/* 主内容区样式 */
.main-content {
  flex: 1;
}

.post-item {
  background-color: white;
  border-radius: 6px;
  margin-bottom: 20px;
  overflow: hidden;
  border: 1px solid rgb(231, 236, 243);
}

.post-header {
  padding: 12px 15px;
  background-color: rgb(248, 250, 252);
  border-bottom: 1px solid rgb(231, 236, 243);
}

.post-title {
  color: #0069c2;
  font-weight: 500;
}

.post-body {
  padding: 15px;
  display: flex;
}

.post-avatar {
  margin-right: 15px;
}

.post-info {
  flex: 1;
}

.post-author {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.author-name {
  font-weight: 500;
  margin-right: 8px;
}

.post-time {
  margin-left: 10px;
  color: #909399;
  font-size: 14px;
}

.post-content {
  margin-bottom: 15px;
  line-height: 1.6;
}

.post-reference {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 12px;
  margin-top: 10px;
}

.reference-header {
  display: flex;
  align-items: center;
  color: #409eff;
  margin-bottom: 8px;
}

.reference-header .el-icon {
  margin-right: 5px;
}

.reference-content {
  color: #606266;
  font-size: 14px;
}

.post-actions {
  display: flex;
  justify-content: flex-end;
}
</style>