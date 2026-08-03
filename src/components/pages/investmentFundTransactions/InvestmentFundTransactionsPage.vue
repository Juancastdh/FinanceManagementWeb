<template>
  <div>
    <InvestmentFundTransactionsTable ref="transactionsTable" v-on:investment-fund-transaction-edited="setInvestmentFundTransactionToEdit"/>
    <AddInvestmentFundTransaction ref="addInvestmentFundTransaction" v-on:investment-fund-transaction-added="refreshTransactionsTable" v-on:investment-fund-transaction-updated="refreshTransactionsTable"/>
  </div>
</template>

<script>
import InvestmentFundTransactionsTable from "./components/InvestmentFundTransactionsTable.vue";
import AddInvestmentFundTransaction from "./components/AddInvestmentFundTransaction.vue";

export default {
  name: "InvestmentFundTransactionsPage",
  components: {
    InvestmentFundTransactionsTable,
    AddInvestmentFundTransaction
  },
  methods: {
    refreshTransactionsTable: function () {
      this.$refs.transactionsTable.refresh();
    },
     setInvestmentFundTransactionToEdit: function(investmentFundTransaction){
      this.$refs.addInvestmentFundTransaction.setInvestmentFundTransaction(investmentFundTransaction);
    }
  }
};
</script>