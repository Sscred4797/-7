export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD"

export type ApiEndpoint = {
  params?: Record<string, unknown>
  query?: Record<string, unknown>
  body?: unknown
  response: unknown
}

export type ApiSchema = Record<string, Partial<Record<HttpMethod, ApiEndpoint>>>

export type Paths<TSchema extends ApiSchema> = Extract<keyof TSchema, string>

export type ExtractRouteParams<Path extends string> =
  Path extends `${infer _Prefix}:${infer Param}/${infer Rest}`
    ? { [K in Param extends `${infer Key}?` ? Key : Param]: string } & ExtractRouteParams<`/${Rest}`>
    : Path extends `${infer _Prefix}:${infer Param}`
      ? { [K in Param extends `${infer Key}?` ? Key : Param]: string }
      : {}

export type MethodsOf<TSchema extends ApiSchema, Path extends Paths<TSchema>> =
  keyof TSchema[Path] & HttpMethod

export type PathsWithMethod<TSchema extends ApiSchema, Method extends HttpMethod> =
  { [P in Paths<TSchema>]: Method extends keyof TSchema[P] ? P : never }[Paths<TSchema>]

export type ResponseOf<
  TSchema extends ApiSchema,
  Path extends Paths<TSchema>,
  Method extends MethodsOf<TSchema, Path>
> = TSchema[Path][Method] extends { response: infer Response } ? Response : never

type RouteParamsMatch<Path extends string, Params> =
  [ExtractRouteParams<Path>] extends [Params]
    ? [Params] extends [ExtractRouteParams<Path>]
      ? Params
      : never
    : never

type ParamsFor<
  TSchema extends ApiSchema,
  Path extends Paths<TSchema>,
  Method extends MethodsOf<TSchema, Path>
> = TSchema[Path][Method] extends { params: infer P }
  ? RouteParamsMatch<Path, P>
  : ExtractRouteParams<Path>

type QueryProp<Endpoint> = "query" extends keyof Endpoint ? { query?: Endpoint["query"] } : {}

type BodyProp<Endpoint> = "body" extends keyof Endpoint ? { body: Endpoint["body"] } : {}

type ParamsProp<Params> = keyof Params extends never ? {} : { params: Params }

export type RequestConfig<
  TSchema extends ApiSchema,
  Path extends Paths<TSchema>,
  Method extends MethodsOf<TSchema, Path>
> = TSchema[Path][Method] extends infer Endpoint
  ? ParamsProp<ParamsFor<TSchema, Path, Method>> & QueryProp<Endpoint> & BodyProp<Endpoint>
  : never
