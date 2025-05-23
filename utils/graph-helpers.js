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
        return '#ff7675' // 红色
      case 'category':
        return '#74b9ff' // 蓝色
      default:
        return '#a8a8a8' // 灰色（默认）
    }
  }

  // 根据难度级别设置颜色
  switch (node.level) {
    case '入门':
      return '#55efc4' // 绿色
    case '基础':
      return '#ffeaa7' // 黄色
    case '进阶':
      return '#fd79a8' // 粉色
    case '深入':
      return '#a29bfe' // 紫色
    case '高级':
      return '#e17055' // 橙色
    default:
      return '#a8a8a8' // 灰色（默认）
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
