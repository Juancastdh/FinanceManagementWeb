<template>
  <section class="section">
    <div class="row">
      <div class="col-lg-12">
        <PeriodsTable />
      </div>
    </div>
  </section>
</template>

<script>
import PeriodsTable from "./PeriodsTable.vue";

export default {
  name: "PageContent",
  components: {
    PeriodsTable
  },
  props: ["activepage"]
};
</script>