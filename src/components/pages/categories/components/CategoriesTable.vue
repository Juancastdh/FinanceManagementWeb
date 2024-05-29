<template>
  <div class="row">
    <div class="card recent-sales">
      <div class="card-body">
        <h5 class="card-title">Categories</h5>
        <table class="table table-dark table-striped" id="categoriesTable">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Percentage</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>

        <button class="btn btn-primary" type="button" data-bs-toggle="dropdown">Actions</button>
        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
          <li>
            <a
              class="dropdown-item"
              v-bind:class="{ disabled: !editButtonEnabled }"
              id="editButton"
              v-on:click="editSelectedCategory"
            >
              Edit
            </a>
          </li>
          <li>
            <a
              class="dropdown-item"
              v-bind:class="{ disabled: !removeButtonEnabled }"
              id="removeButton"
              v-on:click="removeSelectedCategories"
            >
              Remove
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'datatables.net-bs4'
import 'datatables.net-select-bs4'
import 'jquery-datatables-checkboxes'
import $ from 'jquery'
import { onMounted, ref } from 'vue'
import type { Category } from '@/components/services/models/category'
import { CategoriesService } from '@/components/services/categoriesService'
import { baseUrl } from '@/common/config'

const removeButtonEnabled = ref(false)
const editButtonEnabled = ref(false)
let categoriesEmptyArray = new Array<Category>()
const categoriesTable = ref(
  $('#categoriesTable').DataTable({
    columnDefs: [
      {
        targets: 0,
        checkboxes: {
          selectRow: true
        }
      }
    ],
    select: {
      style: 'multi'
    },
    order: [[1, 'asc']],
    data: categoriesEmptyArray,
    columns: [
      {
        data: 'id'
      },
      {
        data: 'id'
      },
      {
        data: 'name'
      },
      {
        data: 'percentage',
        render: function (data: number) {
          return data + '%'
        }
      }
    ]
  })
)
const emit = defineEmits(['category-edited'])

function anyCategoriesSelected(): boolean {
  let anyCategoriesSelected = false
  let selectedCategories = categoriesTable.value.rows({ selected: true }).data()
  if (selectedCategories.length > 0) {
    anyCategoriesSelected = true
  }
  return anyCategoriesSelected
}

function oneCategorySelected(): boolean {
  let oneCategorySelected = false
  let selectedCategories = categoriesTable.value.rows({ selected: true }).data()
  if (selectedCategories.length == 1) {
    oneCategorySelected = true
  }
  return oneCategorySelected
}

function enableRemoveButton() {
  if (anyCategoriesSelected()) {
    removeButtonEnabled.value = true
  } else {
    removeButtonEnabled.value = false
  }
}

function enableEditButton() {
  if (oneCategorySelected()) {
    editButtonEnabled.value = true
  } else {
    editButtonEnabled.value = false
  }
}

function init(categories: Category[]) {
  categoriesTable.value = $('#categoriesTable').DataTable({
    columnDefs: [
      {
        targets: 0,
        checkboxes: {
          selectRow: true
        }
      }
    ],
    select: {
      style: 'multi'
    },
    order: [[1, 'asc']],
    data: categories,
    columns: [
      {
        data: 'id'
      },
      {
        data: 'id'
      },
      {
        data: 'name'
      },
      {
        data: 'percentage',
        render: function (data: number) {
          return data + '%'
        }
      }
    ]
  })
  categoriesTable.value.on('select', function () {
    enableRemoveButton()
    enableEditButton()
  })
  categoriesTable.value.on('deselect', function () {
    enableRemoveButton()
    enableEditButton()
  })
}

function deselectAllRows() {
  categoriesTable.value.rows({ selected: true }).deselect()
}

function clear() {
  categoriesTable.value.clear()
}

function render(categories: Category[]) {
  categoriesTable.value.rows.add(categories)
  categoriesTable.value.draw()
}

async function reload() {
  let categoriesService = new CategoriesService(baseUrl)
  let categories = await categoriesService.getCategories()
  render(categories)
}

async function refresh() {
  deselectAllRows()
  clear()
  await reload()
  enableRemoveButton()
  enableEditButton()
}

defineExpose({
  refresh
})

async function removeSelectedCategories() {
  let categoriesService = new CategoriesService(baseUrl)
  let selectedCategories = categoriesTable.value.rows({ selected: true }).data()
  selectedCategories.each(async function (category: Category) {
    await categoriesService.deleteCategoryById(category.id)
  })
  refresh()
}

function editSelectedCategory() {
  let selectedCategories = categoriesTable.value.rows({ selected: true }).data()
  selectedCategories.each(function (category: Category) {
    emit('category-edited', category)
  })
}

onMounted(async () => {
  let categoriesService = new CategoriesService(baseUrl)
  let categories = await categoriesService.getCategories()
  init(categories)
})
</script>
