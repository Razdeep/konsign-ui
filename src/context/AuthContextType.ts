import type User from '../model/User'

export interface AuthContextType {
  user: User | null
  // eslint-disable-next-line
  login: (_user: User) => void
  logout: () => void
}
