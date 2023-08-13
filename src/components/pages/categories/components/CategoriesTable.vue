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

        <button class="btn btn-primary" type="button" data-bs-toggle="dropdown">
          Actions
        </button>
        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
          <li>
            <a
              class="dropdown-item"
              v-bind:class= "{ disabled: !editButtonEnabled}"
              id="editButton"
              v-on:click="editSelectedCategory"
            >
              Edit
            </a>
          </li>
          <li>
            <a
              class="dropdown-item"
              v-bind:class= "{ disabled: !removeButtonEnabled}"
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

<script>
import "datatables.net-bs4";
import "datatables.net-select-bs4";
import "jquery-datatables-checkboxes";
import $ from "jquery";
import { categoriesService } from "../../../../services/categoriesService.js";

export default {
  name: "CategoriesTable",
  data: function () {
    return {
      removeButtonEnabled: false,
      editButtonEnabled: false,
      categoriesTable: null,
    };
  },
  methods: {
    init: function (categories) {
      var self = this;
      self.categoriesTable = $("#categoriesTable").DataTable({
        columnDefs: [
          {
            targets: 0,
            checkboxes: {
              selectRow: true,
            },
          },
        ],
        select: {
          style: "multi",
        },
        order: [[1, "asc"]],
        data: categories,
        columns: [
          {
            data: "id",
          },
          {
            data: "id",
          },
          {
            data: "name",
          },
          {
            data: "percentage",
            render: function (data) {
              return data + "%";
            },
          }
        ],
      });
      self.categoriesTable.on("select", function () {
        self.enableRemoveButton();
        self.enableEditButton();
      });
      self.categoriesTable.on("deselect", function () {
        self.enableRemoveButton();
        self.enableEditButton();
      });
    },
    refresh: function () {
      this.deselectAllRows();
      this.clear();
      this.reload();
      this.enableRemoveButton();
      this.enableEditButton();
    },
    clear: function () {
      this.categoriesTable.clear();
    },
    reload: function () {
      categoriesService.getCategories().then((categories) => {
        this.render(categories);
      });
    },
    render: function (categories) {
      this.categoriesTable.rows.add(categories);
      this.categoriesTable.draw();
    },
    removeSelectedCategories: function () {
      var self = this;
      var selectedCategories = self.categoriesTable
        .rows({ selected: true })
        .data();
      var removedCategories = 0;
      selectedCategories.each(function (category) {
        categoriesService.deleteCategoryById(category.id).then(() => {
          removedCategories++;
          if (removedCategories == selectedCategories.length) {
            self.refresh();
          }
        });
      });
    },
    editSelectedCategory: function() {

      var self = this;
      var selectedCategories = self.categoriesTable
        .rows({ selected: true })
        .data();
      selectedCategories.each(function (category){
        self.$emit("category-edited", category);
      });      
    },
    anyCategoriesSelected: function () {
      var anyCategoriesSelected = false;
      var selectedCategories = this.categoriesTable
        .rows({ selected: true })
        .data();
      if (selectedCategories.length > 0) {
        anyCategoriesSelected = true;
      }
      return anyCategoriesSelected;
    },
    oneCategorySelected: function(){
      var oneCategorySelected = false;
      var selectedCategories = this.categoriesTable
        .rows({ selected: true })
        .data();
      if (selectedCategories.length == 1) {
        oneCategorySelected = true;
      }
      return oneCategorySelected;
    },
    enableRemoveButton: function () {
      if (this.anyCategoriesSelected()) {
        this.removeButtonEnabled = true;
      } else {
        this.removeButtonEnabled = false;
      }
    },
    enableEditButton: function () {
      if (this.oneCategorySelected()) {
        this.editButtonEnabled = true;
      } else {
        this.editButtonEnabled = false;
      }
    },
    deselectAllRows: function () {
      this.categoriesTable.rows({ selected: true }).deselect();
    },
  },
  mounted() {
    categoriesService.getCategories().then((categories) => {
      this.init(categories);
    });
  },
};
</script>


