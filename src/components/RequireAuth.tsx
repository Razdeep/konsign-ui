import type { FC, ReactNode } from 'react'
import React from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '../context/AuthProvider'

interface Intf {
  children: ReactNode
}

const RequireAuth: FC<Intf> = ({ children }) => {
  const auth = useAuth()

  if (!auth.user) {
    return <Navigate to="/login"></Navigate>
  }

  return <>{children}</>
}

export default RequireAuth
