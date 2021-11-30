<template>
  <header id="header" class="header fixed-top d-flex align-items-center">
    <div class="d-flex align-items-center justify-content-between">
      <a href="#" class="logo d-flex align-items-center">
        <span class="d-none d-lg-block">Finance Management</span>
      </a>
      <i class="bi bi-list toggle-sidebar-btn" v-on:click="$emit('toggle-sidebar')"></i>
    </div>
  </header>
</template>

<script>
export default {
  name: "MainHeader"
};
</script>