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
          <tbody>
          </tbody>
        </table>
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
import "datatables.net-bs4";
import $ from "jquery";
import { periodsService } from "../services/periodsService.js";
import { convertDateTimeString } from "../services/utils.js";

export default {
  name: "PeriodsTable",
  components: {

  },
  data() {
    return {
        periodsTable: null
    }
  },
  methods: {
    init: function (periods) {
     this.periodsTable = $("#periodsTable").DataTable({
        data: periods,
        columns: [
          {
            data: "id",
            render: function (data) {
              return (
                '<input class="form-check-input me-1" name="cb" type="checkbox" value="aria-label="..."" id="cb' +
                data +
                '">'
              );
            },
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
    },
    refresh: function(){
      this.clear();
      this.reload();
    },
    clear: function(){
      this.periodsTable.clear();
    },
    reload: function(){
      periodsService.getPeriods.then(periods => { this.render(periods)});      
    },
    render: function(periods){
      this.periodsTable.rows.add(periods);
      this.periodsTable.draw();
    }
  },
  mounted() {
    periodsService.getPeriods.then(periods => { this.init(periods)});
  },
};
</script>


