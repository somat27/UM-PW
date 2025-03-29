import { createRouter, createWebHistory } from 'vue-router'

import signUp from '@/views/signUp.vue'
import DashboardAuditorias from '@/views/DashboardAuditorias.vue'
import DashboardOcorrencia from '@/views/DashboardOcorrencia.vue'

const routes = [
  {
    path: '/',
    name: 'signUp',
    component: signUp
  },
  { 
    path: '/auditorias', 
    name: 'auditorias',
    component: DashboardAuditorias 
  },
  { 
    path: '/ocorrencias', 
    name: 'ocorrencias', 
    component: DashboardOcorrencia 
  }
];


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router



/*import { createRouter, createWebHistory } from "vue-router";
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

export default router;*/
