import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../components/pages/dashboard/DashboardPage.vue'
import CategoriesPage from '@/components/pages/categories/CategoriesPage.vue'
import PeriodsPage from '@/components/pages/periods/PeriodsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: DashboardPage
    },
    {
      path: '/categories',
      name: 'Categories',
      component: CategoriesPage
    },
    {
      path: '/periods',
      name: 'Periods',
      component: PeriodsPage
    }
  ]
})

export default router
