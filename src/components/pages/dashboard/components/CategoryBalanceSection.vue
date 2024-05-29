<template>
  <div class="row" id="categorySummaryCards">
    <CategoryBalanceCard
      v-for="category in cardCategories"
      :key="category.id"
      v-bind:categoryName="category.name"
      v-bind:categoryBalance="category.balance"
    />
  </div>
</template>

<script setup lang="ts">
import CategoryBalanceCard from './CategoryBalanceCard.vue'
import { baseUrl } from '../../../../common/config'
import { CategoriesService } from '../../../services/categoriesService'
import { TransactionsService } from '../../../services/transactionsService'
import { onMounted, ref } from 'vue'
import { CategoryWithBalance } from '@/components/services/models/categoryWithBalance'

const cardCategories = ref<CategoryWithBalance[]>([])

onMounted(async () => {
  let transactionsService = new TransactionsService(baseUrl)
  let categoriesService = new CategoriesService(baseUrl)
  let categories = await categoriesService.getCategories()
  for await (const category of categories) {
    let financialReport = await transactionsService.getFinancialReport(
      null,
      null,
      null,
      category.id
    )
    let categoryWithBalance = new CategoryWithBalance(
      category.id,
      category.name,
      category.percentage,
      financialReport.totalValue
    )
    cardCategories.value.push(categoryWithBalance)
  }
})
</script>
