<template>
  <div class="row">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Add Category</h5>
        <form class="row g-3 needs-validation" novalidate>
          <div class="col-md-6">
            <div class="form-floating">
              <input type="text" class="form-control" placeholder="Name" id="categoryNameField"
                v-model="categoryToSubmit.category.name" v-bind:class="{
                  'form-control': true,
                  'is-invalid': !validName() && categoryToSubmit.attemptedToSubmit,
                  'is-valid': validName() && categoryToSubmit.attemptedToSubmit
                }" required />
              <label for="floatingName">Name</label>
              <div class="invalid-feedback">Please specify a name for the category.</div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input type="number" class="form-control" placeholder="Percentage" id="categoryPercentageField"
                v-model="categoryToSubmit.category.percentage" v-bind:class="{
                  'form-control': true,
                  'is-invalid': !validPercentage() && categoryToSubmit.attemptedToSubmit,
                  'is-valid': validPercentage() && categoryToSubmit.attemptedToSubmit
                }" required />
              <label for="floatingName">Percentage</label>
              <div class="invalid-feedback">Please specify a percentage.</div>
            </div>
          </div>
          <div class="text-center">
            <button type="button" class="btn btn-primary" id="addCategoryButton" v-on:click="addCategory">
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
import { CategoriesService } from '@/components/services/categoriesService.js'
import { Category } from '@/components/services/models/category.js'
import { ref } from 'vue'

const categoryToSubmit = ref({
  category: new Category(0, '', 0),
  attemptedToSubmit: false
})

const emit = defineEmits(['category-added'])

function validName(): boolean {
  let nameIsValid = false

  if (categoryToSubmit.value.category.name.length > 0) {
    nameIsValid = true
  }

  return nameIsValid
}

function validPercentage(): boolean {
  let percentageIsValid = false

  if (categoryToSubmit.value.category.percentage > 0) {
    percentageIsValid = true
  }

  return percentageIsValid
}

function isFormValid(): boolean {
  let formIsValid = false

  if (validName() && validPercentage()) {
    formIsValid = true
  }

  return formIsValid
}

function clearForm() {
  categoryToSubmit.value.attemptedToSubmit = false
  categoryToSubmit.value.category.name = ''
  categoryToSubmit.value.category.percentage = 0
  categoryToSubmit.value.category.id = 0
}

async function addCategory(): Promise<void> {
  let categoriesService = new CategoriesService(baseUrl)
  categoryToSubmit.value.attemptedToSubmit = true
  if (isFormValid() == true) {
    if (categoryToSubmit.value.category.id == 0) {
      await categoriesService.addCategory(categoryToSubmit.value.category)
    } else {
      await categoriesService.updateCategory(categoryToSubmit.value.category)
    }
    emit('category-added')
    clearForm()
  }
}

function setCategory(category: Category) {
  categoryToSubmit.value.category = category
}

defineExpose({
  setCategory
})
</script>

<style scoped>
.divider {
  width: 5px;
  height: auto;
  display: inline-block;
}
</style>
