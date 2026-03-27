export interface KnowledgeGraph {
  endNode: EndNode
  relationship: Relationship
  startNode: StartNode
}

export interface EndNode {
  info: string
  level: number
  name: string
  type1: string
  type2: string
}

export interface Relationship {
  info: string
  type: string
}

export interface StartNode {
  info: string
  level: number
  name: string
  type1: string
  type2: string
}
