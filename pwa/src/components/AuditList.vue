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
        { name: "&amp;lt;Nome da Auditoria>", status: "Concluido" },
        { name: "&amp;lt;Nome da Auditoria>", status: "Concluido" },
        { name: "&amp;lt;Nome da Auditoria>", status: "Concluido" },
        { name: "&amp;lt;Nome da Auditoria>", status: "Concluido" },
        { name: "&amp;lt;Nome da Auditoria>", status: "Em Progresso" },
        { name: "&amp;lt;Nome da Auditoria>", status: "Em Progresso" },
        { name: "&amp;lt;Nome da Auditoria>", status: "Incompleto" },
        { name: "&amp;lt;Nome da Auditoria>", status: "Incompleto" },
        { name: "&amp;lt;Nome da Auditoria>", status: "Incompleto" },
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
  padding-bottom: 56px;
}

.section-title {
  height: 50px;
  color: #000;
  font-family: Inter, sans-serif;
  font-size: 28.8px;
  font-weight: 400;
  margin: 0;
}

.audit-list {
  margin: 10px 25px;
  padding: 10px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  background-color: rgba(217, 217, 217, 0.25);
}

@media (max-width: 640px) {
  .audit-list {
    margin: 10px 15px;
  }
}
</style>
