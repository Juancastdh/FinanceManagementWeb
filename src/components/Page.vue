<template>
  <main id="main" class="main">
    <PageTitle v-on:go-to-dashboard="$emit('go-to-dashboard')" />
    <PageContent />
  </main>
</template>

<script setup lang="ts">
import PageTitle from './PageTitle.vue'
import PageContent from './PageContent.vue'
</script>
