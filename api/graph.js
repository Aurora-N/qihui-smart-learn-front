export const useGraphApi = () => {
    const nuxtApp = useNuxtApp();

    return {
        // 获取知识图谱所有节点
        getAllGraphs: () => nuxtApp.$axios.get('/forum/KnowledgeGraph'),

        // 获取知识图谱指定节点的下分关系，支持 `id` 和 `type` 查询参数
        getGraph: (params) => nuxtApp.$axios.get('/forum/KnowledgeGraph/category', { params }),

        // 获取知识图谱结点背后的资源
        getNodeResources: (nodeType, nodeId) => nuxtApp.$axios.get(`/learn/KnowledgeGraph/Resources?type=${nodeType}&id=${nodeId}`),

        // 获取指定节点的同级关系
        getNodeRelationship: (nodeId) => nuxtApp.$axios.get(`/learn/KnowledgeGraph/relationship?id=${nodeId}`),
    };
};