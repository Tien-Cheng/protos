<script setup lang="ts">
/* Imports */
import { RouterView } from "vue-router";
</script>

<template>
  <router-view></router-view>
</template>

<style>
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: #7f7f7f1a;
}

::-webkit-scrollbar-thumb {
  width: 5px;
  height: 5px;
  border-radius: 5px;
  background-color: #7f7f7f7f;
}
</style>