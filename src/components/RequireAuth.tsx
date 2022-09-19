import React, { FC, ReactNode } from 'react';
import { useAuth } from '../context/AuthProvider';
import { Navigate } from 'react-router-dom';

const RequireAuth: FC<ReactNode> = ({ children }) => {

    const auth = useAuth()

    if (!auth.user) {
        return <Navigate to='/login'></Navigate>
    }

    return <>{children}</>
}

export default RequireAuth;