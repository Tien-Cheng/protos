<script setup lang="ts">
import { computed } from 'vue';

import { DeviceStatus, DeviceType } from "../models";

import router from "../router";

import { useDevicesStore } from "../stores/devices";
import { useSuggestionsStore } from "../stores/suggestions";

import SectionCard from '../components/SectionCard.vue';



const devicesStore = useDevicesStore();
const suggestionsStore = useSuggestionsStore();

const device = computed(() => devicesStore.deviceById(router.currentRoute.value.params.deviceId as string ?? ""));

const suggestions = computed(() => suggestionsStore.suggestionsByDeviceId(router.currentRoute.value.params.deviceId as string ?? ""));



const changeState = () => {
  devicesStore.updateState(device.value.deviceId, device.value.state == DeviceStatus.ACTIVE ? DeviceStatus.INACTIVE : DeviceStatus.ACTIVE);
}


const applySuggestion = async (suggestionId: string) => {
  await suggestionsStore.applySuggestion(suggestionId);
}



const main = async () => {
  if (device.value == null) {
    router.push("/rooms");
  }

  try {
    await suggestionsStore.getSuggestionsByDeviceId(device.value?.deviceId);
  } catch (error) {
    console.error(error);
  }
}

main();
</script>

<template>
  <div class="wrapper">
    <div class="header">
      <QButton theme="secondary" type="icon" @click="router.go(-1)">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
          <path
            d="m206-480 278 278q21 21 21 51t-21 51q-21 21-51.5 21T381-100L89-391q-19-19-28-42t-9-47q0-24 9-47t28-42l292-292q21-21 51.5-21t51.5 21q21 21 21 51.5T484-758L206-480Z" />
        </svg>
      </QButton>
      <h1>
        {{ device?.deviceName ?? "Smart Device" }}
      </h1>
    </div>

    <div>
      <div class="switch-section">
        <SectionCard :active="device.state == DeviceStatus.ACTIVE" @click="changeState">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.4249 11.425V3.72502C10.4249 3.29169 10.5791 2.92086 10.8874 2.61252C11.1957 2.30419 11.5666 2.15002 11.9999 2.15002C12.4332 2.15002 12.8041 2.30419 13.1124 2.61252C13.4207 2.92086 13.5749 3.29169 13.5749 3.72502V11.425C13.5749 11.8584 13.4207 12.2292 13.1124 12.5375C12.8041 12.8459 12.4332 13 11.9999 13C11.5666 13 11.1957 12.8459 10.8874 12.5375C10.5791 12.2292 10.4249 11.8584 10.4249 11.425ZM11.9999 21.85C10.6499 21.85 9.3749 21.5917 8.1749 21.075C6.9749 20.5584 5.92907 19.8542 5.0374 18.9625C4.14574 18.0709 3.44157 17.025 2.9249 15.825C2.40824 14.625 2.1499 13.35 2.1499 12C2.1499 10.85 2.33324 9.74169 2.6999 8.67502C3.06657 7.60836 3.5999 6.65002 4.2999 5.80002C4.58324 5.45002 4.95407 5.27086 5.4124 5.26252C5.87074 5.25419 6.26657 5.41669 6.5999 5.75002C6.8999 6.05002 7.0499 6.41669 7.0499 6.85002C7.0499 7.28336 6.91657 7.67502 6.6499 8.02502C6.21657 8.59169 5.88324 9.21252 5.6499 9.88752C5.41657 10.5625 5.2999 11.2667 5.2999 12C5.2999 13.85 5.95407 15.4292 7.2624 16.7375C8.57074 18.0459 10.1499 18.7 11.9999 18.7C13.8666 18.7 15.4499 18.0459 16.7499 16.7375C18.0499 15.4292 18.6999 13.85 18.6999 12C18.6999 11.25 18.5832 10.5292 18.3499 9.83752C18.1166 9.14586 17.7749 8.50002 17.3249 7.90002C17.0582 7.55002 16.9166 7.15836 16.8999 6.72502C16.8832 6.29169 17.0249 5.92502 17.3249 5.62502C17.6582 5.29169 18.0499 5.12502 18.4999 5.12502C18.9499 5.12502 19.3166 5.30002 19.5999 5.65002C20.3332 6.55002 20.8916 7.54169 21.2749 8.62502C21.6582 9.70836 21.8499 10.8334 21.8499 12C21.8499 13.35 21.5916 14.625 21.0749 15.825C20.5582 17.025 19.8541 18.0709 18.9624 18.9625C18.0707 19.8542 17.0291 20.5584 15.8374 21.075C14.6457 21.5917 13.3666 21.85 11.9999 21.85Z"
              fill="black" />
          </svg>
        </SectionCard>

      </div>
      <div class="energy-usage">
        <h4>2 kWh</h4>
        <p>Used this month</p>
      </div>
    </div>

    <div>
      <h2>Suggestions</h2>

      <SectionCard v-for="(suggestion) in suggestions" :key="suggestion.suggestionId" class="suggestion-card">
        <div class="suggestion-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path v-if="devicesStore.deviceById(suggestion.deviceId)?.deviceType == DeviceType.SmartPlug"
              d="M8.9999 12.375C9.3399 12.375 9.6249 12.2624 9.8549 12.0372C10.0849 11.812 10.1999 11.5329 10.1999 11.2V8.20002C10.1999 7.86002 10.0849 7.57502 9.8549 7.34502C9.6249 7.11502 9.3399 7.00002 8.9999 7.00002C8.6599 7.00002 8.3749 7.11502 8.1449 7.34502C7.9149 7.57502 7.7999 7.86002 7.7999 8.20002V11.2C7.7999 11.5329 7.9149 11.812 8.1449 12.0372C8.3749 12.2624 8.6599 12.375 8.9999 12.375ZM11.5749 17.8H12.4249C12.8582 17.8 13.2291 17.6459 13.5374 17.3375C13.8457 17.0292 13.9999 16.6584 13.9999 16.225V15.8C13.9999 15.25 13.8041 14.7792 13.4124 14.3875C13.0207 13.9959 12.5499 13.8 11.9999 13.8C11.4499 13.8 10.9791 13.9959 10.5874 14.3875C10.1957 14.7792 9.9999 15.25 9.9999 15.8V16.225C9.9999 16.6584 10.1541 17.0292 10.4624 17.3375C10.7707 17.6459 11.1416 17.8 11.5749 17.8ZM14.9999 12.375C15.3399 12.375 15.6249 12.2624 15.8549 12.0372C16.0849 11.812 16.1999 11.5329 16.1999 11.2V8.20002C16.1999 7.86002 16.0849 7.57502 15.8549 7.34502C15.6249 7.11502 15.3399 7.00002 14.9999 7.00002C14.6599 7.00002 14.3749 7.11502 14.1449 7.34502C13.9149 7.57502 13.7999 7.86002 13.7999 8.20002V11.2C13.7999 11.5329 13.9149 11.812 14.1449 12.0372C14.3749 12.2624 14.6599 12.375 14.9999 12.375ZM11.9999 22.85C10.4832 22.85 9.06668 22.566 7.75023 21.9979C6.43376 21.4299 5.28862 20.6589 4.3148 19.6851C3.34099 18.7113 2.57005 17.5662 2.002 16.2497C1.43394 14.9332 1.1499 13.5167 1.1499 12C1.1499 10.4834 1.43394 9.0668 2.002 7.75035C2.57005 6.43388 3.34099 5.28874 4.3148 4.31492C5.28862 3.34111 6.43376 2.57017 7.75023 2.00212C9.06668 1.43406 10.4832 1.15002 11.9999 1.15002C13.5166 1.15002 14.9331 1.43406 16.2496 2.00212C17.566 2.57017 18.7112 3.34111 19.685 4.31492C20.6588 5.28874 21.4298 6.43388 21.9978 7.75035C22.5659 9.0668 22.8499 10.4834 22.8499 12C22.8499 13.5167 22.5659 14.9332 21.9978 16.2497C21.4298 17.5662 20.6588 18.7113 19.685 19.6851C18.7112 20.6589 17.566 21.4299 16.2496 21.9979C14.9331 22.566 13.5166 22.85 11.9999 22.85Z"
              fill="black" />
            <path v-else-if="devicesStore.deviceById(suggestion.deviceId)?.deviceType == DeviceType.SmartHub"
              d="M8.1749 21.85C6.49157 21.85 5.06657 21.2667 3.8999 20.1C2.73324 18.9334 2.1499 17.5084 2.1499 15.825V8.17502C2.1499 6.49169 2.73324 5.06669 3.8999 3.90002C5.06657 2.73336 6.49157 2.15002 8.1749 2.15002H15.8249C17.5082 2.15002 18.9332 2.73336 20.0999 3.90002C21.2666 5.06669 21.8499 6.49169 21.8499 8.17502V15.825C21.8499 17.5084 21.2666 18.9334 20.0999 20.1C18.9332 21.2667 17.5082 21.85 15.8249 21.85H8.1749ZM11.9984 17.45C13.2827 17.45 14.3749 17.0022 15.2749 16.1067C16.1749 15.2111 16.6249 14.1235 16.6249 12.8441C16.6249 11.5647 16.1754 10.475 15.2764 9.57502C14.3774 8.67502 13.2857 8.22502 12.0014 8.22502C10.7171 8.22502 9.6249 8.67453 8.7249 9.57355C7.8249 10.4726 7.3749 11.5642 7.3749 12.8485C7.3749 14.1329 7.82441 15.2209 8.72343 16.1125C9.62244 17.0042 10.7141 17.45 11.9984 17.45ZM12.0066 15.075C11.3855 15.075 10.8582 14.8589 10.4249 14.4266C9.99157 13.9943 9.7749 13.4652 9.7749 12.8391C9.7749 12.213 9.99104 11.6875 10.4233 11.2625C10.8556 10.8375 11.3848 10.625 12.0108 10.625C12.6369 10.625 13.1624 10.8395 13.5874 11.2683C14.0124 11.6972 14.2249 12.2222 14.2249 12.8433C14.2249 13.4645 14.0105 13.9917 13.5816 14.425C13.1527 14.8584 12.6277 15.075 12.0066 15.075ZM11.9999 7.77502C12.2832 7.77502 12.5207 7.67919 12.7124 7.48752C12.9041 7.29586 12.9999 7.05836 12.9999 6.77502C12.9999 6.49169 12.9041 6.25419 12.7124 6.06252C12.5207 5.87086 12.2832 5.77502 11.9999 5.77502C11.7166 5.77502 11.4791 5.87086 11.2874 6.06252C11.0957 6.25419 10.9999 6.49169 10.9999 6.77502C10.9999 7.05836 11.0957 7.29586 11.2874 7.48752C11.4791 7.67919 11.7166 7.77502 11.9999 7.77502Z"
              fill="black" />
          </svg>
        </div>
        <div class="suggestion-content">
          <h2>{{ suggestion.suggestionName }}</h2>
          <h4 class="suggestion-description">{{ suggestion.suggestionDescription }}</h4>
          <button type="button" class="suggestion-button" @click="applySuggestion(suggestion.suggestionId)">
            <h3>Turn Off</h3>
          </button>
        </div>
      </SectionCard>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  padding: 55px 13px 0px 13px;
}

