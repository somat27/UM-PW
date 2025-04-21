<template>
  <section class="statistics-grid">
    <div class="statistics-layout">
      <StatisticsCard
        v-for="(card, idx) in cards"
        :key="idx"
        :title="card.title"
        :value="card.value"
      />
    </div>
  </section>
</template>

<script>
import StatisticsCard from './StatisticsCard.vue';

export default {
  name: 'StatisticsGridAuditorias',
  components: { StatisticsCard },
  props: {
    labels: { type: Array, required: true },
    values: { type: Array, required: true }
  },
  computed: {
    cards() {
      const total = this.values.reduce((sum, v) => sum + v, 0);
      const average = Math.round(total / this.values.length);
      const maxIdx = this.values.indexOf(Math.max(...this.values));
      const minIdx = this.values.indexOf(Math.min(...this.values));
      return [
        { title: 'Total de Auditorias Realizadas', value: total },
        { title: 'Média de Auditorias',           value: average },
        { title: 'Área com Mais Auditorias',      value: this.labels[maxIdx] },
        { title: 'Área com Menos Auditorias',     value: this.labels[minIdx] }
      ];
    }
  }
};
</script>

<style scoped>
.statistics-grid { margin-top: 16px; width: 100%; }
.statistics-layout { display: flex; gap: 20px; }
</style>
