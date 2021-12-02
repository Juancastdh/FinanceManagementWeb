<template>
  <div>
    <PeriodsTable />
    <AddPeriod />
  </div>
</template>

<script>
import PeriodsTable from "./PeriodsTable.vue";
import AddPeriod from "./AddPeriod.vue";

export default {
    name: "PeriodsPage",
    components: {
        PeriodsTable,
        AddPeriod
    }
};
</script>