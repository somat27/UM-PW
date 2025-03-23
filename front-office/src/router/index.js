import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/views/MainPage.vue";
import AboutUS from "@/views/AboutUS.vue";
import Help from "@/views/Help.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: MainPage,
  },
  {
    path: "/sobre-nos",
    name: "AboutUS",
    component: AboutUS,
  },
  {
    path: "/help",
    name: "Help",
    component: Help,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
