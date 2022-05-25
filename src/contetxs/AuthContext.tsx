import { Children, createContext, ReactNode, useState } from 'react';

type AuthContextData = {
    user: UserProps;
    isAuthencticated: boolean;
    signIn: (credentials: SignProps) => Promise<void>
}
type UserProps = {
    id: string;
    name: string;
    email: string;
}
type SignProps = {
    email: string;
    password: string;
}
type AuthProviderProps = {
    children: ReactNode;
}
export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider ({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>();
    const isAuthencticated = !!user;

    async function signIn () {
        alert('click no login')
    }

    return (
        <AuthContext.Provider value={{ user, isAuthencticated, signIn }}>
            {children}
        </AuthContext.Provider>
    )
}