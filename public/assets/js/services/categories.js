
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

function addCategory(category, callback){

    var createCategoriesUrl = baseUrl + "/Categories";

    $.ajax({
        type: "POST",
        url: createCategoriesUrl,
        data: JSON.stringify(category),
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

function deleteCategoryById(categoryId, callback) {

    var deleteCategoryUrl = baseUrl + "/Categories/" + categoryId;
    $.ajax({
        type: "DELETE",
        url: deleteCategoryUrl,
        success: function () {
            callback();
        },
        error: function (errMsg) {
            console.log(errMsg);
        }
    });
}