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
            <router-link
              to="/dashboards/auditorias"
              class="tab-link"
              :class="{ active: activeTab === 'auditorias' }"
              @click="activeTab = 'auditorias'"
            >
              Auditorias por região
            </router-link>
            <router-link
              to="/dashboards/ocorrencias"
              class="tab-link"
              :class="{ active: activeTab === 'ocorrencias' }"
              @click="activeTab = 'ocorrencias'"
            >
              Ocorrências resolvidas
            </router-link>
            <router-link
              to="/dashboards/peritos"
              class="tab-link"
              :class="{ active: activeTab === 'peritos' }"
              @click="activeTab = 'peritos'"
            >
              Peritos mobilizados e no aguardo
            </router-link>
            <router-link
              to="/dashboards/materiais"
              class="tab-link"
              :class="{ active: activeTab === 'materiais' }"
              @click="activeTab = 'materiais'"
            >
              Materiais expedidos
            </router-link>
          </nav>

          <StatisticsGridPeritos
            :labels="filteredIndices.map(i => localities[i])"
            :mobilized-data="mobilizedData"
            :waiting-data="waitingData"
          />

          <div id="chart">
            <apexchart
              type="bar"
              height="350"
              :options="chartOptions"
              :series="series"
            />
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
import StatisticsGridPeritos from '@/components/StatisticsGridPeritos.vue';

const activeTab = ref('peritos');
const localities = ['Lisboa', 'Porto', 'Coimbra', 'Faro', 'Braga'];
const mobilizedData = [100, 80, 45, 60, 30];
const waitingData = [20, 15, 10, 12, 8];

const filteredIndices = computed(() => {
  return localities.map((_, i) => i);
});

const series = computed(() => [
  { name: 'Mobilizados', data: filteredIndices.value.map(i => mobilizedData[i]) },
  { name: 'Aguardando', data: filteredIndices.value.map(i => waitingData[i]) }
]);

const chartOptions = computed(() => ({
  chart: { type: 'bar', height: 350 },
  plotOptions: { bar: { columnWidth: '45%', distributed: true } },
  dataLabels: { enabled: false },
  xaxis: { categories: filteredIndices.value.map(i => localities[i]) }
}));
</script>

<style scoped>
.dashboard-container {
  background: #fff;
}
.dashboard-layout {
  display: flex;
  gap: 20px;
}
.sidebar-column {
  width: 20%;
}
.main-content {
  flex: 1;
  margin-right: 10px;
}
.content-wrapper {
  margin-top: 40px;
}

/* Navigation Tabs Styles */
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

/* Main chart styling */
#chart {
  margin-top: 24px;
}
</style>
