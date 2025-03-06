<template>
  <div class="login-container">
    <!-- <div class="logo">
        <img src="~/assets/logo.png" alt="OurLogo" />
      </div> -->

    <el-card class="login-card">
      <div class="header">
        <h1>注册</h1>
        <el-button :icon="Close" circle class="close-btn" @click="$router.push('/')" />
      </div>

      <el-input v-model="username" placeholder="请输入用户名" size="large" class="input-bar" />

      <el-input v-model="password" placeholder="请输入密码" size="large" class="input-bar" show-password />

      <el-input v-model="passwordCheck" placeholder="请再次输入密码" size="large" class="input-bar" show-password />

      <el-button type="primary" size="large" class="submit-btn">
        注册
      </el-button>

      <div>
        <el-button class="other-btn" size="large" @click="$router.push('/login')">
          已有账号，去登陆
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import {
  Close
} from '@element-plus/icons-vue'

const username = ref('')

const password = ref('')

const passwordCheck = ref('')

const router = useRouter()

definePageMeta({
  layout: false
});
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

.other-btn {
  width: 100%;
  margin-bottom: 1rem;
  height: 48px;
  font-size: 1rem;
  font-weight: normal;
  border-color: #e5e7eb;
}

.other-btn:hover {
  background-color: #f9fafb;
}
</style>