<template>
  <div>
    <PeriodsTable ref="periodsTable"/>
    <AddPeriod v-on:period-added="refreshPeriodsTable"/>
  </div>
</template>

<script>
import PeriodsTable from "./components/PeriodsTable.vue";
import AddPeriod from "./components/AddPeriod.vue";

export default {
    name: "PeriodsPage",
    components: {
        PeriodsTable,
        AddPeriod
    },
    methods: {
      refreshPeriodsTable: function(){
        this.$refs.periodsTable.refresh();
      }
    }
};
</script>