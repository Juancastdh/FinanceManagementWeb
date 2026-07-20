<template>
  <div class="row">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Add Investment Fund</h5>
        <form class="row g-3 needs-validation" novalidate>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                placeholder="Name"
                id="fundNameField"
                v-model="fund.name"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !validName() && attemptedToSubmit,
                  'is-valid': validName() && attemptedToSubmit,
                }"
                required
              />
              <label for="floatingName">Name</label>
              <div class="invalid-feedback">
                Please specify a name for the investment fund.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                placeholder="Description"
                id="fundDescriptionField"
                v-model="fund.description"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !validDescription() && attemptedToSubmit,
                  'is-valid': validDescription() && attemptedToSubmit,
                }"
                required
              />
              <label for="floatingDescription">Description</label>
              <div class="invalid-feedback">
                Please specify a description for the investment fund.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                placeholder="Company"
                id="fundCompanyField"
                v-model="fund.company"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !validCompany() && attemptedToSubmit,
                  'is-valid': validCompany() && attemptedToSubmit,
                }"
                required
              />
              <label for="floatingCompany">Company</label>
              <div class="invalid-feedback">
                Please specify a company for the investment fund.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                placeholder="Currency"
                id="fundCurrencyField"
                v-model="fund.currency"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !validCurrency() && attemptedToSubmit,
                  'is-valid': validCurrency() && attemptedToSubmit,
                }"
                required
              />
              <label for="floatingCurrency">Currency</label>
              <div class="invalid-feedback">
                Please specify a currency for the investment fund.
              </div>
            </div>
          </div>
          <div class="text-center">
            <button
              type="button"
              class="btn btn-primary"
              id="addInvestmentFundButton"
              v-on:click="addInvestmentFund"
            >
              Submit
            </button>
            <div class="divider" />
            <button
              type="reset"
              class="btn btn-secondary"
              id="resetButton"
              v-on:click="clearForm"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { investmentFundsService } from "../../../../services/investmentFundsService.js";

export default {
  name: "AddInvestmentFund",
  data: function () {
    return {
      fund: {
        company: "",
        currency: "",
        name: "",
        description: "",
        id: null
      },
      attemptedToSubmit: false
    };
  },

  methods: {
    addInvestmentFund: function () {
      var self = this;
      self.attemptedToSubmit = true;
      if (self.isFormValid() == true) {
        if(self.fund.id == null){
          investmentFundsService.addInvestmentFund(self.fund).then(() => {
            self.$emit("investment-fund-added");
            self.clearForm();
          });
        } 
        else {
          investmentFundsService.updateInvestmentFund(self.fund).then(() => {
            self.$emit("investment-fund-updated");
            self.clearForm();
          });
        }

      }
    },
    clearForm: function () {
      this.attemptedToSubmit = false;
      this.fund.company = "";
      this.fund.currency = "";
      this.fund.name = "";
      this.fund.description = "";
      this.fund.id = null;
    },
    isFormValid: function () {
      var formIsValid = false;

      if (this.validName() && this.validCurrency() && this.validCompany() && this.validDescription()) {
        formIsValid = true;
      }

      return formIsValid;
    },
    validName: function () {
      var nameIsValid = false;
      if (this.fund.name.length > 0) {
        nameIsValid = true;
      }
      return nameIsValid;
    },
    validCurrency: function () {
      var currencyIsValid = false;
      if (this.fund.currency.length > 0) {
        currencyIsValid = true;
      }
      return currencyIsValid;
    },
    validCompany: function () {
      var companyIsValid = false;
      if (this.fund.company.length > 0) {
        companyIsValid = true;
      }
      return companyIsValid;
    },
    validDescription: function () {
      var descriptionIsValid = false;
      if (this.fund.description.length > 0) {
        descriptionIsValid = true;
      }
      return descriptionIsValid;
    },
    setInvestmentFund: function(fund){
      this.fund = fund;
    }
  },
};
</script>

<style scoped>
.divider {
  width: 5px;
  height: auto;
  display: inline-block;
}
</style>