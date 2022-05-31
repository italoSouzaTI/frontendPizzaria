import { useState, FormEvent } from "react"
import Head from "next/head"
import { Header } from '../../components/header'
import styles from './styles.module.scss'
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";
import { canSSRAuth } from '../../utils/canSSRAuth'
export default function category () {
    const [name, setName] = useState('');
    async function handleRegister (event: FormEvent) {
        event.preventDefault();
        if (name === '') {
            return;
        }
        const apiClient = setupAPIClient();
        await apiClient.post('category', { name });
        toast.success('Categoria cadastrada com sucesso!.');
        setName('');
    }
    return (
        <>
            <Head>
                <title>NovaCategoria - Sujeito Pizzaria</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <h1>Cadastrar categorias</h1>

                    <form onSubmit={handleRegister} className={styles.form}>
                        <input type="text"
                            placeholder="Digite o nome da categoria"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <button
                            className={styles.buttonAdd}
                            type="submit">
                            Cadastrar
                        </button>

                    </form>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    }
})
