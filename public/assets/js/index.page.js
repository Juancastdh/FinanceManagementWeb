var categoriesList = [];


$(document).ready(function () {
    loadPage();

});

function loadPage() {
    loadCategoriesList(function () {
        loadCategoriesTotalValues(function(){
            loadCategorySummaryCards();
        });
    });
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
            if(categoriesProcessed == categoriesList.length){
                callback();
            }            
        })
    });
}

function loadCategorySummaryCards(){
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