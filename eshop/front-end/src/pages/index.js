import { useEffect, useState } from 'react';
import { getProducts, getCart, addProductToCart, createNewCart, getAllCategories } from '../fetch/index.js';
import { useRouter } from 'next/router';
import { List, Card, Skeleton, Layout, Menu, Badge, Button, Popover } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import CategorySelect from '../components/categorySelect';
import Link from 'next/link';
import Navbar from '@/components/navbar.js';


const { Header, Footer } = Layout;

export default function Home() {
  const [isCartVisible, setCartVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(null);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    categoryMap();
  }, []);

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

  function categoryMap() {
    // Get the categories from the API
    getAllCategories()
      .then((data) => {
        const categoryMap = {};
        data.forEach((category) => {
          if (!category.parent_id) {
            categoryMap[category.id] = { name: category.name, subcategories: {} };
          } else {
            const parentCategory = categoryMap[category.parent_id];
            parentCategory.subcategories[category.id] = { name: category.name };
          }
        });
        console.log(categoryMap);
        setCategories(categoryMap);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleCategoryChange = (value) => {
    if (value) {
      router.push(`/category/${value}`);
    } else {
      router.push(`/`);
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
      <Navbar />
      <CategorySelect categories={categories} onChange={handleCategoryChange} />
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
