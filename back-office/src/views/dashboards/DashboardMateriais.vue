<template>
  <div class="dashboard-container">
    <div class="dashboard-layout">
      <aside class="sidebar-column">
        <nav class="sidebar-nav">
          <div class="sidebar-background">
            <NavigationList />
          </div>
        </nav>
      </aside>
      <main class="main-content">
        <div class="content-wrapper">

          <nav class="navigation-tabs">
            <router-link to="/dashboards/auditorias" class="tab-link" :class="{ active: activeTab === 'auditorias' }"
              @click="activeTab = 'auditorias'">
              Auditorias por região
            </router-link>
            <router-link to="/dashboards/ocorrencias" class="tab-link" :class="{ active: activeTab === 'ocorrencias' }"
              @click="activeTab = 'ocorrencias'">
              Ocorrências resolvidas
            </router-link>
            <router-link to="/dashboards/peritos" class="tab-link" :class="{ active: activeTab === 'peritos' }"
              @click="activeTab = 'peritos'">
              Peritos mobilizados e no aguardo
            </router-link>
            <router-link to="/dashboards/materiais" class="tab-link" :class="{ active: activeTab === 'materiais' }"
              @click="activeTab = 'materiais'">
              Materiais expedidos
            </router-link>
          </nav>

          <StatisticsGridMateriais :cards="materialCards" />

          <div class="radial-chart">
            <apexchart type="radialBar" height="350" :series="[totalDispensed, totalAvailable]"
              :options="radialOptions" />
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import apexchart from 'vue3-apexcharts';
import NavigationList from '@/components/NavigationList.vue';
import StatisticsGridMateriais from '@/components/StatisticsGridMateriais.vue';

const activeTab = ref('materiais');

// Valores estáticos de exemplo
const totalDispensed = ref(23);
const totalAvailable = ref(27);

// Gera cards com títulos e valores
const materialCards = computed(() => [
  { title: 'Total de materiais dispensados', value: totalDispensed.value },
  { title: 'Total de materiais disponíveis', value: totalAvailable.value }
]);

// Opções do gráfico radialBar
const radialOptions = {
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: { show: true, fontSize: '14px' },
        value: { fontSize: '20px', formatter: val => val }
      }
    }
  },
  labels: ['Dispensados', 'Disponíveis'],
  colors: ['#1890ff', '#13c2c2'],
  legend: {
    show: true,
    position: 'bottom',
    formatter: (seriesName, opts) => `${seriesName}: ${opts.w.config.series[opts.seriesIndex]}`
  }
};
</script>

<style scoped>
.dashboard-container {
  background: #fff;
}

.dashboard-layout {
  display: flex;
  gap: 20px;
  height: 100%;
}

.sidebar-column {
  width: 20%;
}

.main-content {
  flex: 1;
  margin-right: 10px;
  overflow-y: auto;
}

.content-wrapper {
  margin-top: 40px;
  min-height: 100%;
}

.navigation-tabs {
  margin-top: -15px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Public Sans', -apple-system, Roboto, Helvetica, sans-serif;
  padding: 8px 0;
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.tab-link {
  text-decoration: none;
  color: #6c757d;
  font-size: 14px;
  line-height: 1.5;
  padding: 10px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
  letter-spacing: 0.2px;
  white-space: nowrap;
}

.tab-link:hover {
  background-color: #f8f9fa;
  color: #495057;
}

.tab-link.active {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.08);
  font-weight: 600;
}

.tab-link.active::after {
  content: '';
  position: absolute;
  bottom: -9px;
  left: 16px;
  right: 16px;
  height: 2px;
  background-color: #1890ff;
  border-radius: 2px 2px 0 0;
}

.tab-link::after {
  content: '';
  position: absolute;
  bottom: -9px;
  left: 50%;
  right: 50%;
  height: 2px;
  background-color: #1890ff;
  transition: all 0.3s ease;
  border-radius: 2px 2px 0 0;
}

.stats-only-grid {
  margin-top: 16px;
}

.radial-chart {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}
</style>
