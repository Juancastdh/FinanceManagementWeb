<script setup lang="ts">
import router from './router/index'
import MainHeader from './components/MainHeader.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import Sidebar from './components/Sidebar.vue'
import Page from './components/Page.vue'
function onSidebarToggle() {
  document.querySelector('body').classList.toggle('toggle-sidebar')
}
const pageOptions = router.getRoutes()
</script>

<template>
  <MainHeader v-on:toggle-sidebar="onSidebarToggle" />
  <Sidebar v-bind:sidebaritems="pageOptions" />
  <Page />
</template>

<style>
@import './assets/style.dark.css';
@import './assets/vendor/bootstrap-icons/bootstrap-icons.css';
</style>
