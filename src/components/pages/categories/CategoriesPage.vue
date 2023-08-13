<template>
  <div>
    <CategoriesTable ref="categoriesTable" v-on:category-edited="setCategoryToEdit"/>
    <AddCategory ref="addCategory" v-on:category-added="refreshCategoriesTable" />
  </div>
</template>

<script>
import CategoriesTable from "./components/CategoriesTable.vue";
import AddCategory from "./components/AddCategory.vue";

export default {
  name: "CategoriesPage",
  components: {
    CategoriesTable,
    AddCategory
  },
  methods: {
    refreshCategoriesTable: function () {
      this.$refs.categoriesTable.refresh();
    },
    setCategoryToEdit: function(category){
      this.$refs.addCategory.setCategory(category);
    }
  },
};
</script>