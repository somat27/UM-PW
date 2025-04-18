<template>
  <article class="details-oco">
    <h3 class="card-title">Detalhes da Ocorrência</h3>
    <ul class="card-details">
      <li><strong>Data e hora:</strong> {{ datetime }}</li>
      <li><strong>Categoria:</strong> {{ category }}</li>
      <li><strong>Prioridade:</strong> {{ priority }}</li>
      <li><strong>Descrição adicional:</strong> {{ description }}</li>
    </ul>
  </article>
</template>

<script>
export default {
  name: "DetailsOco",
  props: {
    datetime: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
.details-oco {
  background-color: #e6f4ff;
  border: 1px solid #b5d9f8;
  border-radius: 4px;
  padding: 12px 16px;
  font-family: Public Sans, -apple-system, Roboto, Helvetica, sans-serif;
  color: #333;
  font-size: 13px;
  max-width: 400px;
  width: 100%;
  transform: translate(85%, 0%);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.card-details {
  list-style: none;
  padding: 0;
  font-size: 14px;
  line-height: 1.6;
}

.card-details li {
  margin-bottom: 6px;
}
</style>
