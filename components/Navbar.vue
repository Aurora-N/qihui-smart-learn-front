<script setup>
import { ChevronDown as ChevronDownIcon, Settings as SettingsIcon } from 'lucide-vue-next'

const isLogin = ref(true);

const userInfo = ref({})

const getUserProfile = async (userId) => {
  const res = await {
    data: {
      userId: '114514',
      username: '野兽先辈',
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
}
onMounted(() => getUserProfile())
</script>

<template>
  <!-- Navigation Bar -->
  <nav class="navbar">
    <div class="nav-left">
      <a href="/" class="logo">LOGO</a>
      <div class="nav-links">
        <Dropdown open-on="hover">
          <template #trigger>
            <NuxtLink to="/learn" class="nav-button">学习方向</NuxtLink>
          </template>
          <a href="#">计算机基础</a>
          <a href="#">数据结构与算法分析</a>
          <a href="#">Web应用开发</a>
          <a href="#">计算机网络</a>
          <a href="#">操作系统</a>
        </Dropdown>
        <NuxtLink to="/posts" class="nav-button">文章</NuxtLink>
        <NuxtLink to="/chat" class="nav-button">在线答疑</NuxtLink>
        <NuxtLink to="/forum" class="nav-button">论坛</NuxtLink>
        <Dropdown open-on="hover">
          <template #trigger>
            <NuxtLink to="/about" class="nav-button">关于</NuxtLink>
          </template>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </Dropdown>
      </div>
    </div>

    <div class="nav-right">
      <!-- <div class="search-container">
          <input type="search" placeholder="搜索" class="search-input" @focus="openSearchModal">
        </div> -->
      <SearchModal @search="handleSearch" />
      <Dropdown open-on="click">
        <template #trigger>
          <button class="nav-button">
            简体中文
            <chevron-down-icon class="icon-small" />
          </button>
        </template>
        <a href="#">English</a>
        <a href="#">简体中文</a>
      </Dropdown>
      <button class="nav-button" @click="$router.push('/user/settings/profile')">
        <settings-icon class="icon-small" />
      </button>
      <div class="user" v-if="isLogin">
        <NuxtLink :to="`/user/${userInfo.userId}`" class="avatar-link">
          <el-avatar :size="35" :src="userInfo.avatar" class="avatar"></el-avatar>
        </NuxtLink>
      </div>
      <div class="user" v-else>
        <NuxtLink to="/signup" class="nav-button">注册</NuxtLink>
        <NuxtLink to="/login" class="login-button">登录</NuxtLink>
      </div>
    </div>
  </nav>

  <!-- <search-modal :is-open="isSearchModalOpen" @close="closeSearchModal" /> -->
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(64px);
  -webkit-backdrop-filter: blur(64px);
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  color: #2563eb;
  font-size: 1.25rem;
  font-weight: bold;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: #2c3e50;
  text-decoration: none;
}

.nav-button:hover {
  background-color: #f3f4f6;
  border-radius: 0.375rem;
}

.user {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.user .avatar-link {
  display: flex;
  line-height: 0;
  border-radius: 50%;
}

.user .avatar-link:hover {
  line-height: 0;
  outline: 4px solid rgb(231, 236, 243);
}

.search-container {
  position: relative;
  width: 16rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
}

.login-button {
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}

.login-button:hover {
  background-color: #1d4ed8;
}

/* 使用深度选择器来影响Dropdown内部的a标签样式 */
:deep(.dropdown-content a) {
  display: block;
  padding: 0.5rem 1rem;
  color: #374151;
  text-decoration: none;
}

:deep(.dropdown-content a:hover) {
  background-color: #f3f4f6;
  border-radius: 0.375rem;
}
</style>