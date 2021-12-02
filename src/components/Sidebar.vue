<template>
  <aside id="sidebar" class="sidebar">
    <ul class="sidebar-nav" id="sidebar-nav">
      <li v-for="item in sidebaritems" v-bind:key="item.id">
        <SidebarItem v-bind:option="item" v-on:changed-active-option="changeActiveOption"/>
      </li>
    </ul>
  </aside>
</template>

<script>
import SidebarItem from "./SidebarItem.vue";



export default {
  name: "Sidebar",
  props: ["sidebaritems"],
  components: {
    SidebarItem,
  },
  methods: {
    changeActiveOption: function (optionId) {
      this.sidebaritems.forEach((option) => {
        if (option.id == optionId) {
          option.isCollapsed = false;
          this.$emit("changed-active-option", option);
        } else {
          option.isCollapsed = true;
        }
      });
    },
  },
};
</script>
