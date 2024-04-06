import { createRouter, createWebHistory } from "vue-router";

declare module "vue-router" {
  interface RouteMeta {
  }
}

export enum Routes {
  HOME = "HOME",
  ADD = "ADD",
  ROOMS = "ROOMS",
  DEVICE = "DEVICE",
  REWARDS = "REWARDS",
  PROFILE = "PROFILE"
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: Routes.HOME,
      component: () => import("./pages/Home.vue")
    },
    {
      path: "/rooms",
      name: Routes.ROOMS,
      component: () => import("./pages/Rooms.vue")
    },
    {
      path: "/rooms/device/:roomId",
      name: Routes.DEVICE,
      component: () => import("./pages/Device.vue")
    },
    {
      path: "/add",
      name: Routes.ADD,
      component: () => import("./pages/Add.vue")
    },
    {
      path: "/rewards",
      name: Routes.REWARDS,
      component: () => import("./pages/Rewards.vue")
    },
    {
      path: "/profile",
      name: Routes.PROFILE,
      component: () => import("./pages/Profile.vue")
    }
  ]
});

export default router;