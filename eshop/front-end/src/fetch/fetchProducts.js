export async function fetchProducts() {
    const response = await fetch('https://trucker-shop.hasura.app/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': `QEYd5K56Au0lCAEO78Ywfi2qqY7JeV8iihk7UZII5NCBwMMgcp20t4pm7d5hoGYz`,
        },
        body: JSON.stringify({
            query: `
          query {
            prouct {
              id
              name
              price
            }
          }
        `,
        }),
    });

    const result = await response.json();
    return result.data.prouct;
}
