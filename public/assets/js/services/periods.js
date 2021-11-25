function getPeriods(callback){
    var getPeriodsUrl = baseUrl + "/Periods";

    $.get(getPeriodsUrl, function (data) {
        callback(data);
        });
}

function addPeriod(period, callback) {
    var createPeriodsUrl = baseUrl + "/Periods";

    $.ajax({
        type: "POST",
        url: createPeriodsUrl,
        data: JSON.stringify(period),
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

function deletePeriodById(periodId, callback) {

    var deletePeriodUrl = baseUrl + "/Periods/" + periodId;
    $.ajax({
        type: "DELETE",
        url: deletePeriodUrl,
        success: function () {
            callback();
        },
        error: function (errMsg) {
            console.log(errMsg);
        }
    });
}

function getPeriodByDate(date, callback) {

    getPeriods(function (periods) {
        period = periods.find(period => date >= (new Date(period.startDate)) && date < (new Date(period.endDate)));
        callback(period);
    });
}