import { createBrowserRouter } from "react-router-dom"
import { Dashboard } from "../pages/Dashboard"
import { UserManagement } from "../pages/UserManagement"
import { ForumManagement } from "../pages/ForumManagement"
import { KnowledgeBaseList } from "../pages/KnowledgeBaseList"
import { KnowledgeBaseDetail } from "../pages/KnowledgeBaseDetail"
import { KnowledgeGraph } from "../pages/KnowledgeGraph"
import { Settings } from "../pages/Settings"
import { Login } from "../pages/Login"
import { AdminLayout } from "../widgets/AdminLayout"

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <UserManagement />,
      },
      {
        path: "forum",
        element: <ForumManagement />,
      },
      {
        path: "knowledge-base",
        element: <KnowledgeBaseList />,
      },
      {
        path: "knowledge-base/:id",
        element: <KnowledgeBaseDetail />,
      },
      {
        path: "knowledge-graph",
        element: <KnowledgeGraph />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
])
