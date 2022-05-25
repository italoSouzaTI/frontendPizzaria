import { Children, createContext, ReactNode, useState } from 'react';
import { destroyCookie, setCookie, parseCookies } from 'nookies';
import Router from 'next/router'
import { api } from '../services/apiClient';
type AuthContextData = {
    user: UserProps;
    isAuthencticated: boolean;
    signIn: (credentials: SignProps) => Promise<void>;
    signOut: () => void;
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

export function signOut () {
    try {
        destroyCookie(undefined, '@nextauth.token');
        Router.push('/')
    } catch (error) {
        console.log('Error ao deslogar');
    }
}

export function AuthProvider ({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>();
    const isAuthencticated = !!user;

    async function signIn ({ email, password }: SignProps) {
        const data = {
            email, password
        }
        try {
            const response = await api.post('/session', data)
            const { id, name, token } = response.data;
            //Cookie
            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60824 * 30, //Expirrar em 1 mês;
                path: '/' //Quais rotas tem acesso ao token;
            });
            setUser({
                id,
                name,
                email
            })
            //Parra para prox. req. o token
            api.defaults.headers['Authorization'] = `Bearer ${token}`;
            //redirecionar o user apra Dashboard
            Router.push('dashboard');
        } catch (error) {
            console.log('error acessar api', error)
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthencticated, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}