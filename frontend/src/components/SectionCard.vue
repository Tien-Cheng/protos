<script lang="ts" setup>

</script>

<template>
  <div class="section-card">
    <slot></slot>
  </div>
</template>

<style scoped>
.section-card {
  background: var(--background);
  border-radius: 20px;
  margin: 10px 0;
  padding: 10px;
  box-shadow: var(--default-neu);
}
</style>