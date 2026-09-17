import { createRouter, createWebHistory } from 'vue-router'
import StudentsView from '../views/StudentsView.vue'

const routes = [
  { path: '/', redirect: '/students' },
  { path: '/students', component: StudentsView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router