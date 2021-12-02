import { createWebHistory, createRouter } from "vue-router";
import DashboardPage from "../components/DashboardPage.vue";
import PeriodsPage from "../components/PeriodsPage.vue";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export {
  router,
  routes
};