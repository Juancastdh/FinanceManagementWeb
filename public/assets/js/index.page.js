var categoriesList = [];
var currentPeriod;
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

function setCurrentPeriod(callback) {

  var currentDate = new Date();

  getPeriodByDate(currentDate, function (period) {
    currentPeriod = period;
    callback();
  })
}

function getPeriodByDate(date, callback) {

  getPeriods(function (periods) {
    period = periods.find(period => date >= (new Date(period.startDate)) && date < (new Date(period.endDate)));
    callback(period);
  });
}

function loadBudgetChart() {

  var indicators = [];
  var budgetData = [];
  var expenseData = [];

  var categoriesCount = 0;

  categoriesList.forEach(category => {

    getFinancialReport({ categoryId: category.id, periodId: currentPeriod.id, isExpense: false }, function (incomeFinancialReport) {
      getFinancialReport({ categoryId: category.id, periodId: currentPeriod.id, isExpense: true }, function (expenseFinancialReport) {
        indicators.push({ name: category.name, max: (incomeFinancialReport.totalValue + expenseFinancialReport.totalValue) });
        budgetData.push(incomeFinancialReport.totalValue);
        expenseData.push(expenseFinancialReport.totalValue);
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
      data: ['Allocated Budget', 'Actual Spending']
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
    }]
  });
}

function getPeriodsThatStartInARangeOMonths(startMonth, endMonth, callback) {
  getPeriods(function (periods) {
    filteredPeriods = periods.filter(period => (new Date(period.startDate).getMonth() + 1) >= startMonth && (new Date(period.startDate).getMonth() + 1) <= endMonth);
    callback(filteredPeriods);
  });
}

function getMonthRangeByType(type) {

  var currentDate = new Date();
  var currentMonth = currentDate.getMonth() + 1;
  var monthRange = { startMonth: 0, endMonth: 0 }

  if (type == "month") {
    monthRange.startMonth = currentMonth;
    monthRange.endMonth = currentMonth;
  }

  if (type == "quarter") {

    if (currentMonth <= 4) {
      monthRange.startMonth = 1;
      monthRange.endMonth = 4;
    }
    else if (currentMonth <= 8) {
      monthRange.startMonth = 5;
      monthRange.endMonth = 8;
    }
    else {
      monthRange.startMonth = 9;
      monthRange.endMonth = 12;
    }
  }

  if (type == "semester") {
    if (currentMonth <= 6) {
      monthRange.startMonth = 1;
      monthRange.endMonth = 6;
    }
    else {
      monthRange.startMonth = 7;
      monthRange.endMonth = 12;
    }
  }

  if (type == "year") {
    monthRange.startMonth = 1;
    monthRange.endMonth = 12;
  }

  return monthRange;
}

function loadReportsChart() {

  var seriesData = [];

  var periodFilterRange = getMonthRangeByType(reportsSelectedFilter.replace("filter-", ""));

  var periodsCount = 0;

  getPeriodsThatStartInARangeOMonths(periodFilterRange.startMonth, periodFilterRange.endMonth, function(periods){
    periods.forEach(period => {
      getFinancialReport({ periodId: period.id }, function (financialReport) {
        var seriesValue = 0;

        var transactionsGroupedByDate = groupValuesByDate(financialReport.financialTransactions);

        transactionsGroupedByDate.forEach(transaction =>{

          seriesValue += transaction.value;

          seriesData.push({
            y: seriesValue,
            x: transaction.date
          });
        });
        periodsCount++;
        if(periodsCount == periods.length){
          seriesData.sort((a, b) => (a.x > b.x) ? 1 : ((b.x > a.x) ? -1 : 0));

          if(currentReportsChart == null){
            initializeReportsChart(seriesData);
          }
          else{
            updateReportsChart(seriesData);
          }      
        }
      });
    });
  });
}

function groupValuesByDate(transactions){
  groupedTransactions = [];
  transactions.forEach(transaction => {
    var transactionIndex = groupedTransactions.findIndex(t => t.date == transaction.date);

    if(transactionIndex >= 0){
      if(transaction.isExpense == false){
        groupedTransactions[transactionIndex].value += transaction.value
      }
      else{
        groupedTransactions[transactionIndex].value -= transaction.value
      }         
    }
    else{
      var transactionValue = 0;
      
      if(transaction.isExpense == false)
      {
        transactionValue = transaction.value;
      }
      else{
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
    }
  });

  currentReportsChart.render();
}

function updateReportsChart(seriesData){

  currentReportsChart.updateSeries([{
    name: 'Balance',
    data: seriesData
  }]);
}
