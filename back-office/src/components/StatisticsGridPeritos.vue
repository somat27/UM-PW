<template>
    <section class="statistics-grid" :space="62">
      <div class="statistics-layout">
        <StatisticsCard title="Peritos Totais" value="100" />
        <StatisticsCard title="Cidades sobre vigia" value="23" />
        <StatisticsCard
          title="Peritos-Ativos"
          value="9"
        />
        <StatisticsCard title="Peritos-Aguardo"  value="91" />
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
  