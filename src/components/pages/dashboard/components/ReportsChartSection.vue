<template>
  <div class="col-12 row">
    <div class="card recent-sales">
      <div class="filter">
        <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
          <li class="dropdown-header text-start">
            <h6>Filter</h6>
          </li>
          <li v-for="filter in graphic.filters" v-bind:key="filter.id">
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
          <span id="current-reports-filter">/{{ graphic.currentFilter.name }}</span>
        </h5>
        <VueApexCharts :options="graphic.chartOptions" :series="graphic.chartSeries" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
import { baseUrl } from '../../../../common/config'
import { TransactionsService } from '../../../services/transactionsService'
import { monthRanges, getDateRangeByMonthRange } from '../../../../common/utils'
import type { FinancialReport } from '@/components/services/models/financialReport'
import type { FinancialTransaction } from '@/components/services/models/financialTransaction'
import { onMounted, ref } from 'vue'

const possibleFilters = ref([
  {
    id: 'filter-month',
    name: 'Last Month'
  },
  {
    id: 'filter-quarter',
    name: 'Last Quarter'
  },
  {
    id: 'filter-semester',
    name: 'Last Semester'
  },
  {
    id: 'filter-year',
    name: 'Last Year'
  }
])

const graphic = ref({
  filters: possibleFilters.value,
  currentFilter: possibleFilters.value[0],
  chartSeries: [
    {
      name: 'Balance',
      data: []
    }
  ],
  chartOptions: {
    chart: {
      height: 350,
      type: 'area',
      toolbar: {
        show: false
      },
      foreColor: '#f6f9ff'
    },
    markers: {
      size: 4
    },
    colors: ['#4154f1', '#2eca6a', '#ff771d'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.4,
        stops: [0, 90, 100]
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      type: 'datetime',
      labels: {
        format: 'dd/MM/yyyy'
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    tooltip: {
      theme: 'dark'
    }
  }
})

async function getBaseFinancialReport(): Promise<FinancialReport> {
  let monthRangeId = graphic.value.currentFilter.id.replace('filter-', '')
  let monthRange = monthRanges[monthRangeId]
  let dateRangeFilter = getDateRangeByMonthRange(monthRange)
  let baseDate = new Date(
    dateRangeFilter.startDate.getFullYear(),
    dateRangeFilter.startDate.getMonth(),
    dateRangeFilter.startDate.getDate() - 1
  )
  let transactionsService = new TransactionsService(baseUrl)
  let baseFinancialReport = await transactionsService.getFinancialReport(null, null, baseDate, null)
  return baseFinancialReport
}

async function getFinancialReportBasedOnCurrentFilter(): Promise<FinancialReport> {
  let monthRangeId = graphic.value.currentFilter.id.replace('filter-', '')
  let monthRange = monthRanges[monthRangeId]
  let dateRangeFilter = getDateRangeByMonthRange(monthRange)
  let transactionsService = new TransactionsService(baseUrl)
  let financialReport = await transactionsService.getFinancialReport(
    null,
    dateRangeFilter.startDate,
    dateRangeFilter.endDate,
    null
  )
  return financialReport
}

async function groupTransactionValuesByDate(transactions: FinancialTransaction[]) {
  let groupedTransactions = []
  for await (const transaction of transactions) {
    let transactionIndex = groupedTransactions.findIndex((t) => t.date == transaction.date)

    if (transactionIndex >= 0) {
      if (transaction.isExpense == false) {
        groupedTransactions[transactionIndex].value += transaction.value
      } else {
        groupedTransactions[transactionIndex].value -= transaction.value
      }
    } else {
      var transactionValue = 0

      if (transaction.isExpense == false) {
        transactionValue = transaction.value
      } else {
        transactionValue = 0 - transaction.value
      }

      groupedTransactions.push({
        date: transaction.date,
        value: transactionValue
      })
    }
  }

  return groupedTransactions
}

async function load(): Promise<void> {
  let seriesData = []
  let seriesValue = 0
  let baseFinancialReport = await getBaseFinancialReport()
  seriesValue = baseFinancialReport.totalValue
  seriesValue = Math.round((seriesValue + Number.EPSILON) * 100) / 100
  let currentFilterFinancialReport = await getFinancialReportBasedOnCurrentFilter()
  let transactionsGroupedByDate = await groupTransactionValuesByDate(
    currentFilterFinancialReport.financialTransactions
  )
  var transactionsProcessed = 0
  transactionsGroupedByDate.forEach((transaction) => {
    seriesValue += transaction.value
    seriesValue = Math.round((seriesValue + Number.EPSILON) * 100) / 100
    seriesData.push({
      y: seriesValue,
      x: transaction.date
    })
    transactionsProcessed++
    if (transactionsProcessed == transactionsGroupedByDate.length) {
      seriesData.sort((a, b) => (a.x > b.x ? 1 : b.x > a.x ? -1 : 0))
      graphic.value.chartSeries[0].data = seriesData
    }
  })
}

function changeCurrentFilter(filter: any) {
  graphic.value.currentFilter = filter
  load()
}

onMounted(async () => {
  await load()
})

// export default {
//   name: 'ReportsChartSection',
//   components: {
//     VueApexCharts
//   },
//   data: function () {
//     return {
//       filters: possibleFilters,
//       currentFilter: possibleFilters[0],
//       chartSeries: [
//         {
//           name: 'Balance',
//           data: []
//         }
//       ],
//       chartOptions: {
//         chart: {
//           height: 350,
//           type: 'area',
//           toolbar: {
//             show: false
//           },
//           foreColor: '#f6f9ff'
//         },
//         markers: {
//           size: 4
//         },
//         colors: ['#4154f1', '#2eca6a', '#ff771d'],
//         fill: {
//           type: 'gradient',
//           gradient: {
//             shadeIntensity: 1,
//             opacityFrom: 0.3,
//             opacityTo: 0.4,
//             stops: [0, 90, 100]
//           }
//         },
//         dataLabels: {
//           enabled: false
//         },
//         xaxis: {
//           type: 'datetime',
//           labels: {
//             format: 'dd/MM/yyyy'
//           }
//         },
//         stroke: {
//           curve: 'smooth',
//           width: 2
//         },
//         tooltip: {
//           theme: 'dark'
//         }
//       }
//     }
//   },
//   methods: {
//     changeCurrentFilter: function (filter) {
//       this.currentFilter = filter
//       this.load()
//     },
//     load: function () {
//       var seriesData = []
//       var self = this
//       var seriesValue = 0

//       self
//         .getBaseFinancialReport()
//         .then((baseFinancialReport) => {
//           seriesValue = baseFinancialReport.totalValue
//           seriesValue = Math.round((seriesValue + Number.EPSILON) * 100) / 100
//           return self.getFinancialReportBasedOnCurrentFilter()
//         })
//         .then((financialReport) => {
//           var transactionsGroupedByDate = self.groupTransactionValuesByDate(
//             financialReport.financialTransactions
//           )
//           var transactionsProcessed = 0
//           transactionsGroupedByDate.forEach((transaction) => {
//             seriesValue += transaction.value
//             seriesValue = Math.round((seriesValue + Number.EPSILON) * 100) / 100
//             seriesData.push({
//               y: seriesValue,
//               x: transaction.date
//             })
//             transactionsProcessed++
//             if (transactionsProcessed == transactionsGroupedByDate.length) {
//               seriesData.sort((a, b) => (a.x > b.x ? 1 : b.x > a.x ? -1 : 0))
//               self.chartSeries[0].data = seriesData
//             }
//           })
//         })
//     },
//     groupTransactionValuesByDate: function (transactions) {
//       var groupedTransactions = []
//       transactions.forEach((transaction) => {
//         var transactionIndex = groupedTransactions.findIndex((t) => t.date == transaction.date)

//         if (transactionIndex >= 0) {
//           if (transaction.isExpense == false) {
//             groupedTransactions[transactionIndex].value += transaction.value
//           } else {
//             groupedTransactions[transactionIndex].value -= transaction.value
//           }
//         } else {
//           var transactionValue = 0

//           if (transaction.isExpense == false) {
//             transactionValue = transaction.value
//           } else {
//             transactionValue = 0 - transaction.value
//           }

//           groupedTransactions.push({
//             date: transaction.date,
//             value: transactionValue
//           })
//         }
//       })

//       return groupedTransactions
//     },
//     getBaseFinancialReport: function () {
//       let monthRangeId = this.currentFilter.id.replace('filter-', '')
//       let monthRange = monthRanges[monthRangeId]
//       let dateRangeFilter = getDateRangeByMonthRange(monthRange)
//       let baseDate = new Date(
//         dateRangeFilter.startDate.getFullYear(),
//         dateRangeFilter.startDate.getMonth(),
//         dateRangeFilter.startDate.getDate() - 1
//       )
//       return transactionsService.getFinancialReport(null, null, convertDateToDotNetString(baseDate))
//     },
//     getFinancialReportBasedOnCurrentFilter: function () {
//       let monthRangeId = this.currentFilter.id.replace('filter-', '')
//       let monthRange = monthRanges[monthRangeId]
//       let dateRangeFilter = getDateRangeByMonthRange(monthRange)
//       return transactionsService.getFinancialReport(
//         null,
//         convertDateToDotNetString(dateRangeFilter.startDate),
//         convertDateToDotNetString(dateRangeFilter.endDate)
//       )
//     }
//   },
//   mounted() {
//     //this.load();
//   }
// }
</script>
