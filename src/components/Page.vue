<template>
  <main id="main" class="main">
    <PageTitle v-on:go-to-dashboard="$emit('go-to-dashboard')" />
    <PageContent v-bind:activepage="activepage" />
  </main>
</template>

<script setup lang="ts">
import PageTitle from './PageTitle.vue'
import PageContent from './PageContent.vue'

defineProps<{
  activepage: any
}>()
</script>
