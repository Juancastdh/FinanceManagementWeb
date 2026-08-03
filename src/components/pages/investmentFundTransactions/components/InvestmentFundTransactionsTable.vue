<template>
  <div class="row">
    <div class="card recent-sales">
      <div class="filter">
        <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
          <li class="dropdown-header text-start">
            <h6>Filter</h6>
          </li>
          <li v-for="filter in filters" v-bind:key="filter.id">
            <a class="dropdown-item" name="reports-filter" v-bind:id="filter.id"
              v-on:click="changeCurrentFilter(filter)">{{ filter.name }}</a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <h5 class="card-title">
          Investment Fund Transactions
          <span id="current-reports-filter">/{{ currentFilter.name }}</span>
        </h5>
        <table class="table table-dark table-striped" id="transactionsTable">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">#</th>
              <th scope="col">Date</th>
              <th scope="col">Description</th>
              <th scope="col">Category</th>
              <th scope="col">Value</th>
              <th scope="col">Type</th>
              <th scope="col">Fund</th>
              <th scope="col">Currency</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <div class="text-left">
          <button class="btn btn-primary" type="button" data-bs-toggle="dropdown">
          Actions
        </button>
        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
          <li>
            <a
              class="dropdown-item"
              v-bind:class= "{ disabled: !editButtonEnabled}"
              id="editButton"
              v-on:click="editSelectedInvestmentFundTransaction"
            >
              Edit
            </a>
          </li>
          <li>
            <a
              class="dropdown-item"
              v-bind:class= "{ disabled: !removeButtonEnabled}"
              id="removeButton"
              v-on:click="removeSelectedInvestmentFundTransactions"
            >
              Remove
            </a>
          </li>         
        </ul>
        </div>
        <div class="text-left"></div>
      </div>
    </div>
  </div>
</template>

<script>
import "datatables.net-bs4";
import "datatables.net-select-bs4";
import "jquery-datatables-checkboxes";
import $ from "jquery";
import { investmentFundTransactionsService } from "../../../../services/investmentFundTransactionsService.js";
import {
  convertDateTimeString,
  monthRanges,
  getDateRangeByMonthRange,
  convertDateToDotNetString,
} from "../../../../common/utils.js";

var possibleFilters = [
  {
    id: "filter-month",
    name: "Last Month",
  },
  {
    id: "filter-quarter",
    name: "Last Quarter",
  },
  {
    id: "filter-semester",
    name: "Last Semester",
  },
  {
    id: "filter-year",
    name: "Last Year",
  },
  {
    id: "filter-none",
    name: "All",
  },
];

