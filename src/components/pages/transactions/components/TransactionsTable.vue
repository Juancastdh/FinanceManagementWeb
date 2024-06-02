<template>
    <div class="row">
        <div class="card recent-sales">
            <div class="filter">
                <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                    <li class="dropdown-header text-start">
                        <h6>Filter</h6>
                    </li>
                    <li v-for="filter in possibleFilters" v-bind:key="filter.id">
                        <a class="dropdown-item" name="reports-filter" v-bind:id="filter.id"
                            v-on:click="changeCurrentFilter(filter)">{{ filter.name }}</a>
                    </li>
                </ul>
            </div>
            <div class="card-body">
                <h5 class="card-title">
                    Transactions
                    <span id="current-reports-filter">/{{ currentFilter.name }}</span>
                </h5>
                <table class="table table-dark table-striped" id="transactionsTable">
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">#</th>
                            <th scope="col">Date</th>
                            <th scope="col">Description</th>
                            <th scope="col">Category</th>
                            <th scope="col">Value</th>
                            <th scope="col">Type</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <div class="text-left">
                    <button type="button" class="btn btn-primary" id="removeButton"
                        v-on:click="removeSelectedTransactions" :disabled="!removeButtonEnabled">
                        Remove
                    </button>
                    <hr>
                    <button type="button" class="btn btn-primary" id="uploadTransactionsButton" v-on:click="onPickFile">
                        Upload
                    </button>
                    <input type="file" style="display: none" ref="fileInput" accept=".xml,.json"
                        v-on:change="onFilePicked" />
                </div>
                <div class="text-left"></div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import "datatables.net-bs4";
import "datatables.net-select-bs4";
import "jquery-datatables-checkboxes";
import $ from "jquery";
import { onMounted, ref } from "vue";
import type { Category } from "@/components/services/models/category";
import { Period } from "@/components/services/models/period";
import { FinancialTransaction } from "@/components/services/models/financialTransaction";
import { convertDateTimeString, getDateRangeByMonthRange, monthRanges } from "@/common/utils";
import { CategoriesService } from "@/components/services/categoriesService";
import { baseUrl } from "@/common/config";
import { FinancialReport } from "@/components/services/models/financialReport";
import { TransactionsService } from "@/components/services/transactionsService";
import { Filter } from "./models/filter";
import { FinancialTransactionsXmlCreateDto } from "@/components/services/models/financialTransactionsXmlCreateDto";
import { PeriodsService } from "@/components/services/periodsService";

const possibleFilters = ref([
    new Filter("filter-period", "Last Period"),
    new Filter("filter-month", "Last Month"),
    new Filter("filter-semester", "Last Semester"),
    new Filter("filter-year", "Last Year"),
    new Filter("filter-none", "All")
]);

const props = defineProps<{
    categories: Category[]
}>();

const latestPeriod = ref(new Period(0, new Date(), new Date()));

const currentFilter = ref(possibleFilters.value[0]);

const removeButtonEnabled = ref(false);

const transactionsTable = ref($("#transactionsTable").DataTable({
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
    data: new Array<FinancialTransaction>,

    columns: [
        {
            data: "id",
        },
        {
            data: "id",
        },
        {
            data: "date",
            render: function (data: string) {
                return convertDateTimeString(data);
            },
        },
        {
            data: "description",
        },
        {
            data: "categoryId",
            render: function () {
                return ""
            },
        },
        {
            data: "value",
            render: function (data: number) {
                return "RD$ " + data.toString();
            },
        },
        {
            data: "isExpense",
            render: function (data: boolean) {
                if (data == true) {
                    return '<span class="badge bg-danger">Expense</span>';
                } else {
                    return '<span class="badge bg-success">Income</span>';
                }
            },
        },
    ],
}));

const fileInput = ref();


async function getCategoryById(id: number): Promise<Category> {
    let categoriesService = new CategoriesService(baseUrl);
    let category = await categoriesService.getCategoryById(id);
    return category;
}


