var categoriesList = [];
var categoriesTable;

$(document).ready(function () {
    loadPage();
    $("#categoriesTable").DataTable();
});

function loadPage() {

    initializeCategoriesTable();
    loadCategoriesTable();

    $("#addCategoryButton").click(function () {
        addCategory();
    });

    $("#resetButton").click(function () {
        clearFields();
    });

    $("#removeButton").click(function () {
        removeSelectedCategories();
    });
}

function initializeCategoriesTable(){
    categoriesTable = $('#categoriesTable').DataTable({
        data: categoriesList,
        columns: [
            {
                data: "id",
                render: function (data) {
                    return '<input class="form-check-input me-1" name="cb" type="checkbox" value="aria-label="..."" id="cb' + data + '">';
                }
            },
            {
                data: "id"
            },
            {
                data: "name"
            },
            {
                data: "percentage",
                render: function (data) {
                    return data + "%";
                }
            }
        ]
    });
}

function loadCategoriesTable() {

    getCategories(function(categories){
        categoriesList = categories;
        categoriesTable.clear();
        categoriesTable.rows.add(categoriesList);
        categoriesTable.draw();
        addCheckboxBehavior();
    });
}

function addCheckboxBehavior() {
    $('input[name=cb]').change(function () {
        var $boxes = $('input[name=cb]:checked');

        if ($boxes.length > 0) {
            $("#removeButton").prop("disabled", false);
        }
        else {
            $("#removeButton").prop("disabled", true);
        }
    });
}

function addCategory() {
    var createCategoriesUrl = baseUrl + "/Categories";

    $.ajax({
        type: "POST",
        url: createCategoriesUrl,
        data: JSON.stringify({
            name: $("#categoryNameField").val(),
            percentage: $("#categoryPercentageField").val()
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {
            clearFields();
            loadCategoriesTable();
        },
        error: function (errMsg) {
            console.log(errMsg);
        }
    });
}

function clearFields() {
    $("#categoryNameField").val("");
    $("#categoryPercentageField").val("");
}

function removeSelectedCategories() {
    var $selectedCheckboxes = $('input[name=cb]:checked');

    $selectedCheckboxes.each(function () {
        var categoryId = ($(this).attr('id')).replace("cb", "");
        removeCategoryById(categoryId);
    });

}

function removeCategoryById(categoryId) {

    var deleteCategoryUrl = baseUrl + "/Categories/" + categoryId;
    $.ajax({
        type: "DELETE",
        url: deleteCategoryUrl,
        success: function () {
            loadCategoriesTable();
            $("#removeButton").prop("disabled", true);
        },
        error: function (errMsg) {
            console.log(errMsg);
        }
    });
}