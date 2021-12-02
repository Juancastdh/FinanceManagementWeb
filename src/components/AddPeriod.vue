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
                required
              />
              <label for="floatingName">End Date</label>
              <div class="invalid-feedback">
                Please specify an end date for the period.
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
            <button type="reset" class="btn btn-secondary" id="resetButton">
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { periodsService } from "../services/periodsService.js";

export default {
  name: "AddPeriod",
  data: function () {
    return {
      period: {
        startDate: "",
        endDate: "",
      },
    };
  },
  methods: {
    printData: function () {
      console.log(this.period);
    },
    addPeriod: function () {
      var self = this;
      periodsService.addPeriod(self.period).then(() => {
        self.$emit("period-added");
        self.clearForm();
      });
    },
    clearForm: function () {
      this.period.startDate = "";
      this.period.endDate = "";
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