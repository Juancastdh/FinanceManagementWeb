<template>
  <div>
    <CategoriesTable ref="categoriesTable" v-on:category-edited="setCategoryToEdit" />
    <AddCategory ref="addCategory" v-on:category-added="refreshCategoriesTable" />
  </div>
</template>

<script setup lang="ts">
import CategoriesTable from './components/CategoriesTable.vue'
import AddCategory from './components/AddCategory.vue'
import type { Category } from '@/components/services/models/category'
import { ref } from 'vue'

const categoriesTable = ref()
const addCategory = ref()

async function refreshCategoriesTable() {
  await categoriesTable.value.refresh()
}

function setCategoryToEdit(category: Category) {
  addCategory.value.setCategory(category)
}
</script>
