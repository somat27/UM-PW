import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/views/MainPage.vue";
import AboutUS from "@/views/AboutUS.vue";
import Help from "@/views/Help.vue";
import Report from "@/views/Report.vue";

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
  {
    path: "/report",
    name: "Report",
    component: Report,
    props: (route) => ({ defaultCategory: route.query.category || "" }),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
