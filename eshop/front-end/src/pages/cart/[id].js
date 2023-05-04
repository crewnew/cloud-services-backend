import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { getCart } from '../../fetch/getCart.js';
import { deleteProductFromCart } from '../../fetch/deleteProductFromCart.js';

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

  const handleDelete = async (orderId, productId) => {
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

  return (
    <div>
      <h1>Cart {id}</h1>
      {cart ? (
        <List
          itemLayout="horizontal"
          dataSource={cart.order_proucts}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  type="danger"
                  onClick={() =>
                    handleDelete(cart.id, item.prouct.id)
                  }
                >
                  Delete
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={item.prouct.name}
                description={`Quantity: ${item.quantity} - Price: ${item.prouct.price}`}
              />
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
