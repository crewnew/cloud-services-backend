import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { List } from 'antd';
import { getCart } from '../../fetch/getCart.js';

function CartDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [cart, setCart] = useState(null);

    useEffect(() => {
        if (id) {
            getCart(id)
                .then((data) => {
                    setCart(data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [id]);

    return (
        <div>
            <h1>Cart {id}</h1>
            {cart ? (
                <List
                    itemLayout="horizontal"
                    dataSource={cart.order_proucts}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta title={item.prouct.name} description={`Quantity: ${item.quantity} - Price: ${item.prouct.price}`} />
                        </List.Item>
                    )}
                />
            ) : (
                <p>Loading cart data...</p>
            )}
        </div>
    );
}

export default CartDetail;
