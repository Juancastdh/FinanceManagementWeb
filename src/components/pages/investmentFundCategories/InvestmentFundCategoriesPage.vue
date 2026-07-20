<template>
  <div>
    <InvestmentFundCategoriesTable ref="investmentFundCategoriesTable" v-on:investment-fund-category-edited="setInvestmentFundCategoryToEdit"/>
    <AddInvestmentFundCategory ref="addInvestmentFundCategory" v-on:investment-fund-category-added="refreshInvestmentFundCategoriesTable" v-on:investment-fund-category-updated="refreshInvestmentFundCategoriesTable" />
  </div>
</template>

<script>
import InvestmentFundCategoriesTable from "./components/InvestmentFundCategoriesTable.vue";
import AddInvestmentFundCategory from "./components/AddInvestmentFundCategory.vue";

export default {
  name: "InvestmentFundCategoriesPage",
  components: {
    InvestmentFundCategoriesTable,
    AddInvestmentFundCategory
  },
  methods: {
    refreshInvestmentFundCategoriesTable: function () {
      this.$refs.investmentFundCategoriesTable.refresh();
    },
    setInvestmentFundCategoryToEdit: function(investmentFundCategory){
      this.$refs.addInvestmentFundCategory.setInvestmentFundCategory(investmentFundCategory);
    }
  },
};
</script>