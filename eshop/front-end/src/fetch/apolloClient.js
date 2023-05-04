import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://trucker-shop.hasura.app/v1/graphql',
    headers: {
        'x-hasura-admin-secret': `QEYd5K56Au0lCAEO78Ywfi2qqY7JeV8iihk7UZII5NCBwMMgcp20t4pm7d5hoGYz`,
    }, // replace with your GraphQL API endpoint
    cache: new InMemoryCache(),
});

export default client;
