import type { FC, ReactNode } from 'react'
import { useEffect, useState } from 'react'

import type User from '../model/User'
import { type AuthContextType } from './AuthContextType'
import { AuthContext } from './AuthContext'
import type KonsignResponse from '../model/KonsignResponse'
import Config from '../util/config'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
  }

  useEffect(() => {
    bootstrapAuth()
  }, [])

  async function bootstrapAuth() {
    try {
      const response: Response = await fetch(Config.AUTH_REFRESH_URL, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) throw new Error()

      const res: KonsignResponse<User> = await response.json()

      setUser(res.data)
    } catch {
      setUser(null)
    } finally {
      // setLoading(false)
    }
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
