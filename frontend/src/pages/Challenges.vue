<script setup lang="ts">
import { ref } from 'vue';
import AppBar from '../components/AppBar.vue';
import SectionCard from '../components/SectionCard.vue';
import { Routes } from '../router';

const data = ref({
  score: 250,
});

const challenges = ref([
  {
    title: "10% off next month’s bills",
    description: "To be applied before GST tax.\nUsable after 1st May.",
    points: 100,
  },
  {
    title: "20% off Air Conditioner charges",
    description: "To be applied before GST tax.\nApplies to smart devices found in app.",
    points: 100,
  },
] as {
  title: string,
  description: string,
  points: number,
}[]);

</script>

<template>
  <div class="challenges-content">
    <!-- <h1 class="challenges-title">
      Challenges
    </h1> -->
    <SectionCard id="scoreCard">
      <div class="score-wrap">
        <h3 class="card-title">
          <b>Current Score</b>
        </h3>
        <h1 class="score">
          {{ data.score }}
          <h4 class="score-unit">points</h4>
        </h1>
        <h3>
          {{ challenges.length }}
          <p class="challenges-trailing-text">challenges</p>
        </h3>
      </div>
      <div class="details-wrap">
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 14.475L13.325 15.275C13.625 15.4583 13.9167 15.4458 14.2 15.2375C14.4833 15.0292 14.5833 14.7583 14.5 14.425L14.15 12.925L15.325 11.9C15.5917 11.6667 15.6708 11.3875 15.5625 11.0625C15.4542 10.7375 15.225 10.5583 14.875 10.525L13.325 10.4L12.725 8.95C12.5917 8.61667 12.35 8.45 12 8.45C11.65 8.45 11.4083 8.61667 11.275 8.95L10.675 10.4L9.125 10.525C8.775 10.5583 8.54583 10.7375 8.4375 11.0625C8.32917 11.3875 8.40833 11.6667 8.675 11.9L9.85 12.925L9.5 14.425C9.41667 14.7583 9.51667 15.0292 9.8 15.2375C10.0833 15.4458 10.375 15.4583 10.675 15.275L12 14.475ZM8.525 20.85H6.3C5.41667 20.85 4.67083 20.5458 4.0625 19.9375C3.45417 19.3292 3.15 18.5833 3.15 17.7V15.475L1.9 14.2C1.6 13.9 1.375 13.5583 1.225 13.175C1.075 12.7917 1 12.4 1 12C1 11.6 1.075 11.2083 1.225 10.825C1.375 10.4417 1.6 10.1 1.9 9.8L3.15 8.525V6.3C3.15 5.41667 3.45417 4.67083 4.0625 4.0625C4.67083 3.45417 5.41667 3.15 6.3 3.15H8.525L9.8 1.9C10.1167 1.6 10.4625 1.375 10.8375 1.225C11.2125 1.075 11.6 1 12 1C12.4 1 12.7875 1.075 13.1625 1.225C13.5375 1.375 13.8833 1.6 14.2 1.9L15.475 3.15H17.7C18.5833 3.15 19.3292 3.45417 19.9375 4.0625C20.5458 4.67083 20.85 5.41667 20.85 6.3V8.525L22.1 9.8C22.4 10.1167 22.625 10.4625 22.775 10.8375C22.925 11.2125 23 11.6 23 12C23 12.4 22.925 12.7875 22.775 13.1625C22.625 13.5375 22.4 13.8833 22.1 14.2L20.85 15.475V17.7C20.85 18.5833 20.5458 19.3292 19.9375 19.9375C19.3292 20.5458 18.5833 20.85 17.7 20.85H15.475L14.2 22.1C13.9 22.4 13.5583 22.625 13.175 22.775C12.7917 22.925 12.4 23 12 23C11.6 23 11.2083 22.925 10.825 22.775C10.4417 22.625 10.1 22.4 9.8 22.1L8.525 20.85Z"
            fill="white" />
        </svg>
        <router-link :to="{ name: Routes.REWARDS }" class="vouchers-button">
          <h3>View Vouchers</h3>
        </router-link>
      </div>
    </SectionCard>
    <h2 class="section-title">Challenges</h2>
    <SectionCard v-for="value in challenges" class="suggestion-card">
      <div class="suggestion-content">
        <h2>{{ value.title }}</h2>
        <h4 class="suggestion-description">{{ value.description }}</h4>
        <button type="button" class="suggestion-button">
          <h3>{{ value.description }}</h3>
        </button>
      </div>
    </SectionCard>
  </div>
  <AppBar />
</template>

<style scoped>
.challenges-content {
  margin: 0 25px;
  padding: 25px 0 100px;
}

.challenges-title {
  margin: 10px 0;
}

#scoreCard {
  color: white;
  background: var(--primary);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;

  .score-unit,
  .challenges-trailing-text {
    display: inline-flex;
  }

  .challenges-trailing-text {
    font-size: 14px;
    margin-top: 5px;
  }

  .details-wrap {
    display: flex;
    align-items: end;
    flex-direction: column;

    svg {
      filter: var(--darkened-icon-neu);
    }
  }

  .vouchers-button {
    height: 32px;
    padding: 2px 20px;
    margin: 15px 0 5px;
    border-radius: 50px;
    background: white;
    box-shadow: var(--secondary-shadow);
    display: flex;
    align-items: center;
    filter: var(--darkened-icon-neu);
  }

}
</style>