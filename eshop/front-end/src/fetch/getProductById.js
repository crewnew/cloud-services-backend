export async function getProductById(pId) {
  const response = await fetch('https://trucker-shop.hasura.app/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': `QEYd5K56Au0lCAEO78Ywfi2qqY7JeV8iihk7UZII5NCBwMMgcp20t4pm7d5hoGYz`,
    },
    body: JSON.stringify({
      query: `
          query ProductById($id: Int!) {
            prouct(where: { id: { _eq: $id } }) {
              id
              name
              price
              description
              category {
                name
                parent_id
              }
            }
          }
        `,
      variables: {
        id: pId,
      },
    }),
  });

  const result = await response.json();
  return result.data.prouct[0];
}
