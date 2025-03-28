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
  padding: 10px 5%;
}

.audit-item {
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
  background-color: #d9d9d9;
}

.audit-name {
  width: 75%;
  color: #000;
  font-size: 100%;
  margin: 0;
  display: flex;
  align-items: center;
  padding-left: 2%;
}

.audit-status {
  width: 75px;
  height: 25px;
  border-radius: 15px;
  margin: 12px 1%;
  font-size: 65%;
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
</style>

