// 与用户相关的接口函数
export const useAuthApi = () => {
    const nuxtApp = useNuxtApp();
    const tokenCookie = useCookie('token'); // 处理 Token

    return {
        login: async (data) => {
            const response = await nuxtApp.$axios.post('/api/login', data);
            tokenCookie.value = response.token; // 登录成功后保存 token
            return response;
        },
        logout: () => {
            tokenCookie.value = null; // 退出时清除 token
        },
        getUserInfo: () => nuxtApp.$axios.get('/api/user'), // 获取用户信息
    };
}