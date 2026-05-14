import { ApiSchema, RequestConfig, ResponseOf, MethodsOf, Paths } from "./types"

export class ApiClient<TSchema extends ApiSchema> {
  request<
    Path extends Paths<TSchema>,
    Method extends MethodsOf<TSchema, Path>
  >(
    path: Path,
    method: Method,
    ...config: RequestConfig<TSchema, Path, Method> extends {}
      ? [config?: RequestConfig<TSchema, Path, Method>]
      : [config: RequestConfig<TSchema, Path, Method>]
  ): Promise<ResponseOf<TSchema, Path, Method>> {
    const mockUser = {
      id: 1,
      name: "John",
      email: "john@example.com",
    }

    const response =
      path === "/users" && method === "GET"
        ? [mockUser]
        : path === "/users" && method === "POST"
        ? {
            id: 2,
            ...(config[0] as { body: { name: string; email: string } }).body,
          }
        : path === "/users/:id" && method === "GET"
        ? mockUser
        : path === "/users/:id" && method === "PATCH"
        ? {
            id: 1,
            ...(config[0] as { body: { name?: string; email?: string } }).body,
          }
        : path === "/users/:id" && method === "DELETE"
        ? { success: true }
        : undefined

    return Promise.resolve(response as ResponseOf<TSchema, Path, Method>)
  }
}

export const createApiClient = <TSchema extends ApiSchema>() => new ApiClient<TSchema>()
