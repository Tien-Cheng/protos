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



const suggestions = computed(() => suggestionsStore.suggestions);



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

  try {
    await suggestionsStore.getAllSuggestions();
  } catch (error) {
    console.error(error);
  }
}

main();

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
          <template v-if="devicesStore.deviceById(suggestion.deviceId)?.deviceName.toLowerCase().includes('air con')">
            <g clip-path="url(#clip0_70_380)">
              <path
                d="M10.4 23.95C9.28338 23.95 8.43338 23.6125 7.85005 22.9375C7.26672 22.2625 6.97505 21.475 6.97505 20.575C6.97505 20.025 7.09588 19.4917 7.33755 18.975C7.57922 18.4583 7.96672 18.025 8.50005 17.675C8.83338 17.4583 9.10422 17.1917 9.31255 16.875C9.52088 16.5583 9.68338 16.2167 9.80005 15.85C9.76672 15.8167 9.72922 15.7958 9.68755 15.7875C9.64588 15.7792 9.60838 15.7583 9.57505 15.725L7.12505 16.6C6.77505 16.7333 6.42922 16.8375 6.08755 16.9125C5.74588 16.9875 5.40005 17.025 5.05005 17.025C3.73338 17.025 2.57088 16.4625 1.56255 15.3375C0.554216 14.2125 0.0500488 12.5667 0.0500488 10.4C0.0500488 9.29999 0.383382 8.45415 1.05005 7.86249C1.71672 7.27082 2.47505 6.97499 3.32505 6.97499C3.90838 6.97499 4.46672 7.09582 5.00005 7.33749C5.53338 7.57915 5.97505 7.96665 6.32505 8.49999C6.54172 8.83332 6.80838 9.10415 7.12505 9.31249C7.44172 9.52082 7.78338 9.68332 8.15005 9.79999C8.18338 9.76665 8.20422 9.72915 8.21255 9.68749C8.22088 9.64582 8.24172 9.60832 8.27505 9.57499L7.40005 7.12499C7.26672 6.79165 7.16255 6.45832 7.08755 6.12499C7.01255 5.79165 6.97505 5.45832 6.97505 5.12499C6.97505 3.79165 7.53338 2.61249 8.65005 1.58749C9.76672 0.562488 11.4167 0.0499878 13.6 0.0499878C14.7 0.0499878 15.5459 0.383321 16.1375 1.04999C16.7292 1.71665 17.025 2.47499 17.025 3.32499C17.025 3.87499 16.9042 4.42499 16.6625 4.97499C16.4209 5.52499 16.0334 5.97499 15.5 6.32499C15.1667 6.54165 14.8959 6.80832 14.6875 7.12499C14.4792 7.44165 14.3167 7.78332 14.2 8.14999C14.2334 8.18332 14.2709 8.20415 14.3125 8.21249C14.3542 8.22082 14.3917 8.24165 14.425 8.27499L16.875 7.37499C17.2084 7.24165 17.5417 7.14165 17.875 7.07499C18.2084 7.00832 18.5417 6.97499 18.875 6.97499C20.5917 6.97499 21.8667 7.65832 22.7 9.02499C23.5334 10.3917 23.95 11.9167 23.95 13.6C23.95 14.7167 23.5959 15.5708 22.8875 16.1625C22.1792 16.7542 21.4 17.05 20.55 17.05C20 17.05 19.4709 16.9208 18.9625 16.6625C18.4542 16.4042 18.025 16.0167 17.675 15.5C17.4584 15.1667 17.1917 14.8958 16.875 14.6875C16.5584 14.4792 16.2167 14.3167 15.85 14.2C15.8167 14.2333 15.7959 14.2708 15.7875 14.3125C15.7792 14.3542 15.7584 14.3917 15.725 14.425L16.6 16.875C16.7334 17.2083 16.8375 17.5333 16.9125 17.85C16.9875 18.1667 17.025 18.4917 17.025 18.825C17.025 20.175 16.4667 21.3667 15.35 22.4C14.2334 23.4333 12.5834 23.95 10.4 23.95ZM12 13.3C12.3667 13.3 12.675 13.1708 12.925 12.9125C13.175 12.6542 13.3 12.35 13.3 12C13.3 11.6333 13.175 11.325 12.925 11.075C12.675 10.825 12.3667 10.7 12 10.7C11.65 10.7 11.3459 10.825 11.0875 11.075C10.8292 11.325 10.7 11.6333 10.7 12C10.7 12.35 10.8292 12.6542 11.0875 12.9125C11.3459 13.1708 11.65 13.3 12 13.3Z"
                fill="black" />
            </g>
            <defs>
              <clipPath id="clip0_70_380">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </template>
          <path v-if="devicesStore.deviceById(suggestion.deviceId)?.deviceName.toLowerCase().includes('light')"
            d="M11.999 23.525C11.3663 23.525 10.8249 23.275 10.3749 22.775C9.9249 22.275 9.6999 21.6583 9.6999 20.925H14.2999C14.2999 21.6583 14.0746 22.275 13.624 22.775C13.1734 23.275 12.6318 23.525 11.999 23.525ZM8.9499 19.725C8.61699 19.725 8.33793 19.61 8.11273 19.38C7.88751 19.15 7.7749 18.865 7.7749 18.525C7.7749 18.1921 7.88751 17.913 8.11273 17.6878C8.33793 17.4626 8.61699 17.35 8.9499 17.35H15.0499C15.3828 17.35 15.6619 17.4626 15.8871 17.6879C16.1123 17.9132 16.2249 18.1924 16.2249 18.5254C16.2249 18.8585 16.1123 19.1416 15.8871 19.375C15.6619 19.6083 15.3828 19.725 15.0499 19.725H8.9499ZM8.0249 16.15C6.7249 15.3666 5.67074 14.3291 4.8624 13.0375C4.05407 11.7458 3.6499 10.3333 3.6499 8.79998C3.6499 6.48748 4.46142 4.52185 6.08445 2.9031C7.7075 1.28435 9.67834 0.474976 11.997 0.474976C14.3156 0.474976 16.2874 1.28435 17.9124 2.9031C19.5374 4.52185 20.3499 6.48748 20.3499 8.79998C20.3499 10.35 19.9457 11.7666 19.1374 13.05C18.3291 14.3333 17.2749 15.3666 15.9749 16.15H8.0249Z"
            fill="black" />
          <path v-else-if="devicesStore.deviceById(suggestion.deviceId)?.deviceType == DeviceType.SmartHub"
            d="M8.1749 21.85C6.49157 21.85 5.06657 21.2667 3.8999 20.1C2.73324 18.9334 2.1499 17.5084 2.1499 15.825V8.17502C2.1499 6.49169 2.73324 5.06669 3.8999 3.90002C5.06657 2.73336 6.49157 2.15002 8.1749 2.15002H15.8249C17.5082 2.15002 18.9332 2.73336 20.0999 3.90002C21.2666 5.06669 21.8499 6.49169 21.8499 8.17502V15.825C21.8499 17.5084 21.2666 18.9334 20.0999 20.1C18.9332 21.2667 17.5082 21.85 15.8249 21.85H8.1749ZM11.9984 17.45C13.2827 17.45 14.3749 17.0022 15.2749 16.1067C16.1749 15.2111 16.6249 14.1235 16.6249 12.8441C16.6249 11.5647 16.1754 10.475 15.2764 9.57502C14.3774 8.67502 13.2857 8.22502 12.0014 8.22502C10.7171 8.22502 9.6249 8.67453 8.7249 9.57355C7.8249 10.4726 7.3749 11.5642 7.3749 12.8485C7.3749 14.1329 7.82441 15.2209 8.72343 16.1125C9.62244 17.0042 10.7141 17.45 11.9984 17.45ZM12.0066 15.075C11.3855 15.075 10.8582 14.8589 10.4249 14.4266C9.99157 13.9943 9.7749 13.4652 9.7749 12.8391C9.7749 12.213 9.99104 11.6875 10.4233 11.2625C10.8556 10.8375 11.3848 10.625 12.0108 10.625C12.6369 10.625 13.1624 10.8395 13.5874 11.2683C14.0124 11.6972 14.2249 12.2222 14.2249 12.8433C14.2249 13.4645 14.0105 13.9917 13.5816 14.425C13.1527 14.8584 12.6277 15.075 12.0066 15.075ZM11.9999 7.77502C12.2832 7.77502 12.5207 7.67919 12.7124 7.48752C12.9041 7.29586 12.9999 7.05836 12.9999 6.77502C12.9999 6.49169 12.9041 6.25419 12.7124 6.06252C12.5207 5.87086 12.2832 5.77502 11.9999 5.77502C11.7166 5.77502 11.4791 5.87086 11.2874 6.06252C11.0957 6.25419 10.9999 6.49169 10.9999 6.77502C10.9999 7.05836 11.0957 7.29586 11.2874 7.48752C11.4791 7.67919 11.7166 7.77502 11.9999 7.77502Z"
            fill="black" />
          <path v-else
            d="M8.9999 12.375C9.3399 12.375 9.6249 12.2624 9.8549 12.0372C10.0849 11.812 10.1999 11.5329 10.1999 11.2V8.20002C10.1999 7.86002 10.0849 7.57502 9.8549 7.34502C9.6249 7.11502 9.3399 7.00002 8.9999 7.00002C8.6599 7.00002 8.3749 7.11502 8.1449 7.34502C7.9149 7.57502 7.7999 7.86002 7.7999 8.20002V11.2C7.7999 11.5329 7.9149 11.812 8.1449 12.0372C8.3749 12.2624 8.6599 12.375 8.9999 12.375ZM11.5749 17.8H12.4249C12.8582 17.8 13.2291 17.6459 13.5374 17.3375C13.8457 17.0292 13.9999 16.6584 13.9999 16.225V15.8C13.9999 15.25 13.8041 14.7792 13.4124 14.3875C13.0207 13.9959 12.5499 13.8 11.9999 13.8C11.4499 13.8 10.9791 13.9959 10.5874 14.3875C10.1957 14.7792 9.9999 15.25 9.9999 15.8V16.225C9.9999 16.6584 10.1541 17.0292 10.4624 17.3375C10.7707 17.6459 11.1416 17.8 11.5749 17.8ZM14.9999 12.375C15.3399 12.375 15.6249 12.2624 15.8549 12.0372C16.0849 11.812 16.1999 11.5329 16.1999 11.2V8.20002C16.1999 7.86002 16.0849 7.57502 15.8549 7.34502C15.6249 7.11502 15.3399 7.00002 14.9999 7.00002C14.6599 7.00002 14.3749 7.11502 14.1449 7.34502C13.9149 7.57502 13.7999 7.86002 13.7999 8.20002V11.2C13.7999 11.5329 13.9149 11.812 14.1449 12.0372C14.3749 12.2624 14.6599 12.375 14.9999 12.375ZM11.9999 22.85C10.4832 22.85 9.06668 22.566 7.75023 21.9979C6.43376 21.4299 5.28862 20.6589 4.3148 19.6851C3.34099 18.7113 2.57005 17.5662 2.002 16.2497C1.43394 14.9332 1.1499 13.5167 1.1499 12C1.1499 10.4834 1.43394 9.0668 2.002 7.75035C2.57005 6.43388 3.34099 5.28874 4.3148 4.31492C5.28862 3.34111 6.43376 2.57017 7.75023 2.00212C9.06668 1.43406 10.4832 1.15002 11.9999 1.15002C13.5166 1.15002 14.9331 1.43406 16.2496 2.00212C17.566 2.57017 18.7112 3.34111 19.685 4.31492C20.6588 5.28874 21.4298 6.43388 21.9978 7.75035C22.5659 9.0668 22.8499 10.4834 22.8499 12C22.8499 13.5167 22.5659 14.9332 21.9978 16.2497C21.4298 17.5662 20.6588 18.7113 19.685 19.6851C18.7112 20.6589 17.566 21.4299 16.2496 21.9979C14.9331 22.566 13.5166 22.85 11.9999 22.85Z"
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