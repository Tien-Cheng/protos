import { createApp } from 'vue';

import Qui from '@qvant/qui-max';
import '@qvant/qui-max/styles';

import router from "./router";
import { createPinia } from "pinia";

import App from './App.vue';



const main = async () => {
  const app = createApp(App);

  app.use(createPinia());
  app.use(router);
  app.use(Qui);

  router.isReady().then(() => app.mount('#app'));
}

main();
