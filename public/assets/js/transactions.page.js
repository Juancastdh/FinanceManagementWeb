var transactionsList = [];
var periodsList;
var transactionsTable;
var currentPeriod;
var reportsSelectedFilter = "filter-period";

$(document).ready(function () {
    loadPage();

    $('a[name="reports-filter"]').click(function () {
        reportsSelectedFilter = $(this).attr('id');
        var selectedValue = $(this).text();
        $("#current-reports-filter").text(`/${selectedValue}`);
        clearTransactionsList();
        loadTransactionsTable();
    });
});

function loadPage() {
    initializeTransactionsTable();
    setCurrentPeriod(function () {
        loadTransactionsTable();
    });

    loadCategoriesCombobox();
    loadPeriodsList();

    $("#addTransactionButton").click(function () {
        if (verifyForm()) {
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

function initializeTransactionsTable() {

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

    if (reportsSelectedFilter == "filter-none") {
        loadAllTransactionsToTable();
    }
    else if (reportsSelectedFilter == "filter-period") {
        loadCurrentPeriodTransactionsToTable();
    }
    else {
        loadTransactionsToTableByMonthlyRange();
    }
}

function loadAllTransactionsToTable() {
    var addedTransactions = 0;
    getTransactions(function (transactions) {
        transactions.forEach(transaction => {
            addTransactionToList(transaction, function () {
                addedTransactions++;
                if (addedTransactions == transactions.length) {
                    transactionsList.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
                    transactionsTable.clear();
                    transactionsTable.rows.add(transactionsList);
                    transactionsTable.draw();
                    addCheckboxBehavior();
                }
            });
        });
    });
}

function loadCurrentPeriodTransactionsToTable() {

    var addedTransactions = 0;
    getFinancialReport({ periodId: currentPeriod.id }, function (financialReport) {
        financialReport.financialTransactions.forEach(transaction => {
            addTransactionToList(transaction, function () {
                addedTransactions++;
                if (addedTransactions == financialReport.financialTransactions.length) {
                    transactionsList.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
                    transactionsTable.clear();
                    transactionsTable.rows.add(transactionsList);
                    transactionsTable.draw();
                    addCheckboxBehavior();
                }
            });
        });
    });
}

function loadTransactionsToTableByMonthlyRange() {

    var periodFilterRange = getMonthRangeByType(reportsSelectedFilter.replace("filter-", ""));
    var periodsProcessed = 0;

    var filteredPeriods = getPeriodsThatStartInARangeOMonths(periodFilterRange.startMonth, periodFilterRange.endMonth);
    filteredPeriods.forEach(period => {
        getFinancialReport({ periodId: period.id }, function (financialReport) {
            var addedTransactions = 0;
            financialReport.financialTransactions.forEach(transaction => {
                addTransactionToList(transaction, function () {
                    addedTransactions++;
                    if (addedTransactions == financialReport.financialTransactions.length) {
                        periodsProcessed++;
                    }
                    if (periodsProcessed == filteredPeriods.length) {
                        transactionsList.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
                        transactionsTable.clear();
                        transactionsTable.rows.add(transactionsList);
                        transactionsTable.draw();
                        addCheckboxBehavior();
                    }
                });
            });
            
        });
    });
}

function addTransactionToList(transaction, callback) {
    getCategoryById(transaction.categoryId, function (transactionCategory) {
        transaction.categoryName = transactionCategory.name;
        transactionsList.push(transaction);
        callback();
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

function saveTransaction() {

    var isTransactionExpense;

    if ($('#transactionIncomeType').is(':checked')) {
        isTransactionExpense = false;
    }
    else if ($('#transactionExpenseType').is(':checked')) {
        isTransactionExpense = true;

    }

    var transactionDate = $("#transactionDateField").val() + "T00:00:00";

    var transactionPeriod = getPeriodByDateFromPeriodList(new Date(transactionDate));

    var transaction = {
        date: transactionDate,
        value: $("#transactionValueField").val(),
        description: $("#transactionDescriptionField").val(),
        categoryId: $("#categoryCombobox").val(),
        isExpense: isTransactionExpense,
        periodId: transactionPeriod.id
    };

    addTransaction(transaction, function () {
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

function getPeriodByDateFromPeriodList(date) {

    var period = periodsList.find(period => date >= (new Date(period.startDate)) && date < (new Date(period.endDate)));

    return period;
}

function isFormDateWithinExistingPeriod() {

    var formDate = $("#transactionDateField").val();

    var period = getPeriodByDateFromPeriodList(new Date(formDate));

    if (period == null) {
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

    if (formIsValid) {
        if (!isFormDateWithinExistingPeriod()) {
            formIsValid = false;
            setInvalidDateAlert();
        }
    }

    addTransactionForm.classList.add('was-validated');

    return formIsValid;
}

function setCurrentPeriod(callback) {

    getPeriods(function(periods){
        var orderedPeriods = periods.sort((a, b) => (a.startDate > b.startDate) ? 1 : ((b.startDate > a.startDate) ? -1 : 0));
        currentPeriod = orderedPeriods[orderedPeriods.length-1];
        callback();  
      });
}

function getPeriodsThatStartInARangeOMonths(startMonth, endMonth) {
    filteredPeriods = periodsList.filter(period => (new Date(period.startDate).getMonth() + 1) >= startMonth && (new Date(period.startDate).getMonth() + 1) <= endMonth);
    return filteredPeriods;
}