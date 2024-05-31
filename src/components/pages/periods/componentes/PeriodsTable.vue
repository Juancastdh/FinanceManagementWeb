<template>
  <div class="row">
    <div class="card recent-sales">
      <div class="card-body">
        <h5 class="card-title">Periods</h5>
        <table class="table table-dark table-striped" id="periodsTable">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">#</th>
              <th scope="col">Start Date</th>
              <th scope="col">End Date</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <div class="text-left">
          <button type="button" class="btn btn-primary" id="removeButton" v-on:click="removeSelectedPeriods"
            :disabled="!removeButtonEnabled">
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { baseUrl } from "@/common/config";
import { convertDateTimeString } from "@/common/utils";
import { Period } from "@/components/services/models/period";
import { PeriodsService } from "@/components/services/periodsService";
import "datatables.net-bs4";
import $ from "jquery";
import { ref, onMounted } from "vue";

const removeButtonEnabled = ref(false);
let periodsEmptyArray = new Array<Period>()
const periodsTable = ref($('#periodsTable').DataTable({
  columnDefs: [
    {
      targets: 0,
      checkboxes: {
        selectRow: true
      }
    }
  ],
  select: {
    style: 'multi'
  },
  order: [[1, 'asc']],
  data: periodsEmptyArray,
  columns: [
    {
      data: 'id'
    },
    {
      data: 'id'
    },
    {
      data: "startDate",
      render: function (data) {
        return convertDateTimeString(data);
      },
    },
    {
      data: "endDate",
      render: function (data) {
        return convertDateTimeString(data);
      }
    }
  ]
}));

function areAnyPeriodsSelected(): boolean{

  let anyPeriodsAreSelected = false;
  let selectedPeriods = periodsTable.value.rows({ selected: true }).data();
  if(selectedPeriods.length>0){
    anyPeriodsAreSelected = true;
  }

  return anyPeriodsAreSelected;

}

function enableRemoveButton(){
  if(areAnyPeriodsSelected()){
    removeButtonEnabled.value = true;
  }
  else{
    removeButtonEnabled.value = false;
  }
}

function init(periods: Period[]) {
  periodsTable.value = $("#periodsTable").DataTable({
    columnDefs: [
      {
        targets: 0,
        checkboxes: {
          selectRow: true,
        },
      },
    ],
    select: {
      style: "multi",
    },
    order: [[1, "asc"]],
    data: periods,
    columns: [
      {
        data: "id",
      },
      {
        data: "id",
      },
      {
        data: "startDate",
        render: function (data) {
          return convertDateTimeString(data);
        },
      },
      {
        data: "endDate",
        render: function (data) {
          return convertDateTimeString(data);
        },
      },
    ],
  });
  periodsTable.value.on("select", function(){
    enableRemoveButton();
  });
  periodsTable.value.on("deselect", function(){
    enableRemoveButton();
  });
}

function deselectAllRows(){
  periodsTable.value.rows({ selected: true}).deselect();
}

function clear(){
  periodsTable.value.clear();
}

function render(periods: Period[]){
  periodsTable.value.rows.add(periods);
  periodsTable.value.draw();
}

async function reload(){
  let periodsService = new PeriodsService(baseUrl);
  let periods = await periodsService.getPeriods();
  render(periods);
}


async function refresh(){
  deselectAllRows();
  clear();
  await reload();
  enableRemoveButton(); 
}

async function removeSelectedPeriods() {
  let periodsService = new PeriodsService(baseUrl);
  let selectedPeriods = periodsTable.value.rows({ selected: true }).data();
  selectedPeriods.each(async function (period: Period) {
    await periodsService.deletePeriodById(period.id);
  });
  await refresh();
}


onMounted(async () => {
  let periodsService = new PeriodsService(baseUrl)
  let periods = await periodsService.getPeriods();
  init(periods);
});


</script>