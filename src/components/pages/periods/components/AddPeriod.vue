<template>
  <div class="row">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Add Period</h5>
        <form class="row g-3 needs-validation" id="addPeriodForm" novalidate>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="date"
                class="form-control"
                id="startDateField"
                v-model="period.startDate"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !validStartDate() && attemptedToSubmit,
                  'is-valid': validStartDate() && attemptedToSubmit,
                }"
                required
              />
              <label for="floatingName">Start Date</label>
              <div class="invalid-feedback">
                Please specify a start date for the period.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-floating">
              <input
                type="date"
                class="form-control"
                id="endDateField"
                v-model="period.endDate"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !validEndDate() && attemptedToSubmit,
                  'is-valid': validEndDate() && attemptedToSubmit,
                }"
                required
              />
              <label for="floatingName">End Date</label>
              <div class="invalid-feedback">
                Please specify an end date that is later or equal to the start
                date for the period.
              </div>
            </div>
          </div>

          <div class="text-center">
            <button
              type="button"
              class="btn btn-primary"
              id="addPeriodButton"
              v-on:click="addPeriod"
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
import { periodsService } from "../../../../services/periodsService.js";

export default {
  name: "AddPeriod",
  data: function () {
    return {
      period: {
        startDate: "",
        endDate: "",
      },
      attemptedToSubmit: false,
    };
  },
  methods: {
    printData: function () {
      console.log(this.period);
    },
    addPeriod: function () {
      var self = this;
      self.attemptedToSubmit = true;
      if (self.isFormValid() == true) {
        periodsService.addPeriod(self.period).then(() => {
          self.$emit("period-added");
          self.clearForm();
        });
      }
    },
    clearForm: function () {
      this.attemptedToSubmit = false;
      this.period.startDate = "";
      this.period.endDate = "";
    },
    isFormValid: function () {
      var formIsValid = false;

      if (this.validStartDate() && this.validEndDate()) {
        formIsValid = true;
      }

      return formIsValid;
    },
    validStartDate: function () {
      var startDateIsValid = false;
      if (this.period.startDate.length > 0) {
        startDateIsValid = true;
      }
      return startDateIsValid;
    },
    validEndDate: function () {
      var endDateIsValid = false;
      if (this.period.endDate.length > 0 && this.validDates()) {
        endDateIsValid = true;
      }
      return endDateIsValid;
    },
    validDates: function () {
      var startDateTime = new Date(this.period.startDate);
      var endDateTime = new Date(this.period.endDate);
      var datesAreValid = false;

      if (startDateTime <= endDateTime) {
        datesAreValid = true;
      }

      return datesAreValid;
    },
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