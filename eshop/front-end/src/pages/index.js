import { useQuery } from 'react-apollo';
import { ALL_PRODUCTS_QUERY } from '../../schema/schema.graphql';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const { error, data, loading } = useQuery(ALL_PRODUCTS_QUERY);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      setLoading(false);
    }
  }, [loading]);

  const goToProduct = (id) => {
    router.push(`/product/${id}`);
  };

  if (isLoading) return <div><p>Loading...</p></div>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <div><p>No data found</p></div>;

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {data.prouct.map((product) => (
          <li key={product.id} onClick={() => goToProduct(product.id)}>
            {product.name} - {product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
