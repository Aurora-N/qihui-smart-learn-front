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
@import url(~/assets/css/login_page.css);
</style>