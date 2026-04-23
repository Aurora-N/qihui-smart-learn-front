import type { GraphNode, GraphRelationship } from "./user"

export interface KnowledgeGraphData {
  startNode: GraphNode
  endNode: GraphNode
  nodeRelationship: GraphRelationship
}
