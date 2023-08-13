<template>
  <div class="row">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Add Transaction</h5>
        <form class="row g-3 needs-validation" novalidate>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="date"
                class="form-control"
                id="transactionDateField"
                v-model="transaction.date"
                v-bind:class="{
                  'is-invalid': !validDate() && attemptedToSubmit,
                  'is-valid': validDate() && attemptedToSubmit,
                }"
                required
              />
              <label for="floatingName">Date</label>
              <div class="invalid-feedback">
                Please specify a transaction date that is within an existing
                period.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                placeholder="Description"
                id="transactionDescriptionField"
                v-model="transaction.description"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !validDescription() && attemptedToSubmit,
                  'is-valid': validDescription() && attemptedToSubmit,
                }"
                required
              />
              <label for="floatingName">Description</label>
              <div class="invalid-feedback">Please specify a description.</div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="number"
                class="form-control"
                placeholder="Value"
                id="transactionValueField"
                step=".01"
                v-model="transaction.value"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !validValue() && attemptedToSubmit,
                  'is-valid': validValue() && attemptedToSubmit,
                }"
                required
              />
              <label for="floatingName">Value</label>
              <div class="invalid-feedback">Please specify a value.</div>
            </div>
          </div>


          <div class="col-md-6">
            <div class="form-floating mb-3">
              <select
                class="form-select"
                id="categoryCombobox"
                aria-label="Category"
                v-model="transaction.categoryId"
                v-bind:class="{
                  'is-invalid': !validCategory() && attemptedToSubmit,
                  'is-valid': validCategory() && attemptedToSubmit
                }"
                :disabled = "isSplitIntoCategoriesSelected()"
              >
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
              <label for="categoryCombobox">Category</label>
              <div class="invalid-feedback">
                Please specify a valid category.
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <legend class="col-form-label col-sm-2 pt-0">Split into all categories?</legend>
            <div class="col-sm-6">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="splitRadios"
                  value="true"
                  id="splitIntoAllCategories"
                  v-model="splitIntoCategories"
                  v-bind:class="{
                    'is-invalid': !validSplitOption() && attemptedToSubmit,
                    'is-valid': validSplitOption() && attemptedToSubmit
                  }"
                  required
                />
                <label class="form-check-label" for="splitIntoAllCategories">
                  Yes
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="splitRadios"
                  value="false"
                  id="doNotSplitIntoAllCategories"
                  v-model="splitIntoCategories"
                  v-bind:class="{
                    'is-invalid': !validSplitOption() && attemptedToSubmit,
                    'is-valid': validSplitOption() && attemptedToSubmit,
                  }"
                  required
                />
                <label class="form-check-label" for="doNotSplitIntoAllCategories">
                  No
                </label>
                <div class="invalid-feedback">Please select an option</div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <legend class="col-form-label col-sm-2 pt-0">Type</legend>
            <div class="col-sm-6">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="typeRadios"
                  value="false"
                  id="transactionIncomeType"
                  v-model="transaction.isExpense"
                  v-bind:class="{
                    'is-invalid': !validType() && attemptedToSubmit,
                    'is-valid': validType() && attemptedToSubmit,
                  }"
                  required
                />
                <label class="form-check-label" for="transactionIncomeType">
                  Income
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="typeRadios"
                  value="true"
                  id="transactionExpenseType"
                  v-model="transaction.isExpense"
                  v-bind:class="{
                    'is-invalid': !validType() && attemptedToSubmit,
                    'is-valid': validType() && attemptedToSubmit,
                  }"
                  required
                />
                <label class="form-check-label" for="transactionExpenseType">
                  Expense
                </label>
                <div class="invalid-feedback">Please select a type</div>
              </div>
            </div>
          </div>

          <div class="text-center">
            <button
              type="button"
              class="btn btn-primary"
              id="addTransactionButton"
              v-on:click="addTransaction"
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
import { transactionsService } from "../../../../services/transactionsService.js";
import { periodsService } from "../../../../services/periodsService.js";

