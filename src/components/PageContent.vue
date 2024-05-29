<template>
  <section class="section">
    <div class="row">
      <div class="col-lg-12">
        <router-view v-slot="{ Component }">
          <component :is="Component" :key="$route.fullPath"></component>
        </router-view>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>
