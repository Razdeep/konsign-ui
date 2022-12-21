import React, { FC, ReactNode } from 'react';
import { useAuth } from '../context/AuthProvider';
import { Navigate } from 'react-router-dom';

interface Intf {
    children: ReactNode
}

const RequireAuth: FC<Intf> = ({ children }) => {

    const auth = useAuth()

    if (!auth.user) {
        return <Navigate to='/login'></Navigate>
    }

    return <>{children}</>
}

export default RequireAuth;