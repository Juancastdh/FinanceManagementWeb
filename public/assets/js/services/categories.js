
function getCategoryById(categoryId, callback){
    var getCategoryByIdUrl = baseUrl + "/Categories/" + categoryId;
    $.get(getCategoryByIdUrl, function (data) {
        callback(data);
    });
}


function getCategories(callback){
    var getCategoriesUrl = baseUrl + "/Categories";
    $.get(getCategoriesUrl, function (data) {
        callback(data);
    });
}