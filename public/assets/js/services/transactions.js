function getFinancialReport(parameters, callback){

    var getFinancialReportUrl = new URL (baseUrl + "/FinancialTransactions/FinancialReport");


    if(parameters.periodId != null){

        getFinancialReportUrl.searchParams.append("periodId", parameters.periodId);
    }

    if(parameters.categoryId != null){
  
        getFinancialReportUrl.searchParams.append("categoryId", parameters.categoryId);
    }

    if(parameters.isExpense != null){
        getFinancialReportUrl.searchParams.append("isExpense", parameters.isExpense);
    }

    $.get(getFinancialReportUrl.toString(), function (data) {
        callback(data);
        });
}