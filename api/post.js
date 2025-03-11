export const usePostApi = () => {
    const nuxtApp = useNuxtApp();

    return {
        getPublicPosts: () => nuxtApp.$axios.get('/api/posts'), // 获取公共帖子
        getUserPosts: () => nuxtApp.$axios.get('/api/user/posts'), // 获取用户的帖子（需要 Token）
        createPost: (data) => nuxtApp.$axios.post('/api/posts', data), // 发表帖子
    };
};