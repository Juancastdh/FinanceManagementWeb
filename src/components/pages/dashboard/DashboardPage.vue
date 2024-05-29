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

<script setup lang="ts">
import CategoryBalanceSection from './components/CategoryBalanceSection.vue'
import ReportsChartSection from './components/ReportsChartSection.vue'
</script>
