import { createRouter, createWebHistory } from 'vue-router';

import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import DashboardLayout from '@/views/dashboards/DashboardLayout.vue'
import DashboardAuditorias from '@/views/dashboards/DashboardAuditorias.vue'
import DashboardOcorrencia from '@/views/dashboards/DashboardOcorrencia.vue'
import DashboardPeritos from '@/views/dashboards/DashboardPeritos.vue'
import DashboardMateriais from '@/views/dashboards/DashboardMateriais.vue'
import GestaoAuditorias from '@/views/GestaoAuditorias.vue'
import GestaoOcorrencias from '@/views/GestaoOcorrencias.vue'
import GestaoPeritos from '@/views/GestaoPeritos.vue'
import GestaoMateriais from '@/views/GestaoMateriais.vue'
import GestaoProfissionais from '@/views/GestaoProfissionais.vue'
import AprovacaoOcorrencia from '@/views/AprovacaoOcorrencia.vue';
import ProfileView from '@/views/ProfileView.vue'
import EditProfile from '@/views/EditProfile.vue'
import GestaoUtilizadores from '@/views/GestaoUtilizadores.vue'
import PendingValidation from '@/views/PendingValidation.vue'

const routes = [
  {
    path: '/pendente',
    name: 'PendingValidation',
    component: PendingValidation,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage,
    meta: { requiresAuth: true, requiresGestorOrAdmin: true },
  },
  { 
    path: '/dashboards',
    component: DashboardLayout,
    meta: { requiresAuth: true, requiresGestorOrAdmin: true },
    children: [
      { 
        path: 'auditorias', 
        name: 'auditorias',
        component: DashboardAuditorias ,
        meta: { requiresAuth: true, requiresGestorOrAdmin: true },
      },
      { 
        path: 'ocorrencias', 
        name: 'ocorrencias', 
        component: DashboardOcorrencia ,
        meta: { requiresAuth: true, requiresGestorOrAdmin: true },
      },
      { 
        path: 'peritos', 
        name: 'peritos', 
        component: DashboardPeritos ,
        meta: { requiresAuth: true, requiresGestorOrAdmin: true },
      },
      { 
        path: 'materiais', 
        name: 'materiais', 
        component: DashboardMateriais ,
        meta: { requiresAuth: true, requiresGestorOrAdmin: true },
      }
    ]
  },
  { 
    path: '/GestaoAuditorias', 
    name: 'GestaoAuditorias', 
    component: GestaoAuditorias ,
    meta: { requiresAuth: true, requiresGestorOrAdmin: true },
  },
  {
    path: '/GestaoOcorrencias',
    name: 'GestaoOcorrencias',
    component: GestaoOcorrencias,
    meta: { requiresAuth: true, requiresGestorOrAdmin: true },
  },
  {
    path: '/GestaoOcorrencias/AprovacaoOcorrencia', 
    name: 'AprovacaoOcorrencia',
    component: AprovacaoOcorrencia,
    meta: { requiresAuth: true, requiresGestorOrAdmin: true },
  },
  { 
    path: '/GestaoPeritos', 
    name: 'GestaoPeritos', 
    component: GestaoPeritos ,
    meta: { requiresAuth: true, requiresGestorOrAdmin: true },
  },
  { 
    path: '/GestaoMateriais', 
    name: 'GestaoMateriais', 
    component: GestaoMateriais ,
    meta: { requiresAuth: true, requiresGestorOrAdmin: true },
  },
  { 
    path: '/GestaoProfissionais', 
    name: 'GestaoProfissionais', 
    component: GestaoProfissionais ,
    meta: { requiresAuth: true, requiresGestorOrAdmin: true },
  },
  {
    path: '/profile',
    component: DashboardLayout,
    meta: { requiresAuth: true, requiresGestorOrAdmin: true },
    children: [
      {
        path: '', name: 'ProfileView', component: ProfileView,
        meta: { requiresAuth: true, requiresGestorOrAdmin: true },
      },
      {
        path: 'edit', name: 'EditProfile', component: EditProfile,
        meta: { requiresAuth: true, requiresGestorOrAdmin: true },
      }
    ]
  },
  {
    path: '/GestaoUtilizadores',
    name: 'GestaoUtilizadores',
    component: GestaoUtilizadores,
    meta: { requiresAuth: true, requiresGestorOrAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) {
    return next()
  }

  const user = auth.currentUser
  if (!user) {
    return next({ name: 'LoginPage' })
  }

  const snap = await getDoc(doc(db, 'users', user.uid))
  const role = snap.exists() ? snap.data().role : null

  if (to.meta.requiresGestorOrAdmin) {
    if (role === 'gestor' || role === 'admin') {
      return next()
    } else {
      return next({ name: 'PendingValidation' })
    }
  }

  next()
});

export default router;