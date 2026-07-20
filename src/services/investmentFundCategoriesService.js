import axios from "axios";
import { baseUrl } from "../common/config.js";

let getInvestmentFundCategories = function(){
    return new Promise((resolve) => {
        let getInvestmentFundsUrl = `${baseUrl}/InvestmentFundCategories`;
        axios.get(getInvestmentFundsUrl).then(response => resolve(response.data));
    });
}

let deleteInvestmentFundCategoryById = function (fundId) {

    return new Promise((resolve) => {
        let deleteInvestmentFundUrl = baseUrl + "/InvestmentFundCategories/" + fundId;
        axios.delete(deleteInvestmentFundUrl).then(response => resolve(response.data));
    });
}

let addInvestmentFundCategory = function(fund){
    return new Promise((resolve) => {
        let addInvestmentFundUrl = `${baseUrl}/InvestmentFundCategories`;
        axios.post(addInvestmentFundUrl, fund).then(response => resolve(response.data));
    });
}

let updateInvestmentFundCategory = function(fund){
    return new Promise((resolve) => {
        let updateInvestmentFundUrl = `${baseUrl}/InvestmentFundCategories`;
        axios.put(updateInvestmentFundUrl, fund).then(response => resolve(response.data));
    });
}

let getActiveInvestmentFundCategories = function(){
    return new Promise((resolve) => {
        let getInvestmentFundsUrl = `${baseUrl}/InvestmentFundCategories?deleted=false`;
        axios.get(getInvestmentFundsUrl).then(response => resolve(response.data));
    });
}


let investmentFundCategoriesService = {
    getInvestmentFundCategories,
    deleteInvestmentFundCategoryById,
    addInvestmentFundCategory,
    updateInvestmentFundCategory,
    getActiveInvestmentFundCategories
};



export {
    investmentFundCategoriesService
};