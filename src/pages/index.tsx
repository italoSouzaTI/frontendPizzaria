import { useContext, FormEvent, useState } from 'react'
import Head from 'next/head';
import Image from 'next/Image';
import Link from 'next/link'
import { AuthContext } from '../contetxs/AuthContext'
import styles from '../../styles/home.module.scss';
import { canSSRGuest } from '../utils/canSSGuest'

import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import LogoImage from '../../public/logo.svg'
export default function Home () {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin (event: FormEvent) {
    event.preventDefault();
    let data = {
      email,
      password
    }
    try {
      const resposne = await signIn(data);
    } catch (error) {
      console.log(error)
    }

  }
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
          <form onSubmit={handleLogin}>
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
              loading={false}
            >
              Acessar
            </Button>
          </form>
          <Link href="/signup">
            <a className={styles.text}>Não possi uma conta? Cadastre-se</a>
          </Link>

        </div>
      </div>
    </>
  )
}
export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})