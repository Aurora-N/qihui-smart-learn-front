import { useState, useEffect } from "react"
import { Settings as SettingsIcon, Shield, UserPlus } from "lucide-react"
import { getUserList } from "../api/user"
import type { UserOverview } from "../api/types/user"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

export function Settings() {
  const [admins, setAdmins] = useState<UserOverview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserList()
      .then((data) => setAdmins(data.filter((user) => user.type === "admin")))
      .catch(() => toast.error("加载管理员用户失败"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <SettingsIcon className="h-8 w-8 text-foreground" />
          系统设置
        </h2>
      </div>

      <Tabs defaultValue="admins" className="w-full">
        <TabsList className="rounded-lg border bg-card shadow-sm">
          <TabsTrigger
            value="admins"
            className="data-[state=active]:bg-muted"
          >
            管理员列表
          </TabsTrigger>
          <TabsTrigger
            value="audit"
            className="data-[state=active]:bg-muted"
          >
            审计日志
          </TabsTrigger>
        </TabsList>
        <TabsContent value="admins" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/50 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-indigo-600" />
                管理账号
              </CardTitle>
              <Button size="sm" variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                添加管理员
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>用户名</TableHead>
                    <TableHead>电子邮箱</TableHead>
                    <TableHead>加入时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-8 text-center text-muted-foreground"
                      >
                        正在加载管理员...
                      </TableCell>
                    </TableRow>
                  ) : admins.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="py-8 text-center text-muted-foreground"
                      >
                        未找到管理员。
                      </TableCell>
                    </TableRow>
                  ) : (
                    admins.map((admin) => (
                      <TableRow key={admin.userId}>
                        <TableCell className="font-semibold text-foreground">
                          {admin.userName}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {admin.email}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(
                            admin.lastConnectedDate
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          >
                            撤销权限
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader className="border-b bg-muted/50">
              <CardTitle className="text-lg">系统审计流</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center pt-16 pb-16 text-muted-foreground">
              近期无系统告警。
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
