import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"
import { getStatistics } from "../api/admin"
import type { StatisticsData } from "../api/types/admin"

const DEFAULT_STATS: StatisticsData = {
  userStats: {
    userNum: 0,
    bannedNum: 0,
    adminNum: 0,
  },
  postStats: {
    postNum: 0,
    commentNum: 0,
  },
  interactionStats: {
    favoritesNum: 0,
    likesNum: 0,
  },
  learningStats: {
    nodeNum: 0,
    relationshipNum: 0,
  },
  ragStats: {
    documentNum: 0,
    paragraphNum: 0,
  },
  modelStats: {
    modelNum: 0,
  },
  otherStats: {
    dailyVisits: 0,
    dailyUniqueVisitors: 0,
  },
}

function normalizeStatistics(
  data: Partial<StatisticsData> | null | undefined
): StatisticsData {
  return {
    userStats: { ...DEFAULT_STATS.userStats, ...data?.userStats },
    postStats: { ...DEFAULT_STATS.postStats, ...data?.postStats },
    interactionStats: {
      ...DEFAULT_STATS.interactionStats,
      ...data?.interactionStats,
    },
    learningStats: { ...DEFAULT_STATS.learningStats, ...data?.learningStats },
    ragStats: { ...DEFAULT_STATS.ragStats, ...data?.ragStats },
    modelStats: { ...DEFAULT_STATS.modelStats, ...data?.modelStats },
    otherStats: { ...DEFAULT_STATS.otherStats, ...data?.otherStats },
  }
}

export function Dashboard() {
  const [stats, setStats] = useState<StatisticsData>(DEFAULT_STATS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStatistics()
      .then((data) => setStats(normalizeStatistics(data)))
      .catch(() => setStats(DEFAULT_STATS))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">
        仪表盘
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="border-b bg-card pb-3">
                <Skeleton className="h-5 w-[140px]" />
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-8 w-[60px]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-8 w-[60px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <StatPanel
            title="用户数据"
            items={[
              { label: "总用户数", value: stats.userStats.userNum },
              { label: "被封禁用户", value: stats.userStats.bannedNum },
              { label: "管理员", value: stats.userStats.adminNum },
            ]}
          />
          <StatPanel
            title="论坛与互动"
            items={[
              { label: "帖子总数", value: stats.postStats.postNum },
              { label: "评论总数", value: stats.postStats.commentNum },
              { label: "收藏总数", value: stats.interactionStats.favoritesNum },
              { label: "点赞总数", value: stats.interactionStats.likesNum },
            ]}
          />
          <StatPanel
            title="学习图谱"
            items={[
              { label: "知识节点", value: stats.learningStats.nodeNum },
              { label: "节点关系", value: stats.learningStats.relationshipNum },
            ]}
          />
          <StatPanel
            title="RAG 知识库"
            items={[
              { label: "文档总数", value: stats.ragStats.documentNum },
              { label: "段落总数", value: stats.ragStats.paragraphNum },
            ]}
          />
          <StatPanel
            title="系统与访问"
            items={[
              { label: "模型数量", value: stats.modelStats.modelNum },
              { label: "今日访问量", value: stats.otherStats.dailyVisits },
              {
                label: "今日独立访客",
                value: stats.otherStats.dailyUniqueVisitors,
              },
            ]}
          />
        </div>
      )}
    </div>
  )
}

function StatPanel({
  title,
  items,
}: {
  title: string
  items: { label: string; value: number | string }[]
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="border-b bg-card pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {items.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                {item.label}
              </div>
              <div className="text-3xl font-bold text-foreground">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
