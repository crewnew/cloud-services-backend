import { useEffect, useState } from 'react';
import { getProducts, getCart, addProductToCart, createNewCart } from '../fetch/index.js';
import { useRouter } from 'next/router';
import { List, Card, Skeleton, Layout, Menu, Badge, Button, Popover } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';


const { Header, Footer } = Layout;

export default function Home() {
  const [isCartVisible, setCartVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(null);
  const router = useRouter();

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  // If get cart have new data, update cart state
  useEffect(() => {
    getCart()
      .then((data) => {
        setCart(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [cart]);

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

  const cartTotal = cartProducts.reduce((acc, product) => {
    return acc + product.price * product.quantity;
  }, 0);

  const goToProduct = (id) => {
    router.push(`/product/${id}`);
  };

  const toggleCart = () => {
    setCartVisible(!isCartVisible);
  };

  const handleGoToCart = () => {
    router.push(`/cart`);
  };

  const addToCart = (productId) => {
    if (cart) {
      addProductToCart(cart.id, productId)
        .then((data) => {
          setCart(data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      createNewCart(1)
        .then((data) => {
          addProductToCart(data, productId)
            .then((data) => {
              setCart(data);
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
      </div>
    );
  }

  if (error) return <p>Error: {error.message}</p>;
  if (products.length === 0) return <div><p>No data found</p></div>;

  return (
    <Layout>
      <Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Menu.Item key="1">Home</Menu.Item>
          <Menu.Item key="2">Products</Menu.Item>
          <Menu.Item key="3">About</Menu.Item>
          <Link href="/login">
            <span>Login/Register</span>
          </Link>

          <Menu.Item key="4" style={{ alignSelf: 'center' }}>
          </Menu.Item>
          <Menu.Item key="5" style={{ alignSelf: 'center', marginLeft: 'auto' }}>
            <Popover
              open={isCartVisible}
              onOpenChange={toggleCart}
              overlayStyle={{ width: '200px' }}
              content={
                <div>
                  {cart && cart.order_proucts ? (
                    <List
                      itemLayout="horizontal"
                      dataSource={cartProducts}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta title={item.name} description={`Quantity: ${item.quantity} - Price: ${item.price}`} />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <p>No items in cart</p>
                  )}
                  <p> Cart Total: ${cartTotal}</p>
                </div>
              }
            >
              <Badge count={cart && cart.order_proucts ? cart.order_proucts.length : 0}>
                <Button shape="circle" icon={<ShoppingCartOutlined />} onClick={handleGoToCart} />
              </Badge>
            </Popover>

            <Button icon={<UserOutlined />} style={{ marginLeft: 10 }}>Login / Register</Button>
          </Menu.Item>

        </Menu>
      </Header >
      <div>
        <h1>Products</h1>
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={products}
          renderItem={(product) => (
            <List.Item>
              <Card hoverable onClick={() => goToProduct(product.id)}>
                <Card.Meta title={product.name} description={`$${product.price}`} />
                <Button onClick={(event) => {
                  event.stopPropagation();
                  addToCart(product.id);
                }}>Add to cart</Button>
              </Card>
            </List.Item>
          )}
        />
      </div>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Cool Developer</Footer>
    </Layout >
  );
}
