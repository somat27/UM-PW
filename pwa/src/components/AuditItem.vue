<template>
  <article class="audit-item-container">
    <div class="audit-item">
      <h3 class="audit-name">{{ name }}</h3>
      <div class="audit-status" :class="statusClass">{{ status }}</div>
    </div>
  </article>
</template>

<script>
export default {
  name: "AuditItem",
  props: {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      validator: (value) =>
        ["Concluido", "Em Progresso", "Incompleto"].includes(value),
    },
  },
  computed: {
    statusClass() {
      switch (this.status) {
        case "Concluido":
          return "status-completed";
        case "Em Progresso":
          return "status-in-progress";
        case "Incompleto":
          return "status-incomplete";
        default:
          return "";
      }
    },
  },
};
</script>

<style scoped>
.audit-item-container {
  padding: 10px 20px;
}

.audit-item {
  width: 300px;
  height: 50px;
  border-radius: 15px;
  display: flex;
  margin: 0 auto;
  background-color: #d9d9d9;
}

.audit-name {
  width: 200px;
  height: 50px;
  color: #000;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: normal;
  margin: 0;
  display: flex;
  align-items: center;
  padding-left: 10px;
}

.audit-status {
  width: 60px;
  height: 25px;
  border-radius: 15px;
  margin: 12.5px 20px;
  font-family: Inter, sans-serif;
  font-size: 10px;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-completed {
  background-color: #0f0;
}

.status-in-progress {
  background-color: #fff600;
}

.status-incomplete {
  background-color: #f00;
}

@media (max-width: 640px) {
  .audit-item {
    width: 100%;
  }
}
</style>
