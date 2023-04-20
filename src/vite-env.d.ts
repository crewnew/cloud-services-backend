/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />
/// <reference types="@total-typescript/ts-reset" />

interface ImportMetaEnv {
  readonly VITE_AUTH_DOMAIN: string
  readonly VITE_AUTH_CLIENT_ID: string
  readonly VITE_AUTH_AUDIENCE: string
  readonly VITE_HASURA_GRAPHQL_ENDPOINT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
