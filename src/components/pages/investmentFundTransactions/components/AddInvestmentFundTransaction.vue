<template>
  <div class="row">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Add Investment Fund Transaction</h5>
        <form class="row g-3 needs-validation" novalidate>
          <div class="col-md-6">
            <div class="form-floating">
              <input type="date" class="form-control" id="investmentFundTransactionDateField" v-model="investmentFundTransaction.date" v-bind:class="{
                'is-invalid': !validDate() && attemptedToSubmit,
                'is-valid': validDate() && attemptedToSubmit,
              }" required />
              <label for="investmentFundTransactionDateField">Date</label>
              <div class="invalid-feedback">
                Please specify a valid transaction date.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                placeholder="Description"
                id="investmentFundTransactionDescriptionField"
                v-model="investmentFundTransaction.description"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !validDescription() && attemptedToSubmit,
                  'is-valid': validDescription() && attemptedToSubmit,
                }"
                required
              />
              <label for="investmentFundTransactionDescriptionField">Description</label>
              <div class="invalid-feedback">
                Please specify a description for the investment fund transaction.
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-floating mb-3">
              <select class="form-select" id="investmentFundCombobox" aria-label="Investment Fund" v-model="investmentFundTransaction.investmentFundId"
                v-bind:class="{
                  'is-invalid': !validFund() && attemptedToSubmit,
                  'is-valid': validFund() && attemptedToSubmit
                }">
                <option v-for="fund in investmentFunds" :key="fund.id" :value="fund.id">
                  {{ fund.name }}
                </option>
              </select>
              <label for="investmentFundCombobox">Investment Fund</label>
              <div class="invalid-feedback">
                Please specify a valid investment fund.
              </div>
            </div>
          </div>



          <div class="col-md-6">
            <div class="form-floating">
              <input type="number" class="form-control" placeholder="Value" id="investmentFundTransactionValueField" step=".01"
                v-model="investmentFundTransaction.amount" v-bind:class="{
                  'form-control': true,
                  'is-invalid': !validValue() && attemptedToSubmit,
                  'is-valid': validValue() && attemptedToSubmit,
                }" required />
              <label for="investmentFundTransactionValueField">Value</label>
              <div class="invalid-feedback">Please specify a value.</div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-floating mb-3">
              <select class="form-select" id="investmentTypeCombobox" aria-label="Investment Fund Type" v-model="investmentFundTransaction.type"
                v-bind:class="{
                  'is-invalid': !validType() && attemptedToSubmit,
                  'is-valid': validType() && attemptedToSubmit
                }">
                <option v-for="investmentFundTransactionType in types" :key="investmentFundTransactionType.id" :value="investmentFundTransactionType.id">
                  {{ investmentFundTransactionType.name }}
                </option>
              </select>
              <label for="investmentTypeCombobox">Investment Fund Type</label>
              <div class="invalid-feedback">
                Please specify a valid investment fund type.
              </div>
            </div>
          </div>


          <div class="col-md-6">
            <div class="form-floating mb-3">
              <select class="form-select" id="investmentFundCategoryCombobox" aria-label="Investment Fund Category" v-model="investmentFundTransaction.investmentFundCategoryId" :disabled="!investmentFundTransaction.investmentFundId"
                v-bind:class="{
                  'is-invalid': !validFundCategory() && attemptedToSubmit,
                  'is-valid': validFundCategory() && attemptedToSubmit
                }">
                <option v-for="fundCategory in investmentFundCategories" :key="fundCategory.id" :value="fundCategory.id">
                  {{ fundCategory.name }}
                </option>
              </select>
              <label for="investmentFundCategoryCombobox">Investment Fund Category</label>
              <div class="invalid-feedback">
                Please specify a valid investment fund category.
              </div>
            </div>
          </div>



          <div class="text-center">
            <button
              type="button"
              class="btn btn-primary"
              id="addInvestmentFundTransactionButton"
              v-on:click="addInvestmentFundTransaction"
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
import { investmentFundTransactionsService } from "../../../../services/investmentFundTransactionsService.js";
import { investmentFundsService } from "../../../../services/investmentFundsService.js";
import { investmentFundCategoriesService } from "../../../../services/investmentFundCategoriesService.js";

