/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ApiError, bankApi } from '@/api/client'
import type { User } from '@/types/bank'

const TOKEN_KEY = 'dinero_access_token'

interface AuthContextValue {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(Boolean(token))

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    if (!token) {
      return
    }
    bankApi.me(token)
      .then(setUser)
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 401) logout()
      })
      .finally(() => setLoading(false))
  }, [token, logout])

  const login = useCallback(async (email: string, password: string) => {
    const result = await bankApi.login(email, password)
    sessionStorage.setItem(TOKEN_KEY, result.access_token)
    setToken(result.access_token)
    setUser(await bankApi.me(result.access_token))
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    await bankApi.register(name, email, password)
  }, [])

  const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading, login, register, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
