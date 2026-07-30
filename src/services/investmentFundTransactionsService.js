import axios from "axios";
import { baseUrl } from "../common/config.js";

let getInvestmentFundTransactions = function(investmentFundId = null, investmentFundCategoryId = null, startDate = null, endDate = null){
    return new Promise((resolve) => {
        let getInvestmentFundTransactionsUrl = `${baseUrl}/InvestmentFundTransactions`;
        axios.request({
            url: getInvestmentFundTransactionsUrl,
            method: 'get',
            params: {
                investmentFundId: investmentFundId,
                investmentFundCategoryId: investmentFundCategoryId,
                startDate: startDate,
                endDate: endDate
            }
        } ).then(response => resolve(response.data));
    });
}

let deleteInvestmentFundTransactionById = function (investmentFundTransactionId) {

    return new Promise((resolve) => {
        let deleteInvestmentFundTransactionUrl = baseUrl + "/InvestmentFundTransactions/" + investmentFundTransactionId;
        axios.delete(deleteInvestmentFundTransactionUrl).then(response => resolve(response.data));
    });
}

let addInvestmentFundTransaction = function(investmentFundTransaction){
    return new Promise((resolve) => {
        let addInvestmentFundTransactionUrl = `${baseUrl}/InvestmentFundTransactions`;
        axios.post(addInvestmentFundTransactionUrl, investmentFundTransaction).then(response => resolve(response.data));
    });
}

let updateInvestmentFundTransaction = function(investmentFundTransaction){
    return new Promise((resolve) => {
        let updateInvestmentFundTransactionUrl = `${baseUrl}/InvestmentFundTransactions`;
        axios.put(updateInvestmentFundTransactionUrl, investmentFundTransaction).then(response => resolve(response.data));
    });
}


let investmentFundTransactionsService = {
    getInvestmentFundTransactions,
    deleteInvestmentFundTransactionById,
    addInvestmentFundTransaction,
    updateInvestmentFundTransaction
};



export {
    investmentFundTransactionsService
};