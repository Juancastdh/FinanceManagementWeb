<template>
  <aside id="sidebar" class="sidebar">
    <ul class="sidebar-nav" id="sidebar-nav">
      <li v-for="item in sidebarItems" v-bind:key="item.id">
        <SidebarItem v-bind:option="item" v-on:changed-active-option="changeActiveOption"/>
      </li>
    </ul>
  </aside>
</template>

<script>
import SidebarItem from "./SidebarItem.vue";

export default {
  name: "Sidebar",
  components: {
    SidebarItem,
  },
  data() {
    return {
      sidebarItems: [
        {
          id: 1,
          title: "Dashboard",
          isCollapsed: false,
        },
        {
          id: 2,
          title: "Periods",
          isCollapsed: true,
        },
        {
          id: 3,
          title: "Transactions",
          isCollapsed: true,
        },
        {
          id: 4,
          title: "Categories",
          isCollapsed: true,
        },
      ],
    };
  },
  methods: {
    changeActiveOption: function (optionId) {
      this.sidebarItems.forEach((option) => {
        if (option.id == optionId) {
          option.isCollapsed = false;
          this.activePage = option;
        } else {
          option.isCollapsed = true;
        }
      });
    },
  },
};
</script>
