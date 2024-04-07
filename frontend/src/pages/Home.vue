<script setup lang="ts">
import { ref, computed } from 'vue';

import { Routes } from '../router';

import { useRoomsStore } from '../stores/rooms';
import { useDevicesStore } from '../stores/devices';
import { useSuggestionsStore } from '../stores/suggestions';
import { usePointsStore } from '../stores/points';

import AppBar from '../components/AppBar.vue';
import SectionCard from '../components/SectionCard.vue';
import DeviceCard from '../components/DeviceCard.vue';

import { DeviceStatus, Suggestion, DeviceType } from '../models';


const suggestionsStore = useSuggestionsStore();
const pointsStore = usePointsStore();

const points = ref(0);
const data = ref({
  power: 100,
  cost: 500
});



const roomsStore = useRoomsStore();
const devicesStore = useDevicesStore();


const rooms = computed(() => Object.values(roomsStore.rooms));
const devices = computed(() => devicesStore.favouriteDevices);



const suggestions = ref({} as { [key: string]: Suggestion });



const changeState = (deviceId: string, state: DeviceStatus) => {
  devicesStore.updateState(deviceId, state);
}

const applySuggestion = async (suggestionId: string) => {
  await suggestionsStore.applySuggestion(suggestionId);
}



const main = async () => {
  try {
    await roomsStore.getRooms();
  } catch (error) {
    console.error(error);
  }

  if (rooms.value.length == 0) {
    return;
  }

  try {
    await devicesStore.getDevices();
  } catch (error) {
    console.error(error);
  }
}

main();
suggestionsStore.getAllSuggestions().then(s => {
  suggestions.value = { ...s };
});

pointsStore.getPoints().then(() => {
  points.value = pointsStore.points;
})
</script>

<template>
  <div class="home-header">
    <img src="../assets/profile_picture.svg">
    <router-link :to="{ name: Routes.REWARDS }" class="points-button">
      <h2 class="points">
        <b>{{ points }}</b> points
      </h2>
    </router-link>
  </div>
  <div class="home-content">
    <h1 class="home-title">
      Welcome to <b>My Home</b>
      <svg class="drop-down" width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M0.292787 0.305288C0.480314 0.117817 0.734622 0.0125018 0.999786 0.0125018C1.26495 0.0125018 1.51926 0.117817 1.70679 0.305288L4.99979 3.59829L8.29279 0.305288C8.38503 0.209778 8.49538 0.133596 8.61738 0.0811869C8.73939 0.0287779 8.87061 0.00119157 9.00339 3.77571e-05C9.13616 -0.00111606 9.26784 0.0241854 9.39074 0.0744663C9.51364 0.124747 9.62529 0.199 9.71918 0.292893C9.81307 0.386786 9.88733 0.498438 9.93761 0.621334C9.98789 0.744231 10.0132 0.87591 10.012 1.00869C10.0109 1.14147 9.9833 1.27269 9.93089 1.39469C9.87848 1.5167 9.8023 1.62704 9.70679 1.71929L5.70679 5.71929C5.51926 5.90676 5.26495 6.01207 4.99979 6.01207C4.73462 6.01207 4.48031 5.90676 4.29279 5.71929L0.292787 1.71929C0.105316 1.53176 0 1.27745 0 1.01229C0 0.747124 0.105316 0.492816 0.292787 0.305288Z"
          fill="#482FF7" />
      </svg>
    </h1>
    <SectionCard id="homeMainCard">
      <div class="power-flex">
        <div class="power-wrap">
          <h3 class="card-title">
            <b>Power Consumption</b>
          </h3>
          <h1 class="power">
            {{ data.power }}
            <h4 class="power-unit">kWh</h4>
          </h1>
          <p>as of {{ new Date().toLocaleString('default', { day: 'numeric', month: 'long' }) }}</p>
        </div>
        <div class="power-icon">
          <svg width="65" height="65" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.77503 15.65L4.37503 14.925C3.72503 14.8417 3.29587 14.4875 3.08753 13.8625C2.8792 13.2375 3.0167 12.6917 3.50003 12.225L14.675 1.50002C14.7917 1.38336 14.9334 1.29586 15.1 1.23752C15.2667 1.17919 15.5 1.15002 15.8 1.15002C16.2667 1.15002 16.6209 1.35002 16.8625 1.75002C17.1042 2.15002 17.1167 2.55836 16.9 2.97502L14.1 8.52502L19.525 9.20002C20.1917 9.28336 20.625 9.63752 20.825 10.2625C21.025 10.8875 20.8834 11.4334 20.4 11.9L9.32503 22.5C9.20837 22.6167 9.0667 22.7042 8.90003 22.7625C8.73337 22.8209 8.50003 22.85 8.20003 22.85C7.73337 22.85 7.37503 22.6542 7.12503 22.2625C6.87503 21.8709 6.85837 21.4667 7.07503 21.05L9.77503 15.65Z"
              fill="white" />
          </svg>
        </div>
      </div>
      <div class="cost-flex">
        <div class="cost-wrap">
          <h3 class="card-title">
            <b>Current Cost</b>
          </h3>
          <h2>${{ data.cost }}</h2>
        </div>
        <button type="button" class="details-button">
          <h3>View Details</h3>
        </button>
      </div>
    </SectionCard>
    <h2 class="section-title">Suggestions</h2>
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
    <h2 class="section-title">Devices</h2>
    <div class="device-wrap">
      <DeviceCard v-for="device in devices" :key="device.deviceId" :device-id="device.deviceId"
        :name="device.deviceName" :status="device.state" :type="device.deviceType"
        @update="(value) => changeState(device.deviceId, value)" />
    </div>
  </div>
  <AppBar />
</template>

<style scoped>
.home-content {
  margin: 0 25px;
  padding-bottom: 100px;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;

  .points-button {
    background: none;
  }

  .points {
    color: black;
    margin: 0 10px;
  }
}

.home-title {
  margin: 10px 0;

  .drop-down {
    margin-left: 5px;
  }

  b {
    color: var(--primary);
  }
}

.section-title {
  margin: 30px 0 10px;
}

#homeMainCard {
  color: white;
  background: var(--primary);
  padding: 15px 20px;

  .power-flex,
  .cost-flex {
    display: flex;
    justify-content: space-between;
  }

  .cost-flex {
    margin: 5px 0;
    align-items: flex-end;
  }

  .power {
    margin-top: 7px;
  }

  .power-unit {
    display: inline-flex;
  }

  .power-icon svg {
    filter: var(--darkened-icon-neu);
  }
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

.device-wrap {
  display: grid;
  width: calc(100% + 20px);
  grid-template-columns: repeat(2, 1fr);
  margin: -10px;
}

.device-wrap>div.device-card {
  margin: 10px;
}
</style>