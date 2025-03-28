<template>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap"
    rel="stylesheet"
  />
  <main class="auditorias-container">
    <AppHeader />
    <AuditList />
    <AppFooter />
  </main>
</template>

<script>
import AppHeader from "../AppHeader.vue";
import AuditList from "./AuditList.vue";
import AppFooter from "../AppFooter.vue";

export default {
  name: "AuditoriasPage",
  components: {
    AppHeader,
    AuditList,
    AppFooter,
  },
};
</script>

<style scoped>
.auditorias-container {
  padding-bottom: 0%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}
</style>
