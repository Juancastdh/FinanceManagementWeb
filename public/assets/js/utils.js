var currentPeriod;


function convertDateTimeString(dateTimeString) {
    var date = new Date(dateTimeString);
    var dateDay = (date.getDate()).toString().padStart(2, '0');
    var dateMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    var dateYear = date.getFullYear();

    var formattedDateString = dateDay + '/' + dateMonth + '/' + dateYear;

    return formattedDateString;
}



function clearFormValidations() {
    var needsValidation = document.querySelectorAll('.needs-validation')

    Array.prototype.slice.call(needsValidation)
        .forEach(function (form) {
            form.classList.remove('was-validated');
        });
}

function getMonthRangeByType(type) {

    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1;
    var monthRange = { startMonth: 0, endMonth: 0 }

    if (type == "month") {
        monthRange.startMonth = currentMonth;
        monthRange.endMonth = currentMonth;
    }

    if (type == "quarter") {

        if (currentMonth <= 4) {
            monthRange.startMonth = 1;
            monthRange.endMonth = 4;
        }
        else if (currentMonth <= 8) {
            monthRange.startMonth = 5;
            monthRange.endMonth = 8;
        }
        else {
            monthRange.startMonth = 9;
            monthRange.endMonth = 12;
        }
    }

    if (type == "semester") {
        if (currentMonth <= 6) {
            monthRange.startMonth = 1;
            monthRange.endMonth = 6;
        }
        else {
            monthRange.startMonth = 7;
            monthRange.endMonth = 12;
        }
    }

    if (type == "year") {
        monthRange.startMonth = 1;
        monthRange.endMonth = 12;
    }

    return monthRange;
}

function getDateRangeByType(type) {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1;
    var dateRange = { startDate: new Date(), endDate: new Date() }

    if (type == "month") {
        dateRange.startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        dateRange.endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    }

    if (type == "quarter") {

        if (currentMonth <= 4) {
            dateRange.startDate = new Date(currentDate.getFullYear(), 0, 1);
            dateRange.endDate = new Date(currentDate.getFullYear(), 4, 0);
        }
        else if (currentMonth <= 8) {
            dateRange.startDate = new Date(currentDate.getFullYear(), 4, 1);
            dateRange.endDate = new Date(currentDate.getFullYear(), 8, 0);
        }
        else {
            dateRange.startDate = new Date(currentDate.getFullYear(), 8, 1);
            dateRange.endDate = new Date(currentDate.getFullYear() + 1, 0, 0);
        }
    }

    if (type == "semester") {
        if (currentMonth <= 6) {
            dateRange.startDate = new Date(currentDate.getFullYear(), 0, 1);
            dateRange.endDate = new Date(currentDate.getFullYear(), 7, 0);
        }
        else {
            dateRange.startDate = new Date(currentDate.getFullYear(), 7, 1);
            dateRange.endDate = new Date(currentDate.getFullYear() + 1, 0, 0);
        }
    }

    if (type == "year") {
        dateRange.startDate = new Date(currentDate.getFullYear(), 0, 1);
        dateRange.endDate = new Date(currentDate.getFullYear() + 1, 0, 0);
    }

    return dateRange;

}

function setCurrentPeriod(callback) {
    getLatestPeriod(function (latestPeriod) {
        currentPeriod = latestPeriod;
        callback();
    });
}

function convertDateToDotNetString(date) {
    var dateDay = (date.getDate()).toString().padStart(2, '0');
    var dateMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    var dateYear = date.getFullYear();

    var formattedDateString = `${dateYear}-${dateMonth}-${dateDay}T00:00:00`;

    return formattedDateString;
}