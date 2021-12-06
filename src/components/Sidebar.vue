<template>
  <aside id="sidebar" class="sidebar">
    <ul class="sidebar-nav" id="sidebar-nav">
      <li v-for="item in sidebaritems" v-bind:key="item.id">
        <SidebarItem v-bind:option="item"/>
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
};
</script>
