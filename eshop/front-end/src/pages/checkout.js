import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { placeOrder } from '../fetch/index.js';
import { message } from 'antd';
import { Radio, Button } from 'antd';

function Checkout() {
    const [deliveryMethod, setDeliveryMethod] = useState('standard');
    const [paymentMethod, setPaymentMethod] = useState('credit-card');
    const router = useRouter();
    const [cart, setCart] = useState(null);

    useEffect(() => {
        const cartId = router.query.cart;
        if (cartId) {
            const cId = JSON.parse(cartId);
            setCart(cId);
        }
    }, [router.query.cart]);

    const handleDeliveryMethodChange = (e) => {
        setDeliveryMethod(e.target.value);
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement submission of order data
    };

    const handlePlaceOrder = async () => {
        const cartId = cart;
        await placeOrder(cartId);
        message.success('Your order has been successfully placed');
        router.push('/');
    };

    return (
        <div>
            <h1>Checkout</h1>
            <form onSubmit={handleSubmit}>
                <h2>Delivery Method</h2>
                <Radio.Group onChange={handleDeliveryMethodChange} value={deliveryMethod}>
                    <Radio value="standard">Standard (3-5 business days)</Radio>
                    <Radio value="express">Express (1-2 business days)</Radio>
                </Radio.Group>
                <h2>Payment Method</h2>
                <Radio.Group onChange={handlePaymentMethodChange} value={paymentMethod}>
                    <Radio value="credit-card">Credit Card</Radio>
                    <Radio value="paypal">PayPal</Radio>
                </Radio.Group>
                <Button type="primary" htmlType="submit" onClick={handlePlaceOrder}>Place Order</Button>
            </form>
        </div>
    );
}

export default Checkout;
