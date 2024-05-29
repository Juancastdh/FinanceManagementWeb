<template>
  <div class="pagetitle">
    <h1>{{ $route.name }}</h1>
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/">Home</router-link>
        </li>
        <li class="breadcrumb-item active">{{ $route.name }}</li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts"></script>