export default {
  name: "InvestmentFundTransactionsTable",
  data: function () {
    return {
      filters: possibleFilters,
      currentFilter: possibleFilters[0],
      removeButtonEnabled: false,
      editButtonEnabled: false,
      transactionsTable: null,
    };
  },
  methods: {
    init: function (transactions) {
      var self = this;
      self.transactionsTable = $("#transactionsTable").DataTable({
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
        data: transactions,

        columns: [
          {
            data: "id",
          },
          {
            data: "id",
          },
          {
            data: "date",
            render: function (data) {
              return convertDateTimeString(data);
            },
          },
          {
            data: "description",
          },
          {
            data: "investmentFundCategory",
            render: function (data) {
              return data.name;
            },
          },
          {
            data: "amount",
            render: function (data) {
              return "RD$ " + data;
            },
          },
          {
            data: "type",
            render: function (data) {
              if (data == 1) {
                return 'Contribution';
              } else if (data == 2) {
                return 'Withdrawal';
              } else if (data == 3) {
                return 'Dividend';
              } else {
                return 'Unknown';
              }
            },
          },
          {
            data: "investmentFundCategory",
            render: function (data) {
              var fundName = "";
              if (data != null) {
                fundName = data.investmentFund.name;
              }
              return fundName;
            },
          },
          {
            data: "investmentFundCategory",
            render: function (data) {
              var fundCurrency = "";
              if (data != null) {
                fundCurrency = data.investmentFund.currency;
              }
              return fundCurrency;
            },
          },
        ],
      });

      self.transactionsTable.on("select", function () {
          self.enableRemoveButton();
        self.enableEditButton();
      });
      self.transactionsTable.on("deselect", function () {
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
      this.transactionsTable.clear();
    },
    reload: function () {
      this.getInvestmentFundTransactionsBasedOnFilter().then((investmentFundTransactions) => {
        this.render(investmentFundTransactions);
      });
    },
    render: function (transactions) {
      this.transactionsTable.rows.add(transactions);
      this.transactionsTable.draw();
    },removeSelectedInvestmentFundTransactions: function () {
      var self = this;
      var selectedInvestmentFundTransactions = self.transactionsTable
        .rows({ selected: true })
        .data();
      var removedInvestmentFundTransactions = 0;
      selectedInvestmentFundTransactions.each(function (investmentFundTransaction) {
        investmentFundTransactionsService.deleteInvestmentFundTransactionById(investmentFundTransaction.id).then(() => {
          removedInvestmentFundTransactions++;
          if (removedInvestmentFundTransactions == selectedInvestmentFundTransactions.length) {
            self.refresh();
          }
        });
      });
    },
    editSelectedInvestmentFundTransaction: function() {

      var self = this;
      var selectedInvestmentFundTransactions = self.transactionsTable
        .rows({ selected: true })
        .data();
      selectedInvestmentFundTransactions.each(function (investmentFundTransaction){
        self.$emit("investment-fund-transaction-edited", investmentFundTransaction);
      });      
    },
    anyInvestmentFundTransactionsSelected: function () {
      var anyInvestmentFundTransactionsSelected = false;
      var selectedInvestmentFundTransactions = this.transactionsTable
        .rows({ selected: true })
        .data();
      if (selectedInvestmentFundTransactions.length > 0) {
        anyInvestmentFundTransactionsSelected = true;
      }
      return anyInvestmentFundTransactionsSelected;
    },
    oneInvestmentFundTransactionSelected: function(){
      var oneInvestmentFundTransactionSelected = false;
      var selectedInvestmentFundTransactions = this.transactionsTable
        .rows({ selected: true })
        .data();
      if (selectedInvestmentFundTransactions.length == 1) {
        oneInvestmentFundTransactionSelected = true;
      }
      return oneInvestmentFundTransactionSelected;
    },
    enableRemoveButton: function () {
      if (this.anyInvestmentFundTransactionsSelected()) {
        this.removeButtonEnabled = true;
      } else {
        this.removeButtonEnabled = false;
      }
    },
    enableEditButton: function () {
      if (this.oneInvestmentFundTransactionSelected()) {
        this.editButtonEnabled = true;
      } else {
        this.editButtonEnabled = false;
      }
    },
    deselectAllRows: function () {
      this.transactionsTable.rows({ selected: true }).deselect();
    },
    changeCurrentFilter: function (filter) {
      this.currentFilter = filter;
      this.refresh();
    },
    getInvestmentFundTransactionsBasedOnFilter: function () {
if (this.currentFilter.id == "filter-none") {
        return investmentFundTransactionsService.getInvestmentFundTransactions();
      } else {
        let monthRangeId = this.currentFilter.id.replace("filter-", "");
        let monthRange = monthRanges[monthRangeId];
        let dateRangeFilter = getDateRangeByMonthRange(monthRange);
        return investmentFundTransactionsService.getInvestmentFundTransactions(
          null,
          null,
          convertDateToDotNetString(dateRangeFilter.startDate),
          convertDateToDotNetString(dateRangeFilter.endDate)
        );
      }
    },

  },
  mounted() {
   investmentFundTransactionsService.getInvestmentFundTransactions().then((investmentFundTransactions) => {
      this.init(investmentFundTransactions);
    });
  },
};
</script>