function anyTransactionsSelected() {
    let anyTransactionsSelected = false;
    let selectedTransactions = transactionsTable.value.rows({ selected: true }).data();
    if (selectedTransactions.length > 0) {
        anyTransactionsSelected = true;
    }

    return anyTransactionsSelected;
}


function enableRemoveButton() {

    if (anyTransactionsSelected()) {
        removeButtonEnabled.value = true;
    } else {
        removeButtonEnabled.value = false;
    }
}

function init(transactions: FinancialTransaction[]) {
    transactionsTable.value = $("#transactionsTable").DataTable({
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
        data: transactions,

        columns: [
            {
                data: "id",
            },
            {
                data: "id",
            },
            {
                data: "date",
                render: function (data: string) {
                    return convertDateTimeString(data);
                },
            },
            {
                data: "description",
            },
            {
                data: "categoryId",
                render: async function (data: number) {
                    let category = await getCategoryById(data);
                    return category.name;
                },
            },
            {
                data: "value",
                render: function (data: number) {
                    return "RD$ " + data;
                },
            },
            {
                data: "isExpense",
                render: function (data: boolean) {
                    if (data == true) {
                        return '<span class="badge bg-danger">Expense</span>';
                    } else {
                        return '<span class="badge bg-success">Income</span>';
                    }
                },
            },
        ],
    });

    transactionsTable.value.on("select", function () {
        enableRemoveButton();
    });

    transactionsTable.value.on("deselect", function () {
        enableRemoveButton();
    });
}


function deselectAllRows() {
    transactionsTable.value.rows({ selected: true }).deselect();
}

function clear() {
    transactionsTable.value.clear();
}

async function getFinancialReportBasedOnCurrentFilter(): Promise<FinancialReport> {
    let financialReport = new FinancialReport(new Array<FinancialTransaction>, 0);
    let transactionsService = new TransactionsService(baseUrl);
    if (currentFilter.value.id == "filter-period") {
        financialReport = await transactionsService.getFinancialReport(latestPeriod.value.id, null, null, null);
    }
    else if (currentFilter.value.id == "filter-none") {
        financialReport = await transactionsService.getFinancialReport(null, null, null, null);
    }
    else {
        let monthRangeId = currentFilter.value.id.replace("filter-", "");
        let monthRange = monthRanges[monthRangeId];
        let dateRangeFilter = getDateRangeByMonthRange(monthRange);
        financialReport = await transactionsService.getFinancialReport(null, dateRangeFilter.startDate, dateRangeFilter.endDate, null);
    }

    return financialReport;
}

function render(transactions: FinancialTransaction[]) {
    transactionsTable.value.rows.add(transactions);
    transactionsTable.value.draw();
}

async function reload() {
    let financialReport = await getFinancialReportBasedOnCurrentFilter();
    render(financialReport.financialTransactions);
}

async function refresh() {
    deselectAllRows();
    clear();
    await reload();
    enableRemoveButton();
}

async function removeSelectedTransactions() {
    let transactionsService = new TransactionsService(baseUrl);
    let selectedTransactions = transactionsTable.value.rows({ selected: true }).data();
    selectedTransactions.each(async function (transaction: FinancialTransaction) {
        await transactionsService.deleteTransactionById(transaction.id);
    });
    await refresh();
}

async function changeCurrentFilter(filter: Filter){
    currentFilter.value = filter;
    await refresh();
}

function onPickFile(){
    fileInput.value.click();
}

function onFilePicked(event: any){
    let transactionsService = new TransactionsService(baseUrl);
    let files = event.target.files;
    let fileReader = new FileReader();
    fileReader.addEventListener("load", async () => {
        let base64FileString = fileReader.result?.toString()?.split(',')[1];
        let request = new FinancialTransactionsXmlCreateDto(base64FileString);
        await transactionsService.addManyTransactionsXml(request);
        await refresh();
    });
    fileReader.readAsDataURL(files[0]);
}

onMounted(async () => {
    let periodsService = new PeriodsService(baseUrl);
    latestPeriod.value = await periodsService.getLatestPeriod();
    let latestPeriodFinancialReport = await getFinancialReportBasedOnCurrentFilter();
    init(latestPeriodFinancialReport.financialTransactions);
});



</script>