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
  --default-neu: -5px -5px 10px #ffffffc4, 5px 5px 10px #0000001a;
  --secondary-shadow: 0 0 20px #00000026;
  --secondary-neu: -4px -4px 7px #ffffffc4, 4px 4px 7px #0000001a;
  --icon-neu: drop-shadow(-2px -2px 4px #ffffffc4) drop-shadow(2px 2px 4px #00000026);
  --darkened-icon-neu: drop-shadow(-2px -2px 4px #ffffff70) drop-shadow(2px 2px 4px #00000050);
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

body {
  color: black;
}

h1,
h2,
h3,
h4,
p {
  margin: 0;
  line-height: 1.2;
}

h1, h2, h3 {
  font-weight: 300;
}

h4, p {
  font-weight: 500;
}

h1 {
  font-size: 24px;
}

h2 {
  font-size: 20px;
}

h3 {
  font-size: 18px;
}

h4 {
  font-size: 14px;
}

b {
  font-weight: 700;
}

button {
  outline: none;
  border: none;
  margin: none;
  padding: none;
}
</style>