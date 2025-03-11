<template>
  <div class="login-container">
    <!-- <div class="logo">
      <img src="~/assets/logo.png" alt="OurLogo" />
    </div> -->

    <el-card class="login-card">
      <div class="header">
        <h1>登录</h1>
        <el-button :icon="Close" circle class="close-btn" @click="goBack" />
      </div>

      <el-input v-model="account" placeholder="请输入用户名" size="large" class="input-bar" />

      <el-input v-model="password" placeholder="请输入密码" size="large" class="input-bar" show-password />

      <el-button type="primary" size="large" class="submit-btn" @click="login">
        登录
      </el-button>

      <div>
        <el-button class="social-btn" size="large" @click="$router.push('/signup')">
          注册
        </el-button>
      </div>

      <div class="divider">
        <span>or</span>
      </div>

      <div>
        <el-button class="social-btn" size="large">
          <!-- <img src="/google-icon.svg" alt="" class="social-icon" /> -->
          Continue with Google
        </el-button>
      </div>

      <div>
        <el-button class="social-btn" size="large">
          <!-- <img src="/apple-icon.svg" alt="" class="social-icon" /> -->
          Continue with Apple
        </el-button>
      </div>

      <p class="terms">
        要继续登录，请同意我们的
        <a href="#">服务政策</a> 和
        <a href="#">隐私政策</a>
      </p>
    </el-card>
  </div>
</template>

<script setup>
import { Close } from '@element-plus/icons-vue'
import { useUserStore } from '~/stores/userStore';

const router = useRouter()

// 定义用户变量存储
const userStore = useUserStore()

const account = ref('')

const password = ref('')

definePageMeta({
  layout: false
});

const goBack = () => {
  router.push('/')
}

// 登录
const login = async () => {
  await userStore.userLogin({ account: account.value, password: password.value })
  const { status, msg } = await userStore.getUserInfo()
  ElMessage({ type: status, message: msg })
  router.replace({ path: '/' })
}
</script>

<style scoped>
.login-container {
  color: red;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgb(250, 250, 253);
}

.logo {
  max-width: 75px;
  margin-bottom: 4rem;
}

.logo img {
  width: 100%;
  height: auto;
}

.login-card {
  width: 100%;
  max-width: 460px;
}

:deep(.el-card) {
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: bold;
}

.header .close-btn {
  border-color: #e5e7eb;
  height: 2rem;
}

.header .close-btn:hover {
  background-color: #f9fafb;
}

:deep(.el-input) {
  margin-bottom: 1rem;
}

:deep(.el-input__wrapper) {
  padding: 0.75rem 1rem;
}

.input-bar {
  height: 48px;
}

.submit-btn {
  width: 100%;
  margin-bottom: 1rem;
  height: 48px;
  font-size: 1rem;
  background-color: #0060DF;
  border-color: #0060DF;
}

.submit-btn:hover {
  background-color: #0250BB;
  border-color: #0250BB;
}

.divider {
  display: flex;
  align-items: center;
  margin: 0.5rem 0 1.5rem 0;
  color: #666;
  font-size: 0.875rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #e5e7eb;
}

.divider span {
  padding: 0 1rem;
}

.social-btn {
  width: 100%;
  margin-bottom: 1rem;
  height: 48px;
  font-size: 1rem;
  font-weight: normal;
  border-color: #e5e7eb;
}

.social-btn:hover {
  background-color: #f9fafb;
}

.social-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.75rem;
}

.terms {
  text-align: center;
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
}

.terms a {
  color: #0060DF;
  text-decoration: none;
}

.terms a:hover {
  text-decoration: underline;
}
</style>