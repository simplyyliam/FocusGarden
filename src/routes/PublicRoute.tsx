import { useAuth } from "@/auth"
import type { JSX } from "react"
import { Navigate } from "react-router-dom"

export function PublicRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  if (user) {
    return <Navigate to="/sessio" replace />
  }

  return children
}