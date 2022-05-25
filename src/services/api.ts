import axios, { AxiosError } from 'axios';
import { parseCookies } from 'nookies';
import { AuthTokenError } from './erros/AuthTokenError'

import { signOut } from '../contetxs/AuthContext'

export function setupAPIClient (ctx = undefined) {
    let cookies = parseCookies(ctx);
    const api = axios.create({
        baseURL: 'http://localhost:3333',
        headers: {
            Authorization: `Bearer ${cookies['@nextauth.token']}`
        }
    });
    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError) => {
        if (error.response.status === 401) {
            //deslogar usuário
            if (typeof window !== undefined) {
                //chama fn de deslogar
                signOut()
            } else {
                return Promise.reject(new AuthTokenError);
            }
        }
        return Promise.reject(error);
    })
    return api;
}
