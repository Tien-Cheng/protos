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

import { Suggestion } from '../models';


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
    await devicesStore.getDevicesByRoom(rooms.value[0].roomId);
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
      <div class="suggestion-icon" />
      <div class="suggestion-content">
        <h2>{{ suggestion.suggestionName }}</h2>
        <h4 class="suggestion-description">{{ suggestion.suggestionDescription }}</h4>
        <button type="button" class="suggestion-button">
          <h3>Turn Off</h3>
        </button>
      </div>
    </SectionCard>
    <h2 class="section-title">Devices</h2>
    <div class="device-wrap">
      <DeviceCard v-for="device in devices" :key="device.deviceId" :device-id="device.deviceId" :name="device.deviceName" :status="device.state" :type="device.deviceType" />
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