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

        <div class="captcha-container">
          <el-input
            v-model="captcha"
            placeholder="请输入验证码"
            size="large"
            class="input-bar captcha-input"
          />
          <img
            v-if="captchaImage"
            :src="captchaImage"
            class="captcha-img"
            alt="验证码"
            @click="refreshCaptcha"
          />
        </div>

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

<script setup lang="ts">
import { Close } from '@element-plus/icons-vue'
import { useUserStore } from '~/stores/userStore'
import { useAuthApi } from '~/api/auth'

const passwordCheck = ref('')
const captcha = ref('')
const captchaKey = ref('')
const captchaImage = ref('')

const userData = ref<Record<string, string>>({
  userName: '',
  email: '',
  password: '',
})

// 字段名与中文提示的映射
const fieldLabels: Record<string, string> = {
  userName: '用户名',
  email: '邮箱',
  password: '密码',
}

const router = useRouter()
const authApi = useAuthApi()

const refreshCaptcha = async () => {
  try {
    const data = await authApi.getCaptcha()
    if (data && data.base64Image) {
      captchaImage.value = data.base64Image
      captchaKey.value = data.key
    }
  } catch {
    ElMessage({ type: 'error', message: '获取验证码失败，请重试', plain: true })
  }
}

onMounted(() => {
  refreshCaptcha()
})

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
  if (!captcha.value) {
    ElMessage({
      type: 'warning',
      message: '请输入验证码',
      plain: true,
    })
    return false
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
    await userStore.userSignUp({
      ...userData.value,
      captcha: captcha.value,
      captchaKey: captchaKey.value,
    } as any)
    const { status, msg } = await userStore.getUserInfo()
    ElMessage({ type: status as any, message: msg, plain: true })
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
@import url(~/assets/style/login_page.scss);
</style>
