<template>
  <div class="col-12 row">
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
          Reports
          <span id="current-reports-filter">/{{ currentFilter.name }}</span>
        </h5>
        <VueApexCharts :options="chartOptions" :series="chartSeries" />
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import { transactionsService } from "../../../../services/transactionsService.js";
import {
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
];

export default {
  name: "ReportsChartSection",
  components: {
    VueApexCharts,
  },
  data: function () {
    return {
      filters: possibleFilters,
      currentFilter: possibleFilters[0],
      chartSeries: [
        {
          name: "Balance",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "area",
          toolbar: {
            show: false,
          },
          foreColor: "#f6f9ff",
        },
        markers: {
          size: 4,
        },
        colors: ["#4154f1", "#2eca6a", "#ff771d"],
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.3,
            opacityTo: 0.4,
            stops: [0, 90, 100],
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          type: "datetime",
          labels: {
            format: "dd/MM/yyyy",
          },
        },
        stroke: {
          curve: "smooth",
          width: 2,
        },
        tooltip: {
          theme: "dark",
        },
      },
    };
  },
  methods: {
    changeCurrentFilter: function (filter) {
      this.currentFilter = filter;
      this.load();
    },
    load: function () {
      var seriesData = [];
      var self = this;
      var seriesValue = 0;

      self
        .getBaseFinancialReport()
        .then((baseFinancialReport) => {
          seriesValue = baseFinancialReport.totalValue;
          seriesValue = Math.round((seriesValue + Number.EPSILON) * 100) / 100;
          return self.getFinancialReportBasedOnCurrentFilter();
        })
        .then((financialReport) => {
          var transactionsGroupedByDate = self.groupTransactionValuesByDate(
            financialReport.financialTransactions
          );
          var transactionsProcessed = 0;
          transactionsGroupedByDate.forEach((transaction) => {
            seriesValue += transaction.value;
            seriesValue =
              Math.round((seriesValue + Number.EPSILON) * 100) / 100;
            seriesData.push({
              y: seriesValue,
              x: transaction.date,
            });
            transactionsProcessed++;
            if (transactionsProcessed == transactionsGroupedByDate.length) {
              seriesData.sort((a, b) => (a.x > b.x ? 1 : b.x > a.x ? -1 : 0));
              self.chartSeries[0].data = seriesData;
            }
          });
        });
    },
    groupTransactionValuesByDate: function (transactions) {
      var groupedTransactions = [];
      transactions.forEach((transaction) => {
        var transactionIndex = groupedTransactions.findIndex(
          (t) => t.date == transaction.date
        );

        if (transactionIndex >= 0) {
          if (transaction.isExpense == false) {
            groupedTransactions[transactionIndex].value += transaction.value;
          } else {
            groupedTransactions[transactionIndex].value -= transaction.value;
          }
        } else {
          var transactionValue = 0;

          if (transaction.isExpense == false) {
            transactionValue = transaction.value;
          } else {
            transactionValue = 0 - transaction.value;
          }

          groupedTransactions.push({
            date: transaction.date,
            value: transactionValue,
          });
        }
      });

      return groupedTransactions;
    },
    getBaseFinancialReport: function () {
      let monthRangeId = this.currentFilter.id.replace("filter-", "");
      let monthRange = monthRanges[monthRangeId];
      let dateRangeFilter = getDateRangeByMonthRange(monthRange);
      let baseDate = new Date(
        dateRangeFilter.startDate.getFullYear(),
        dateRangeFilter.startDate.getMonth(),
        dateRangeFilter.startDate.getDate() - 1
      );
      return transactionsService.getFinancialReport(
        null,
        null,
        convertDateToDotNetString(baseDate)
      );
    },
    getFinancialReportBasedOnCurrentFilter: function () {
      let monthRangeId = this.currentFilter.id.replace("filter-", "");
      let monthRange = monthRanges[monthRangeId];
      let dateRangeFilter = getDateRangeByMonthRange(monthRange);
      return transactionsService.getFinancialReport(
        null,
        convertDateToDotNetString(dateRangeFilter.startDate),
        convertDateToDotNetString(dateRangeFilter.endDate)
      );
    },
  },
  mounted() {
    this.load();
  },
};
</script>