import type { GraphNodeData } from '~/api/type/learn'
import { getLevelColor } from '~/constants/graph'

// 转换数据为D3.js格式，适配新的 GraphNodeData 结构
export const transformData = (data: GraphNodeData[] | unknown[] = []) => {
  const nodes: Record<string, unknown>[] = []
  const links: Record<string, unknown>[] = []
  const nodeMap = new Map<string, Record<string, unknown>>()

  // 添加节点到Map，确保唯一性
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addNode = (node: any) => {
    if (!node || (!node.name && !node.info)) return null

    // 使用节点名称作为主键 (因为 name 是主要标识)
    const uniqueId = node.name || node.info

    if (!nodeMap.has(uniqueId)) {
      const newNode: Record<string, unknown> = {
        id: uniqueId,
        uniqueId: uniqueId,
        name: node.name,
        content: node.info, // info为结点描述
        level: node.level, // level为难度
        type1: node.type1, // type1为一级类目
        type2: node.type2, // type2为二级类目
        color: getLevelColor(node.level), // 难度对应的颜色
        // 根据level设置组
        group: Number(node.level) || 1,
        // 保留原数据属性以防外部取用
        ...node,
      }
      nodes.push(newNode)
      nodeMap.set(uniqueId, newNode)
    }
    return uniqueId
  }

  // 确保数据是数组格式，处理可能的结构差异
  const records = Array.isArray(data) ? data : []

  // 处理每条关系记录 (startNode -> endNode)
  records.forEach(record => {
    if (!record || !record.startNode || !record.endNode) return

    const startId = addNode(record.startNode)
    const endId = addNode(record.endNode)

    if (startId && endId) {
      // 创建链接
      const relationship = record.nodeRelationship || record.relationship || {}
      links.push({
        source: startId,
        target: endId,
        relationship: relationship.type || '', // 关系名称
        info: relationship.info || '', // 关系描述
        value: 1, // 默认长度/宽度权重
      })
    }
  })

  return { nodes, links }
}

// 兼容原来针对关系数据的独立调用
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformRelationData = (relationData: any) => {
  return transformData(relationData)
}
