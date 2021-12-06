<template>
  <section class="section dashboard">
    <div class="row">
      <div class="col-lg-12">
        <CategoryBalanceSection />
        <ReportsChartSection />
      </div>
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