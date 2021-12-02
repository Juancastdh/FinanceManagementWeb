<template>
  <MainHeader v-on:toggle-sidebar="onSidebarToggle" />
  <Sidebar v-on:changed-active-option="changeActiveOption" />
  <Page v-bind:activepage="activePage" />
</template>

<script>
import MainHeader from "./components/MainHeader.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import Sidebar from "./components/Sidebar.vue";
import Page from "./components/Page.vue";
import DashboardPage from "./components/DashboardPage.vue";

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
        component: DashboardPage,
      },
    };
  },
  methods: {
    onSidebarToggle: function () {
      document.querySelector("body").classList.toggle("toggle-sidebar");
    },
    changeActiveOption: function(option){
      this.activePage = option;

    }
  },
};
</script>

<style>
@import "./assets/style.dark.css";
@import "./assets/vendor/bootstrap-icons/bootstrap-icons.css";
</style>
