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
            v-on:click="removeSelectedPeriods"
            :disabled="!removeButtonEnabled"
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
import { periodsService } from "../../../../services/periodsService.js";
import { convertDateTimeString } from "../../../../common/utils.js";

export default {
  name: "PeriodsTable",
  data: function () {
    return {
      removeButtonEnabled: false,
      periodsTable: null,
    };
  },
  methods: {
    init: function (periods) {
      var self = this;
      self.periodsTable = $("#periodsTable").DataTable({
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
      self.periodsTable.on("select", function () {
        self.enableRemoveButton();
      });
      self.periodsTable.on("deselect", function () {
        self.enableRemoveButton();
      });
    },
    refresh: function () {
      this.deselectAllRows();
      this.clear();
      this.reload();
      this.enableRemoveButton();
    },
    clear: function () {
      this.periodsTable.clear();
    },
    reload: function () {
      periodsService.getPeriods().then((periods) => {
        this.render(periods);
      });
    },
    render: function (periods) {
      this.periodsTable.rows.add(periods);
      this.periodsTable.draw();
    },
    removeSelectedPeriods: function () {
      var self = this;
      var selectedPeriods = self.periodsTable.rows({ selected: true }).data();
      var removedPeriods = 0;
      selectedPeriods.each(function (period) {
        periodsService.deletePeriodById(period.id).then(() => {
          removedPeriods++;
          if (removedPeriods == selectedPeriods.length) {
            self.refresh();
          }
        });
      });
    },
    anyPeriodsSelected: function () {
      var anyPeriodsSelected = false;
      var selectedPeriods = this.periodsTable
        .rows({ selected: true })
        .data();
      if (selectedPeriods.length > 0) {
        anyPeriodsSelected = true;
      }
      return anyPeriodsSelected;
    },
    enableRemoveButton: function () {
      if (this.anyPeriodsSelected()) {
        this.removeButtonEnabled = true;
      } else {
        this.removeButtonEnabled = false;
      }
    },
    deselectAllRows: function () {
      this.periodsTable.rows({ selected: true }).deselect();
    },
  },
  mounted() {
    periodsService.getPeriods().then((periods) => {
      this.init(periods);
    });
  },
};
</script>


