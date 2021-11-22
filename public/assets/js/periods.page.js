var periodsTable;
var periodsList = [];

$(document).ready(function () {
    loadPage();
});

function loadPage() {

    initializePeriodsTable();
    loadPeriodsTable();

    $("#addPeriodButton").click(function () {
        if (verifyForm()) {
            addPeriod();
            clearFormValidations();
        }
    });

    $("#resetButton").click(function () {
        clearFields();
    });

    $("#removeButton").click(function () {
        removeSelectedPeriods();
    });
}

function initializePeriodsTable() {

    periodsTable = $('#periodsTable').DataTable({
        data: periodsList,
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
                data: "startDate",
                render: function (data) {
                    return convertDateTimeString(data)
                }
            },
            {
                data: "endDate",
                render: function (data) {
                    return convertDateTimeString(data)
                }
            }
        ]
    });
}

function loadPeriodsTable() {

    getPeriods(function (periods) {
        periodsList = periods;
        periodsTable.clear();
        periodsTable.rows.add(periodsList);
        periodsTable.draw();
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

function addPeriod() {
    var createPeriodsUrl = baseUrl + "/Periods";

    $.ajax({
        type: "POST",
        url: createPeriodsUrl,
        data: JSON.stringify({
            startDate: $("#startDateField").val() + "T00:00:00",
            endDate: $("#endDateField").val() + "T00:00:00"
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {
            clearFields();
            loadPeriodsTable();
        },
        error: function (errMsg) {
            console.log(errMsg);
        }
    });
}

function clearFields() {
    $("#startDateField").val("");
    $("#endDateField").val("");
}

function removeSelectedPeriods() {
    var $selectedCheckboxes = $('input[name=cb]:checked');

    $selectedCheckboxes.each(function () {
        var periodId = ($(this).attr('id')).replace("cb", "");
        removePeriodById(periodId);
    });

}

function removePeriodById(periodId) {

    var deletePeriodUrl = baseUrl + "/Periods/" + periodId;
    $.ajax({
        type: "DELETE",
        url: deletePeriodUrl,
        success: function () {
            loadPeriodsTable();
            $("#removeButton").prop("disabled", true);
        },
        error: function (errMsg) {
            console.log(errMsg);
        }
    });

}

function setInvalidDateAlert() {
    alert("End date cannot be equal to or lower than start date.")
}

function checkDatesValidity() {

    var startDate = new Date($("#startDateField").val());
    var endDate = new Date($("#endDateField").val());

    if (endDate <= startDate) {
        return false;
    }

    return true;
}



function verifyForm() {
    var addPeriodForm = document.getElementById("addPeriodForm");
    var formIsValid = addPeriodForm.checkValidity();

    if (formIsValid) {
        if (!checkDatesValidity()) {
            formIsValid = false;
            setInvalidDateAlert();
        }
    }

    addPeriodForm.classList.add('was-validated');

    return formIsValid;
}