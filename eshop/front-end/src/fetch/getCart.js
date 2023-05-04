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

export const getCart = () => {
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
