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

          <div class="filters-row">
            <select v-model="selectedCity" class="filter-select">
              <option v-for="loc in localities" :key="loc" :value="loc">
                {{ loc }}
              </option>
            </select>

            <div class="filter-week-wrapper">
              <input type="week" v-model="selectedWeek" class="filter-week" />
            </div>
          </div>

          <StatisticsGridOcorrencia :cards="weeklyCards" />

          <div id="chart">
            <apexchart type="area" height="350" :options="chartOptions" :series="series" />
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
import StatisticsGridOcorrencia from '@/components/StatisticsGridOcorrencia.vue';

// Exemplo de base de dados diária
// Em produção, substitui por fetch/API
const rawData = [
  // cada entrada: { date: '2025-04-14', city: 'Lisboa', total: 5, resolved: 4 }
  { date: '2025-04-21', city: 'Lisboa', total: 5, resolved: 4 },
  { date: '2025-04-22', city: 'Lisboa', total: 6, resolved: 5 },
  // ... mais dias e cidades ...
];

function isoWeekDates(weekString) {
  // Recebe "YYYY-WW", devolve array de 7 datas 'YYYY-MM-DD'
  const [year, wk] = weekString.split('-W').map(Number);
  // calcula o 4º de janeiro desse ano (sempre na semana 1 ISO)
  const jan4 = new Date(Date.UTC(year, 0, 4));
  // quantos dias para início de semana ISO
  const dayOfWeek = jan4.getUTCDay() || 7; // domingo→7
  const week1Start = new Date(Date.UTC(
    year, 0, 4 - (dayOfWeek - 1)
  ));
  // agora avança (wk - 1) * 7 dias
  const start = new Date(week1Start);
  start.setUTCDate(start.getUTCDate() + (wk - 1) * 7);
  // gera 7 dias
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

// Dentro do setup() ou fora dele, antes de setup():
function getCurrentISOWeek() {
  const now = new Date();
  // pega só a data UTC (evita off‑by‑one por fuso)
  const date = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  ));
  // ISO semana: calcula data do 4 de janeiro e deriva semana
  const dayNum = date.getUTCDay() || 7; // Domingo→7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    (((date - yearStart) / 86400000) + 1) / 7
  );
  const weekStr = String(weekNo).padStart(2, '0');
  return `${date.getUTCFullYear()}-W${weekStr}`;
}

export default {
  components: {
    NavigationList,
    StatisticsGridOcorrencia,
    apexchart: VueApexCharts
  },
  setup() {
    const activeTab = ref('ocorrencias');

    const localities = ['Lisboa', 'Porto', 'Coimbra', 'Faro', 'Braga'];
    const selectedCity = ref(localities[0]);
    const selectedWeek = ref(getCurrentISOWeek());

    // datas da semana ISO escolhida
    const weekDates = computed(() =>
      selectedWeek.value ? isoWeekDates(selectedWeek.value) : []
    );

    // filtra rawData pela cidade e pela semana
    const weeklyData = computed(() =>
      rawData.filter(item =>
        item.city === selectedCity.value &&
        weekDates.value.includes(item.date)
      )
    );

    // cards: total, resolved, dia com max/min taxa
    const weeklyCards = computed(() => {
      if (!weeklyData.value.length) {
        return [
          { title: 'Total Confirmadas', value: 0 },
          { title: 'Total Resolvidas', value: 0 },
          { title: 'Maior taxa (dia)', value: '–' },
          { title: 'Menor taxa (dia)', value: '–' }
        ];
      }
      const total = weeklyData.value.reduce((sum, d) => sum + d.total, 0);
      const resolved = weeklyData.value.reduce((sum, d) => sum + d.resolved, 0);
      // calcula taxa diária e encontra max/min
      const rates = weeklyData.value.map(d => ({
        date: d.date,
        pct: Math.round(d.resolved / d.total * 100)
      }));
      const max = rates.reduce((a, b) => b.pct > a.pct ? b : a);
      const min = rates.reduce((a, b) => b.pct < a.pct ? b : a);
      return [
        { title: 'Total de Ocorrências Confirmadas', value: total },
        { title: 'Total de Ocorrências Resolvidas', value: resolved },
        { title: 'Dia com a maior taxa de resolução', value: `${max.date} (${max.pct}%)` },
        { title: 'Dia com a menor taxa de resolução', value: `${min.date} (${min.pct}%)` }
      ];
    });

    // gráfico: duas séries ao longo dos dias da semana
    const series = computed(() => [
      {
        name: 'Total', data: weekDates.value.map(d => {
          const rec = weeklyData.value.find(x => x.date === d);
          return rec ? rec.total : 0;
        })
      },
      {
        name: 'Resolvidas', data: weekDates.value.map(d => {
          const rec = weeklyData.value.find(x => x.date === d);
          return rec ? rec.resolved : 0;
        })
      }
    ]);

    const chartOptions = computed(() => ({
      chart: { type: 'area', height: 350 },
      stroke: { curve: 'smooth' },
      xaxis: { categories: weekDates.value },
      dataLabels: { enabled: false },
      legend: { position: 'top' },
      tooltip: { x: { format: 'dd/MM' } }
    }));

    return {
      activeTab,
      localities,
      selectedCity,
      selectedWeek,
      weeklyCards,
      series,
      chartOptions
    };
  }
};
</script>

<style scoped>
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

/* Mesmos estilos de DashboardOcorrencia.vue */
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
  padding: 8px 12px;
  border: 1px solid #13c2c2;
  border-radius: 4px;
  width: 200px;
}

.filters-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: center;
}

/* Dropdown da cidade */
.filter-select {
  padding: 8px 12px;
  border: 1px solid #13c2c2;
  border-radius: 4px;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-select:hover,
.filter-select:focus {
  border-color: #1890ff;
  outline: none;
}

/* Wrapper e label para o week-picker */
.filter-week-wrapper {
  display: flex;
  flex-direction: column;
}

.filter-week-label {
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 4px;
}

/* Input type=week */
.filter-week {
  padding: 8px 12px;
  border: 1px solid #13c2c2;
  border-radius: 4px;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s;
  /* forçar largura consistente */
  width: 160px;
}

.filter-week:hover,
.filter-week:focus {
  border-color: #1890ff;
  outline: none;
}

select,
input[type="week"] {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
