import { createApiClient } from "./api-client"
import { ApiSchema } from "./api-schema"

const client = createApiClient<ApiSchema>()

async function runDemo() {
  const users = await client.request("/users", "GET", {
    query: {
      page: 1,
      limit: 10,
    },
  })

  const singleUser = await client.request("/users/:id", "GET", {
    params: {
      id: "123",
    },
  })

  const createdUser = await client.request("/users", "POST", {
    body: {
      name: "John",
      email: "john@example.com",
    },
  })

  console.log(users)
  console.log(singleUser)
  console.log(createdUser)
}

void runDemo()
