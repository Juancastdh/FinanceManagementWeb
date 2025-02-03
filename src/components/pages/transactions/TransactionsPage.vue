<template>
  <div v-if="accountsFetched">
    <TransactionsTable ref="transactionsTable"/>
    <AddTransaction v-on:transaction-added="refreshTransactionsTable" v-bind:accounts="accounts"/>
  </div>
</template>

<script>
import TransactionsTable from "./components/TransactionsTable.vue";
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
    accountsService.getAccounts().then((accounts) => {
      this.accounts = accounts;
      this.accountsFetched = true;
    });

  }
};
</script>