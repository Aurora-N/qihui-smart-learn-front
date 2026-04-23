import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { getKnowledgeGraph, updateKnowledgeGraph } from "../api/knowledgeGraph"
import type { KnowledgeGraphData } from "../api/types/knowledgeGraph"
import { UploadCloud, RefreshCw, Network } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { toast } from "sonner"

export function KnowledgeGraph() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<KnowledgeGraphData[]>([])
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleUpload = async () => {
    if (!file) return toast.error("请选择一个 JSON 文件")
    try {
      await updateKnowledgeGraph(file)
      toast.success("知识图谱更新成功")
      setIsDialogOpen(false)
      fetchGraph()
    } catch {
      toast.error("更新知识图谱失败")
    }
  }

  function renderD3Graph(linksData: KnowledgeGraphData[]) {
    if (!containerRef.current || linksData.length === 0) return

    const width = containerRef.current.clientWidth
    const height = 600

    // Wipe previous canvas
    d3.select(containerRef.current).selectAll("*").remove()

    // Transform links to D3 friendly nodes and links array
    const nodesMap = new Map<string, any>()
    linksData.forEach((link) => {
      if (link.startNode.name)
        nodesMap.set(link.startNode.name, {
          id: link.startNode.name,
          ...link.startNode,
        })
      if (link.endNode.name)
        nodesMap.set(link.endNode.name, {
          id: link.endNode.name,
          ...link.endNode,
        })
    })

    const graphNodes = Array.from(nodesMap.values())
    const graphLinks = linksData
      .filter((l) => l.startNode.name && l.endNode.name)
      .map((d) => ({
        source: d.startNode.name!,
        target: d.endNode.name!,
        type: d.nodeRelationship.type,
      }))

    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr(
        "style",
        "max-width: 100%; height: auto; background-color: #f8fafc; border-radius: 8px;"
      )

    // Definition of arrows
    svg
      .append("defs")
      .selectAll("marker")
      .data(["end"])
      .enter()
      .append("marker")
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", -0.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#94a3b8")
      .attr("d", "M0,-5L10,0L0,5")

    const simulation = d3
      .forceSimulation(graphNodes)
      .force(
        "link",
        d3
          .forceLink(graphLinks)
          .id((d: any) => d.id)
          .distance(150)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(50).iterations(2))

    // Container for zooming
    const g = svg.append("g")

    // Support pan and zoom
    svg.call(
      d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => g.attr("transform", event.transform))
    )

    const link = g
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(graphLinks)
      .join("path")
      .attr("marker-end", "url(#end)")

    const linkLabel = g
      .append("g")
      .selectAll("text")
      .data(graphLinks)
      .join("text")
      .attr("class", "text-xs fill-neutral-500 font-medium")
      .attr("dy", -4)
      .attr("text-anchor", "middle")
      .text((d) => d.type || "")

    const nodeGroup = g
      .append("g")
      .selectAll("g")
      .data(graphNodes)
      .join("g")
      .call(drag(simulation) as any)

    nodeGroup
      .append("circle")
      .attr("r", 12)
      .attr("fill", "#3b82f6")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)

    nodeGroup
      .append("text")
      .attr("x", 15)
      .attr("y", "0.31em")
      .attr("class", "text-sm fill-neutral-800 font-semibold")
      .text((d) => d.id)

    simulation.on("tick", () => {
      link.attr("d", (d: any) => {
        const dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy)
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`
      })

      linkLabel
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2)

      nodeGroup.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
    })

    function drag(simulation: any) {
      return d3
        .drag()
        .on("start", (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on("drag", (event, d: any) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on("end", (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        })
    }
  }

  function fetchGraph() {
    setLoading(true)
    getKnowledgeGraph()
      .then((res) => {
        setData(res)
        renderD3Graph(res)
      })
      .catch(() => toast.error("加载知识图谱失败"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchGraph()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handleResize = () => {
      // Need to defer renderD3Graph slightly when relying on clientWidth changes directly on resize
      setTimeout(() => renderD3Graph(data), 0)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground">
          <Network className="h-8 w-8 text-blue-600" />
          知识图谱管理
        </h2>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UploadCloud className="mr-2 h-4 w-4" />
              更新 JSON
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>更新知识图谱 JSON</DialogTitle>
              <DialogDescription>
                上传包含节点语义的新图谱数据文件。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                type="file"
                accept=".json"
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleUpload}>保存更改</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between text-lg">
            可视化画布
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchGraph}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-[600px] w-full animate-pulse items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
              正在布置 D3 图谱物理引擎...
            </div>
          ) : data.length === 0 ? (
            <div className="flex h-[600px] w-full items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 text-muted-foreground">
              图数据库为空或未初始化。
            </div>
          ) : (
            <div
              ref={containerRef}
              className="w-full overflow-hidden rounded-xl border shadow-inner"
            ></div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
