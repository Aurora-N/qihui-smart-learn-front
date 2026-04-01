export const NODE_COLORS = {
  ROOT: '#ff7675',
  CATEGORY: '#74b9ff',
  LEVEL_1: '#55efc4', // 入门 / 基础 (1)
  LEVEL_2: '#ffeaa7', // 基础 / 进阶 (2)
  LEVEL_3: '#fd79a8', // 进阶 / 深入 (3)
  LEVEL_4: '#a29bfe', // 深入 / 高级 (4)
  LEVEL_5: '#e17055', // 高级 (5)
  DEFAULT: '#a8a8a8',
}

export const GRAPH_LEGEND_ITEMS = [
  { color: NODE_COLORS.ROOT, label: '根节点' },
  { color: NODE_COLORS.CATEGORY, label: '分类' },
  { color: NODE_COLORS.LEVEL_1, label: '入门难度' },
  { color: NODE_COLORS.LEVEL_2, label: '基础难度' },
  { color: NODE_COLORS.LEVEL_3, label: '进阶难度' },
  { color: NODE_COLORS.LEVEL_4, label: '深入难度' },
  { color: NODE_COLORS.LEVEL_5, label: '高级难度' },
]

export const getLevelColor = (
  level: number | string | null | undefined
): string => {
  const levelNum = Number(level)
  switch (levelNum) {
    case 1:
      return NODE_COLORS.LEVEL_1
    case 2:
      return NODE_COLORS.LEVEL_2
    case 3:
      return NODE_COLORS.LEVEL_3
    case 4:
      return NODE_COLORS.LEVEL_4
    case 5:
      return NODE_COLORS.LEVEL_5
    default:
      return NODE_COLORS.DEFAULT
  }
}
