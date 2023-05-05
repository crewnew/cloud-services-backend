import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { getCart } from '../fetch/index.js';
import { deleteProductFromCart } from '../fetch/index.js';

function CartDetail() {
    const router = useRouter();
    const [cart, setCart] = useState(null);

    useEffect(() => {
        getCart(1)
            .then((data) => {
                setCart(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleDelete = async (orderId, productId) => {
        console.log('delete', orderId, productId);
        await deleteProductFromCart(orderId, productId);
        setCart((prevCart) => {
            const updatedOrderProducts = prevCart.order_proucts.filter(
                (op) => op.prouct.id !== productId
            );
            return {
                ...prevCart,
                order_proucts: updatedOrderProducts,
            };
        });
    };

    const cartProducts = cart && cart.order_proucts ? cart.order_proucts.reduce((acc, orderProduct) => {
        const existingProduct = acc.find((product) => product.id === orderProduct.prouct.id);
        if (existingProduct) {
            acc.forEach((product) => {
                if (product.id === orderProduct.prouct.id) {
                    product.quantity += 1;
                }
            });
        } else {
            acc.push({ ...orderProduct.prouct, quantity: 1 });
        }
        return acc;
    }, []) : [];

    const handleCheckout = () => {
        const cartData = cart.id;
        router.push({
            pathname: '/checkout',
            query: { cart: cartData },
        });
    };

    const cartTotal = cartProducts.reduce((acc, product) => {
        return acc + product.price * product.quantity;
    }, 0);

    return (
        <div>
            <h1>Cart</h1>
            {cart ? (
                <List
                    itemLayout="horizontal"
                    dataSource={cartProducts}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Button
                                    type="danger"
                                    onClick={() => handleDelete(cart.id, item.id)}
                                >
                                    Delete
                                </Button>,
                            ]}
                        >
                            <List.Item.Meta
                                title={item.name}
                                description={`Quantity: ${item.quantity} - Price: ${item.price}`}
                            />
                        </List.Item>
                    )}
                />
            ) : (
                <p>Loading cart data...</p>
            )}



            <p> Cart Total: ${cartTotal}</p>

            {cart && cart.order_proucts.length > 0 && (
                <Button
                    type="primary"
                    onClick={(handleCheckout)}
                    style={{ marginTop: '20px' }}
                >
                    Go to Checkout
                </Button>
            )}
        </div>
    );
}

export default CartDetail;
