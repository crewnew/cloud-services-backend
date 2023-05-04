export async function deleteProductFromCart(orderId, productId) {
    const response = await fetch('https://trucker-shop.hasura.app/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': `QEYd5K56Au0lCAEO78Ywfi2qqY7JeV8iihk7UZII5NCBwMMgcp20t4pm7d5hoGYz`,
        },
        body: JSON.stringify({
            query: `
          mutation MyMutation($orderId: Int!, $productId: Int!) {
            delete_order_prouct(where: {order_id: {_eq: $orderId}, prouct_id: {_eq: $productId}}) {
              affected_rows
            }
          }
        `,
            variables: {
                orderId: orderId,
                productId: productId,
            },
        }),
    });

    const result = await response.json();
    return result.data.delete_order_prouct;
}
