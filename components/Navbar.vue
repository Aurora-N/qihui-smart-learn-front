<script setup>
import { ChevronDown as ChevronDownIcon, Settings as SettingsIcon, Menu as MenuIcon, X as XIcon, Sun as LightIcon, Moon as DarkIcon } from 'lucide-vue-next'
import ThemeToggle from './ThemeToggle.vue'

const isMobileMenuOpen = ref(false)
const userStore = useUserStore()
const router = useRouter()

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
  } else {
    document.body.style.overflow = ''; // Restore scrolling
  }
}

const routerTo = (path) => {
  if (isMobileMenuOpen.value) toggleMobileMenu();
  router.push(path);
}

const logout = () => {
  userStore.clearUserInfo()
  router.replace({ path: '/' })
}

const props = defineProps({
  title: String,
  transparent: {
    type: Boolean,
    default: true
  }
})

const activeItem = ref('')
</script>

<template>
  <!-- Navigation Bar -->
  <nav class="navbar" :class="{ 'navbar-transparent': transparent }">
    <div class="navbar-head" @click="$router.push('/')">
      <img class="logo" :src="`/logo_${useColorMode().preference === 'system' ? 'light' : useColorMode().preference}.png`"
      alt="OurLogo" />
      启慧智学
    </div>

    <div class="nav-left">
      <div v-if="!props.title" class="nav-links">
        <NuxtLink to="/" class="nav-button">
          <IconsHome class="nav-icon" />首页
        </NuxtLink>
        <NuxtLink to="/learn" class="nav-button">
          <IconsLearn class="nav-icon" />学习方向
        </NuxtLink>
        <NuxtLink to="/articles" class="nav-button">
          <IconsArticle class="nav-icon" />文章
        </NuxtLink>
        <NuxtLink to="/chat" class="nav-button">
          <IconsChat class="nav-icon" />在线答疑
        </NuxtLink>
        <NuxtLink to="/forum" class="nav-button">
          <IconsForum class="nav-icon" />论坛
        </NuxtLink>
        <NuxtLink to="/about" class="nav-button">
          <IconsAbout class="nav-icon" />关于
        </NuxtLink>
      </div>
      <div v-else class="navbar-title">{{ props.title }}</div>
    </div>

    <div class="nav-right">
      <SearchModal class="nav-button" />
      <ThemeToggle class="nav-button" />
      <div class="desktop-controls">
        <div class="user" v-if="userStore.userInfo.data">
          <el-dropdown class="dropdown">
            <NuxtLink :to="`/user/${userStore.userInfo.data.userId}`" class="avatar-link">
              <el-avatar :size="35" :src="userStore.userInfo.data.avatar" class="avatar"></el-avatar>
            </NuxtLink>
            <template #dropdown>
              <el-dropdown-menu class="dropdown-menu">
                <el-dropdown-item class="dropdown-item" @click="$router.push('/user/settings/profile')">
                  <IconsSettings />账号配置
                </el-dropdown-item>
                <el-dropdown-item class="dropdown-item" @click="logout">
                  <IconsLogout />退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="user" v-else>
          <NuxtLink to="/signup" class="nav-button">注册</NuxtLink>
          <NuxtLink to="/login" class="login-button">登录</NuxtLink>
        </div>
      </div>

      <button class="mobile-menu-button" @click="toggleMobileMenu">
        <menu-icon class="icon-small" />
      </button>
    </div>
  </nav>

  <!-- 移动端侧边栏 -->
  <div class="mobile-menu-overlay" :class="{ 'active': isMobileMenuOpen }" @click="toggleMobileMenu"></div>
  <div class="mobile-menu" :class="{ 'active': isMobileMenuOpen }">
    <div class="mobile-menu-header">
      <!-- <a href="/" class="logo">LOGO</a> -->
      <button class="close-menu-button" @click="toggleMobileMenu">
        <x-icon class="icon-small" />
      </button>
    </div>

    <div class="mobile-menu-content">
      <div class="mobile-nav-links">
        <div @click="routerTo('/')" class="mobile-nav-button">
          <IconsHome class="nav-icon" />首页
        </div>
        <div @click="routerTo('/learn')" class="mobile-nav-button">
          <IconsLearn class="nav-icon" />学习方向
        </div>
        <div @click="routerTo('/articles')" class="mobile-nav-button">
          <IconsArticle class="nav-icon" />文章
        </div>
        <div @click="routerTo('/chat')" class="mobile-nav-button">
          <IconsChat class="nav-icon" />在线答疑
        </div>
        <div @click="routerTo('/forum')" class="mobile-nav-button">
          <IconsForum class="nav-icon" />论坛
        </div>
        <div @click="routerTo('/about')" class="mobile-nav-button">
          <IconsAbout class="nav-icon" />关于
        </div>
      </div>

      <div class="mobile-menu-divider"></div>

      <!-- <div class="mobile-menu-divider"></div> -->

      <!-- User area in mobile menu -->
      <div class="mobile-user-area">
        <div class="mobile-section-title">用户</div>
        <template v-if="userStore.userInfo.data">
          <div class="mobile-user-info">
            <div @click="routerTo(`/user/${userStore.userInfo.data.userId}`)" class="mobile-user-profile">
              <el-avatar :size="50" :src="userStore.userInfo.data.avatar" class="mobile-avatar"></el-avatar>
              <div class="mobile-user-details">
                <div class="mobile-username">{{ userStore.userInfo.data.userName }}</div>
                <div class="mobile-user-description">{{ userStore.userInfo.data.selfDescription }}</div>
              </div>
            </div>
            <div class="mobile-auth-buttons">
              <button class="mobile-settings-button" @click="routerTo('/user/settings/profile')">
                <IconsSettings />
                <span>设置</span>
              </button>
              <button class="mobile-settings-button" @click="logout">
                <IconsLogout />
                <span>退出</span>
              </button>
            </div>

          </div>
        </template>
        <template v-else>
          <div class="mobile-auth-buttons">
            <div @click="routerTo('/login')" class="mobile-login-button">登录</div>
            <div @click="routerTo('/signup')" class="mobile-signup-button">注册</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background);
  max-height: 56px;
}

