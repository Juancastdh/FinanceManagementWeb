var categoriesList = [];
var reportsSelectedFilter = "filter-month";
var currentReportsChart;


$(document).ready(function () {
  loadPage();

  $('a[name="reports-filter"]').click(function () {
    reportsSelectedFilter = $(this).attr('id');
    var selectedValue = $(this).text();
    $("#current-reports-filter").text(`/${selectedValue}`);
    loadReportsChart();
  });
});

function loadPage() {
  loadCategoriesList(function () {
    loadCategoriesTotalValues(function () {
      loadCategorySummaryCards();
    });
    setCurrentPeriod(function () {
      loadBudgetChart();
    });
  });
  loadReportsChart();
}

function loadCategoriesList(callback) {
  getCategories(function (categories) {
    categoriesList = categories;
    categoriesList.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
    callback();
  });
}


function loadCategoriesTotalValues(callback) {

  var categoriesProcessed = 0
  categoriesList.forEach(category => {
    getFinancialReport({ categoryId: category.id }, function (financialReport) {
      category.totalValue = financialReport.totalValue;
      categoriesProcessed++;
      if (categoriesProcessed == categoriesList.length) {
        callback();
      }
    })
  });
}

function loadCategorySummaryCards() {
  categoriesList.forEach(category => {
    addCategorySummaryCard(category.name, category.totalValue);
  });
}

function addCategorySummaryCard(categoryName, categoryBalance) {

  var categorySummaryCardTemplate = `<div class="col-xxl-4 col-md-6">
    <div class="card info-card revenue-card">
      <div class="card-body">
        <h5 class="card-title">${categoryName}</h5>
        <div class="d-flex align-items-center">
          <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
            <i class="bi bi-currency-dollar"></i>
          </div>
          <div class="ps-3">
            <h6>RD$ ${categoryBalance}</h6>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  $("#categorySummaryCards").append(categorySummaryCardTemplate);
}

function loadBudgetChart() {

  var indicators = [];
  var budgetData = [];
  var expenseData = [];

  var categoriesCount = 0;

  categoriesList.forEach(category => {

    getFinancialReport({ categoryId: category.id, periodId: currentPeriod.id, isExpense: false }, function (incomeFinancialReport) {
      getFinancialReport({ categoryId: category.id, periodId: currentPeriod.id, isExpense: true }, function (expenseFinancialReport) {
        indicators.push({ name: category.name, max: (incomeFinancialReport.totalValue + (0 - expenseFinancialReport.totalValue)) });
        budgetData.push(incomeFinancialReport.totalValue);
        expenseData.push(0 - expenseFinancialReport.totalValue);
        categoriesCount++;
        if (categoriesCount == categoriesList.length) {
          renderBudgetChart(indicators, budgetData, expenseData);
        }
      });
    });

  });
}

function renderBudgetChart(indicators, budgetData, expenseData) {

  echarts.init(document.querySelector("#budgetChart")).setOption({
    legend: {
      data: ['Allocated Budget', 'Actual Spending'],
      textStyle: {
        color: "#f6f9ff"
      }
    },
    radar: {
      indicator: indicators
    },
    series: [{
      name: 'Budget vs spending',
      type: 'radar',
      data: [{
        value: budgetData,
        name: 'Allocated Budget'
      },
      {
        value: expenseData,
        name: 'Actual Spending'
      }
      ]
    }],
    textStyle: {
      color: "#f6f9ff"

    }
  });
}

function getPeriodsThatStartInARangeOMonths(startMonth, endMonth, callback) {
  getPeriods(function (periods) {
    filteredPeriods = periods.filter(period => (new Date(period.startDate).getMonth() + 1) >= startMonth && (new Date(period.startDate).getMonth() + 1) <= endMonth);
    callback(filteredPeriods);
  });
}

function loadReportsChart() {

  var seriesData = [];

  var financialReportFilter = getDateRangeByType(reportsSelectedFilter.replace("filter-", ""));

  var baseDate = new Date(financialReportFilter.startDate.getFullYear(), financialReportFilter.startDate.getMonth(), financialReportFilter.startDate.getDate() - 1);

  getFinancialReport({endDate: convertDateToDotNetString(baseDate)}, function(initialFinancialReport){
    var seriesValue = initialFinancialReport.totalValue;
    seriesValue = Math.round((seriesValue + Number.EPSILON) * 100) / 100;
    seriesData.push({
      y: seriesValue,
      x: baseDate
    });
    getFinancialReport({startDate: convertDateToDotNetString(financialReportFilter.startDate), endDate: convertDateToDotNetString(financialReportFilter.endDate)}, function(financialReport){
      var transactionsGroupedByDate = groupValuesByDate(financialReport.financialTransactions);
      var transactionsProcessed = 0;
      transactionsGroupedByDate.forEach(transaction => {

        seriesValue += transaction.value;

        seriesValue = Math.round((seriesValue + Number.EPSILON) * 100) / 100;

        seriesData.push({
          y: seriesValue,
          x: transaction.date
        });
        transactionsProcessed++;

        if(transactionsProcessed == transactionsGroupedByDate.length){
          seriesData.sort((a, b) => (a.x > b.x) ? 1 : ((b.x > a.x) ? -1 : 0));

          if (currentReportsChart == null) {
            initializeReportsChart(seriesData);
          }
          else {
            updateReportsChart(seriesData);
          }
        }
      });
    });
  });
}

function groupValuesByDate(transactions) {
  groupedTransactions = [];
  transactions.forEach(transaction => {
    var transactionIndex = groupedTransactions.findIndex(t => t.date == transaction.date);

    if (transactionIndex >= 0) {
      if (transaction.isExpense == false) {
        groupedTransactions[transactionIndex].value += transaction.value
      }
      else {
        groupedTransactions[transactionIndex].value -= transaction.value
      }
    }
    else {
      var transactionValue = 0;

      if (transaction.isExpense == false) {
        transactionValue = transaction.value;
      }
      else {
        transactionValue = 0 - transaction.value;
      }

      groupedTransactions.push({
        date: transaction.date,
        value: transactionValue
      });
    }
  });

  return groupedTransactions;
}

function initializeReportsChart(seriesData) {

  currentReportsChart = new ApexCharts(document.querySelector("#reportsChart"), {
    series: [{
      name: 'Balance',
      data: seriesData
    }],
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
      type: "gradient",
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
      theme: "dark"
    }
  });

  currentReportsChart.render();
}

function updateReportsChart(seriesData) {

  currentReportsChart.updateSeries([{
    name: 'Balance',
    data: seriesData
  }]);
}


