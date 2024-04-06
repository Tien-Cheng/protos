<script setup lang="ts">
import { reactive, computed } from 'vue';

import { useRoomsStore } from "../stores/rooms";
import { useDevicesStore } from "../stores/devices";
import { useWeatherStore } from "../stores/weather";

import { Environment, Weather } from "../models";

import AppBar from '../components/AppBar.vue';
import SectionCard from "../components/SectionCard.vue";

const roomsStore = useRoomsStore();
const devicesStore = useDevicesStore();
const weatherStore = useWeatherStore();

const state = reactive({
  roomIndex: 0,
  outsideWeather: null as Weather | null,
  insideEnvironment: null as Environment | null
})

const rooms = computed(() => Object.values(roomsStore.rooms));

const currentRoom = computed(() => rooms.value[state.roomIndex]);

const devices = computed(() => devicesStore.devicesByRoomId(currentRoom.value.roomId));



const main = async () => {
  try {
    await roomsStore.getRooms();
    state.outsideWeather = await weatherStore.getCurrentWeather();
  } catch (error) {
    console.error(error);
  }

  if (rooms.value.length == 0) {
    return;
  }

  try {
    await devicesStore.getDevicesByRoom(rooms.value[0].roomId);
  } catch (error) {
    console.error(error);
  }

  try {
    const data = await fetch("https://api.data.gov.sg/v1/environment/air-temperature", {
      mode: "cors"
    })

    console.log(await data.json());
  } catch(error) {
    console.error(error);
  }
};

main();
</script>

<template>
  <div class="wrapper">
    <div class="no-rooms" v-if="rooms.length == 0">
      <div>
        <div class="h-centre">
          <img src="../assets/empty.svg" />
        </div>
        <h4>
          You currently have no rooms. <br/> Add a room or add a device to get started.
        </h4>
        <div class="h-centre">
          <QButton theme="secondary">
            Add Room
          </QButton>
        </div>
      </div>
    </div>

    <div class="room-view" v-else>
      <h1>{{ currentRoom.roomName }}</h1>
      
      <section class="environment-view">
        <SectionCard>
          <div class="weather-section">
            <h4>Weather</h4>
            <div class="env-view-icon">
              <svg v-if="state.outsideWeather?.state == 'Cloudy'" xmlns="http://www.w3.org/2000/svg" height="55" viewBox="0 -960 960 960" width="55"><path d="M263-126q-105 0-179.5-72T9-374q0-88 48.5-158.5T189-622q31-96 111-154t180-58q122 0 210 82.5T789-548q72 19 117 77.5T951-337q0 88-61.5 149.5T740-126H263Z"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" height="55" viewBox="0 -960 960 960" width="55"><path d="M568-25q-24 11-49 3t-36-32l-60-120q-11-23-2.5-48t31.5-36q24-11 49-3t36 31l60 120q11 24 3 49t-32 36Zm240 0q-24 11-49 3t-36-32l-60-120q-11-23-2.5-48t31.5-36q24-11 49-3t36 31l60 120q11 24 3 49t-32 36Zm-480 0q-24 11-49 3t-36-32l-60-120q-11-23-2.5-48t31.5-36q24-11 49-3t36 31l60 120q11 24 3 49t-32 36Zm-28-287q-100 0-171.5-71.5T57-555q0-89 57-156.5T256-794q36-57 95.5-90.5T480-918q94 0 165 57.5T736-715q72 12 119.5 68T903-515q0 84-59 143.5T700-312H300Z"/></svg>
            </div>
            <p>{{ state.outsideWeather?.state }}</p>
          </div>

          <div class="temperature-section">
            <h4>Outside</h4>
            <div>
              <p class="temperature">{{ state.outsideWeather?.temperature }}°C</p>

              <p class="humidity">{{ state.outsideWeather?.humidity }}% <br> Humidity</p>
            </div>
          </div>

          <div class="h-divider"></div>

          <div class="temperature-section inside">
            <h4>Inside</h4>
            <div>
              <p class="temperature">{{ state.insideEnvironment?.temperature }}°C</p>

              <p class="humidity">{{ state.insideEnvironment?.humidity }}% <br> Humidity</p>
            </div>
          </div>
        </SectionCard>
      </section>

      <section class="devices-view">
        <h2>Devices</h2>

        <div>
          {{ devices }}
        </div>
      </section> 
    </div>
    <AppBar>
      <div class="chip-array">
        <div class="chip" :class="{ 'chip-selected': state.roomIndex == i }" v-for="room, i in rooms" :id="room.roomId" @click="state.roomIndex = i">
          <h4>
            {{ room.roomName }}
          </h4>
        </div>
      </div>
    </AppBar>
  </div>
</template>

<style scoped>
.wrapper {
  padding: 0px 13px;
}

.no-rooms {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.no-rooms img {
  width: 50vw;
}

.no-rooms h4 {
  text-align: center;
}

.no-rooms .h-centre {
  display: flex;
  justify-content: center;
}

.room-view {
  padding-top: 55px;
}

div.section-card {
  background: linear-gradient(to right, rgb(86, 204, 242), rgb(47, 128, 237));
}

.chip-array {
  display: flex;
  overflow-x: auto;

  height: 55px;
  padding: 8px 13px;
}

.chip-array .chip {
  border-radius: 34px;
  margin-right: 10px;
  cursor: pointer;

  padding: 10px 13px;
  color: white;
}

.chip-array .chip h4 {
  margin: 0px;
}

.environment-view .section-card {
  padding: 13px 21px;

  display: flex;
  justify-content: space-between;
}

.environment-view .env-view-icon svg {
  width: 55px;
  height: 55px;
  fill: white;
}


.environment-view .weather-section h4,
.environment-view .weather-section p {
  color: white;
  margin: 0px 0px 13px 0px;
}

.environment-view .temperature-section h4,
.environment-view .temperature-section p {
  color: white;
  margin: 0px 0px 13px 0px;
}

.environment-view p.temperature {
  font-size: 28px;
  margin: 21px 0px 13px 0px;
}

.environment-view p.humidity {
  line-height: 1rem;
}

.environment-view .h-divider {
  height: 100px;
  width: 1px;
  margin: 8px 0px;
  background-color: white;
}

.chip-array .chip.chip-selected {
  background-color: var(--primary);
}
</style>