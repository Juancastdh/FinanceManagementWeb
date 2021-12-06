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
        <div class="text-left">
          <button
            type="button"
            class="btn btn-primary"
            id="removeButton"
            v-on:click="removeSelectedCategories"
            disabled
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "datatables.net-bs4";
import $ from "jquery";
import { categoriesService } from "../../../../services/categoriesService.js";

export default {
  name: "CategoriesTable",
  methods: {
    init: function (categories) {
      $("#categoriesTable").DataTable({
        data: categories,
        columns: [
          {
            data: "id",
            render: function (data) {
              return (
                '<input class="form-check-input me-1" name="cb" type="checkbox" value="' +
                data +
                '">'
              );
            },
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
          },
        ],
      });
      this.addCheckboxBehavior();
    },
    refresh: function () {
      this.clear();
      this.reload();
    },
    clear: function () {
      var categoriesTable = $("#categoriesTable").DataTable();
      categoriesTable.clear();
    },
    reload: function () {
      categoriesService.getCategories().then((categories) => {
        this.render(categories);
      });
    },
    render: function (categories) {
      var categoriesTable = $("#categoriesTable").DataTable();
      categoriesTable.rows.add(categories);
      categoriesTable.draw();
      this.addCheckboxBehavior();
    },
    addCheckboxBehavior: function () {
      $("input[name=cb]").change(function () {
        var $boxes = $("input[name=cb]:checked");

        if ($boxes.length > 0) {
          $("#removeButton").prop("disabled", false);
        } else {
          $("#removeButton").prop("disabled", true);
        }
      });
    },
    removeSelectedCategories: function () {
      var selectedCheckboxes = $("input[name=cb]:checked");
      var removedCategories = 0;
      var self = this;
      selectedCheckboxes.each(function () {
        var categoryId = $(this).attr("value");
        categoriesService.deleteCategoryById(categoryId).then(() => {
          removedCategories++;
          if (removedCategories == selectedCheckboxes.length) {
            self.refresh();
            $("#removeButton").prop("disabled", true);
          }
        });
      });
    },
  },
  mounted() {
    categoriesService.getCategories().then((categories) => {
      this.init(categories);
    });
  },
};
</script>


