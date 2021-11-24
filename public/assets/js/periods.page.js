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
            savePeriod();
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

function savePeriod() {

    var period = {
        startDate: $("#startDateField").val() + "T00:00:00",
        endDate: $("#endDateField").val() + "T00:00:00"
    };

    addPeriod(period, function(){
        clearFields();
        loadPeriodsTable();
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

    deletePeriodById(periodId, function(){
        loadPeriodsTable();
        $("#removeButton").prop("disabled", true);
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