import { useEffect, useState } from 'react';
import { fetchProducts } from '../fetch/fetchProducts';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const goToProduct = (id) => {
    router.push(`/product/${id}`);
  };

  if (isLoading) return <div><p>Loading...</p></div>;
  if (error) return <p>Error: {error.message}</p>;
  if (products.length === 0) return <div><p>No data found</p></div>;

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id} onClick={() => goToProduct(product.id)}>
            {product.name} - {product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
