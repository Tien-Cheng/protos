<script setup lang="ts">
import { computed } from 'vue';

import { DeviceStatus } from "../models";

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
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m206-480 278 278q21 21 21 51t-21 51q-21 21-51.5 21T381-100L89-391q-19-19-28-42t-9-47q0-24 9-47t28-42l292-292q21-21 51.5-21t51.5 21q21 21 21 51.5T484-758L206-480Z"/></svg>
      </QButton>
      <h1>
        {{ device?.deviceName ?? "Smart Device" }}
      </h1>
    </div>

    <div>
      <div class="switch-section">
        <SectionCard :active="device.state == DeviceStatus.ACTIVE" @click="changeState">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.4249 11.425V3.72502C10.4249 3.29169 10.5791 2.92086 10.8874 2.61252C11.1957 2.30419 11.5666 2.15002 11.9999 2.15002C12.4332 2.15002 12.8041 2.30419 13.1124 2.61252C13.4207 2.92086 13.5749 3.29169 13.5749 3.72502V11.425C13.5749 11.8584 13.4207 12.2292 13.1124 12.5375C12.8041 12.8459 12.4332 13 11.9999 13C11.5666 13 11.1957 12.8459 10.8874 12.5375C10.5791 12.2292 10.4249 11.8584 10.4249 11.425ZM11.9999 21.85C10.6499 21.85 9.3749 21.5917 8.1749 21.075C6.9749 20.5584 5.92907 19.8542 5.0374 18.9625C4.14574 18.0709 3.44157 17.025 2.9249 15.825C2.40824 14.625 2.1499 13.35 2.1499 12C2.1499 10.85 2.33324 9.74169 2.6999 8.67502C3.06657 7.60836 3.5999 6.65002 4.2999 5.80002C4.58324 5.45002 4.95407 5.27086 5.4124 5.26252C5.87074 5.25419 6.26657 5.41669 6.5999 5.75002C6.8999 6.05002 7.0499 6.41669 7.0499 6.85002C7.0499 7.28336 6.91657 7.67502 6.6499 8.02502C6.21657 8.59169 5.88324 9.21252 5.6499 9.88752C5.41657 10.5625 5.2999 11.2667 5.2999 12C5.2999 13.85 5.95407 15.4292 7.2624 16.7375C8.57074 18.0459 10.1499 18.7 11.9999 18.7C13.8666 18.7 15.4499 18.0459 16.7499 16.7375C18.0499 15.4292 18.6999 13.85 18.6999 12C18.6999 11.25 18.5832 10.5292 18.3499 9.83752C18.1166 9.14586 17.7749 8.50002 17.3249 7.90002C17.0582 7.55002 16.9166 7.15836 16.8999 6.72502C16.8832 6.29169 17.0249 5.92502 17.3249 5.62502C17.6582 5.29169 18.0499 5.12502 18.4999 5.12502C18.9499 5.12502 19.3166 5.30002 19.5999 5.65002C20.3332 6.55002 20.8916 7.54169 21.2749 8.62502C21.6582 9.70836 21.8499 10.8334 21.8499 12C21.8499 13.35 21.5916 14.625 21.0749 15.825C20.5582 17.025 19.8541 18.0709 18.9624 18.9625C18.0707 19.8542 17.0291 20.5584 15.8374 21.075C14.6457 21.5917 13.3666 21.85 11.9999 21.85Z" fill="black"/>
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
      <div class="suggestion-icon" />
      <div class="suggestion-content">
        <h2>{{ suggestion.suggestionName }}</h2>
        <h4 class="suggestion-description">{{ suggestion.suggestionDescription }}</h4>
        <button type="button" class="suggestion-button"  @click="applySuggestion(suggestion.suggestionId)">
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
  width: 45px;
  height: 45px;
  margin: 20px;
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