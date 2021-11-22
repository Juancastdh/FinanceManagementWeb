function getFinancialReport(parameters, callback){

    var getFinancialReportUrl = new URL (baseUrl + "/FinancialTransactions/FinancialReport");

    console.log(parameters);

    if(parameters.periodId != null){

        getFinancialReportUrl.searchParams.append("perioId", parameters.periodId);
    }

    if(parameters.categoryId != null){
  
        getFinancialReportUrl.searchParams.append("categoryId", parameters.categoryId);
    }

    if(parameters.isExpense != null){
        getFinancialReportUrl.searchParams.append("isExpense", parameters.isExpense);
    }

    console.log(getFinancialReportUrl.toString());

    $.get(getFinancialReportUrl.toString(), function (data) {
        callback(data);
        });
}