import { createApp, h, provide } from 'vue'
import { createAuth0 } from '@auth0/auth0-vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink
} from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'

import router from './router'
import App from './App.vue'

import 'virtual:windi-base.css'
import 'virtual:windi-components.css'
import './styles/main.css'
import 'virtual:windi-utilities.css'

// only for dev purposes
import 'virtual:windi-devtools'

const auth0 = createAuth0({
  domain: import.meta.env.VITE_AUTH_DOMAIN,
  clientId: import.meta.env.VITE_AUTH_CLIENT_ID,
  authorizationParams: {
    redirect_uri: new URL('/callback', window.location.origin).toString(),
    audience: import.meta.env.VITE_AUTH_AUDIENCE
  }
})

const link = createHttpLink({
  uri: import.meta.env.VITE_HASURA_GRAPHQL_ENDPOINT,
  fetch: async (uri, req) => {
    if (!req) throw new Error('RequestInit is not defined.')

    const token = await auth0.getAccessTokenSilently()
    const headers = new Headers(req.headers)

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)

      headers.set('X-Hasura-Role', auth0.isAuthenticated ? 'user' : 'public')
      headers.set('X-Hasura-User-Id', auth0.user.value.sub ?? '')
    }

    req.headers = headers

    return fetch(uri, req)
  }
})

const cache = new InMemoryCache()

const client = new ApolloClient({
  link,
  cache
})

const app = createApp({
  setup() {
    provide(DefaultApolloClient, client)
  },

  render: () => h(App)
})

app.use(auth0)
app.use(router)

app.mount('#app')
