<template>
  <MainHeader v-on:toggle-sidebar="onSidebarToggle"/>
  <Sidebar />
  <Page v-bind:activepage = "activePage"/>
</template>

<script>
import MainHeader from "./components/MainHeader.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import Sidebar from "./components/Sidebar.vue"
import Page from "./components/Page.vue"

export default {
  name: "App",
  components: {
    MainHeader,
    Sidebar,
    Page
  },
  data: function (){
    return {
      activePage: {
        title: "Periods"
      }
    }
  },
  methods:{
    onSidebarToggle: function(){
      document.querySelector('body').classList.toggle('toggle-sidebar');
    }
  }
};
</script>

<style>
@import "./assets/style.dark.css";
@import "./assets/vendor/bootstrap-icons/bootstrap-icons.css";
</style>
