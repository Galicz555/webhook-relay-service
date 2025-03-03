export interface ReqError extends Error {
  message: string
  status: number
}