.switch-section {
  display: flex;
  justify-content: center;

  margin-top: 89px;
}

.switch-section .section-card {
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 999px;
  width: 55vw;
  height: 55vw;
}

.switch-section .section-card svg {
  width: 55%;
  height: 55%;
}

.switch-section .section-card[active="true"] {
  background-color: var(--primary);
}

.switch-section .section-card[active="true"] svg path {
  fill: white;
}

.energy-usage {
  margin-top: 34px;
  text-align: center;
}

.energy-usage h4,
.energy-usage p {
  margin: 0px;
}

.energy-usage h4 {
  font-size: 55px;
  font-weight: 500;
  margin-bottom: 21px;
}

.energy-usage p {
  font-size: 21px;
}

.header {
  display: flex;
  align-items: center;
}

.header h1 {
  margin-left: 13px;
}

.header button svg {
  margin-right: -8px;
}

.suggestion-card {
  display: flex;
}

.suggestion-icon {
  height: 100%;
  width: 80px;
  margin: 5px 15px 5px 5px;
  display: flex;
  align-items: center;
}

.suggestion-icon svg {
  width: 100%;
  height: 100%;
  filter: var(--icon-neu);
}

.suggestion-icon path {
  fill: var(--primary);
}

.suggestion-content {
  display: flex;
  flex-direction: column;
}

.suggestion-description {
  margin: 5px 0 10px;
  opacity: .8;
}

.details-button,
.suggestion-button {
  height: 32px;
  padding: 2px 20px;
  border-radius: 50px;
}

.details-button {
  background: white;
  box-shadow: var(--secondary-shadow);
  filter: var(--darkened-icon-neu);
}

.suggestion-button {
  color: white;
  background: var(--primary);
  filter: var(--secondary-neu);
  align-self: flex-end;
}
</style>