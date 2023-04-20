import { createRouter, createWebHistory } from 'vue-router'
import Home from '~/pages/home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/callback',
      redirect: '/'
    },
    {
      path: '/',
      name: 'home',
      component: Home
    }
  ]
})

export default router
