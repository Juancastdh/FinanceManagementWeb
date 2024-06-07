<template>
  <div class="row">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Add Transaction</h5>
        <form class="row g-3 needs-validation" novalidate>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="date"
                class="form-control"
                id="transactionDateField"
                v-model="transactionToSubmit.transaction.date"
                v-bind:class="{
                  'is-invalid': !isDateValid() && transactionToSubmit.attemptedToSubmit,
                  'is-valid': isDateValid() && transactionToSubmit.attemptedToSubmit
                }"
                required
              />
              <label for="floatingName">Date</label>
              <div class="invalid-feedback">
                Please specify a transaction date that is within an existing period.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                placeholder="Description"
                id="transactionDescriptionField"
                v-model="transactionToSubmit.transaction.description"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !isDescriptionValid() && transactionToSubmit.attemptedToSubmit,
                  'is-valid': isDescriptionValid() && transactionToSubmit.attemptedToSubmit
                }"
                required
              />
              <label for="floatingName">Description</label>
              <div class="invalid-feedback">Please specify a description.</div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="number"
                class="form-control"
                placeholder="Value"
                id="transactionValueField"
                step=".01"
                v-model="transactionToSubmit.transaction.value"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !isValueValid() && transactionToSubmit.attemptedToSubmit,
                  'is-valid': isValueValid() && transactionToSubmit.attemptedToSubmit
                }"
                required
              />
              <label for="floatingName">Value</label>
              <div class="invalid-feedback">Please specify a value.</div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-floating mb-3">
              <select
                class="form-select"
                id="categoryCombobox"
                aria-label="Category"
                v-model="transactionToSubmit.transaction.categoryId"
                v-bind:class="{
                  'is-invalid': !isCategoryValid() && transactionToSubmit.attemptedToSubmit,
                  'is-valid': isCategoryValid() && transactionToSubmit.attemptedToSubmit
                }"
                :disabled="isSplitIntoCategoriesSelected()"
              >
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              <label for="categoryCombobox">Category</label>
              <div class="invalid-feedback">Please specify a valid category.</div>
            </div>
          </div>

          <div class="col-md-6">
            <legend class="col-form-label col-sm-2 pt-0">Split into all categories?</legend>
            <div class="col-sm-6">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="splitRadios"
                  value="true"
                  id="splitIntoAllCategories"
                  v-model="transactionToSubmit.splitIntoCategories"
                  v-bind:class="{
                    'is-invalid': !isSplitOptionValid() && transactionToSubmit.attemptedToSubmit,
                    'is-valid': isSplitOptionValid() && transactionToSubmit.attemptedToSubmit
                  }"
                  required
                />
                <label class="form-check-label" for="splitIntoAllCategories"> Yes </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="splitRadios"
                  value="false"
                  id="doNotSplitIntoAllCategories"
                  v-model="transactionToSubmit.splitIntoCategories"
                  v-bind:class="{
                    'is-invalid': !isSplitOptionValid() && transactionToSubmit.attemptedToSubmit,
                    'is-valid': isSplitOptionValid() && transactionToSubmit.attemptedToSubmit
                  }"
                  required
                />
                <label class="form-check-label" for="doNotSplitIntoAllCategories"> No </label>
                <div class="invalid-feedback">Please select an option</div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <legend class="col-form-label col-sm-2 pt-0">Type</legend>
            <div class="col-sm-6">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="typeRadios"
                  value="false"
                  id="transactionIncomeType"
                  v-model="transactionToSubmit.transaction.isExpense"
                  v-bind:class="{
                    'is-invalid': !isTypeValid() && transactionToSubmit.attemptedToSubmit,
                    'is-valid': isTypeValid() && transactionToSubmit.attemptedToSubmit
                  }"
                  required
                />
                <label class="form-check-label" for="transactionIncomeType"> Income </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="typeRadios"
                  value="true"
                  id="transactionExpenseType"
                  v-model="transactionToSubmit.transaction.isExpense"
                  v-bind:class="{
                    'is-invalid': !isTypeValid() && transactionToSubmit.attemptedToSubmit,
                    'is-valid': isTypeValid() && transactionToSubmit.attemptedToSubmit
                  }"
                  required
                />
                <label class="form-check-label" for="transactionExpenseType"> Expense </label>
                <div class="invalid-feedback">Please select a type</div>
              </div>
            </div>
          </div>

          <div class="text-center">
            <button
              type="button"
              class="btn btn-primary"
              id="addTransactionButton"
              v-on:click="addTransaction"
            >
              Submit
            </button>
            <div class="divider" />
            <button type="reset" class="btn btn-secondary" id="resetButton" v-on:click="clearForm">
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { baseUrl } from '@/common/config'
import type { Category } from '@/components/services/models/category'
import { FinancialTransaction } from '@/components/services/models/financialTransaction'
import { Period } from '@/components/services/models/period'
import { PeriodsService } from '@/components/services/periodsService'
import { TransactionsService } from '@/components/services/transactionsService'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  categories: Category[]
}>()

