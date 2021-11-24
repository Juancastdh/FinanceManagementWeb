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

function getTransactions(callback){

    var getTransactionsUrl = baseUrl + "/FinancialTransactions";

    $.get(getTransactionsUrl, function (transactions) {
        callback(transactions);
    });

}

function addTransaction(transaction, callback) {
    var createTransactionsUrl = baseUrl + "/FinancialTransactions";

    $.ajax({
        type: "POST",
        url: createTransactionsUrl,
        data: JSON.stringify(transaction),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {
            callback();
        },
        error: function (errMsg) {
            console.log(errMsg);
        }
    });
}

function deleteTransactionById(transactionId, callback){

    var deleteTransactionUrl = baseUrl + "/FinancialTransactions/" + transactionId;
    $.ajax({
        type: "DELETE",
        url: deleteTransactionUrl,
        success: function () {
            callback();
        },
        error: function (errMsg) {
            console.log(errMsg);
        }
    });
}