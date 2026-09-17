import { createRouter, createWebHistory } from 'vue-router'
// We will create these views in the next steps
const routes = [
  { path: '/', redirect: '/students' },
  // Add routes here later
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router