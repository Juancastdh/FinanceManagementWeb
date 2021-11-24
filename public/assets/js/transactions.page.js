var transactionsList = [];
var periodsList;
var transactionsTable;

$(document).ready(function () {
    loadPage();

});

function loadPage() {
    initializeTransactionsTable();
    loadTransactionsTable();
    loadCategoriesCombobox();
    loadPeriodsList();

    $("#addTransactionButton").click(function () {
        if(verifyForm()){
            saveTransaction();
            clearFormValidations();
        }
       
    });

    $("#resetButton").click(function () {
        clearFields();
    });

    $("#removeButton").click(function () {
        removeSelectedTransactions();
    });
}

function initializeTransactionsTable(){

    transactionsTable = $('#transactionsTable').DataTable({
        data: transactionsList,
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
                data: "date",
                render: function (data) {
                    return convertDateTimeString(data)
                }
            },
            {
                data: "description"
            },
            {
                data: "categoryName",
            },
            {
                data: "value",
                render: function (data) {
                    return "RD$ " + data;
                }
            },
            {
                data: "isExpense",
                render: function (data) {
                    if (data == true) {
                        return '<span class="badge bg-danger">Expense</span>'
                    }
                    else {
                        return '<span class="badge bg-success">Income</span>'
                    }
                }
            }
        ]
    });

}

function loadTransactionsTable() {

    var addedTransactions = 0;

    getTransactions(function(transactions){
        transactions.forEach(transaction => {
            addTransactionToList(transaction, function () {
                addedTransactions++;
                if (addedTransactions == transactions.length) {
                    transactionsTable.clear();
                    transactionsTable.rows.add(transactionsList);
                    transactionsTable.draw();
                    addCheckboxBehavior();          
                }
            });
        });
    });
}

function addTransactionToList(transaction, callback) {
    getCategoryById(transaction.categoryId, function (transactionCategory) {
        transaction.categoryName = transactionCategory.name;
        addTransactionWithCategoryToList(transaction);
        callback();
    });
}

function addTransactionWithCategoryToList(transaction) {
    transactionsList.push(transaction);
    transactionsList.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
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

function saveTransaction() {

    var isTransactionExpense;

    if ($('#transactionIncomeType').is(':checked')) {
        isTransactionExpense = false;
    }
    else if ($('#transactionExpenseType').is(':checked')) {
        isTransactionExpense = true;

    }

    var transactionDate = $("#transactionDateField").val() + "T00:00:00";

    var transactionPeriod = getPeriodByDate(new Date(transactionDate));

    var transaction = {
        date: transactionDate,
        value: $("#transactionValueField").val(),
        description: $("#transactionDescriptionField").val(),
        categoryId: $("#categoryCombobox").val(),
        isExpense: isTransactionExpense,
        periodId: transactionPeriod.id
    };

    addTransaction(transaction, function(){
        clearFields();
        clearTransactionsList();
        loadTransactionsTable();
    });
}

function clearFields() {
    $("#transactionDateField").val("");
    $("#transactionValueField").val("");
    $("#transactionDescriptionField").val("");
}

function clearTransactionsList() {

    transactionsList = [];

}

function removeSelectedTransactions() {
    var $selectedCheckboxes = $('input[name=cb]:checked');

    var transactionsRemoved = 0;

    $selectedCheckboxes.each(function () {
        var transactionId = ($(this).attr('id')).replace("cb", "");
        deleteTransactionById(transactionId, function () {
            transactionsRemoved++;
            if (transactionsRemoved == $selectedCheckboxes.length) {
                $("#removeButton").prop("disabled", true);
                clearTransactionsList();
                loadTransactionsTable();                
            }
        });
    });
}

function loadCategoriesCombobox() {

    getCategories(function (categories) {
        categories.forEach(category => {
            $('#categoryCombobox').append(`<option value="${category.id}">
                    ${category.name}
            </option>`)
        });
    });

}

function loadPeriodsList() {

    getPeriods(function (periods) {
        periodsList = periods
    });
}

function getPeriodByDate(date) {

    var period = periodsList.find(period => date >= (new Date(period.startDate)) && date < (new Date(period.endDate)));

    return period;
}

function isFormDateWithinExistingPeriod(){

    var formDate = $("#transactionDateField").val();

    var period = getPeriodByDate(new Date(formDate));

    if(period == null){
        return false;
    }

    return true;
}

function setInvalidDateAlert() {
    alert("There is no period with the specified date. Please specify a date that is within range of an existing period.");
}

function verifyForm() {
    var addTransactionForm = document.getElementById("addTransactionForm");
    var formIsValid = addTransactionForm.checkValidity();

    if(formIsValid){
        if(!isFormDateWithinExistingPeriod()){
            formIsValid = false;
            setInvalidDateAlert();
        }
    }

    addTransactionForm.classList.add('was-validated');

    return formIsValid;
}