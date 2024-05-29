<template>
  <li class="nav-item">
    <router-link :to="{ name: option.name }">
      <a class="nav-link" href="#" v-bind:class="{ collapsed: isCollapsed }">
        <i class="bi bi-grid"></i>
        <span>{{ option.name }}</span>
      </a>
    </router-link>
  </li>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const props = defineProps<{
  option: any
}>()

function isCollapsed() {
  let isCollapsed = route.name != props.option.name

  return isCollapsed
}
</script>
