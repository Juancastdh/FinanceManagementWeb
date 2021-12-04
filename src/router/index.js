import { createWebHistory, createRouter } from "vue-router";
import DashboardPage from "../components/pages/dashboard/DashboardPage.vue";
import PeriodsPage from "../components/pages/periods/PeriodsPage.vue";
import CategoriesPage from "../components/pages/categories/CategoriesPage.vue";
import TransactionsPage from "../components/pages/transactions/TransactionsPage.vue";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: DashboardPage,
  },
  {
    path: "/periods",
    name: "Periods",
    component: PeriodsPage,
  },
  {
    path: "/categories",
    name: "Categories",
    component: CategoriesPage
  },
  {
    path: "/transactions",
    name: "Transactions",
    component: TransactionsPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export {
  router,
  routes
};