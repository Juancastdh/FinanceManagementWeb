<template>
  <li class="nav-item">
    <router-link :to="{ name: option.name}">
      <a
        class="nav-link"
        href="#"
        v-bind:class="{ collapsed: isCollapsed }"
      >
        <i class="bi bi-grid"></i>
        <span>{{ option.name }}</span>
      </a>
    </router-link>
  </li>
</template>

<script>
export default {
  name: "SidebarItem",
  props: ["option"],
  computed: {
    isCollapsed: function(){
      return this.$route.name != this.option.name;
    },
  }
};
</script>