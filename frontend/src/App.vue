<script setup lang="ts">
/* Imports */
import { RouterView } from "vue-router";
</script>

<template>
  <router-view></router-view>
</template>

<style>
:root {
  --primary: #3056FE;
  --background: #f4f4f6;
  --default-shadow: 0 0 20px #00000026;
  --default-neu: -5px -5px 10px 3px #ffffffc4, 5px 5px 10px -1px #0000001a;
  --secondary-shadow: 0 0 20px #00000026;
  --secondary-neu: -4px -4px 7px #ffffffc4, 4px 4px 7px #0000001a;
  --icon-neu: -2px -2px 5px 2 #ffffffc4, 2px 2px 5px #0000001a;
  --inner-neu: -4px -4px 7px #ffffffc4 inset, 4px 4px 7px #0000001a inset;
}

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