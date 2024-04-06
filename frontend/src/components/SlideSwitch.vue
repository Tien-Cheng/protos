<script setup lang="ts">
import { onMounted, ref } from 'vue';

const input = ref();

defineProps<{
  name?: string,
  value?: boolean,
  id?: string,
}>();

const emits = defineEmits<{
  (e: "update", newValue: boolean): void,
}>();

onMounted(() => {
  // input.value.checked = props.value;
  input.value.addEventListener("change", () => {
    emits("update", input.value.checked);
  });
});

</script>

<template>
  <label class="switch-main">
    <span class="knob">
      <input type="checkbox" ref="input" :id="id" :checked="value">
    </span>
  </label>
</template>

<style scoped>
input {
  opacity: 0;
  height: 0;
  width: 0;
}

.switch-main {
  height: 36px;
  width: 70px;
  border-radius: 20px;
  background: #0000001a;
  box-shadow: var(--inner-neu);
  display: flex;
  transition: all ease .2s;
}

.switch-main:has(input:checked) {
  background: #FFFFFFb4;

  .knob {
    background: var(--primary);
  }
}

.switch-main:hover {
  cursor: pointer;
}

.knob {
  height: 26px;
  width: calc(100% - 15px);
  min-width: 26px;
  margin: 5px;
  border-radius: 20px;
  box-shadow: var(--secondary-shadow);
  background: var(--background);
  transition: all ease .2s;
}

.switch-main:hover .knob {
  transform: scale(1.1);
}

.switch-main:active .knob {
  width: 200%;
}

.switch-main:before,
.switch-main:after {
  content: "";
  width: 0px;
  transition: all ease .2s;
}

.switch-main:has(input:checked):before,
.switch-main:has(input:not(:checked)):after {
  width: 100%;
  transition-delay: .1s;
}

.v-enter-from .switch-main,
.v-leave-to .switch-main {
  width: 36px;
  margin-right: 34px;
  transform: scale(.9);
}
</style>