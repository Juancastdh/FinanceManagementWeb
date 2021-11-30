<template>
  <div class="pagetitle">
    <h1>{{ title }}</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#" v-on:click="$emit('go-to-dashboard')">Home</a>
        </li>
        <li class="breadcrumb-item active">{{ title }}</li>
      </ol>
    </nav>
  </div>
</template>

<script>
export default {
  name: "PageTitle",
  props: ["title"]
};
</script>
