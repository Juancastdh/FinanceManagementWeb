<template>
  <div class="row">
    <div class="card recent-sales">
      <div class="card-body">
        <h5 class="card-title">Periods</h5>
    <ag-grid-vue style="width: 100%; height: 25vh"
        class="ag-theme-alpine-dark"
        :columnDefs="columnDefs"
        :rowData="rowData"
        rowSelection="multiple">
    </ag-grid-vue>
        <!-- <table class="table table-dark table-striped" id="periodsTable">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">#</th>
              <th scope="col">Start Date</th>
              <th scope="col">End Date</th>
            </tr>          
          </thead>
          <tbody>
              <tr v-for="row in rows" v-bind:key="row.id">
                  <td><input class="form-check-input me-1" name="cb" type="checkbox" value='"aria-label="..."' v-bind:id="'cb' + row.id"></td>
                  <td>{{row.id}}</td>
                  <td>{{row.startDate}}</td>
                  <td>{{row.endDate}}</td>
              </tr>
          </tbody>
        </table> -->
        <div class="text-left">
          <button
            type="button"
            class="btn btn-primary"
            id="removeButton"
            disabled
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import { AgGridVue } from "ag-grid-vue3";

export default {
  name: "PeriodsTable",
  components: {
    AgGridVue,
  },
  setup() {
    return {
      columnDefs: [
        { headerName: "#", field: "id", sortable: true, filter: true, checkboxSelection: true },
        { headerName: "Start Date", field: "startDate", sortable: true, filter: true  },
        { headerName: "End Date", field: "endDate", sortable: true, filter: true  },
      ],
      rowData: [
        { id: 1, startDate: "12/11/2021", endDate: "26/11/2021" },
      ],
    };
  },
};
</script>

<style lang="scss">
@import "~ag-grid-community/dist/styles/ag-grid.css";
@import "~ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
</style>
