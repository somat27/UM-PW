<template>
    <section class="statistics-grid" :space="62">
      <div class="statistics-layout">
        <StatisticsCard title="Total de materiais dispensados" value="23" />
        <StatisticsCard title="Total de materiais disponíveis" value="27" />

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
  