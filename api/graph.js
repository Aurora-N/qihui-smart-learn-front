export const useGraphApi = () => {
    const nuxtApp = useNuxtApp();

    return {
        // 获取知识图谱所有节点
        getAllGraphs: () => nuxtApp.$axios.get('/forum/KnowledgeGraph'),
        // 获取知识图谱指定节点关系，支持 `id` 和 `type` 查询参数
        getGraph: (params) => nuxtApp.$axios.get('/forum/KnowledgeGraph/category', { params }),
    };
};