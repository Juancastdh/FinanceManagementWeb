function getPeriods(callback){
    var getPeriodsUrl = baseUrl + "/Periods";

    $.get(getPeriodsUrl, function (data) {
        callback(data);
        });
}

