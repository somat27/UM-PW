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

          <div class="stats-search-row">
            <StatisticsGridAuditorias :labels="filteredIndices.map(i => localities[i])"
              :values="filteredIndices.map(i => dataValues[i])" />
            <div class="search-section inline">
              <div class="search-input">
                <input type="text" v-model="searchQuery" placeholder="Pesquisar Localidade..."
                  class="search-container" />
              </div>
            </div>
          </div>

          <div id="chart">
            <apexchart type="bar" height="350" :options="chartOptions" :series="series" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import NavigationList from '@/components/NavigationList.vue';
import StatisticsGridAuditorias from '@/components/StatisticsGridAuditorias.vue';

export default {
  components: {
    NavigationList,
    StatisticsGridAuditorias,
    apexchart: VueApexCharts
  },
  setup() {
    const activeTab = ref('auditorias');
    const searchQuery = ref('');

    const localities = ['Lisboa', 'Porto', 'Coimbra', 'Faro', 'Braga'];
    const dataValues = [21, 22, 10, 28, 16];

    const filteredIndices = computed(() => {
      if (!searchQuery.value) return localities.map((_, i) => i);
      return localities
        .map((loc, idx) => ({ loc, idx }))
        .filter(item =>
          item.loc.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
        .map(item => item.idx);
    });

    const series = computed(() => [
      { data: filteredIndices.value.map(i => dataValues[i]) }
    ]);
    const chartOptions = computed(() => ({
      chart: { height: 350, type: 'bar' },
      plotOptions: { bar: { columnWidth: '45%', distributed: true } },
      dataLabels: { enabled: false },
      xaxis: { categories: filteredIndices.value.map(i => localities[i]) }
    }));

    const onSearch = () => { };

    return {
      activeTab,
      searchQuery,
      localities,
      dataValues,
      filteredIndices,
      series,
      chartOptions,
      onSearch
    };
  }
};
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  gap: 20px;
}

.sidebar-column {
  width: 20%;
}

.main-content {
  flex: 1;
}

.content-wrapper {
  margin-top: 40px;
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

.search-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.search-input {
  position: relative;
}

.search-container {
  padding: 8px 40px 8px 12px;
  border: 1px solid #13c2c2;
  border-radius: 4px;
  width: 200px;
}

.search-button {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  cursor: pointer;
}

.stats-search-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  /* ajusta conforme seu espaçamento */
  padding-right: 20px;
}

.search-section.inline {
  margin: 0;
  /* remove margin-bottom original */
  margin-right: 16px;
  /* margem extra à direita do input */
}
</style>
