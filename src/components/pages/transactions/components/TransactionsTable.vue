<template>
  <div class="row">
    <div class="card recent-sales">
      <div class="filter">
        <a class="icon" href="#" data-bs-toggle="dropdown"
          ><i class="bi bi-three-dots"></i
        ></a>
        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
          <li class="dropdown-header text-start">
            <h6>Filter</h6>
          </li>
          <li v-for="filter in filters" v-bind:key="filter.id">
            <a
              class="dropdown-item"
              name="reports-filter"
              v-bind:id="filter.id"
              v-on:click="changeCurrentFilter(filter)"
              >{{ filter.name }}</a
            >
          </li>
        </ul>
      </div>
      <div class="card-body">
        <h5 class="card-title">
          Transactions
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
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <div class="text-left">
          <button
            type="button"
            class="btn btn-primary"
            id="removeButton"
            v-on:click="removeSelectedTransactions"
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
import { transactionsService } from "../../../../services/transactionsService.js";
import { categoriesService } from "../../../../services/categoriesService.js";
import { periodsService } from "../../../../services/periodsService.js";
import {
  convertDateTimeString,
  monthRanges,
  getDateRangeByMonthRange,
  convertDateToDotNetString
} from "../../../../common/utils.js";

var possibleFilters = [
  {
    id: "filter-period",
    name: "This Period",
  },
  {
    id: "filter-month",
    name: "This Month",
  },
  {
    id: "filter-quarter",
    name: "This Quarter",
  },
  {
    id: "filter-semester",
    name: "This Semester",
  },
  {
    id: "filter-year",
    name: "This Year",
  },
  {
    id: "filter-none",
    name: "All",
  },
];

export default {
  name: "TransactionsTable",
  data: function () {
    return {
      categories: [],
      latestPeriod: null,
      filters: possibleFilters,
      currentFilter: possibleFilters[0],
    };
  },
  methods: {
    init: function (transactions) {
      var self = this;
      $("#transactionsTable").DataTable({
        data: transactions,
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
            data: "date",
            render: function (data) {
              return convertDateTimeString(data);
            },
          },
          {
            data: "description",
          },
          {
            data: "categoryId",
            render: function (data) {
              return self.getCategoryById(data).name;
            },
          },
          {
            data: "value",
            render: function (data) {
              return "RD$ " + data;
            },
          },
          {
            data: "isExpense",
            render: function (data) {
              if (data == true) {
                return '<span class="badge bg-danger">Expense</span>';
              } else {
                return '<span class="badge bg-success">Income</span>';
              }
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
      var transactionsTable = $("#transactionsTable").DataTable();
      transactionsTable.clear();
    },
    reload: function () {
      this.getFinancialReportBasedOnCurrentFilter().then((financialReport) => {
        this.render(financialReport.financialTransactions);
      });
    },
    render: function (transactions) {
      var transactionsTable = $("#transactionsTable").DataTable();
      transactionsTable.rows.add(transactions);
      transactionsTable.draw();
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
    removeSelectedTransactions: function () {
      var selectedCheckboxes = $("input[name=cb]:checked");
      var removedTransactions = 0;
      var self = this;
      selectedCheckboxes.each(function () {
        var transactionId = $(this).attr("value");
        transactionsService.deleteTransactionById(transactionId).then(() => {
          removedTransactions++;
          if (removedTransactions == selectedCheckboxes.length) {
            self.refresh();
            $("#removeButton").prop("disabled", true);
          }
        });
      });
    },
    getCategoryById: function (categoryId) {
      return this.categories.find((category) => category.id == categoryId);
    },
    changeCurrentFilter: function (filter) {
      this.currentFilter = filter;
      this.refresh();
    },
    getFinancialReportBasedOnCurrentFilter: function () {
      if (this.currentFilter.id == "filter-period") {
        return transactionsService.getFinancialReport(this.latestPeriod.id);
      } else if (this.currentFilter.id == "filter-none") {
        return transactionsService.getFinancialReport();
      } else {
        let monthRangeId = this.currentFilter.id.replace("filter-", "");
        let monthRange = monthRanges[monthRangeId];
        let dateRangeFilter = getDateRangeByMonthRange(monthRange);
        return transactionsService.getFinancialReport(null, convertDateToDotNetString(dateRangeFilter.startDate), convertDateToDotNetString(dateRangeFilter.endDate));
      }
    },
  },
  mounted() {
    categoriesService
      .getCategories()
      .then((categories) => {
        this.categories = categories;
        return periodsService.getLatestPeriod()
      })
      .then((period) => {
        this.latestPeriod = period;
        return this.getFinancialReportBasedOnCurrentFilter();
      })
      .then((financialReport) => {
        this.init(financialReport.financialTransactions);
      });
  },
};
</script>


