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
        getPostContent: async (postId, userId = null) => {
            if (!userId) return await nuxtApp.$axios.get(`/forum/posts/${postId}`);
            else return await nuxtApp.$axios.get(`/forum/posts/${postId}?user_id=${userId}`);
        },

        // 获取用户收藏的帖子列表
        getFavoritePostsList: (userId) => nuxtApp.$axios.get(`/forum/favorite?user_id=${userId}`),

        // 获取用户发布的帖子列表
        getUserPostedList: (userId) => nuxtApp.$axios.get(`/user/profile/${userId}/posts`),

        // 发表评论
        replyPost: async (postId, comment, repliedId = null) => {
            const res = await nuxtApp.$axios.post(`/forum/${postId}/comment`, {
                repliedId: repliedId,
                comment: comment,
            })
            ElMessage({type: 'success', message: res.msg, plain: true});
            return res;
        },

        // 点赞
        doLike: (postId, commentId = null) => nuxtApp.$axios.put(`/forum/${postId}/likes`, {
            "type": commentId ? "comment" : "post",
            ...(commentId && { "commentId": commentId }) // 有commentId才上传
        }),

        // 收藏
        doFavor: (postId) => nuxtApp.$axios.put(`/forum/${postId}/favorite`),
    }
}