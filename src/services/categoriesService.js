import axios from "axios";
import { baseUrl } from "../common/config.js";

let getCategories = function(){
    return new Promise((resolve) => {
        let getCategoriesUrl = `${baseUrl}/Categories`;
        axios.get(getCategoriesUrl).then(response => resolve(response.data));
    });
}

let deleteCategoryById = function (categoryId) {

    return new Promise((resolve) => {
        let deleteCategoryUrl = baseUrl + "/Categories/" + categoryId;
        axios.delete(deleteCategoryUrl).then(response => resolve(response.data));
    });
}

let addCategory = function(category){
    return new Promise((resolve) => {
        let addCategoryUrl = `${baseUrl}/Categories`;
        axios.post(addCategoryUrl, category).then(response => resolve(response.data));
    });
}

let updateCategory = function(category){
    return new Promise((resolve) => {
        let updateCategoryUrl = `${baseUrl}/Categories`;
        axios.put(updateCategoryUrl, category).then(response => resolve(response.data));
    });
}


let categoriesService = {
    getCategories,
    deleteCategoryById,
    addCategory,
    updateCategory
};



export {
    categoriesService
};