import { createRouter, createWebHistory } from 'vue-router';

import signUp from '@/views/signUp.vue';
import DashboardLayout from '@/views/dashboards/DashboardLayout.vue'; // Novo layout para agrupar as dashboards
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

export default router;
