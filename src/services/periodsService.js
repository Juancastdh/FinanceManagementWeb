import axios from "axios";
import { baseUrl }  from "./config.js";

let getPeriods = new Promise((resolve) => {
    let getPeriodsUrl = `${baseUrl}/Periods`;
    axios.get(getPeriodsUrl).then(response => resolve(response.data));
});

let periodsService = {
    getPeriods: getPeriods
};

export {
    periodsService
};

