import Link from 'next/link';
import { Menu, Layout } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Badge, Button, List, Popover } from 'antd';
import { cart, cartTotal } from '../pages/index.js';


const { Header } = Layout;

const Navbar = () => {
  const [selectedKey, setSelectedKey] = useState('home');
  const [isCartVisible, setCartVisible] = useState(false);

  const toggleCart = () => {
    setCartVisible(!isCartVisible);
  };

  let cartProducts = cart && cart.order_proucts ? cart.order_proucts : [];

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
            <Badge count={cartProducts.length}>
              <Button shape="circle" icon={<ShoppingCartOutlined />}  />
            </Badge>
          </Popover>
        </Menu.Item>
        <Menu.Item key="login" style={{ alignSelf: 'center' }}>
          <Link href="/login">
            <span>
              <Button icon={<UserOutlined />} style={{ marginLeft: 10 }}>Login / Register</Button>
            </span>
          </Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default Navbar;
