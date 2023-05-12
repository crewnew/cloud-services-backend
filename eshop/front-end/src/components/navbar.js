import Link from 'next/link';
import { Menu, Layout } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { Badge, Button, List, Popover, Tooltip, Modal } from 'antd';
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from 'firebase/auth';
import app from '../pages/firebaseConfig';
import { useRouter } from 'next/router';

const { Header } = Layout;

const Navbar = ({ cart }) => {
  const [selectedKey, setSelectedKey] = useState('home');
  const [isCartVisible, setCartVisible] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const auth = getAuth(app);

  const toggleCart = () => {
    setCartVisible(!isCartVisible);
  };

  const handleGoToCart = () => {
    router.push(`/cart`);
  };

  const handleLogoutClick = () => {
    Modal.confirm({
      title: 'Are you sure you want to logout?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        // Firebase logout
        auth.signOut();
        router.push('/');
      },
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

  const cartTotal = cartProducts.reduce((acc, product) => {
    return acc + product.price * product.quantity;
  }, 0);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <Header>
      <Menu theme="dark" mode="horizontal" selectedKeys={[selectedKey]} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Menu.Item key="logo">
          <Link href="/">
            <span>Back to Homepage</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="home">
          <Link href="/">
            <span>Home</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="products">
          <Link href="/products">
            <span>Products</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="about">
          <Link href="/about">
            <span>About</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="cart" style={{ alignSelf: 'center' }}>
          <Popover
            visible={isCartVisible}
            onVisibleChange={toggleCart}
            overlayStyle={{ width: '200px' }}
            content={
              <div>
                {cartProducts.length > 0 ? (
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
        </Menu.Item>
        {user ? (
          <Menu.Item key="profile" style={{ alignSelf: "center" }}>
            <Tooltip title="Logout?">
              <Button onClick={handleLogoutClick}>
                {user.email}
              </Button>
            </Tooltip>
          </Menu.Item>
        ) : (
          <Menu.Item key="login" style={{ alignSelf: "center" }}>
            <Link href="/login">
              <span>
                <Button icon={<UserOutlined />} style={{ marginLeft: 10 }}>
                  Login / Register
                </Button>
              </span>
            </Link>
          </Menu.Item>
        )}
      </Menu>
    </Header>
  );
};

export default Navbar;
