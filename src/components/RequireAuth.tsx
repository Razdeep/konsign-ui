import type { FC, ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

interface RequireAuthProps {
  children: ReactNode
}

const RequireAuth: FC<RequireAuthProps> = ({ children }) => {
  const auth = useAuth()

  if (!auth.user) {
    return <Navigate to="/login"></Navigate>
  }

  return <>{children}</>
}

export default RequireAuth
