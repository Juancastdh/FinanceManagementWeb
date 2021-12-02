<template>
  <MainHeader
    v-on:toggle-sidebar="onSidebarToggle"
    v-on:go-to-dashboard="changeActiveOptionById(1)"
  />
  <Sidebar v-on:changed-active-option="changeActiveOption" v-bind:sidebaritems="pageOptions" />
  <Page v-bind:activepage="activePage" v-on:go-to-dashboard="changeActiveOptionById(1)" />
</template>

<script>
import MainHeader from "./components/MainHeader.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import Sidebar from "./components/Sidebar.vue";
import Page from "./components/Page.vue";
import DashboardPage from "./components/DashboardPage.vue";
import PeriodsPage from "./components/PeriodsPage.vue";
import { shallowRef } from 'vue';

export default {
  name: "App",
  components: {
    MainHeader,
    Sidebar,
    Page,
  },
  data: function () {
    return {
      activePage: {
        id: 1,
        title: "Dashboard",
        isCollapsed: false,
        component: shallowRef(DashboardPage),
      },
      pageOptions: [
        {
          id: 1,
          title: "Dashboard",
          isCollapsed: false,
          component: shallowRef(DashboardPage),
        },
        {
          id: 2,
          title: "Periods",
          isCollapsed: true,
          component: shallowRef(PeriodsPage),
        },
        {
          id: 3,
          title: "Transactions",
          isCollapsed: true,
          component: shallowRef(DashboardPage),
        },
        {
          id: 4,
          title: "Categories",
          isCollapsed: true,
          component: shallowRef(DashboardPage),
        },
      ],
    };
  },
  methods: {
    onSidebarToggle: function () {
      document.querySelector("body").classList.toggle("toggle-sidebar");
    },
    changeActiveOption: function (option) {
      this.activePage = option;
    },
    changeActiveOptionById: function(optionId){
      this.pageOptions.forEach((option) => {
        if (option.id == optionId) {
          option.isCollapsed = false;
          this.activePage = option;
        } else {
          option.isCollapsed = true;
        }
      });
    }
  },
};
</script>

<style>
@import "./assets/style.dark.css";
@import "./assets/vendor/bootstrap-icons/bootstrap-icons.css";
</style>
