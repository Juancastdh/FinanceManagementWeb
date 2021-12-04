<template>
  <section class="section dashboard">
    <div class="row">
      <div class="col-lg-8"><CategoryBalanceSection /></div>
      <div class="col-lg-4"></div>
    </div>
  </section>
</template>

<script>
import CategoryBalanceSection from "./components/CategoryBalanceSection.vue";


export default {
  name: "DashboardPage",
  components: {
      CategoryBalanceSection
  }
};
</script>