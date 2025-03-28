// 与用户相关的接口函数
import { encryptWithRSA } from '~/utils/rsaEncrypt';

export const useUserApi = () => {
    const nuxtApp = useNuxtApp();
    const tokenCookie = useCookie('token'); // 处理 Token

    return {
        login: async ({ account, password }) => {
            const encryptedPassword = await encryptWithRSA(password);
            const response = await nuxtApp.$axios.post('/login', {
                account, password: encryptedPassword  // 发送加密后的密码
            });
            tokenCookie.value = response.token; // 登录成功后保存 token
            return response;
        },

        logout: () => {
            tokenCookie.value = null; // 退出时清除 token
        },

        getKey: async () => nuxtApp.$axios.get("/login/publicKey"), // 获取公钥

        getUserInfo: async (userId) => nuxtApp.$axios.get(`/user/profile/${userId}`), // 获取用户信息

        updateUserInfo: async (userData) => {
            // 构造FormData
            console.log('userData', userData);
            const formData = new FormData();
            // 遍历userData并将非空的字段添加到 FormData 中
            Object.entries(userData).forEach(([key, value])=> {
                if (value) {
                    formData.append(key, value);
                }
            })
            console.log(formData);
            formData.forEach((value, key) => {
                console.log(key, value);
            });
            // 发起网络请求, 修改用户信息
            const response = nuxtApp.$axios.put('/user/setting', formData);
            return response;
        },
    };
}