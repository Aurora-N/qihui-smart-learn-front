import { get, post } from "../utils/apiClient"
import type {
  AdminInfo,
  CreateAdminRequest,
  ExamineRequest,
  StatisticsData,
} from "./types/admin"

const BASE_API = "/api/admin"

// 获取管理员列表
export const getAdminList = async () => {
  return await get<AdminInfo[]>(`${BASE_API}/list`)
}

// 创建管理员
export const createAdmin = async (data: CreateAdminRequest) => {
  return await post<void>(`${BASE_API}/create`, data)
}

// 审核
// 注意: 原文档标识 GET /api/admin/examine，但参数放置在 body，因此通过 POST 较为合理
// 视乎后端实现，如果必须使用 GET，可以在 apiClient 加载 params
export const examineContent = async (data: ExamineRequest) => {
  return await post<void>(`${BASE_API}/examine`, data)
}

// 获取数据统计
export const getStatistics = async () => {
  return await get<StatisticsData>(`${BASE_API}/statistics`)
}
