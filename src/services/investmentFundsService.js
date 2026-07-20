import axios from "axios";
import { baseUrl } from "../common/config.js";

let getInvestmentFunds = function(){
    return new Promise((resolve) => {
        let getInvestmentFundsUrl = `${baseUrl}/InvestmentFunds`;
        axios.get(getInvestmentFundsUrl).then(response => resolve(response.data));
    });
}

let deleteInvestmentFundById = function (fundId) {

    return new Promise((resolve) => {
        let deleteInvestmentFundUrl = baseUrl + "/InvestmentFunds/" + fundId;
        axios.delete(deleteInvestmentFundUrl).then(response => resolve(response.data));
    });
}

let addInvestmentFund = function(fund){
    return new Promise((resolve) => {
        let addInvestmentFundUrl = `${baseUrl}/InvestmentFunds`;
        axios.post(addInvestmentFundUrl, fund).then(response => resolve(response.data));
    });
}

let updateInvestmentFund = function(fund){
    return new Promise((resolve) => {
        let updateInvestmentFundUrl = `${baseUrl}/InvestmentFunds`;
        axios.put(updateInvestmentFundUrl, fund).then(response => resolve(response.data));
    });
}

let getActiveInvestmentFunds = function(){
    return new Promise((resolve) => {
        let getInvestmentFundsUrl = `${baseUrl}/InvestmentFunds?deleted=false`;
        axios.get(getInvestmentFundsUrl).then(response => resolve(response.data));
    });
}


let investmentFundsService = {
    getInvestmentFunds,
    deleteInvestmentFundById,
    addInvestmentFund,
    updateInvestmentFund,
    getActiveInvestmentFunds
};



export {
    investmentFundsService
};