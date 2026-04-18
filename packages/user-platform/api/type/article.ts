import type { KnowledgeGraph } from './graph'

export interface ArticleLink {
  articleName: string
  articlePath: string // 文章相对路径
}

export interface ArticleWithGraph {
  articleContent: string
  articleKnowledgeGraph: KnowledgeGraph[]
  articleName: string
}
