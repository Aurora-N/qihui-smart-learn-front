import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Upload, FileText } from "lucide-react"
import { getKnowledgeBaseDetail, uploadDocuments } from "../api/ai"
import { Button } from "../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { toast } from "sonner"
import { Input } from "../components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog"

interface KnowledgeBaseFileRow {
  id: number
  name: string
  size: number
  chunkCount: number
  status: "indexed" | "processing"
  createdAt: string
}

export function KnowledgeBaseDetail() {
  const { id } = useParams<{ id: string }>()
  const [files, setFiles] = useState<KnowledgeBaseFileRow[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchDetail = () => {
    if (!id) return
    setLoading(true)
    getKnowledgeBaseDetail(Number(id))
      .then((data) => {
        setFiles(
          data.documents.map((document) => ({
            id: document.documentId,
            name: document.documentName,
            size: Number(document.documentSize) || 0,
            chunkCount: document.documentParts,
            status: "indexed",
            createdAt: new Date().toISOString(),
          }))
        )
      })
      .catch(() => toast.error("加载知识库详情失败"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchDetail()
  }, [id])

  const handleUpload = async () => {
    if (!id || !selectedFile) return toast.error("请选择要上传的文件")
    try {
      await uploadDocuments(Number(id), 1, [selectedFile])
      toast.success("文档已上传并开始索引")
      setIsDialogOpen(false)
      setSelectedFile(null)
      fetchDetail()
    } catch {
      toast.error("上传文档失败")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/knowledge-base">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">数据集文件</h2>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          管理所选数据集块上下文中的文档。
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              上传文件
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>上传文档上下文</DialogTitle>
              <DialogDescription>
                将文档添加到指定的 RAG 知识库
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                type="file"
                accept=".pdf,.txt,.md,.docx"
                onChange={(e) =>
                  e.target.files && setSelectedFile(e.target.files[0])
                }
              />
            </div>
            <DialogFooter>
              <Button onClick={handleUpload}>处理并索引</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            已索引文档
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>文件名</TableHead>
                <TableHead>大小</TableHead>
                <TableHead>分块</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>上传日期</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="animate-pulse py-8 text-center text-muted-foreground"
                  >
                    正在检索索引...
                  </TableCell>
                </TableRow>
              ) : files.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    此知识库中未上传任何文档。
                  </TableCell>
                </TableRow>
              ) : (
                files.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium text-foreground">
                      {f.name}
                    </TableCell>
                    <TableCell>{(f.size / 1024).toFixed(2)} KB</TableCell>
                    <TableCell className="font-medium text-blue-600">
                      {f.chunkCount || 0}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                          f.status === "indexed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {f.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(f.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
