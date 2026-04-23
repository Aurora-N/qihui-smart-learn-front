import { useState, useEffect } from "react"
import {
  getForumTags,
  getPostsByTag,
  getPostDetail,
  deletePost,
} from "../api/forum"
import type {
  ForumTagDetail,
  PostOverview,
  PostDetail,
} from "../api/types/forum"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet"
import { Trash2, MessageSquare, Clock } from "lucide-react"
import { toast } from "sonner" // standard toast library

export function ForumManagement() {
  const [tags, setTags] = useState<ForumTagDetail[]>([])
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const [posts, setPosts] = useState<PostOverview[]>([])
  const [loadingPosts, setLoadingPosts] = useState(false)

  const [selectedPost, setSelectedPost] = useState<PostDetail | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  useEffect(() => {
    getForumTags()
      .then((data) => {
        setTags(data)
        if (data.length > 0) setActiveTag(String(data[0].tagId))
      })
      .catch(() => toast.error("加载论坛标签失败"))
  }, [])

  useEffect(() => {
    const fetchPosts = async () => {
      if (!activeTag) return
      setLoadingPosts(true)
      try {
        const res = await getPostsByTag(Number(activeTag))
        setPosts(res.posts || [])
      } catch {
        toast.error("获取标签下帖子时出错")
      } finally {
        setLoadingPosts(false)
      }
    }
    fetchPosts()
  }, [activeTag])

  const handleViewPost = async (postId: number | string) => {
    try {
      const res = await getPostDetail(Number(postId))
      setSelectedPost(res.posts)
      setIsSheetOpen(true)
    } catch {
      toast.error("加载帖子详情失败")
    }
  }

  const handleDelete = async (postId: number | string) => {
    if (!window.confirm("永久删除此帖子？")) return
    try {
      await deletePost(Number(postId))
      toast.success("帖子已删除")
      setPosts(posts.filter((p) => p.postId !== postId))
      setIsSheetOpen(false)
    } catch {
      toast.error("删除帖子失败")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          论坛管理
        </h2>
      </div>

      {tags.length > 0 && (
        <Tabs
          value={activeTag || ""}
          onValueChange={setActiveTag}
          className="w-full"
        >
          <TabsList className="mb-4 flex h-auto flex-wrap bg-muted p-1">
            {tags.map((tag) => (
              <TabsTrigger
                key={tag.tagId}
                value={String(tag.tagId)}
                className="rounded-sm text-sm data-[state=active]:bg-card data-[state=active]:shadow"
              >
                {tag.title}
                <Badge
                  variant="secondary"
                  className="ml-2 h-4 bg-muted text-[10px] leading-none"
                >
                  {tag.postsCount}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Just render the current tab content generically */}
          <Card className="mt-4 overflow-hidden border-border shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>帖子标题</TableHead>
                  <TableHead>作者</TableHead>
                  <TableHead>评论</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingPosts ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-6 text-center text-muted-foreground"
                    >
                      正在加载帖子...
                    </TableCell>
                  </TableRow>
                ) : posts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-6 text-center text-muted-foreground"
                    >
                      此分类下没有帖子
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.postId} className="group">
                      <TableCell className="font-medium text-foreground">
                        {post.title}
                        <div className="mt-1 flex gap-1">
                          {post.tags.map((t) => (
                            <Badge
                              variant="outline"
                              key={t.tagId}
                              className="px-1.5 py-0 text-[10px] leading-tight"
                            >
                              {t.tagName}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {post.author.attributes.userName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MessageSquare className="h-4 w-4" />
                          {post.commentsCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleViewPost(post.postId)}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" /> 查看
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleDelete(post.postId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </Tabs>
      )}

      {/* Post Detail Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[90vw] overflow-y-auto sm:max-w-2xl">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="mt-6 text-2xl leading-tight font-bold">
              {selectedPost?.title}
            </SheetTitle>
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                作者：{" "}
                <strong className="text-foreground">
                  {selectedPost?.author.attributes.userName}
                </strong>
              </span>
              <span>{selectedPost?.createdAt}</span>
              <span>{selectedPost?.likesCount} 喜欢</span>
            </div>
          </SheetHeader>

          {selectedPost && (
            <div className="space-y-8 py-6">
              <div className="prose max-w-none text-sm whitespace-pre-wrap text-muted-foreground">
                {selectedPost.content}
              </div>

              <div className="border-t border-border pt-6">
                <h4 className="mb-4 flex justify-between border-b pb-2 text-lg font-semibold text-foreground">
                  评论 ({selectedPost.commentsCount})
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(selectedPost.postId)}
                  >
                    删除帖子
                  </Button>
                </h4>
                {selectedPost.comments.length > 0 ? (
                  <div className="space-y-6">
                    {selectedPost.comments.map((c) => (
                      <div
                        key={c.commentId}
                        className="flex flex-col gap-1 rounded-lg bg-muted/50 p-4"
                      >
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <strong className="text-foreground">
                            {c.author.attributes.userName}
                          </strong>
                          <span>
                            {c.createdAt} ({c.likesCount} 喜欢)
                          </span>
                        </div>
                        <p className="mt-1 mb-2 text-sm whitespace-pre-wrap text-muted-foreground">
                          {c.content}
                        </p>
                        {c.repliedID && (
                          <Badge
                            variant="outline"
                            className="mt-1 self-start bg-card text-[10px]"
                          >
                            回复 #{c.repliedID}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    暂无评论
                  </p>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