export default {
  name: "AddTransaction",
  props: ["categories"],
  data: function () {
    return {
      transaction: {
        date: "",
        value: null,
        description: "",
        categoryId: null,
        isExpense: null,
        periodId: null,
      },
      attemptedToSubmit: false,
      splitIntoCategories: false,
      periods: [],
    };
  },
  methods: {
    addTransaction: function () {
      var self = this;
      self.attemptedToSubmit = true;
      var transactionsToBeAdded = self.getTransactionsToBeAdded();
      var transactionPromises = [];

      if(transactionsToBeAdded.length > 0){
        transactionsToBeAdded.forEach(function(transaction){
          transactionPromises.push(transactionsService.addTransaction(transaction));
        });

        Promise.all(transactionPromises).then(() => {
          self.$emit("transaction-added");
          self.clearForm();
        });
      }     


    },
    getTransactionsToBeAdded: function (){
      var self = this;
      var transactionsToBeAdded = [];
      if (self.isFormValid() == true) {
        var selectedPeriod = this.getSelectedPeriod();
        self.transaction.periodId = selectedPeriod.id;
        self.transaction.isExpense = (self.transaction.isExpense === 'true');
      
        if (self.splitIntoCategories == false){
          transactionsToBeAdded.push(self.transaction);
        }
        else {
          var categories = self.$props.categories;
          categories.forEach(function(category){
            var categoryTransaction = {};
            Object.assign(categoryTransaction, self.transaction);
            categoryTransaction.categoryId = category.id;
            categoryTransaction.value = categoryTransaction.value * (category.percentage/100);
            transactionsToBeAdded.push(categoryTransaction);
          });
        }
      }

      return transactionsToBeAdded;
    },
    clearForm: function () {
      this.attemptedToSubmit = false;
      this.transaction.date = "";
      this.transaction.value = null;
      this.transaction.description = "";
      this.transaction.isExpense = null;
      this.splitIntoCategories = false;
    },
    isFormValid: function () {
      var formIsValid = false;

      if (
        this.validDate() &&
        this.validValue() &&
        this.validDescription() &&
        this.validCategory() &&
        this.validType() &&
        this.validSplitOption()
      ) {
        formIsValid = true;
      }

      return formIsValid;
    },
    validDate: function () {
      var dateIsValid = false;
      if (
        this.transaction.date.length > 0 &&
        this.getSelectedPeriod() != null
      ) {
        dateIsValid = true;
      }
      return dateIsValid;
    },
    validValue: function () {
      var valueIsValid = false;
      if (this.transaction.value > 0) {
        valueIsValid = true;
      }
      return valueIsValid;
    },
    validDescription: function () {
      var descriptionIsValid = false;
      if (this.transaction.description.length > 0) {
        descriptionIsValid = true;
      }
      return descriptionIsValid;
    },
    validCategory: function () {
      var categoryIsValid = false;
      if (this.transaction.categoryId != null || this.isSplitIntoCategoriesSelected() == true) {
        categoryIsValid = true;
      }

      return categoryIsValid;
    },
    validType: function () {
      var typeIsValid = false;
      if (this.transaction.isExpense != null) {
        typeIsValid = true;
      }
      return typeIsValid;
    },
    validSplitOption: function () {
      var splitOptionIsValid = false;
      if (this.splitIntoCategories != null) {
        splitOptionIsValid = true;
      }
      return splitOptionIsValid;
    },
    getSelectedPeriod() {
      var date = new Date(this.transaction.date + "T00:00:00");
      return this.periods.find(
        (p) => date >= new Date(p.startDate) && date < new Date(p.endDate)
      );
    },
    isSplitIntoCategoriesSelected: function(){

      var isSplitIntoCategoriesSelected = false;
      if(this.splitIntoCategories == "true"){
        isSplitIntoCategoriesSelected = true;
      }

      return isSplitIntoCategoriesSelected;
    }
  },
  mounted() {
    var self = this;
    periodsService.getPeriods().then((periods) => {
      self.periods = periods;
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