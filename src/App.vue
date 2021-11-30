<template>
  <MainHeader v-on:toggle-sidebar="onSidebarToggle"/>
  <Sidebar />
</template>

<script>
import MainHeader from "./components/MainHeader.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import Sidebar from "./components/Sidebar.vue"

export default {
  name: "App",
  components: {
    MainHeader,
    Sidebar
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
