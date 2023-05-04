export async function addProductToCart(orderId, productId) {
    const response = await fetch('https://trucker-shop.hasura.app/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': `QEYd5K56Au0lCAEO78Ywfi2qqY7JeV8iihk7UZII5NCBwMMgcp20t4pm7d5hoGYz`,
        },
        body: JSON.stringify({
            query: `
          mutation MyMutation($orderId: Int!, $productId: Int!) {
            insert_order_prouct_one(object: {order_id: $orderId, prouct_id: $productId}) {
                id
                order {
                  order_proucts {
                    prouct {
                      name
                      price
                    }
                  }
                }
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
    return result.data.insert_order_prouct_one.order;
}
