<template>
  <li class="nav-item">
    <a
      class="nav-link"
      v-bind:class="{ collapsed: option.isCollapsed }"
      href="#"
      v-on:click="$emit('changed-active-option', option.id)"
    >
      <i class="bi bi-grid"></i>
      <span>{{ option.title }}</span>
    </a>
  </li>
</template>

<script>
export default {
  name: "SidebarItem",
  props: ["option"]
};
</script>