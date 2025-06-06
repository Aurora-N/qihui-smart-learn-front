export default defineNuxtRouteMiddleware(to => {
  // 在客户端渲染时，可以从 store 获取状态
  if (import.meta.client) {
    const userStore = useUserStore()

    // 如果用户未登录，并且目标路径不是登录页，则重定向到登录页
    if (!userStore.isLoggedIn && to.path !== '/login') {
      // 显示提示信息，并重定向
      const redirectPath = encodeURIComponent(to.fullPath)
      ElMessage({ type: 'warning', message: '请先登录！', plain: true })

      return navigateTo(`/login?redirect=${redirectPath}`)
    }
  }
})
