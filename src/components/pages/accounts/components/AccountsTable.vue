<template>
    <div class="row">
      <div class="card recent-sales">
        <div class="card-body">
          <h5 class="card-title">Accounts</h5>
          <table class="table table-dark table-striped" id="accountsTable">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">#</th>
                <th scope="col">Identifier</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
  
          <button class="btn btn-primary" type="button" data-bs-toggle="dropdown">
            Actions
          </button>
          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <li>
              <a
                class="dropdown-item"
                v-bind:class= "{ disabled: !editButtonEnabled}"
                id="editButton"
                v-on:click="editSelectedAccount"
              >
                Edit
              </a>
            </li>
            <li>
              <a
                class="dropdown-item"
                v-bind:class= "{ disabled: !removeButtonEnabled}"
                id="removeButton"
                v-on:click="removeSelectedAccounts"
              >
                Remove
              </a>
            </li>         
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import "datatables.net-bs4";
  import "datatables.net-select-bs4";
  import "jquery-datatables-checkboxes";
  import $ from "jquery";
  import { accountsService } from "../../../../services/accountsService.js";
  
  export default {
    name: "AccountsTable",
    data: function () {
      return {
        removeButtonEnabled: false,
        editButtonEnabled: false,
        accountsTable: null,
      };
    },
    methods: {
      init: function (accounts) {
        var self = this;
        self.accountsTable = $("#accountsTable").DataTable({
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
          data: accounts,
          columns: [
            {
              data: "id",
            },
            {
              data: "id",
            },
            {
              data: "identifier",
            },
            {
              data: "description",
            }
          ],
        });
        self.accountsTable.on("select", function () {
          self.enableRemoveButton();
          self.enableEditButton();
        });
        self.accountsTable.on("deselect", function () {
          self.enableRemoveButton();
          self.enableEditButton();
        });
      },
      refresh: function () {
        this.deselectAllRows();
        this.clear();
        this.reload();
        this.enableRemoveButton();
        this.enableEditButton();
      },
      clear: function () {
        this.accountsTable.clear();
      },
      reload: function () {
        accountsService.getAccounts().then((accounts) => {
          this.render(accounts);
        });
      },
      render: function (accounts) {
        this.accountsTable.rows.add(accounts);
        this.accountsTable.draw();
      },
      removeSelectedAccounts: function () {
        var self = this;
        var selectedAccounts = self.accountsTable
          .rows({ selected: true })
          .data();
        var removedAccounts = 0;
        selectedAccounts.each(function (account) {
          accountsService.deleteAccountById(account.id).then(() => {
            removedAccounts++;
            if (removedAccounts == selectedAccounts.length) {
              self.refresh();
            }
          });
        });
      },
      editSelectedAccount: function() {
  
        var self = this;
        var selectedAccounts = self.accountsTable
          .rows({ selected: true })
          .data();
        selectedAccounts.each(function (account){
          self.$emit("account-edited", account);
        });      
      },
      anyAccountsSelected: function () {
        var anyAccountsSelected = false;
        var selectedAccounts = this.accountsTable
          .rows({ selected: true })
          .data();
        if (selectedAccounts.length > 0) {
          anyAccountsSelected = true;
        }
        return anyAccountsSelected;
      },
      oneAccountSelected: function(){
        var oneAccountSelected = false;
        var selectedAccounts = this.accountsTable
          .rows({ selected: true })
          .data();
        if (selectedAccounts.length == 1) {
          oneAccountSelected = true;
        }
        return oneAccountSelected;
      },
      enableRemoveButton: function () {
        if (this.anyAccountsSelected()) {
          this.removeButtonEnabled = true;
        } else {
          this.removeButtonEnabled = false;
        }
      },
      enableEditButton: function () {
        if (this.oneAccountSelected()) {
          this.editButtonEnabled = true;
        } else {
          this.editButtonEnabled = false;
        }
      },
      deselectAllRows: function () {
        this.accountsTable.rows({ selected: true }).deselect();
      },
    },
    mounted() {
      accountsService.getAccounts().then((accounts) => {
        this.init(accounts);
      });
    },
  };
  </script>
  
  
  