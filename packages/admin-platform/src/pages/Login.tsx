import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Lock, User, LogIn, ShieldAlert } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { adminLogin, getCaptcha } from "../api/auth"
import { useUserStore } from "../store/userStore"
import { toast } from "sonner"
import clsx from "clsx"
import { twMerge } from "tailwind-merge"
import { ThemeToggle } from "../components/ThemeToggle"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [captcha, setCaptcha] = useState("")
  const [captchaKey, setCaptchaKey] = useState("")
  const [captchaImage, setCaptchaImage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setToken } = useUserStore()

  const refreshCaptcha = async () => {
    try {
      const data = await getCaptcha()
      if (data && data.base64Image) {
        setCaptchaImage(data.base64Image)
        setCaptchaKey(data.key)
        setCaptcha("")
      }
    } catch {
      toast.error("获取验证码失败，请重试")
    }
  }

  useEffect(() => {
    let ignore = false
    const initCaptcha = async () => {
      try {
        const data = await getCaptcha()
        if (!ignore && data && data.base64Image) {
          setCaptchaImage(data.base64Image)
          setCaptchaKey(data.key)
        }
      } catch {
        if (!ignore) toast.error("获取验证码失败，请重试")
      }
    }
    initCaptcha()
    return () => {
      ignore = true
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !captcha)
      return toast.error("请填写账号、密码和验证码")

    setLoading(true)
    try {
      const response = await adminLogin({
        account: email,
        password,
        captcha,
        captchaKey,
      })
      setToken(response.token)
      toast.success("欢迎回来，管理员")
      navigate("/")
    } catch {
      toast.error("凭证无效")
      refreshCaptcha()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="absolute top-4 right-4 md:top-8 md:right-8">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md border-none bg-card shadow-2xl">
        <CardHeader className="space-y-4 pb-8">
          <div className="mx-auto mb-2 flex h-20 w-max items-center justify-center">
            <img
              src="/logo_light.png"
              alt="Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <CardTitle className="text-center text-3xl font-bold tracking-tight text-foreground">
            启慧智学管理平台
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="ml-1 text-sm font-semibold text-muted-foreground"
              >
                邮箱
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  className="border-input bg-background py-6 pl-11 shadow-sm focus-visible:ring-primary"
                  placeholder="请输入账号"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <User className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="ml-1 flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-muted-foreground"
                >
                  密码
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="border-input bg-background py-6 pl-11 shadow-sm focus-visible:ring-primary"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="captcha"
                className="ml-1 text-sm font-semibold text-muted-foreground"
              >
                验证码
              </Label>
              <div className="flex space-x-3">
                <div className="relative flex-1">
                  <Input
                    id="captcha"
                    type="text"
                    className="border-input bg-background py-6 pl-11 shadow-sm focus-visible:ring-primary"
                    placeholder="请输入验证码"
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                  />
                  <ShieldAlert className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
                {captchaImage && (
                  <img
                    src={captchaImage}
                    alt="验证码"
                    onClick={refreshCaptcha}
                    className="h-12 w-32 cursor-pointer rounded-md object-cover shadow-sm transition-transform active:scale-95"
                  />
                )}
              </div>
            </div>

            <Button
              type="submit"
              className={twMerge(
                "w-full py-6 text-lg font-semibold tracking-wide shadow-md transition-all duration-200",
                loading
                  ? "cursor-not-allowed opacity-75"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg active:scale-95"
              )}
            >
              <LogIn
                className={clsx("mr-2 h-5 w-5", loading && "animate-spin")}
              />
              {loading ? "正在登录..." : "登录"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-sm font-medium text-muted-foreground">
        © 2026 启慧智学项目
      </div>
    </div>
  )
}
