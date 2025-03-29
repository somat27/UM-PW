import { createRouter, createWebHistory } from 'vue-router';

import signUp from '@/views/signUp.vue';
import DashboardLayout from '@/views/dashboards/DashboardLayout.vue'; // Novo layout para agrupar as dashboards
import DashboardAuditorias from '@/views/dashboards/DashboardAuditorias.vue';
import DashboardOcorrencia from '@/views/dashboards/DashboardOcorrencia.vue';
import DashboardPeritos from '@/views/dashboards/DashboardPeritos.vue';
import DashboardMateriais from '@/views/dashboards/DashboardMateriais.vue';
import GestaoAuditorias from '@/views/GestaoAuditorias.vue';

const routes = [
  {
    path: '/',
    name: 'signUp',
    component: signUp
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
