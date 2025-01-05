import axios from "axios";
import { baseUrl } from "../common/config.js";

let getAccounts = function(){
    return new Promise((resolve) => {
        let getAccountsUrl = `${baseUrl}/Accounts`;
        axios.get(getAccountsUrl).then(response => resolve(response.data));
    });
}

let deleteAccountById = function (accountId) {

    return new Promise((resolve) => {
        let deleteAccountUrl = baseUrl + "/Accounts/" + accountId;
        axios.delete(deleteAccountUrl).then(response => resolve(response.data));
    });
}

let addAccount = function(account){
    return new Promise((resolve) => {
        let addAccountUrl = `${baseUrl}/Accounts`;
        axios.post(addAccountUrl, account).then(response => resolve(response.data));
    });
}

let updateAccount = function(account){
    return new Promise((resolve) => {
        let updateAccountUrl = `${baseUrl}/Accounts`;
        axios.put(updateAccountUrl, account).then(response => resolve(response.data));
    });
}


let accountsService = {
    getAccounts,
    deleteAccountById,
    addAccount,
    updateAccount
};



export {
    accountsService
};