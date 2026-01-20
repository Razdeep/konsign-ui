import type { FC, ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'

import type User from '../model/User'

interface AuthContextType {
  user: User | null
  login: (_user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
