/**
 * GRPC的请求封装
 * @param grpcFun GRPC方法
 * @param json 请求参数
 */
export async function grpcRequest(grpcFun: Function, json: object) {
  try {
    return await grpcFun(json)
  } catch (e) {
    throw new Error(e)
  }
}
