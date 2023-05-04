export async function createNewCart(productId, userId) {
    const response = await fetch('https://trucker-shop.hasura.app/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': `QEYd5K56Au0lCAEO78Ywfi2qqY7JeV8iihk7UZII5NCBwMMgcp20t4pm7d5hoGYz`,
        },
        body: JSON.stringify({
            query: `
          mutation MyMutation($productId: Int!, $userId: Int!) {
            insert_order_one(object: {
              status: "cart",
              user_id: $userId,
              order_proucts: {
                data: {
                  prouct_id: $productId
                }
              }
            }) {
              id
              order_proucts {
                prouct {
                  name
                  price
                }
              }
            }
          }
        `,
            variables: {
                userId: userId,
                productId: productId,
            },
        }),
    });

    const result = await response.json();
    return result.data.insert_order_one;
}
