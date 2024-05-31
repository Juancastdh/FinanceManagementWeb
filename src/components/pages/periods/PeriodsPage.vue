<template>
    <div>
        <PeriodsTable ref="periodsTable" />
        <AddPeriod v-on:period-added="refreshPeriodsTable" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PeriodsTable from './componentes/PeriodsTable.vue';
import AddPeriod from './componentes/AddPeriod.vue';

const periodsTable = ref();

async function refreshPeriodsTable() {
    await periodsTable.value.refresh();
}

</script>