export const useForumApi = () => {
    const nuxtApp = useNuxtApp();

    return {
        // 获取全部标签
        getAllTags: () => nuxtApp.$axios.get('/forum/tags/list')
    }
}