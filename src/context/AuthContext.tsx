import React, { createContext, useContext, useState, useEffect } from 'react';

interface Teacher {
    id: number;
    email: string;
    fullName: string;
    school?: string;
    subject?: string;
}

interface AuthContextType {
    teacher: Teacher | null;
    token: string | null;
    login: (token: string, teacherData: Teacher) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Recuperar datos de sesión al cargar
        const storedToken = localStorage.getItem('token');
        const storedTeacher = localStorage.getItem('teacher');
        
        if (storedToken && storedTeacher) {
            setToken(storedToken);
            setTeacher(JSON.parse(storedTeacher));
        }
    }, []);

    const login = (newToken: string, teacherData: Teacher) => {
        setToken(newToken);
        setTeacher(teacherData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('teacher', JSON.stringify(teacherData));
    };

    const logout = () => {
        setToken(null);
        setTeacher(null);
        localStorage.removeItem('token');
        localStorage.removeItem('teacher');
    };

    return (
        <AuthContext.Provider value={{
            teacher,
            token,
            login,
            logout,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}
