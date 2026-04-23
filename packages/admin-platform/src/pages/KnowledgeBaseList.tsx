import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { FolderPlus, Trash2, Database } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "../components/ui/dialog"
import {
  getKnowledgeBaseList,
  createKnowledgeBase,
  deleteKnowledgeBase,
} from "../api/ai"
import type { KnowledgeBaseSummary } from "../api/types/ai"
import { toast } from "sonner"

export function KnowledgeBaseList() {
  const navigate = useNavigate()
  // Ensure the userId is properly extracted from the JWT token or stored in userStore, mock to 1 for now or derive from store
  // Assuming userInfo or token holds it.
  const userId = 1

  const [kbs, setKbs] = useState<KnowledgeBaseSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Form states
  const [kbName, setKbName] = useState("")
  const [kbDescription, setKbDescription] = useState("")
  const [embeddingModel, setEmbeddingModel] = useState("Qwen3-embedding")
  const [rerankerModel, setRerankerModel] = useState("Qwen3-reranker")
  const kbType = "local"

  const fetchKbs = async () => {
    try {
      setLoading(true)
      const data = await getKnowledgeBaseList(userId)
      setKbs(data)
    } catch {
      toast.error("加载知识库数据失败")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKbs()
  }, [])

  const handleCreate = async () => {
    try {
      if (!kbName || !kbDescription) {
        toast.error("需要填写名称和描述")
        return
      }
      await createKnowledgeBase(userId, {
        kbName,
        kbDescription,
        embeddingModel,
        rerankerModel,
        kbType,
      })
      toast.success("知识库创建成功")
      setIsDialogOpen(false)
      // reset form
      setKbName("")
      setKbDescription("")
      fetchKbs()
    } catch {
      toast.error("创建知识库失败")
    }
  }

  const handleDelete = async (kbId: number) => {
    if (!window.confirm("删除此知识库？")) return
    try {
      await deleteKnowledgeBase(kbId)
      toast.success("删除成功")
      fetchKbs()
    } catch {
      toast.error("删除知识库失败")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground">
          <Database className="h-8 w-8 text-blue-600" />
          知识库列表
        </h2>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FolderPlus className="mr-2 h-5 w-5" />
              新建知识库
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>创建知识库</DialogTitle>
              <DialogDescription>
                为文档嵌入和 RAG 设置新的向量数据库。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  名称
                </Label>
                <Input
                  id="name"
                  value={kbName}
                  onChange={(e) => setKbName(e.target.value)}
                  placeholder="例如：Web 开发"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="desc" className="text-right">
                  描述
                </Label>
                <Input
                  id="desc"
                  value={kbDescription}
                  onChange={(e) => setKbDescription(e.target.value)}
                  placeholder="描述内容..."
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="embed" className="text-right">
                  嵌入模型
                </Label>
                <Input
                  id="embed"
                  value={embeddingModel}
                  onChange={(e) => setEmbeddingModel(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rerank" className="text-right">
                  重排模型
                </Label>
                <Input
                  id="rerank"
                  value={rerankerModel}
                  onChange={(e) => setRerankerModel(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700"
              >
                创建知识库
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>知识库 ID</TableHead>
              <TableHead>名称</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-6 text-center text-muted-foreground"
                >
                  正在加载知识库...
                </TableCell>
              </TableRow>
            ) : kbs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-6 text-center text-muted-foreground"
                >
                  未找到知识库
                </TableCell>
              </TableRow>
            ) : (
              kbs.map((kb) => (
                <TableRow
                  key={kb.kbId}
                  className="group cursor-pointer hover:bg-blue-50/50"
                  onClick={() => navigate(`/knowledge-base/${kb.kbId}`)}
                >
                  <TableCell className="font-medium text-muted-foreground">
                    #{kb.kbId}
                  </TableCell>
                  <TableCell className="font-medium text-blue-700">
                    {kb.kbName}
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(kb.kbId)
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> 删除
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
