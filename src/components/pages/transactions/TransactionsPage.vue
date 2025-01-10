<template>
  <div v-if="categoriesFetched && accountsFetched">
    <TransactionsTable ref="transactionsTable" v-bind:categories="categories" v-bind:accounts="accounts"/>
    <AddTransaction v-on:transaction-added="refreshTransactionsTable" v-bind:categories="categories" v-bind:accounts="accounts"/>
  </div>
</template>

<script>
import TransactionsTable from "./components/TransactionsTable.vue";
import { categoriesService } from "../../../services/categoriesService.js";
import { accountsService } from "../../../services/accountsService.js";
import AddTransaction from "./components/AddTransaction.vue";

export default {
  name: "TransactionsPage",
  components: {
    TransactionsTable,
    AddTransaction
  },
  data: function () {
    return {
      categories: [],
      categoriesFetched: false,
      accounts: [],
      accountsFetched: false
    }
  },
  methods: {
    refreshTransactionsTable: function () {
      this.$refs.transactionsTable.refresh();
    },
  },
  mounted() {

    categoriesService
      .getCategories()
      .then((categories) => {
        this.categories = categories;
        this.categoriesFetched = true;
      });

      

    accountsService.getAccounts().then((accounts) => {
      this.accounts = accounts;
      this.accountsFetched = true;
    });

  }
};
</script>