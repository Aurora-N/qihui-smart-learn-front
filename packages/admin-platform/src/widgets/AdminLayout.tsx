import { NavLink, Outlet, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  BookOpen,
  Network,
  Settings,
  LogOut,
  LogIn,
} from "lucide-react"
import { useUserStore } from "../store/userStore"
import { Button } from "../components/ui/button"
import { ThemeToggle } from "../components/ThemeToggle"

const NAV_ITEMS = [
  { path: "/", label: "总览", icon: LayoutDashboard },
  { path: "/users", label: "用户管理", icon: Users },
  { path: "/forum", label: "论坛管理", icon: MessageSquare },
  { path: "/knowledge-base", label: "知识库", icon: BookOpen },
  { path: "/knowledge-graph", label: "知识图谱", icon: Network },
  { path: "/settings", label: "系统设置", icon: Settings },
]

export function AdminLayout() {
  const { logout, token } = useUserStore()
  const navigate = useNavigate()

  if (!token) {
    navigate("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside className="relative z-10 hidden w-64 shrink-0 flex-col items-stretch border-r bg-card md:flex">
        <div className="flex h-16 shrink-0 items-center justify-center gap-2 border-b px-6">
          <img
            src="/logo_light.png"
            alt="Logo"
            className="h-8 w-8 object-contain"
          />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            启慧智学管理平台
          </h1>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary dark:text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="flex shrink-0 items-center justify-between gap-2 border-t p-4">
          {token ? (
            <Button
              variant="ghost"
              className="flex-1 justify-start gap-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="ml-1 h-4 w-4" />
              退出登录
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="flex-1 justify-start gap-2 text-muted-foreground hover:bg-primary/10 hover:text-primary"
              onClick={() => navigate("/login")}
            >
              <LogIn className="ml-1 h-4 w-4" />
              登录
            </Button>
          )}
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-6 md:hidden">
          <h1 className="text-xl font-bold">启慧智学管理平台</h1>
          <ThemeToggle />
        </header>

        <div className="flex-1 overflow-y-auto bg-background p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
