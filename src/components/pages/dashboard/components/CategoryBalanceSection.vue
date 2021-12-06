<template>
  <div class="row" id="categorySummaryCards">
    <CategoryBalanceCard
      v-for="category in categories"
      :key="category.id"
      v-bind:categoryName="category.name"
      v-bind:categoryBalance="category.balance"
    />
  </div>
</template>

<script>
import CategoryBalanceCard from "./CategoryBalanceCard.vue";
import { categoriesService } from "../../../../services/categoriesService.js";
import { transactionsService } from "../../../../services/transactionsService.js";

export default {
  components: {
    CategoryBalanceCard,
  },
  data: function () {
    return {
      categories: [],
    };
  },
  mounted() {
    var self = this;
    categoriesService.getCategories().then((categories) => {
      categories.forEach((category) => {
        transactionsService
          .getFinancialReport(null, null, null, category.id)
          .then((financialReport) => {
            var categoryWithBalance = category;
            categoryWithBalance.balance = financialReport.totalValue;
            self.categories.push(categoryWithBalance);
          });
      });
    });
  },
};
</script>