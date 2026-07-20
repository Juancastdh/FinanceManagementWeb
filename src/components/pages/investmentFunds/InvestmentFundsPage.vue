<template>
  <div>
    <InvestmentFundsTable ref="investmentFundsTable" v-on:investment-fund-edited="setInvestmentFundToEdit"/>
    <AddInvestmentFund ref="addInvestmentFund" v-on:investment-fund-added="refreshInvestmentFundsTable" v-on:investment-fund-updated="refreshInvestmentFundsTable" />
  </div>
</template>

<script>
import InvestmentFundsTable from "./components/InvestmentFundsTable.vue";
import AddInvestmentFund from "./components/AddInvestmentFund.vue";

export default {
  name: "InvestmentFundsPage",
  components: {
    InvestmentFundsTable,
    AddInvestmentFund
  },
  methods: {
    refreshInvestmentFundsTable: function () {
      this.$refs.investmentFundsTable.refresh();
    },
    setInvestmentFundToEdit: function(investmentFund){
      this.$refs.addInvestmentFund.setInvestmentFund(investmentFund);
    }
  },
};
</script>