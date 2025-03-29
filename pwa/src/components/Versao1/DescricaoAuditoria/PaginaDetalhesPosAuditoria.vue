<template>
    <div class="pwa-pagina-detalhes-pos-auditoria">
      <AppHeader />
      <AuditDetailsComponent />
      <AppFooter />
    </div>
  </template>
  
  <script>
  import AppHeader from "../AppHeader.vue";
  import AuditDetailsComponent from "./AuditDetailsComponent.vue";
  import AppFooter from "../AppFooter.vue";
  
  export default {
    name: "PaginaDetalhesPosAuditoria",
    components: {
      AppHeader,
      AuditDetailsComponent,
      AppFooter,
    },
  };
  </script>
  
  <style scoped>
  .pwa-pagina-detalhes-pos-auditoria {
  padding-bottom: 0%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  }
  </style>
  