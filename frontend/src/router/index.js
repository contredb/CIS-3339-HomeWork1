import { createRouter, createWebHistory } from 'vue-router'
import StudentsView from '../views/StudentsView.vue'
import CoursesView from '../views/CoursesView.vue'
import EnrollmentsView from '../views/EnrollmentsView.vue'

const routes = [
  { path: '/', redirect: '/students' },
  { path: '/students', component: StudentsView },
  { path: '/courses', component: CoursesView },
  { path: '/enrollments', component: EnrollmentsView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router