import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue"; 
import SignUp from "@/pages/signUp.vue"; 
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Dashboard from "@/pages/DashboardAuditorias.vue";
import GestaoAuditorias from "@/pages/UserProfile.vue";
import Notifications from "@/pages/Notifications.vue";
import GestaoMateriais from "@/pages/Icons.vue";
import GestaoProfissionais from "@/pages/Maps.vue";
import GestaoPeritos from "@/pages/Typography.vue";
import GestaoOcorrencias from "@/pages/TableList.vue";

const routes = [
  {
    path: "/",
    redirect: "/signUp", 
  },
  {
    path: "/signUp",
    name: "signUp",
    component: SignUp,
  },
  {
    path: "/dashboard",
    component: DashboardLayout,
    children: [
      {
        path: "/dashboard",
        name: "Dashboards",
        component: Dashboard,
      },
      {
        path: "/GestaoAuditorias",
        name: "Gestão de Auditorias",
        component: GestaoAuditorias,
      },
      {
        path: "/notifications",
        name: "notifications",
        component: Notifications,
      },
      {
        path: "/GestaoMateriais",
        name: "Gestão de Materiaiss",
        component: GestaoMateriais,
      },
      {
        path: "/GestaoProfissionais",
        name: "Gestão de Profissionais",
        component: GestaoProfissionais,
      },
      {
        path: "/GestaoPeritos",
        name: "Gestão de Peritos",
        component: GestaoPeritos,
      },
      {
        path: "/GestaoOcorrencias",
        name: "Gestão de Ocorrências",
        component: GestaoOcorrencias,
      },
    ],
  },
  { path: "*", component: NotFound },
];

export default routes;
