let convertDateTimeString = function(dateTimeString) {
    var date = new Date(dateTimeString);
    var dateDay = (date.getDate()).toString().padStart(2, '0');
    var dateMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    var dateYear = date.getFullYear();

    var formattedDateString = dateDay + '/' + dateMonth + '/' + dateYear;

    return formattedDateString;
};

export {
    convertDateTimeString
};
