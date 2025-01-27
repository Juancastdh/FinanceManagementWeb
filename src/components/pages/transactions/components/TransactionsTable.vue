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
              <th scope="col">Account</th>
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
            :disabled="!removeButtonEnabled"
          >
            Remove
          </button>
          <hr>
          <button
            type="button"
            class="btn btn-primary"
            id="uploadTransactionsButton"
            v-on:click="onPickFile"
          >
            Upload
          </button>
          <input
            type="file"
            style="display: none"
            ref="fileInput"
            accept=".xml,.json"
            v-on:change="onFilePicked"
          />
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
import { transactionsService } from "../../../../services/transactionsService.js";
import { periodsService } from "../../../../services/periodsService.js";
import {
  convertDateTimeString,
  monthRanges,
  getDateRangeByMonthRange,
  convertDateToDotNetString,
} from "../../../../common/utils.js";
import { categoriesService } from "../../../../services/categoriesService.js";

var possibleFilters = [
  {
    id: "filter-period",
    name: "Last Period",
  },
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
  name: "TransactionsTable",
  props: ["accounts"],
  data: function () {
    return {
      latestPeriod: null,
      filters: possibleFilters,
      currentFilter: possibleFilters[0],
      removeButtonEnabled: false,
      transactionsTable: null,
      categories: []
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
          {
            data: "accountIdentifier",
            render: function (data) {
              return self.getAccountByIdentifier(data).description;
            },
          },
        ],
      });

      self.transactionsTable.on("select", function () {
        self.enableRemoveButton();
      });
      self.transactionsTable.on("deselect", function () {
        self.enableRemoveButton();
      });
    },
    refresh: function () {
      this.deselectAllRows();
      this.clear();
      this.reload();
      this.enableRemoveButton();
    },
    clear: function () {
      this.transactionsTable.clear();
    },
    reload: function () {
      this.getFinancialReportBasedOnCurrentFilter().then((financialReport) => {
        this.render(financialReport.financialTransactions);
      });
    },
    render: function (transactions) {
      this.transactionsTable.rows.add(transactions);
      this.transactionsTable.draw();
    },
    removeSelectedTransactions: function () {
      var self = this;
      var selectedTransactions = self.transactionsTable
        .rows({ selected: true })
        .data();
      var removedTransactions = 0;
      selectedTransactions.each(function (transaction) {
        transactionsService.deleteTransactionById(transaction.id).then(() => {
          removedTransactions++;
          if (removedTransactions == selectedTransactions.length) {
            self.refresh();
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
        return transactionsService.getFinancialReport(
          null,
          convertDateToDotNetString(dateRangeFilter.startDate),
          convertDateToDotNetString(dateRangeFilter.endDate)
        );
      }
    },
    anyTransactionsSelected: function () {
      var anyTransactionsSelected = false;
      var selectedTransactions = this.transactionsTable
        .rows({ selected: true })
        .data();
      if (selectedTransactions.length > 0) {
        anyTransactionsSelected = true;
      }
      return anyTransactionsSelected;
    },
    enableRemoveButton: function () {
      if (this.anyTransactionsSelected()) {
        this.removeButtonEnabled = true;
      } else {
        this.removeButtonEnabled = false;
      }
    },
    deselectAllRows: function () {
      this.transactionsTable.rows({ selected: true }).deselect();
    },
    onPickFile: function () {
      this.$refs.fileInput.click();
    },
    onFilePicked: function (event) {
      const reference = this;
      const files = event.target.files;
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        var request = {
          XmlBase64File: fileReader.result.split(',')[1]
        };
        transactionsService.addManyTransactionsXml(request);
        reference.refresh();
      });
      fileReader.readAsDataURL(files[0]);
    },
    getAccountByIdentifier: function (accountIdentifier) {
      var account = this.accounts.find((account) => account.identifier == accountIdentifier);
      if(account == null){
        account = {
          id: null,
          identifier: "",
          description: ""
        }
      }
      return account;
    },    
  },
  mounted() {
    periodsService
      .getLatestPeriod()
      .then((period) => {
        this.latestPeriod = period;
        return this.getFinancialReportBasedOnCurrentFilter();
      })
      .then((financialReport) => {
        this.init(financialReport.financialTransactions);
      });

      categoriesService
      .getCategories()
      .then((categories) => {
        this.categories = categories;
      });

  },
};
</script>


