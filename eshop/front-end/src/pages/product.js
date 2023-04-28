import { useQuery } from 'react-apollo';
import { PRODUCT_BY_ID_QUERY } from '../../schema/schema.graphql';

export default function Product({ productId }) {
  try {
    productId = 1
    const { error, data, loading } = useQuery(PRODUCT_BY_ID_QUERY, {
      variables: { id: parseInt(productId) },
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const product = data;

    return (
      <div>
        <h1>{product?.name}</h1>
        <p>{product?.description}</p>
        <p>{product?.price}</p>
      </div>
    );
  } catch (error) {
    console.log('useQuery error:', error);
    return <div>Error: {error.message}</div>;
  }
}
