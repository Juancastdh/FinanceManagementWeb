var categoriesList = [];
var categoriesTable;

$(document).ready(function () {
    loadPage();
});

function loadPage() {

    initializeCategoriesTable();
    loadCategoriesTable();

    $("#addCategoryButton").click(function () {
        saveCategory();
    });

    $("#resetButton").click(function () {
        clearFields();
    });

    $("#removeButton").click(function () {
        removeSelectedCategories();
    });
}

function initializeCategoriesTable() {
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

    getCategories(function (categories) {
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

function saveCategory() {

    var category = {
        name: $("#categoryNameField").val(),
        percentage: $("#categoryPercentageField").val()
    };

    addCategory(category, function () {
        clearFields();
        loadCategoriesTable();
    });
}

function clearFields() {
    $("#categoryNameField").val("");
    $("#categoryPercentageField").val("");
}

function removeSelectedCategories() {
    var $selectedCheckboxes = $('input[name=cb]:checked');

    var categoriesRemoved = 0;

    $selectedCheckboxes.each(function () {
        var categoryId = ($(this).attr('id')).replace("cb", "");
        removeCategoryById(categoryId, function(){
            categoriesRemoved++;
            if(categoriesRemoved == $selectedCheckboxes.length){
                loadCategoriesTable();
                $("#removeButton").prop("disabled", true);
            }
        });
    });

}

function removeCategoryById(categoryId, callback) {

    deleteCategoryById(categoryId, function () {
        callback();
    });
}