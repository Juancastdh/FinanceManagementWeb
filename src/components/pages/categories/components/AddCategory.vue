<template>
  <div class="row">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Add Category</h5>
        <form class="row g-3 needs-validation" novalidate>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                placeholder="Name"
                id="categoryNameField"
                v-model="category.name"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !validName() && attemptedToSubmit,
                  'is-valid': validName() && attemptedToSubmit,
                }"
                required
              />
              <label for="floatingName">Name</label>
              <div class="invalid-feedback">
                Please specify a name for the category.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="number"
                class="form-control"
                placeholder="Percentage"
                id="categoryPercentageField"
                v-model="category.percentage"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !validPercentage() && attemptedToSubmit,
                  'is-valid': validPercentage() && attemptedToSubmit,
                }"
                required
              />
              <label for="floatingName">Percentage</label>
              <div class="invalid-feedback">Please specify a percentage.</div>
            </div>
          </div>
          <div class="text-center">
            <button
              type="button"
              class="btn btn-primary"
              id="addCategoryButton"
              v-on:click="addCategory"
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
import { categoriesService } from "../../../../services/categoriesService.js";

export default {
  name: "AddCategory",
  data: function () {
    return {
      category: {
        name: "",
        percentage: 0,
        id: null
      },
      attemptedToSubmit: false
    };
  },

  methods: {
    addCategory: function () {
      var self = this;
      self.attemptedToSubmit = true;
      if (self.isFormValid() == true) {
        if(self.category.id == null){
          categoriesService.addCategory(self.category).then(() => {
            self.$emit("category-added");
            self.clearForm();
          });
        } 
        else {
          categoriesService.updateCategory(self.category).then(() => {
            self.$emit("category-added");
            self.clearForm();
          });
        }

      }
    },
    clearForm: function () {
      this.attemptedToSubmit = false;
      this.category.name = "";
      this.category.percentage = "";
      this.category.id = null;
    },
    isFormValid: function () {
      var formIsValid = false;

      if (this.validName() && this.validPercentage()) {
        formIsValid = true;
      }

      return formIsValid;
    },
    validName: function () {
      var nameIsValid = false;
      if (this.category.name.length > 0) {
        nameIsValid = true;
      }
      return nameIsValid;
    },
    validPercentage: function () {
      var percentageIsValid = false;
      if (this.category.percentage > 0) {
        percentageIsValid = true;
      }
      return percentageIsValid;
    },
    setCategory: function(category){
      this.category = category;
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