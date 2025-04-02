export const usePostApi = () => {
    const nuxtApp = useNuxtApp();

    return {
        getPublicPosts: async () => await nuxtApp.$axios.get('/api/posts'), // 获取公共帖子
        getUserPosts: async () => await nuxtApp.$axios.get('/api/user/posts'), // 获取用户的帖子（需要 Token）
        createPost: async (data) => await nuxtApp.$axios.post('/api/posts', data), // 发表帖子
    };
};