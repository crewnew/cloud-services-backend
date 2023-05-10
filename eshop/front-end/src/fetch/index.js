import { gql } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const GRAPHQL_ENDPOINT = 'https://trucker-shop.hasura.app/v1/graphql';
const SUBSCRIPTION_ENDPOINT = 'wss://trucker-shop.hasura.app/v1/graphql';
const subscriptionClient = typeof window !== "undefined"
  ? new SubscriptionClient(SUBSCRIPTION_ENDPOINT, {
    reconnect: true,
    connectionParams: {
      headers: {
        'x-hasura-admin-secret': `QEYd5K56Au0lCAEO78Ywfi2qqY7JeV8iihk7UZII5NCBwMMgcp20t4pm7d5hoGYz`,
      },
    },
  }) : null;

const wsLink =
  typeof window !== "undefined"
    ? new WebSocketLink(subscriptionClient) : null;

const client = new ApolloClient({
  link: wsLink,
  uri: GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

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

export async function createNewCart(userId) {
  const response = await fetch('https://trucker-shop.hasura.app/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': `QEYd5K56Au0lCAEO78Ywfi2qqY7JeV8iihk7UZII5NCBwMMgcp20t4pm7d5hoGYz`,
    },
    body: JSON.stringify({
      query: `
        mutation MyMutation($userId: Int!) {
          insert_order_one(object: {status: "cart", user_id: $userId}) {
            id
          }
        }      
          `,
      variables: {
        userId: userId,
      },
    }),
  });

  const result = await response.json();
  return result.data.insert_order_one.id;
}

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

export async function getCart() {


  const uId = 1;
  const SUBSCRIPTION = gql`
        subscription MySubscription($uId: Int!) {
          order(where: { user_id: { _eq: $uId }, status: { _eq: "cart" }}) {
            id
            order_proucts {
              prouct {
                id
                name
                price
              }
            }
          }
        }
      `;

  return new Promise((resolve, reject) => {
    const subscription = client.subscribe({
      query: SUBSCRIPTION,
      variables: { uId },
    });

    subscription.subscribe({
      next: (data) => {
        resolve(data.data.order[0]);
      },
      error: (error) => {
        console.error('Error getting cart:', error);
        reject(error);
      },
    });
  });
};

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

export async function getProductsByCategory(categoryId) {
  const response = await fetch('https://trucker-shop.hasura.app/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': `QEYd5K56Au0lCAEO78Ywfi2qqY7JeV8iihk7UZII5NCBwMMgcp20t4pm7d5hoGYz`,
    },
    body: JSON.stringify({
      query: `
      query ProductsByCategory($categoryId: Int!) {
        prouct(where: {
          _or: [
            {category: {id: {_eq: $categoryId}}},
            {category: {parent_id: {_eq: $categoryId}}}
          ]
        }) {
          id
          name
          price
          category {
            name
            parent_id
          }
        }
      }
        `,
      variables: {
        categoryId: categoryId,
      },
    }),
  });
  const result = await response.json();
  return result.data.prouct;
}

export async function getProducts() {
  const response = await fetch('https://trucker-shop.hasura.app/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': `QEYd5K56Au0lCAEO78Ywfi2qqY7JeV8iihk7UZII5NCBwMMgcp20t4pm7d5hoGYz`,
    },
    body: JSON.stringify({
      query: `
          query AllProducts {
            prouct {
              id
              name
              price
              category {
                name
                parent_id
              }
            }
          }
        `,
    }),
  });

  const result = await response.json();
  return result.data.prouct;
}

export async function placeOrder(orderId) {
  const response = await fetch('https://trucker-shop.hasura.app/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': `QEYd5K56Au0lCAEO78Ywfi2qqY7JeV8iihk7UZII5NCBwMMgcp20t4pm7d5hoGYz`,
    },
    body: JSON.stringify({
      query: `
            mutation MyMutation($orderId: Int!) {
                update_order(where: {id: {_eq: $orderId}}, _set: {status: "paid"}) {
                  affected_rows
                }
              }                        
        `,
      variables: {
        orderId: orderId,
      },
    }),
  });

  const result = await response.json();
  return result.data;
}

export async function getAllCategories() {
  const response = await fetch('https://trucker-shop.hasura.app/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': `QEYd5K56Au0lCAEO78Ywfi2qqY7JeV8iihk7UZII5NCBwMMgcp20t4pm7d5hoGYz`,
    },
    body: JSON.stringify({
      query: `
            query getAllCategories {
              category {
                id
                name
                parent_id
              }
            }                           
        `,
    }),
  });
  const result = await response.json();
  return result.data.category;
}

const insertUser = async (name, email, firebase_id) => {
  const response = await fetch('https://trucker-shop.hasura.app/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': `QEYd5K56Au0lCAEO78Ywfi2qqY7JeV8iihk7UZII5NCBwMMgcp20t4pm7d5hoGYz`,
    },
    body: JSON.stringify({
      query: `
            mutation InsertUser($name: String!, $email: String!, $firebase_id: String!) {
              insert_users(objects: {name: $name, email: $email, firebase_id: $firebase_id}) {
                affected_rows
              }
            }
                                          
        `,
      variables: {
        name: name,
        email: email,
        firebase_id: firebase_id,
      },
    }),
  });
  const result = await response.json();
  return result.data;
}
export default insertUser;
