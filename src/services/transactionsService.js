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


let transactionsService = {
    getTransactions,
    deleteTransactionById,
    addTransaction
};



export {
    transactionsService
};