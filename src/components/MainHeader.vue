<template>
  <header id="header" class="header fixed-top d-flex align-items-center">
    <div class="d-flex align-items-center justify-content-between">
      <router-link class="logo d-flex align-items-center" to="/">
        <span class="d-none d-lg-block">Finance Management</span>
      </router-link>
      <i class="bi bi-list toggle-sidebar-btn" v-on:click="$emit('toggle-sidebar')"></i>
    </div>
  </header>
</template>

<script>
export default {
  name: "MainHeader"
};
</script>