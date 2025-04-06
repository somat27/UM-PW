import { createRouter, createWebHistory } from "vue-router";
import PaginaLogin from "@/components/PaginaLogin/PaginaLogin.vue";
import PaginaInicial from "@/components/PaginaInicial/PaginaInicial.vue";
import PaginaDetalhe from "@/components/PaginaDetalhe/PaginaDetalhe.vue";
import PaginaRegistar from "@/components/PaginaRegistar/PaginaRegistar.vue";

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
    },
    {
        path: "/PaginaDetalhe",
        name: "PaginaDetalhe",
        component: PaginaDetalhe,
        props: (route) => ({
          auditoria: route.query.auditoria ? JSON.parse(route.query.auditoria) : null
        })
      },
    {
        path: "/PaginaRegistar",
        name: "PaginaRegistar",
        component: PaginaRegistar,        
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;