export type ResponseStatus = "success" | "error"

export interface BaseResponse<T> {
  status: ResponseStatus
  msg: string
  data?: T
}
