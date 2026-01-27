import { authApi } from "@/api/auth";
import type { User } from "@/types";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (accessToken: string, refreshToken: string, user: User) => void
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem('access_token')
        if (!token) {
            setIsLoading(false)
            return
        }

        try {
            const userData = await authApi.getMe()
            setUser(userData)
        } catch (error) {
            console.error('Failed to refresh user:', error)
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        refreshUser()
    },[refreshUser])

    const login = useCallback((accessToken: string, refreshToken: string, userData: User) => {
        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('refresh_token', refreshToken)
        setUser(userData)
    }, [])

    const logout = useCallback(async () => {
        const refreshToken = localStorage.getItem('refresh_token')
        try {
            if (refreshToken) {
                await authApi.logout(refreshToken)
            } 
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            setUser(null)
        }
    }, [])

    const value : AuthContextType = {
        user, 
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}