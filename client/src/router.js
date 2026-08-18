import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/jouer', name: 'game', component: () => import('./views/GameView.vue') },
  { path: '/admin', name: 'admin', component: () => import('./views/AdminView.vue') }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
