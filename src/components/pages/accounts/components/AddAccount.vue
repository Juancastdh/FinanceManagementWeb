<template>
    <div class="row">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Add Account</h5>
          <form class="row g-3 needs-validation" novalidate>
            <div class="col-md-6">
              <div class="form-floating">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Identifier"
                  id="accountIdentifierField"
                  v-model="account.identifier"
                  v-bind:class="{
                    'form-control': true,
                    'is-invalid': !validIdentifier() && attemptedToSubmit,
                    'is-valid': validIdentifier() && attemptedToSubmit,
                  }"
                  required
                />
                <label for="floatingName">Identifier</label>
                <div class="invalid-feedback">
                  Please specify an identifier for the account.
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-floating">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Description"
                  id="accountDescriptionField"
                  v-model="account.description"
                  v-bind:class="{
                    'form-control': true,
                    'is-invalid': !validDescription() && attemptedToSubmit,
                    'is-valid': validDescription() && attemptedToSubmit,
                  }"
                  required
                />
                <label for="floatingName">Description</label>
                <div class="invalid-feedback">Please specify a description for the account.</div>
              </div>
            </div>
            <div class="text-center">
              <button
                type="button"
                class="btn btn-primary"
                id="addAccountButton"
                v-on:click="addAccount"
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
  
  <script>
  import { accountsService } from "../../../../services/accountsService.js";
  
  export default {
    name: "AddAccount",
    data: function () {
      return {
        account: {
          identifier: "",
          description: "",
          id: null
        },
        attemptedToSubmit: false
      };
    },
  
    methods: {
      addAccount: function () {
        var self = this;
        self.attemptedToSubmit = true;
        if (self.isFormValid() == true) {
          if(self.account.id == null){
            accountsService.addAccount(self.account).then(() => {
              self.$emit("account-added");
              self.clearForm();
            });
          } 
          else {
            accountsService.updateAccount(self.account).then(() => {
              self.$emit("account-added");
              self.clearForm();
            });
          }
  
        }
      },
      clearForm: function () {
        this.attemptedToSubmit = false;
        this.account.identifier = "";
        this.account.description = "";
        this.account.id = null;
      },
      isFormValid: function () {
        var formIsValid = false;
  
        if (this.validIdentifier() && this.validDescription()) {
          formIsValid = true;
        }
  
        return formIsValid;
      },
      validIdentifier: function () {
        var identifierIsValid = false;
        if (this.account.identifier.length > 0) {
          identifierIsValid = true;
        }
        return identifierIsValid;
      },
      validDescription: function () {
        var descriptionIsValid = false;
        if (this.account.description.length > 0) {
          descriptionIsValid = true;
        }
        return descriptionIsValid;
      },
      setAccount: function(account){
        this.account = account;
      }
    },
  };
  </script>
  
  <style scoped>
  .divider {
    width: 5px;
    height: auto;
    display: inline-block;
  }
  </style>