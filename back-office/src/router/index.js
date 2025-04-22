import { createRouter, createWebHistory } from 'vue-router';

import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

import LoginPage from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import DashboardLayout from '@/views/dashboards/DashboardLayout.vue';
import DashboardAuditorias from '@/views/dashboards/DashboardAuditorias.vue';
import DashboardOcorrencia from '@/views/dashboards/DashboardOcorrencia.vue';
import DashboardPeritos from '@/views/dashboards/DashboardPeritos.vue';
import DashboardMateriais from '@/views/dashboards/DashboardMateriais.vue';
import GestaoAuditorias from '@/views/GestaoAuditorias.vue';
import GestaoOcorrencias from '@/views/GestaoOcorrencias.vue';
import GestaoPeritos from '@/views/GestaoPeritos.vue';
import GestaoMateriais from '@/views/GestaoMateriais.vue';
import GestaoProfissionais from '@/views/GestaoProfissionais.vue';
import AprovacaoOcorrencia from '@/views/AprovacaoOcorrencia.vue'; 
import ProfilePage from '@/views/ProfilePage.vue';

const routes = [
  {
    path: '/',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage
  },
  {
    path: '/profile',
    name: 'ProfilePage',
    component: ProfilePage,
    meta:{ requiresAuth:true }
  },
  { 
    path: '/dashboards',
    component: DashboardLayout, 
    children: [
      { 
        path: 'auditorias', 
        name: 'auditorias',
        component: DashboardAuditorias 
      },
      { 
        path: 'ocorrencias', 
        name: 'ocorrencias', 
        component: DashboardOcorrencia 
      },
      { 
        path: 'peritos', 
        name: 'peritos', 
        component: DashboardPeritos 
      },
      { 
        path: 'materiais', 
        name: 'materiais', 
        component: DashboardMateriais 
      }
    ]
  },
  { 
    path: '/GestaoAuditorias', 
    name: 'GestaoAuditorias', 
    component: GestaoAuditorias 
  },
  {
    path: '/GestaoOcorrencias',
    name: 'GestaoOcorrencias',
    component: GestaoOcorrencias,

  },
  {
    path: '/GestaoOcorrencias/AprovacaoOcorrencia', 
    name: 'AprovacaoOcorrencia',
    component: AprovacaoOcorrencia
  },
  { 
    path: '/GestaoPeritos', 
    name: 'GestaoPeritos', 
    component: GestaoPeritos 
  },
  { 
    path: '/GestaoMateriais', 
    name: 'GestaoMateriais', 
    component: GestaoMateriais 
  },
  { 
    path: '/GestaoProfissionais', 
    name: 'GestaoProfissionais', 
    component: GestaoProfissionais 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresGestor) return next();

  const user = auth.currentUser;
  if (!user) return next("/");

  const snap = await getDoc(doc(db, "users", user.uid));
  if (snap.exists() && snap.data().role === "gestor") {
    next();
  } else {
    next({ path: "/pwa" });
  }
});

export default router;