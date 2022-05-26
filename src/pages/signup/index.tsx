import { useState, FormEvent, useContext } from 'react'
import {toast} from 'react-toastify'

import Head from 'next/head';
import Image from 'next/Image';
import Link from 'next/link'
import styles from '../../../styles/home.module.scss';

import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import LogoImage from '../../../public/logo.svg'

import { AuthContext } from '../../contetxs/AuthContext';

export default function Signup() {

    const { signUp } = useContext(AuthContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        if (!name || !password || !email) {
            toast.warning("Preencha todos os campos")
            return;
        }
        setLoading(true);
        let data = {
            name,
            email,
            password
        }
        try {
            const response = await signUp(data)
        } catch (error) {
            toast.error('error ao cadastrar')
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Head>
                <title>
                    Faça seu cadastro agora!
                </title>
            </Head>
            <div className={styles.containerCenter}>
                <Image src={LogoImage} alt="Logo sujeito pizza" />
                <div className={styles.login}>
                    <h1>Criando sua conta</h1>
                    <form onSubmit={handleSubmit}>
                        <Input
                            placeholder="Digite seu Nome"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            placeholder="Digite seu email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            placeholder="Sua Senha"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            loading={loading}
                        >
                            Cadastrar
                        </Button>
                    </form>
                    <Link href="/">
                        <a className={styles.text}>Já possui uma conta? Faça login!</a>
                    </Link>

                </div>
            </div>
        </>
    )
}
