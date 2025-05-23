<template>
  <div class="signup">
    <div class="login-container">
      <div class="bg-container">
        <img class="background" src="/signup_bg.png" alt="login background" />
      </div>

      <el-card class="login-card">
        <div class="header">
          <div class="header-left">
            <img
              class="logo"
              :src="`/logo_${useColorMode().preference === 'system' ? useColorMode().preference : 'light'}.png`"
              alt="OurLogo"
            />
            <h1>注册</h1>
          </div>
          <el-button
            :icon="Close"
            circle
            class="close-btn"
            @click="$router.push('/')"
          />
        </div>

        <el-input
          v-model="userData.userName"
          placeholder="请输入用户名"
          size="large"
          class="input-bar"
        />

        <el-input
          v-model="userData.email"
          placeholder="请输入用于登陆的邮箱"
          size="large"
          class="input-bar"
        />

        <el-input
          v-model="userData.password"
          placeholder="请输入密码"
          size="large"
          class="input-bar"
          show-password
        />

        <el-input
          v-model="passwordCheck"
          placeholder="请再次输入密码"
          size="large"
          class="input-bar"
          show-password
        />

        <el-button
          type="primary"
          size="large"
          class="submit-btn"
          @click="signUp"
        >
          注册
        </el-button>

        <div>
          <el-button
            class="other-btn"
            size="large"
            @click="$router.push('/login')"
          >
            已有账号，去登陆
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { Close } from '@element-plus/icons-vue'
import { useUserStore } from '~/stores/userStore'

const passwordCheck = ref('')

const userData = ref({
  userName: '',
  email: '',
  password: '',
})

// 字段名与中文提示的映射
const fieldLabels = {
  userName: '用户名',
  email: '邮箱',
  password: '密码',
}

const router = useRouter()

const validateFields = () => {
  // 校验信息是否合法
  for (const [key, value] of Object.entries(userData.value)) {
    if (!value) {
      ElMessage({
        type: 'warning',
        message: `请填写${fieldLabels[key]}`,
        plain: true,
      })
      return false
    }
  }
  if (userData.value.password !== passwordCheck.value) {
    ElMessage({
      type: 'warning',
      message: '两次输入的密码不一致，请重新输入',
      plain: true,
    })
    return false
  }
  return true
}

const userStore = useUserStore()

const signUp = async () => {
  if (validateFields()) {
    await userStore.userSignUp(userData.value)
    const { status, msg } = await userStore.getUserInfo()
    ElMessage({ type: status, message: msg })
    router.replace({ path: '/' })
  }
}

definePageMeta({
  layout: false,
})

useSeoMeta({
  title: '注册新用户',
})
</script>

<style lang="scss" scoped>
@import url(~/assets/css/login_page.scss);
</style>
