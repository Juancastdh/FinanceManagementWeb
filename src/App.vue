<template>
  <MainHeader
    v-on:toggle-sidebar="onSidebarToggle"
  />
  <Sidebar v-bind:sidebaritems="pageOptions" />
  <Page />
</template>

<script>
import MainHeader from "./components/MainHeader.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import Sidebar from "./components/Sidebar.vue";
import Page from "./components/Page.vue";
import { routes } from './router/index.js';

export default {
  name: "App",
  components: {
    MainHeader,
    Sidebar,
    Page,
  },
  data: function () {
    return {
      pageOptions: routes,
    };
  },
  methods: {
    onSidebarToggle: function () {
      document.querySelector("body").classList.toggle("toggle-sidebar");
    }
  },
};
</script>

<style>
@import "./assets/style.dark.css";
@import "./assets/vendor/bootstrap-icons/bootstrap-icons.css";
</style>