export default {
  name: "AddInvestmentFundTransaction",
  data: function () {
    return {
      investmentFundTransaction: {
        id: null,
        date: null,
        description: "",
        amount: null,
        investmentFundId: null,
        investmentFundCategoryId: null,
        type: null,
      },
      investmentFunds: [],
      investmentFundCategories: [],
      types: [
        { id: 1, name: "Contribution" },
        { id: 2, name: "Withdrawal" },
        { id: 3, name: "Dividend" }
      ],
      attemptedToSubmit: false
    };
  },
  watch: { 
    'investmentFundTransaction.investmentFundId': function(newInvestmentFundId) {
      if (newInvestmentFundId) {
        investmentFundCategoriesService.getActiveInvestmentFundCategories(newInvestmentFundId).then((categories) => {
          this.investmentFundCategories = categories;
        });
      } else {
        this.investmentFundCategories = [];
      }
    }
  },
  methods: {
    addInvestmentFundTransaction: function () {
      var self = this;
      self.attemptedToSubmit = true;
      if (self.isFormValid() == true) {
        if(self.investmentFundTransaction.id == null){
          investmentFundTransactionsService.addInvestmentFundTransaction(self.investmentFundTransaction).then(() => {
            self.$emit("investment-fund-transaction-added");
            self.clearForm();
          });
        } 
        else {
          investmentFundTransactionsService.updateInvestmentFundTransaction(self.investmentFundTransaction).then(() => {
            self.$emit("investment-fund-transaction-updated");
            self.clearForm();
          });
        }

      }
    },
    clearForm: function () {
      this.attemptedToSubmit = false;
      this.investmentFundTransaction.date = null;
      this.investmentFundTransaction.description = "";
      this.investmentFundTransaction.amount = null;
      this.investmentFundTransaction.investmentFundId = null;
      this.investmentFundTransaction.investmentFundCategoryId = null;
      this.investmentFundTransaction.type = null;
    },
    isFormValid: function () {
      var formIsValid = false;

      if (this.validDescription() && this.validDate() && this.validFund() && this.validValue() && this.validType() && this.validFundCategory()) {
        formIsValid = true;
      }

      return formIsValid;
    },
    validDescription: function () {
      var descriptionIsValid = false;
      if (this.investmentFundTransaction.description.length > 0) {
        descriptionIsValid = true;
      }
      return descriptionIsValid;
    },
    validFund: function () {
      var investmentFundIdIsValid = false;
      if (this.investmentFundTransaction.investmentFundId !== null && this.investmentFundTransaction.investmentFundId !== undefined) {
        investmentFundIdIsValid = true;
      }
      return investmentFundIdIsValid;
    },
    validFundCategory: function () {
      var investmentFundCategoryIdIsValid = false;
      if ((this.investmentFundTransaction.investmentFundCategoryId !== null && this.investmentFundTransaction.investmentFundCategoryId !== undefined) || this.investmentFundTransaction.type == 3) {
        investmentFundCategoryIdIsValid = true;
      }
      return investmentFundCategoryIdIsValid;
    },
    validDate: function () {
      var dateIsValid = false;
      if (this.investmentFundTransaction.date !== null && this.investmentFundTransaction.date !== undefined) {
        dateIsValid = true;
      }
      return dateIsValid;
    },
    validValue: function () {
      var valueIsValid = false;
      if (this.investmentFundTransaction.amount !== null && this.investmentFundTransaction.amount !== undefined && this.investmentFundTransaction.amount > 0) {
        valueIsValid = true;
      }
      return valueIsValid;
    },
    validType: function () {
      var typeIsValid = false;
      if (this.investmentFundTransaction.type !== null && this.investmentFundTransaction.type !== undefined) {
        typeIsValid = true;
      }
      return typeIsValid;
    },
    setInvestmentFundTransaction: function(investmentFundTransaction){
      this.investmentFundTransaction = investmentFundTransaction;
    },
  },
  mounted() {
    investmentFundsService
      .getActiveInvestmentFunds()
      .then((funds) => {
        this.investmentFunds = funds;
      });
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