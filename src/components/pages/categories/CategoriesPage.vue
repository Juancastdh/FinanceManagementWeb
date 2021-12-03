<template>
  <div>
    <CategoriesTable ref="categoriesTable" />
  </div>
</template>

<script>
import CategoriesTable from "./components/CategoriesTable.vue";

export default {
  name: "CategoriesPage",
  components: {
    CategoriesTable,
  },
  methods: {
    refreshCategoriesTable: function () {
      this.$refs.categoriesTable.refresh();
    },
  },
};
</script>