<template>
  <section class="section">
    <div class="row">
      <div class="col-lg-12">
        <component :is="activepage.component"/>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "PageContent",
  props: ["activepage"]
};
</script>