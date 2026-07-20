<template>
  <div class="row">
    <div class="card recent-sales">
      <div class="card-body">
        <h5 class="card-title">Investment Funds</h5>
        <table class="table table-dark table-striped" id="investmentFundsTable">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Company</th>
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
import { investmentFundsService } from "../../../../services/investmentFundsService.js";

export default {
  name: "InvestmentFundsTable",
  data: function () {
    return {
      removeButtonEnabled: false,
      editButtonEnabled: false,
      investmentFundsTable: null,
    };
  },
  methods: {
    init: function (investmentFunds) {
      var self = this;
      self.investmentFundsTable = $("#investmentFundsTable").DataTable({
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
        data: investmentFunds,
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
            data: "description"
          },
          {
            data: "company"
          },
          {
            data: "currency"
          }
        ],
      });
      self.investmentFundsTable.on("select", function () {
        self.enableRemoveButton();
        self.enableEditButton();
      });
      self.investmentFundsTable.on("deselect", function () {
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
      this.investmentFundsTable.clear();
    },
    reload: function () {
      investmentFundsService.getActiveInvestmentFunds().then((investmentFunds) => {
        this.render(investmentFunds);
      });
    },
    render: function (investmentFunds) {
      this.investmentFundsTable.rows.add(investmentFunds);
      this.investmentFundsTable.draw();
    },
    removeSelectedInvestmentFunds: function () {
      var self = this;
      var selectedInvestmentFunds = self.investmentFundsTable
        .rows({ selected: true })
        .data();
      var removedInvestmentFunds = 0;
      selectedInvestmentFunds.each(function (investmentFund) {
        investmentFundsService.deleteInvestmentFundById(investmentFund.id).then(() => {
          removedInvestmentFunds++;
          if (removedInvestmentFunds == selectedInvestmentFunds.length) {
            self.refresh();
          }
        });
      });
    },
    editSelectedInvestmentFund: function() {

      var self = this;
      var selectedInvestmentFunds = self.investmentFundsTable
        .rows({ selected: true })
        .data();
      selectedInvestmentFunds.each(function (investmentFund){
        self.$emit("investment-fund-edited", investmentFund);
      });      
    },
    anyInvestmentFundsSelected: function () {
      var anyInvestmentFundsSelected = false;
      var selectedInvestmentFunds = this.investmentFundsTable
        .rows({ selected: true })
        .data();
      if (selectedInvestmentFunds.length > 0) {
        anyInvestmentFundsSelected = true;
      }
      return anyInvestmentFundsSelected;
    },
    oneInvestmentFundSelected: function(){
      var oneInvestmentFundSelected = false;
      var selectedInvestmentFunds = this.investmentFundsTable
        .rows({ selected: true })
        .data();
      if (selectedInvestmentFunds.length == 1) {
        oneInvestmentFundSelected = true;
      }
      return oneInvestmentFundSelected;
    },
    enableRemoveButton: function () {
      if (this.anyInvestmentFundsSelected()) {
        this.removeButtonEnabled = true;
      } else {
        this.removeButtonEnabled = false;
      }
    },
    enableEditButton: function () {
      if (this.oneInvestmentFundSelected()) {
        this.editButtonEnabled = true;
      } else {
        this.editButtonEnabled = false;
      }
    },
    deselectAllRows: function () {
      this.investmentFundsTable.rows({ selected: true }).deselect();
    },
  },
  mounted() {
    investmentFundsService.getActiveInvestmentFunds().then((investmentFunds) => {
      this.init(investmentFunds);
    });
  },
};
</script>


