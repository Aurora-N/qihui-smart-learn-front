<template>
  <div class="login">
    <div class="login-container">
      <div class="bg-container">
        <img class="background" src="/login_bg.jpeg" alt="login background" />
      </div>

      <el-card class="login-card">
        <div class="header">
          <div class="header-left">
            <img class="logo"
              :src="`/logo_${useColorMode().preference === 'system' ? useColorMode().preference : 'light'}.png`"
              alt="OurLogo" />
            <h1>登录</h1>
          </div>

          <el-button :icon="Close" circle class="close-btn" @click="goBack" />
        </div>

        <el-input v-model="account" placeholder="请输入用户名" size="large" class="input-bar" />

        <el-input v-model="password" placeholder="请输入密码" size="large" class="input-bar" show-password />

        <el-button type="primary" size="large" class="submit-btn" @click="login">
          登录
        </el-button>

        <div>
          <el-button class="other-btn" size="large" @click="$router.push('/signup')">
            注册
          </el-button>
        </div>

        <!-- <div class="divider">
          <span>or</span>
        </div> -->

        <p class="terms">
          要继续登录，请同意我们的
          <a href="#">服务政策</a> 和
          <a href="#">隐私政策</a>
        </p>
      </el-card>
    </div>
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
@import url(~/assets/css/login_page.css);
</style>