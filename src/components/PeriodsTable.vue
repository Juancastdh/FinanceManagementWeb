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
          <button
            type="button"
            class="btn btn-primary"
            id="removeButton"
            v-on:click = "removeSelectedPeriods"
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
import "datatables.net-bs4";
import $ from "jquery";
import { periodsService } from "../services/periodsService.js";
import { convertDateTimeString } from "../services/utils.js";

export default {
  name: "PeriodsTable",
  methods: {
    init: function (periods) {
     $("#periodsTable").DataTable({
        data: periods,
        columns: [
          {
            data: "id",
            render: function (data) {
              return (
                '<input class="form-check-input me-1" name="cb" type="checkbox" value="' +
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
      this.addCheckboxBehavior();
    },
    refresh: function () {
      this.clear();
      this.reload();
    },
    clear: function () {
      var periodsTable = $("#periodsTable").DataTable();
      periodsTable.clear();
    },
    reload: function () {
      periodsService.getPeriods().then((periods) => {
        this.render(periods);
      });
    },
    render: function (periods) {
      var periodsTable = $("#periodsTable").DataTable();
      periodsTable.rows.add(periods);
      periodsTable.draw();
      this.addCheckboxBehavior();
    },
    addCheckboxBehavior: function () {
      $("input[name=cb]").change(function () {
        var $boxes = $("input[name=cb]:checked");

        if ($boxes.length > 0) {
          $("#removeButton").prop("disabled", false);
        } else {
          $("#removeButton").prop("disabled", true);
        }
      });
    },
    removeSelectedPeriods: function () {
      var selectedCheckboxes = $("input[name=cb]:checked");
      var removedPeriods = 0;
      var self = this;
      selectedCheckboxes.each(function () {
        var periodId = $(this).attr("value");
        periodsService.deletePeriodById(periodId).then(() => {
          removedPeriods++;
          if (removedPeriods == selectedCheckboxes.length) {
            self.refresh();
            $("#removeButton").prop("disabled", true);
          }
        });
      });
    },
  },
  mounted() {
    periodsService.getPeriods().then((periods) => {
      this.init(periods);
    });
  },
};
</script>


