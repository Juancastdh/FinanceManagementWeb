<template>
  <div class="row">
    <div class="card recent-sales">
      <div class="card-body">
        <h5 class="card-title">Investment Fund Categories</h5>
        <table class="table table-dark table-striped" id="investmentFundCategoriesTable">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Investment Fund Name</th>
              <th scope="col">Investment Fund Company</th>
              <th scope="col">Currency</th>
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
              v-on:click="editSelectedInvestmentFundCategory"
            >
              Edit
            </a>
          </li>
          <li>
            <a
              class="dropdown-item"
              v-bind:class= "{ disabled: !removeButtonEnabled}"
              id="removeButton"
              v-on:click="removeSelectedInvestmentFundCategories"
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
import { investmentFundCategoriesService } from "../../../../services/investmentFundCategoriesService.js";

export default {
  name: "InvestmentFundCategoriesTable",
  data: function () {
    return {
      removeButtonEnabled: false,
      editButtonEnabled: false,
      investmentFundsTable: null,
    };
  },
  methods: {
    init: function (investmentFundCategories) {
      var self = this;
      self.investmentFundCategoriesTable = $("#investmentFundCategoriesTable").DataTable({
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
        data: investmentFundCategories,
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
            data: "investmentFund.name"
          },
          {
            data: "investmentFund.company"
          },
          {
            data: "investmentFund.currency"
          }
        ],
      });
      self.investmentFundCategoriesTable.on("select", function () {
        self.enableRemoveButton();
        self.enableEditButton();
      });
      self.investmentFundCategoriesTable.on("deselect", function () {
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
      this.investmentFundCategoriesTable.clear();
    },
    reload: function () {
      investmentFundCategoriesService.getActiveInvestmentFundCategories().then((investmentFundCategories) => {
        this.render(investmentFundCategories);
      });
    },
    render: function (investmentFundCategories) {
      this.investmentFundCategoriesTable.rows.add(investmentFundCategories);
      this.investmentFundCategoriesTable.draw();
    },
    removeSelectedInvestmentFundCategories: function () {
      var self = this;
      var selectedInvestmentFundCategories = self.investmentFundCategoriesTable
        .rows({ selected: true })
        .data();
      var removedInvestmentFundCategories = 0;
      selectedInvestmentFundCategories.each(function (investmentFundCategory) {
        investmentFundCategoriesService.deleteInvestmentFundCategoryById(investmentFundCategory.id).then(() => {
          removedInvestmentFundCategories++;
          if (removedInvestmentFundCategories == selectedInvestmentFundCategories.length) {
            self.refresh();
          }
        });
      });
    },
    editSelectedInvestmentFundCategory: function() {

      var self = this;
      var selectedInvestmentFundCategories = self.investmentFundCategoriesTable
        .rows({ selected: true })
        .data();
      selectedInvestmentFundCategories.each(function (investmentFundCategory){
        self.$emit("investment-fund-category-edited", investmentFundCategory);
      });      
    },
    anyInvestmentFundCategoriesSelected: function () {
      var anyInvestmentFundCategoriesSelected = false;
      var selectedInvestmentFundCategories = this.investmentFundCategoriesTable
        .rows({ selected: true })
        .data();
      if (selectedInvestmentFundCategories.length > 0) {
        anyInvestmentFundCategoriesSelected = true;
      }
      return anyInvestmentFundCategoriesSelected;
    },
    oneInvestmentFundCategorySelected: function(){
      var oneInvestmentFundCategorySelected = false;
      var selectedInvestmentFundCategories = this.investmentFundCategoriesTable
        .rows({ selected: true })
        .data();
      if (selectedInvestmentFundCategories.length == 1) {
        oneInvestmentFundCategorySelected = true;
      }
      return oneInvestmentFundCategorySelected;
    },
    enableRemoveButton: function () {
      if (this.anyInvestmentFundCategoriesSelected()) {
        this.removeButtonEnabled = true;
      } else {
        this.removeButtonEnabled = false;
      }
    },
    enableEditButton: function () {
      if (this.oneInvestmentFundCategorySelected()) {
        this.editButtonEnabled = true;
      } else {
        this.editButtonEnabled = false;
      }
    },
    deselectAllRows: function () {
      this.investmentFundCategoriesTable.rows({ selected: true }).deselect();
    },
  },
  mounted() {
    investmentFundCategoriesService.getActiveInvestmentFundCategories().then((investmentFundCategories) => {
      this.init(investmentFundCategories);
    });
  },
};
</script>


