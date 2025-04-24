// 转换数据为D3.js格式
export const transformData = (data, maxDepth) => {
    const nodes = [];
    const links = [];
    const nodeMap = new Map();

    // 添加节点到Map，确保唯一性
    const addNode = (node, type, parentId = null) => {
        if (!node) return null;

        // 创建唯一的节点 ID
        const uniqueId = `${type}_${node.id}_${node.level || 'no_level'}`;

        if (!nodeMap.has(uniqueId)) {
            const newNode = {
                ...node,
                uniqueId,
                type,
                // 为不同类型的节点设置不同的组
                group: type === 'all' ? 1 :
                    type === 'category' ? 2 :
                        type === 'part' ? 3 :
                            type === 'depart' ? 4 : 5
            };
            nodes.push(newNode);
            nodeMap.set(uniqueId, newNode);
        }

        // 如果有父节点，创建链接
        if (parentId) {
            links.push({
                source: parentId,
                target: uniqueId,
                relationship: getRelationship(type),
                value: getLinkValue(type)
            });
        }

        return uniqueId;
    };

    // 获取关系名称
    const getRelationship = (type) => {
        switch (type) {
            case 'category': return '总路线';
            case 'part': return '板块分类';
            case 'depart': return '板块细分';
            case 'course1':
            case 'course2': return '知识分类';
            default: return '';
        }
    };

    // 获取链接值
    const getLinkValue = (type) => {
        switch (type) {
            case 'category': return 3;
            case 'part':
            case 'depart': return 2;
            case 'course1':
            case 'course2': return 1;
            default: return 1;
        }
    };

    // 处理每条记录
    data.forEach(record => {
        const allId = addNode(record.all, 'all');
        const categoryId = addNode(record.category, 'category', allId);
        const partId = addNode(record.part, 'part', categoryId);

        if (maxDepth > 3) {
            if (record.depart) {
                const departId = addNode(record.depart, 'depart', partId);
                if (record.course2) {
                    addNode(record.course2, 'course2', departId);
                }
            }

            if (record.course1) {
                addNode(record.course1, 'course1', partId);
            }
        }
    });

    return { nodes, links };
};

// 将关系型JSON数据转换为D3.js格式
export const transformRelationData = (relationData) => {
    const nodes = [];
    const links = [];
    const nodeMap = new Map();

    // 添加节点到Map，确保唯一性
    const addNode = (id, content, level) => {
        if (!nodeMap.has(id)) {
            const newNode = {
                id,
                uniqueId: id,
                name: id,
                content: content,
                level: level,
                // 根据level设置组
                group: level === "基础" ? 1 :
                       level === "进阶" ? 2 :
                       level === "高级" ? 3 : 4
            };
            nodes.push(newNode);
            nodeMap.set(id, newNode);
            return newNode;
        }
        return nodeMap.get(id);
    };

    // 处理每条关系记录
    relationData.forEach(relation => {
        const { 
            startId, endId, relationType, stepOrder,
            startContent, startLevel, endContent, endLevel
        } = relation;
        
        // 添加起始和结束节点
        addNode(startId, startContent, startLevel);
        addNode(endId, endContent, endLevel);
        
        // 创建链接
        links.push({
            source: startId,
            target: endId,
            relationship: relationType,
            value: stepOrder || 1
        });
    });

    return { nodes, links };
};