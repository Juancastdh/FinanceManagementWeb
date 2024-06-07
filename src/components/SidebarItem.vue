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
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const props = defineProps<{
  option: any
}>()

const isCollapsed = computed(() => {
  let isCollapsed = route.name != props.option.name

  return isCollapsed
})
</script>
