<template>
    <section class="statistics-grid" :space="62">
      <div class="statistics-layout">
        <StatisticsCard title="Total de Ocorrências Confirmadas" value="200" />
        <StatisticsCard title="Total de Ocorrências Resolvidas" value="70" />
        <StatisticsCard
          title="Dia com a maior taxa de resolução"
          value="quarta feira(80%)"
        />
        <StatisticsCard title="Dia com a menor taxa de resolução" value="quarta feira(40%)" />
      </div>
    </section>
  </template>
  
  <script>
  import StatisticsCard from "./StatisticsCard.vue";
  
  export default {
    name: "StatisticsGrid",
    components: {
      StatisticsCard,
    },
  };
  </script>
  
  <style scoped>
  .statistics-grid {
    margin-top: 80px;
    width: 100%;
    max-width: 1036px;
  }
  
  .statistics-layout {
    display: flex;
    gap: 20px;
  }
  
  @media (max-width: 991px) {
    .statistics-grid {
      max-width: 100%;
      margin-top: 40px;
    }
  
    .statistics-layout {
      flex-direction: column;
    }
  }
  </style>
  