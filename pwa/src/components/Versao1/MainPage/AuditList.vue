<template>
  <section class="audit-section">
    <h2 class="section-title">Auditorias Realizadas</h2>
    <div class="audit-list">
      <AuditItem
        v-for="(audit, index) in audits"
        :key="index"
        :name="audit.name"
        :status="audit.status"
      />
    </div>
  </section>
</template>

<script>
import AuditItem from "./AuditItem.vue";

export default {
  name: "AuditList",
  components: {
    AuditItem,
  },
  data() {
    return {
      audits: [
        { name: "Buraco na estrada", status: "Concluido" },
        { name: "Buraco na estrada", status: "Concluido" },
        { name: "Buraco na estrada", status: "Concluido" },
        { name: "Buraco na estrada", status: "Concluido" },
        { name: "Buraco na estrada", status: "Em Progresso" },
        { name: "Buraco na estrada", status: "Em Progresso" },
        { name: "Rua sem luz", status: "Incompleto" },
        { name: "Rua sem luz", status: "Incompleto" },
        { name: "Rua sem luz", status: "Incompleto" },
        { name: "Rua sem luz", status: "Incompleto" },
        { name: "Rua sem luz", status: "Incompleto" },
        { name: "Rua sem luz", status: "Incompleto" },
      ],
    };
  },
};
</script>

<style scoped>
.audit-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 2.5%;
}

.section-title {
  padding-top: 1%;
  color: #000;
}

.audit-list {
  margin-left: 5%;
  margin-right: 5%;
  padding: 1% 1% 1% 1%;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  background-color: rgba(217, 217, 217, 0.25);
}
</style>
