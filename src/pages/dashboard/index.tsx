import { canSSRAuth } from '../../utils/canSSRAuth'
import Head from 'next/head'

import { Header } from '../../components/header'
export default function Dashboard () {
    return (
        <>
            <Head>
                <title>Painel -  Sujeito Pizaria</title>
            </Head>
            <Header />
            <div>
                <h1>bem vindo ao painel</h1>
            </div>
        </>
    )
}
export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})