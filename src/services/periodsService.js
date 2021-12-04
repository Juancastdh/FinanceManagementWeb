import axios from "axios";
import { baseUrl } from "../common/config.js";

let getPeriods = function () {

    return new Promise((resolve) => {
        let getPeriodsUrl = `${baseUrl}/Periods`;
        axios.get(getPeriodsUrl).then(response => resolve(response.data));
    });
}

let deletePeriodById = function (periodId) {

    return new Promise((resolve) => {
        let deletePeriodUrl = baseUrl + "/Periods/" + periodId;
        axios.delete(deletePeriodUrl).then(response => resolve(response.data));
    });
}

let addPeriod = function(period){
    return new Promise((resolve) => {
        let addPeriodUrl = `${baseUrl}/Periods`;
        axios.post(addPeriodUrl, period).then(response => resolve(response.data));
    });
}

let getLatestPeriod = function(){
    return new Promise ((resolve) => {
        getPeriods().then((periods) => {
            var orderedPeriods = periods.sort((a, b) => (a.startDate > b.startDate) ? 1 : ((b.startDate > a.startDate) ? -1 : 0));
            var latestPeriod = orderedPeriods[orderedPeriods.length - 1];
            resolve(latestPeriod);
        });
    });  
}

let periodsService = {
    getPeriods: getPeriods,
    deletePeriodById: deletePeriodById,
    addPeriod: addPeriod,
    getLatestPeriod
};

export {
    periodsService
};

