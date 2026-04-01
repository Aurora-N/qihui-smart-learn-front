<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { ChatDotRound, User } from '@element-plus/icons-vue'
import { useUserApi } from '~/api/user'
import AvatarUploader from '~/components/AvatarUploader.vue'
import { encryptWithRSA } from '~/utils/rsaEncrypt'

const router = useRouter()

// 用户信息
const userInfo = ref<any>({})
const userStore = useUserStore()

const getUserInfo = async () => {
  if (userStore.userInfo.token) {
    await userStore.getUserInfo()
    userInfo.value = userStore.userInfo.data
    form.userName = userInfo.value.userName || ''
    form.email = userInfo.value.email || ''
    form.selfDescription = userInfo.value.selfDescription || ''
    form.password = ''
    form.confirmPassword = ''
  } else {
    ElMessage({ type: 'warning', message: '用户未登录', plain: true })
    router.replace({ path: '/login' })
  }
}

// 表单数据
const form = reactive<any>({
  userName: '',
  email: '',
  avatar: '',
  selfDescription: '',
  password: '',
  confirmPassword: '',
})

// 表单验证规则
const rules = {
  userName: [{ required: true, message: '用户名不可为空', trigger: 'blur' }],
  email: [{ required: true, message: '登录邮箱不可为空', trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }],
}

const formRef = ref<any>(null)
const selectedNav = ref('profile')
const isLoading = ref(false)
const avatarUrl = computed(() => userStore.userInfo.data?.avatar)

// 初始化表单数据
onMounted(() => {
  getUserInfo()
})

// 密码验证
function validatePassword(rule: any, value: any, callback: any) {
  if (value && value.length < 6) {
    callback(new Error('密码长度不能小于6位'))
  } else {
    callback()
  }
}

// 确认密码验证
function validateConfirmPassword(rule: any, value: any, callback: any) {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 处理头像上传
const handleAvatarUpload = (file: any) => {
  form.avatar = file
}

// 提交表单
async function submitForm() {
  if (!formRef.value) return

  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      isLoading.value = true
      let finalPassword = form.password
      if (finalPassword) finalPassword = await encryptWithRSA(finalPassword)
      const { confirmPassword, password, ...rest } = form

      const payload = { ...rest }
      if (finalPassword) {
        payload.password = finalPassword
      }

      // 调用API保存用户信息
      const res = await useUserApi().updateUserInfo(
        userStore.userInfo.id!,
        payload
      )
      if (res.status === 'success') {
        await getUserInfo()
        isLoading.value = false
        ElMessage({
          type: 'success',
          message: res.msg || '修改成功',
          plain: true,
        })
      } else {
        isLoading.value = false
      }
    }
  })
}

useHead({
  title: '个人资料设置',
})

definePageMeta({
  middleware: 'auth', // 'auth' 是中间件的文件名 (auth.js)
})
</script>

<template>
  <div class="user-settings">
    <!-- 内容区域 -->
    <div class="user-settings-content">
      <!-- 左侧导航 -->
      <div class="left-sidebar">
        <el-button
          class="back-btn"
          size="large"
          @click="$router.push(`/user/${userInfo.userId}`)"
        >
          <el-icon>
            <ArrowLeft />
          </el-icon>
          返回用户中心
        </el-button>
        <Sidebar class="sidebar-nav" height="auto">
          <div
            class="nav-item"
            :class="{ active: selectedNav === 'profile' }"
            @click="selectedNav = 'profile'"
          >
            <el-icon>
              <User />
            </el-icon>
            <span>个人资料</span>
          </div>
          <!-- <div class="nav-item" :class="{ active: selectedNav === 'posts' }" @click="selectedNav = 'posts'">
            <el-icon>
              <ChatDotRound />
            </el-icon>
            <span>发布帖子</span>
          </div> -->
          <div
            class="nav-item"
            :class="{ active: selectedNav === 'style' }"
            @click="selectedNav = 'style'"
          >
            <el-icon>
              <Operation />
            </el-icon>
            <span>个性化</span>
          </div>
        </Sidebar>
      </div>

      <!-- 右侧内容 -->
      <div class="main-content">
        <div class="profile-container">
          <div class="profile-header">
            <h1 class="profile-title">个人资料设置</h1>
            <el-button
              type="primary"
              :loading="isLoading"
              class="submit-btn"
              @click="submitForm"
            >
              保存修改
            </el-button>
          </div>

          <div class="user-info-display">
            <div class="info-item">
              <span class="label">用户ID:</span>
              <span class="value">{{ userInfo.userId }}</span>
            </div>
            <div class="info-item">
              <span class="label">注册日期:</span>
              <span class="value">{{ userInfo.registerDate }}</span>
            </div>
          </div>

          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="100px"
            class="profile-form"
          >
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户名" />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" />
            </el-form-item>

            <el-form-item label="头像">
              <div class="avatar-uploader">
                <AvatarUploader
                  :name="userInfo.userName"
                  :avatarurl="avatarUrl"
                  @update:avatar="handleAvatarUpload"
                />
              </div>
            </el-form-item>

            <el-form-item label="自我描述">
              <el-input
                v-model="form.selfDescription"
                type="textarea"
                :rows="3"
                placeholder="请输入自我描述"
              />
            </el-form-item>

            <el-form-item label="新密码" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="请输入新密码，不修改请留空"
                show-password
              />
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="form.confirmPassword"
                type="password"
                placeholder="请再次输入新密码"
                show-password
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 内容区域样式 */
.user-settings {
  margin-top: 80px;
  display: flex;
  justify-content: center;
}

.user-settings-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  gap: 20px;
}

/* 左侧导航样式 */
.left-sidebar {
  width: 15rem;
  flex-shrink: 0;
}

.back-btn {
  width: 100%;
  margin-bottom: 1rem;
}

.sidebar-nav {
  width: 100%;
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

/* 个人资料设置样式 */
.profile-container {
  padding: 0 20px;
  background-color: #fff;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
}

.profile-header .profile-title {
  /* font-size: 20px; */
  color: #303133;
}

.profile-header .profile-title h1 {
  /* font-size: 20px; */
  color: #303133;
  margin: -0.5rem 0 0 0;
  margin-bottom: 0;
}

.submit-btn {
  background-color: #0060df;
  border-color: #0060df;
}

.submit-btn:hover {
  background-color: #0250bb;
  border-color: #0250bb;
}

.user-info-display {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
}

.info-item:last-child {
  display: flex;
  margin-bottom: 0;
}

.info-item .label {
  font-weight: bold;
  width: 100px;
  color: #606266;
}

.info-item .value {
  color: #303133;
}

.profile-form {
  max-width: 600px;
}

.avatar-uploader {
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .user-settings-content {
    flex-direction: column;
  }

  .left-sidebar {
    width: 100%;
    margin-bottom: 20px;
  }

  .profile-form {
    max-width: 100%;
  }
}
</style>
