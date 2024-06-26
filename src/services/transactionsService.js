import axios from "axios";
import { baseUrl } from "../common/config.js";

let getTransactions = function(){
    return new Promise((resolve) => {
        let getTransactionsUrl = `${baseUrl}/FinancialTransactions`;
        axios.get(getTransactionsUrl).then(response => resolve(response.data));
    });
}

let deleteTransactionById = function (transactionId) {

    return new Promise((resolve) => {
        let deleteTransactionsUrl = baseUrl + "/FinancialTransactions/" + transactionId;
        axios.delete(deleteTransactionsUrl).then(response => resolve(response.data));
    });
}

let addTransaction = function(transaction){
    return new Promise((resolve) => {
        let addTransactionsUrl = `${baseUrl}/FinancialTransactions`;
        axios.post(addTransactionsUrl, transaction).then(response => resolve(response.data));
    });
}

let getFinancialReport = function(periodId = null, startDate = null, endDate = null, categoryId = null){
    return new Promise((resolve) => {
        let getFinancialReportUrl = `${baseUrl}/FinancialTransactions/FinancialReport`;
        axios.request({
            url: getFinancialReportUrl,
            method: 'get',
            params: {
                periodId,
                startDate,
                endDate,
                categoryId
            }
        } ).then(response => resolve(response.data));
    });
}


let addManyTransactionsXml = function(request){
    return new Promise((resolve) => {
        let addManyTransactionsXmlUrl = `${baseUrl}/FinancialTransactions/Many/Xml`;
        axios.post(addManyTransactionsXmlUrl, request).then(response => resolve(response.data));
    });
}

let transactionsService = {
    getTransactions,
    deleteTransactionById,
    addTransaction,
    getFinancialReport,
    addManyTransactionsXml
};



export {
    transactionsService
};