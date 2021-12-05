<template>
  <section class="section dashboard">
    <div class="row">
      <div class="col-lg-8">
        <CategoryBalanceSection /><ReportsChartSection />
      </div>
      <div class="col-lg-4"></div>
    </div>
  </section>
</template>

<script>
import CategoryBalanceSection from "./components/CategoryBalanceSection.vue";
import ReportsChartSection from "./components/ReportsChartSection.vue";

export default {
  name: "DashboardPage",
  components: {
    CategoryBalanceSection,
    ReportsChartSection,
  },
};
</script>