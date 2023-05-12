import { useEffect, useState } from 'react';
import { getProducts, getCart, addProductToCart, createNewCart, getAllCategories } from '../fetch/index.js';
import { useRouter } from 'next/router';
import { List, Card, Skeleton, Layout, Button } from 'antd';
import CategorySelect from '../components/categorySelect';
import Navbar from '@/components/navbar.js';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from './firebaseConfig';


const { Footer } = Layout;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(null);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const auth = getAuth(app);

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

  useEffect(() => {
    categoryMap();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        getCart(user.uid)
          .then((data) => {
            setCart(data);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        setUser(null);
      }
    });
  }, []);

  const goToProduct = (id) => {
    router.push(`/product/${id}`);
  };

  const productToCart = (cartId, productId) => {
    addProductToCart(cartId, productId)
      .then(() => {
        getCart(user.uid)
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
  };

  const addToCart = (productId) => {
    if (cart) {
      productToCart(cart.id, productId)
    } else {
      createNewCart(user.uid)
        .then((data) => {
          productToCart(data, productId)
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
      <Navbar cart={cart} />
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
