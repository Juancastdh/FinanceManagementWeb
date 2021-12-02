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
import DashboardPage from "./DashboardPage.vue";
import PeriodsPage from "./PeriodsPage.vue";
import { shallowRef } from 'vue'

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
          component: shallowRef(DashboardPage)
        },
        {
          id: 2,
          title: "Periods",
          isCollapsed: true,
          component: shallowRef(PeriodsPage)
        },
        {
          id: 3,
          title: "Transactions",
          isCollapsed: true,
          component: shallowRef(DashboardPage)
        },
        {
          id: 4,
          title: "Categories",
          isCollapsed: true,
          component: shallowRef(DashboardPage)
        },
      ],
    };
  },
  methods: {
    changeActiveOption: function (optionId) {
      this.sidebarItems.forEach((option) => {
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
