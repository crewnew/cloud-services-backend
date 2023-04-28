import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'https://trucker-shop.hasura.app/v1/graphql',
  headers: {
    'x-hasura-admin-secret': `QEYd5K56Au0lCAEO78Ywfi2qqY7JeV8iihk7UZII5NCBwMMgcp20t4pm7d5hoGYz`,
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
