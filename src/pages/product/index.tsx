import { useState, ChangeEvent, FormEvent } from 'react'
import Head from 'next/head';
import { Header } from '../../components/header'
import styles from './styles.module.scss';
import { setupAPIClient } from '../../services/api'
import { canSSRAuth } from '../../utils/canSSRAuth'
import { FiUpload } from 'react-icons/fi'
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

type ItemProps = {
    id: string;
    name: string
}

interface ICategoryProps {
    categoryList: ItemProps[];
}

export default function Product ({ categoryList }: ICategoryProps) {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
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
    async function handleRegister (event: FormEvent) {
        event.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            if (name === '' || price === '' || description === '' || imageAvatar === null) {
                toast.error('Preencha todos os campos');
                return;
            }
            data.append('name', name);
            data.append('price', price);
            data.append('description', description);
            data.append('category_id', categories[categorySelected].id);
            data.append('file', imageAvatar);
            const apiClient = setupAPIClient();
            await apiClient.post('/product', data);
            toast.success('Cadastrado com sucesso');

        } catch (error) {
            console.log(error);
            toast.error('Error ao cadastrar')
        } finally {
            setLoading(false)
        }
        clearCampo();

    }
    function clearCampo () {
        setName('')
        setPrice('')
        setDescription('')
        setAvatarurl(null)
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
                    <form onSubmit={handleRegister} className={styles.form}>

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
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input type="text"
                            placeholder='Preço do produto'
                            className={styles.input}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <textarea
                            placeholder='Descreve seu produto...'
                            className={styles.input}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <button
                            type='submit'
                            className={styles.buttonAdd}
                        >
                            {loading ? (
                                <FaSpinner color="#fff" size={16} />
                            ) : (
                                <p>Cadastrar</p>
                            )}

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