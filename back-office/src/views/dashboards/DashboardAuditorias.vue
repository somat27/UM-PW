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
            <StatisticsGridAuditorias :labels="filteredLabels" :values="filteredValues" />
            <div class="search-section inline">
              <div class="search-input">
                <input type="text" v-model="searchQuery" placeholder="Pesquisar Localidade..."
                  class="search-container" />
              </div>
            </div>
          </div>

          <div id="chart">
            <apexchart type="bar" :options="chartOptions" :series="series" height="350" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase.js';
import StatisticsGridAuditorias from '@/components/StatisticsGridAuditorias.vue';
import NavigationList from '@/components/NavigationList.vue';

const activeTab = ref('auditorias');

const searchQuery = ref('');
const contagem = ref({});
const cache = {};

async function buscarCidade(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'MeuAppUniversidade/1.0 (email@exemplo.com)' }
  });
  if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
  const data = await res.json();
  console.log(data)
  const address = data.address || {};
  return address.city || address.town || address.village || 'Desconhecida';
}

async function buscarCidadeComCache(lat, lon) {
  const key = `${lat},${lon}`;
  if (cache[key]) return cache[key];
  try {
    const city = await buscarCidade(lat, lon);
    cache[key] = city;
    return city;
  } catch (err) {
    console.error('Erro geocodificação', err);
    return 'Desconhecida';
  }
}

onMounted(() => {
  const colRef = collection(db, 'auditorias');
  onSnapshot(colRef, async snapshot => {
    const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    const novo = {};
    for (const doc of docs) {
      const lat = doc.coordenadas.latitude;
      const lon = doc.coordenadas.longitude;
      const cidade = await buscarCidadeComCache(lat, lon);
      novo[cidade] = (novo[cidade] || 0) + 1;
    }
    contagem.value = novo;
  });
});

const localities = computed(() => Object.keys(contagem.value));
const dataValues = computed(() => Object.values(contagem.value));

const filteredIndices = computed(() => {
  return localities.value
    .map((loc, idx) => ({ loc, idx }))
    .filter(item =>
      !searchQuery.value ||
      item.loc.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .map(item => item.idx);
});

const filteredLabels = computed(() => filteredIndices.value.map(i => localities.value[i]));
const filteredValues = computed(() => filteredIndices.value.map(i => dataValues.value[i]));

const series = computed(() => [
  {
    name: 'Auditorias',
    data: filteredValues.value
  }
]);
const chartOptions = computed(() => ({
  xaxis: { categories: filteredLabels.value },
  chart: { id: 'auditorias-por-cidade' },
  dataLabels: { enabled: false }
}));
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

input {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #ccc;
}
</style>
