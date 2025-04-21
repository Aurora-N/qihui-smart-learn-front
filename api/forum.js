export const useForumApi = () => {
    const nuxtApp = useNuxtApp();

    return {
        // 获取全部标签
        getAllTags: () => nuxtApp.$axios.get('/forum/tags/list'),
        
        // 获取所有帖子列表
        getPostsList: (method, start, limit) => nuxtApp.$axios.get(`/forum/posts?limit=${limit}&start=${start}&method=${method}`),
        
        // 发表新帖子
        createNewPost: (title, content, tags=[]) => nuxtApp.$axios.post('/newpost', {title, tags, content})
    }
}