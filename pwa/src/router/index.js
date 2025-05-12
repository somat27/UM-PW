import { createRouter, createWebHistory } from "vue-router";
import { auth, db } from "@/firebase/firebase.js";
import ListaAuditorias from "@/components/Paginas/ListaAuditorias.vue";
import InfoAuditoria from "@/components/Paginas/InfoAuditoria.vue";
import UserPerfil from "@/components/UserPerfil.vue";
import RegistoAuditoria from "@/components/Paginas/RegistoAuditoria.vue";
import LoginPage from "@/components/LoginPage.vue";
import RegisterPage from "@/components/RegisterPage.vue";
import PendingValidation from "@/components/PendingValidation.vue";

import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const routes = [
    {
      path: "/ListaAuditorias",
      name: "ListaAuditorias",
      component: ListaAuditorias,
      meta: { requiresAuth: true },
    },

    {
      path: "/InfoAuditoria/:id",
      name: "InfoAuditoria",
      component: InfoAuditoria,
      meta: { requiresAuth: true },
    },

    {
      path: "/RegistoAuditoria/:id",
      name: "RegistoAuditoria",
      component: RegistoAuditoria,
      meta: { requiresAuth: true },
    },

    {
      path: "/Perfil",
      name: "UserPerfil",
      component: UserPerfil,
      meta: { requiresAuth: true },
    },

    {
      path: "/",
      name: "LoginPage",
      component: LoginPage,
    },

    {
      path: "/register",
      name: "RegisterPage",
      component: RegisterPage,
    },

    {
      path: "/PendingValidation",
      name: "PendingValidation",
      component: PendingValidation,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});


function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      user => {
        unsubscribe()
        resolve(user)
      },
      err => {
        unsubscribe()
        reject(err)
      }
    )
  })
}

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) {
    return next()
  }

  const savedUID = localStorage.getItem('userUID')
  if (!savedUID) {
    return next({ name: 'LoginPage' })
  }

  const user = await getCurrentUser()
  if (!user) {
    localStorage.removeItem('userUID')
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