<template>
  <section class="section">
    <div class="row">
      <div class="col-lg-12">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" :key="$route.fullPath"></component>
          </keep-alive>
        </router-view>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "PageContent"
};
</script>