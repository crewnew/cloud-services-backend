import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Card, Skeleton, Button } from 'antd';
import { getProductById } from '../../fetch/getProductById';

export default function ProductById() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      getProductById(id)
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [id]);

  if (isLoading) {
    return (
      <div>
        <Skeleton active />
        <Skeleton active />
        <Skeleton active />
      </div>
    );
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!product) {
    return <div><p>No data found</p></div>;
  }

  return (
    <Card title={product.name} style={{ background: 'lightgrey' }}>
      <Card.Meta
        title={`Price: $${product.price}`}
        description={`Category: ${product.category.name}`}
        style={{ marginBottom: '16px' }}
      />
      <Card.Meta
        description={`Description: ${product.description}`}
        style={{ marginBottom: '16px' }}
      />
      <Button type="primary" style={{ width: '100%' }}>
        Add to cart
      </Button>
    </Card>
  );
}
