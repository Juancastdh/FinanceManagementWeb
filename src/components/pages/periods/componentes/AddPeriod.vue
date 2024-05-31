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
                v-model="periodToSubmit.period.startDate"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !isStartDateValid() && periodToSubmit.attemptedToSubmit,
                  'is-valid': isStartDateValid() && periodToSubmit.attemptedToSubmit,
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
                v-model="periodToSubmit.period.endDate"
                v-bind:class="{
                  'form-control': true,
                  'is-invalid': !isEndDateValid() && periodToSubmit.attemptedToSubmit,
                  'is-valid': isEndDateValid() && periodToSubmit.attemptedToSubmit,
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

<script setup lang="ts">
import { baseUrl } from '@/common/config';
import { Period } from '@/components/services/models/period';
import { PeriodsService } from '@/components/services/periodsService';
import { ref } from 'vue';

const periodToSubmit = ref({
  period: new Period(0, new Date(), new Date()),
  attemptedToSubmit: false
});

const emit = defineEmits(['period-added'])

function areDatesValid(): boolean{
  let datesAreValid = false;
  let selectedStartDate = new Date(periodToSubmit.value.period.startDate);
  let selectedEndDate = new Date(periodToSubmit.value.period.endDate);

  if(selectedStartDate <= selectedEndDate){

    datesAreValid = true;

  }

  return datesAreValid;
}


function isStartDateValid(): boolean{
  let startDateIsValid = false;

  let selectedStartDate = new Date(periodToSubmit.value.period.startDate);

  if(selectedStartDate.getFullYear() > 1){
    startDateIsValid = true;
  }

  return startDateIsValid;
}

function isEndDateValid(): boolean{
  let endDateIsValid = false;

  let selectedEndDate = new Date(periodToSubmit.value.period.endDate);

  if(selectedEndDate.getFullYear()>1 && areDatesValid()){
    endDateIsValid = true;
  }

  return endDateIsValid;
}

function isFormValid(): boolean{
  let formIsValid = true;

  if(isStartDateValid() && isEndDateValid()){
    formIsValid = true;
  }

  return formIsValid;

}


function clearForm() {
  periodToSubmit.value.attemptedToSubmit = false;
  periodToSubmit.value.period.startDate = new Date();
  periodToSubmit.value.period.endDate = new Date();
}

async function addPeriod(){
  let periodsService = new PeriodsService(baseUrl);
  periodToSubmit.value.attemptedToSubmit = true;
  if(isFormValid()){
    await periodsService.addPeriod(periodToSubmit.value.period);
    emit("period-added");
    clearForm();
  }
}
</script>

<style scoped>
.divider {
  width: 5px;
  height: auto;
  display: inline-block;
}
</style>