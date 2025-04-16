import { createRouter, createWebHistory } from "vue-router";
import PaginaLogin from "@/components/PaginaLogin/PaginaLogin.vue";
import PaginaInicial from "@/components/PaginaInicial/PaginaInicial.vue";
import PaginaDetalhe from "@/components/PaginaDetalhe/PaginaDetalhe.vue";
import PaginaRegistar from "@/components/PaginaRegistar/PaginaRegistar.vue";
import { auth } from "@/firebase/firebase.js";
import VerPerfil from "@/components/VerPerfil.vue";
import ListaAuditorias from "@/components/Paginas/ListaAuditorias.vue";
import InfoAuditoria from "@/components/Paginas/InfoAuditoria.vue";

const routes = [
    {
        path: "/",
        name: "PaginaLogin",
        component: PaginaLogin,
    },
    {
        path: "/PaginaInicial",
        name: "PaginaInicial",
        component: PaginaInicial,
        meta: { requiresAuth: true },
    },
    {
        path: "/PaginaDetalhe/:id",
        name: "PaginaDetalhe",
        component: PaginaDetalhe,
        //meta: { requiresAuth: true },
    },
    {
        path: "/PaginaRegistar/:id",
        name: "PaginaRegistar",
        component: PaginaRegistar,
        //meta: { requiresAuth: true },
    },
    {
        path: "/Perfil",
        name: "Perfil",
        component: VerPerfil,
        meta: { requiresAuth: true },
    },



    {
      path: "/ListaAuditorias",
      name: "ListaAuditorias",
      component: ListaAuditorias,
    },

    {
      path: "/InfoAuditoria/:id",
      name: "InfoAuditoria",
      component: InfoAuditoria,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!auth.currentUser) {
        next({ name: 'PaginaLogin' });
      } else {
        next();
      }
    } else {
      next();
    }
  });

export default router;