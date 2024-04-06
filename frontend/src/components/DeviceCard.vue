<script setup lang="ts">
import SectionCard from './SectionCard.vue';
import SlideSwitch from './SlideSwitch.vue';

const props = defineProps<{
  name: string,
  status: "active" | "inactive" | "disconnected" | "error",
}>();

const output = defineModel<string>();

const emits = defineEmits<{
  (e: "update", status: "active" | "inactive"): void;
}>();

function update(v: "active" | "inactive") {
  output.value = v;
  emits("update", v);
}

</script>

<template>

  <SectionCard class="device-card" :status="output">
    <h2>{{ name }}</h2>
    <div class="bottom-wrap">
      <SlideSwitch @update="v => { if (!['disconnected', 'error'].includes(status)) update(v ? 'active' : 'inactive');}" :value="status == 'active'" />
      <div class="device-icon" />
    </div>
  </SectionCard>
</template>

<style scoped>
.device-card {
  aspect-ratio: 1;
  /* max-width: calc(50vw - 20px); */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.device-card[status="active"] {
  color: white;
  background: var(--primary);
}

.bottom-wrap {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.device-icon {
  width: 40px;
  height: 40px;
  background: white;
}
</style>