import { NODE_COLORS, getLevelColor } from '~/constants/graph'

/**
 * 根据节点类型获取半径
 * @param {object} node - 节点对象
 * @returns {number} - 节点半径
 */
export const getNodeRadius = node => {
  switch (node.type) {
    case 'all':
      return 20
    case 'category':
      return 15
    case 'part':
      return 12
    case 'depart':
      return 10
    default:
      return 8 // course1 和 course2
  }
}

/**
 * 根据难度级别获取颜色
 * @param {object} node - 节点对象
 * @returns {string} - 颜色代码
 */
export const getNodeColor = node => {
  // 对于没有难度级别的节点（如根节点和分类节点），保持原有颜色
  if (!node.level) {
    switch (node.type) {
      case 'all':
        return NODE_COLORS.ROOT
      case 'category':
        return NODE_COLORS.CATEGORY
      default:
        return NODE_COLORS.DEFAULT
    }
  }

  // 通过数字形式匹配新版本的难度常规范
  if (typeof node.level === 'number' || !Number.isNaN(Number(node.level))) {
    return getLevelColor(node.level)
  }

  // 根据旧有的字符难度级别设置颜色
  switch (node.level) {
    case '入门':
      return NODE_COLORS.LEVEL_1
    case '基础':
      return NODE_COLORS.LEVEL_2
    case '进阶':
      return NODE_COLORS.LEVEL_3
    case '深入':
      return NODE_COLORS.LEVEL_4
    case '高级':
      return NODE_COLORS.LEVEL_5
    default:
      return NODE_COLORS.DEFAULT
  }
}

/**
 * 获取难度级别的CSS类名
 * @param {string} level - 难度级别
 * @returns {string} - CSS类名
 */
export const getLevelClass = level => {
  switch (level) {
    case '入门':
      return 'beginner'
    case '基础':
      return 'basic'
    case '进阶':
      return 'intermediate'
    case '深入':
      return 'advanced'
    case '高级':
      return 'expert'
    default:
      return 'default'
  }
}
