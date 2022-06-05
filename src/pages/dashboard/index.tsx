import { useState } from 'react'
import { canSSRAuth } from '../../utils/canSSRAuth'
import Head from 'next/head'
import styles from './styles.module.scss'
import { Header } from '../../components/header'
import { FiRefreshCcw } from 'react-icons/fi'
import { setupAPIClient } from '../../services/api'
import Modal from 'react-modal';
import { ModalOrder } from '../../components/ModalOrder'

type OrderProps = {
    id: string,
    table: string | number,
    status: boolean,
    draft: boolean,
    name: string | null,
    created_at: string,
    updated_at: string,
    created_an: string,
}
interface HomeProps {
    orders: OrderProps[];
}
export type OrderItemProps = {
    id: string,
    amount: number,
    order_id: string,
    product_id: string,
    product: {
        id: string,
        name: string,
        description: string,
        price: string,
        banner: string,
    }
    order: OrderProps[];
}

export default function Dashboard ({ orders }: HomeProps) {
    const [orderList, setOrdersList] = useState(orders || []);
    const [modalItem, setModalItem] = useState<OrderItemProps[]>();
    const [modalVisible, setModalVisible] = useState(false);

    function handleCloseModal () {
        setModalVisible(false);
    }

    async function handleOpenModalView (id: string) {
        const apiClient = setupAPIClient();
        try {
            const response = await apiClient.get('/order/detail', {
                params: {
                    order_id: id
                }
            })
            setModalItem(response.data);
            setModalVisible(true);
        } catch (error) {

        }
    }
    Modal.setAppElement('#__next');

    async function handleFinishItem (id: string) {
        const apiClient = setupAPIClient();
        await apiClient.put('/order/finish', {
            order_id: id
        })
        const response = await apiClient.get('/orders');
        setOrdersList(response.data);
        setModalVisible(false);
    }
    async function handleRefreshOrders () {
        const apiClient = setupAPIClient();
        const response = await apiClient.get('/orders');
        setOrdersList(response.data);
    }
    return (
        <>
            <Head>
                <title>Painel -  Sujeito Pizaria</title>
            </Head>
            <Header />
            <main className={styles.container}>
                <div className={styles.containerHeader}>
                    <h1>{orderList.length > 0 ? 'Últimos pedidos' : 'Nenhum pedido lançado'}</h1>
                    <button onClick={handleRefreshOrders}>
                        <FiRefreshCcw size={25} color="#3fffa3" />
                    </button>
                </div>
                <article className={styles.listOrders}>
                    {orderList.map(item => (
                        <section key={item.id} className={styles.ordemItem}>
                            <button onClick={() => { handleOpenModalView(item.id) }}>
                                <div className={styles.tag}></div>
                                <span>Mesa {item.table}</span>
                            </button>
                        </section>
                    ))}


                </article>

            </main>

            {modalVisible && (
                <>
                    <ModalOrder
                        isOpen={modalVisible}
                        onRequestClose={handleCloseModal}
                        order={modalItem}
                        handleFinisHorder={handleFinishItem}
                    />
                </>
            )}
        </>
    )
}
export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get('/orders')
    // console.log(response.data)
    return {
        props: {
            orders: response.data
        }
    }
})