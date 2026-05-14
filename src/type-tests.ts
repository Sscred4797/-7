import { createApiClient } from "./api-client"
import { ApiSchema } from "./api-schema"

const client = createApiClient<ApiSchema>()

// valid requests
void client.request("/users", "GET", {
  query: {
    page: 1,
  },
})

void client.request("/users", "POST", {
  body: {
    name: "Ann",
    email: "ann@mail.com",
  },
})

void client.request("/users/:id", "GET", {
  params: {
    id: "123",
  },
})

void client.request("/users/:id", "PATCH", {
  params: {
    id: "123",
  },
  body: {
    email: "new@mail.com",
  },
})

// @ts-expect-error DELETE не існує для /users
void client.request("/users", "DELETE", {})

void client.request("/users", "GET", {
// @ts-expect-error body не дозволений для GET /users
  body: {
    name: "John",
  },
})

void client.request("/users/:id", "GET", {
// @ts-expect-error query не дозволений для GET /users/:id
  query: {
    page: 1,
  },
})

void client.request("/users/:id", "GET", {
  params: {
// @ts-expect-error params.id потрібен для /users/:id
    userId: "123",
  },
})

// @ts-expect-error path /unknown не існує
void client.request("/unknown", "GET", {})
