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

let periodsService = {
    getPeriods: getPeriods,
    deletePeriodById: deletePeriodById,
    addPeriod: addPeriod
};

export {
    periodsService
};

