import type User from '../model/User'

export interface AuthContextType {
  user: User | null
  login: (_user: User) => void
  logout: () => void
}
