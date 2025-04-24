export const useForumApi = () => {
    const nuxtApp = useNuxtApp();

    return {
        // 获取全部标签
        getAllTags: () => nuxtApp.$axios.get('/forum/tags/list'),
        
        // 获取所有帖子列表
        getPostsList: (method, start, limit) => nuxtApp.$axios.get(`/forum/posts?limit=${limit}&start=${start}&method=${method}`),

        // 获取指定标签对应的帖子列表
        getTagPostsList: (tagId) => nuxtApp.$axios.get(`/tags/${tagId}/postlist`),

        // 发表新帖子
        createNewPost: (title, content, tags=[]) => nuxtApp.$axios.post('/newpost', {
            data: {
                title, tags, content
            }
        }),

        // 获取某个帖子内容
        getPostContent: (postId) => nuxtApp.$axios.get(`/forum/posts/${postId}`),

        // 获取用户收藏的帖子列表
        getFavoritePostsList: (userId) => nuxtApp.$axios.get(`/forum/favorite?id=${userId}`),

        // 发表评论
        replyPost: async (postId, comment, repliedId = null) => {
            const res = await nuxtApp.$axios.post(`/forum/${postId}/comment`, {
                repliedId: repliedId,
                comment: comment,
            })
            ElMessage({type: 'success', message: res.msg, plain: true});
            return res;
        }

        // 点赞收藏
        
    }
}