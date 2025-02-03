<template>
  <div>
    <TransactionsTable ref="transactionsTable" />
    <AddTransaction v-on:transaction-added="refreshTransactionsTable" />
  </div>
</template>

<script>
import TransactionsTable from "./components/TransactionsTable.vue";
import AddTransaction from "./components/AddTransaction.vue";

export default {
  name: "TransactionsPage",
  components: {
    TransactionsTable,
    AddTransaction
  },
  methods: {
    refreshTransactionsTable: function () {
      this.$refs.transactionsTable.refresh();
    },
  }
};
</script>