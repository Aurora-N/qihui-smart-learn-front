import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../components/ui/sheet"
import { Button } from "../components/ui/button"
import { MoreHorizontal, Ban, UserCheck, Trash2, Eye } from "lucide-react"
import { Badge } from "../components/ui/badge"
import {
  getUserList,
  getUserDetail,
  banUser,
  unbanUser,
  deleteUser,
} from "../api/user"
import type { UserOverview, UserDetail } from "../api/types/user"
import { toast } from "sonner" // Using sonner if available or standard toast

export function UserManagement() {
  const [users, setUsers] = useState<UserOverview[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await getUserList()
      setUsers(data)
    } catch (err: any) {
      toast.error("加载用户失败: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleAction = async (
    action: "ban" | "unban" | "delete",
    userId: number
  ) => {
    try {
      if (action === "ban") {
        const reason = window.prompt("输入封禁原因:")
        if (!reason) return
        await banUser(userId, { adminId: 1, reason, expire: 365 })
        toast.success(`用户 ${userId} 已被封禁`)
      } else if (action === "unban") {
        await unbanUser(userId)
        toast.success(`用户 ${userId} 已解封`)
      } else if (action === "delete") {
        if (!window.confirm("确定要永久删除此用户吗？")) return
        await deleteUser(userId)
        toast.success(`用户 ${userId} 已被删除`)
      }
      fetchUsers() // Refresh list
    } catch (error: any) {
      toast.error(`操作失败: ${error.message}`)
    }
  }

  const handleViewUser = async (userId: number) => {
    try {
      const data = await getUserDetail(userId)
      setSelectedUser(data)
      setIsSheetOpen(true)
    } catch (err: any) {
      toast.error("加载用户详情失败")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          用户管理
        </h2>
      </div>

      <div className="overflow-hidden rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>用户名</TableHead>
              <TableHead>电子邮箱</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>话题</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-6 text-center text-muted-foreground"
                >
                  正在加载用户...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-6 text-center text-muted-foreground"
                >
                  未找到用户
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell className="font-medium text-muted-foreground">
                    #{user.userId}
                  </TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.type === "admin" ? "default" : "secondary"}
                    >
                      {user.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.topics}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-muted"
                        >
                          <span className="sr-only">打开菜单</span>
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewUser(user.userId)}
                        >
                          <Eye className="mr-2 h-4 w-4" /> 查看详情
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction("ban", user.userId)}
                        >
                          <Ban className="mr-2 h-4 w-4" /> 封禁用户
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction("unban", user.userId)}
                        >
                          <UserCheck className="mr-2 h-4 w-4" /> 解封用户
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction("delete", user.userId)}
                          className="text-red-600 focus:bg-red-50 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> 删除人员
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>用户资料</SheetTitle>
            <SheetDescription>详细关系图和统计信息。</SheetDescription>
          </SheetHeader>
          {selectedUser && (
            <div className="mt-4 space-y-4 border-t py-6 text-sm">
              <img
                src={selectedUser.avatarURL || "https://via.placeholder.com/64"}
                alt="avatar"
                className="h-16 w-16 rounded-full"
              />
              <p>
                <strong className="text-foreground">姓名：</strong>{" "}
                {selectedUser.userName}
              </p>
              <p>
                <strong className="text-foreground">电子邮箱：</strong>{" "}
                {selectedUser.email}
              </p>
              <p>
                <strong className="text-foreground">个人简介：</strong>{" "}
                {selectedUser.selfDescription || "无"}
              </p>

              <div className="border-t border-border pt-4">
                <h4 className="mb-2 font-semibold">学习路径 (节点)</h4>
                {selectedUser.learningPath &&
                selectedUser.learningPath.length > 0 ? (
                  <div className="space-y-4">
                    {selectedUser.learningPath.map((path, i) => (
                      <div
                        key={i}
                        className="rounded-md border bg-muted/50 p-3 text-muted-foreground"
                      >
                        <span className="font-medium text-blue-600">
                          {path.startNode.name}
                        </span>{" "}
                        →
                        <span className="font-medium text-green-600">
                          {" "}
                          {path.endNode.name}
                        </span>
                        <br />{" "}
                        <span className="text-xs">
                          关系：{path.nodeRelationship.type}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">未定义学习路径</span>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
