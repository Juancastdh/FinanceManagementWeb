<template>
  <div class="col-12 row">
    <div class="card recent-sales">
      <div class="filter">
        <a class="icon" href="#" data-bs-toggle="dropdown"
          ><i class="bi bi-three-dots"></i
        ></a>
        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
          <li class="dropdown-header text-start">
            <h6>Filter</h6>
          </li>
          <li v-for="filter in filters" v-bind:key="filter.id">
            <a
              class="dropdown-item"
              name="reports-filter"
              v-bind:id="filter.id"
              v-on:click="changeCurrentFilter(filter)"
              >{{ filter.name }}</a
            >
          </li>
        </ul>
      </div>
      <div class="card-body">
        <h5 class="card-title">
          Reports
          <span id="current-reports-filter">/{{ currentFilter.name }}</span>
        </h5>
        <div id="reportsChart" class="reports-chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
var possibleFilters = [
  {
    id: "filter-month",
    name: "This Month",
  },
  {
    id: "filter-quarter",
    name: "This Quarter",
  },
  {
    id: "filter-semester",
    name: "This Semester",
  },
  {
    id: "filter-year",
    name: "This Year",
  },
  {
    id: "filter-none",
    name: "All",
  },
];

export default {
  name: "ReportsChartSection",
  data: function () {
    return {
      filters: possibleFilters,
      currentFilter: possibleFilters[0],
    };
  },
  methods: {
    changeCurrentFilter: function (filter) {
      this.currentFilter = filter;
    },
  },
};
</script>