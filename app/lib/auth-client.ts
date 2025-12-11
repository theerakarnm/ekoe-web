import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL, // The base URL of your auth server
  fetchOptions: {
    credentials: "include", // Required for cross-origin cookie handling
  },
  plugins: [
    adminClient()
  ],
})
