import { createWebHistory, createRouter } from "vue-router";
import DashboardPage from "../components/pages/dashboard/DashboardPage.vue";
import PeriodsPage from "../components/pages/periods/PeriodsPage.vue";
import CategoriesPage from "../components/pages/categories/CategoriesPage.vue";
import TransactionsPage from "../components/pages/transactions/TransactionsPage.vue";
import AccountsPage from "../components/pages/accounts/AccountsPage.vue";
import InvestmentFundsPage from "../components/pages/investmentFunds/InvestmentFundsPage.vue";
import InvestmentFundCategoriesPage from "../components/pages/investmentFundCategories/InvestmentFundCategoriesPage.vue";
import InvestmentFundTransactionsPage from "../components/pages/investmentFundTransactions/InvestmentFundTransactionsPage.vue";

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
  },
  {
    path: "/accounts",
    name: "Accounts",
    component: AccountsPage
  },
  {
    path: "/investment-funds",
    name: "Investment Funds",
    component: InvestmentFundsPage
  },
  {
    path: "/investment-fund-categories",
    name: "Investment Fund Categories",
    component: InvestmentFundCategoriesPage
  },
  {
    path: "/investment-fund-transactions",
    name: "Investment Fund Transactions",
    component: InvestmentFundTransactionsPage
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