<template>
    <main id="main" class="main">
        <PageTitle v-bind:title="activepage.title" v-on:go-to-dashboard="$emit('go-to-dashboard')"/>
        <PageContent v-bind:activepage="activepage"/>
    </main>
</template>

<script>
import PageTitle from "./PageTitle.vue";
import PageContent from "./PageContent.vue";

export default {
  name: "Page",
  components: {
    PageTitle,
    PageContent
  },
  props: ["activepage"]
};
</script>