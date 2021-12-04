<template>
  <div>
    <TransactionsTable ref="transactionsTable" />
  </div>
</template>

<script>
import TransactionsTable from "./components/TransactionsTable.vue";

export default {
  name: "TransactionsPage",
  components: {
    TransactionsTable
  },
  methods: {
    refreshTransactionsTable: function () {
      this.$refs.transactionsTable.refresh();
    },
  },
};
</script>