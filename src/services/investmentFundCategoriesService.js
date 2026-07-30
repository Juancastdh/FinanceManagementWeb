import axios from "axios";
import { baseUrl } from "../common/config.js";

let getInvestmentFundCategories = function(){
    return new Promise((resolve) => {
        let getInvestmentFundCategoriesUrl = `${baseUrl}/InvestmentFundCategories`;
        axios.get(getInvestmentFundCategoriesUrl).then(response => resolve(response.data));
    });
}

let deleteInvestmentFundCategoryById = function (investmentFundCategoryId) {

    return new Promise((resolve) => {
        let deleteInvestmentFundCategoryUrl = baseUrl + "/InvestmentFundCategories/" + investmentFundCategoryId;
        axios.delete(deleteInvestmentFundCategoryUrl).then(response => resolve(response.data));
    });
}

let addInvestmentFundCategory = function(investmentFundCategory){
    return new Promise((resolve) => {
        let addInvestmentFundCategoryUrl = `${baseUrl}/InvestmentFundCategories`;
        axios.post(addInvestmentFundCategoryUrl, investmentFundCategory).then(response => resolve(response.data));
    });
}

let updateInvestmentFundCategory = function(investmentFundCategory){
    return new Promise((resolve) => {
        let updateInvestmentFundCategoryUrl = `${baseUrl}/InvestmentFundCategories`;
        axios.put(updateInvestmentFundCategoryUrl, investmentFundCategory).then(response => resolve(response.data));
    });
}

let getActiveInvestmentFundCategories = function(){
    return new Promise((resolve) => {
        let getActiveInvestmentFundCategoriesUrl = `${baseUrl}/InvestmentFundCategories?deleted=false`;
        axios.get(getActiveInvestmentFundCategoriesUrl).then(response => resolve(response.data));
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