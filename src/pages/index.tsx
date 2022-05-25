import Head from 'next/head';
import Image from 'next/Image';
import styles from '../../styles/home.module.scss';

import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import LogoImage from '../../public/logo.svg'
export default function Home() {
  return (

    <>
      <Head>
        <title>
          titulo head
        </title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={LogoImage} alt="Logo sujeito pizza" />
        <div className={styles.login}>
          <form action="">
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
              Acessar
            </Button>
          </form>
          <a className={styles.text}>Não possi uma conta? Cadastre-se</a>
        </div>
      </div>
    </>
  )
}
