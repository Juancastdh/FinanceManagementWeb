<template>
  <div class="row">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Add Investment Fund Category</h5>
        <form class="row g-3 needs-validation" novalidate>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                placeholder="Name"
                id="fundNameField"
                v-model="fundCategory.name"
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
            <div class="form-floating mb-3">
              <select class="form-select" id="investmentFundCombobox" aria-label="investmentFundCategory" v-model="fundCategory.investmentFundId"
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
          <div class="text-center">
            <button
              type="button"
              class="btn btn-primary"
              id="addInvestmentFundCategoryButton"
              v-on:click="addInvestmentFundCategory"
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
import { investmentFundCategoriesService } from "../../../../services/investmentFundCategoriesService.js";
import { investmentFundsService } from "../../../../services/investmentFundsService.js";

export default {
  name: "AddInvestmentFundCategory",
  data: function () {
    return {
      fundCategory: {
        name: "",
        investmentFundId: null,
        id: null
      },
      investmentFunds: [],
      attemptedToSubmit: false
    };
  },

  methods: {
    addInvestmentFundCategory: function () {
      var self = this;
      self.attemptedToSubmit = true;
      if (self.isFormValid() == true) {
        if(self.fundCategory.id == null){
          investmentFundCategoriesService.addInvestmentFundCategory(self.fundCategory).then(() => {
            self.$emit("investment-fund-category-added");
            self.clearForm();
          });
        } 
        else {
          investmentFundCategoriesService.updateInvestmentFundCategory(self.fundCategory).then(() => {
            self.$emit("investment-fund-category-updated");
            self.clearForm();
          });
        }

      }
    },
    clearForm: function () {
      this.attemptedToSubmit = false;
      this.fundCategory.name = "";
      this.fundCategory.id = null;
    },
    isFormValid: function () {
      var formIsValid = false;

      if (this.validName() && this.validFund()) {
        formIsValid = true;
      }

      return formIsValid;
    },
    validName: function () {
      var nameIsValid = false;
      if (this.fundCategory.name.length > 0) {
        nameIsValid = true;
      }
      return nameIsValid;
    },
    validFund: function () {
      var investmentFundIdIsValid = false;
      if (this.fundCategory.investmentFundId !== null && this.fundCategory.investmentFundId !== undefined) {
        investmentFundIdIsValid = true;
      }
      return investmentFundIdIsValid;
    },
    setInvestmentFundCategory: function(fundCategory){
      this.fundCategory = fundCategory;
    }
  },
  mounted() {
    var self = this;
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