<template>
  <div v-if="categoriesFetched">
    <TransactionsTable ref="transactionsTable" v-bind:categories="categories" />
    <AddTransaction v-on:transaction-added="refreshTransactionsTable" v-bind:categories="categories"/>
  </div>
</template>

<script>
import TransactionsTable from "./components/TransactionsTable.vue";
import { categoriesService } from "../../../services/categoriesService.js";
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
      categoriesFetched: false
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

  }
};
</script>