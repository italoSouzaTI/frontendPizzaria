import { useState, ChangeEvent } from 'react'
import Head from 'next/head';
import { Header } from '../../components/header'
import styles from './styles.module.scss';
import { setupAPIClient } from '../../services/api'
import { canSSRAuth } from '../../utils/canSSRAuth'
import { FiUpload } from 'react-icons/fi'

type ItemProps = {
    id: string;
    name: string
}

interface ICategoryProps {
    categoryList: ItemProps[];
}

export default function Product ({ categoryList }: ICategoryProps) {
    const [avatarUrl, setAvatarurl] = useState('');
    const [imageAvatar, setImageAvatar] = useState(null);
    const [categories, setCategories] = useState(categoryList || []);
    const [categorySelected, setCategorySelected] = useState('');

    function handleFile (event: ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) {
            return
        }
        const image = event.target.files[0];

        if (!image) {
            return;
        }
        if (image.type === 'image/jpeg' || image.type === 'image/png') {
            setImageAvatar(image);
            setAvatarurl(URL.createObjectURL(event.target.files[0]));
        }
    }
    // Seleciona nova categoria na lista
    function handleChangeCategory (event) {
        setCategorySelected(event.target.value)
    }
    return (
        <>
            <Head>
                <title>Novo produto - Sujeito Pizzaria</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <h1>Novo produto</h1>
                    <form action="" className={styles.form}>

                        <label className={styles.labelAvatar}>
                            <span>
                                <FiUpload size={30} color="#fff" />
                            </span>
                            <input onChange={handleFile} type="file" accept='image/png, image/jpeg' />
                            {
                                avatarUrl && (
                                    <img
                                        className={styles.preview}
                                        src={avatarUrl}
                                        alt="Foto do produto"
                                        width={250}
                                        height={250}
                                    />
                                )
                            }
                        </label>

                        <select value={categorySelected} onChange={handleChangeCategory}>
                            <option value="" disabled>Selecione</option>
                            {
                                categories.map((item, index) => {
                                    return (
                                        <option
                                            key={item.id}
                                            value={index}>
                                            {item.name}
                                        </option>
                                    )
                                })
                            }

                        </select>
                        <input type="text"
                            placeholder='Digite o nome do produto'
                            className={styles.input}
                        />
                        <input type="text"
                            placeholder='Preço do produto'
                            className={styles.input}
                        />
                        <textarea
                            placeholder='Descreve seu produto...'
                            className={styles.input}
                        />
                        <button
                            type='submit'
                            className={styles.buttonAdd}
                        >
                            Cadastrar
                        </button>
                    </form>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apliClient = setupAPIClient(ctx);

    const response = await apliClient.get('/category');

    // console.log(response.data);
    return {
        props: {
            categoryList: response.data
        }
    }
})