const transactionToSubmit = ref({
  transaction: new FinancialTransaction(0, new Date(), 0, '', false, 0, 0),
  attemptedToSubmit: false,
  splitIntoCategories: false,
  periods: new Array<Period>()
})

const emit = defineEmits(['transaction-added'])

function getSelectedPeriod(): Period {
  let selectedPeriod = new Period(0, new Date(), new Date())

  let date = new Date(transactionToSubmit.value.transaction.date)

  let foundPeriod = transactionToSubmit.value.periods.find(
    (p) => date >= new Date(p.startDate) && date < new Date(p.endDate)
  )

  if (typeof foundPeriod !== 'undefined') {
    selectedPeriod = foundPeriod
  }

  return selectedPeriod
}

function isDateValid(): boolean {
  let dateIsValid = false
  let transactionDate = new Date(transactionToSubmit.value.transaction.date)

  if (transactionDate.getFullYear() > 1 && getSelectedPeriod().id != 0) {
    dateIsValid = true
  }

  return dateIsValid
}

function isValueValid(): boolean {
  let valueIsValid = false

  if (transactionToSubmit.value.transaction.value > 0) {
    valueIsValid = true
  }

  return valueIsValid
}

function isDescriptionValid(): boolean {
  let descriptionIsValid = false

  if (transactionToSubmit.value.transaction.description.length > 0) {
    descriptionIsValid = true
  }

  return descriptionIsValid
}

function isSplitIntoCategoriesSelected(): boolean {
  let splitIntoCategoriesIsSelected = false

  if (transactionToSubmit.value.splitIntoCategories == true) {
    splitIntoCategoriesIsSelected = true
  }

  return splitIntoCategoriesIsSelected
}

function isCategoryValid(): boolean {
  let categoryIsValid = false

  if (
    transactionToSubmit.value.transaction.categoryId != 0 ||
    isSplitIntoCategoriesSelected() == true
  ) {
    categoryIsValid = true
  }

  return categoryIsValid
}

function isTypeValid(): boolean {
  let typeIsValid = false

  if (transactionToSubmit.value.transaction.isExpense != null) {
    typeIsValid = true
  }

  return typeIsValid
}

function isSplitOptionValid(): boolean {
  let splitOptionIsValid = false

  if (transactionToSubmit.value.splitIntoCategories != null) {
    splitOptionIsValid = true
  }

  return splitOptionIsValid
}

function isFormValid(): boolean {
  let formIsValid = false

  if (
    isDateValid() == true &&
    isValueValid() == true &&
    isDescriptionValid() == true &&
    isCategoryValid() == true &&
    isTypeValid() == true &&
    isSplitOptionValid() == true
  ) {
    formIsValid = true
  }

  return formIsValid
}

function getTransactionsToBeAdded() {
  let transactionsToBeAdded = new Array<FinancialTransaction>()
  if (isFormValid() == true) {
    let selectedPeriod = getSelectedPeriod()
    transactionToSubmit.value.transaction.periodId = selectedPeriod.id
    transactionToSubmit.value.transaction.isExpense = (transactionToSubmit.value.transaction.isExpense.toString() == "true");

    if (transactionToSubmit.value.splitIntoCategories == false) {
      let transactionToBeAdded = transactionToSubmit.value.transaction;
      transactionToBeAdded.date = new Date(transactionToSubmit.value.transaction.date);
      transactionsToBeAdded.push(transactionToBeAdded);
    } else {
      let categories = props.categories
      categories.forEach(function (category: Category) {
        let categoryTransaction = new FinancialTransaction(0, new Date(), 0, '', false, 0, 0)
        Object.assign(categoryTransaction, transactionToSubmit.value.transaction)
        categoryTransaction.categoryId = category.id
        categoryTransaction.value = categoryTransaction.value * (category.percentage / 100)
        categoryTransaction.date = new Date(transactionToSubmit.value.transaction.date);
        transactionsToBeAdded.push(categoryTransaction)
      })
    }
  }

  return transactionsToBeAdded
}

function clearForm() {
  transactionToSubmit.value.attemptedToSubmit = false
  transactionToSubmit.value.transaction.date = new Date()
  transactionToSubmit.value.transaction.value = 0
  transactionToSubmit.value.transaction.description = ''
  transactionToSubmit.value.transaction.isExpense = false
  transactionToSubmit.value.splitIntoCategories = false
  transactionToSubmit.value.transaction.id = 0
}

async function addTransaction(): Promise<void> {
  let transactionsService = new TransactionsService(baseUrl)
  transactionToSubmit.value.attemptedToSubmit = true
  let transactionsToBeAdded = getTransactionsToBeAdded()

  if (transactionsToBeAdded.length > 0) {
    for await (const transactionToBeAdded of transactionsToBeAdded) {
      await transactionsService.addTransaction(transactionToBeAdded)
      emit('transaction-added')
      clearForm()
    }
  }
}

onMounted(async () => {
  let periodsService = new PeriodsService(baseUrl)
  let periods = await periodsService.getPeriods()
  transactionToSubmit.value.periods = periods
})
</script>
