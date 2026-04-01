export interface GraphNodeData {
  endNode: Node
  nodeRelationship: NodeRelationship
  startNode: Node
}

export interface Node {
  info: null | string
  level: number | null
  name: null | string
  type1: null | string
  type2: null | string
}

export interface NodeRelationship {
  info: null | string
  type: null | string
}

export interface NodeResourceData {
  /**
   * 节点文章集合
   */
  articles: Article[]
  /**
   * 视频集合
   */
  videos: Video[]
}

export interface Article {
  /**
   * 文章名称
   */
  articleName: string
  /**
   * 文章地址
   */
  articlePath: string
}

export interface Video {
  /**
   * 视频名称
   */
  name: string
  /**
   * 视频链接
   */
  url: string
}
