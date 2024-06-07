<template>
  <div v-if="categoriesFetched">
    <TransactionsTable ref="transactionsTable" v-bind:categories="categories" />
    <AddTransaction
      v-on:transaction-added="refreshTransactionsTable"
      v-bind:categories="categories"
    />
  </div>
</template>

<script setup lang="ts">
import TransactionsTable from './components/TransactionsTable.vue'
import AddTransaction from './components/AddTransaction.vue'
import { Category } from '@/components/services/models/category'
import { onMounted, ref } from 'vue'
import { CategoriesService } from '@/components/services/categoriesService'
import { baseUrl } from '@/common/config'

const categories = ref(new Array<Category>())
const categoriesFetched = ref(false)
const transactionsTable = ref()

async function refreshTransactionsTable() {
  await transactionsTable.value.refresh()
}

onMounted(async () => {
  let categoriesService = new CategoriesService(baseUrl)
  categories.value = await categoriesService.getCategories()
  categoriesFetched.value = true
})
</script>
