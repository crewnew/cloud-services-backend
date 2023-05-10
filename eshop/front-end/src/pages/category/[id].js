import { useState, useEffect } from 'react';
import { Card, Skeleton } from 'antd';
import { getProductsByCategory } from '../../fetch/index.js';
import { useRouter } from 'next/router';

export default function ProductsByCategory({ }) {

    const [products, setProducts] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            getProductsByCategory(id)
                .then((data) => {
                    setProducts(data);
                    setLoading(false);
                })
                .catch((error) => {
                    setError(error);
                    setLoading(false);
                });
        }
    }, [id]);

    // products have many products, we need to sort them by category id which is the same as the id in the url
    // If product parent_id is null then show it first, otherwise show it after the products with the same parent_id


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

    if (products.length === 0) {
        return <div><p>No products found</p></div>;
    }

    return (
        <div>
            {products.map((product) => (
                <Card key={product.id} title={product.name} style={{ background: 'lightgrey', marginBottom: '16px' }}>
                    <Card.Meta
                        title={`Price: $${product.price}`}
                        description={`Category: ${product.category.name}`}
                        style={{ marginBottom: '16px' }}
                    />
                    <Card.Meta
                        description={`Description: ${product.description}`}
                        style={{ marginBottom: '16px' }}
                    />
                </Card>
            ))}
        </div>
    );
}
