import { createRouter, createWebHistory } from "vue-router";

declare module "vue-router" {
  interface RouteMeta {
  }
}

export enum Routes {
  HOME = "HOME",
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: Routes.HOME,
      component: () => import("./pages/Home.vue")
    }
  ]
});

export default router;