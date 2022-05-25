import Head from 'next/head';
import Image from 'next/Image';
import Link from 'next/link'
import styles from '../../../styles/home.module.scss';

import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import LogoImage from '../../../public/logo.svg'
export default function Signup () {
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
                    <form action="">
                        <Input
                            placeholder="Digite seu Nome"
                            type="text"
                        />
                        <Input
                            placeholder="Digite seu email"
                            type="text"
                        />
                        <Input
                            placeholder="Sua Senha"
                            type="password"
                        />
                        <Button
                            type="submit"
                            loading={false}
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
