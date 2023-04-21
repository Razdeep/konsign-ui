import { createContext, FC, ReactNode, useContext, useState } from 'react'
import React from 'react'
import User from '../model/User';

const AuthContext = createContext<any>(null)

interface Intf {
    children: ReactNode
}

export const AuthProvider: FC<Intf> = ({ children }) => {

    const [user, setUser] = useState<User | null>(null);

    const login = (user: User) => {
        setUser(user)
    }

    const logout = () => {
        setUser(null)
    }

    return <AuthContext.Provider value={{user, login, logout}} >
                {children}
            </AuthContext.Provider>
        
};

export const useAuth = () => {
    return useContext(AuthContext)
}

export default AuthProvider;