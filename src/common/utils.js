let convertDateTimeString = function(dateTimeString) {
    var date = new Date(dateTimeString);
    var dateDay = (date.getDate()).toString().padStart(2, '0');
    var dateMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    var dateYear = date.getFullYear();

    var formattedDateString = dateDay + '/' + dateMonth + '/' + dateYear;

    return formattedDateString;
};

let monthRanges = {
    "month": 1,
    "quarter": 3,
    "semester": 6,
    "year": 12
};

let getDateRangeByMonthRange = function(monthRange){
    let dateRange = {
        startDate: new Date(),
        endDate: new Date()
    };
    var currentDate = new Date();
    dateRange.startDate.setMonth(currentDate.getMonth() - monthRange);

    return dateRange;
}

let convertDateToDotNetString = function(date) {
    var dateDay = (date.getDate()).toString().padStart(2, '0');
    var dateMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    var dateYear = date.getFullYear();

    var formattedDateString = `${dateYear}-${dateMonth}-${dateDay}T00:00:00`;

    return formattedDateString;
}

export {
    convertDateTimeString,
    monthRanges,
    getDateRangeByMonthRange,
    convertDateToDotNetString
};
