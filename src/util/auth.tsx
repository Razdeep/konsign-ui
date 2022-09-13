import { createContext, FC, ReactNode, useContext, useState } from 'react'
import React from 'react'

const AuthContext = createContext<any>(null)

export const AuthProvider: FC<ReactNode> = ({ children }) => {

    const [user, setUser] = useState<String | null>('');

    const login = (user: String) => {
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