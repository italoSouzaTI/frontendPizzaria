import { Children, createContext, ReactNode, useState } from 'react';
import { destroyCookie, setCookie, parseCookies } from 'nookies';
import {toast} from 'react-toastify'
import Router from 'next/router'
import { api } from '../services/apiClient';
type AuthContextData = {
    user: UserProps;
    isAuthencticated: boolean;
    signIn: (credentials: SignProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
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
type SignUpProps = {
    name: string;
    email: string;
    password: string;
}
type AuthProviderProps = {
    children: ReactNode;
}
export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
    try {
        destroyCookie(undefined, '@nextauth.token');
        toast.success('Deslogado com sucesso');
        Router.push('/')
    } catch (error) {
        toast.error('Error ao deslogar');
        console.log('Error ao deslogar');
    }
}
async function signUp({ name, email, password }: SignUpProps) {
    const data = {
        name, email, password
    }
    try {
        const response = await api.post('/users', data)
        toast.success('Cadastardo com sucesso');
        Router.push('/')
    } catch (error) {
        toast.error('Error ao cadastrar');
        console.log('Error ao cadastrar', error)
    }
}
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>();
    const isAuthencticated = !!user;

    async function signIn({ email, password }: SignProps) {
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
            toast.success('Logado com sucesso');
            //redirecionar o user apra Dashboard
            Router.push('dashboard');
        } catch (error) {
            toast.error('Error ao acessar');
            console.log('error acessar api', error)
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthencticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}