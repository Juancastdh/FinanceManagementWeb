<template>
    <div>
      <AccountsTable ref="accountsTable" v-on:account-edited="setAccountToEdit"/>
      <AddAccount ref="addAccount" v-on:account-added="refreshAccountsTable" />
    </div>
  </template>
  
  <script>
  import AccountsTable from "./components/AccountsTable.vue";
  import AddAccount from "./components/AddAccount.vue";
  
  export default {
    name: "AccountsPage",
    components: {
      AccountsTable,
      AddAccount
    },
    methods: {
      refreshAccountsTable: function () {
        this.$refs.accountsTable.refresh();
      },
      setAccountToEdit: function(account){
        this.$refs.addAccount.setAccount(account);
      }
    },
  };
  </script>