.navbar-transparent {
  background: var(--color-background-blur);
  backdrop-filter: blur(64px);
  -webkit-backdrop-filter: blur(64px);
}

.navbar-title {
  font-size: large;
}

.navbar-head {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  gap: 0.5rem;
  user-select: none; /* 标准写法 */
  -webkit-user-select: none; /* Chrome、Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE/Edge */
}

.light-mode .navbar-head {
  background: linear-gradient(-30deg, #0851bf, #3cfb92);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dark-mode .navbar-head {
  background: linear-gradient(-30deg, #3160e6, #3cf992);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  box-sizing: border-box;
  width: 50px;
  height: 50px;
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
  font-size: 1.1rem;
  color: var(--color-text);
  text-decoration: none;
  transition: all 0.3s ease-in-out;
}

.nav-button:hover {
  background-color: var(--color-background-hover);
  border-radius: 0.375rem;
}

.nav-button .nav-icon, .mobile-nav-button .nav-icon {
  height: 1.1rem;
  width: 1.1rem;
}

.mobile-nav-button .nav-icon {
  margin-right: 0.5rem;
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
  outline: 4px solid var(--color-background-hover);
}

:deep(.dropdown-item) {
  border-radius: 6px;
  gap: 0.5rem;
  margin: 2px 4px;
}

:deep(.dropdown-item:hover) {
  color: #2563eb;
  background-color: var(--color-background);
}

.login-button {
  padding: 0.4rem 1rem;
  background-color: var(--main-color);
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.1rem;
}

.login-button:hover {
  background-color: var(--main-color-hover-darker);
}

/* Mobile menu button */
.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--color-text);
}

/* Mobile menu */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 60;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  overflow: auto;
}

.mobile-menu-overlay.active {
  visibility: visible;
  opacity: 1;
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100%;
  background-color: var(--color-background);
  z-index: 70;
  transition: right 0.3s ease;
  overflow-y: auto;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
}

.mobile-menu.active {
  right: 0;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.close-menu-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu-content {
  padding: 1rem;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-nav-button {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  font-size: 1rem;
  color: var(--color-text);
  text-decoration: none;
  border-bottom: 1px solid var(--color-border);
}

.mobile-submenu {
  display: flex;
  flex-direction: column;
  padding-left: 1rem;
  margin-bottom: 0.5rem;
}

.mobile-submenu a {
  padding: 0.5rem 0;
  font-size: 0.875rem;
  color: #4b5563;
  text-decoration: none;
}

.mobile-menu-divider {
  height: 1px;
  background-color: var(--color-devider);
  margin: 1rem 0;
}

.mobile-section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.mobile-language-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-language-option {
  padding: 0.5rem;
  border-radius: 0.375rem;
  text-decoration: none;
  color: #4b5563;
}

.mobile-language-option.active {
  background-color: #f3f4f6;
  color: #2563eb;
}

.mobile-user-info {
  margin-top: 0.5rem;
}

.mobile-user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 0.375rem;
}

.mobile-user-profile:hover {
  background-color: var(--color-border-hover);
}

.mobile-user-details {
  display: flex;
  flex-direction: column;
}

.mobile-username {
  font-weight: 600;
  color: var(--color-text);
}

.mobile-user-description {
  font-size: 0.75rem;
  color: var(--color-text-2);
}

.mobile-settings-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem;
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  width: 100%;
  cursor: pointer;
  color: #4b5563;
}

.mobile-settings-button:hover {
  background-color: #f3f4f6;
}

.mobile-auth-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.mobile-login-button {
  width: 100%;
  display: block;
  padding: 0.5rem;
  background-color: #2563eb;
  color: white;
  text-align: center;
  border-radius: 0.375rem;
  text-decoration: none;
}

.mobile-signup-button {
  width: 100%;
  display: block;
  padding: 0.5rem;
  background-color: white;
  color: #2563eb;
  text-align: center;
  border: 1px solid #2563eb;
  border-radius: 0.375rem;
  text-decoration: none;
}

/* Desktop controls (language and user area) */
.desktop-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 1050px) {
  .nav-links .nav-button .nav-icon {
    display: none;
  }
}

@media (max-width: 850px) {
  .nav-links {
    display: none;
  }

  .desktop-controls {
    display: none;
  }

  .mobile-menu-button {
    display: block;
  }
}
</style>